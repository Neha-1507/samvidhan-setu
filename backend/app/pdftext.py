"""Reads text out of a PDF held in memory. Nothing is written to disk.

Works for PDFs that contain real text. Scanned pages (pictures of text) have no
text to read; they need OCR, which this app does not do yet.
"""
from io import BytesIO

from pypdf import PdfReader

MAX_BYTES = 5 * 1024 * 1024
MAX_PAGES = 30
MAX_CHARS = 20000


class PdfProblem(Exception):
    def __init__(self, code: str, message: str, status: int):
        super().__init__(message)
        self.code, self.message, self.status = code, message, status


def extract_text(data: bytes) -> dict:
    if not data.startswith(b"%PDF"):
        raise PdfProblem("not_pdf", "This does not look like a PDF file.", 415)
    if len(data) > MAX_BYTES:
        raise PdfProblem("too_big", "The PDF is larger than 5 MB.", 413)

    try:
        reader = PdfReader(BytesIO(data))
        if reader.is_encrypted and not reader.decrypt(""):
            raise PdfProblem("encrypted", "The PDF is password protected.", 422)
        total_pages = len(reader.pages)
    except PdfProblem:
        raise
    except Exception:
        raise PdfProblem("unreadable", "The PDF could not be opened. It may be damaged.", 422)

    parts = []
    for page in reader.pages[:MAX_PAGES]:
        try:
            parts.append(page.extract_text() or "")
        except Exception:
            parts.append("")
    text = "\n".join(parts).strip()
    if len(text) < 10:
        raise PdfProblem(
            "no_text",
            "No readable text found. This is probably a scanned PDF; please paste the text instead.",
            422,
        )
    return {
        "text": text[:MAX_CHARS],
        "pages": total_pages,
        "pages_read": min(total_pages, MAX_PAGES),
        "truncated": total_pages > MAX_PAGES or len(text) > MAX_CHARS,
    }
