"""
Generic response schemas.
"""
from pydantic import BaseModel
from typing import Optional, Any, List


class MessageResponse(BaseModel):
    """Simple message response."""
    message: str
    success: bool = True


class ErrorResponse(BaseModel):
    """Error response schema."""
    detail: str
    success: bool = False


class PaginatedResponse(BaseModel):
    """Paginated response schema."""
    items: List[Any]
    total: int
    page: int
    per_page: int
    pages: int


class StatsResponse(BaseModel):
    """Statistics response schema."""
    total_users: int = 0
    total_manufacturers: int = 0
    pending_manufacturers: int = 0
    total_products: int = 0
    total_verifications: int = 0
    authentic_verifications: int = 0
    fake_verifications: int = 0
