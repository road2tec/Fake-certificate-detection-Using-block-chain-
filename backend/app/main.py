"""
Fake Product Identification System - Main FastAPI Application.

This is the main entry point for the backend API.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from pathlib import Path
from datetime import datetime
from bson import ObjectId

from .config.database import connect_to_database, close_database_connection, get_users_collection
from .config.settings import get_settings
from .utils.auth import get_password_hash
from .blockchain.web3_client import init_web3
from .blockchain.contract import deploy_contract
from .routes import auth, admin, product, verify

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler for startup and shutdown."""
    # Startup
    print("Starting Fake Product Identification System...")
    
    # Connect to MongoDB
    await connect_to_database()
    
    # Create admin user if not exists
    await create_admin_user()
    
    # Initialize blockchain
    init_web3()
    
    # Deploy contract (optional - can be done separately)
    await deploy_contract()
    
    # Create static directories
    Path("static/qrcodes").mkdir(parents=True, exist_ok=True)
    
    print("System ready!")
    
    yield
    
    # Shutdown
    print("Shutting down...")
    await close_database_connection()


async def create_admin_user():
    """Create default admin user if not exists."""
    users = get_users_collection()
    
    # Check if admin exists
    existing_admin = await users.find_one({"email": settings.admin_email})
    if existing_admin:
        print(f"Admin user already exists: {settings.admin_email}")
        return
    
    # Create admin user
    admin_doc = {
        "name": settings.admin_name,
        "email": settings.admin_email,
        "password_hash": get_password_hash(settings.admin_password),
        "role": "admin",
        "status": "approved",
        "created_at": datetime.utcnow()
    }
    
    await users.insert_one(admin_doc)
    print(f"Admin user created: {settings.admin_email}")


# Create FastAPI app
app = FastAPI(
    title="Fake Product Identification System",
    description="A blockchain-based system for identifying counterfeit products using QR codes",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
static_path = Path("static")
static_path.mkdir(exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include routers
app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(product.router)
app.include_router(verify.router)


@app.get("/")
async def root():
    """Root endpoint - API health check."""
    return {
        "message": "Fake Product Identification System API",
        "status": "running",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat()
    }
