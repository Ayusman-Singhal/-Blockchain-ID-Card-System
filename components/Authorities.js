import React, { useState } from 'react';

function Authorities({ contract, showNotification }) {
  const [authorityAddress, setAuthorityAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [operation, setOperation] = useState('add'); // 'add' or 'remove'

  const handleAuthorityOperation = async (e) => {
    e.preventDefault();
    
    if (!authorityAddress) {
      showNotification("Please enter an authority address", "error");
      return;
    }
    
    // Basic address validation
    if (!authorityAddress.startsWith('0x') || authorityAddress.length !== 42) {
      showNotification("Please enter a valid Ethereum address", "error");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (operation === 'add') {
        showNotification("Adding authority... Please confirm transaction in MetaMask", "info");
        const tx = await contract.addAuthority(authorityAddress);
        await tx.wait();
        showNotification(`Authority ${authorityAddress} added successfully!`, "success");
      } else {
        showNotification("Removing authority... Please confirm transaction in MetaMask", "info");
        const tx = await contract.removeAuthority(authorityAddress);
        await tx.wait();
        showNotification(`Authority ${authorityAddress} removed successfully!`, "success");
      }
      
      // Clear form
      setAuthorityAddress('');
    } catch (error) {
      console.error("Error managing authority:", error);
      
      if (error.message.includes("Only the contract owner can call this function")) {
        showNotification("Only the contract owner can manage authorities", "error");
      } else if (error.message.includes("Cannot remove contract owner as authority")) {
        showNotification("Cannot remove contract owner as authority", "error");
      } else {
        showNotification(`Error: ${error.message || "Failed to manage authority"}`, "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to get user's address from MetaMask
  const getUserAddressFromMetaMask = async (e) => {
    e.preventDefault();
    try {
      if (!window.ethereum) {
        showNotification("MetaMask is not installed", "error");
        return;
      }
      
      // Request account access if needed
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Use the first account
      if (accounts && accounts.length > 0) {
        setAuthorityAddress(accounts[0]);
      } else {
        showNotification("No accounts found. Please check MetaMask.", "error");
      }
    } catch (error) {
      console.error("Error getting address from MetaMask:", error);
      showNotification("Failed to get address from MetaMask", "error");
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>Manage Authorities</h2>
      </div>
      <div className="card-body">
        <form onSubmit={handleAuthorityOperation}>
          <div className="form-group">
            <label htmlFor="operation">Operation</label>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'inline', marginRight: '15px' }}>
                <input 
                  type="radio" 
                  name="operation" 
                  value="add" 
                  checked={operation === 'add'} 
                  onChange={() => setOperation('add')}
                  style={{ marginRight: '5px' }}
                />
                Add Authority
              </label>
              <label style={{ display: 'inline' }}>
                <input 
                  type="radio" 
                  name="operation" 
                  value="remove" 
                  checked={operation === 'remove'} 
                  onChange={() => setOperation('remove')}
                  style={{ marginRight: '5px' }}
                />
                Remove Authority
              </label>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="authorityAddress">Authority Address</label>
            <input
              type="text"
              id="authorityAddress"
              value={authorityAddress}
              onChange={(e) => setAuthorityAddress(e.target.value)}
              placeholder="0x..."
              disabled={isSubmitting}
            />
            <div className="form-text">
              Ethereum address to {operation === 'add' ? 'add as' : 'remove from'} authorized verifier
              {' | '}
              <a href="#" onClick={getUserAddressFromMetaMask}>Get address from MetaMask</a>
            </div>
          </div>
          <button 
            type="submit" 
            className={`btn ${operation === 'add' ? 'btn-success' : 'btn-danger'} btn-block`} 
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? 'Processing...' 
              : operation === 'add' 
                ? 'Add Authority' 
                : 'Remove Authority'
            }
          </button>
        </form>
      </div>
    </div>
  );
}

export default Authorities; 