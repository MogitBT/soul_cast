from enum import StrEnum
from typing import Literal

from pydantic import BaseModel, Field


class GameMode(StrEnum):
    MURDER_CASE = "murder_case"
    ESCAPE_CASE = "escape_case"
    LIVING_STORY = "living_story"


class Language(StrEnum):
    ENGLISH = "english"
    TAMIL = "tamil"
    HINDI = "hindi"
    KANNADA = "kannada"


class GameStatus(StrEnum):
    LOBBY = "lobby"
    PLAYING = "playing"
    FINALE = "finale"
    COMPLETED = "completed"


class MoralAxis(StrEnum):
    TRUTH = "truth"
    LOYALTY = "loyalty"
    MERCY = "mercy"
    AMBITION = "ambition"
    JUSTICE = "justice"
    SACRIFICE = "sacrifice"


class Suspect(BaseModel):
    id: str
    name: str
    relationship: str
    public_bio: str
    voice: str = "marin"


class Clue(BaseModel):
    id: str
    title: str
    body: str
    visibility: Literal["private", "shared"] = "private"
    importance: Literal["critical", "supporting", "red_herring"] = "supporting"
    owner_player_id: str | None = None
    reveals_clue_ids: list[str] = Field(default_factory=list)
    contradicts_clue_ids: list[str] = Field(default_factory=list)


class Puzzle(BaseModel):
    id: str
    title: str
    lock_state: Literal["locked", "unlocked"] = "locked"
    clue_ids: list[str] = Field(default_factory=list)
    solution_hint: str


class WorldRule(BaseModel):
    id: str
    text: str
    created_by_decision_id: str
    permanence: Literal["session", "world"] = "world"


class WorldDecision(BaseModel):
    id: str
    player_id: str
    spoken_text: str
    consequence: str
    moral_axis: MoralAxis
    created_at: str


class DiscoveryState(BaseModel):
    discovered: list[str] = Field(default_factory=list)
    attempted_but_failed: list[str] = Field(default_factory=list)
    hint_level: int = 0
    turns_since_progress: int = 0


class PlayerSignal(BaseModel):
    choice_id: str
    selected: str
    response_latency_ms: int = 0
    timestamp: str


class GameState(BaseModel):
    mode: GameMode
    title: str
    episode_hook: str
    moral_question: str
    cover_image: str | None = None
    act: int = 1
    status: GameStatus = GameStatus.LOBBY
    suspects: list[Suspect] = Field(default_factory=list)
    clues: list[Clue] = Field(default_factory=list)
    puzzles: list[Puzzle] = Field(default_factory=list)
    world_rules: list[WorldRule] = Field(default_factory=list)
    decisions: list[WorldDecision] = Field(default_factory=list)
    shared_narration: list[str] = Field(default_factory=list)
    discovery_state: DiscoveryState = Field(default_factory=DiscoveryState)
    signals: list[PlayerSignal] = Field(default_factory=list)
