import json
import secrets
import sqlite3
import string
from datetime import UTC, datetime
from pathlib import Path

from app.data.fallback_stories import fallback_game_state
from app.data.seed_modes import MODE_CARDS
from app.models.game import Clue, GameMode, GameState, GameStatus, MoralAxis, WorldDecision, WorldRule
from app.models.player import Player
from app.models.room import Room
from app.models.case_template import CuratedCase


def utc_now() -> str:
    return datetime.now(UTC).isoformat()


def make_id(prefix: str) -> str:
    return f"{prefix}_{secrets.token_hex(6)}"


def make_room_code() -> str:
    alphabet = string.ascii_uppercase.replace("O", "").replace("I", "") + "23456789"
    return "".join(secrets.choice(alphabet) for _ in range(6))


class RoomStore:
    def __init__(self, database_path: str) -> None:
        self.database_path = database_path

    def init_db(self) -> None:
        db_path = Path(self.database_path)
        if db_path.parent != Path("."):
            db_path.parent.mkdir(parents=True, exist_ok=True)

        with self._connect() as conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS rooms (
                    code TEXT PRIMARY KEY,
                    payload TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                )
                """
            )
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS curated_cases (
                    id TEXT PRIMARY KEY,
                    payload TEXT NOT NULL,
                    published_at TEXT NOT NULL
                )
                """
            )
            conn.commit()

    def list_rooms(self) -> list[Room]:
        with self._connect() as conn:
            rows = conn.execute("SELECT payload FROM rooms ORDER BY updated_at DESC").fetchall()

        return [Room.model_validate_json(row["payload"]) for row in rows]

    def create_room(self, mode: GameMode, host_name: str, theme: str | None = None) -> tuple[Room, Player]:
        room = Room(
            id=make_id("room"),
            code=self._unique_room_code(),
            created_at=utc_now(),
            updated_at=utc_now(),
            players=[],
            game=fallback_game_state(mode, theme),
        )
        host = self._add_player(room, host_name)
        room.host_player_id = host.id
        self.save_room(room)
        return room, host

    def create_room_with_game(self, mode: GameMode, host_name: str, game: GameState, theme: str | None = None) -> tuple[Room, Player]:
        room, host = self.create_room(mode, host_name, theme)
        room.game = game.model_copy(update={"mode": mode})
        self._distribute_private_clues(room)
        self.save_room(room)
        return room, host

    def get_room(self, code: str) -> Room | None:
        with self._connect() as conn:
            row = conn.execute("SELECT payload FROM rooms WHERE code = ?", (code.upper(),)).fetchone()

        if not row:
            return None
        return Room.model_validate_json(row["payload"])

    def require_room(self, code: str) -> Room:
        room = self.get_room(code)
        if not room:
            raise ValueError("Room not found")
        return room

    def join_room(self, code: str, name: str) -> tuple[Room, Player]:
        room = self.require_room(code)
        player = self._add_player(room, name)
        room.updated_at = utc_now()
        self.save_room(room)
        return room, player

    def start_room(self, code: str) -> Room:
        room = self.require_room(code)
        room.game.status = GameStatus.PLAYING
        room.game.shared_narration.append(f"Episode started: {room.game.episode_hook}")
        room.updated_at = utc_now()
        self.save_room(room)
        return room

    def share_clue(self, code: str, player_id: str, clue_id: str) -> Room:
        room = self.require_room(code)
        clue = next((item for item in room.game.clues if item.id == clue_id), None)
        if not clue:
            raise ValueError("Clue not found")
        if clue.owner_player_id and clue.owner_player_id != player_id:
            raise ValueError("Only the clue owner can share this clue")

        clue.visibility = "shared"
        room.game.shared_narration.append(f"A clue was added to the shared case board: {clue.title}.")
        room.updated_at = utc_now()
        self.save_room(room)
        return room

    def add_world_decision(
        self,
        code: str,
        player_id: str,
        spoken_text: str,
        consequence: str,
        moral_axis: MoralAxis,
    ) -> tuple[Room, WorldDecision, WorldRule]:
        room = self.require_room(code)
        decision = WorldDecision(
            id=make_id("decision"),
            player_id=player_id,
            spoken_text=spoken_text,
            consequence=consequence,
            moral_axis=moral_axis,
            created_at=utc_now(),
        )
        rule = WorldRule(
            id=make_id("rule"),
            text=consequence,
            created_by_decision_id=decision.id,
        )
        room.game.decisions.append(decision)
        room.game.world_rules.append(rule)
        room.game.shared_narration.append(f"The world remembers: {consequence}")
        room.updated_at = utc_now()
        self.save_room(room)
        return room, decision, rule

    def complete_room(self, code: str, reveal: str) -> Room:
        room = self.require_room(code)
        room.game.status = GameStatus.COMPLETED
        room.game.shared_narration.append(reveal)
        room.updated_at = utc_now()
        self.save_room(room)
        return room

    def append_narration(self, code: str, narration: str) -> Room:
        room = self.require_room(code)
        room.game.shared_narration.append(narration)
        room.updated_at = utc_now()
        self.save_room(room)
        return room

    def save_room(self, room: Room) -> None:
        payload = room.model_dump_json()
        with self._connect() as conn:
            conn.execute(
                """
                INSERT INTO rooms (code, payload, created_at, updated_at)
                VALUES (?, ?, ?, ?)
                ON CONFLICT(code) DO UPDATE SET
                    payload = excluded.payload,
                    updated_at = excluded.updated_at
                """,
                (room.code, payload, room.created_at, room.updated_at),
            )
            conn.commit()

    def save_curated_case(self, case: CuratedCase) -> None:
        payload = case.model_dump_json()
        with self._connect() as conn:
            conn.execute(
                """
                INSERT INTO curated_cases (id, payload, published_at)
                VALUES (?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                    payload = excluded.payload,
                    published_at = excluded.published_at
                """,
                (case.id, payload, case.published_at),
            )
            conn.commit()

    def list_curated_cases(self) -> list[CuratedCase]:
        with self._connect() as conn:
            rows = conn.execute("SELECT payload FROM curated_cases ORDER BY published_at DESC").fetchall()
        return [CuratedCase.model_validate_json(row["payload"]) for row in rows]

    def clear_curated_cases(self) -> None:
        with self._connect() as conn:
            conn.execute("DELETE FROM curated_cases")
            conn.commit()

    def get_curated_case(self, case_id: str) -> CuratedCase | None:
        with self._connect() as conn:
            row = conn.execute("SELECT payload FROM curated_cases WHERE id = ?", (case_id,)).fetchone()
        if not row:
            return None
        return CuratedCase.model_validate_json(row["payload"])

    def _add_player(self, room: Room, name: str) -> Player:
        roles = MODE_CARDS[room.game.mode]["roles"]
        role = roles[len(room.players) % len(roles)]
        player = Player(id=make_id("player"), name=name, role=role, joined_at=utc_now())
        room.players.append(player)
        self._distribute_private_clues(room)
        return player

    def _distribute_private_clues(self, room: Room) -> None:
        if not room.players:
            return

        distributed: list[Clue] = []
        for index, clue in enumerate(room.game.clues):
            if clue.visibility == "shared" or clue.owner_player_id:
                distributed.append(clue)
                continue
            distributed.append(clue.model_copy(update={"owner_player_id": room.players[index % len(room.players)].id}))
        room.game.clues = distributed

    def _unique_room_code(self) -> str:
        for _ in range(10):
            code = make_room_code()
            if not self.get_room(code):
                return code
        raise RuntimeError("Unable to generate a unique room code")

    def _connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.database_path)
        conn.row_factory = sqlite3.Row
        return conn


def room_public_payload(room: Room) -> dict:
    return json.loads(room.model_dump_json())
