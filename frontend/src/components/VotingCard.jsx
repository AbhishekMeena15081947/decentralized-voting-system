import { Card, Text, Button, Group, Avatar, Badge, Stack, Box, Progress } from '@mantine/core';

// Function to generate avatar image URLs based on candidate name
const getCandidateAvatar = (candidateName) => {
  const avatarSeeds = {
    'Alice': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice&backgroundColor=b6e3f4',
    'Bob': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob&backgroundColor=c0aede',
    'Charlie': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie&backgroundColor=ffd5dc',
    'Diana': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diana&backgroundColor=d1f4e0',
    'Eve': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eve&backgroundColor=ffe8cc',
  };
  
  return avatarSeeds[candidateName] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${candidateName}&backgroundColor=f0f0f0`;
};

export function VotingCard({ candidate, onVote, disabled, loading, totalVotes = 0 }) {
  const votePercentage = totalVotes > 0 ? (Number(candidate.voteCount) / totalVotes) * 100 : 0;
  
  return (
    <Card
      shadow="lg"
      padding="xl"
      radius="lg"
      withBorder
      style={{
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
        borderColor: 'rgba(102, 126, 234, 0.2)',
        transition: 'all 0.3s ease',
        cursor: disabled ? 'not-allowed' : 'default',
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 24px rgba(102, 126, 234, 0.2)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      <Group justify="space-between" wrap="nowrap" align="flex-start">
        {/* Left side: Avatar and Info */}
        <Group gap="md" style={{ flex: 1 }}>
          <Avatar
            src={getCandidateAvatar(candidate.name)}
            size={80}
            radius="md"
            style={{
              border: '3px solid rgba(102, 126, 234, 0.3)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          />
          
          <Stack gap={4} style={{ flex: 1 }}>
            <Group gap="xs">
              <Text fw={700} size="xl" style={{ color: 'white' }}>
                {candidate.name}
              </Text>
              <Badge
                size="lg"
                variant="gradient"
                gradient={{ from: 'cyan', to: 'blue', deg: 90 }}
              >
                ID: #{candidate.id}
              </Badge>
            </Group>
            
            <Group gap="md" mt={4}>
              <Box>
                <Text size="xs" c="dimmed" mb={2}>Total Votes</Text>
                <Group gap="xs">
                  <Text size="xl" fw={700} c="cyan">
                    {candidate.voteCount}
                  </Text>
                  {totalVotes > 0 && (
                    <Badge variant="light" color="cyan">
                      {votePercentage.toFixed(1)}%
                    </Badge>
                  )}
                </Group>
              </Box>
            </Group>
            
            {/* Vote Progress Bar */}
            {totalVotes > 0 && (
              <Box mt="xs">
                <Progress
                  value={votePercentage}
                  size="lg"
                  radius="xl"
                  styles={{
                    root: { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                    section: {
                      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                    },
                  }}
                />
              </Box>
            )}
          </Stack>
        </Group>
        
        {/* Right side: Vote Button */}
        <Button
          onClick={() => onVote(candidate.id)}
          disabled={disabled}
          loading={loading}
          size="lg"
          variant="gradient"
          gradient={{ from: 'teal', to: 'lime', deg: 105 }}
          leftSection="🗳️"
          style={{
            minWidth: '140px',
            fontSize: '1rem',
            fontWeight: 700,
            boxShadow: disabled ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.3s ease',
          }}
        >
          {disabled ? 'Voted' : 'Vote Now'}
        </Button>
      </Group>
    </Card>
  );
}

export default VotingCard;
