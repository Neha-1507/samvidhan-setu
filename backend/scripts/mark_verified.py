"""Mark records as verified after you compared them with the official text.

Usage (from backend/):
    python scripts/mark_verified.py articles 21 22 21A
    python scripts/mark_verified.py acts BNSS-35 BNS-103
    python scripts/mark_verified.py cases DKBASU-1997
"""
import json
import sys
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "data"


def main():
    if len(sys.argv) < 3 or sys.argv[1] not in ("articles", "acts", "cases"):
        sys.exit(__doc__)
    kind, wanted = sys.argv[1], {w.upper() for w in sys.argv[2:]}
    path = DATA / {"articles": "articles.json", "acts": "bare_acts.json", "cases": "cases.json"}[kind]
    items = json.loads(path.read_text(encoding="utf-8"))
    key = "number" if kind == "articles" else "id"
    found = set()
    for it in items:
        if it[key].upper() in wanted:
            it["verified"] = True
            found.add(it[key].upper())
    path.write_text(json.dumps(items, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Marked verified: {sorted(found)}")
    if wanted - found:
        print(f"Not found: {sorted(wanted - found)}")


if __name__ == "__main__":
    main()
