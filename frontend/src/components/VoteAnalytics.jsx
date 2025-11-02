import { Paper, Title, Grid, Text, Progress, Group, Stack } from '@mantine/core';
import { BarChart } from '@mantine/charts';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  ChartTitle,
  Tooltip,
  Legend
);

export default function VoteAnalytics({ candidates, totalVotes, votingEndTime }) {
  // Calculate participation stats
  const turnoutPercentage = totalVotes > 0 ? 100 : 0; // This would need total eligible voters
  const timeRemaining = votingEndTime ? Math.max(0, votingEndTime - Date.now()) : null;
  
  // Format time remaining
  const formatTimeRemaining = (ms) => {
    if (!ms) return 'No time limit';
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  // Prepare chart data
  const barChartData = {
    labels: candidates.map(c => c.name),
    datasets: [
      {
        label: 'Vote Count',
        data: candidates.map(c => Number(c.voteCount)),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: candidates.map(c => c.name),
    datasets: [
      {
        label: 'Vote Distribution',
        data: candidates.map(c => Number(c.voteCount)),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
  };

  return (
    <Stack spacing="lg">
      {/* Dashboard Stats */}
      <Paper shadow="sm" p="md" withBorder>
        <Title order={3} mb="md">Voting Dashboard</Title>
        <Grid>
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Paper p="md" withBorder>
              <Text size="sm" c="dimmed">Total Votes Cast</Text>
              <Text size="xl" fw={700}>{totalVotes}</Text>
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Paper p="md" withBorder>
              <Text size="sm" c="dimmed">Participation Rate</Text>
              <Text size="xl" fw={700}>{turnoutPercentage.toFixed(1)}%</Text>
              <Progress value={turnoutPercentage} mt="xs" />
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Paper p="md" withBorder>
              <Text size="sm" c="dimmed">Time Remaining</Text>
              <Text size="xl" fw={700}>{formatTimeRemaining(timeRemaining)}</Text>
            </Paper>
          </Grid.Col>
        </Grid>
      </Paper>

      {/* Charts */}
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper shadow="sm" p="md" withBorder>
            <Title order={4} mb="md">Vote Count (Bar Chart)</Title>
            <Bar data={barChartData} options={chartOptions} />
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper shadow="sm" p="md" withBorder>
            <Title order={4} mb="md">Vote Distribution (Pie Chart)</Title>
            <Pie data={pieChartData} options={chartOptions} />
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Live Vote Progress */}
      <Paper shadow="sm" p="md" withBorder>
        <Title order={4} mb="md">Live Vote Progress</Title>
        <Stack spacing="sm">
          {candidates.map((candidate) => {
            const percentage = totalVotes > 0 
              ? (Number(candidate.voteCount) / totalVotes) * 100 
              : 0;
            return (
              <div key={candidate.id}>
                <Group justify="space-between" mb={5}>
                  <Text size="sm" fw={500}>{candidate.name}</Text>
                  <Text size="sm" c="dimmed">
                    {candidate.voteCount} votes ({percentage.toFixed(1)}%)
                  </Text>
                </Group>
                <Progress value={percentage} />
              </div>
            );
          })}
        </Stack>
      </Paper>
    </Stack>
  );
}
