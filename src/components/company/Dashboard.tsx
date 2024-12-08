import React, { useEffect, useState } from 'react';
import { companyService } from '@/services/companyService';
import { Card, Grid, Typography, Box, Button, CircularProgress } from '@mui/material';
import {
  DriveEta as CarIcon,
  Person as DriverIcon,
  AttachMoney as RevenueIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import { DriverList } from './DriverList';
import { VehicleList } from './VehicleList';
import { AnalyticsChart } from './AnalyticsChart';
import { DriverMap } from './DriverMap';

interface DashboardProps {
  companyId: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ companyId }) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const dashboardStats = await companyService.getDashboardStats(companyId);
        setStats(dashboardStats);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [companyId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Box display="flex" alignItems="center">
              <DriverIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <Box>
                <Typography variant="h4">{stats?.totalDrivers}</Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Total Drivers
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Box display="flex" alignItems="center">
              <SpeedIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
              <Box>
                <Typography variant="h4">{stats?.activeDrivers}</Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Active Drivers
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Box display="flex" alignItems="center">
              <CarIcon sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
              <Box>
                <Typography variant="h4">{stats?.totalVehicles}</Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Total Vehicles
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Box display="flex" alignItems="center">
              <RevenueIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
              <Box>
                <Typography variant="h4">
                  €{stats?.todayRevenue.toFixed(2)}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Today's Revenue
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Map and Analytics */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2, height: '400px' }}>
            <Typography variant="h6" mb={2}>
              Driver Locations
            </Typography>
            <DriverMap companyId={companyId} />
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, height: '400px' }}>
            <Typography variant="h6" mb={2}>
              Analytics
            </Typography>
            <AnalyticsChart companyId={companyId} />
          </Card>
        </Grid>
      </Grid>

      {/* Drivers and Vehicles Lists */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Active Drivers</Typography>
              <Button variant="outlined" size="small">
                View All
              </Button>
            </Box>
            <DriverList companyId={companyId} limit={5} status="online" />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Available Vehicles</Typography>
              <Button variant="outlined" size="small">
                View All
              </Button>
            </Box>
            <VehicleList companyId={companyId} limit={5} />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
