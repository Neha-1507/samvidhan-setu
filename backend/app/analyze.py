from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

from .analyzer import analyze, lookup, normalize_law
from .corpus import load_corpus

router = APIRouter(prefix="/api", tags=["tools"])


class AnalyzeIn(BaseModel):
    text: str = Field(min_length=10, max_length=20000)


@router.post("/analyze")
def analyze_text(body: AnalyzeIn):
    """Reads pasted text and returns the legal references it cites. The text is not stored."""
    return analyze(body.text, load_corpus())


@router.get("/convert")
def convert(law: str = Query(min_length=2, max_length=40), section: str = Query(min_length=1, max_length=6)):
    """Old law to new law (IPC 302 -> BNS 103), or look up a new section."""
    norm = normalize_law(law)
    if norm is None:
        raise HTTPException(status_code=422, detail="law must be one of IPC, CrPC, Evidence Act, BNS, BNSS, BSA")
    return lookup(norm, section.strip(), load_corpus())
