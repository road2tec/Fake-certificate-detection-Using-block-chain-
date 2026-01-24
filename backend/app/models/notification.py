"""
Notification model for MongoDB.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from enum import Enum


class NotificationType(str, Enum):
    """Notification type enumeration."""
    APPROVAL = "approval"
    REJECTION = "rejection"
    VERIFICATION = "verification"
    ALERT = "alert"
    INFO = "info"


class NotificationBase(BaseModel):
    """Base notification model."""
    message: str
    type: NotificationType = NotificationType.INFO


class NotificationCreate(NotificationBase):
    """Notification creation model."""
    user_id: str


class NotificationInDB(NotificationBase):
    """Notification model as stored in database."""
    id: str = Field(alias="_id")
    user_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_read: bool = False
    
    class Config:
        populate_by_name = True


class NotificationResponse(BaseModel):
    """Notification response model."""
    id: str
    message: str
    type: NotificationType
    user_id: str
    created_at: datetime
    is_read: bool
    
    class Config:
        from_attributes = True
