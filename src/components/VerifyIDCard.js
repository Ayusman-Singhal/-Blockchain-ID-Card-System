import React, { useState } from 'react';

function VerifyIDCard({ contract, showNotification }) {
  const [userAddress, setUserAddress] = useState('');
  const [idHash, setIdHash] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!userAddress || !idHash) {
      showNotification("Please fill in all fields", "error");
      return;
    }
    
    // Basic address validation
    if (!userAddress.startsWith('0x') || userAddress.length !== 42) {
      showNotification("Please enter a valid Ethereum address", "error");
      return;
    }
    
    // Validate idHash is a bytes32 (66 characters including 0x)
    if (!idHash.startsWith('0x') || idHash.length !== 66) {
      showNotification("ID Hash must be a valid bytes32 (0x followed by 64 hex characters)", "error");
      return;
    }
    
    try {
      setIsVerifying(true);
      setVerificationResult(null);
      
      const result = await contract.verifyIDCard(userAddress, idHash);
      
      setVerificationResult(result);
      showNotification(`Verification ${result ? "successful" : "failed"}`, result ? "success" : "warning");
    } catch (error) {
      console.error("Error verifying ID card:", error);
      showNotification(`Error: ${error.message || "Failed to verify ID card"}`, "error");
      setVerificationResult(null);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>Verify ID Card</h2>
      </div>
      <div className="card-body">
        <form onSubmit={handleVerify}>
          <div className="form-group">
            <label htmlFor="userAddress">User Address</label>
            <input
              type="text"
              id="userAddress"
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value)}
              placeholder="0x..."
              disabled={isVerifying}
            />
          </div>
          <div className="form-group">
            <label htmlFor="verifyIdHash">ID Hash (bytes32)</label>
            <input
              type="text"
              id="verifyIdHash"
              value={idHash}
              onChange={(e) => setIdHash(e.target.value)}
              placeholder="0x1234..."
              disabled={isVerifying}
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary btn-block" 
            disabled={isVerifying}
          >
            {isVerifying ? 'Verifying...' : 'Verify ID Card'}
          </button>
        </form>
        
        {verificationResult !== null && (
          <div className={`notification ${verificationResult ? 'success' : 'error'}`} style={{ marginTop: '1rem' }}>
            <h3>{verificationResult ? 'Verification Successful' : 'Verification Failed'}</h3>
            <p>
              {verificationResult 
                ? 'The ID card is valid and matches the provided hash.' 
                : 'The ID card is invalid or does not match the provided hash.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyIDCard; 