import React from 'react';

function ConnectWallet({ connectWallet, userAddress }) {
  return (
    <div className="connect-card">
      <div>
        <h2>Wallet Connection</h2>
        {userAddress ? (
          <div className="wallet-address">
            <p><strong>Connected Address:</strong></p>
            <p>{userAddress}</p>
          </div>
        ) : (
          <p>Connect your wallet to interact with the contract</p>
        )}
      </div>
      {!userAddress && (
        <button className="btn btn-primary" onClick={connectWallet}>
          Connect Wallet
        </button>
      )}
    </div>
  );
}

export default ConnectWallet; 