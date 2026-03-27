"""
Certificate routes for issuance and management.
"""
from fastapi import APIRouter, HTTPException, status, Depends, Query, File, UploadFile, Form
from datetime import datetime
from bson import ObjectId
from typing import Optional
import shutil
import os
from pathlib import Path
from ..schemas.certificate import CertificateResponse
from ..schemas.response import MessageResponse
from ..config.database import get_products_collection, get_users_collection
from ..utils.auth import get_current_manufacturer, get_current_user
from ..utils.hash import generate_certificate_hash
from ..utils.qr_generator import generate_qr_code
from ..blockchain.contract import register_certificate_on_blockchain
import uuid

router = APIRouter(prefix="/certificate", tags=["Certificates"])


@router.post("/issue", response_model=dict)
async def issue_certificate(
    student_name: str = Form(...),
    institute_name: str = Form(...),
    course_name: str = Form(...),
    certificate_id: str = Form(...),
    issue_date: str = Form(...),
    description: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    current_user: dict = Depends(get_current_manufacturer)
):
    """
    Issue a new certificate on the blockchain.
    
    Only approved institutions (issuers) can issue certificates.
    """
    certificates_collection = get_products_collection()
    
    issuer_id = str(current_user["_id"])
    
    # Handle Image Upload
    image_url = None
    if image:
        try:
            # Create directory if not exists
            upload_dir = Path("static/certificates")
            upload_dir.mkdir(parents=True, exist_ok=True)
            
            # Generate unique filename
            file_extension = os.path.splitext(image.filename)[1]
            filename = f"{uuid.uuid4()}{file_extension}"
            file_path = upload_dir / filename
            
            # Save file
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)
            
            image_url = f"/static/certificates/{filename}"
        except Exception as e:
            print(f"Failed to upload image: {e}")
    
    # Generate certificate hash
    certificate_hash = generate_certificate_hash(
        student_name,
        institute_name,
        course_name,
        certificate_id,
        issue_date,
        issuer_id
    )
    
    # Generate QR code
    qr_data = f"http://localhost:5173/verify?hash={certificate_hash}"
    mongo_id = str(ObjectId())
    qr_code_path = generate_qr_code(qr_data, mongo_id)
    
    # Register on blockchain
    blockchain_result = await register_certificate_on_blockchain(certificate_hash)
    
    blockchain_tx_hash = None
    if blockchain_result["success"]:
        blockchain_tx_hash = blockchain_result["tx_hash"]
    else:
        print(f"⚠️ Blockchain registration failed: {blockchain_result.get('error', 'Unknown error')}")
    
    # Create certificate document
    certificate_doc = {
        "_id": ObjectId(mongo_id),
        "student_name": student_name,
        "institute_name": institute_name,
        "course_name": course_name,
        "certificate_id": certificate_id,
        "issue_date": issue_date,
        "description": description,
        "image_url": image_url,
        "issuer_id": issuer_id,
        "certificate_hash": certificate_hash,
        "qr_code_path": qr_code_path,
        "blockchain_tx_hash": blockchain_tx_hash,
        "created_at": datetime.utcnow()
    }
    
    # Insert certificate
    await certificates_collection.insert_one(certificate_doc)
    
    return {
        "success": True,
        "message": "Certificate issued successfully",
        "certificate": {
            "id": mongo_id,
            "student_name": student_name,
            "institute_name": institute_name,
            "course_name": course_name,
            "certificate_id": certificate_id,
            "issue_date": issue_date,
            "certificate_hash": certificate_hash,
            "qr_code_path": qr_code_path,
            "blockchain_tx_hash": blockchain_tx_hash,
            "blockchain_registered": blockchain_result["success"]
        }
    }


@router.get("/my-certificates")
async def get_my_certificates(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    current_user: dict = Depends(get_current_manufacturer)
):
    """Get certificates issued by the current institution."""
    certificates_collection = get_products_collection()
    
    issuer_id = str(current_user["_id"])
    query = {"issuer_id": issuer_id}
    
    total = await certificates_collection.count_documents(query)
    
    skip = (page - 1) * per_page
    cursor = certificates_collection.find(query).skip(skip).limit(per_page).sort("created_at", -1)
    
    certificate_list = []
    async for certificate in cursor:
        certificate_list.append({
            "id": str(certificate["_id"]),
            "student_name": certificate["student_name"],
            "institute_name": certificate["institute_name"],
            "course_name": certificate.get("course_name", "N/A"),
            "certificate_id": certificate.get("certificate_id", "N/A"),
            "issue_date": certificate.get("issue_date", "N/A"),
            "image_url": certificate.get("image_url"),
            "description": certificate.get("description"),
            "certificate_hash": certificate["certificate_hash"],
            "qr_code_path": certificate["qr_code_path"],
            "blockchain_tx_hash": certificate.get("blockchain_tx_hash"),
            "created_at": certificate.get("created_at")
        })
    
    return {
        "items": certificate_list,
        "total": total,
        "page": page,
        "per_page": per_page,
        "pages": (total + per_page - 1) // per_page
    }


@router.get("/{cert_id}")
async def get_certificate_details(
    cert_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get certificate details by ID."""
    certificates_collection = get_products_collection()
    users = get_users_collection()
    
    try:
        obj_id = ObjectId(cert_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid certificate ID"
        )
    
    certificate = await certificates_collection.find_one({"_id": obj_id})
    if not certificate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate not found"
        )
    
    # Get issuer name
    issuer = await users.find_one({"_id": ObjectId(certificate["issuer_id"])})
    issuer_name = issuer["name"] if issuer else "Unknown"
    
    return {
        "id": str(certificate["_id"]),
        "student_name": certificate["student_name"],
        "institute_name": certificate["institute_name"],
        "course_name": certificate.get("course_name", "N/A"),
        "certificate_id": certificate.get("certificate_id", "N/A"),
        "issue_date": certificate.get("issue_date", "N/A"),
        "image_url": certificate.get("image_url"),
        "description": certificate.get("description"),
        "issuer_id": certificate["issuer_id"],
        "issuer_name": issuer_name,
        "certificate_hash": certificate["certificate_hash"],
        "qr_code_path": certificate["qr_code_path"],
        "blockchain_tx_hash": certificate.get("blockchain_tx_hash"),
        "created_at": certificate.get("created_at")
    }
