from fastapi import APIRouter, HTTPException

from .corpus import get_right, load_rights

router = APIRouter(prefix="/api/rights", tags=["know your rights"])


@router.get("")
def list_rights():
    return load_rights()


@router.get("/{slug}")
def right_detail(slug: str):
    item = get_right(slug)
    if item is None:
        raise HTTPException(status_code=404, detail="Topic not found")
    return item
