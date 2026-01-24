// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title ProductVerification
 * @dev Smart contract for product authenticity verification on blockchain
 * @notice This contract stores product hashes and allows verification
 */
contract ProductVerification {
    // Mapping from product hash to registration status
    mapping(bytes32 => bool) private products;
    
    // Mapping from product hash to manufacturer address
    mapping(bytes32 => address) private productOwner;
    
    // Events
    event ProductRegistered(bytes32 indexed productHash, address indexed manufacturer);
    event ProductVerified(bytes32 indexed productHash, bool exists);
    
    /**
     * @dev Register a new product on the blockchain
     * @param productHash The SHA-256 hash of the product details
     * @return success Whether the registration was successful
     */
    function registerProduct(bytes32 productHash) public returns (bool) {
        // Check if product is already registered
        require(!products[productHash], "Product already registered");
        
        // Register the product
        products[productHash] = true;
        productOwner[productHash] = msg.sender;
        
        // Emit event
        emit ProductRegistered(productHash, msg.sender);
        
        return true;
    }
    
    /**
     * @dev Verify if a product exists on the blockchain
     * @param productHash The SHA-256 hash to verify
     * @return exists Whether the product is registered
     */
    function verifyProduct(bytes32 productHash) public view returns (bool) {
        return products[productHash];
    }
    
    /**
     * @dev Get the manufacturer address of a registered product
     * @param productHash The product hash to query
     * @return owner The address of the manufacturer who registered the product
     */
    function getProductOwner(bytes32 productHash) public view returns (address) {
        return productOwner[productHash];
    }
}
