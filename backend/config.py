import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = os.getenv(
        "DATABASE_URL", "postgresql://travelai:password@localhost:5432/travelai"
    )
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    data_dir: str = os.getenv("DATA_DIR", "/data/users")
    cors_origins: list[str] = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

    class Config:
        env_file = ".env"


settings = Settings()
