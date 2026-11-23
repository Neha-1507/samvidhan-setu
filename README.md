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

## Roadmap
- [x] Phase 1: Constitution data, search, Schedules, Preamble, Hindi/English
- [~] Phase 2: Legal AI (retrieval done; Bare Acts, embeddings and LLM answers next)
- [ ] Phase 3: Case law intelligence
- [ ] Phase 4: Document intelligence
- [ ] Phase 5: Voice, court tracker, mobile
