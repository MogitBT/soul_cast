from app.models.game import Clue, GameMode, GameState, Puzzle, Suspect


def fallback_game_state(mode: GameMode, theme: str | None = None) -> GameState:
    if mode == GameMode.ESCAPE_CASE:
        return GameState(
            mode=mode,
            title=theme or "Escape the Vanishing Studio",
            episode_hook=(
                "A hit audio studio goes silent during a live finale, and every locked room hides "
                "a sound-based clue."
            ),
            moral_question="Do you escape fast, or risk the final door to save the missing narrator?",
            clues=[
                Clue(
                    id="clue_echo_note",
                    title="Echo Note",
                    body="A whispered number repeats behind the theme music: 7-1-9.",
                    importance="critical",
                ),
                Clue(
                    id="clue_burned_script",
                    title="Burned Script Page",
                    body="The last line says, 'The door opens only when the unheard truth is played backward.'",
                ),
            ],
            puzzles=[
                Puzzle(
                    id="puzzle_soundbooth",
                    title="Soundbooth Lock",
                    clue_ids=["clue_echo_note", "clue_burned_script"],
                    solution_hint="Use the repeated number with the reversed-audio instruction.",
                )
            ],
        )

    if mode == GameMode.LIVING_STORY:
        return GameState(
            mode=mode,
            title=theme or "The Kingdom That Remembers",
            episode_hook=(
                "Every spoken decision becomes law in a fantasy kingdom that never forgets what "
                "listeners choose."
            ),
            moral_question="Will power make the world safer, or only easier to control?",
            shared_narration=[
                "The city gates wake when you speak. Every promise becomes architecture. Every betrayal becomes weather."
            ],
        )

    theme_title = theme.strip().title() if theme else "The Mystery at Midnight"
    theme_hook = (
        f"A dramatic investigation unfolds around '{theme_title}'. The rain pours down as investigators assemble at the crime scene. "
        f"Secrets run deep, and every witness has something to hide. One of them holds the key to the truth."
        if theme else
        "A beloved voice actor dies minutes before recording the finale of Pocket FM's biggest thriller."
    )

    return GameState(
        mode=mode,
        title=theme_title,
        episode_hook=theme_hook,
        moral_question="Is justice still justice if exposing the truth destroys innocent lives?",
        suspects=[
            Suspect(
                id="suspect_1",
                name="Rahul Deshmukh",
                relationship="Business Partner",
                public_bio=f"Was seen arguing near the location shortly before the events of '{theme_title}' transpired.",
                voice="marin",
            ),
            Suspect(
                id="suspect_2",
                name="Ananya Joshi",
                relationship="Close Associate",
                public_bio="Claims to have been away, but her story has a 20-minute gap that no one can confirm.",
                voice="cedar",
            ),
            Suspect(
                id="suspect_3",
                name="Vikram Patil",
                relationship="Rival",
                public_bio="Had a major financial dispute with the victim and stands to benefit directly.",
                voice="shimmer",
            ),
        ],
        clues=[
            Clue(
                id="clue_1",
                title="Critical Evidence",
                body=f"A discarded item found at the scene linking back to the key timeline of {theme_title}.",
                importance="critical",
            ),
            Clue(
                id="clue_2",
                title="Witness Statement",
                body="A bystander reported seeing a dark vehicle leaving the scene at 3:15 AM.",
                importance="supporting",
            ),
            Clue(
                id="clue_3",
                title="Anonymized Note",
                body="A torn paper with a handwritten warning, though the handwriting is unverified.",
                importance="red_herring",
            ),
        ],
    )
