import React, { useEffect, useState } from 'react';
import { riderService } from '@/services/riderService';
import {
  Box,
  Card,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Pagination,
  CircularProgress,
  Rating
} from '@mui/material';
import {
  DirectionsCar as CarIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';

interface RideHistoryProps {
  userId: string;
  limit?: number;
}

export const RideHistory: React.FC<RideHistoryProps> = ({
  userId,
  limit = 10
}) => {
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadRideHistory();
  }, [userId, page, limit]);

  const loadRideHistory = async () => {
    try {
      setLoading(true);
      const offset = (page - 1) * limit;
      const { rides: rideData, count } = await riderService.getRideHistory(userId, {
        limit,
        offset
      });
      setRides(rideData);
      setTotalPages(Math.ceil((count || 0) / limit));
    } catch (error) {
      console.error('Error loading ride history:', error);
      setError('Failed to load ride history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'canceled':
        return 'error';
      case 'in_progress':
        return 'primary';
      default:
        return 'default';
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
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Card>
      <List>
        {rides.map((ride) => (
          <ListItem
            key={ride.id}
            divider
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 2,
              py: 2
            }}
          >
            <ListItemAvatar>
              <Avatar>
                <CarIcon />
              </Avatar>
            </ListItemAvatar>

            <ListItemText
              primary={
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="subtitle1">
                    {ride.pickup_address.split(',')[0]} →{' '}
                    {ride.dropoff_address.split(',')[0]}
                  </Typography>
                  <Chip
                    label={ride.status.replace('_', ' ')}
                    size="small"
                    color={getStatusColor(ride.status) as any}
                  />
                </Box>
              }
              secondary={
                <Box display="flex" flexDirection="column" gap={1}>
                  {ride.driver && (
                    <Typography variant="body2" color="textSecondary">
                      Driver: {ride.driver.users.first_name}{' '}
                      {ride.driver.users.last_name}
                    </Typography>
                  )}
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box display="flex" alignItems="center">
                      <TimeIcon fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2" color="textSecondary">
                        {new Date(ride.created_at).toLocaleString()}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <MoneyIcon fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2" color="textSecondary">
                        €{ride.fare_amount?.toFixed(2) || '0.00'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              }
            />

            {ride.status === 'completed' && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  alignSelf: 'flex-end'
                }}
              >
                <Rating value={ride.rating || 0} readOnly size="small" />
              </Box>
            )}
          </ListItem>
        ))}
      </List>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" p={2}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      {rides.length === 0 && (
        <Box p={3} textAlign="center">
          <Typography color="textSecondary">No rides found</Typography>
        </Box>
      )}
    </Card>
  );
};
