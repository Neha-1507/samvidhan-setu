from io import BytesIO

import pytest

from app.analyzer import analyze
from app.corpus import load_corpus
from app.pdftext import MAX_BYTES, PdfProblem, extract_text

canvas = pytest.importorskip("reportlab.pdfgen.canvas")


def make_pdf(lines):
    buf = BytesIO()
    c = canvas.Canvas(buf)
    y = 800
    for line in lines:
        c.drawString(72, y, line)
        y -= 20
    c.save()
    return buf.getvalue()


def test_reads_text_and_finds_sections():
    data = make_pdf(["FIR No. 45/2024 dated 12/08/2024", "Registered under Section 302 IPC"])
    info = extract_text(data)
    assert "Section 302 IPC" in info["text"] and info["pages"] == 1
    result = analyze(info["text"], load_corpus())
    assert result["mentions"][0]["matches"][0]["ref"] == "BNS Section 103"


def test_rejects_non_pdf():
    with pytest.raises(PdfProblem) as e:
        extract_text(b"hello, I am not a pdf")
    assert e.value.code == "not_pdf" and e.value.status == 415


def test_rejects_oversized_file():
    with pytest.raises(PdfProblem) as e:
        extract_text(b"%PDF" + b"0" * MAX_BYTES)
    assert e.value.code == "too_big"


def test_blank_pdf_reports_no_text():
    with pytest.raises(PdfProblem) as e:
        extract_text(make_pdf([]))
    assert e.value.code == "no_text"


def test_damaged_pdf_is_reported_not_crashed():
    with pytest.raises(PdfProblem) as e:
        extract_text(b"%PDF-1.4 this is broken")
    assert e.value.code in ("unreadable", "no_text")


def test_password_protected_pdf():
    pypdf = pytest.importorskip("pypdf")
    pytest.importorskip("cryptography")
    reader = pypdf.PdfReader(BytesIO(make_pdf(["secret text here"])))
    writer = pypdf.PdfWriter()
    writer.append(reader)
    writer.encrypt("pw")
    out = BytesIO()
    writer.write(out)
    with pytest.raises(PdfProblem) as e:
        extract_text(out.getvalue())
    assert e.value.code == "encrypted"
