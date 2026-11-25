from fastapi import APIRouter, File, HTTPException, UploadFile

from .analyzer import analyze
from .corpus import load_corpus
from .pdftext import MAX_BYTES, PdfProblem, extract_text

router = APIRouter(prefix="/api/analyze", tags=["tools"])


@router.post("/pdf")
async def analyze_pdf(file: UploadFile = File(...)):
    """Reads a text-based PDF and returns the legal references in it. The file is not stored."""
    data = await file.read(MAX_BYTES + 1)
    try:
        info = extract_text(data)
    except PdfProblem as e:
        raise HTTPException(status_code=e.status, detail={"code": e.code, "message": e.message})
    result = analyze(info["text"], load_corpus())
    result["pdf"] = {k: info[k] for k in ("pages", "pages_read", "truncated")}
    return result
