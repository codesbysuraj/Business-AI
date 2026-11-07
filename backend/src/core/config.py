"""
BusinessOS AI — Application Configuration
"""
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Database
    database_url: str = "postgresql+asyncpg://businessos:businessos_pass@localhost:5432/businessos_db"

    # Auth
    secret_key: str = "dev-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440

    # CORS
    cors_origins: List[str] = ["http://localhost:3000"]

    # AI
    llm_provider: str = "gemini"
    gemini_api_key: str = ""
    openai_api_key: str = ""

    # Embeddings
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    faiss_index_path: str = "./data/faiss_index"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
