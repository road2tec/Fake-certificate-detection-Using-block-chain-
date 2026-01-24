"""
User-related Pydantic schemas.
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserSignup(BaseModel):
    """User signup request schema."""
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: str = Field(default="consumer", pattern="^(consumer|manufacturer)$")
    company_name: Optional[str] = None
    company_address: Optional[str] = None


class UserLogin(BaseModel):
    """User login request schema."""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """JWT token response schema."""
    access_token: str
    token_type: str = "bearer"
    user: dict


class UserProfile(BaseModel):
    """User profile response schema."""
    id: str
    name: str
    email: str
    role: str
    status: str
    company_name: Optional[str] = None
    company_address: Optional[str] = None
    created_at: datetime
