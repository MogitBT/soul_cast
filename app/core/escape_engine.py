from app.models.game import DiscoveryState, Puzzle
from typing import Tuple

class EscapeEngine:
    def __init__(self, puzzle_graph: list[Puzzle]):
        self.puzzle_graph = {p.id: p for p in puzzle_graph}

    def process_player_message(
        self, state: DiscoveryState, message: str
    ) -> Tuple[DiscoveryState, str]:
        # 1. Intent Classification
        intent = self._classify_intent(message)
        
        # 2. Lookup against puzzle graph
        response_text = ""
        if intent["type"] == "action":
            target_node_id = intent.get("target_id")
            if target_node_id and target_node_id in self.puzzle_graph:
                # Check prerequisites (simplified logic)
                prereqs_met = True
                if prereqs_met and target_node_id not in state.discovered:
                    state.discovered.append(target_node_id)
                    response_text = f"You unlocked {self.puzzle_graph[target_node_id].title}!"
                    state.turns_since_progress = 0
                else:
                    response_text = "It doesn't seem to work yet."
                    state.attempted_but_failed.append(target_node_id)
                    state.turns_since_progress += 1
            else:
                response_text = "You can't do that here."
                state.turns_since_progress += 1
        else:
            response_text = "You ponder the room."
            state.turns_since_progress += 1
            
        # 3. Adaptive difficulty check
        if state.turns_since_progress > 3:
            state.hint_level += 1
            response_text += f"\nHint: Look closer at the {list(self.puzzle_graph.values())[0].title}."
            
        return state, response_text
        
    def _classify_intent(self, message: str) -> dict:
        # Mock classifier
        if "open" in message.lower() or "use" in message.lower():
            return {"type": "action", "target_id": "puzzle1"}
        return {"type": "chat"}
