from fastapi.testclient import TestClient

from app.compare import compare_cases
from app.corpus import get_case
from app.main import app

client = TestClient(app)


def pair(a, b):
    return compare_cases(get_case(a), get_case(b))


def test_shared_provisions_and_order():
    r = pair("DKBASU-1997", "JOGINDER-1994")
    assert r["shared_provisions"] == ["Article 21", "Article 22"]
    assert r["earlier"] == "JOGINDER-1994" and r["years_apart"] == 3
    assert "arrest" in r["shared_tags"]


def test_larger_bench_note():
    note = pair("PUTTASWAMY-2017", "SHREYA-2015")["bench_note"]
    assert "Puttaswamy" in note and "9 judges" in note and "larger bench" in note


def test_no_bench_note_when_size_unknown():
    assert pair("JOGINDER-1994", "DKBASU-1997")["bench_note"] is None


def test_result_never_claims_overruling():
    r = pair("MANEKA-1978", "PUTTASWAMY-2017")
    assert "does not say whether one judgment overruled" in r["caution"]
    assert "Article 141" in r["binding_note"]


def test_api_compare_ok_and_errors():
    ok = client.get("/api/cases/compare", params={"a": "arnesh-2014", "b": "lalita-2014"})
    assert ok.status_code == 200 and ok.json()["earlier"] is None
    assert client.get("/api/cases/compare", params={"a": "ARNESH-2014", "b": "arnesh-2014"}).status_code == 422
    assert client.get("/api/cases/compare", params={"a": "NOPE", "b": "ARNESH-2014"}).status_code == 404


def test_compare_route_is_not_shadowed_by_case_detail():
    assert client.get("/api/cases/DKBASU-1997").json()["id"] == "DKBASU-1997"
    assert "a" in client.get("/api/cases/compare", params={"a": "DKBASU-1997", "b": "MANEKA-1978"}).json()
