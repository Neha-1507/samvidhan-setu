"""Builds quiz questions from the database. Pure Python, no web framework.

Answers always come from our own records, so a question can never contradict
what the app shows elsewhere. Pass `seed` to get the same quiz again.
"""
import random

KINDS = ("all", "constitution", "act", "case")


def _option(doc: dict) -> dict:
    return {"en": doc["ref"], "hi": doc["ref_hi"]}


def _finish(qtype, doc, q_en, q_hi, options, answer, exp_en, exp_hi):
    return {
        "id": f"{qtype}:{doc['ref']}",
        "type": qtype,
        "kind": doc["kind"],
        "question_en": q_en,
        "question_hi": q_hi,
        "options": options,
        "answer_index": answer,
        "explanation_en": exp_en,
        "explanation_hi": exp_hi,
        "source": doc["source"],
        "verified": doc.get("verified", False),
    }


def _shuffled(correct, wrong, rng):
    items = [correct] + wrong
    rng.shuffle(items)
    return items, items.index(correct)


def _make_title(doc, docs, rng):
    pool = [x for x in docs if x["kind"] == doc["kind"] and x["ref"] != doc["ref"] and x["title_en"] != doc["title_en"]]
    if len(pool) < 3:
        return None
    items, ans = _shuffled(doc, rng.sample(pool, 3), rng)
    return _finish(
        "title", doc,
        f'Which provision is titled "{doc["title_en"]}"?',
        f'कौन सा प्रावधान इस शीर्षक वाला है: "{doc["title_hi"]}"?',
        [_option(x) for x in items], ans, doc["summary_en"], doc["summary_hi"],
    )


def _make_replaces(doc, docs, rng):
    if sum(1 for x in docs if x.get("replaces") == doc["replaces"]) != 1:
        return None
    pool = [x for x in docs if x["kind"] == "act" and x.get("replaces") and x["replaces"] != doc["replaces"]]
    if len(pool) < 3:
        return None
    items, ans = _shuffled(doc, rng.sample(pool, 3), rng)
    return _finish(
        "replaces", doc,
        f'Which section of the new criminal laws replaces {doc["replaces"]}?',
        f'{doc["replaces"]} की जगह नए आपराधिक कानूनों की कौन सी धारा आई?',
        [_option(x) for x in items], ans,
        f'{doc["ref"]}: {doc["title_en"]}', f'{doc["ref_hi"]}: {doc["title_hi"]}',
    )


def _make_case(doc, docs, rng):
    pool = [x for x in docs if x["kind"] == "case" and x["ref"] != doc["ref"] and x["title_en"] != doc["title_en"]]
    if len(pool) < 3:
        return None
    items, ans = _shuffled(doc, rng.sample(pool, 3), rng)
    return _finish(
        "case", doc,
        f'What did the Supreme Court decide in {doc["ref"]}?',
        f'{doc["ref_hi"]} में सर्वोच्च न्यायालय ने क्या निर्णय दिया?',
        [{"en": x["title_en"], "hi": x["title_hi"]} for x in items], ans,
        f'{doc["summary_en"]} {doc["citation"]}', f'{doc["summary_hi"]} {doc["citation"]}',
    )


MAKERS = {"title": _make_title, "replaces": _make_replaces, "case": _make_case}


def build_quiz(docs: list[dict], n: int = 5, kind: str = "all", seed: int | None = None) -> list[dict]:
    rng = random.Random(seed)
    candidates = []
    for d in docs:
        if kind != "all" and d["kind"] != kind:
            continue
        if d["kind"] in ("constitution", "act"):
            candidates.append(("title", d))
        if d["kind"] == "act" and d.get("replaces"):
            candidates.append(("replaces", d))
        if d["kind"] == "case":
            candidates.append(("case", d))
    rng.shuffle(candidates)

    out, used = [], set()
    for qtype, d in candidates:
        if len(out) >= n:
            break
        if d["ref"] in used:
            continue
        q = MAKERS[qtype](d, docs, rng)
        if q:
            out.append(q)
            used.add(d["ref"])
    return out
