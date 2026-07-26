from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import get_openai_service, get_room_store
from app.schemas.voice_schema import NarrationRequest, TranslateRequest, InterrogateRequest, EscapeActionRequest, StoryActionRequest, CompanionChatRequest
from app.services.openai_service import OpenAIService
from app.services.room_store import RoomStore

router = APIRouter()


@router.post("/rooms/{code}/voice/realtime-token")
async def realtime_token(
    code: str,
    store: RoomStore = Depends(get_room_store),
    ai: OpenAIService = Depends(get_openai_service),
) -> dict:
    room = store.get_room(code)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    try:
        return await ai.realtime_client_secret(room)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/voice/narration")
async def narration_audio(
    payload: NarrationRequest,
    ai: OpenAIService = Depends(get_openai_service),
) -> dict:
    try:
        audio_base64 = await ai.synthesize_narration(payload.text, payload.voice)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return {"audio_base64": audio_base64, "mime_type": "audio/mpeg"}


@router.post("/voice/translate")
async def translate_text(
    payload: TranslateRequest,
    ai: OpenAIService = Depends(get_openai_service),
) -> dict:
    try:
        if payload.target_language.lower() == "english":
            return {"translated_text": payload.text}
        prompt = f"Translate the following text into {payload.target_language}. Return only the translated text, no preamble:\n\n{payload.text}"
        translated = await ai._text(prompt, payload.text)
        return {"translated_text": translated}
    except Exception as exc:
        return {"translated_text": payload.text}


@router.post("/voice/interrogate")
async def interrogate_character(
    payload: InterrogateRequest,
    ai: OpenAIService = Depends(get_openai_service),
) -> dict:
    prompt = (
        f"You are a character in a murder mystery audio drama. "
        f"Your name is {payload.character_name}. "
        f"Here is your hidden truth and context: {payload.character_context}\n\n"
        f"The investigator asks you: '{payload.question}'\n\n"
        f"Respond in character. Keep it to 2-3 sentences. Be dramatic but natural. "
        f"If you are guilty, be defensive or subtly manipulative, but do not confess easily unless trapped. "
        f"If innocent, be helpful but perhaps scared or annoyed. Do not use quotes or narration brackets, just speak the dialogue."
    )
    try:
        response_text = await ai._text(prompt, "I have nothing more to say to you.")
        return {"text": response_text}
    except Exception as exc:
        return {"text": "I have nothing more to say to you."}


@router.post("/voice/escape-action")
async def handle_escape_action(
    payload: EscapeActionRequest,
    ai: OpenAIService = Depends(get_openai_service),
) -> dict:
    try:
        response_text = await ai.resolve_escape_action(
            room_context=payload.room_context,
            history=payload.history,
            action=payload.action
        )
        return {"text": response_text}
    except Exception as exc:
        return {"text": "You try, but nothing seems to happen."}

@router.post("/voice/story-action")
async def handle_story_action(
    payload: StoryActionRequest,
    ai: OpenAIService = Depends(get_openai_service),
) -> dict:
    try:
        response_text = await ai.resolve_story_action(
            story_context=payload.story_context,
            history=payload.history,
            action=payload.action,
            turn_count=payload.turn_count,
            max_turns=payload.max_turns
        )
        return {"text": response_text}
    except Exception as exc:
        return {"text": "You consider the action, but decide against it."}

@router.post("/voice/companion-chat")
async def handle_companion_chat(
    payload: CompanionChatRequest,
    ai: OpenAIService = Depends(get_openai_service),
) -> dict:
    try:
        response_text = await ai.resolve_companion_chat(
            story_title=payload.story_title,
            story_context_so_far=payload.story_context_so_far,
            question=payload.question
        )
        return {"text": response_text}
    except Exception as exc:
        return {"text": "I'm not sure, let's keep listening."}
