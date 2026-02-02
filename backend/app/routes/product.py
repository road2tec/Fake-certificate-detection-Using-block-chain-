"""
Product routes for registration and management.
"""
from fastapi import APIRouter, HTTPException, status, Depends, Query, File, UploadFile, Form
from datetime import datetime
from bson import ObjectId
from typing import Optional
import shutil
import os
from pathlib import Path
from ..schemas.product import ProductRegister, ProductResponse
from ..schemas.response import MessageResponse
from ..config.database import get_products_collection, get_users_collection
from ..utils.auth import get_current_manufacturer, get_current_user
from ..utils.hash import generate_product_hash
from ..utils.qr_generator import generate_qr_code
from ..blockchain.contract import register_product_on_blockchain
import uuid

router = APIRouter(prefix="/product", tags=["Products"])


@router.post("/register", response_model=dict)
async def register_product(
    product_name: str = Form(...),
    brand: str = Form(...),
    batch_number: str = Form(...),
    expiry_date: str = Form(...),
    description: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    current_user: dict = Depends(get_current_manufacturer)
):
    """
    Register a new product on the blockchain.
    
    Only approved manufacturers can register products.
    """
    products = get_products_collection()
    
    manufacturer_id = str(current_user["_id"])
    
    # Handle Image Upload
    image_url = None
    if image:
        try:
            # Create directory if not exists
            upload_dir = Path("static/products")
            upload_dir.mkdir(parents=True, exist_ok=True)
            
            # Generate unique filename
            file_extension = os.path.splitext(image.filename)[1]
            filename = f"{uuid.uuid4()}{file_extension}"
            file_path = upload_dir / filename
            
            # Save file
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)
            
            image_url = f"/static/products/{filename}"
        except Exception as e:
            print(f"Failed to upload image: {e}")
    
    # Generate product hash
    product_hash = generate_product_hash(
        product_name,
        brand,
        batch_number,
        expiry_date,
        manufacturer_id
    )
    
    # Generate QR code
    qr_data = f"{product_hash}"
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
        "product_name": product_name,
        "brand": brand,
        "batch_number": batch_number,
        "expiry_date": expiry_date,
        "description": description,
        "image_url": image_url,
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
            "product_name": product_name,
            "brand": brand,
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
            "batch_number": product.get("batch_number", "N/A"),
            "expiry_date": product.get("expiry_date", "N/A"),
            "image_url": product.get("image_url"),
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
        "batch_number": product.get("batch_number", "N/A"),
        "expiry_date": product.get("expiry_date", "N/A"),
        "image_url": product.get("image_url"),
        "description": product.get("description"),
        "manufacturer_id": product["manufacturer_id"],
        "manufacturer_name": manufacturer_name,
        "product_hash": product["product_hash"],
        "qr_code_path": product["qr_code_path"],
        "blockchain_tx_hash": product.get("blockchain_tx_hash"),
        "created_at": product.get("created_at")
    }
