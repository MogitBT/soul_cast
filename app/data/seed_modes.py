from app.models.game import GameMode
from app.models.player import PlayerRole

MODE_CARDS = {
    GameMode.MURDER_CASE: {
        "label": "Murder Case",
        "tagline": "A fresh AI case every session.",
        "shelf_copy": "Interrogate suspects, trade clues, and choose what justice should cost.",
        "accent": "#ff7a1a",
        "roles": [
            PlayerRole.DETECTIVE,
            PlayerRole.JOURNALIST,
            PlayerRole.INSIDER,
            PlayerRole.FAMILY_FRIEND,
        ],
    },
    GameMode.ESCAPE_CASE: {
        "label": "Escape Case",
        "tagline": "Audio clues. Split puzzles. One exit.",
        "shelf_copy": "Solve locked rooms where each friend hears or sees a different part of the answer.",
        "accent": "#ffc247",
        "roles": [
            PlayerRole.NAVIGATOR,
            PlayerRole.LISTENER,
            PlayerRole.INSIDER,
            PlayerRole.DETECTIVE,
        ],
    },
    GameMode.LIVING_STORY: {
        "label": "Story as a Game",
        "tagline": "Speak once. The world remembers forever.",
        "shelf_copy": "Every spoken decision permanently changes laws, relationships, locations, and endings.",
        "accent": "#f04f4f",
        "roles": [
            PlayerRole.WORLDKEEPER,
            PlayerRole.LISTENER,
            PlayerRole.JOURNALIST,
            PlayerRole.FAMILY_FRIEND,
        ],
    },
}
