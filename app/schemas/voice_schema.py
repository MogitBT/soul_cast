from pydantic import BaseModel, Field

class NarrationRequest(BaseModel):
    text: str = Field(min_length=1, max_length=2000)
    voice: str = "marin"

class TranslateRequest(BaseModel):
    text: str
    target_language: str

class InterrogateRequest(BaseModel):
    character_name: str
    character_context: str
    question: str

class EscapeActionRequest(BaseModel):
    room_context: str
    history: list[str]
    action: str

class StoryActionRequest(BaseModel):
    story_context: str
    history: list[str]
    action: str
    turn_count: int
    max_turns: int = 3

class CompanionChatRequest(BaseModel):
    story_title: str
    story_context_so_far: str
    question: str
