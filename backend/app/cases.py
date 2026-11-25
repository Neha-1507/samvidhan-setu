from fastapi import APIRouter, HTTPException

from .compare import compare_cases
from .corpus import get_case, search_cases

router = APIRouter(prefix="/api/cases", tags=["case law"])


@router.get("")
def list_cases(q: str = ""):
    return search_cases(q)


@router.get("/compare")
def compare(a: str, b: str):
    """Compare two cases. This route must stay above /{case_id}."""
    if a.strip().upper() == b.strip().upper():
        raise HTTPException(status_code=422, detail="Choose two different cases")
    first, second = get_case(a), get_case(b)
    if first is None or second is None:
        raise HTTPException(status_code=404, detail="Case not found")
    return compare_cases(first, second)


@router.get("/{case_id}")
def case_detail(case_id: str):
    item = get_case(case_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Case not found")
    return item
