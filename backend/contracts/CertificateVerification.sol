// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title CertificateVerification
 * @dev Smart contract for certificate authenticity verification on blockchain
 * @notice This contract stores certificate hashes and allows verification
 */
contract CertificateVerification {
    // Mapping from certificate hash to registration status
    mapping(bytes32 => bool) private certificates;
    
    // Mapping from certificate hash to issuer address
    mapping(bytes32 => address) private certificateOwner;
    
    // Events
    event CertificateIssued(bytes32 indexed certificateHash, address indexed issuer);
    event CertificateVerified(bytes32 indexed certificateHash, bool exists);
    
    /**
     * @dev Register a new certificate on the blockchain
     * @param certificateHash The SHA-256 hash of the certificate details
     * @return success Whether the registration was successful
     */
    function issueCertificate(bytes32 certificateHash) public returns (bool) {
        // Check if certificate is already registered
        require(!certificates[certificateHash], "Certificate already registered");
        
        // Register the certificate
        certificates[certificateHash] = true;
        certificateOwner[certificateHash] = msg.sender;
        
        // Emit event
        emit CertificateIssued(certificateHash, msg.sender);
        
        return true;
    }
    
    /**
     * @dev Verify if a certificate exists on the blockchain
     * @param certificateHash The SHA-256 hash to verify
     * @return exists Whether the certificate is registered
     */
    function verifyCertificate(bytes32 certificateHash) public view returns (bool) {
        return certificates[certificateHash];
    }
    
    /**
     * @dev Get the issuer address of a registered certificate
     * @param certificateHash The certificate hash to query
     * @return owner The address of the institution who registered the certificate
     */
    function getCertificateIssuer(bytes32 certificateHash) public view returns (address) {
        return certificateOwner[certificateHash];
    }
}
