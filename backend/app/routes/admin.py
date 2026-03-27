"""
Admin routes for institution approval and system management.
"""
from fastapi import APIRouter, HTTPException, status, Depends, Query
from datetime import datetime
from bson import ObjectId
from typing import Optional, List
from ..config.database import (
    get_users_collection,
    get_products_collection,
    get_verifications_collection,
    get_notifications_collection
)
from ..utils.auth import get_current_admin
from ..schemas.response import MessageResponse, StatsResponse

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/stats", response_model=StatsResponse)
async def get_dashboard_stats(current_admin: dict = Depends(get_current_admin)):
    """Get dashboard statistics for admin."""
    users = get_users_collection()
    products = get_products_collection()
    verifications = get_verifications_collection()
    
    # Count users
    total_users = await users.count_documents({})
    total_manufacturers = await users.count_documents({"role": "manufacturer"})
    pending_manufacturers = await users.count_documents({"role": "manufacturer", "status": "pending"})
    
    # Count products
    total_products = await products.count_documents({})
    
    # Count verifications
    total_verifications = await verifications.count_documents({})
    authentic_verifications = await verifications.count_documents({"result": "authentic"})
    fake_verifications = await verifications.count_documents({"result": "fake"})
    
    return StatsResponse(
        total_users=total_users,
        total_manufacturers=total_manufacturers,
        pending_manufacturers=pending_manufacturers,
        total_products=total_products,
        total_verifications=total_verifications,
        authentic_verifications=authentic_verifications,
        fake_verifications=fake_verifications
    )


@router.get("/manufacturers")
async def get_institutions(
    status_filter: Optional[str] = Query(None, alias="status"),
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    current_admin: dict = Depends(get_current_admin)
):
    """Get list of institutions with optional status filter."""
    users = get_users_collection()
    
    # Build query
    query = {"role": "manufacturer"}
    if status_filter and status_filter in ["pending", "approved", "rejected"]:
        query["status"] = status_filter
    
    # Get total count
    total = await users.count_documents(query)
    
    # Get paginated results
    skip = (page - 1) * per_page
    cursor = users.find(query).skip(skip).limit(per_page).sort("created_at", -1)
    
    institutions = []
    async for user in cursor:
        institutions.append({
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "institution_name": user.get("company_name"),
            "institution_address": user.get("company_address"),
            "status": user.get("status", "pending"),
            "created_at": user.get("created_at")
        })
    
    return {
        "items": institutions,
        "total": total,
        "page": page,
        "per_page": per_page,
        "pages": (total + per_page - 1) // per_page
    }


@router.put("/approve/{institution_id}", response_model=MessageResponse)
async def approve_institution(
    institution_id: str,
    current_admin: dict = Depends(get_current_admin)
):
    """Approve a pending institution."""
    users = get_users_collection()
    notifications = get_notifications_collection()
    
    # Validate ObjectId
    try:
        obj_id = ObjectId(institution_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid institution ID"
        )
    
    # Find institution
    institution = await users.find_one({"_id": obj_id, "role": "manufacturer"})
    if not institution:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Institution not found"
        )
    
    if institution.get("status") == "approved":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Institution is already approved"
        )
    
    # Update status
    await users.update_one(
        {"_id": obj_id},
        {"$set": {"status": "approved", "approved_at": datetime.utcnow()}}
    )
    
    # Create notification
    await notifications.insert_one({
        "message": "Your institution account has been approved! You can now login and issue certificates.",
        "type": "approval",
        "user_id": institution_id,
        "created_at": datetime.utcnow(),
        "is_read": False
    })
    
    return MessageResponse(message=f"Institution {institution['name']} has been approved")


@router.put("/reject/{institution_id}", response_model=MessageResponse)
async def reject_institution(
    institution_id: str,
    reason: Optional[str] = None,
    current_admin: dict = Depends(get_current_admin)
):
    """Reject a pending institution."""
    users = get_users_collection()
    notifications = get_notifications_collection()
    
    # Validate ObjectId
    try:
        obj_id = ObjectId(institution_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid institution ID"
        )
    
    # Find institution
    institution = await users.find_one({"_id": obj_id, "role": "manufacturer"})
    if not institution:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Institution not found"
        )
    
    if institution.get("status") == "rejected":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Institution is already rejected"
        )
    
    # Update status
    await users.update_one(
        {"_id": obj_id},
        {"$set": {"status": "rejected", "rejected_at": datetime.utcnow(), "rejection_reason": reason}}
    )
    
    # Create notification
    message = "Your institution account has been rejected."
    if reason:
        message += f" Reason: {reason}"
    
    await notifications.insert_one({
        "message": message,
        "type": "rejection",
        "user_id": institution_id,
        "created_at": datetime.utcnow(),
        "is_read": False
    })
    
    return MessageResponse(message=f"Institution {institution['name']} has been rejected")


@router.get("/products")
async def get_all_certificates(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    current_admin: dict = Depends(get_current_admin)
):
    """Get all registered certificates."""
    products = get_products_collection()
    users = get_users_collection()
    
    # Get total count
    total = await products.count_documents({})
    
    # Get paginated results
    skip = (page - 1) * per_page
    cursor = products.find({}).skip(skip).limit(per_page).sort("created_at", -1)
    
    certificate_list = []
    async for cert in cursor:
        # Get institution name
        institution = await users.find_one({"_id": ObjectId(cert["manufacturer_id"])})
        institute_name = institution["name"] if institution else "Unknown"
        
        certificate_list.append({
            "id": str(cert["_id"]),
            "certificate_name": cert.get("student_name") or cert.get("product_name"),
            "course_name": cert.get("course_name") or cert.get("brand"),
            "description": cert.get("description"),
            "institution_id": cert["manufacturer_id"],
            "institution_name": institute_name,
            "certificate_hash": cert.get("certificate_hash") or cert.get("product_hash"),
            "qr_code_path": cert["qr_code_path"],
            "blockchain_tx_hash": cert.get("blockchain_tx_hash"),
            "created_at": cert.get("created_at")
        })
    
    return {
        "items": certificate_list,
        "total": total,
        "page": page,
        "per_page": per_page,
        "pages": (total + per_page - 1) // per_page
    }


@router.get("/verifications")
async def get_all_verifications(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    result_filter: Optional[str] = Query(None, alias="result"),
    current_admin: dict = Depends(get_current_admin)
):
    """Get verification history."""
    verifications = get_verifications_collection()
    products = get_products_collection()
    users = get_users_collection()
    
    # Build query
    query = {}
    if result_filter and result_filter in ["authentic", "fake", "not_found"]:
        query["result"] = result_filter
    
    # Get total count
    total = await verifications.count_documents(query)
    
    # Get paginated results
    skip = (page - 1) * per_page
    cursor = verifications.find(query).skip(skip).limit(per_page).sort("timestamp", -1)
    
    verification_list = []
    async for verification in cursor:
        # Get certificate details
        cert = await products.find_one({"product_hash": verification["product_hash"]})
        certificate_name = (cert.get("student_name") or cert.get("product_name")) if cert else "Unknown"
        
        # Get verifier name if available
        verifier_name = None
        if verification.get("consumer_id"):
            verifier = await users.find_one({"_id": ObjectId(verification["consumer_id"])})
            verifier_name = verifier["name"] if verifier else None
        
        verification_list.append({
            "id": str(verification["_id"]),
            "certificate_hash": verification["product_hash"],
            "certificate_name": certificate_name,
            "verifier_id": verification.get("consumer_id"),
            "verifier_name": verifier_name,
            "result": verification["result"],
            "timestamp": verification.get("timestamp")
        })
    
    return {
        "items": verification_list,
        "total": total,
        "page": page,
        "per_page": per_page,
        "pages": (total + per_page - 1) // per_page
    }


@router.get("/notifications")
async def get_admin_notifications(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_admin: dict = Depends(get_current_admin)
):
    """Get admin notifications."""
    notifications = get_notifications_collection()
    
    # Get notifications for admin
    query = {"user_id": str(current_admin["_id"])}
    
    total = await notifications.count_documents(query)
    
    skip = (page - 1) * per_page
    cursor = notifications.find(query).skip(skip).limit(per_page).sort("created_at", -1)
    
    notification_list = []
    async for notification in cursor:
        notification_list.append({
            "id": str(notification["_id"]),
            "message": notification["message"],
            "type": notification["type"],
            "created_at": notification.get("created_at"),
            "is_read": notification.get("is_read", False)
        })
    
    return {
        "items": notification_list,
        "total": total,
        "page": page,
        "per_page": per_page,
        "pages": (total + per_page - 1) // per_page
    }


@router.get("/activity-logs")
async def get_activity_logs(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_admin: dict = Depends(get_current_admin)
):
    """Get user activity logs (verifications as activity)."""
    verifications = get_verifications_collection()
    users = get_users_collection()
    
    # Get recent verifications as activity
    total = await verifications.count_documents({})
    
    skip = (page - 1) * per_page
    cursor = verifications.find({}).skip(skip).limit(per_page).sort("timestamp", -1)
    
    activity_list = []
    async for verification in cursor:
        # Get user info
        user_name = "Anonymous"
        if verification.get("consumer_id"):
            user = await users.find_one({"_id": ObjectId(verification["consumer_id"])})
            if user:
                user_name = user["name"]
        
        activity_list.append({
            "id": str(verification["_id"]),
            "user_name": user_name,
            "action": f"Verified certificate: {verification['product_hash'][:16]}...",
            "result": verification["result"],
            "timestamp": verification.get("timestamp")
        })
    
    return {
        "items": activity_list,
        "total": total,
        "page": page,
        "per_page": per_page,
        "pages": (total + per_page - 1) // per_page
    }
