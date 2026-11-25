from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_ask_finds_provision_with_source():
    data = client.get("/api/ask", params={"q": "police arrest ke baad vakil"}).json()
    assert data["found"] is True
    assert "Article 22" in [r["ref"] for r in data["results"]]
    assert all(r["source"].startswith("https://") for r in data["results"])
    assert "not legal advice" in data["disclaimer"]


def test_ask_returns_bare_act_with_old_law_reference():
    data = client.get("/api/ask", params={"q": "anticipatory bail"}).json()
    top = data["results"][0]
    assert top["ref"] == "BNSS Section 482"
    assert top["replaces"] == "CrPC 438"
    assert top["verified"] is False


def test_ask_does_not_invent_when_nothing_matches():
    data = client.get("/api/ask", params={"q": "qwertyzzz"}).json()
    assert data["found"] is False
    assert data["results"] == []


def test_ask_validates_short_query():
    assert client.get("/api/ask", params={"q": "a"}).status_code == 422


def test_ask_returns_case_law_with_citation():
    data = client.get("/api/ask", params={"q": "custody torture guidelines"}).json()
    top = data["results"][0]
    assert top["kind"] == "case" and top["citation"] == "(1997) 1 SCC 416"


def test_ask_results_carry_the_act_name_for_library_links():
    data = client.get("/api/ask", params={"q": "anticipatory bail"}).json()
    top = data["results"][0]
    assert top["kind"] == "act" and top["act"] == "BNSS"
