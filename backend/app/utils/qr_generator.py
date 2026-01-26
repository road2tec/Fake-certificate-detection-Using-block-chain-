import qrcode
import os
from pathlib import Path
import uuid
from PIL import Image, ImageDraw, ImageFont

# QR codes storage directory
QR_CODES_DIR = Path("static/qrcodes")
QR_CODES_DIR.mkdir(parents=True, exist_ok=True)

def generate_qr_code(data: str, product_id: str) -> str:
    """
    Generate a high-contrast QR code with the hash text embedded below it.
    
    Args:
        data: The data to encode in the QR code (the hash)
        product_id: The product ID for naming the file
        
    Returns:
        The path to the generated QR code image
    """
    # Create QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=20,
        border=2, # Smaller border for the QR itself, we add canvas border later
    )
    qr.add_data(data)
    qr.make(fit=True)
    
    qr_img = qr.make_image(fill_color="black", back_color="white").convert('RGB')
    
    # Create a canvas
    # QR Size is (box_size * modules) + border. 
    # Let's say approx 600x600.
    qr_w, qr_h = qr_img.size
    
    # Add space for text
    padding = 50
    text_height = 100
    canvas_w = qr_w + (padding * 2)
    canvas_h = qr_h + text_height + (padding * 2)
    
    img = Image.new('RGB', (canvas_w, canvas_h), 'white')
    
    # Paste QR centered
    img.paste(qr_img, (padding, padding))
    
    # Draw Text
    draw = ImageDraw.Draw(img)
    
    # Try to load a nice font, fallback to default
    try:
        # Try a few common fonts
        font_name = "arial.ttf" if os.name == 'nt' else "DejaVuSans.ttf"
        font = ImageFont.truetype(font_name, 24)
    except Exception:
        font = ImageFont.load_default()

    # Wrap text if too long (simple char chunking)
    # The hash is long, so we might need to break it
    chunk_size = 42 # heuristic
    text_lines = [data[i:i+chunk_size] for i in range(0, len(data), chunk_size)]
    
    # Draw each line
    current_y = qr_h + padding + 20
    for line in text_lines:
        # Calculate text width to center it (bbox is (left, top, right, bottom))
        bbox = draw.textbbox((0, 0), line, font=font)
        text_w = bbox[2] - bbox[0]
        text_x = (canvas_w - text_w) // 2
        
        draw.text((text_x, current_y), line, fill="black", font=font)
        current_y += 30 # Line height
        
    # Save
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
