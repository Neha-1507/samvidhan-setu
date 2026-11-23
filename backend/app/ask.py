from fastapi import APIRouter, Query

from .retriever import BM25Retriever

router = APIRouter(prefix="/api", tags=["ask"])
_retriever = BM25Retriever()

DISCLAIMER = (
    "Legal information only, not legal advice. Check the official source and consult a "
    "qualified advocate for your case."
)


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
        "results": [
            {
                "number": r["number"],
                "part": r["part"],
                "title_en": r["title_en"],
                "title_hi": r["title_hi"],
                "summary_en": r["summary_en"],
                "summary_hi": r["summary_hi"],
                "score": r["score"],
                "source": r["source"],
            }
            for r in results
        ],
        "disclaimer": DISCLAIMER,
    }
