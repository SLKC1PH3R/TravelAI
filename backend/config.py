from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    database_url: str = "postgresql://travelai:password@localhost:5432/travelai"
    gemini_api_key: str = ""
    data_dir: str = "/data/users"
    cors_origins_raw: str = Field(default="http://localhost:3000", alias="CORS_ORIGINS")
    admin_email: str = "jeremy.pradel92@gmail.com"

    # Compte de demonstration : doit correspondre a DEMO_EMAIL dans frontend/lib/auth.ts
    demo_email: str = "demo.voyageur@travelai.app"
    demo_login: str = "demo-john-around-the-world"
    demo_name: str = "Voyageur TravelAI"
    demo_pseudo: str = "John_around_the_world"
    demo_avatar_url: str = "/voyageur.jpg"

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins_raw.split(",") if origin.strip()]


settings = Settings()
