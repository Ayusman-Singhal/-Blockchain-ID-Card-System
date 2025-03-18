# Blockchain ID Card System - Setup Guide

This guide will help you set up and run the Blockchain ID Card System frontend application on your Windows machine.

## Prerequisites

1. **Node.js and npm**
   - Download and install Node.js from [nodejs.org](https://nodejs.org/)
   - Recommended version: Node.js 16.x or higher

2. **MetaMask Extension**
   - Install the MetaMask browser extension from [metamask.io](https://metamask.io/)
   - Set up a wallet and add Core testnet to your networks
   - Get some testnet CORE tokens for transaction fees

3. **Core Testnet Configuration for MetaMask**
   - Network Name: Core Testnet
   - RPC URL: https://rpc.test.btcs.network/
   - Chain ID: 1115
   - Currency Symbol: CORE
   - Block Explorer URL: https://scan.test.btcs.network/

## Setup Instructions

1. **Install Dependencies**

   Open Command Prompt in the project directory and run:
   ```
   npm install
   ```

2. **Start the Development Server**

   Run the following command:
   ```
   npm start
   ```

   This will start the React development server and open the application in your default web browser at `http://localhost:3000`.

## Using the Application

1. **Connect Your Wallet**
   - Click the "Connect Wallet" button
   - Approve the MetaMask connection request
   - Make sure you're connected to Core testnet in MetaMask

2. **Create an ID Card**
   - Fill in the ID Hash field (or use the "Generate hash from text" helper)
   - Enter a metadata URI (typically an IPFS URI)
   - Click "Create ID Card" and confirm the transaction in MetaMask

3. **Verify an ID Card**
   - Enter the user's Ethereum address
   - Enter the ID Hash to verify
   - Click "Verify ID Card" to check if the ID is valid

4. **Update Your ID Card**
   - Enter a new ID Hash
   - Enter a new metadata URI
   - Click "Update ID Card" and confirm the transaction in MetaMask

5. **Authority Functions (Owner Only)**
   - The contract owner can revoke ID cards
   - The contract owner can add or remove other verification authorities

## Additional Information

- **Contract Address**: `0x391cbeb6f1fa7418502e82a88fd5583f30e49bc5`
- **Smart Contract Source**: See `DigitalIDCard.sol` in the project repository

## Troubleshooting

1. **Transaction Errors**
   - Check if you have enough CORE tokens for gas
   - Make sure you're connected to Core testnet
   - Check console logs for detailed error messages

2. **MetaMask Connection Issues**
   - Try disconnecting and reconnecting your wallet
   - Ensure you have the latest version of MetaMask
   - Clear your browser cache if problems persist 