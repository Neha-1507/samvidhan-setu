from fastapi import APIRouter, Query

from .corpus import load_corpus
from .quizgen import build_quiz

router = APIRouter(prefix="/api/quiz", tags=["learning"])


@router.get("")
def quiz(
    n: int = Query(5, ge=1, le=10),
    kind: str = Query("all", pattern="^(all|constitution|act|case)$"),
    seed: int | None = None,
):
    return build_quiz(load_corpus(), n=n, kind=kind, seed=seed)
