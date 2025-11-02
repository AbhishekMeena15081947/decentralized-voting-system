import { Paper, Title, Table, Text, Badge, ScrollArea, Stack, Group } from '@mantine/core';
import { useState, useEffect } from 'react';

export default function AuditLog({ contract }) {
  const [voteLogs, setVoteLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!contract) return;

    const fetchVoteLogs = async () => {
      try {
        setLoading(true);
        // Listen to Vote events from the contract
        const filter = contract.filters.Voted();
        const events = await contract.queryFilter(filter);
        
        const logs = events.map((event, index) => ({
          id: index,
          voter: event.args.voter,
          candidateId: event.args.candidateId.toString(),
          timestamp: new Date(Number(event.args.timestamp) * 1000).toLocaleString(),
          blockNumber: event.blockNumber,
          transactionHash: event.transactionHash,
        }));
        
        setVoteLogs(logs.reverse()); // Show most recent first
        setLoading(false);
      } catch (error) {
        console.error('Error fetching vote logs:', error);
        setLoading(false);
      }
    };

    fetchVoteLogs();

    // Listen for new votes in real-time
    const handleVote = (voter, candidateId, timestamp, event) => {
      const newLog = {
        id: Date.now(),
        voter,
        candidateId: candidateId.toString(),
        timestamp: new Date(Number(timestamp) * 1000).toLocaleString(),
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash,
      };
      setVoteLogs(prev => [newLog, ...prev]);
    };

    contract.on('Voted', handleVote);

    return () => {
      contract.off('Voted', handleVote);
    };
  }, [contract]);

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Paper shadow="sm" p="md" withBorder>
      <Stack spacing="md">
        <Group justify="space-between">
          <Title order={3}>Audit Log</Title>
          <Badge size="lg" variant="filled">
            {voteLogs.length} Total Votes
          </Badge>
        </Group>
        
        <Text size="sm" c="dimmed">
          Complete transparency: View all votes cast on the blockchain
        </Text>

        {loading ? (
          <Text ta="center" py="xl">Loading audit log...</Text>
        ) : voteLogs.length === 0 ? (
          <Text ta="center" py="xl" c="dimmed">No votes recorded yet</Text>
        ) : (
          <ScrollArea h={400}>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Voter Address</Table.Th>
                  <Table.Th>Candidate ID</Table.Th>
                  <Table.Th>Timestamp</Table.Th>
                  <Table.Th>Block</Table.Th>
                  <Table.Th>Transaction</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {voteLogs.map((log) => (
                  <Table.Tr key={log.id}>
                    <Table.Td>
                      <Text size="sm" ff="monospace">
                        {formatAddress(log.voter)}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light">{log.candidateId}</Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{log.timestamp}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{log.blockNumber}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="xs" ff="monospace">
                        {formatAddress(log.transactionHash)}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        )}
      </Stack>
    </Paper>
  );
}
