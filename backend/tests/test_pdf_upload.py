from io import BytesIO

import pytest
from fastapi.testclient import TestClient

from app.main import app

canvas = pytest.importorskip("reportlab.pdfgen.canvas")
client = TestClient(app)


def pdf_bytes(text):
    buf = BytesIO()
    c = canvas.Canvas(buf)
    c.drawString(72, 800, text)
    c.save()
    return buf.getvalue()


def upload(data, name="doc.pdf"):
    return client.post("/api/analyze/pdf", files={"file": (name, data, "application/pdf")})


def test_upload_returns_references_and_page_info():
    r = upload(pdf_bytes("Petition under Section 438 CrPC filed on 05/09/2024"))
    assert r.status_code == 200
    body = r.json()
    assert body["mentions"][0]["matches"][0]["ref"] == "BNSS Section 482"
    assert body["pdf"]["pages"] == 1 and body["pdf"]["truncated"] is False


def test_upload_rejects_non_pdf_with_clear_message():
    r = upload(b"just text", "notes.txt")
    assert r.status_code == 415
    assert r.json()["detail"]["code"] == "not_pdf"
