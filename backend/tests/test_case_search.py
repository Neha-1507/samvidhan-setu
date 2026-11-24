from app.retriever import BM25Retriever


def refs(q, k=5):
    return [r["ref"] for r in BM25Retriever().search(q, k=k)]


def test_privacy_finds_puttaswamy():
    assert "K.S. Puttaswamy v. Union of India (2017)" in refs("right to privacy", k=3)


def test_custody_torture_finds_dk_basu():
    assert "D.K. Basu v. State of West Bengal (1997)" in refs("custody torture guidelines")


def test_66a_finds_shreya_singhal():
    assert refs("section 66A", k=3)[0] == "Shreya Singhal v. Union of India (2015)"
