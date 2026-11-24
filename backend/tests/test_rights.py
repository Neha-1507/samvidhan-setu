from fastapi.testclient import TestClient

from app.corpus import load_corpus, load_rights
from app.main import app

client = TestClient(app)
REQUIRED = ["slug", "title_en", "title_hi", "intro_en", "intro_hi", "steps", "related", "helplines"]


def test_required_fields_and_unique_slugs():
    topics = load_rights()
    for t in topics:
        for f in REQUIRED:
            assert t.get(f), f"{t.get('slug')} missing {f}"
        for step in t["steps"]:
            assert step["en"] and step["hi"]
    slugs = [t["slug"] for t in topics]
    assert len(slugs) == len(set(slugs))


def test_every_related_reference_exists_in_the_database():
    refs = {d["ref"] for d in load_corpus()}
    for t in load_rights():
        for ref in t["related"]:
            assert ref in refs, f"{t['slug']} links to unknown provision: {ref}"


def test_helpline_numbers_are_digits():
    for t in load_rights():
        for h in t["helplines"]:
            assert h["number"].isdigit()


def test_api_list_detail_404():
    assert len(client.get("/api/rights").json()) >= 6
    assert client.get("/api/rights/arrest").json()["slug"] == "arrest"
    assert client.get("/api/rights/nope").status_code == 404
