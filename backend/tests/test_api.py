from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_list_articles():
    r = client.get("/api/articles")
    assert r.status_code == 200
    assert len(r.json()) >= 1


def test_search_by_number_and_hindi():
    assert any(a["number"] == "21" for a in client.get("/api/articles?q=21").json())
    assert any(a["number"] == "21A" for a in client.get("/api/articles?q=शिक्षा").json())


def test_article_detail_case_insensitive():
    r = client.get("/api/articles/21a")
    assert r.status_code == 200
    assert r.json()["number"] == "21A"


def test_article_not_found():
    assert client.get("/api/articles/9999").status_code == 404
