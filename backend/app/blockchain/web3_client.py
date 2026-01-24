"""
Web3 client for blockchain interaction.
"""
from web3 import Web3
from web3.middleware import geth_poa_middleware
from ..config.settings import get_settings
import json
from pathlib import Path

settings = get_settings()

# Web3 instance
w3 = None
contract = None


def init_web3():
    """Initialize Web3 connection to Ganache."""
    global w3
    try:
        w3 = Web3(Web3.HTTPProvider(settings.ganache_url))
        w3.middleware_onion.inject(geth_poa_middleware, layer=0)
        
        if w3.is_connected():
            print(f"Connected to blockchain: {settings.ganache_url}")
            return True
        else:
            print("Failed to connect to blockchain")
            return False
    except Exception as e:
        print(f"Blockchain connection error: {e}")
        return False


def get_web3():
    """Get Web3 instance."""
    global w3
    if w3 is None:
        init_web3()
    return w3


def is_connected() -> bool:
    """Check if connected to blockchain."""
    global w3
    if w3 is None:
        return False
    return w3.is_connected()


def get_accounts():
    """Get list of accounts from Ganache."""
    web3 = get_web3()
    if web3 and web3.is_connected():
        return web3.eth.accounts
    return []


def get_default_account():
    """Get the default account (first Ganache account)."""
    accounts = get_accounts()
    return accounts[0] if accounts else None


def get_balance(address: str) -> float:
    """Get ETH balance for an address."""
    web3 = get_web3()
    if web3 and web3.is_connected():
        balance_wei = web3.eth.get_balance(address)
        return web3.from_wei(balance_wei, 'ether')
    return 0.0
