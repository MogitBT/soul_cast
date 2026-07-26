from app.models.game import GameMode, GameState


def validate_game_state(game: GameState) -> tuple[bool, list[str]]:
    issues: list[str] = []

    if not game.title.strip():
        issues.append("Game title is missing.")
    if not game.episode_hook.strip():
        issues.append("Episode hook is missing.")
    if not game.moral_question.strip():
        issues.append("Moral question is missing.")

    if game.mode == GameMode.MURDER_CASE:
        if len(game.suspects) < 2:
            issues.append("Murder Case needs at least two suspects.")
        critical_clues = [clue for clue in game.clues if clue.importance == "critical"]
        if len(critical_clues) < 1:
            issues.append("Murder Case needs at least one critical clue.")

    if game.mode == GameMode.ESCAPE_CASE:
        if len(game.puzzles) < 1:
            issues.append("Escape Case needs at least one puzzle.")
        if len(game.clues) < 2:
            issues.append("Escape Case needs at least two split clues.")

    if game.mode == GameMode.LIVING_STORY:
        if not game.shared_narration:
            issues.append("Living Story needs an opening narration.")

    return len(issues) == 0, issues
