import React, { useEffect, useState } from 'react';
import { companyService } from '@/services/companyService';
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  CircularProgress,
  Typography
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';

interface DriverListProps {
  companyId: string;
  limit?: number;
  status?: 'online' | 'offline' | 'all';
}

export const DriverList: React.FC<DriverListProps> = ({
  companyId,
  limit = 10,
  status = 'all'
}) => {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true);
        const { drivers: driverData } = await companyService.getDrivers(companyId, {
          status,
          limit
        });
        setDrivers(driverData);
      } catch (error) {
        console.error('Error fetching drivers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, [companyId, limit, status]);

  if (loading) {
    return <CircularProgress />;
  }

  if (drivers.length === 0) {
    return <Typography color="textSecondary">No drivers found</Typography>;
  }

  return (
    <List>
      {drivers.map((driver) => (
        <ListItem key={driver.id}>
          <ListItemAvatar>
            <Avatar>
              <PersonIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={`${driver.users.first_name} ${driver.users.last_name}`}
            secondary={driver.vehicles?.[0]?.license_plate || 'No vehicle assigned'}
          />
          <ListItemSecondaryAction>
            <Chip
              label={driver.is_online ? 'Online' : 'Offline'}
              color={driver.is_online ? 'success' : 'default'}
              size="small"
            />
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};
