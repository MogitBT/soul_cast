from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health_check() -> dict[str, str | bool]:
    return {"ok": True, "service": "pocketcases-backend"}
