from app.models.game import MoralAxis
from app.models.room import Room


def fallback_world_consequence(room: Room, spoken_text: str) -> tuple[str, MoralAxis]:
    lowered = spoken_text.lower()

    if any(word in lowered for word in ["forgive", "save", "mercy", "protect"]):
        axis = MoralAxis.MERCY
    elif any(word in lowered for word in ["truth", "reveal", "confess", "honest"]):
        axis = MoralAxis.TRUTH
    elif any(word in lowered for word in ["punish", "justice", "court", "expose"]):
        axis = MoralAxis.JUSTICE
    elif any(word in lowered for word in ["power", "king", "rule", "win"]):
        axis = MoralAxis.AMBITION
    else:
        axis = MoralAxis.LOYALTY

    consequence = (
        f"Because the group said '{spoken_text}', {room.game.title} permanently changes: "
        f"future scenes must honor this choice as a law of {axis.value}."
    )
    return consequence, axis
