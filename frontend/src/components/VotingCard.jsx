import { Card, Text, Button, Group } from '@mantine/core';

export function VotingCard({ candidate, onVote, disabled, loading }) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" wrap="nowrap">
        <div>
          <Text fw={500} size="lg">
            {candidate.name}
          </Text>
          <Text size="sm" c="dimmed">
            Votes: {candidate.voteCount}
          </Text>
        </div>
        <Button 
          onClick={() => onVote(candidate.id)}
          disabled={disabled}
          loading={loading}
          variant="filled"
        >
          Vote
        </Button>
      </Group>
    </Card>
  );
}

export default VotingCard;
