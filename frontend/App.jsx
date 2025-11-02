import { useEffect, useMemo, useState } from 'react';
import {
  MantineProvider,
  AppShell,
  Container,
  Title,
  Text,
  Group,
  Button,
  Card,
  Badge,
  Modal,
  Divider,
  Tooltip,
  ThemeIcon,
  LoadingOverlay,
  Notification,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX, IconBolt, IconWallet, IconVote } from '@tabler/icons-react';

// Simple fake proposals; replace with fetched proposals from your contract/backend
const defaultProposals = [
  { id: 1, title: 'Adopt quadratic voting for community fund', description: 'Fairer distribution for community proposals', votes: 0 },
  { id: 2, title: 'Launch bug bounty program', description: 'Incentivize security research and hardening', votes: 0 },
  { id: 3, title: 'Fund educational grants', description: 'Support developer education and workshops', votes: 0 },
];

function WalletConnect({ onConnected }) {
  const [connecting, setConnecting] = useState(false);
  const [account, setAccount] = useState(null);

  const connect = async () => {
    if (!window.ethereum) {
      notifications.show({
        title: 'MetaMask not found',
        message: 'Please install MetaMask to continue.',
        color: 'red',
        icon: <IconX size={18} />,
      });
      return;
    }
    try {
      setConnecting(true);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const acc = accounts?.[0] || null;
      setAccount(acc);
      onConnected?.(acc);
      notifications.show({
        title: 'Wallet connected',
        message: acc,
        color: 'teal',
        icon: <IconWallet size={18} />,
      });
    } catch (e) {
      notifications.show({
        title: 'Connection rejected',
        message: e?.message || 'User rejected the connection',
        color: 'red',
        icon: <IconX size={18} />,
      });
    } finally {
      setConnecting(false);
    }
  };

  useEffect(() => {
    if (!window.ethereum) return;
    const handler = (accounts) => {
      const acc = accounts?.[0] || null;
      setAccount(acc);
      if (acc) onConnected?.(acc);
    };
    window.ethereum.on?.('accountsChanged', handler);
    return () => window.ethereum?.removeListener?.('accountsChanged', handler);
  }, [onConnected]);

  return (
    <Group>
      {account ? (
        <Badge color="teal" variant="filled" radius="sm">{account.slice(0, 6)}...{account.slice(-4)}</Badge>
      ) : (
        <Button onClick={connect} loading={connecting} leftSection={<IconWallet size={18} />} variant="gradient" gradient={{ from: 'grape', to: 'teal', deg: 135 }}>
          Connect Wallet
        </Button>
      )}
    </Group>
  );
}

function ProposalCard({ proposal, onVote }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);

  const confirmVote = async () => {
    setLoading(true);
    try {
      // Simulate on-chain tx latency
      await new Promise((res) => setTimeout(res, 1200));
      onVote?.(proposal.id);
      notifications.show({
        title: 'Vote submitted',
        message: `Your vote for "${proposal.title}" is being confirmed...`,
        color: 'blue',
        icon: <IconBolt size={18} />,
      });
      // Simulate confirmation
      await new Promise((res) => setTimeout(res, 900));
      notifications.update({
        id: 'vote-tx',
        title: 'Vote confirmed',
        message: 'Your vote is recorded on-chain.',
        color: 'teal',
        icon: <IconCheck size={18} />,
      });
    } catch (e) {
      notifications.show({ title: 'Vote failed', message: e?.message || 'Unknown error', color: 'red', icon: <IconX size={18} /> });
    } finally {
      setLoading(false);
      close();
    }
  };

  return (
    <>
      <Card withBorder radius="md" p="lg" style={{ backdropFilter: 'blur(6px)', background: 'rgba(22,22,22,0.6)', borderColor: 'rgba(255,255,255,0.06)' }}>
        <Group justify="space-between" mb="xs">
          <Group>
            <ThemeIcon variant="light" color="violet" radius="xl"><IconVote size={18} /></ThemeIcon>
            <Title order={4} c="gray.1">{proposal.title}</Title>
          </Group>
          <Badge variant="light" color="gray">{proposal.votes} votes</Badge>
        </Group>
        <Text c="dimmed" size="sm">{proposal.description}</Text>
        <Divider my="md" opacity={0.15} />
        <Group>
          <Tooltip label="Cast your vote" withArrow>
            <Button size="md" radius="xl" onClick={open} variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 135 }}
              styles={{
                root: {
                  transition: 'transform 120ms ease, box-shadow 200ms ease',
                },
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              Vote
            </Button>
          </Tooltip>
        </Group>
      </Card>

      <Modal opened={opened} onClose={close} title={`Confirm vote`} centered transitionProps={{ transition: 'pop', duration: 200, timingFunction: 'ease' }} overlayProps={{ backgroundOpacity: 0.6, blur: 4 }}>
        <Text c="gray.2" mb="sm">You are about to vote for:</Text>
        <Text fw={600} c="gray.0">{proposal.title}</Text>
        <Divider my="md" opacity={0.1} />
        <Group justify="flex-end">
          <Button variant="default" onClick={close}>Cancel</Button>
          <Button onClick={confirmVote} loading={loading} leftSection={<IconBolt size={18} />} variant="gradient" gradient={{ from: 'lime', to: 'teal', deg: 135 }}>Confirm</Button>
        </Group>
        <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
      </Modal>
    </>
  );
}

export default function App() {
  const [account, setAccount] = useState(null);
  const [proposals, setProposals] = useState(defaultProposals);
  const totalVotes = useMemo(() => proposals.reduce((a, p) => a + p.votes, 0), [proposals]);

  const handleVote = (id) => {
    setProposals((prev) => prev.map((p) => (p.id === id ? { ...p, votes: p.votes + 1 } : p)));
  };

  return (
    <MantineProvider theme={{
      defaultRadius: 'md',
      primaryColor: 'violet',
      fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
      colors: {
        dark: [
          '#C1C2C5',
          '#A6A7AB',
          '#909296',
          '#5c5f66',
          '#373A40',
          '#2C2E33',
          '#25262b',
          '#1A1B1E',
          '#141517',
          '#101113',
        ],
      },
    }} withGlobalStyles withNormalizeCSS forceColorScheme="dark">
      <AppShell
        padding="md"
        styles={{
          main: {
            minHeight: '100vh',
            background: 'radial-gradient(1200px 600px at 10% -10%, rgba(139, 92, 246, 0.12), transparent), radial-gradient(900px 400px at 100% 10%, rgba(34, 211, 238, 0.10), transparent), linear-gradient(180deg, #0b0b0c 0%, #000 100%)',
          },
        }}
        header={{ height: 64 }}
      >
        <AppShell.Header style={{ backdropFilter: 'blur(10px)', background: 'rgba(10,10,12,0.55)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Container size="lg" h="100%">
            <Group align="center" justify="space-between" h="100%">
              <Group>
                <ThemeIcon radius="xl" size={34} variant="gradient" gradient={{ from: 'violet', to: 'cyan', deg: 135 }}>
                  <IconVote size={18} />
                </ThemeIcon>
                <Title order={3} c="gray.0">Decentralized Voting</Title>
              </Group>
              <Group>
                <Badge variant="light" color="gray">{totalVotes} total votes</Badge>
                <WalletConnect onConnected={setAccount} />
              </Group>
            </Group>
          </Container>
        </AppShell.Header>

        <AppShell.Main>
          <Container size="lg" py="xl">
            <Text c="gray.3" mb="md">Cast votes on proposals. Connect MetaMask for on-chain voting.</Text>
            <Divider my="sm" opacity={0.08} />
            <Group grow align="stretch">
              {proposals.map((p) => (
                <ProposalCard key={p.id} proposal={p} onVote={handleVote} />
              ))}
            </Group>
          </Container>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}
