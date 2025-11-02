# Decentralized Voting System - Frontend

A modern, decentralized voting application built with React, Vite, Mantine UI, and Web3 integration.

## Features

- 🔐 MetaMask wallet integration
- 🎨 Beautiful UI with Mantine components
- ⚡ Fast development with Vite
- 📱 Responsive design
- 🔗 Smart contract interaction using ethers.js
- 🎯 Real-time vote tracking
- 🔔 Toast notifications for user feedback

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16 or higher)
- npm or yarn
- MetaMask browser extension
- A deployed voting smart contract

## Installation

1. Clone the repository:
```bash
git clone https://github.com/AbhishekMeena15081947/decentralized-voting-system.git
cd decentralized-voting-system/frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and update the following variables:
- `VITE_CONTRACT_ADDRESS`: Your deployed smart contract address
- `VITE_NETWORK`: Network you're deploying to (mainnet, goerli, sepolia, localhost)
- `VITE_RPC_URL`: RPC URL for your network (optional)

## Development

Start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## Building for Production

Build the application:

```bash
npm run build
# or
yarn build
```

The production-ready files will be in the `dist` directory.

## Preview Production Build

Preview the production build locally:

```bash
npm run preview
# or
yarn preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/        # React components
│   │   └── VotingCard.jsx # Voting card component
│   ├── utils/            # Utility functions
│   │   └── contractInteraction.js # Web3 contract interaction
│   ├── App.jsx           # Main application component
│   └── main.jsx          # Application entry point
├── public/               # Static assets
├── index.html            # HTML entry point
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite configuration
├── postcss.config.cjs    # PostCSS configuration
├── .eslintrc.cjs         # ESLint configuration
├── .env.example          # Environment variables template
└── README.md             # This file
```

## Technologies Used

- **React 18** - UI library
- **Vite 5** - Build tool and dev server
- **Mantine 7** - UI component library
- **ethers.js 6** - Ethereum library for Web3 interaction
- **ESLint** - Code linting
- **PostCSS** - CSS processing

## Smart Contract Integration

The application interacts with a Solidity smart contract through the `contractInteraction.js` utility file. Key functions include:

- `initializeWeb3()` - Initialize Web3 connection
- `voteForCandidate(candidateId)` - Cast a vote
- `getCandidate(candidateId)` - Get candidate details
- `getCandidateCount()` - Get total candidates
- `hasVoted(address)` - Check if address has voted

## Usage

1. **Connect Wallet**: Click "Connect MetaMask" to connect your wallet
2. **View Candidates**: Browse available candidates and their vote counts
3. **Cast Vote**: Click the "Vote" button for your preferred candidate
4. **Confirm Transaction**: Approve the transaction in MetaMask
5. **Track Results**: View real-time vote count updates

## Troubleshooting

### MetaMask Not Detected
- Ensure MetaMask extension is installed and enabled
- Try refreshing the page
- Check browser console for errors

### Transaction Failures
- Ensure you have sufficient ETH for gas fees
- Check that you haven't already voted
- Verify you're connected to the correct network

### Contract Connection Issues
- Verify the contract address in `.env` is correct
- Ensure the contract is deployed on the network you're using
- Check that the contract ABI matches your deployed contract

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.
