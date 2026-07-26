from app.models.game import Clue
from app.models.room import Room


def private_clues_for_player(room: Room, player_id: str) -> list[Clue]:
    return [
        clue
        for clue in room.game.clues
        if clue.visibility == "shared" or clue.owner_player_id == player_id
    ]


def shared_case_board(room: Room) -> list[Clue]:
    return [clue for clue in room.game.clues if clue.visibility == "shared"]
