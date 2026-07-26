from fastapi import APIRouter

from app.api.health import router as health_router
from app.api.modes import router as modes_router
from app.api.rooms import router as rooms_router
from app.api.voice import router as voice_router
from app.api.admin import router as admin_router
from app.api.user import router as user_router

api_router = APIRouter()
api_router.include_router(health_router, tags=["health"])
api_router.include_router(modes_router, prefix="/pocketcases", tags=["modes"])
api_router.include_router(rooms_router, prefix="/pocketcases", tags=["rooms"])
api_router.include_router(voice_router, prefix="/pocketcases", tags=["voice"])
api_router.include_router(admin_router, prefix="/admin", tags=["admin"])
api_router.include_router(user_router, prefix="/user_api", tags=["user"])
