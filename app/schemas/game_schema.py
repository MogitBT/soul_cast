from pydantic import BaseModel, Field


class SpokenDecisionRequest(BaseModel):
    player_id: str = Field(min_length=1)
    spoken_text: str = Field(min_length=3, max_length=800)
