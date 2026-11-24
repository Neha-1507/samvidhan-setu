from app.retriever import BM25Retriever, tokenize


def refs(query, k=5):
    return [r["ref"] for r in BM25Retriever().search(query, k=k)]


def test_tokenize_keeps_hindi_words_whole():
    assert "शिक्षा" in tokenize("शिक्षा का अधिकार")


def test_hinglish_maps_to_english():
    assert tokenize("giraftari") == ["arrest"]


def test_stopwords_are_dropped():
    assert tokenize("what is the") == []


def test_arrest_finds_constitution_and_bnss():
    found = refs("arrest and detention rights")
    assert "Article 22" in found
    assert any(r.startswith("BNSS") for r in found)


def test_life_liberty_finds_article_21():
    assert "Article 21" in refs("right to life")


def test_anticipatory_bail_finds_bnss_482():
    assert refs("anticipatory bail", k=3)[0] == "BNSS Section 482"


def test_hinglish_bail_and_theft():
    assert any(r.startswith("BNSS") for r in refs("zamanat kaise milti hai"))
    assert refs("chori", k=3)[0] == "BNS Section 303"


def test_old_ipc_number_finds_new_section():
    assert refs("IPC 302", k=3)[0] == "BNS Section 103"


def test_nonsense_returns_nothing():
    assert BM25Retriever().search("qwertyzzz") == []
