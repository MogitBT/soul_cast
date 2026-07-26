from fastapi import APIRouter, Depends
from app.api.deps import get_room_store
from app.services.room_store import RoomStore

router = APIRouter()

@router.get("/cases/featured")
async def get_featured_cases(store: RoomStore = Depends(get_room_store)) -> dict:
    cases = store.list_curated_cases()
    return {"cases": cases}

@router.get("/user/subscription")
async def get_subscription_status() -> dict:
    # Mocking the subscription status
    return {
        "plan": "monthly_detective_pass",
        "active": True,
        "expires_at": "2026-12-31T23:59:59Z"
    }
