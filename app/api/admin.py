import secrets
from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import get_openai_service, get_room_store
from app.models.case_template import CuratedCase
from app.schemas.admin_schema import GenerateDraftRequest, PublishCaseRequest
from app.services.openai_service import OpenAIService
from app.services.room_store import RoomStore

router = APIRouter()

@router.post("/cases/generate-draft")
async def generate_draft(
    payload: GenerateDraftRequest,
    ai: OpenAIService = Depends(get_openai_service),
) -> dict:
    generated = await ai.generate_game_state(payload.mode, payload.theme)
    title = generated.title or payload.theme or "Interactive Mystery Story"
    hook = generated.episode_hook or "A dark and intricate crime scene."
    cover_image_url = await ai.generate_cover_image(title, hook)
    
    # Attach cover image URL to generated game state dict
    result_dict = generated.model_dump()
    result_dict["cover_image"] = cover_image_url
    return {"game_state": result_dict}


@router.post("/cases/publish-case")
async def publish_case(
    payload: PublishCaseRequest,
    store: RoomStore = Depends(get_room_store),
) -> dict:
    case_id = f"case_{secrets.token_hex(6)}"
    case = CuratedCase(
        id=case_id,
        title=payload.title,
        description=payload.description,
        mode=payload.mode.value,
        theme=payload.theme,
        game_state=payload.game_state,
    )
    store.save_curated_case(case)
    return {"case": case}

@router.delete("/cases/all")
async def clear_all_cases(store: RoomStore = Depends(get_room_store)) -> dict:
    store.clear_curated_cases()
    return {"status": "cleared"}
