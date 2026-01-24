import requests
import pymongo
from pymongo import MongoClient

# Switch to 8000
BASE_URL = "http://localhost:8000"
MONGO_URL = "mongodb://localhost:27017"
DB_NAME = "fake_product_db"

def run_demo():
    print("🚀 Starting Demo (Port 8000)...")
    
    # 1. Signup New User
    import random
    rand_id = random.randint(10000, 99999)
    email = f"demo_quick_{rand_id}@test.com"
    password = "password123"
    
    print(f"1️⃣ Signing up: {email}")
    res = requests.post(f"{BASE_URL}/auth/signup", json={
        "email": email,
        "password": password,
        "name": f"Demo Brand {rand_id}",
        "role": "manufacturer",
        "company_name": f"Demo Corp {rand_id}", 
        "company_address": "123 Test St" 
    })
    print(f"   Response: {res.status_code}")
    
    # 2. Approve via DB directly
    print("2️⃣ Approving via Database...")
    client = MongoClient(MONGO_URL)
    db = client[DB_NAME]
    users = db["users"]
    
    result = users.update_one(
        {"email": email},
        {"$set": {"is_active": True, "status": "approved"}}
    )
    if result.modified_count > 0:
        print("   ✅ User approved in DB.")
    else:
        print("   ⚠️ User not found in DB? Retrying login anyway.")
        
    # 3. Login
    print("3️⃣ Logging in...")
    login_res = requests.post(f"{BASE_URL}/auth/login", json={
        "email": email,
        "password": password
    })
    
    if login_res.status_code != 200:
        print(f"❌ Login Failed: {login_res.text}")
        return

    token = login_res.json().get("access_token")
    if not token:
        print("❌ No token received!")
        return

    headers = {"Authorization": f"Bearer {token}"}
    
    # 4. Register Product
    print("4️⃣ Registering Product...")
    product_data = {
        "product_name": "Premium Demo Item",
        "brand": "DemoBrand",
        "description": "Verification Test Item",
        "price": 999
    }
    
    res = requests.post(f"{BASE_URL}/product/register", json=product_data, headers=headers)
    
    if res.status_code == 200:
        data = res.json()
        print("\n" + "✅"*20)
        print(" SUCCESS! Product Hash Generated: ")
        print("✅"*20 + "\n")
        print(f"PRODUCT HASH: {data['product']['product_hash']}")
        print("\n" + "="*50)
        print("(Copy the above hash to the Verify page)")
    else:
        print(f"❌ Registration Failed: {res.text}")

if __name__ == "__main__":
    run_demo()
