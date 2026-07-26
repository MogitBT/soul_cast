from pydantic import BaseModel, Field
from datetime import datetime

from app.models.game import GameState


class CuratedCase(BaseModel):
    id: str
    title: str
    theme: str
    mode: str
    description: str
    published_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    game_state: GameState
