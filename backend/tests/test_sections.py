from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_list_all_sections():
    assert len(client.get("/api/sections").json()) >= 20


def test_filter_by_act():
    data = client.get("/api/sections", params={"act": "bnss"}).json()
    assert data and all(s["act"] == "BNSS" for s in data)


def test_search_anticipatory_bail():
    data = client.get("/api/sections", params={"q": "anticipatory"}).json()
    assert any(s["id"] == "BNSS-482" for s in data)


def test_old_law_equivalent_is_searchable():
    data = client.get("/api/sections", params={"q": "IPC 302"}).json()
    assert any(s["id"] == "BNS-103" for s in data)


def test_section_detail_and_404():
    r = client.get("/api/sections/BNSS/482")
    assert r.status_code == 200 and r.json()["replaces"] == "CrPC 438"
    assert client.get("/api/sections/BNS/99999").status_code == 404


def test_every_section_has_source_and_verified_flag():
    for s in client.get("/api/sections").json():
        assert s["source"].startswith("https://")
        assert isinstance(s["verified"], bool)
