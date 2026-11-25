"""Side-by-side comparison of two cases from our records. Pure Python.

It compares what our summaries say (issue, provisions, tags, bench size, year).
It does NOT decide whether one case overruled or limited the other.
"""
GENERIC_TAGS = {"landmark"}

CAUTION = (
    "This compares the summaries in this app. It does not say whether one judgment overruled, "
    "limited or distinguished the other. Read the full judgments and later cases before relying on either."
)
BINDING = (
    "Both are Supreme Court judgments. The legal principles they lay down bind all courts in India "
    "(Article 141 of the Constitution)."
)


CAUTION_HI = (
    "यह तुलना इस ऐप के सारांशों पर आधारित है। यह नहीं बताती कि एक फैसले ने दूसरे को पलटा, सीमित किया या उससे अलग किया "
    "या नहीं। किसी पर भरोसा करने से पहले पूरे फैसले और बाद के मामले पढ़ें।"
)
BINDING_HI = (
    "दोनों सर्वोच्च न्यायालय के फैसले हैं। इनमें तय किए गए कानूनी सिद्धांत भारत की सभी अदालतों पर बाध्यकारी हैं "
    "(संविधान का अनुच्छेद 141)।"
)


def _tags(case: dict) -> set[str]:
    return {t.lower() for t in case["tags"]} - GENERIC_TAGS


def bench_notes(a: dict, b: dict) -> tuple[str | None, str | None]:
    """(English, Hindi) note about bench sizes, or (None, None) if either size is unknown."""
    x, y = a.get("bench_size"), b.get("bench_size")
    if not x or not y:
        return None, None
    if x == y:
        return f"Both were decided by benches of {x} judges.", f"दोनों {x} न्यायाधीशों की पीठ ने तय किए।"
    big, small = (a, b) if x > y else (b, a)
    en = (
        f"{big['name']} was decided by a larger bench ({big['bench_size']} judges) than "
        f"{small['name']} ({small['bench_size']} judges). If the two conflict, the larger bench's view generally prevails."
    )
    hi = (
        f"{big['name']} को बड़ी पीठ ({big['bench_size']} न्यायाधीश) ने तय किया, जबकि {small['name']} को "
        f"{small['bench_size']} न्यायाधीशों की पीठ ने। टकराव होने पर आम तौर पर बड़ी पीठ का मत प्रबल होता है।"
    )
    return en, hi


def bench_note(a: dict, b: dict) -> str | None:
    return bench_notes(a, b)[0]


def compare_cases(a: dict, b: dict) -> dict:
    ta, tb = _tags(a), _tags(b)
    note_en, note_hi = bench_notes(a, b)
    earlier = None
    if a["year"] != b["year"]:
        earlier = a["id"] if a["year"] < b["year"] else b["id"]
    return {
        "a": a,
        "b": b,
        "shared_provisions": [p for p in a["provisions"] if p in b["provisions"]],
        "shared_tags": sorted(ta & tb),
        "only_a_tags": sorted(ta - tb),
        "only_b_tags": sorted(tb - ta),
        "earlier": earlier,
        "years_apart": abs(a["year"] - b["year"]),
        "bench_note": note_en,
        "bench_note_hi": note_hi,
        "binding_note": BINDING,
        "binding_note_hi": BINDING_HI,
        "caution": CAUTION,
        "caution_hi": CAUTION_HI,
    }
