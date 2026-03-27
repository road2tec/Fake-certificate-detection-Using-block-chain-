"""
Certificate-related Pydantic schemas.
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class CertificateIssue(BaseModel):
    """Certificate issuance request schema."""
    student_name: str = Field(..., min_length=2, max_length=200)
    institute_name: str = Field(..., min_length=1, max_length=100)
    course_name: str = Field(..., min_length=1, max_length=150)
    certificate_id: str = Field(..., min_length=1, max_length=50)
    issue_date: str = Field(..., min_length=4, max_length=20)
    description: Optional[str] = None


class CertificateVerify(BaseModel):
    """Certificate verification request schema."""
    certificate_hash: str = Field(...)


class CertificateResponse(BaseModel):
    """Certificate response schema."""
    id: str
    student_name: str
    institute_name: str
    course_name: str
    certificate_id: str
    issue_date: str
    description: Optional[str] = None
    issuer_id: str
    issuer_name: Optional[str] = None
    certificate_hash: str
    image_url: Optional[str] = None
    qr_code_path: str
    blockchain_tx_hash: Optional[str] = None
    created_at: datetime


class VerificationResponse(BaseModel):
    """Verification result response schema."""
    is_authentic: bool
    message: str
    certificate_details: Optional[CertificateResponse] = None
    blockchain_verified: bool = False
    verification_id: Optional[str] = None
