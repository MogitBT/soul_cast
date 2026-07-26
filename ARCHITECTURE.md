# PocketCases Backend Architecture

This backend powers **PocketCases**, a Pocket FM-style AI entertainment tab with three interactive modes: Murder Case, Escape Case, and Story as a Game.

## Runtime

- **Language:** Python
- **Framework:** FastAPI
- **Realtime:** `python-socketio`
- **Storage:** SQLite
- **Validation:** Pydantic
- **AI adapter:** OpenAI Python SDK plus HTTP calls for realtime and speech endpoints

## Request Flow

```text
Frontend
  -> FastAPI route
  -> Pydantic request schema
  -> RoomStore / OpenAIService / core engine
  -> SQLite room payload
  -> JSON response
```

Realtime room updates use Socket.IO:

```text
Frontend socket event
  -> socket_app.py
  -> RoomStore mutation
  -> room:state broadcast
```

## Folders

```text
app/
  api/
    deps.py       dependency helpers
    health.py     health check
    modes.py      game mode metadata
    rooms.py      room, clue, interrogation, decision APIs
    routes.py     API router composition
    voice.py      narration and realtime token APIs
  core/
    clue_engine.py     player clue visibility
    moral_engine.py    moral-axis summary
    quality_gate.py    generated-game validation
    world_engine.py    fallback world consequences
  data/
    fallback_stories.py  demo-safe stories
    seed_modes.py        mode labels, roles, accents
  models/
    game.py       domain game models
    player.py     player and role models
    room.py       persisted room model
  schemas/
    game_schema.py
    room_schema.py
    voice_schema.py
  services/
    openai_service.py  AI generation, speech, realtime hooks
    room_store.py      SQLite persistence
  sockets/
    socket_app.py      Socket.IO event handlers
  config.py
  main.py
```

## Persistence

SQLite stores one row per room.

```text
rooms
  code TEXT PRIMARY KEY
  payload TEXT NOT NULL
  created_at TEXT NOT NULL
  updated_at TEXT NOT NULL
```

The `payload` column stores the full Pydantic `Room` as JSON. This is intentional for the hackathon: it keeps iteration fast and supports all current game state without migrations.

## Game Modes

### Murder Case

- Generates or loads a mystery premise.
- Assigns players asymmetric roles.
- Splits clues privately.
- Lets players share clues to a shared case board.
- Supports suspect interrogation.
- Ends with accusation and moral reveal.

### Escape Case

- Uses the same room and clue system.
- Adds locked puzzles and solution hints.
- Supports co-op clue sharing.
- Designed around audio-native clues.

### Story as a Game

- Accepts typed or spoken decisions.
- Converts each decision into a permanent `WorldRule`.
- Stores the world rule in SQLite.
- Future scenes can use all saved rules as story physics.

## OpenAI Hooks

`OpenAIService` handles:

- `generate_game_state`
- `answer_interrogation`
- `resolve_spoken_decision`
- `create_accusation_reveal`
- `realtime_client_secret`
- `synthesize_narration`

If `OPENAI_API_KEY` is missing, core gameplay still works with fallback stories.

## Main Endpoints

```text
GET    /api/health
GET    /api/pocketcases/modes
GET    /api/pocketcases/rooms
POST   /api/pocketcases/rooms
GET    /api/pocketcases/rooms/{code}
GET    /api/pocketcases/rooms/{code}/players/{player_id}
POST   /api/pocketcases/rooms/{code}/join
POST   /api/pocketcases/rooms/{code}/start
POST   /api/pocketcases/rooms/{code}/share-clue
POST   /api/pocketcases/rooms/{code}/interrogate
POST   /api/pocketcases/rooms/{code}/decision
POST   /api/pocketcases/rooms/{code}/accuse
POST   /api/pocketcases/rooms/{code}/voice/realtime-token
POST   /api/pocketcases/voice/narration
```
