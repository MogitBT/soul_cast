from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import get_openai_service, get_room_store
from app.core.clue_engine import private_clues_for_player, shared_case_board
from app.core.moral_engine import moral_summary
from app.core.quality_gate import validate_game_state
from app.schemas.game_schema import SpokenDecisionRequest
from app.schemas.room_schema import (
    AccuseRequest,
    CreateRoomRequest,
    InterrogateRequest,
    JoinRoomRequest,
    ShareClueRequest,
)
from app.services.openai_service import OpenAIService
from app.services.room_store import RoomStore

router = APIRouter()


@router.get("/rooms")
async def list_rooms(store: RoomStore = Depends(get_room_store)) -> dict:
    return {
        "rooms": [
            {
                "code": room.code,
                "mode": room.game.mode.value,
                "title": room.game.title,
                "status": room.game.status.value,
                "player_count": len(room.players),
                "updated_at": room.updated_at,
            }
            for room in store.list_rooms()
        ]
    }


@router.post("/rooms", status_code=201)
async def create_room(
    payload: CreateRoomRequest,
    store: RoomStore = Depends(get_room_store),
    ai: OpenAIService = Depends(get_openai_service),
) -> dict:
    generated = await ai.generate_game_state(payload.mode, payload.theme)
    passed, issues = validate_game_state(generated)
    if not passed:
        generated.shared_narration.append(f"Quality gate used fallback-safe structure: {'; '.join(issues)}")

    room, host = store.create_room_with_game(payload.mode, payload.host_name, generated, payload.theme)
    return {"room": room, "host_player_id": host.id, "quality_gate": {"passed": passed, "issues": issues}}


@router.get("/rooms/{code}")
async def get_room(code: str, store: RoomStore = Depends(get_room_store)) -> dict:
    room = store.get_room(code)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return {
        "room": room,
        "shared_case_board": shared_case_board(room),
        "moral_summary": moral_summary(room),
    }


@router.get("/rooms/{code}/players/{player_id}")
async def get_player_view(code: str, player_id: str, store: RoomStore = Depends(get_room_store)) -> dict:
    room = store.get_room(code)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    player = next((candidate for candidate in room.players if candidate.id == player_id), None)
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")

    return {
        "room": room,
        "player": player,
        "visible_clues": private_clues_for_player(room, player_id),
        "shared_case_board": shared_case_board(room),
        "moral_summary": moral_summary(room),
    }


@router.post("/rooms/{code}/join", status_code=201)
async def join_room(code: str, payload: JoinRoomRequest, store: RoomStore = Depends(get_room_store)) -> dict:
    try:
        room, player = store.join_room(code, payload.name)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return {"room": room, "player": player}


@router.post("/rooms/{code}/start")
async def start_room(code: str, store: RoomStore = Depends(get_room_store)) -> dict:
    try:
        return {"room": store.start_room(code)}
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/rooms/{code}/share-clue")
async def share_clue(code: str, payload: ShareClueRequest, store: RoomStore = Depends(get_room_store)) -> dict:
    try:
        return {"room": store.share_clue(code, payload.player_id, payload.clue_id)}
    except ValueError as exc:
        status = 404 if "not found" in str(exc).lower() else 403
        raise HTTPException(status_code=status, detail=str(exc)) from exc


@router.post("/rooms/{code}/interrogate")
async def interrogate(
    code: str,
    payload: InterrogateRequest,
    store: RoomStore = Depends(get_room_store),
    ai: OpenAIService = Depends(get_openai_service),
) -> dict:
    room = store.get_room(code)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    answer = await ai.answer_interrogation(room, payload.target_id, payload.question)
    updated = store.append_narration(code, answer)
    return {"answer": answer, "room": updated}


@router.post("/rooms/{code}/decision")
async def spoken_decision(
    code: str,
    payload: SpokenDecisionRequest,
    store: RoomStore = Depends(get_room_store),
    ai: OpenAIService = Depends(get_openai_service),
) -> dict:
    room = store.get_room(code)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    consequence, moral_axis = await ai.resolve_spoken_decision(room, payload.spoken_text)
    updated, decision, rule = store.add_world_decision(
        code=code,
        player_id=payload.player_id,
        spoken_text=payload.spoken_text,
        consequence=consequence,
        moral_axis=moral_axis,
    )
    return {"room": updated, "decision": decision, "world_rule": rule, "moral_summary": moral_summary(updated)}


@router.post("/rooms/{code}/accuse")
async def accuse(
    code: str,
    payload: AccuseRequest,
    store: RoomStore = Depends(get_room_store),
    ai: OpenAIService = Depends(get_openai_service),
) -> dict:
    room = store.get_room(code)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    reveal = await ai.create_accusation_reveal(room, payload.accused_id, payload.theory, payload.moral_choice)
    completed = store.complete_room(code, reveal)
    return {"reveal": reveal, "room": completed}
