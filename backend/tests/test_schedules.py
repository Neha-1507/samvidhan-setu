from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_twelve_schedules():
    assert len(client.get("/api/schedules").json()) == 12


def test_schedule_seven():
    r = client.get("/api/schedules/7")
    assert r.status_code == 200
    assert "Concurrent" in r.json()["title_en"]


def test_schedule_not_found():
    assert client.get("/api/schedules/13").status_code == 404
