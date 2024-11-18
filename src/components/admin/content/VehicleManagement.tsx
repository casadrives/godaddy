import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { contentService } from '@/services/contentService';
import { VehicleForm } from './VehicleForm';

interface Vehicle {
  id: string;
  name: string;
  type: string;
  capacity: number;
  baseRate: number;
  active: boolean;
}

export function VehicleManagement() {
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [editingVehicle, setEditingVehicle] = React.useState<Vehicle | null>(null);

  const { data: vehicles, isLoading } = useQuery<Vehicle[]>({
    queryKey: ['vehicles'],
    queryFn: contentService.getVehicles,
  });

  const addVehicle = useMutation({
    mutationFn: contentService.addVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setIsAddOpen(false);
    },
  });

  const updateVehicle = useMutation({
    mutationFn: contentService.updateVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setEditingVehicle(null);
    },
  });

  const deleteVehicle = useMutation({
    mutationFn: contentService.deleteVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Vehicle Types</h3>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Vehicle Type
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Vehicle Type</DialogTitle>
            </DialogHeader>
            <VehicleForm onSubmit={(data) => addVehicle.mutate(data)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Base Rate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles?.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell>{vehicle.name}</TableCell>
                <TableCell>{vehicle.type}</TableCell>
                <TableCell>{vehicle.capacity}</TableCell>
                <TableCell>${vehicle.baseRate}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      vehicle.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {vehicle.active ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingVehicle(vehicle)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteVehicle.mutate(vehicle.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {editingVehicle && (
        <Dialog open={!!editingVehicle} onOpenChange={() => setEditingVehicle(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Vehicle Type</DialogTitle>
            </DialogHeader>
            <VehicleForm
              vehicle={editingVehicle}
              onSubmit={(data) =>
                updateVehicle.mutate({ id: editingVehicle.id, ...data })
              }
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
