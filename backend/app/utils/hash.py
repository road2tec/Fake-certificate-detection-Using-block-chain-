"""
Product hash generation utilities.
"""
import hashlib
import uuid
from datetime import datetime


def generate_product_hash(
    product_name: str,
    brand: str,
    batch_number: str,
    expiry_date: str,
    manufacturer_id: str,
    timestamp: datetime = None
) -> str:
    """
    Generate a unique hash for a product.
    
    Args:
        product_name: Name of the product
        brand: Brand name
        batch_number: Batch number
        expiry_date: Expiry date
        manufacturer_id: ID of the manufacturer
        timestamp: Optional timestamp (defaults to now)
        
    Returns:
        A unique SHA-256 hash for the product
    """
    if timestamp is None:
        timestamp = datetime.utcnow()
    
    # Create unique string from product details - INCLUDING NEW FIELDS
    unique_string = f"{product_name}|{brand}|{batch_number}|{expiry_date}|{manufacturer_id}|{timestamp.isoformat()}|{uuid.uuid4()}"
    
    # Generate SHA-256 hash
    hash_object = hashlib.sha256(unique_string.encode())
    return hash_object.hexdigest()


def generate_product_hash_bytes32(product_hash: str) -> bytes:
    """
    Convert a hex string hash to bytes32 format for blockchain.
    
    Args:
        product_hash: Hex string hash
        
    Returns:
        bytes32 representation
    """
    # Ensure the hash is 64 characters (32 bytes in hex)
    if len(product_hash) != 64:
        raise ValueError("Hash must be 64 hex characters (32 bytes)")
    
    return bytes.fromhex(product_hash)


def verify_hash_format(product_hash: str) -> bool:
    """
    Verify that a hash is in valid format.
    
    Args:
        product_hash: Hash string to verify
        
    Returns:
        True if valid, False otherwise
    """
    if not product_hash:
        return False
    
    if len(product_hash) != 64:
        return False
    
    try:
        int(product_hash, 16)
        return True
    except ValueError:
        return False
