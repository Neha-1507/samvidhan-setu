"""Finds legal references in pasted text and maps them to our database.

Rule-based on purpose: it only reports what the text literally cites, so it
cannot invent a section. Pure Python, no web framework.
"""
import re
from datetime import date

NUM = r"\d{1,3}[A-Za-z]?"
NUMLIST = rf"{NUM}(?:\s*(?:,|/|&|and)\s*{NUM})*"
END = r"(?![0-9A-Za-z])"
LAW = (
    r"bnss|bns|bsa|ipc|i\.p\.c\.?|indian penal code|crpc|cr\.p\.c\.?|"
    r"code of criminal procedure|(?:indian )?evidence act"
)

SECTION_FIRST = re.compile(
    rf"(?<![A-Za-z])(?:sections?|secs?\.?|u/ss?|s\.)\s*({NUMLIST}){END}\s*(?:of\s+(?:the\s+)?)?({LAW})(?![A-Za-z])",
    re.I,
)
LAW_FIRST = re.compile(
    rf"(?<![A-Za-z])({LAW})\s*(?:sections?|secs?\.?|s\.)?\s*({NUMLIST}){END}", re.I
)
CHAIN = re.compile(rf"\s*(?:,|and|&)\s*({NUMLIST}){END}\s*(?:of\s+(?:the\s+)?)?({LAW})(?![A-Za-z])", re.I)
ARTICLE = re.compile(rf"(?<![A-Za-z])(?:articles?|art\.?)\s*({NUMLIST}){END}", re.I)
DATE = re.compile(r"(?<!\d)(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})(?!\d)")
FIR_NO = re.compile(r"\bF\.?I\.?R\.?\s*(?:No\.?|Number|#)?\s*[:\-]?\s*(\d{1,6}\s*/\s*\d{2,4})", re.I)

LAW_NAMES = {
    "BNS": "BNS", "BNSS": "BNSS", "BSA": "BSA",
    "IPC": "IPC", "I.P.C": "IPC", "INDIAN PENAL CODE": "IPC",
    "CRPC": "CrPC", "CR.P.C": "CrPC", "CODE OF CRIMINAL PROCEDURE": "CrPC",
    "EVIDENCE ACT": "Evidence Act", "INDIAN EVIDENCE ACT": "Evidence Act",
}
NEW_LAWS = {"BNS", "BNSS", "BSA"}
CUTOVER = date(2024, 7, 1)  # BNS, BNSS and BSA came into force on this date

DISCLAIMER = (
    "Automatic reading of pasted text. It can miss or misread things. "
    "Check every point against the original document and consult an advocate."
)


def normalize_law(token: str) -> str | None:
    key = re.sub(r"\s+", " ", token.strip().upper()).rstrip(".")
    return LAW_NAMES.get(key)


def parse_replaces(text: str) -> set[tuple[str, str]]:
    """'CrPC 41, 41A' -> {('CrPC','41'), ('CrPC','41A')}"""
    out = set()
    for m in re.finditer(r"(IPC|CrPC|Evidence Act)\s+([0-9A-Za-z,/\s]+)", text or ""):
        for n in re.findall(NUM, m.group(2)):
            out.add((m.group(1), n.upper()))
    return out


def _card(doc: dict) -> dict:
    keys = ["ref", "ref_hi", "title_en", "title_hi", "summary_en", "summary_hi", "source", "verified", "replaces"]
    return {k: doc.get(k) for k in keys}


def build_indexes(corpus: list[dict]):
    old, new, art = {}, {}, {}
    for d in corpus:
        if d["kind"] == "act":
            new.setdefault((d["act"], d["section"].upper()), []).append(d)
            for key in parse_replaces(d.get("replaces", "")):
                old.setdefault(key, []).append(d)
        elif d["kind"] == "constitution":
            art.setdefault(d["number"].upper(), []).append(d)
    return old, new, art


def lookup(law: str, number: str, corpus: list[dict], indexes=None) -> dict:
    old, new, art = indexes or build_indexes(corpus)
    number = number.upper()
    if law == "ARTICLE":
        kind, docs, label = "constitution", art.get(number, []), f"Article {number}"
    elif law in NEW_LAWS:
        kind, docs, label = "new", new.get((law, number), []), f"{law} {number}"
    else:
        kind, docs, label = "old", old.get((law, number), []), f"{law} {number}"
    return {"mention": label, "law": law, "number": number, "type": kind, "matches": [_card(d) for d in docs]}


def find_mentions(text: str) -> list[tuple[str, str]]:
    found, seen = [], set()

    def add(law, number):
        key = (law, number.upper())
        if key not in seen:
            seen.add(key)
            found.append(key)

    for m in SECTION_FIRST.finditer(text):
        law = normalize_law(m.group(2))
        if law:
            for n in re.findall(NUM, m.group(1)):
                add(law, n)
        # "Section 302 IPC and 420 IPC": keep reading while another "<number> <law>" follows
        pos = m.end()
        while (c := CHAIN.match(text, pos)):
            chained = normalize_law(c.group(2))
            if chained:
                for n in re.findall(NUM, c.group(1)):
                    add(chained, n)
            pos = c.end()
    for m in LAW_FIRST.finditer(text):
        law = normalize_law(m.group(1))
        if law:
            for n in re.findall(NUM, m.group(2)):
                add(law, n)
    for m in ARTICLE.finditer(text):
        for n in re.findall(NUM, m.group(1)):
            add("ARTICLE", n)
    return found


def find_dates(text: str) -> list[dict]:
    out, seen = [], set()
    for d, mo, y in DATE.findall(text):
        try:
            iso = date(int(y), int(mo), int(d))
        except ValueError:
            continue
        if iso not in seen:
            seen.add(iso)
            out.append({"text": f"{d}/{mo}/{y}", "iso": iso.isoformat()})
    return out


def analyze(text: str, corpus: list[dict]) -> dict:
    indexes = build_indexes(corpus)
    mentions = [lookup(law, n, corpus, indexes) for law, n in find_mentions(text)]
    dates = find_dates(text)
    fir_numbers = list(dict.fromkeys(re.sub(r"\s+", "", x) for x in FIR_NO.findall(text)))

    warnings = []
    cites_old = any(m["type"] == "old" for m in mentions)
    if cites_old and any(date.fromisoformat(d["iso"]) >= CUTOVER for d in dates):
        warnings.append(
            "This text cites IPC/CrPC/Evidence Act but also has a date on or after 1 July 2024. "
            "Offences committed from that date come under BNS/BNSS/BSA, so check the date of the offence."
        )
    return {
        "mentions": mentions,
        "unmatched": [m["mention"] for m in mentions if not m["matches"]],
        "dates": dates,
        "fir_numbers": fir_numbers,
        "warnings": warnings,
        "note": "BNS, BNSS and BSA replaced IPC, CrPC and the Evidence Act for offences on or after 1 July 2024.",
        "disclaimer": DISCLAIMER,
    }
