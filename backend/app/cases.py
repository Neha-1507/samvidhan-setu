from fastapi import APIRouter, HTTPException

from .corpus import get_case, search_cases

router = APIRouter(prefix="/api/cases", tags=["case law"])


@router.get("")
def list_cases(q: str = ""):
    return search_cases(q)


@router.get("/{case_id}")
def case_detail(case_id: str):
    item = get_case(case_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Case not found")
    return item
