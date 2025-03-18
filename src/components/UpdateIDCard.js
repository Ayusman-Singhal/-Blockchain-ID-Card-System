import React, { useState } from 'react';
import { ethers } from 'ethers';

function UpdateIDCard({ contract, showNotification }) {
  const [newIdHash, setNewIdHash] = useState('');
  const [newMetadataURI, setNewMetadataURI] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateIDCard = async (e) => {
    e.preventDefault();
    
    if (!newIdHash || !newMetadataURI) {
      showNotification("Please fill in all fields", "error");
      return;
    }
    
    // Validate newIdHash is a bytes32 (66 characters including 0x)
    if (!newIdHash.startsWith('0x') || newIdHash.length !== 66) {
      showNotification("ID Hash must be a valid bytes32 (0x followed by 64 hex characters)", "error");
      return;
    }
    
    try {
      setIsSubmitting(true);
      showNotification("Updating ID Card... Please confirm transaction in MetaMask", "info");
      
      const tx = await contract.updateIDCard(newIdHash, newMetadataURI);
      showNotification("Transaction submitted, waiting for confirmation...", "info");
      
      await tx.wait();
      
      showNotification("ID Card updated successfully!", "success");
      // Clear form
      setNewIdHash('');
      setNewMetadataURI('');
    } catch (error) {
      console.error("Error updating ID card:", error);
      
      // Check for common errors
      if (error.message.includes("No ID exists for this address")) {
        showNotification("You don't have an ID card yet. Please create one first.", "error");
      } else if (error.message.includes("ID is currently invalid")) {
        showNotification("Your ID card has been revoked and cannot be updated.", "error");
      } else {
        showNotification(`Error: ${error.message || "Failed to update ID card"}`, "error");
      }
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
      
      setNewIdHash(hashHex);
    } catch (error) {
      console.error("Error generating hash:", error);
      showNotification("Failed to generate hash", "error");
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>Update ID Card</h2>
      </div>
      <div className="card-body">
        <form onSubmit={handleUpdateIDCard}>
          <div className="form-group">
            <label htmlFor="newIdHash">New ID Hash (bytes32)</label>
            <input
              type="text"
              id="newIdHash"
              value={newIdHash}
              onChange={(e) => setNewIdHash(e.target.value)}
              placeholder="0x1234..."
              disabled={isSubmitting}
            />
            <div className="form-text">
              <a href="#" onClick={generateHashFromString}>Generate hash from text</a>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="newMetadataURI">New Metadata URI (IPFS)</label>
            <input
              type="text"
              id="newMetadataURI"
              value={newMetadataURI}
              onChange={(e) => setNewMetadataURI(e.target.value)}
              placeholder="ipfs://Qm..."
              disabled={isSubmitting}
            />
            <div className="form-text">
              URI pointing to updated encrypted metadata
            </div>
          </div>
          <button 
            type="submit" 
            className="btn btn-primary btn-block" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Update ID Card'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateIDCard; 