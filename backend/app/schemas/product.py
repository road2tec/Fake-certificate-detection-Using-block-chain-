"""
Product-related Pydantic schemas.
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ProductRegister(BaseModel):
    """Product registration request schema."""
    product_name: str = Field(..., min_length=2, max_length=200)
    brand: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None


class ProductVerify(BaseModel):
    """Product verification request schema."""
    product_hash: str = Field(..., min_length=64, max_length=64)


class ProductResponse(BaseModel):
    """Product response schema."""
    id: str
    product_name: str
    brand: str
    description: Optional[str] = None
    manufacturer_id: str
    manufacturer_name: Optional[str] = None
    product_hash: str
    qr_code_path: str
    blockchain_tx_hash: Optional[str] = None
    created_at: datetime


class VerificationResponse(BaseModel):
    """Verification result response schema."""
    is_authentic: bool
    message: str
    product_details: Optional[ProductResponse] = None
    blockchain_verified: bool = False
    verification_id: Optional[str] = None
