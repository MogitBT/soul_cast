from pydantic import BaseModel, Field

from app.models.game import GameMode, GameState


class GenerateDraftRequest(BaseModel):
    mode: GameMode
    theme: str | None = Field(default=None, max_length=140)


class PublishCaseRequest(BaseModel):
    title: str
    description: str
    mode: GameMode
    theme: str
    game_state: GameState
