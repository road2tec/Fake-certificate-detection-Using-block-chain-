import sys
import os
from pathlib import Path

# Add backend directory to path so we can import app modules
backend_dir = Path(__file__).resolve().parent
sys.path.append(str(backend_dir))

from app.config.settings import get_settings
from web3 import Web3
from web3.middleware import geth_poa_middleware

def test_connection():
    settings = get_settings()
    print(f"Testing connection to: {settings.ganache_url}")
    
    try:
        w3 = Web3(Web3.HTTPProvider(settings.ganache_url))
        w3.middleware_onion.inject(geth_poa_middleware, layer=0)
        
        if w3.is_connected():
            print("✅ Successfully connected to Ganache!")
            
            # Check accounts
            accounts = w3.eth.accounts
            print(f"Found {len(accounts)} accounts.")
            if accounts:
                print(f"Default account: {accounts[0]}")
                balance = w3.eth.get_balance(accounts[0])
                print(f"Balance: {w3.from_wei(balance, 'ether')} ETH")
            
            # Check block number
            print(f"Current block number: {w3.eth.block_number}")
            
            return True
        else:
            print("❌ Failed to connect to Ganache.")
            print("Please ensure Ganache is running and listening on the correct port.")
            return False
            
    except Exception as e:
        print(f"❌ Connection error: {str(e)}")
        return False

if __name__ == "__main__":
    test_connection()
