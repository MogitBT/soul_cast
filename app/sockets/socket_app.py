import socketio

from app.core.world_engine import fallback_world_consequence
from app.services.room_store import RoomStore


def register_socket_handlers(sio: socketio.AsyncServer, store: RoomStore) -> None:
    @sio.event
    async def connect(sid: str, environ: dict) -> None:
        await sio.emit("socket:ready", {"sid": sid}, to=sid)

    @sio.event
    async def room_join(sid: str, data: dict) -> None:
        code = str(data.get("code", "")).upper()
        room = store.get_room(code)
        if not room:
            await sio.emit("room:error", {"error": "Room not found"}, to=sid)
            return

        await sio.enter_room(sid, room.code)
        await sio.emit("room:state", room.model_dump(mode="json"), to=sid)
        await sio.emit("room:presence", {"sid": sid, "event": "joined"}, room=room.code, skip_sid=sid)

    @sio.event
    async def room_start(sid: str, data: dict) -> None:
        try:
            room = store.start_room(str(data.get("code", "")))
        except ValueError as exc:
            await sio.emit("room:error", {"error": str(exc)}, to=sid)
            return
        await sio.emit("room:state", room.model_dump(mode="json"), room=room.code)

    @sio.event
    async def clue_share(sid: str, data: dict) -> None:
        try:
            room = store.share_clue(str(data.get("code", "")), str(data.get("player_id", "")), str(data.get("clue_id", "")))
        except ValueError as exc:
            await sio.emit("room:error", {"error": str(exc)}, to=sid)
            return
        await sio.emit("room:state", room.model_dump(mode="json"), room=room.code)

    @sio.event
    async def story_decision(sid: str, data: dict) -> None:
        code = str(data.get("code", ""))
        room = store.get_room(code)
        if not room:
            await sio.emit("room:error", {"error": "Room not found"}, to=sid)
            return

        spoken_text = str(data.get("spoken_text", ""))
        consequence, moral_axis = fallback_world_consequence(room, spoken_text)
        updated, decision, rule = store.add_world_decision(
            code=code,
            player_id=str(data.get("player_id", "")),
            spoken_text=spoken_text,
            consequence=consequence,
            moral_axis=moral_axis,
        )
        await sio.emit(
            "story:decision",
            {
                "decision": decision.model_dump(mode="json"),
                "world_rule": rule.model_dump(mode="json"),
                "room": updated.model_dump(mode="json"),
            },
            room=updated.code,
        )

    @sio.event
    async def voice_partial(sid: str, data: dict) -> None:
        code = str(data.get("code", "")).upper()
        room = store.get_room(code)
        if not room:
            await sio.emit("room:error", {"error": "Room not found"}, to=sid)
            return
        await sio.emit(
            "voice:partial",
            {
                "player_id": data.get("player_id"),
                "text": data.get("text"),
            },
            room=room.code,
            skip_sid=sid,
        )
