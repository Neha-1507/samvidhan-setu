from fastapi import APIRouter, HTTPException

from .corpus import get_section, search_sections

router = APIRouter(prefix="/api/sections", tags=["bare acts"])


@router.get("")
def list_sections(act: str = "", q: str = ""):
    return search_sections(act, q)


@router.get("/{act}/{section}")
def section_detail(act: str, section: str):
    item = get_section(act, section)
    if item is None:
        raise HTTPException(status_code=404, detail="Section not found")
    return item
