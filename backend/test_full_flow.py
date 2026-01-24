import requests
import json
import sys

BASE_URL = "http://localhost:8001"

def run_full_test():
    print("🚀 Starting End-to-End Blockchain Verification Test...")

    # ==========================================
    # 1. Signup new manufacturer
    # ==========================================
    mfr_email = "test_auto_mfr@example.com"
    mfr_password = "password123"
    print(f"\n1️⃣ Signing up new manufacturer: {mfr_email}...")
    
    signup_data = {
        "name": "Auto Test Mfr",
        "email": mfr_email,
        "password": mfr_password,
        "role": "manufacturer",
        "company_name": "Test Auto Corp",
        "company_address": "123 Test St"
    }
    
    # Try signup, if exists proceed to login
    try:
        requests.post(f"{BASE_URL}/auth/signup", json=signup_data)
        print("   Signup request sent.")
    except Exception as e:
        print(f"   Signup note: {e}")

    # ==========================================
    # 2. Login as Admin to Approve
    # ==========================================
    print("\n2️⃣ Logging in as Admin...")
    admin_login = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "admin@example.com", 
        "password": "admin123"
    })
    
    if admin_login.status_code != 200:
        print(f"❌ Admin login failed: {admin_login.text}")
        return
        
    admin_token = admin_login.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    print("   ✅ Admin logged in.")

    # Find the manufacturer
    print("   Finding manufacturer to approve...")
    mfrs = requests.get(f"{BASE_URL}/admin/manufacturers", headers=admin_headers)
    mfr_id = None
    for m in mfrs.json()["items"]:
        if m["email"] == mfr_email:
            mfr_id = m["id"]
            if m["status"] == "approved":
                print("   ℹ️ Manufacturer already approved.")
            else:
                # Approve
                print(f"   Approving manufacturer ID: {mfr_id}...")
                requests.put(f"{BASE_URL}/admin/approve/{mfr_id}", headers=admin_headers)
                print("   ✅ Manufacturer approved.")
            break
            
    if not mfr_id:
        print("❌ Could not find manufacturer account.")
        return

    # ==========================================
    # 3. Login as Manufacturer
    # ==========================================
    print(f"\n3️⃣ Logging in as Manufacturer: {mfr_email}...")
    mfr_login = requests.post(f"{BASE_URL}/auth/login", json={
        "email": mfr_email, 
        "password": mfr_password
    })
    
    if mfr_login.status_code != 200:
        print(f"❌ Manufacturer login failed: {mfr_login.text}")
        return
        
    mfr_token = mfr_login.json()["access_token"]
    mfr_headers = {"Authorization": f"Bearer {mfr_token}"}
    print("   ✅ Manufacturer logged in.")

    # ==========================================
    # 4. Register Product
    # ==========================================
    print("\n4️⃣ Registering Product on Blockchain...")
    product_data = {
        "product_name": "Blockchain Test Item",
        "brand": "TestBrand",
        "description": "Automated test item"
    }
    
    reg_response = requests.post(f"{BASE_URL}/product/register", json=product_data, headers=mfr_headers)
    
    if reg_response.status_code != 200:
        print(f"❌ Registration failed: {reg_response.text}")
        return
        
    result = reg_response.json()
    blockchain_tx = result.get("product", {}).get("blockchain_tx_hash")
    
    print("\n==========================================")
    if blockchain_tx:
        print("✅ SUCCESS! Product Registered on Blockchain")
        print(f"🔗 Transaction Hash: {blockchain_tx}")
        print("==========================================")
    else:
        print("❌ FAILURE! No Blockchain Transaction Hash returned.")
        print(f"Response: {json.dumps(result, indent=2)}")
        print("==========================================")

if __name__ == "__main__":
    run_full_test()
