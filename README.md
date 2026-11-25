# Samvidhan Setu (संविधान सेतु)

A bridge between citizens and the Constitution of India: search Articles, Schedules and the Preamble in Hindi and English, and ask questions answered only from verified provisions.

> Legal information only, not a replacement for a qualified advocate.

## Structure
- `backend/`  FastAPI (Python) API
- `frontend/` Next.js web app

## Run backend (http://localhost:8000)
```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements-dev.txt
uvicorn app.main:app --reload
```
API docs: http://localhost:8000/docs

## Run frontend (http://localhost:3000)
```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

## Add more Articles
Fill `backend/data/new_articles_template.csv`, then:
```bash
cd backend && python scripts/import_articles.py data/new_articles_template.csv
```
Verify every summary against the official text before committing.

## Add Bare Act sections (BNS, BNSS, BSA)
Add rows to `backend/data/bare_acts_seed.csv`, then:
```bash
cd backend && python scripts/import_acts.py data/bare_acts_seed.csv
```
New rows start as `verified: false` and the website shows a "Not yet verified" badge. After you compare a record with the official text (India Code):
```bash
python scripts/mark_verified.py acts BNSS-35 BNS-103
python scripts/mark_verified.py articles 21 22
```

## Roadmap
- [x] Phase 1: Constitution data, search, Schedules, Preamble, Hindi/English
- [~] Phase 2: Legal AI (retrieval + Bare Acts done; embeddings and LLM answers next)
- [~] Phase 3: Case law intelligence (8 landmark cases searchable and comparable side by side; full judgment text next)
- [x] Citizen rights guides: arrest, FIR, bail, legal aid, cyber fraud, women's safety
- [x] Legal learning: auto-generated quiz and a 28-term legal glossary (Hindi and English)
- [x] 53 Bare Act sections (BNS, BNSS, BSA) with old IPC/CrPC/Evidence Act numbers
- [~] Phase 4: Document intelligence (paste-text and text-PDF reader, old-to-new law converter done; OCR for scanned PDFs next)
- [ ] Phase 5: Voice, court tracker, mobile
