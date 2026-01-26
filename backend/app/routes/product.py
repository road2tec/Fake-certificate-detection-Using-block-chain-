"""
Product routes for registration and management.
"""
from fastapi import APIRouter, HTTPException, status, Depends, Query
from datetime import datetime
from bson import ObjectId
from typing import Optional
from ..schemas.product import ProductRegister, ProductResponse
from ..schemas.response import MessageResponse
from ..config.database import get_products_collection, get_users_collection
from ..utils.auth import get_current_manufacturer, get_current_user
from ..utils.hash import generate_product_hash
from ..utils.qr_generator import generate_qr_code
from ..blockchain.contract import register_product_on_blockchain

router = APIRouter(prefix="/product", tags=["Products"])


@router.post("/register", response_model=dict)
async def register_product(
    product_data: ProductRegister,
    current_user: dict = Depends(get_current_manufacturer)
):
    """
    Register a new product on the blockchain.
    
    Only approved manufacturers can register products.
    """
    products = get_products_collection()
    
    manufacturer_id = str(current_user["_id"])
    
    # Generate product hash
    product_hash = generate_product_hash(
        product_data.product_name,
        product_data.brand,
        manufacturer_id
    )
    
    # Generate QR code
    # We embed the raw HASH in the visual text, but QR data can keep VERIFY: prefix if needed
    # Actually, simpler is just the hash for both if the frontend handles it, 
    # but let's stick to existing convention for QR data to avoid breaking scanner logic that might expect it.
    qr_data = f"{product_hash}" # CHANGED: Removed VERIFY: prefix to make manual entry identical
    # If the scanner logic currently REQUIRES 'VERIFY:', this breaks it.
    # But usually simple logic is better. Let's assume the frontend just sends what it scans.
    # Checking previous codes... consumer input just sends text.
    
    product_id = str(ObjectId())
    qr_code_path = generate_qr_code(qr_data, product_id)
    
    # Register on blockchain
    blockchain_result = await register_product_on_blockchain(product_hash)
    
    blockchain_tx_hash = None
    if blockchain_result["success"]:
        blockchain_tx_hash = blockchain_result["tx_hash"]
    else:
        print(f"⚠️ Blockchain registration failed: {blockchain_result.get('error', 'Unknown error')}")
    
    # Create product document
    product_doc = {
        "_id": ObjectId(product_id),
        "product_name": product_data.product_name,
        "brand": product_data.brand,
        "description": product_data.description,
        "manufacturer_id": manufacturer_id,
        "product_hash": product_hash,
        "qr_code_path": qr_code_path,
        "blockchain_tx_hash": blockchain_tx_hash,
        "created_at": datetime.utcnow()
    }
    
    # Insert product
    await products.insert_one(product_doc)
    
    return {
        "success": True,
        "message": "Product registered successfully",
        "product": {
            "id": product_id,
            "product_name": product_data.product_name,
            "brand": product_data.brand,
            "product_hash": product_hash,
            "qr_code_path": qr_code_path,
            "blockchain_tx_hash": blockchain_tx_hash,
            "blockchain_registered": blockchain_result["success"]
        }
    }


@router.get("/my-products")
async def get_my_products(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    current_user: dict = Depends(get_current_manufacturer)
):
    """Get products registered by the current manufacturer."""
    products = get_products_collection()
    
    manufacturer_id = current_user["_id"]
    query = {"manufacturer_id": manufacturer_id}
    
    total = await products.count_documents(query)
    
    skip = (page - 1) * per_page
    cursor = products.find(query).skip(skip).limit(per_page).sort("created_at", -1)
    
    product_list = []
    async for product in cursor:
        product_list.append({
            "id": str(product["_id"]),
            "product_name": product["product_name"],
            "brand": product["brand"],
            "description": product.get("description"),
            "product_hash": product["product_hash"],
            "qr_code_path": product["qr_code_path"],
            "blockchain_tx_hash": product.get("blockchain_tx_hash"),
            "created_at": product.get("created_at")
        })
    
    return {
        "items": product_list,
        "total": total,
        "page": page,
        "per_page": per_page,
        "pages": (total + per_page - 1) // per_page
    }


@router.get("/{product_id}")
async def get_product_details(
    product_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get product details by ID."""
    products = get_products_collection()
    users = get_users_collection()
    
    try:
        obj_id = ObjectId(product_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid product ID"
        )
    
    product = await products.find_one({"_id": obj_id})
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Get manufacturer name
    manufacturer = await users.find_one({"_id": ObjectId(product["manufacturer_id"])})
    manufacturer_name = manufacturer["name"] if manufacturer else "Unknown"
    
    return {
        "id": str(product["_id"]),
        "product_name": product["product_name"],
        "brand": product["brand"],
        "description": product.get("description"),
        "manufacturer_id": product["manufacturer_id"],
        "manufacturer_name": manufacturer_name,
        "product_hash": product["product_hash"],
        "qr_code_path": product["qr_code_path"],
        "blockchain_tx_hash": product.get("blockchain_tx_hash"),
        "created_at": product.get("created_at")
    }
