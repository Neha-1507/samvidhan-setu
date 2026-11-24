"""Keyword retriever (BM25) over the whole corpus (Constitution + Bare Acts).

This is the "R" of RAG. It is deliberately dependency-free so it runs anywhere.
Later it can be swapped for embeddings + Qdrant without changing callers:
anything with a `search(query, k) -> list[dict]` method will work.
"""
import math
import re
from collections import Counter

from .corpus import load_corpus

# Tiny Hinglish -> English bridge. Temporary: replaced by embeddings in a later step.
HINGLISH = {
    "giraftari": "arrest", "giraftar": "arrest", "girftar": "arrest", "gireftar": "arrest",
    "shiksha": "education", "padhai": "education",
    "barabari": "equality", "samanta": "equality",
    "azadi": "freedom", "swatantrata": "freedom",
    "jeevan": "life", "jivan": "life",
    "adhikar": "rights", "vakil": "lawyer",
    "nyayalay": "court", "bacche": "children", "bachche": "children",
    "zamanat": "bail", "jamanat": "bail", "chori": "theft", "hatya": "murder",
    "dhokha": "cheating", "dhokhadhadi": "cheating", "dhamki": "intimidation",
    "sabut": "evidence", "darj": "register", "maarpit": "assault",
}

STOPWORDS = {
    "a", "an", "the", "and", "or", "of", "to", "in", "is", "are", "for", "can", "on", "be", "it",
    "what", "when", "how", "do", "i", "my", "me", "if", "ke", "ki", "ka", "ko", "me", "mein",
    "se", "hai", "kab", "kaise", "kya", "baad", "ho", "hota", "milti", "का", "के", "की", "में",
    "से", "है", "को", "और",
}

TOKEN_RE = re.compile(r"[^\s.,;:!?\"'()\[\]{}\-/|]+")


def tokenize(text: str) -> list[str]:
    tokens = [t.lower() for t in TOKEN_RE.findall(text)]
    return [HINGLISH.get(t, t) for t in tokens if t not in STOPWORDS]


def _doc_text(a: dict) -> str:
    return " ".join(
        [
            a["number"], a.get("ref", ""), a["title_en"], a["title_hi"], a["summary_en"], a["summary_hi"],
            " ".join(a["tags"]), a.get("replaces", ""), a.get("act", ""),
        ]
    )


class BM25Retriever:
    def __init__(self, articles: list[dict] | None = None, k1: float = 1.5, b: float = 0.75):
        self.articles = articles if articles is not None else load_corpus()
        self.k1, self.b = k1, b
        self.docs = [tokenize(_doc_text(a)) for a in self.articles]
        self.avgdl = (sum(len(d) for d in self.docs) / len(self.docs)) if self.docs else 0.0
        df = Counter()
        for d in self.docs:
            df.update(set(d))
        n = len(self.docs)
        self.idf = {t: math.log(1 + (n - c + 0.5) / (c + 0.5)) for t, c in df.items()}

    def _score(self, q_tokens: list[str], doc: list[str]) -> float:
        tf = Counter(doc)
        dl = len(doc)
        score = 0.0
        for t in q_tokens:
            if t not in tf:
                continue
            f = tf[t]
            denom = f + self.k1 * (1 - self.b + self.b * dl / (self.avgdl or 1))
            score += self.idf.get(t, 0.0) * f * (self.k1 + 1) / denom
        return score

    def search(self, query: str, k: int = 3) -> list[dict]:
        q_tokens = tokenize(query)
        if not q_tokens or not self.docs:
            return []
        scored = [(self._score(q_tokens, d), a) for d, a in zip(self.docs, self.articles)]
        scored = [(s, a) for s, a in scored if s > 0]
        scored.sort(key=lambda x: x[0], reverse=True)
        return [{**a, "score": round(s, 3)} for s, a in scored[:k]]
