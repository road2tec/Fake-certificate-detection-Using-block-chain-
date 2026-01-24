"""
Verification model for MongoDB.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from enum import Enum


class VerificationResult(str, Enum):
    """Verification result enumeration."""
    AUTHENTIC = "authentic"
    FAKE = "fake"
    NOT_FOUND = "not_found"


class VerificationBase(BaseModel):
    """Base verification model."""
    product_hash: str


class VerificationCreate(VerificationBase):
    """Verification creation model."""
    pass


class VerificationInDB(VerificationBase):
    """Verification model as stored in database."""
    id: str = Field(alias="_id")
    consumer_id: Optional[str] = None
    result: VerificationResult
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True


class VerificationResponse(BaseModel):
    """Verification response model."""
    id: str
    product_hash: str
    consumer_id: Optional[str] = None
    result: VerificationResult
    timestamp: datetime
    product_details: Optional[dict] = None
    
    class Config:
        from_attributes = True
