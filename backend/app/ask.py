from fastapi import APIRouter, Query

from .corpus import load_corpus
from .retriever import BM25Retriever

router = APIRouter(prefix="/api", tags=["ask"])
_retriever = BM25Retriever(load_corpus())

DISCLAIMER = (
    "Legal information only, not legal advice. Check the official source and consult a "
    "qualified advocate for your case."
)
KEYS = [
    "kind", "ref", "ref_hi", "number", "act", "title_en", "title_hi", "summary_en", "summary_hi",
    "replaces", "citation", "verified", "score", "source",
]


EXAMPLES = [
    {"q": "police arrest ke baad vakil", "label_en": "Can I call a lawyer after arrest?", "label_hi": "गिरफ्तारी के बाद वकील से मिल सकते हैं?"},
    {"q": "anticipatory bail", "label_en": "What is anticipatory bail?", "label_hi": "अग्रिम जमानत क्या है?"},
    {"q": "IPC 302", "label_en": "IPC 302 is which BNS section?", "label_hi": "IPC 302 अब कौन सी BNS धारा है?"},
    {"q": "right to privacy", "label_en": "Is privacy a fundamental right?", "label_hi": "क्या निजता मौलिक अधिकार है?"},
    {"q": "FIR", "label_en": "How is an FIR registered?", "label_hi": "FIR कैसे दर्ज होती है?"},
    {"q": "stalking", "label_en": "What counts as stalking?", "label_hi": "पीछा करना (स्टॉकिंग) क्या है?"},
    {"q": "498A", "label_en": "498A: what replaced it?", "label_hi": "498A की जगह कौन सी धारा आई?"},
]


@router.get("/ask/examples")
def ask_examples():
    """Sample questions for the Ask page. A test checks that every one finds an answer."""
    return EXAMPLES


@router.get("/ask")
def ask(q: str = Query(min_length=2, max_length=500), k: int = Query(3, ge=1, le=5)):
    """Grounded lookup: returns only provisions that exist in our database.

    Phase 2 later adds an LLM that writes a plain-language answer FROM these
    results. If nothing is retrieved, we say so instead of guessing.
    """
    results = _retriever.search(q, k=k)
    if not results:
        return {
            "query": q,
            "mode": "retrieval_only",
            "found": False,
            "message": "No matching provision found in the database yet. Try different words or consult an advocate.",
            "results": [],
            "disclaimer": DISCLAIMER,
        }
    return {
        "query": q,
        "mode": "retrieval_only",
        "found": True,
        "results": [{key: r.get(key) for key in KEYS} for r in results],
        "disclaimer": DISCLAIMER,
    }
