"""Merge a CSV of Bare Act sections into data/bare_acts.json.

Usage (from backend/):
    python scripts/import_acts.py data/bare_acts_seed.csv

Columns: act, section, title_en, title_hi, summary_en, summary_hi, replaces, tags, source
- act is one of BNS, BNSS, BSA (add more in ACTS below)
- tags are separated by ';'
- new or changed rows are saved with verified=false until you check them
"""
import csv
import json
import re
import sys
from pathlib import Path

DATA_FILE = Path(__file__).resolve().parent.parent / "data" / "bare_acts.json"
REQUIRED = ["act", "section", "title_en", "title_hi", "summary_en", "summary_hi", "source"]
ACTS = {
    "BNS": ("Bharatiya Nyaya Sanhita, 2023", "भारतीय न्याय संहिता, 2023"),
    "BNSS": ("Bharatiya Nagarik Suraksha Sanhita, 2023", "भारतीय नागरिक सुरक्षा संहिता, 2023"),
    "BSA": ("Bharatiya Sakshya Adhiniyam, 2023", "भारतीय साक्ष्य अधिनियम, 2023"),
}


def sort_key(item: dict):
    m = re.match(r"(\d+)([A-Za-z]*)", item["section"])
    num = (int(m.group(1)), m.group(2).upper()) if m else (10**6, item["section"])
    return (list(ACTS).index(item["act"]), num)


def read_rows(path: Path) -> list[dict]:
    rows = []
    with path.open(encoding="utf-8-sig", newline="") as f:
        for line_no, row in enumerate(csv.DictReader(f), start=2):
            row = {k: (v or "").strip() for k, v in row.items()}
            missing = [c for c in REQUIRED if not row.get(c)]
            if missing:
                raise ValueError(f"Line {line_no}: missing {', '.join(missing)}")
            row["act"] = row["act"].upper()
            if row["act"] not in ACTS:
                raise ValueError(f"Line {line_no}: unknown act {row['act']} (use {', '.join(ACTS)})")
            row["act_name_en"], row["act_name_hi"] = ACTS[row["act"]]
            row["id"] = f"{row['act']}-{row['section'].upper()}"
            row["section"] = row["section"].upper()
            row["tags"] = [t.strip() for t in row.get("tags", "").split(";") if t.strip()]
            row["verified"] = False
            rows.append(row)
    return rows


def main():
    if len(sys.argv) != 2:
        sys.exit("Usage: python scripts/import_acts.py <file.csv>")
    existing = {}
    if DATA_FILE.exists():
        existing = {x["id"]: x for x in json.loads(DATA_FILE.read_text(encoding="utf-8"))}
    added = updated = 0
    for row in read_rows(Path(sys.argv[1])):
        if row["id"] in existing:
            updated += 1
        else:
            added += 1
        existing[row["id"]] = row
    merged = sorted(existing.values(), key=sort_key)
    DATA_FILE.write_text(json.dumps(merged, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Done. added={added} updated={updated} total={len(merged)}")


if __name__ == "__main__":
    main()
