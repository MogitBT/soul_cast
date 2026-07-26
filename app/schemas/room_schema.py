from pydantic import BaseModel, Field

from app.models.game import GameMode


class CreateRoomRequest(BaseModel):
    mode: GameMode
    host_name: str = Field(default="Host", min_length=1, max_length=40)
    theme: str | None = Field(default=None, max_length=140)
    language: str = Field(default="english")


class JoinRoomRequest(BaseModel):
    name: str = Field(min_length=1, max_length=40)


class ShareClueRequest(BaseModel):
    player_id: str = Field(min_length=1)
    clue_id: str = Field(min_length=1)


class InterrogateRequest(BaseModel):
    player_id: str = Field(min_length=1)
    target_id: str = Field(min_length=1)
    question: str = Field(min_length=3, max_length=500)


class AccuseRequest(BaseModel):
    player_id: str = Field(min_length=1)
    accused_id: str = Field(min_length=1)
    theory: str = Field(min_length=5, max_length=800)
    moral_choice: str = Field(pattern="^(expose|forgive|protect|punish)$")
