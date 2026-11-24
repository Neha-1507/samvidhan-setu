from fastapi.testclient import TestClient

from app.corpus import load_cases
from app.main import app

client = TestClient(app)
REQUIRED = ["id", "name", "year", "court", "citation", "title_en", "title_hi", "summary_en", "summary_hi", "tags", "source"]


def test_all_cases_have_required_fields():
    for c in load_cases():
        for f in REQUIRED:
            assert c.get(f), f"{c.get('id')} missing {f}"
        assert c["source"].startswith("https://")


def test_case_ids_are_unique():
    ids = [c["id"] for c in load_cases()]
    assert len(ids) == len(set(ids))


def test_list_and_search():
    assert len(client.get("/api/cases").json()) >= 8
    found = client.get("/api/cases", params={"q": "privacy"}).json()
    assert any(c["id"] == "PUTTASWAMY-2017" for c in found)


def test_case_detail_and_404():
    r = client.get("/api/cases/dkbasu-1997")
    assert r.status_code == 200 and r.json()["year"] == 1997
    assert client.get("/api/cases/NOPE").status_code == 404
