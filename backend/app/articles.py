import json
from pathlib import Path

DATA_FILE = Path(__file__).resolve().parent.parent / "data" / "articles.json"


def load_articles() -> list[dict]:
    return json.loads(DATA_FILE.read_text(encoding="utf-8"))


def get_article(number: str) -> dict | None:
    number = number.strip().upper()
    return next((a for a in load_articles() if a["number"].upper() == number), None)


def search_articles(query: str) -> list[dict]:
    q = query.strip().lower()
    if not q:
        return load_articles()
    results = []
    for a in load_articles():
        haystack = " ".join(
            [a["number"], a["title_en"], a["title_hi"], a["summary_en"], a["summary_hi"], *a["tags"]]
        ).lower()
        if q in haystack:
            results.append(a)
    return results
