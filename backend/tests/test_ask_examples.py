from fastapi.testclient import TestClient

from app.ask import EXAMPLES
from app.main import app
from app.retriever import BM25Retriever

client = TestClient(app)


def test_every_example_question_finds_an_answer():
    retriever = BM25Retriever()
    for ex in EXAMPLES:
        assert retriever.search(ex["q"], k=3), f"example finds nothing: {ex['q']}"


def test_examples_endpoint_shape():
    data = client.get("/api/ask/examples").json()
    assert len(data) >= 5
    for ex in data:
        assert ex["q"] and ex["label_en"] and ex["label_hi"]
