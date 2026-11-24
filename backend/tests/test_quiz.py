from fastapi.testclient import TestClient

from app.corpus import load_corpus
from app.main import app
from app.quizgen import build_quiz

client = TestClient(app)
DOCS = load_corpus()
BY_REF = {d["ref"]: d for d in DOCS}


def test_same_seed_gives_same_quiz():
    assert build_quiz(DOCS, 5, seed=7) == build_quiz(DOCS, 5, seed=7)


def test_every_question_is_well_formed():
    for q in build_quiz(DOCS, 10, seed=1):
        assert len(q["options"]) == 4
        assert len({o["en"] for o in q["options"]}) == 4
        assert 0 <= q["answer_index"] < 4
        assert q["question_en"] and q["question_hi"] and q["explanation_en"]


def test_title_questions_have_the_right_answer():
    for q in build_quiz(DOCS, 10, kind="constitution", seed=3):
        doc = BY_REF[q["options"][q["answer_index"]]["en"]]
        assert doc["title_en"] in q["question_en"]


def test_replaces_questions_have_the_right_answer():
    qs = [q for q in build_quiz(DOCS, 10, kind="act", seed=5) if q["type"] == "replaces"]
    for q in qs:
        doc = BY_REF[q["options"][q["answer_index"]]["en"]]
        assert doc["replaces"] in q["question_en"]


def test_kind_filter():
    assert all(q["kind"] == "case" for q in build_quiz(DOCS, 5, kind="case", seed=2))


def test_api_returns_requested_count_and_validates():
    assert len(client.get("/api/quiz", params={"n": 4, "seed": 1}).json()) == 4
    assert client.get("/api/quiz", params={"n": 0}).status_code == 422
    assert client.get("/api/quiz", params={"kind": "nope"}).status_code == 422
