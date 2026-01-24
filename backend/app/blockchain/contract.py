"""
Smart contract interaction module.
"""
from web3 import Web3
from .web3_client import get_web3, get_default_account
from ..config.settings import get_settings
import json
from pathlib import Path

settings = get_settings()

# Contract ABI (Application Binary Interface)
CONTRACT_ABI = [
    {
      "anonymous": False,
      "inputs": [
        {"indexed": True, "internalType": "bytes32", "name": "productHash", "type": "bytes32"},
        {"indexed": True, "internalType": "address", "name": "manufacturer", "type": "address"}
      ],
      "name": "ProductRegistered",
      "type": "event"
    },
    {
      "anonymous": False,
      "inputs": [
        {"indexed": True, "internalType": "bytes32", "name": "productHash", "type": "bytes32"},
        {"indexed": False, "internalType": "bool", "name": "exists", "type": "bool"}
      ],
      "name": "ProductVerified",
      "type": "event"
    },
    {
      "inputs": [{"internalType": "bytes32", "name": "productHash", "type": "bytes32"}],
      "name": "getProductOwner",
      "outputs": [{"internalType": "address", "name": "", "type": "address"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "bytes32", "name": "productHash", "type": "bytes32"}],
      "name": "registerProduct",
      "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "bytes32", "name": "productHash", "type": "bytes32"}],
      "name": "verifyProduct",
      "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
      "stateMutability": "view",
      "type": "function"
    }
]

# Contract bytecode - Compiled from contracts/ProductVerification.sol
CONTRACT_BYTECODE = "608060405234801561001057600080fd5b50610400806100206000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c806389e100ca14610046578063bb37dc5014610076578063eda45965146100a6575b600080fd5b610060600480360381019061005b919061027d565b6100d6565b60405161006d919061031f565b60405180910390f35b610090600480360381019061008b919061027d565b610202565b60405161009d9190610304565b60405180910390f35b6100c060048036038101906100bb919061027d565b61023f565b6040516100cd919061031f565b60405180910390f35b600080600083815260200190815260200160002060009054906101000a900460ff1615610138576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161012f9061033a565b60405180910390fd5b600160008084815260200190815260200160002060006101000a81548160ff021916908315150217905550336001600084815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055503373ffffffffffffffffffffffffffffffffffffffff16827fc9484fe818367891478f62bbffa32d87f515bbcb8e28e2106e62c73335747baa60405160405180910390a360019050919050565b60006001600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b600080600083815260200190815260200160002060009054906101000a900460ff169050919050565b600081359050610277816103b3565b92915050565b60006020828403121561028f57600080fd5b600061029d84828501610268565b91505092915050565b6102af8161036b565b82525050565b6102be8161037d565b82525050565b60006102d1601a8361035a565b91507f50726f6475637420616c726561647920726567697374657265640000000000006000830152602082019050919050565b600060208201905061031960008301846102a6565b92915050565b600060208201905061033460008301846102b5565b92915050565b60006020820190508181036000830152610353816102c4565b9050919050565b600082825260208201905092915050565b600061037682610393565b9050919050565b60008115159050919050565b6000819050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6103bc81610389565b81146103c757600080fd5b5056fea26469706673582212202ff81ea643845f429feeec194c1c072751407b43ce3f91556278281fdd63938e64736f6c63430008000033"

contract_instance = None
contract_address = None


async def deploy_contract():
    """Deploy the smart contract to Ganache."""
    global contract_instance, contract_address
    
    w3 = get_web3()
    if not w3 or not w3.is_connected():
        print("Cannot deploy contract: Not connected to blockchain")
        return None
    
    default_account = get_default_account()
    if not default_account:
        print("Cannot deploy contract: No accounts available")
        return None
    
    try:
        # Create contract
        Contract = w3.eth.contract(abi=CONTRACT_ABI, bytecode=CONTRACT_BYTECODE)
        
        # Deploy with explicit gas
        tx_hash = Contract.constructor().transact({
            'from': default_account,
            'gas': 3000000
        })
        tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        
        contract_address = tx_receipt.contractAddress
        contract_instance = w3.eth.contract(address=contract_address, abi=CONTRACT_ABI)
        
        print(f"Contract deployed at: {contract_address}")
        return contract_address
        
    except Exception as e:
        print(f"Contract deployment error: {e}")
        return None


def get_contract():
    """Get the deployed contract instance."""
    global contract_instance
    return contract_instance


def set_contract_address(address: str):
    """Set contract address from environment."""
    global contract_instance, contract_address
    
    w3 = get_web3()
    if w3 and w3.is_connected() and address:
        contract_address = address
        contract_instance = w3.eth.contract(address=address, abi=CONTRACT_ABI)
        return True
    return False


async def register_product_on_blockchain(product_hash: str) -> dict:
    """
    Register a product hash on the blockchain.
    
    Args:
        product_hash: 64-character hex string (SHA-256 hash)
        
    Returns:
        dict with tx_hash and success status
    """
    global contract_instance
    
    w3 = get_web3()
    if not w3 or not w3.is_connected():
        print("Web3 not connected")
        return {"success": False, "error": "Not connected to blockchain"}
    
    if not contract_instance:
        print("Contract instance is None, attempting to deploy...")
        # Try to deploy if not deployed
        await deploy_contract()
        if not contract_instance:
            print("Contract deployment failed")
            return {"success": False, "error": "Contract not deployed"}
    
    try:
        print(f"Registering hash on blockchain: {product_hash}")
        
        # Convert hex string to bytes32
        hash_bytes = bytes.fromhex(product_hash)
        
        default_account = get_default_account()
        print(f"   Using account: {default_account}")
        
        # Call registerProduct function
        tx_hash = contract_instance.functions.registerProduct(hash_bytes).transact({
            'from': default_account,
            'gas': 1000000
        })
        
        print(f"   Transaction sent: {tx_hash.hex()}")
        
        # Wait for transaction receipt
        tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        print(f"   Transaction confirmed in block {tx_receipt.blockNumber}")
        
        return {
            "success": True,
            "tx_hash": tx_hash.hex(),
            "block_number": tx_receipt.blockNumber
        }
        
    except Exception as e:
        print(f"Blockchain error: {str(e)}")
        # Print full traceback
        import traceback
        traceback.print_exc()
        return {"success": False, "error": str(e)}


async def verify_product_on_blockchain(product_hash: str) -> dict:
    """
    Verify if a product hash exists on the blockchain.
    
    Args:
        product_hash: 64-character hex string (SHA-256 hash)
        
    Returns:
        dict with exists status and owner address
    """
    global contract_instance
    
    w3 = get_web3()
    if not w3 or not w3.is_connected():
        return {"success": False, "exists": False, "error": "Not connected to blockchain"}
    
    if not contract_instance:
        return {"success": False, "exists": False, "error": "Contract not deployed"}
    
    try:
        # Convert hex string to bytes32
        hash_bytes = bytes.fromhex(product_hash)
        
        # Call verifyProduct function
        exists = contract_instance.functions.verifyProduct(hash_bytes).call()
        
        result = {
            "success": True,
            "exists": exists
        }
        
        if exists:
            # Get owner address
            owner = contract_instance.functions.getProductOwner(hash_bytes).call()
            result["owner"] = owner
        
        return result
        
    except Exception as e:
        return {"success": False, "exists": False, "error": str(e)}
