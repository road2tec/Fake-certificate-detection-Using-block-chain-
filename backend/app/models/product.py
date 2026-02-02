"""
Product model for MongoDB.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class ProductBase(BaseModel):
    """Base product model."""
    product_name: str = Field(..., min_length=2, max_length=200)
    brand: str = Field(..., min_length=1, max_length=100)
    batch_number: str = Field(..., min_length=1, max_length=50)
    expiry_date: str = Field(..., min_length=4, max_length=20)
    image_url: Optional[str] = None
    description: Optional[str] = None


class ProductCreate(ProductBase):
    """Product creation model."""
    pass


class ProductInDB(ProductBase):
    """Product model as stored in database."""
    id: str = Field(alias="_id")
    manufacturer_id: str
    product_hash: str
    qr_code_path: str
    blockchain_tx_hash: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True


class ProductResponse(BaseModel):
    """Product response model."""
    id: str
    product_name: str
    brand: str
    batch_number: str
    expiry_date: str
    description: Optional[str] = None
    manufacturer_id: str
    product_hash: str
    image_url: Optional[str] = None
    qr_code_path: str
    blockchain_tx_hash: Optional[str] = None
    created_at: datetime
    manufacturer_name: Optional[str] = None
    
    class Config:
        from_attributes = True
