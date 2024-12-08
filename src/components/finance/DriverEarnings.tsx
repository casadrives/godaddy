import React, { useState, useEffect } from 'react';
import { financeService } from '@/services/financeService';
import {
  Box,
  Card,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
  Grid,
  Button,
  Alert
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  DirectionsCar as CarIcon,
  Timeline as TimelineIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DriverEarningsProps {
  driverId: string;
}

export const DriverEarnings: React.FC<DriverEarningsProps> = ({ driverId }) => {
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('day');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [earnings, setEarnings] = useState<any>(null);

  useEffect(() => {
    loadEarnings();
  }, [driverId, timeframe]);

  const loadEarnings = async () => {
    try {
      setLoading(true);
      const endDate = new Date();
      let startDate = new Date();

      switch (timeframe) {
        case 'week':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        default:
          startDate.setDate(startDate.getDate() - 1);
      }

      const data = await financeService.getDriverEarnings(driverId, {
        startDate,
        endDate,
        groupBy: timeframe
      });

      setEarnings(data);
    } catch (error) {
      console.error('Error loading earnings:', error);
      setError('Failed to load earnings data');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeframeChange = (
    event: React.MouseEvent<HTMLElement>,
    newTimeframe: 'day' | 'week' | 'month'
  ) => {
    if (newTimeframe !== null) {
      setTimeframe(newTimeframe);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  const chartData = {
    labels: Object.keys(earnings?.earnings || {}),
    datasets: [
      {
        label: 'Earnings (€)',
        data: Object.values(earnings?.earnings || {}).map((e: any) => e.total),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => `€${value}`
        }
      }
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Earnings Overview</Typography>
        <ToggleButtonGroup
          value={timeframe}
          exclusive
          onChange={handleTimeframeChange}
          size="small"
        >
          <ToggleButton value="day">Day</ToggleButton>
          <ToggleButton value="week">Week</ToggleButton>
          <ToggleButton value="month">Month</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Box display="flex" alignItems="center">
              <MoneyIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
              <Box>
                <Typography variant="h4">
                  €{earnings?.summary.total.toFixed(2)}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Total Earnings
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Box display="flex" alignItems="center">
              <CarIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <Box>
                <Typography variant="h4">{earnings?.summary.rides}</Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Total Rides
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Box display="flex" alignItems="center">
              <TimelineIcon sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
              <Box>
                <Typography variant="h4">
                  {earnings?.summary.totalDistance.toFixed(1)} km
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Total Distance
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Box display="flex" alignItems="center">
              <ScheduleIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
              <Box>
                <Typography variant="h4">
                  {Math.round(earnings?.summary.totalDuration / 60)} hrs
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Total Hours
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>
          Earnings Trend
        </Typography>
        <Box height={300}>
          <Line data={chartData} options={chartOptions} />
        </Box>
      </Card>

      <Box display="flex" justifyContent="center" mt={3}>
        <Button
          variant="contained"
          size="large"
          startIcon={<MoneyIcon />}
          onClick={() => {/* Handle payout request */}}
        >
          Request Payout
        </Button>
      </Box>
    </Box>
  );
};
