import { ethers } from 'ethers';

// Contract ABI - Update this with your actual contract ABI
const CONTRACT_ABI = [
  "function vote(uint256 candidateId) public",
  "function getCandidate(uint256 candidateId) public view returns (string memory name, uint256 voteCount)",
  "function getCandidateCount() public view returns (uint256)",
  "function hasVoted(address voter) public view returns (bool)",
  "event Voted(address indexed voter, uint256 indexed candidateId, uint256 timestamp)"
];

// Contract address - Update this with your deployed contract address
const CONTRACT_ADDRESS = process.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

let provider;
let signer;
let contract;

// Initialize Web3 connection
export const initializeWeb3 = async () => {
  try {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed!');
    }

    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Create provider and signer
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();

    // Initialize contract
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    return { provider, signer, contract };
  } catch (error) {
    console.error('Error initializing Web3:', error);
    throw error;
  }
};

// Get contract instance
export const getContract = async () => {
  try {
    if (!contract) {
      await initializeWeb3();
    }
    return contract;
  } catch (error) {
    console.error('Error getting contract:', error);
    throw error;
  }
};

// Get current account
export const getCurrentAccount = async () => {
  try {
    if (!signer) {
      await initializeWeb3();
    }
    const address = await signer.getAddress();
    return address;
  } catch (error) {
    console.error('Error getting current account:', error);
    throw error;
  }
};

// Get network information
export const getNetwork = async () => {
  try {
    if (!provider) {
      await initializeWeb3();
    }
    const network = await provider.getNetwork();
    return network;
  } catch (error) {
    console.error('Error getting network:', error);
    throw error;
  }
};

// Vote for a candidate
export const voteForCandidate = async (candidateId) => {
  try {
    if (!contract) {
      await initializeWeb3();
    }
    const tx = await contract.vote(candidateId);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error('Error voting:', error);
    throw error;
  }
};

// Get candidate details
export const getCandidate = async (candidateId) => {
  try {
    if (!contract) {
      await initializeWeb3();
    }
    const [name, voteCount] = await contract.getCandidate(candidateId);
    return { name, voteCount: voteCount.toString() };
  } catch (error) {
    console.error('Error getting candidate:', error);
    throw error;
  }
};

// Get total number of candidates
export const getCandidateCount = async () => {
  try {
    if (!contract) {
      await initializeWeb3();
    }
    const count = await contract.getCandidateCount();
    return count.toString();
  } catch (error) {
    console.error('Error getting candidate count:', error);
    throw error;
  }
};

// Check if an address has voted
export const hasVoted = async (address) => {
  try {
    if (!contract) {
      await initializeWeb3();
    }
    const voted = await contract.hasVoted(address);
    return voted;
  } catch (error) {
    console.error('Error checking vote status:', error);
    throw error;
  }
};

// Listen to Voted events
export const listenToVotedEvents = (callback) => {
  try {
    if (!contract) {
      throw new Error('Contract not initialized');
    }
    contract.on('Voted', (voter, candidateId, timestamp) => {
      callback({ voter, candidateId: candidateId.toString(), timestamp: timestamp.toString() });
    });
  } catch (error) {
    console.error('Error listening to events:', error);
    throw error;
  }
};

// Remove event listeners
export const removeVotedEventListeners = () => {
  try {
    if (contract) {
      contract.removeAllListeners('Voted');
    }
  } catch (error) {
    console.error('Error removing event listeners:', error);
  }
};
