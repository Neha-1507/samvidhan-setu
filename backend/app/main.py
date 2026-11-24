from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .articles import get_article, search_articles
from .ask import router as ask_router
from .cases import router as cases_router
from .schedules import router as schedules_router
from .sections import router as sections_router

app = FastAPI(title="Samvidhan Setu API", version="0.4.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(schedules_router)
app.include_router(ask_router)
app.include_router(sections_router)
app.include_router(cases_router)


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
