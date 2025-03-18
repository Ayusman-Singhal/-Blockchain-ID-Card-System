import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import ConnectWallet from './components/ConnectWallet';
import CreateIDCard from './components/CreateIDCard';
import VerifyIDCard from './components/VerifyIDCard';
import UpdateIDCard from './components/UpdateIDCard';
import RevokeIDCard from './components/RevokeIDCard';
import Authorities from './components/Authorities';
import Header from './components/Header';
import Footer from './components/Footer';

// Contract ABI - simplified for our main functions
const contractABI = [
  "function createIDCard(bytes32 _idHash, string memory _metadataURI) external",
  "function updateIDCard(bytes32 _newIdHash, string memory _newMetadataURI) external",
  "function verifyIDCard(address _user, bytes32 _idHash) external view returns (bool)",
  "function revokeIDCard(address _user) external",
  "function addAuthority(address _authority) external",
  "function removeAuthority(address _authority) external",
  "function owner() external view returns (address)",
  "function verifiedAuthorities(address) external view returns (bool)"
];

// Contract address on Core testnet
const contractAddress = "0x391cbeb6f1fa7418502e82a88fd5583f30e49bc5";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [userAddress, setUserAddress] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [isAuthority, setIsAuthority] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
    const checkOwnerAndAuthority = async () => {
      if (contract && userAddress) {
        try {
          const ownerAddress = await contract.owner();
          const isUserAuthority = await contract.verifiedAuthorities(userAddress);
          
          setIsOwner(ownerAddress.toLowerCase() === userAddress.toLowerCase());
          setIsAuthority(isUserAuthority);
        } catch (error) {
          console.error("Error checking owner/authority status:", error);
        }
      }
    };

    checkOwnerAndAuthority();
  }, [contract, userAddress]);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const providerInstance = new ethers.providers.Web3Provider(window.ethereum);
        await providerInstance.send("eth_requestAccounts", []);
        const signerInstance = providerInstance.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, contractABI, signerInstance);
        const address = await signerInstance.getAddress();

        setProvider(providerInstance);
        setSigner(signerInstance);
        setContract(contractInstance);
        setUserAddress(address);
        
        showNotification("Wallet connected successfully!", "success");
        
        return { success: true };
      } else {
        showNotification("MetaMask is not installed!", "error");
        return { success: false, error: "MetaMask is not installed" };
      }
    } catch (error) {
      showNotification(`Failed to connect wallet: ${error.message}`, "error");
      return { success: false, error: error.message };
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 5000);
  };

  return (
    <div className="app">
      <Header />
      
      <main className="container">
        {notification.message && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}
        
        <ConnectWallet 
          connectWallet={connectWallet} 
          userAddress={userAddress}
        />
        
        {contract && (
          <div className="card-grid">
            <CreateIDCard 
              contract={contract}
              showNotification={showNotification}
            />
            
            <VerifyIDCard 
              contract={contract}
              showNotification={showNotification}
            />
            
            <UpdateIDCard 
              contract={contract}
              showNotification={showNotification}
            />
            
            {(isOwner || isAuthority) && (
              <RevokeIDCard 
                contract={contract}
                showNotification={showNotification}
                isOwner={isOwner}
                isAuthority={isAuthority}
              />
            )}
            
            {isOwner && (
              <Authorities 
                contract={contract}
                showNotification={showNotification}
              />
            )}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default App; 