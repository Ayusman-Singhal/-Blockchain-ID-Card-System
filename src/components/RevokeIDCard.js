import React, { useState } from 'react';

function RevokeIDCard({ contract, showNotification, isOwner, isAuthority }) {
  const [userAddressToRevoke, setUserAddressToRevoke] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRevokeIDCard = async (e) => {
    e.preventDefault();
    
    if (!userAddressToRevoke) {
      showNotification("Please enter a user address", "error");
      return;
    }
    
    // Basic address validation
    if (!userAddressToRevoke.startsWith('0x') || userAddressToRevoke.length !== 42) {
      showNotification("Please enter a valid Ethereum address", "error");
      return;
    }
    
    // Check if user has authority to revoke
    if (!isOwner && !isAuthority) {
      showNotification("You don't have permission to revoke ID cards", "error");
      return;
    }
    
    try {
      setIsSubmitting(true);
      showNotification("Revoking ID Card... Please confirm transaction in MetaMask", "info");
      
      const tx = await contract.revokeIDCard(userAddressToRevoke);
      showNotification("Transaction submitted, waiting for confirmation...", "info");
      
      await tx.wait();
      
      showNotification("ID Card revoked successfully!", "success");
      // Clear form
      setUserAddressToRevoke('');
    } catch (error) {
      console.error("Error revoking ID card:", error);
      
      // Check for common errors
      if (error.message.includes("No ID exists for this address")) {
        showNotification("No ID card exists for the provided address", "error");
      } else if (error.message.includes("Only verified authorities can call this function")) {
        showNotification("You don't have permission to revoke ID cards", "error");
      } else {
        showNotification(`Error: ${error.message || "Failed to revoke ID card"}`, "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>Revoke ID Card</h2>
      </div>
      <div className="card-body">
        <form onSubmit={handleRevokeIDCard}>
          <div className="form-group">
            <label htmlFor="userAddressToRevoke">User Address to Revoke</label>
            <input
              type="text"
              id="userAddressToRevoke"
              value={userAddressToRevoke}
              onChange={(e) => setUserAddressToRevoke(e.target.value)}
              placeholder="0x..."
              disabled={isSubmitting}
            />
            <div className="form-text">
              Address of the user whose ID card should be revoked
            </div>
          </div>
          <button 
            type="submit" 
            className="btn btn-danger btn-block" 
            disabled={isSubmitting || (!isOwner && !isAuthority)}
          >
            {isSubmitting ? 'Processing...' : 'Revoke ID Card'}
          </button>
          
          {!isOwner && !isAuthority && (
            <div className="notification warning" style={{ marginTop: '1rem' }}>
              <p>Only contract owner or authorized authorities can revoke ID cards.</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default RevokeIDCard;