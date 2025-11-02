import { useState, useEffect } from 'react';
import { MantineProvider, Container, Title, Text, Button, Card, Group, Stack, Notification, Tabs, Badge, Avatar, Box, BackgroundImage, Overlay } from '@mantine/core';
import { Notifications, notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { initializeWeb3, voteForCandidate, getCandidate, getCandidateCount, hasVoted, getCurrentAccount, getContract } from './utils/contractInteraction';
import VoteAnalytics from './components/VoteAnalytics';
import AuditLog from './components/AuditLog';
import VotingCard from './components/VotingCard';

function App() {
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [userHasVoted, setUserHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState(null);
  const [votingEndTime, setVotingEndTime] = useState(null);
  const [totalVotes, setTotalVotes] = useState(0);

  // Initialize Web3 and check MetaMask connection
  useEffect(() => {
    checkMetaMaskConnection();
  }, []);

  // Check if MetaMask is connected
  const checkMetaMaskConnection = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          const contractInstance = await getContract();
          setContract(contractInstance);
          await loadCandidates();
          await checkVoteStatus(accounts[0]);
        }
      }
    } catch (error) {
      console.error('Error checking MetaMask connection:', error);
    }
  };

  // Connect to MetaMask
  const connectWallet = async () => {
    try {
      setLoading(true);
      const { signer } = await initializeWeb3();
      const address = await signer.getAddress();
      setAccount(address);
      setIsConnected(true);
      const contractInstance = await getContract();
      setContract(contractInstance);
      await loadCandidates();
      await checkVoteStatus(address);
      notifications.show({
        title: 'Success',
        message: 'Wallet connected successfully!',
        color: 'green',
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to connect wallet',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  // Load candidates from smart contract
  const loadCandidates = async () => {
    try {
      const count = await getCandidateCount();
      const candidateList = [];
      let total = 0;
      for (let i = 1; i <= count; i++) {
        const candidate = await getCandidate(i);
        candidateList.push({ id: i, ...candidate });
        total += Number(candidate.voteCount);
      }
      setCandidates(candidateList);
      setTotalVotes(total);
    } catch (error) {
      console.error('Error loading candidates:', error);
    }
  };

  // Check if user has already voted
  const checkVoteStatus = async (address) => {
    try {
      const voted = await hasVoted(address);
      setUserHasVoted(voted);
    } catch (error) {
      console.error('Error checking vote status:', error);
    }
  };

  // Vote for a candidate
  const handleVote = async (candidateId) => {
    try {
      setLoading(true);
      await voteForCandidate(candidateId);
      notifications.show({
        title: 'Success',
        message: 'Vote cast successfully!',
        color: 'green',
      });
      await loadCandidates();
      await checkVoteStatus(account);
    } catch (error) {
      console.error('Error voting:', error);
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to cast vote',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MantineProvider theme={{ colorScheme: 'dark' }}>
      <Notifications position="top-right" />
      
      {/* Hero Section with Background Image and Gradient */}
      <Box
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1589802829985-817e51171b92?w=1200&auto=format&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.15,
          }}
        />
        <Overlay gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.65) 100%)" opacity={0.85} />
        
        <Container size="lg" py={80} style={{ position: 'relative', zIndex: 1 }}>
          <Stack gap="xl" align="center">
            <Box
              style={{
                textAlign: 'center',
                animation: 'fadeInUp 1s ease-out',
              }}
            >
              <Badge
                size="lg"
                variant="gradient"
                gradient={{ from: 'cyan', to: 'blue', deg: 90 }}
                mb="md"
                style={{
                  fontSize: '0.9rem',
                  padding: '12px 20px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                🗳️ Blockchain Powered
              </Badge>
              
              <Title
                order={1}
                size={60}
                mb="md"
                style={{
                  color: 'white',
                  fontWeight: 800,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  lineHeight: 1.2,
                }}
              >
                Decentralized Voting System
              </Title>
              
              <Text
                size="xl"
                c="dimmed"
                mb="xl"
                style={{
                  color: 'rgba(255,255,255,0.9)',
                  maxWidth: '600px',
                  margin: '0 auto 2rem auto',
                  fontSize: '1.25rem',
                  lineHeight: 1.6,
                }}
              >
                Cast your vote securely on the blockchain with complete transparency and immutability
              </Text>
              
              {!isConnected && (
                <Button
                  size="xl"
                  loading={loading}
                  onClick={connectWallet}
                  variant="gradient"
                  gradient={{ from: 'teal', to: 'lime', deg: 105 }}
                  style={{
                    fontSize: '1.1rem',
                    padding: '28px 48px',
                    height: 'auto',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  🔐 Connect MetaMask Wallet
                </Button>
              )}
            </Box>
          </Stack>
        </Container>
      </Box>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>

      <Container py="xl" size="lg">
        <Stack gap="xl">
          {isConnected && (
            <>
              <Card
                padding="lg"
                radius="md"
                shadow="sm"
                withBorder
                style={{
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                  borderColor: 'rgba(102, 126, 234, 0.3)',
                }}
              >
                <Group justify="space-between" wrap="wrap">
                  <Box>
                    <Text c="dimmed" size="sm" mb={4}>Connected Account</Text>
                    <Group gap="xs">
                      <Avatar
                        size="sm"
                        radius="xl"
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        }}
                      >
                        {account.substring(2, 4).toUpperCase()}
                      </Avatar>
                      <Text fw={600} size="sm" style={{ fontFamily: 'monospace' }}>
                        {account}
                      </Text>
                    </Group>
                  </Box>
                  {userHasVoted && (
                    <Badge
                      size="lg"
                      variant="gradient"
                      gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
                      leftSection="✅"
                    >
                      Vote Cast Successfully
                    </Badge>
                  )}
                </Group>
              </Card>

              <Tabs defaultValue="voting" variant="pills">
                <Tabs.List grow>
                  <Tabs.Tab value="voting" leftSection="🗳️">
                    <Text fw={600}>Cast Vote</Text>
                  </Tabs.Tab>
                  <Tabs.Tab value="analytics" leftSection="📊">
                    <Text fw={600}>Analytics</Text>
                  </Tabs.Tab>
                  <Tabs.Tab value="audit" leftSection="📜">
                    <Text fw={600}>Audit Log</Text>
                  </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="voting" pt="xl">
                  <Stack gap="xl">
                    <Box>
                      <Title order={2} mb="xs">
                        🏛️ Vote for Your Candidate
                      </Title>
                      <Text c="dimmed" size="lg">
                        Select your preferred candidate and cast your vote securely on the blockchain
                      </Text>
                    </Box>
                    
                    {candidates.length === 0 ? (
                      <Card padding="xl" radius="md" shadow="sm" withBorder ta="center">
                        <Text c="dimmed" size="lg">No candidates available</Text>
                      </Card>
                    ) : (
                      <Stack gap="md">
                        {candidates.map((candidate) => (
                          <VotingCard
                            key={candidate.id}
                            candidate={candidate}
                            onVote={handleVote}
                            disabled={userHasVoted || loading}
                            loading={loading}
                          />
                        ))}
                      </Stack>
                    )}
                  </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="analytics" pt="xl">
                  <VoteAnalytics
                    candidates={candidates}
                    totalVotes={totalVotes}
                    votingEndTime={votingEndTime}
                  />
                </Tabs.Panel>

                <Tabs.Panel value="audit" pt="xl">
                  <AuditLog contract={contract} />
                </Tabs.Panel>
              </Tabs>
            </>
          )}
        </Stack>
      </Container>
    </MantineProvider>
  );
}

export default App;
