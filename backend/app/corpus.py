"""One searchable collection built from every legal source we hold."""
import json
from pathlib import Path

from .articles import load_articles

ACTS_FILE = Path(__file__).resolve().parent.parent / "data" / "bare_acts.json"
CASES_FILE = Path(__file__).resolve().parent.parent / "data" / "cases.json"


def load_acts() -> list[dict]:
    return json.loads(ACTS_FILE.read_text(encoding="utf-8"))


def get_section(act: str, section: str) -> dict | None:
    act, section = act.strip().upper(), section.strip().upper()
    return next((s for s in load_acts() if s["act"] == act and s["section"] == section), None)


def search_sections(act: str = "", q: str = "") -> list[dict]:
    act, q = act.strip().upper(), q.strip().lower()
    out = []
    for s in load_acts():
        if act and s["act"] != act:
            continue
        hay = " ".join(
            [s["section"], s["title_en"], s["title_hi"], s["summary_en"], s["summary_hi"], s["replaces"], *s["tags"]]
        ).lower()
        if not q or q in hay:
            out.append(s)
    return out


def load_cases() -> list[dict]:
    return json.loads(CASES_FILE.read_text(encoding="utf-8"))


def get_case(case_id: str) -> dict | None:
    case_id = case_id.strip().upper()
    return next((c for c in load_cases() if c["id"].upper() == case_id), None)


def search_cases(q: str = "") -> list[dict]:
    q = q.strip().lower()
    out = []
    for c in load_cases():
        hay = " ".join(
            [c["name"], str(c["year"]), c["citation"], c["title_en"], c["title_hi"],
             c["summary_en"], c["summary_hi"], *c["tags"]]
        ).lower()
        if not q or q in hay:
            out.append(c)
    return out


def load_corpus() -> list[dict]:
    docs = []
    for a in load_articles():
        docs.append({
            **a,
            "kind": "constitution",
            "ref": f"Article {a['number']}",
            "ref_hi": f"अनुच्छेद {a['number']}",
            "verified": a.get("verified", False),
        })
    for s in load_acts():
        docs.append({
            **s,
            "kind": "act",
            "number": s["section"],
            "ref": f"{s['act']} Section {s['section']}",
            "ref_hi": f"{s['act']} धारा {s['section']}",
            "verified": s.get("verified", False),
        })
    for c in load_cases():
        docs.append({
            **c,
            "kind": "case",
            "number": c["citation"],
            "ref": f"{c['name']} ({c['year']})",
            "ref_hi": f"{c['name']} ({c['year']})",
            "verified": c.get("verified", False),
        })
    return docs
