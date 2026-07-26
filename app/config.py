from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    openai_api_key: str = ""
    openai_text_model: str = "gpt-4.1-mini"
    openai_realtime_model: str = "gpt-realtime"
    openai_tts_model: str = "gpt-4o-mini-tts"
    database_path: str = "/tmp/pocketcases.sqlite3"
    client_origin: str = "http://localhost:5173"
    port: int = 8080

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


@lru_cache
def get_settings() -> Settings:
    return Settings()
