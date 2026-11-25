# PDF reading: what works and what does not

Works
- PDFs that contain real text (most FIR copies downloaded from a portal, typed notices, court orders from official sites)
- Up to 5 MB and the first 30 pages; the first 20,000 characters are analysed

Does not work yet
- Scanned PDFs (photos of paper). They have no text inside; OCR is needed (planned: Tesseract)
- Password-protected PDFs
- Devanagari text in some PDFs may extract in a broken form. Section numbers are usually fine, because digits and "IPC/BNS" are in English

Privacy
- The file is read in memory and thrown away. Nothing is written to disk or saved in a database.
- Do not log request bodies if you add logging later.

Why pypdf
- Pure Python, easy install, permissive licence.
