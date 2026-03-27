"""
Certificate hash generation utilities.
"""
import hashlib
import uuid
from datetime import datetime


def generate_certificate_hash(
    student_name: str,
    institute_name: str,
    course_name: str,
    certificate_id: str,
    issue_date: str,
    issuer_id: str,
    timestamp: datetime = None
) -> str:
    """
    Generate a unique hash for a certificate.
    
    Args:
        student_name: Name of the student
        institute_name: Institute name
        course_name: Course name
        certificate_id: Certificate ID
        issue_date: Date of issue
        issuer_id: ID of the issuer (institution)
        timestamp: Optional timestamp (defaults to now)
        
    Returns:
        A unique SHA-256 hash for the certificate
    """
    if timestamp is None:
        timestamp = datetime.utcnow()
    
    # Create unique string from certificate details
    unique_string = f"{student_name}|{institute_name}|{course_name}|{certificate_id}|{issue_date}|{issuer_id}|{timestamp.isoformat()}|{uuid.uuid4()}"
    
    # Generate SHA-256 hash
    hash_object = hashlib.sha256(unique_string.encode())
    return hash_object.hexdigest()


def generate_certificate_hash_bytes32(certificate_hash: str) -> bytes:
    """
    Convert a hex string hash to bytes32 format for blockchain.
    
    Args:
        certificate_hash: Hex string hash
        
    Returns:
        bytes32 representation
    """
    # Ensure the hash is 64 characters (32 bytes in hex)
    if len(certificate_hash) != 64:
        raise ValueError("Hash must be 64 hex characters (32 bytes)")
    
    return bytes.fromhex(certificate_hash)


def verify_hash_format(certificate_hash: str) -> bool:
    """
    Verify that a hash is in valid format.
    
    Args:
        certificate_hash: Hash string to verify
        
    Returns:
        True if valid, False otherwise
    """
    if not certificate_hash:
        return False
    
    if len(certificate_hash) != 64:
        return False
    
    try:
        int(certificate_hash, 16)
        return True
    except ValueError:
        return False
