"""
MongoDB database connection and initialization.
"""
from motor.motor_asyncio import AsyncIOMotorClient
from .settings import get_settings

settings = get_settings()

# MongoDB client instance
client: AsyncIOMotorClient = None
db = None


async def connect_to_database():
    """Connect to MongoDB database."""
    global client, db
    client = AsyncIOMotorClient(settings.mongodb_url)
    db = client[settings.database_name]
    print(f"Connected to MongoDB: {settings.database_name}")
    return db


async def close_database_connection():
    """Close MongoDB connection."""
    global client
    if client:
        client.close()
        print("MongoDB connection closed")


def get_database():
    """Get database instance."""
    return db


# Collection getters
def get_users_collection():
    return db["users"]


def get_products_collection():
    return db["products"]


def get_verifications_collection():
    return db["verifications"]


def get_notifications_collection():
    return db["notifications"]
