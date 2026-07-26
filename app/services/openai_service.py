import base64
import json

import httpx
from openai import AsyncOpenAI

from app.config import Settings, get_settings
from app.core.world_engine import fallback_world_consequence
from app.data.fallback_stories import fallback_game_state
from app.models.game import GameMode, GameState, MoralAxis
from app.models.room import Room


class OpenAIService:
    def __init__(self, settings: Settings | None = None) -> None:
        self.settings = settings or get_settings()
        import httpx
        custom_http_client = httpx.AsyncClient(verify=False) if self.settings.openai_api_key else None
        self.client = AsyncOpenAI(api_key=self.settings.openai_api_key, http_client=custom_http_client) if self.settings.openai_api_key else None

    async def generate_game_state(self, mode: GameMode, theme: str | None = None) -> GameState:
        fallback = fallback_game_state(mode, theme)
        if not self.client:
            return fallback

        prompt = self._game_generation_prompt(mode, theme)
        try:
            response = await self.client.chat.completions.create(
                model=self.settings.openai_text_model,
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"},
            )
            output_text = response.choices[0].message.content
            if not output_text:
                return fallback
            data = json.loads(output_text)
            data["mode"] = mode.value if hasattr(mode, 'value') else str(mode)

            # Ensure suspects have required fields
            if "suspects" in data and isinstance(data["suspects"], list):
                for idx, s in enumerate(data["suspects"]):
                    if isinstance(s, dict):
                        s["id"] = s.get("id") or f"suspect_{idx+1}"
                        s["name"] = s.get("name") or f"Suspect {idx+1}"
                        s["relationship"] = s.get("relationship") or s.get("role") or "Witness"
                        s["public_bio"] = s.get("public_bio") or s.get("bio") or "No details provided."

            # Ensure clues have required fields and normalize importance values
            IMPORTANCE_MAP = {
                "high": "critical", "critical": "critical",
                "medium": "supporting", "supporting": "supporting", "low": "supporting",
                "minor": "red_herring", "red_herring": "red_herring", "misleading": "red_herring",
            }
            if "clues" in data and isinstance(data["clues"], list):
                for idx, c in enumerate(data["clues"]):
                    if isinstance(c, dict):
                        c["id"] = c.get("id") or f"clue_{idx+1}"
                        c["title"] = c.get("title") or f"Clue {idx+1}"
                        c["body"] = c.get("body") or "Evidence collected."
                        raw_imp = str(c.get("importance", "supporting")).lower()
                        c["importance"] = IMPORTANCE_MAP.get(raw_imp, "supporting")

            return GameState.model_validate(data)
        except Exception as e:
            print(f"OpenAI generate_game_state error: {e}")
            return fallback

    async def generate_cover_image(self, title: str, story_summary: str) -> str:
        clean_prompt = f"Cinematic movie poster cover art for '{title}'. Scene: {story_summary[:200]}. Dark atmospheric lighting, dramatic composition, highly detailed digital painting, 4k resolution, no text overlay."
        if self.client:
            try:
                response = await self.client.images.generate(
                    model="dall-e-3",
                    prompt=clean_prompt,
                    n=1,
                    size="1024x1024"
                )
                if response.data and response.data[0].url:
                    return response.data[0].url
            except Exception as e:
                print(f"OpenAI DALL-E image generation error/fallback: {e}")
        
        from urllib.parse import quote_plus
        encoded = quote_plus(clean_prompt)
        return f"https://image.pollinations.ai/prompt/{encoded}?width=800&height=800&nologo=true"




    async def answer_interrogation(self, room: Room, target_id: str, question: str) -> str:
        fallback = "Their voice tightens. They answer carefully, giving just enough truth to make the room uneasy."
        if not self.client:
            return fallback

        target = next((suspect for suspect in room.game.suspects if suspect.id == target_id), None)
        shared_clues = [
            f"{clue.title}: {clue.body}"
            for clue in room.game.clues
            if clue.visibility == "shared"
        ]
        prompt = "\n".join(
            [
                "Answer as a dramatic Pocket FM audio character.",
                "Stay consistent with the room state. Do not reveal the full answer unless clues justify it.",
                f"Story: {room.game.title}",
                f"Moral question: {room.game.moral_question}",
                f"Target: {target.name if target else target_id}",
                f"Shared clues: {'; '.join(shared_clues) or 'none yet'}",
                f"Player question: {question}",
            ]
        )
        return await self._text(prompt, fallback)

    async def resolve_escape_action(self, room_context: str, history: list[str], action: str) -> str:
        fallback = "You try it, but nothing seems to happen. The room remains as it was."
        if not self.client:
            return fallback

        # Format history as a concise summary for context window
        history_str = "\n".join([f"- {h}" for h in history[-8:]]) # Last 8 interactions

        prompt = "\n".join(
            [
                "You are the Game Master for an interactive escape room audio drama.",
                "Narrate the result of the player's action based on the room context and history.",
                "If they try something clever that solves a puzzle or finds a clue, narrate their success and what they discover.",
                "If it fails or is invalid, narrate why it doesn't work.",
                "Keep it to 2-3 sentences. Be highly atmospheric and dramatic.",
                "Do not break character. Do not say 'You ask to...', just describe what happens.",
                f"Room Context: {room_context}",
                f"Recent History:\n{history_str}",
                f"Player Action: {action}",
            ]
        )
        return await self._text(prompt, fallback)

    async def resolve_story_action(self, story_context: str, history: list[str], action: str, turn_count: int, max_turns: int = 3) -> str:
        fallback = "You consider the action, but decide against it."
        if not self.client:
            return fallback

        history_str = "\n".join([f"- {h}" for h in history[-8:]])
        
        is_finale = turn_count >= max_turns

        if is_finale:
            prompt = "\n".join([
                "You are the narrator of a high-quality, cinematic interactive thriller podcast (like Spotify/PocketFM originals). This is the FINALE.",
                "Based on the story context, history, and the player's final action, write the ending of the story (3-5 sentences).",
                "CRITICAL INSTRUCTIONS FOR NARRATIVE VOICE:",
                "- Write in a gripping, immersive second-person style ('you'), but DO NOT start every sentence with 'You'.",
                "- Vary your sentence structure. Focus heavily on atmospheric details, sound, weather, and visceral sensations.",
                "- Pay strict attention to the Player Action. If they call someone, narrate the call. If they fight, narrate the fight. Do not ignore their action.",
                "Conclude the narrative arc. End with a thematic title on a new line in the format: '[ENDING] Title'.",
                "Then on a new line, write a moral lesson based on the user's choices in the format: 'Moral: [The moral lesson]'.",
                "Make it cinematic and emotionally resonant.",
                f"Story Hook: {story_context}",
                f"Recent History:\n{history_str}",
                f"Player Final Action: {action}",
            ])
        else:
            prompt = "\n".join([
                "You are the narrator of a high-quality, cinematic interactive thriller podcast (like Spotify/PocketFM originals).",
                "CRITICAL INSTRUCTIONS FOR NARRATIVE VOICE:",
                "- Write in a gripping, immersive second-person style ('you'), but DO NOT start every sentence with 'You'.",
                "- Avoid robotic phrasing like 'You decide to...' or 'You see...'. Instead of 'You see a man', write 'A man steps out of the shadows.'",
                "- Vary your sentence structure. Focus heavily on atmospheric details, the environment, and tension.",
                "- Carefully read the Player Action and DIRECTLY execute it. Do not ignore it or default to a generic response.",
                "Narrate the immediate consequences of the player's action (2-3 sentences).",
                "Decide if the user's action naturally ends the story (e.g. they get themselves killed, they surrender, they completely resolve the conflict).",
                "If it DOES end the story, conclude it, and end your response with '[ENDING] Title' and 'Moral: [Moral lesson]'.",
                "If it DOES NOT end the story, end the narration by presenting a new micro-dilemma or waiting for their next move.",
                "Keep it dramatic and atmospheric.",
                f"Story Hook: {story_context}",
                f"Recent History:\n{history_str}",
                f"Player Action: {action}",
            ])

        return await self._text(prompt, fallback)

    async def resolve_companion_chat(self, story_title: str, story_context_so_far: str, question: str) -> str:
        fallback = "I'm not sure. Let's keep listening to find out."
        if not self.client:
            return fallback

        prompt = "\n".join([
            f"You are an AI Co-Pilot for a listener enjoying the audio show '{story_title}'.",
            "The user is asking a question about the story or characters.",
            "CRITICAL: You only know what has happened in the story UP TO THIS EXACT POINT. Do not hallucinate future events. Do not spoil anything that hasn't been explicitly stated in the context.",
            "Answer the question concisely (1-3 sentences) based ONLY on the following context:",
            f"---\nContext so far:\n{story_context_so_far}\n---",
            f"User Question: {question}",
        ])
        return await self._text(prompt, fallback)

    async def resolve_spoken_decision(self, room: Room, spoken_text: str) -> tuple[str, MoralAxis]:
        fallback = fallback_world_consequence(room, spoken_text)
        if not self.client:
            return fallback

        prompt = "\n".join(
            [
                "Convert this spoken story decision into one permanent world consequence.",
                "Return JSON with keys consequence and moral_axis.",
                "moral_axis must be one of: truth, loyalty, mercy, ambition, justice, sacrifice.",
                f"Story: {room.game.title}",
                f"Existing world rules: {'; '.join(rule.text for rule in room.game.world_rules) or 'none'}",
                f"Player said: {spoken_text}",
            ]
        )
        try:
            response_text = await self._text(prompt, "")
            payload = json.loads(response_text)
            return payload["consequence"], MoralAxis(payload["moral_axis"])
        except Exception:
            return fallback

    async def create_accusation_reveal(self, room: Room, accused_id: str, theory: str, moral_choice: str) -> str:
        accused = next((suspect for suspect in room.game.suspects if suspect.id == accused_id), None)
        fallback = (
            f"Finale: the group chooses to {moral_choice}. The truth lands heavily, and "
            f"{accused.name if accused else 'the accused'} becomes the face of a mystery larger than one crime."
        )
        if not self.client:
            return fallback

        prompt = "\n".join(
            [
                "Write a short cinematic Pocket FM finale reveal.",
                "Include the emotional cost of the group's moral choice.",
                f"Story: {room.game.title}",
                f"Accused: {accused.name if accused else accused_id}",
                f"Theory: {theory}",
                f"Moral choice: {moral_choice}",
            ]
        )
        return await self._text(prompt, fallback)

    async def realtime_client_secret(self, room: Room) -> dict:
        if not self.settings.openai_api_key:
            raise ValueError("OPENAI_API_KEY is required for realtime voice sessions.")

        async with httpx.AsyncClient(timeout=20, verify=False) as client:
            response = await client.post(
                "https://api.openai.com/v1/realtime/client_secrets",
                headers={
                    "Authorization": f"Bearer {self.settings.openai_api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "session": {
                        "type": "realtime",
                        "model": self.settings.openai_realtime_model,
                        "voice": "marin",
                        "instructions": (
                            "You are a voice character inside PocketCases. Stay dramatic, concise, "
                            f"and consistent with this story: {room.game.title}. "
                            f"Moral question: {room.game.moral_question}"
                        ),
                    }
                },
            )
            response.raise_for_status()
            return response.json()

    async def synthesize_narration(self, text: str, voice: str = "marin") -> str:
        if not self.settings.openai_api_key:
            raise ValueError("OPENAI_API_KEY is required for narration audio.")

        async with httpx.AsyncClient(timeout=60, verify=False) as client:
            response = await client.post(
                "https://api.openai.com/v1/audio/speech",
                headers={
                    "Authorization": f"Bearer {self.settings.openai_api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": self.settings.openai_tts_model,
                    "voice": voice,
                    "input": text,
                    "response_format": "mp3",
                },
            )
            response.raise_for_status()
            audio_bytes = response.content
        return base64.b64encode(audio_bytes).decode("utf-8")

    async def _text(self, prompt: str, fallback: str) -> str:
        if not self.client:
            return fallback
        try:
            response = await self.client.chat.completions.create(
                model=self.settings.openai_text_model,
                messages=[{"role": "user", "content": prompt}]
            )
            return response.choices[0].message.content or fallback
        except Exception as e:
            print(f"OpenAI _text failed: {e}")
            return fallback

    def _game_generation_prompt(self, mode: GameMode, theme: str | None) -> str:
        parts = [
            "Create a Pocket FM-style interactive audio game state in valid JSON.",
            "You MUST return a JSON object with keys: mode, title, episode_hook, moral_question, suspects, clues.",
            "CRITICAL - PREFACE DETAIL: episode_hook MUST be a rich, atmospheric, 3 to 4 paragraph story preface (at least 150 words). Describe the stormy atmosphere, the exact crime scene/situation, the victim, the high stakes, and the immediate tension.",
            "CRITICAL: ALWAYS use Indian names for all characters (e.g., Ananya, Vikram, Rahul, Kabir, Priya, Major Sharma).",
            "CRITICAL: ALWAYS set the story in vivid Indian locations or contexts (e.g., a deserted stretch of the Mumbai-Pune Expressway, a foggy heritage mansion in Mussoorie, chaotic alleys of Old Delhi).",
            "Ensure the content feels extremely rich, premium, and well-written.",
        ]

        if mode == GameMode.MURDER_CASE:
            parts.extend(
                [
                    "Mode: murder_case.",
                    "Include at least 3 suspects with id, name, relationship, public_bio.",
                    "Include clues with id, title, body, importance.",
                ]
            )
        elif mode == GameMode.ESCAPE_CASE:
            parts.extend(
                [
                    "Mode: escape_case.",
                    "Include locked puzzles, audio-native clues, object clues, and an exit condition.",
                ]
            )
        else:
            parts.extend(
                [
                    "Mode: living_story.",
                    "Every spoken decision can permanently alter relationships, laws, geography, or future endings.",
                ]
            )

        if theme:
            parts.append(f"Host theme: {theme}")
        return "\n".join(parts)
