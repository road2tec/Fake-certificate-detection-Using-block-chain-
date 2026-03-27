"""
Application settings loaded from environment variables.
"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application configuration settings."""
    
    # MongoDB
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "fake_certificate_db"
    
    # JWT
    secret_key: str = "fake-product-blockchain-secret-key-2024"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440
    
    # Blockchain
    ganache_url: str = "http://127.0.0.1:7545"
    contract_address: str = ""
    private_key: str = ""
    
    # Admin
    admin_email: str = "admin@example.com"
    admin_password: str = "admin123"
    admin_name: str = "System Admin"
    
    class Config:
        env_file = ".env"
        extra = "allow"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
