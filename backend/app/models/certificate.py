"""
Certificate model for MongoDB.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class CertificateBase(BaseModel):
    """Base certificate model."""
    student_name: str = Field(..., min_length=2, max_length=200)
    institute_name: str = Field(..., min_length=1, max_length=100)
    course_name: str = Field(..., min_length=1, max_length=150)
    certificate_id: str = Field(..., min_length=1, max_length=50)
    issue_date: str = Field(..., min_length=4, max_length=20)
    image_url: Optional[str] = None
    description: Optional[str] = None


class CertificateCreate(CertificateBase):
    """Certificate creation model."""
    pass


class CertificateInDB(CertificateBase):
    """Certificate model as stored in database."""
    id: str = Field(alias="_id")
    issuer_id: str
    certificate_hash: str
    qr_code_path: str
    blockchain_tx_hash: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True


class CertificateResponse(BaseModel):
    """Certificate response model."""
    id: str
    student_name: str
    institute_name: str
    course_name: str
    certificate_id: str
    issue_date: str
    description: Optional[str] = None
    issuer_id: str
    certificate_hash: str
    image_url: Optional[str] = None
    qr_code_path: str
    blockchain_tx_hash: Optional[str] = None
    created_at: datetime
    issuer_name: Optional[str] = None
    
    class Config:
        from_attributes = True
