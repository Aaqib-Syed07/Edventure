from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    supabase_url: str = "https://placeholder.supabase.co"
    supabase_key: str = "placeholder_key"
    supabase_service_key: str = "placeholder_service_key"
    jwt_secret_key: str = "secret_key_for_jwt_tokens_change_in_production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 43200
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()