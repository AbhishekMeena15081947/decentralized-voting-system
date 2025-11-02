# 🗳️ Decentralized Voting System

A beautiful dark-themed Decentralized Voting System built with React (Mantine) and Solidity. This application enables transparent, secure, and tamper-proof voting on the Ethereum blockchain.

![Voting System Banner](https://via.placeholder.com/1200x300/1a1b1e/00d9ff?text=Decentralized+Voting+System)

## ✨ Features

- 🔐 **Secure & Transparent**: All votes are recorded on the blockchain
- 🎨 **Beautiful Dark UI**: Modern interface built with Mantine
- 🦊 **MetaMask Integration**: Easy wallet connection
- ⚡ **Real-time Updates**: Live vote counting
- 📊 **Vote Analytics**: Visual representation of results
- 🔒 **One Vote Per Address**: Prevents double voting

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MetaMask** browser extension - [Install](https://metamask.io/)
- **Git** - [Download](https://git-scm.com/)

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/AbhishekMeena15081947/decentralized-voting-system.git
cd decentralized-voting-system
```

### 2. Install Dependencies

Install all required npm packages:

```bash
npm install
```

This will install:
- React and React DOM
- Mantine UI components
- ethers.js for blockchain interaction
- Hardhat for smart contract development
- And all other dependencies

### 3. Smart Contract Setup

#### Compile Smart Contracts

```bash
npx hardhat compile
```

This command compiles your Solidity smart contracts and generates the necessary artifacts.

#### Configure Network

Create a `.env` file in the root directory:

```bash
touch .env
```

Add your configuration:

```env
PRIVATE_KEY=your_wallet_private_key_here
INFURA_API_KEY=your_infura_api_key_here
```

⚠️ **Important**: Never commit your `.env` file to version control!

#### Deploy to Local Network

For local testing with Hardhat:

```bash
# Terminal 1 - Start local blockchain
npx hardhat node

# Terminal 2 - Deploy contracts
npx hardhat run scripts/deploy.js --network localhost
```

#### Deploy to Testnet (Sepolia)

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

#### Deploy to Mainnet

```bash
npx hardhat run scripts/deploy.js --network mainnet
```

**Note**: Save the deployed contract address! You'll need it for the frontend configuration.

### 4. Configure Frontend

Update the contract address in your frontend configuration file (typically `src/config.js` or `src/constants.js`):

```javascript
export const CONTRACT_ADDRESS = "0xYourDeployedContractAddress";
```

### 5. Start the Development Server

```bash
npm start
```

The application will open at `http://localhost:3000`

## 📱 Usage Guide for End-Users

### Step 1: Install MetaMask

![MetaMask Installation](https://via.placeholder.com/800x400/1a1b1e/00d9ff?text=Install+MetaMask+Extension)

1. Visit [metamask.io](https://metamask.io/)
2. Click "Download" and install the browser extension
3. Follow the setup wizard to create a new wallet
4. **IMPORTANT**: Save your Secret Recovery Phrase securely!

### Step 2: Configure MetaMask Network

![Network Configuration](https://via.placeholder.com/800x400/1a1b1e/00d9ff?text=Configure+Network)

For **Local Development** (Hardhat):

1. Open MetaMask
2. Click the network dropdown at the top
3. Select "Add Network" → "Add a network manually"
4. Enter the following details:
   - **Network Name**: Hardhat Local
   - **RPC URL**: http://127.0.0.1:8545/
   - **Chain ID**: 31337
   - **Currency Symbol**: ETH

For **Sepolia Testnet**:

1. Click the network dropdown
2. Enable "Show test networks" in settings
3. Select "Sepolia"

### Step 3: Get Test ETH (For Testnets)

![Faucet](https://via.placeholder.com/800x400/1a1b1e/00d9ff?text=Get+Test+ETH)

Visit a Sepolia faucet:
- [Sepolia Faucet 1](https://sepoliafaucet.com/)
- [Alchemy Sepolia Faucet](https://sepoliafaucet.net/)

Paste your wallet address and request test ETH.

### Step 4: Connect Your Wallet

![Connect Wallet](https://via.placeholder.com/800x400/1a1b1e/00d9ff?text=Connect+Wallet+Button)

1. Open the voting application
2. Click the **"Connect Wallet"** button
3. MetaMask will popup - click **"Connect"**
4. Select the account you want to use
5. Approve the connection

### Step 5: Browse Candidates

![Candidates View](https://via.placeholder.com/800x400/1a1b1e/00d9ff?text=View+Candidates)

Once connected, you'll see:
- List of all candidates
- Current vote counts for each candidate
- Candidate information and details

### Step 6: Cast Your Vote

![Vote Button](https://via.placeholder.com/800x400/1a1b1e/00d9ff?text=Cast+Your+Vote)

1. Review all candidates
2. Click **"Vote"** on your preferred candidate
3. MetaMask will popup requesting transaction confirmation
4. Review the gas fees
5. Click **"Confirm"** to submit your vote

### Step 7: Transaction Confirmation

![Transaction Confirmation](https://via.placeholder.com/800x400/1a1b1e/00d9ff?text=Transaction+Confirmed)

- Wait for the transaction to be mined (usually 15-30 seconds)
- You'll see a success message once confirmed
- The vote count will update automatically
- Your vote is now permanently recorded on the blockchain!

### Step 8: View Results

![Results Dashboard](https://via.placeholder.com/800x400/1a1b1e/00d9ff?text=View+Results)

- See real-time vote counts
- View voting statistics
- Track total participation
- All data is pulled directly from the blockchain

## 🔍 Troubleshooting

### MetaMask Not Connecting

- Ensure MetaMask is installed and unlocked
- Check that you're on the correct network
- Refresh the page and try again
- Clear browser cache if issues persist

### Transaction Failing

- Ensure you have enough ETH for gas fees
- Check if you've already voted (one vote per address)
- Verify the contract is deployed correctly
- Check network congestion

### Contract Not Found

- Verify the contract address in your configuration
- Ensure you're connected to the correct network
- Check that the contract is deployed

## 🏗️ Project Structure

```
decentralized-voting-system/
├── contracts/           # Solidity smart contracts
├── scripts/            # Deployment scripts
├── test/               # Contract tests
├── src/
│   ├── components/     # React components
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   └── config.js       # Configuration
├── public/             # Static files
├── hardhat.config.js   # Hardhat configuration
└── package.json        # Dependencies
```

## 🧪 Testing

Run smart contract tests:

```bash
npx hardhat test
```

Run tests with coverage:

```bash
npx hardhat coverage
```

## 📦 Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Mantine UI](https://mantine.dev/) - Beautiful React components
- [Hardhat](https://hardhat.org/) - Ethereum development environment
- [ethers.js](https://docs.ethers.io/) - Ethereum library
- [MetaMask](https://metamask.io/) - Crypto wallet

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check existing issues for solutions
- Read the troubleshooting section above

## 🎯 Roadmap

- [ ] Add voter registration system
- [ ] Implement time-bound voting periods
- [ ] Add admin dashboard
- [ ] Multi-language support
- [ ] Mobile app version
- [ ] Advanced analytics and charts

---

**Made with ❤️ for decentralized democracy**
