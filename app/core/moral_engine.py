from collections import Counter

from app.models.game import MoralAxis
from app.models.room import Room


def moral_summary(room: Room) -> dict[str, str | int]:
    if not room.game.decisions:
        return {
            "dominant_axis": MoralAxis.TRUTH.value,
            "decision_count": 0,
            "summary": "No moral pattern has emerged yet.",
        }

    counts = Counter(decision.moral_axis for decision in room.game.decisions)
    dominant_axis, count = counts.most_common(1)[0]
    return {
        "dominant_axis": dominant_axis.value,
        "decision_count": len(room.game.decisions),
        "summary": f"The group is leaning toward {dominant_axis.value} after {count} major choice(s).",
    }
