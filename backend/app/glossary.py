from fastapi import APIRouter

from .corpus import search_glossary

router = APIRouter(prefix="/api/glossary", tags=["learning"])


@router.get("")
def glossary(q: str = ""):
    return search_glossary(q)
