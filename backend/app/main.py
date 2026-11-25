import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .analyze import router as analyze_router
from .articles import get_article, search_articles
from .ask import router as ask_router
from .cases import router as cases_router
from .glossary import router as glossary_router
from .pdf_upload import router as pdf_router
from .quiz import router as quiz_router
from .rights import router as rights_router
from .schedules import router as schedules_router
from .sections import router as sections_router

# Comma-separated list of website addresses allowed to call this API from a browser.
ORIGINS = [o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",") if o.strip()]

app = FastAPI(title="Samvidhan Setu API", version="0.4.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(schedules_router)
app.include_router(ask_router)
app.include_router(sections_router)
app.include_router(cases_router)
app.include_router(rights_router)
app.include_router(quiz_router)
app.include_router(analyze_router)
app.include_router(pdf_router)
app.include_router(glossary_router)


@app.get("/health")
def health():
    return {"status": "ok", "service": "samvidhan-setu"}


@app.get("/api/articles")
def list_articles(q: str = ""):
    return search_articles(q)


@app.get("/api/articles/{number}")
def article_detail(number: str):
    article = get_article(number)
    if article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return article
