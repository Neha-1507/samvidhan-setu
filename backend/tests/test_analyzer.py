from fastapi.testclient import TestClient

from app.analyzer import analyze, find_dates, find_mentions, lookup, normalize_law, parse_replaces
from app.corpus import load_corpus
from app.main import app

client = TestClient(app)
CORPUS = load_corpus()


def refs_for(result, mention):
    item = next(m for m in result["mentions"] if m["mention"] == mention)
    return [x["ref"] for x in item["matches"]]


def test_normalize_law_names():
    assert normalize_law("I.P.C.") == "IPC"
    assert normalize_law("Code of Criminal Procedure") == "CrPC"
    assert normalize_law("bnss") == "BNSS"


def test_parse_replaces():
    assert parse_replaces("CrPC 41, 41A") == {("CrPC", "41"), ("CrPC", "41A")}


def test_finds_several_forms():
    text = "Case u/s 302, 34 IPC and Section 482 of BNSS. See Article 21 and Art. 22. Also IPC 498A."
    assert find_mentions(text) == [
        ("IPC", "302"), ("IPC", "34"), ("BNSS", "482"), ("IPC", "498A"), ("ARTICLE", "21"), ("ARTICLE", "22"),
    ]


def test_no_false_positives_on_plain_numbers():
    assert find_mentions("Report of IPC 2024 with 5 witnesses in the year 2024") == []


def test_old_law_maps_to_new_section():
    r = analyze("Registered under Section 302 IPC and 420 IPC", CORPUS)
    assert refs_for(r, "IPC 302") == ["BNS Section 103"]
    assert refs_for(r, "IPC 420") == ["BNS Section 318"]


def test_unknown_section_is_reported_not_guessed():
    r = analyze("Charged under Section 34 IPC", CORPUS)
    assert r["unmatched"] == ["IPC 34"]


def test_dates_and_fir_number_and_cutover_warning():
    r = analyze("FIR No. 45/2024 dated 12/08/2024 under Section 420 IPC", CORPUS)
    assert r["fir_numbers"] == ["45/2024"]
    assert r["dates"][0]["iso"] == "2024-08-12"
    assert r["warnings"]


def test_invalid_date_is_ignored():
    assert find_dates("on 31/02/2024") == []


def test_lookup_new_and_constitution():
    assert lookup("BNSS", "482", CORPUS)["matches"][0]["ref"] == "BNSS Section 482"
    assert lookup("ARTICLE", "21", CORPUS)["matches"][0]["ref"] == "Article 21"


def test_api_analyze_and_validation():
    ok = client.post("/api/analyze", json={"text": "FIR under Section 302 IPC dated 01/01/2023"})
    assert ok.status_code == 200 and ok.json()["mentions"][0]["matches"][0]["ref"] == "BNS Section 103"
    assert client.post("/api/analyze", json={"text": "short"}).status_code == 422


def test_api_convert():
    assert client.get("/api/convert", params={"law": "CrPC", "section": "41A"}).json()["matches"][0]["ref"] == "BNSS Section 35"
    assert client.get("/api/convert", params={"law": "nope", "section": "1"}).status_code == 422
    assert client.get("/api/convert", params={"law": "IPC", "section": "999"}).json()["matches"] == []
