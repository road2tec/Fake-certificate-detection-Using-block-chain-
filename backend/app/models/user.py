"""
User model for MongoDB.
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field
from enum import Enum


class UserRole(str, Enum):
    """User role enumeration."""
    ADMIN = "admin"
    INSTITUTION = "manufacturer"  # Keeping string value for compatibility with existing DB or current routes
    VERIFIER = "consumer"        # Keeping string value for compatibility with existing DB or current routes


class UserStatus(str, Enum):
    """User status enumeration (for institutions)."""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class UserBase(BaseModel):
    """Base user model."""
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    role: UserRole = UserRole.VERIFIER


class UserCreate(UserBase):
    """User creation model."""
    password: str = Field(..., min_length=6)
    institution_name: Optional[str] = Field(None, alias="company_name")
    institution_address: Optional[str] = Field(None, alias="company_address")

    class Config:
        populate_by_name = True


class UserInDB(UserBase):
    """User model as stored in database."""
    id: str = Field(alias="_id")
    password_hash: str
    status: UserStatus = UserStatus.APPROVED
    institution_name: Optional[str] = Field(None, alias="company_name")
    institution_address: Optional[str] = Field(None, alias="company_address")
    documents: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True


class UserResponse(BaseModel):
    """User response model (without password)."""
    id: str
    name: str
    email: str
    role: UserRole
    status: UserStatus
    institution_name: Optional[str] = Field(None, alias="company_name")
    institution_address: Optional[str] = Field(None, alias="company_address")
    created_at: datetime
    
    class Config:
        from_attributes = True
        populate_by_name = True
