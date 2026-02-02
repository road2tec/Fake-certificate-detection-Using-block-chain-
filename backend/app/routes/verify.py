"""
Product verification routes.
"""
from fastapi import APIRouter, HTTPException, status, Depends, Query
from datetime import datetime
from bson import ObjectId
from typing import Optional
from ..schemas.product import ProductVerify, VerificationResponse
from ..config.database import (
    get_products_collection,
    get_verifications_collection,
    get_users_collection,
    get_notifications_collection
)
from ..utils.auth import get_current_user, get_current_user_optional
from ..blockchain.contract import verify_product_on_blockchain

router = APIRouter(prefix="/verify", tags=["Verification"])


@router.post("/product", response_model=dict)
async def verify_product(
    verification_data: ProductVerify,
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    """
    Verify a product's authenticity using its hash.
    
    This endpoint can be used by anyone (logged in or anonymous).
    """
    products = get_products_collection()
    verifications = get_verifications_collection()
    users = get_users_collection()
    notifications = get_notifications_collection()
    
    product_hash = verification_data.product_hash
    
    # Check valid hash format
    if len(product_hash) != 64:
         return {
            "is_authentic": False,
            "message": "INVALID QR CODE: The scanned code format is incorrect.",
            "blockchain_verified": False,
            "verification_id": None
        }

    # Check database for product
    product = await products.find_one({"product_hash": product_hash})
    
    # Check blockchain
    blockchain_result = await verify_product_on_blockchain(product_hash)
    blockchain_verified = blockchain_result.get("exists", False)
    
    # Determine result
    if product and blockchain_verified:
        result = "authentic"
        is_authentic = True
        message = "Product is AUTHENTIC! Verified on blockchain."
    elif product and not blockchain_verified:
        result = "authentic"
        is_authentic = True
        message = "Product found in database. Blockchain verification pending."
    else:
        result = "fake"
        is_authentic = False
        message = "WARNING: Product NOT FOUND! This may be a counterfeit product."
    
    # Get consumer ID if logged in
    consumer_id = None
    if current_user:
        consumer_id = current_user.get("_id")
    
    # Record verification
    verification_doc = {
        "product_hash": product_hash,
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
    
    # Add product details if found
    if product:
        # Get manufacturer info
        manufacturer = await users.find_one({"_id": ObjectId(product["manufacturer_id"])})
        manufacturer_name = manufacturer["name"] if manufacturer else "Unknown"
        
        response["product_details"] = {
            "id": str(product["_id"]),
            "product_name": product["product_name"],
            "brand": product["brand"],
            "batch_number": product.get("batch_number", "N/A"),
            "expiry_date": product.get("expiry_date", "N/A"),
            "image_url": product.get("image_url"),
            "description": product.get("description"),
            "manufacturer_name": manufacturer_name,
            "registered_at": product.get("created_at")
        }
        
        # Create alert notification for manufacturer if fake attempt
        if not is_authentic and manufacturer:
            await notifications.insert_one({
                "message": f"Alert: Someone tried to verify a product with hash {product_hash[:16]}... Result: Not found",
                "type": "alert",
                "user_id": str(manufacturer["_id"]),
                "created_at": datetime.utcnow(),
                "is_read": False
            })
    
    return response


@router.get("/by-hash/{product_hash}")
async def verify_by_hash(product_hash: str):
    """Verify product by hash (GET method for QR scanning)."""
    # If hash format is clearly invalid (not 64 chars), return fake immediately
    if len(product_hash) != 64:
        return {
            "is_authentic": False,
            "message": "INVALID QR CODE: This code does not match the secure format.",
            "blockchain_verified": False,
            "verification_id": None
        }
    
    # Create verification data and call main verify function
    verification_data = ProductVerify(product_hash=product_hash)
    return await verify_product(verification_data)


@router.get("/history")
async def get_verification_history(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    current_user: dict = Depends(get_current_user)
):
    """Get verification history for the current user."""
    verifications = get_verifications_collection()
    products = get_products_collection()
    
    consumer_id = current_user["_id"]
    query = {"consumer_id": consumer_id}
    
    total = await verifications.count_documents(query)
    
    skip = (page - 1) * per_page
    cursor = verifications.find(query).skip(skip).limit(per_page).sort("timestamp", -1)
    
    history = []
    async for verification in cursor:
        # Get product details
        product = await products.find_one({"product_hash": verification["product_hash"]})
        product_name = product["product_name"] if product else "Unknown"
        
        history.append({
            "id": str(verification["_id"]),
            "product_hash": verification["product_hash"],
            "product_name": product_name,
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
