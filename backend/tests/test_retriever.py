from app.retriever import BM25Retriever, tokenize


def test_tokenize_keeps_hindi_words_whole():
    assert "शिक्षा" in tokenize("शिक्षा का अधिकार")


def test_hinglish_maps_to_english():
    assert tokenize("giraftari") == ["arrest"]


def test_arrest_finds_article_22():
    top = BM25Retriever().search("arrest and detention rights", k=3)
    assert top and top[0]["number"] == "22"


def test_life_liberty_finds_article_21():
    top = BM25Retriever().search("right to life", k=3)
    assert any(a["number"] == "21" for a in top)


def test_nonsense_returns_nothing():
    assert BM25Retriever().search("qwertyzzz") == []
