import json
from pathlib import Path

from fastapi import APIRouter, HTTPException

DATA_FILE = Path(__file__).resolve().parent.parent / "data" / "schedules.json"
router = APIRouter(prefix="/api/schedules", tags=["schedules"])


def _load() -> list[dict]:
    return json.loads(DATA_FILE.read_text(encoding="utf-8"))


@router.get("")
def list_schedules():
    return _load()


@router.get("/{number}")
def schedule_detail(number: int):
    item = next((s for s in _load() if s["number"] == number), None)
    if item is None:
        raise HTTPException(status_code=404, detail="Schedule not found")
    return item
