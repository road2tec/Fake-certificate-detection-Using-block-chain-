import solcx
import json
from pathlib import Path

def compile_contract():
    print("Installing solc...")
    # Install specific version of solc
    solcx.install_solc('0.8.0')
    
    print("Compiling contract...")
    contract_path = Path("contracts/ProductVerification.sol")
    
    with open(contract_path, "r") as f:
        source = f.read()
        
    compiled = solcx.compile_source(
        source,
        output_values=["abi", "bin"],
        solc_version='0.8.0'
    )
    
    contract_id = "<stdin>:ProductVerification"
    interface = compiled[contract_id]
    
    print("\n✅ Compilation successful!")
    print(f"ABI Length: {len(json.dumps(interface['abi']))}")
    print(f"Bytecode Length: {len(interface['bin'])}")
    
    # Save to file so we can copy it easily
    with open("contract_data.json", "w") as f:
        json.dump({
            "abi": interface['abi'],
            "bytecode": interface['bin']
        }, f, indent=2)
        
    print("Saved to contract_data.json")

if __name__ == "__main__":
    compile_contract()
