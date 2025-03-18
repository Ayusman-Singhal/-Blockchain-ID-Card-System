import React, { useState } from 'react';
import { ethers } from 'ethers';

function CreateIDCard({ contract, showNotification }) {
  const [idHash, setIdHash] = useState('');
  const [metadataURI, setMetadataURI] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateIDCard = async (e) => {
    e.preventDefault();
    
    if (!idHash || !metadataURI) {
      showNotification("Please fill in all fields", "error");
      return;
    }
    
    // Validate idHash is a bytes32 (66 characters including 0x)
    if (!idHash.startsWith('0x') || idHash.length !== 66) {
      showNotification("ID Hash must be a valid bytes32 (0x followed by 64 hex characters)", "error");
      return;
    }
    
    try {
      setIsSubmitting(true);
      showNotification("Creating ID Card... Please confirm transaction in MetaMask", "info");
      
      const tx = await contract.createIDCard(idHash, metadataURI);
      showNotification("Transaction submitted, waiting for confirmation...", "info");
      
      await tx.wait();
      
      showNotification("ID Card created successfully!", "success");
      // Clear form
      setIdHash('');
      setMetadataURI('');
    } catch (error) {
      console.error("Error creating ID card:", error);
      showNotification(`Error: ${error.message || "Failed to create ID card"}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Helper to generate a hash from a string (for demo purposes)
  const generateHashFromString = async () => {
    const text = prompt("Enter some text to hash (e.g. name, ID number):");
    if (!text) return;
    
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      setIdHash(hashHex);
    } catch (error) {
      console.error("Error generating hash:", error);
      showNotification("Failed to generate hash", "error");
    }
  };

  // Helper to set a placeholder IPFS URI
  const getPlaceholderUrl = (e) => {
    e.preventDefault();
    setMetadataURI("ipfs://QmPlaceholder123456789");
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>Create ID Card</h2>
      </div>
      <div className="card-body">
        <form onSubmit={handleCreateIDCard}>
          <div className="form-group">
            <label htmlFor="idHash">ID Hash (bytes32)</label>
            <input
              type="text"
              id="idHash"
              value={idHash}
              onChange={(e) => setIdHash(e.target.value)}
              placeholder="0x1234..."
              disabled={isSubmitting}
            />
            <div className="form-text">
              <a href="#" onClick={generateHashFromString}>Generate hash from text</a>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="metadataURI">Metadata URI (IPFS)</label>
            <input
              type="text"
              id="metadataURI"
              value={metadataURI}
              onChange={(e) => setMetadataURI(e.target.value)}
              placeholder="ipfs://Qm..."
              disabled={isSubmitting}
            />
            <div className="form-text">
              URI pointing to additional encrypted metadata
              {' | '}
              <a href="#" onClick={getPlaceholderUrl}>Get placeholder URL</a>
            </div>
          </div>
          <button 
            type="submit" 
            className="btn btn-success btn-block" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Create ID Card'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateIDCard; 