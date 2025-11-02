// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Voting
 * @dev A secure decentralized voting system with one user, one vote principle
 * @notice This contract allows users to vote for candidates in a transparent manner
 */
contract Voting {
    
    // Struct to represent a candidate
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }
    
    // Mapping to store candidates
    mapping(uint256 => Candidate) public candidates;
    
    // Mapping to track if an address has already voted
    mapping(address => bool) public hasVoted;
    
    // Total number of candidates
    uint256 public candidatesCount;
    
    // Contract owner
    address public owner;
    
    // Voting status
    bool public votingActive;
    
    /**
     * @dev Event emitted when a vote is cast
     * @param voter Address of the voter
     * @param candidateId ID of the candidate voted for
     */
    event VoteCast(address indexed voter, uint256 indexed candidateId);
    
    /**
     * @dev Event emitted when a new candidate is added
     * @param candidateId ID of the newly added candidate
     * @param name Name of the candidate
     */
    event CandidateAdded(uint256 indexed candidateId, string name);
    
    /**
     * @dev Event emitted when voting status changes
     * @param isActive New voting status
     */
    event VotingStatusChanged(bool isActive);
    
    /**
     * @dev Modifier to restrict function access to contract owner only
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    /**
     * @dev Modifier to check if voting is currently active
     */
    modifier votingIsActive() {
        require(votingActive, "Voting is not active");
        _;
    }
    
    /**
     * @dev Constructor to initialize the contract
     * Sets the contract deployer as the owner and activates voting
     */
    constructor() {
        owner = msg.sender;
        votingActive = true;
    }
    
    /**
     * @dev Add a new candidate to the voting system
     * @param _name Name of the candidate
     * @notice Only the contract owner can add candidates
     */
    function addCandidate(string memory _name) public onlyOwner {
        require(bytes(_name).length > 0, "Candidate name cannot be empty");
        
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        
        emit CandidateAdded(candidatesCount, _name);
    }
    
    /**
     * @dev Cast a vote for a candidate
     * @param _candidateId ID of the candidate to vote for
     * @notice Each address can only vote once
     */
    function vote(uint256 _candidateId) public votingIsActive {
        // Ensure the voter hasn't voted before (one user, one vote)
        require(!hasVoted[msg.sender], "You have already voted");
        
        // Ensure the candidate ID is valid
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID");
        
        // Mark the address as having voted
        hasVoted[msg.sender] = true;
        
        // Increment the candidate's vote count
        candidates[_candidateId].voteCount++;
        
        // Emit the vote event for transparency
        emit VoteCast(msg.sender, _candidateId);
    }
    
    /**
     * @dev Get candidate details
     * @param _candidateId ID of the candidate
     * @return id Candidate ID
     * @return name Candidate name
     * @return voteCount Number of votes received
     */
    function getCandidate(uint256 _candidateId) public view returns (
        uint256 id,
        string memory name,
        uint256 voteCount
    ) {
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID");
        
        Candidate memory candidate = candidates[_candidateId];
        return (candidate.id, candidate.name, candidate.voteCount);
    }
    
    /**
     * @dev Check if an address has voted
     * @param _voter Address to check
     * @return bool True if the address has voted, false otherwise
     */
    function checkIfVoted(address _voter) public view returns (bool) {
        return hasVoted[_voter];
    }
    
    /**
     * @dev Toggle voting status (start/stop voting)
     * @param _status New voting status
     * @notice Only the contract owner can change voting status
     */
    function setVotingStatus(bool _status) public onlyOwner {
        votingActive = _status;
        emit VotingStatusChanged(_status);
    }
    
    /**
     * @dev Get the total number of candidates
     * @return uint256 Total number of candidates
     */
    function getTotalCandidates() public view returns (uint256) {
        return candidatesCount;
    }
    
    /**
     * @dev Get the winning candidate
     * @return winningCandidateId ID of the winning candidate
     * @return winningCandidateName Name of the winning candidate
     * @return winningVoteCount Vote count of the winning candidate
     */
    function getWinner() public view returns (
        uint256 winningCandidateId,
        string memory winningCandidateName,
        uint256 winningVoteCount
    ) {
        require(candidatesCount > 0, "No candidates available");
        
        uint256 maxVotes = 0;
        uint256 winnerId = 0;
        
        // Find the candidate with the most votes
        for (uint256 i = 1; i <= candidatesCount; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                winnerId = i;
            }
        }
        
        require(winnerId > 0, "No winner determined yet");
        
        Candidate memory winner = candidates[winnerId];
        return (winner.id, winner.name, winner.voteCount);
    }
}
