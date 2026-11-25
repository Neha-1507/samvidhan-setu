from fastapi.testclient import TestClient

from app.corpus import load_corpus, load_glossary
from app.main import app

client = TestClient(app)


def test_terms_are_complete_and_unique():
    terms = load_glossary()
    assert len(terms) >= 25
    for t in terms:
        for f in ["slug", "term_en", "term_hi", "meaning_en", "meaning_hi"]:
            assert t.get(f), f"{t.get('slug')} missing {f}"
    slugs = [t["slug"] for t in terms]
    assert len(slugs) == len(set(slugs))


def test_related_references_exist_in_the_database():
    refs = {d["ref"] for d in load_corpus()}
    for t in load_glossary():
        for r in t["related"]:
            assert r in refs, f"{t['slug']} links to unknown provision: {r}"


def test_glossary_is_sorted_and_searchable():
    names = [t["term_en"].lower() for t in client.get("/api/glossary").json()]
    assert names == sorted(names)
    assert any(t["slug"] == "bail" for t in client.get("/api/glossary", params={"q": "bail"}).json())


def test_glossary_searches_hindi():
    assert any(t["slug"] == "warrant" for t in client.get("/api/glossary", params={"q": "वारंट"}).json())
