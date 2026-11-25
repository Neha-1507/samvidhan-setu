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


def _tags(case: dict) -> set[str]:
    return {t.lower() for t in case["tags"]} - GENERIC_TAGS


def bench_note(a: dict, b: dict) -> str | None:
    x, y = a.get("bench_size"), b.get("bench_size")
    if not x or not y:
        return None
    if x == y:
        return f"Both were decided by benches of {x} judges."
    big, small = (a, b) if x > y else (b, a)
    return (
        f"{big['name']} was decided by a larger bench ({big['bench_size']} judges) than "
        f"{small['name']} ({small['bench_size']} judges). If the two conflict, the larger bench's view generally prevails."
    )


def compare_cases(a: dict, b: dict) -> dict:
    ta, tb = _tags(a), _tags(b)
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
        "bench_note": bench_note(a, b),
        "binding_note": BINDING,
        "caution": CAUTION,
    }
