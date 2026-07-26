from enum import StrEnum

from pydantic import BaseModel


class PlayerRole(StrEnum):
    DETECTIVE = "detective"
    JOURNALIST = "journalist"
    INSIDER = "insider"
    FAMILY_FRIEND = "family_friend"
    NAVIGATOR = "navigator"
    LISTENER = "listener"
    WORLDKEEPER = "worldkeeper"


class Player(BaseModel):
    id: str
    name: str
    role: PlayerRole
    joined_at: str
