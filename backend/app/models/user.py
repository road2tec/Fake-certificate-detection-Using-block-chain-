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
    MANUFACTURER = "manufacturer"
    CONSUMER = "consumer"


class UserStatus(str, Enum):
    """User status enumeration (for manufacturers)."""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class UserBase(BaseModel):
    """Base user model."""
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    role: UserRole = UserRole.CONSUMER


class UserCreate(UserBase):
    """User creation model."""
    password: str = Field(..., min_length=6)
    company_name: Optional[str] = None
    company_address: Optional[str] = None


class UserInDB(UserBase):
    """User model as stored in database."""
    id: str = Field(alias="_id")
    password_hash: str
    status: UserStatus = UserStatus.APPROVED
    company_name: Optional[str] = None
    company_address: Optional[str] = None
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
    company_name: Optional[str] = None
    company_address: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True
