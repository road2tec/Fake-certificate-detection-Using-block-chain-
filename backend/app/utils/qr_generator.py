"""
QR Code generation utilities.
"""
import qrcode
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers import RoundedModuleDrawer
from qrcode.image.styles.colormasks import RadialGradiantColorMask
import os
from pathlib import Path
import uuid


# QR codes storage directory
QR_CODES_DIR = Path("static/qrcodes")
QR_CODES_DIR.mkdir(parents=True, exist_ok=True)


def generate_qr_code(data: str, product_id: str) -> str:
    """
    Generate a styled QR code for a product.
    
    Args:
        data: The data to encode in the QR code
        product_id: The product ID for naming the file
        
    Returns:
        The path to the generated QR code image
    """
    # Create QR code with high error correction
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)
    
    # Create styled image with gradient colors (emerald theme)
    img = qr.make_image(
        image_factory=StyledPilImage,
        module_drawer=RoundedModuleDrawer(),
        color_mask=RadialGradiantColorMask(
            back_color=(253, 248, 243),  # Cream background
            center_color=(16, 185, 129),  # Emerald center
            edge_color=(5, 150, 105),  # Darker emerald edge
        ),
    )
    
    # Save the QR code
    filename = f"{product_id}_{uuid.uuid4().hex[:8]}.png"
    filepath = QR_CODES_DIR / filename
    img.save(str(filepath))
    
    return f"/static/qrcodes/{filename}"


def generate_simple_qr_code(data: str, product_id: str) -> str:
    """
    Generate a simple QR code for a product (fallback if styled fails).
    
    Args:
        data: The data to encode in the QR code
        product_id: The product ID for naming the file
        
    Returns:
        The path to the generated QR code image
    """
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)
    
    # Create simple image
    img = qr.make_image(fill_color="#10B981", back_color="#FDF8F3")
    
    # Save the QR code
    filename = f"{product_id}_{uuid.uuid4().hex[:8]}.png"
    filepath = QR_CODES_DIR / filename
    img.save(str(filepath))
    
    return f"/static/qrcodes/{filename}"
