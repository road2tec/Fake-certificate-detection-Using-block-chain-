"""
Authentication routes for signup and login.
"""
from fastapi import APIRouter, HTTPException, status
from datetime import datetime
from bson import ObjectId
from ..schemas.user import UserSignup, UserLogin, TokenResponse
from ..config.database import get_users_collection
from ..utils.auth import get_password_hash, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup", response_model=TokenResponse)
async def signup(user_data: UserSignup):
    """
    Register a new user.
    
    - Consumers can register and login directly
    - Manufacturers are set to 'pending' status and must be approved by admin
    """
    users = get_users_collection()
    
    # Check if email already exists
    existing_user = await users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Determine initial status based on role
    if user_data.role == "manufacturer":
        initial_status = "pending"
        # Validate manufacturer fields
        if not user_data.company_name:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Company name is required for manufacturers"
            )
    else:
        initial_status = "approved"
    
    # Create user document
    user_doc = {
        "name": user_data.name,
        "email": user_data.email,
        "password_hash": get_password_hash(user_data.password),
        "role": user_data.role,
        "status": initial_status,
        "company_name": user_data.company_name,
        "company_address": user_data.company_address,
        "documents": [],
        "created_at": datetime.utcnow()
    }
    
    # Insert user
    result = await users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    # For manufacturers, return without token (they need approval)
    if user_data.role == "manufacturer":
        return TokenResponse(
            access_token="",
            user={
                "id": user_id,
                "name": user_data.name,
                "email": user_data.email,
                "role": user_data.role,
                "status": initial_status,
                "message": "Your account is pending approval. You will be notified once approved."
            }
        )
    
    # Generate token for consumers
    access_token = create_access_token(data={"sub": user_id})
    
    return TokenResponse(
        access_token=access_token,
        user={
            "id": user_id,
            "name": user_data.name,
            "email": user_data.email,
            "role": user_data.role,
            "status": initial_status
        }
    )


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    """
    Login with email and password.
    
    - Manufacturers must be approved to login
    """
    users = get_users_collection()
    
    # Find user by email
    user = await users.find_one({"email": credentials.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Check manufacturer approval status
    if user["role"] == "manufacturer" and user.get("status") != "approved":
        status_msg = user.get("status", "pending")
        if status_msg == "pending":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your account is pending approval. Please wait for admin approval."
            )
        elif status_msg == "rejected":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your account has been rejected. Please contact support."
            )
    
    # Generate token
    user_id = str(user["_id"])
    access_token = create_access_token(data={"sub": user_id})
    
    return TokenResponse(
        access_token=access_token,
        user={
            "id": user_id,
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
            "status": user.get("status", "approved"),
            "company_name": user.get("company_name")
        }
    )


@router.get("/me")
async def get_current_user_profile(current_user: dict = None):
    """Get current user profile from token."""
    from ..utils.auth import get_current_user
    from fastapi import Depends
    # This route needs to be called with proper authentication
    return {"message": "Use /auth/me with Bearer token"}
