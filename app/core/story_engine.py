from app.models.game import PlayerSignal
import time
from typing import List

class StoryEngine:
    def __init__(self):
        self.archetypes = ["redemption", "betrayal", "bittersweet", "triumphant"]

    def log_signal(self, choice_id: str, selected: str, latency_ms: int) -> PlayerSignal:
        return PlayerSignal(
            choice_id=choice_id,
            selected=selected,
            response_latency_ms=latency_ms,
            timestamp=str(time.time())
        )

    def trigger_climax(self, signals: List[PlayerSignal], history_summary: str = "") -> str:
        """
        Classifies signals into one of the archetypes.
        """
        # Mock classification
        if any(s.selected == "confront" for s in signals):
            selected_archetype = "triumphant"
        elif any(s.selected == "forgive" for s in signals):
            selected_archetype = "redemption"
        else:
            selected_archetype = "bittersweet"
            
        return selected_archetype
