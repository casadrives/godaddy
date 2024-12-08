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
import { DirectionsCar as CarIcon } from '@mui/icons-material';

interface VehicleListProps {
  companyId: string;
  limit?: number;
}

export const VehicleList: React.FC<VehicleListProps> = ({
  companyId,
  limit = 10
}) => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const vehicleData = await companyService.getVehicles(companyId);
        setVehicles(vehicleData.slice(0, limit));
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [companyId, limit]);

  if (loading) {
    return <CircularProgress />;
  }

  if (vehicles.length === 0) {
    return <Typography color="textSecondary">No vehicles found</Typography>;
  }

  return (
    <List>
      {vehicles.map((vehicle) => (
        <ListItem key={vehicle.id}>
          <ListItemAvatar>
            <Avatar>
              <CarIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={`${vehicle.make} ${vehicle.model} (${vehicle.year})`}
            secondary={`License: ${vehicle.license_plate}`}
          />
          <ListItemSecondaryAction>
            <Chip
              label={vehicle.drivers?.[0] ? 'Assigned' : 'Available'}
              color={vehicle.drivers?.[0] ? 'primary' : 'success'}
              size="small"
            />
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};
