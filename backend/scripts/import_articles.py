"""Merge a CSV of articles into data/articles.json.

Usage (from backend/):
    python scripts/import_articles.py data/new_articles_template.csv

- tags are separated by ';'
- an existing article number is updated, a new one is added
- output stays sorted: 14, 15, 19, 21, 21A, 22 ...
"""
import csv
import json
import re
import sys
from pathlib import Path

DATA_FILE = Path(__file__).resolve().parent.parent / "data" / "articles.json"
REQUIRED = ["number", "part", "title_en", "title_hi", "summary_en", "summary_hi", "source"]


def sort_key(article: dict):
    m = re.match(r"(\d+)([A-Za-z]*)", article["number"])
    return (int(m.group(1)), m.group(2).upper()) if m else (10**6, article["number"])


def read_rows(csv_path: Path) -> list[dict]:
    rows = []
    with csv_path.open(encoding="utf-8-sig", newline="") as f:
        for line_no, row in enumerate(csv.DictReader(f), start=2):
            missing = [c for c in REQUIRED if not (row.get(c) or "").strip()]
            if missing:
                raise ValueError(f"Line {line_no}: missing {', '.join(missing)}")
            row = {k: v.strip() for k, v in row.items()}
            row["number"] = row["number"].upper()
            row["tags"] = [t.strip() for t in row.get("tags", "").split(";") if t.strip()]
            row["verified"] = False
            rows.append(row)
    return rows


def main():
    if len(sys.argv) != 2:
        sys.exit("Usage: python scripts/import_articles.py <file.csv>")
    existing = {a["number"].upper(): a for a in json.loads(DATA_FILE.read_text(encoding="utf-8"))}
    added = updated = 0
    for row in read_rows(Path(sys.argv[1])):
        if row["number"] in existing:
            updated += 1
        else:
            added += 1
        existing[row["number"]] = row
    merged = sorted(existing.values(), key=sort_key)
    DATA_FILE.write_text(json.dumps(merged, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Done. added={added} updated={updated} total={len(merged)}")


if __name__ == "__main__":
    main()
