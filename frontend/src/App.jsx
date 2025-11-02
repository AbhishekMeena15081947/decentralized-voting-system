import { useState, useEffect } from 'react';
import { MantineProvider, Container, Title, Text, Button, Card, Group, Stack, Notification } from '@mantine/core';
import { Notifications, notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { initializeWeb3, voteForCandidate, getCandidate, getCandidateCount, hasVoted, getCurrentAccount } from './utils/contractInteraction';

function App() {
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [userHasVoted, setUserHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);

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
      for (let i = 1; i <= count; i++) {
        const candidate = await getCandidate(i);
        candidateList.push({ id: i, ...candidate });
      }
      setCandidates(candidateList);
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
    <MantineProvider>
      <Notifications position="top-right" />
      <Container size="lg" py="xl">
        <Stack gap="xl">
          <div>
            <Title order={1} ta="center" mb="md">
              Decentralized Voting System
            </Title>
            <Text ta="center" c="dimmed" size="lg">
              Cast your vote securely on the blockchain
            </Text>
          </div>

          {!isConnected ? (
            <Card shadow="md" padding="xl" radius="md" withBorder>
              <Stack align="center" gap="md">
                <Text size="lg">Connect your wallet to start voting</Text>
                <Button onClick={connectWallet} loading={loading} size="lg">
                  Connect MetaMask
                </Button>
              </Stack>
            </Card>
          ) : (
            <>
              <Card shadow="sm" padding="md" radius="md" withBorder>
                <Group justify="space-between">
                  <div>
                    <Text size="sm" c="dimmed">Connected Account</Text>
                    <Text size="sm" fw={500}>{account}</Text>
                  </div>
                  {userHasVoted && (
                    <Notification color="blue" title="You have already voted" withCloseButton={false}>
                      Thank you for participating!
                    </Notification>
                  )}
                </Group>
              </Card>

              <Title order={2} mb="md">Candidates</Title>
              
              {candidates.length === 0 ? (
                <Text ta="center" c="dimmed">No candidates available</Text>
              ) : (
                <Stack gap="md">
                  {candidates.map((candidate) => (
                    <Card key={candidate.id} shadow="sm" padding="lg" radius="md" withBorder>
                      <Group justify="space-between" wrap="nowrap">
                        <div>
                          <Text fw={500} size="lg">{candidate.name}</Text>
                          <Text size="sm" c="dimmed">Votes: {candidate.voteCount}</Text>
                        </div>
                        <Button 
                          onClick={() => handleVote(candidate.id)}
                          disabled={userHasVoted || loading}
                          loading={loading}
                        >
                          Vote
                        </Button>
                      </Group>
                    </Card>
                  ))}
                </Stack>
              )}
            </>
          )}
        </Stack>
      </Container>
    </MantineProvider>
  );
}

export default App;
