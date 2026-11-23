from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_ask_finds_provision_with_source():
    data = client.get("/api/ask", params={"q": "police arrest ke baad vakil"}).json()
    assert data["found"] is True
    assert data["results"][0]["number"] == "22"
    assert data["results"][0]["source"].startswith("https://")
    assert "not legal advice" in data["disclaimer"]


def test_ask_does_not_invent_when_nothing_matches():
    data = client.get("/api/ask", params={"q": "qwertyzzz"}).json()
    assert data["found"] is False
    assert data["results"] == []


def test_ask_validates_short_query():
    assert client.get("/api/ask", params={"q": "a"}).status_code == 422
