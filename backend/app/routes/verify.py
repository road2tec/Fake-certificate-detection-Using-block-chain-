"""
Certificate verification routes.
"""
from fastapi import APIRouter, HTTPException, status, Depends, Query
from datetime import datetime
from bson import ObjectId
from typing import Optional
from ..schemas.certificate import CertificateVerify, VerificationResponse
from ..config.database import (
    get_products_collection,
    get_verifications_collection,
    get_users_collection,
    get_notifications_collection
)
from ..utils.auth import get_current_user, get_current_user_optional
from ..blockchain.contract import verify_certificate_on_blockchain

router = APIRouter(prefix="/verify", tags=["Verification"])


@router.post("/certificate", response_model=dict)
async def verify_certificate(
    verification_data: CertificateVerify,
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    """
    Verify a certificate's authenticity using its hash.
    
    This endpoint can be used by anyone (logged in or anonymous).
    """
    certificates_collection = get_products_collection()
    verifications = get_verifications_collection()
    users = get_users_collection()
    notifications = get_notifications_collection()
    
    certificate_hash = verification_data.certificate_hash
    
    # Check valid hash format
    if len(certificate_hash) != 64:
         return {
            "is_authentic": False,
            "message": "INVALID QR CODE: The scanned code format is incorrect.",
            "blockchain_verified": False,
            "verification_id": None
        }

    # Check database for certificate
    certificate = await certificates_collection.find_one({"certificate_hash": certificate_hash})
    
    # Check blockchain
    blockchain_result = await verify_certificate_on_blockchain(certificate_hash)
    blockchain_verified = blockchain_result.get("exists", False)
    
    # Determine result
    if certificate and blockchain_verified:
        result = "authentic"
        is_authentic = True
        message = "Certificate is AUTHENTIC! Verified on blockchain."
    elif certificate and not blockchain_verified:
        result = "authentic"
        is_authentic = True
        message = "Certificate found in database. Blockchain verification pending."
    else:
        result = "fake"
        is_authentic = False
        message = "WARNING: Certificate NOT FOUND! This may be a fraudulent certificate."
    
    # Get consumer ID if logged in (student or verifier)
    consumer_id = None
    if current_user:
        consumer_id = current_user.get("_id")
    
    # Record verification
    verification_doc = {
        "certificate_hash": certificate_hash,
        "consumer_id": consumer_id,
        "result": result,
        "blockchain_verified": blockchain_verified,
        "timestamp": datetime.utcnow()
    }
    verification_result = await verifications.insert_one(verification_doc)
    
    # Prepare response
    response = {
        "is_authentic": is_authentic,
        "message": message,
        "blockchain_verified": blockchain_verified,
        "verification_id": str(verification_result.inserted_id)
    }
    
    # Add certificate details if found
    if certificate:
        # Get issuer info
        issuer = await users.find_one({"_id": ObjectId(certificate["issuer_id"])})
        issuer_name = issuer["name"] if issuer else "Unknown institution"
        
        response["certificate_details"] = {
            "id": str(certificate["_id"]),
            "student_name": certificate["student_name"],
            "institute_name": certificate["institute_name"],
            "course_name": certificate.get("course_name", "N/A"),
            "certificate_id": certificate.get("certificate_id", "N/A"),
            "issue_date": certificate.get("issue_date", "N/A"),
            "image_url": certificate.get("image_url"),
            "description": certificate.get("description"),
            "issuer_name": issuer_name,
            "issued_at": certificate.get("created_at")
        }
        
        # Create alert notification for issuer if fake attempt
        if not is_authentic and issuer:
            await notifications.insert_one({
                "message": f"Alert: Someone tried to verify a certificate with hash {certificate_hash[:16]}... Result: Not found",
                "type": "alert",
                "user_id": str(issuer["_id"]),
                "created_at": datetime.utcnow(),
                "is_read": False
            })
    
    return response


@router.get("/by-hash/{certificate_hash}")
async def verify_by_hash(certificate_hash: str):
    """Verify certificate by hash (GET method for QR scanning)."""
    # If hash format is clearly invalid (not 64 chars), return fake immediately
    if len(certificate_hash) != 64:
        return {
            "is_authentic": False,
            "message": "INVALID QR CODE: This code does not match the secure format.",
            "blockchain_verified": False,
            "verification_id": None
        }
    
    # Create verification data and call main verify function
    verification_data = CertificateVerify(certificate_hash=certificate_hash)
    return await verify_certificate(verification_data)


@router.get("/history")
async def get_verification_history(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    current_user: dict = Depends(get_current_user)
):
    """Get verification history for the current user."""
    verifications = get_verifications_collection()
    certificates_collection = get_products_collection()
    
    consumer_id = current_user["_id"]
    query = {"consumer_id": consumer_id}
    
    total = await verifications.count_documents(query)
    
    skip = (page - 1) * per_page
    cursor = verifications.find(query).skip(skip).limit(per_page).sort("timestamp", -1)
    
    history = []
    async for verification in cursor:
        # Get certificate details
        certificate = await certificates_collection.find_one({"certificate_hash": verification["certificate_hash"]})
        certificate_name = f"{certificate['student_name']} - {certificate['course_name']}" if certificate else "Unknown"
        
        history.append({
            "id": str(verification["_id"]),
            "certificate_hash": verification["certificate_hash"],
            "certificate_name": certificate_name,
            "result": verification["result"],
            "blockchain_verified": verification.get("blockchain_verified", False),
            "timestamp": verification.get("timestamp")
        })
    
    return {
        "items": history,
        "total": total,
        "page": page,
        "per_page": per_page,
        "pages": (total + per_page - 1) // per_page
    }
