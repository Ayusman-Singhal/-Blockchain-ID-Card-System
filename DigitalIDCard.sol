// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/**
 * @title Blockchain ID Card System
 * @dev A decentralized digital identity management system
 */
contract DigitalIDCard {
    address public owner;
    
    struct IdentityCard {
        bytes32 idHash;         // Hash of the identity details
        address userAddress;    // Ethereum address of the identity owner
        uint256 creationTime;   // Timestamp when the ID was created
        uint256 lastUpdated;    // Timestamp when the ID was last updated
        bool isValid;           // Validity status of the ID
        string metadataURI;     // IPFS URI for additional metadata (encrypted)
    }
    
    // Mapping from user address to their identity card
    mapping(address => IdentityCard) private identityCards;
    
    // Mapping to track verified authorities who can validate IDs
    mapping(address => bool) public verifiedAuthorities;
    
    // Events
    event IDCardCreated(address indexed user, bytes32 idHash, uint256 timestamp);
    event IDCardUpdated(address indexed user, bytes32 idHash, uint256 timestamp);
    event IDCardRevoked(address indexed user, uint256 timestamp);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }
    
    modifier onlyAuthority() {
        require(verifiedAuthorities[msg.sender], "Only verified authorities can call this function");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        verifiedAuthorities[msg.sender] = true;
    }
    
    /**
     * @dev Creates a new digital identity card
     * @param _idHash Hash of the identity details
     * @param _metadataURI IPFS URI pointing to additional encrypted metadata
     */
    function createIDCard(bytes32 _idHash, string memory _metadataURI) external {
        require(identityCards[msg.sender].idHash == bytes32(0), "ID already exists for this address");
        
        identityCards[msg.sender] = IdentityCard({
            idHash: _idHash,
            userAddress: msg.sender,
            creationTime: block.timestamp,
            lastUpdated: block.timestamp,
            isValid: true,
            metadataURI: _metadataURI
        });
        
        emit IDCardCreated(msg.sender, _idHash, block.timestamp);
    }
    
    /**
     * @dev Updates an existing digital identity card
     * @param _newIdHash New hash of the identity details
     * @param _newMetadataURI New IPFS URI pointing to additional encrypted metadata
     */
    function updateIDCard(bytes32 _newIdHash, string memory _newMetadataURI) external {
        require(identityCards[msg.sender].idHash != bytes32(0), "No ID exists for this address");
        require(identityCards[msg.sender].isValid, "ID is currently invalid");
        
        identityCards[msg.sender].idHash = _newIdHash;
        identityCards[msg.sender].metadataURI = _newMetadataURI;
        identityCards[msg.sender].lastUpdated = block.timestamp;
        
        emit IDCardUpdated(msg.sender, _newIdHash, block.timestamp);
    }
    
    /**
     * @dev Verifies if a given address has a valid ID card with a matching hash
     * @param _user Address of the user to verify
     * @param _idHash The expected hash to match against
     * @return Whether the verification was successful
     */
    function verifyIDCard(address _user, bytes32 _idHash) external view returns (bool) {
        return (
            identityCards[_user].isValid &&
            identityCards[_user].idHash == _idHash
        );
    }
    
    /**
     * @dev Revokes an ID card (can only be done by authorities)
     * @param _user Address of the user whose ID should be revoked
     */
    function revokeIDCard(address _user) external onlyAuthority {
        require(identityCards[_user].idHash != bytes32(0), "No ID exists for this address");
        
        identityCards[_user].isValid = false;
        
        emit IDCardRevoked(_user, block.timestamp);
    }
    
    /**
     * @dev Adds a new verified authority
     * @param _authority Address of the new authority
     */
    function addAuthority(address _authority) external onlyOwner {
        verifiedAuthorities[_authority] = true;
    }
    
    /**
     * @dev Removes a verified authority
     * @param _authority Address of the authority to remove
     */
    function removeAuthority(address _authority) external onlyOwner {
        require(_authority != owner, "Cannot remove contract owner as authority");
        verifiedAuthorities[_authority] = false;
    }
} 