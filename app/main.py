import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import socketio

from app.api.routes import api_router
from app.config import get_settings
from app.services.room_store import RoomStore
from app.sockets.socket_app import register_socket_handlers

settings = get_settings()

fastapi_app = FastAPI(
    title="PocketCases Backend",
    description="AI-native interactive entertainment backend for Pocket FM hackathon.",
    version="0.1.0",
)

fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

store = RoomStore(settings.database_path)
store.init_db()

fastapi_app.state.room_store = store
fastapi_app.include_router(api_router, prefix="/api")

# Serve the React build as static files (production / Databricks Apps)
DIST = Path(__file__).parent.parent / "frontend-react" / "dist"
if DIST.exists():
    if (DIST / "assets").exists():
        fastapi_app.mount("/assets", StaticFiles(directory=str(DIST / "assets")), name="assets")

    @fastapi_app.get("/")
    async def root():
        return FileResponse(str(DIST / "index.html"))

    @fastapi_app.get("/{full_path:path}")
    async def spa_fallback(full_path: str):
        # Let API and socket.io routes pass through
        if full_path.startswith(("api/", "socket.io")):
            from fastapi import HTTPException
            raise HTTPException(status_code=404)
            
        # Serve the requested file if it exists (e.g. /ai-art/image.jpg)
        file_path = DIST / full_path
        if file_path.is_file():
            return FileResponse(str(file_path))
            
        # Serve SPA for everything else (routes)
        index = DIST / "index.html"
        return FileResponse(str(index))

sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*",
)
register_socket_handlers(sio, store)

app = socketio.ASGIApp(sio, other_asgi_app=fastapi_app)

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("DATABRICKS_APP_PORT", os.environ.get("PORT", 8080)))
    uvicorn.run(app, host="0.0.0.0", port=port)
