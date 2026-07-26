from pydantic import BaseModel

from app.models.game import GameState
from app.models.player import Player


class Room(BaseModel):
    id: str
    code: str
    host_player_id: str | None = None
    created_at: str
    updated_at: str
    players: list[Player]
    game: GameState
