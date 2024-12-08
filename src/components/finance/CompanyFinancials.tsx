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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert
} from '@mui/material';
import {
  TrendingUp as RevenueIcon,
  AccountBalance as PayoutIcon,
  Receipt as FeesIcon,
  ShowChart as ProfitIcon
} from '@mui/icons-material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CompanyFinancialsProps {
  companyId: string;
}

export const CompanyFinancials: React.FC<CompanyFinancialsProps> = ({ companyId }) => {
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('day');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [financials, setFinancials] = useState<any>(null);

  useEffect(() => {
    loadFinancials();
  }, [companyId, timeframe]);

  const loadFinancials = async () => {
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

      const data = await financeService.getCompanyFinancials(companyId, {
        startDate,
        endDate,
        groupBy: timeframe
      });

      setFinancials(data);
    } catch (error) {
      console.error('Error loading financials:', error);
      setError('Failed to load financial data');
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
    labels: Object.keys(financials?.financials || {}),
    datasets: [
      {
        label: 'Revenue',
        data: Object.values(financials?.financials || {}).map((f: any) => f.revenue),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1
      },
      {
        label: 'Net Earnings',
        data: Object.values(financials?.financials || {}).map((f: any) => f.netEarnings),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1
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
        <Typography variant="h5">Financial Overview</Typography>
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
              <RevenueIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
              <Box>
                <Typography variant="h4">
                  €{financials?.summary.totalRevenue.toFixed(2)}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Total Revenue
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Box display="flex" alignItems="center">
              <PayoutIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
              <Box>
                <Typography variant="h4">
                  €{financials?.summary.totalDriverPayouts.toFixed(2)}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Driver Payouts
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Box display="flex" alignItems="center">
              <FeesIcon sx={{ fontSize: 40, color: 'error.main', mr: 2 }} />
              <Box>
                <Typography variant="h4">
                  €{financials?.summary.totalPlatformFees.toFixed(2)}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Platform Fees
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Box display="flex" alignItems="center">
              <ProfitIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <Box>
                <Typography variant="h4">
                  €{financials?.summary.totalNetEarnings.toFixed(2)}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Net Earnings
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>
              Revenue vs Net Earnings
            </Typography>
            <Box height={300}>
              <Bar data={chartData} options={chartOptions} />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>
              Financial Summary
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Metric</TableCell>
                    <TableCell align="right">Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Total Rides</TableCell>
                    <TableCell align="right">
                      {financials?.summary.totalRides}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Avg. Revenue per Ride</TableCell>
                    <TableCell align="right">
                      €{(financials?.summary.totalRevenue / financials?.summary.totalRides).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Profit Margin</TableCell>
                    <TableCell align="right">
                      {((financials?.summary.totalNetEarnings / financials?.summary.totalRevenue) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
