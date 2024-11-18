import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
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
import { Plus, Pencil, Trash2, Map } from 'lucide-react';
import { contentService } from '@/services/contentService';
import { ServiceAreaForm } from './ServiceAreaForm';
import { ServiceAreaMap } from './ServiceAreaMap';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface ServiceArea {
  id: string;
  name: string;
  coordinates: [number, number][];
  active: boolean;
  baseRate: number;
}

export function ServiceAreas() {
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<ServiceArea | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [selectedArea, setSelectedArea] = useState<ServiceArea | null>(null);

  const { data: areas, isLoading } = useQuery<ServiceArea[]>({
    queryKey: ['service-areas'],
    queryFn: contentService.getServiceAreas,
  });

  const addArea = useMutation({
    mutationFn: contentService.addServiceArea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-areas'] });
      setIsAddOpen(false);
      toast.success('Service area added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add service area');
    },
  });

  const updateArea = useMutation({
    mutationFn: contentService.updateServiceArea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-areas'] });
      setEditingArea(null);
      toast.success('Service area updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update service area');
    },
  });

  const deleteArea = useMutation({
    mutationFn: contentService.deleteServiceArea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-areas'] });
      toast.success('Service area deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete service area');
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleViewMap = (area: ServiceArea) => {
    setSelectedArea(area);
    setShowMap(true);
  };

  const handleToggleActive = (id: string) => {
    updateArea.mutate({ id, active: !areas.find((area) => area.id === id).active });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Service Areas</h3>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Service Area
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Service Area</DialogTitle>
            </DialogHeader>
            <ServiceAreaForm onSubmit={(data) => addArea.mutate(data)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Base Rate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {areas?.map((area) => (
                  <TableRow key={area.id}>
                    <TableCell>{area.name}</TableCell>
                    <TableCell>${area.baseRate}</TableCell>
                    <TableCell>
                      <Switch
                        checked={area.active}
                        onCheckedChange={() => handleToggleActive(area.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedArea(area);
                            setIsAddOpen(true);
                          }}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteArea.mutate(area.id)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewMap(area)}
                        >
                          <Map className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow">
          {selectedArea ? (
            <ServiceAreaMap area={selectedArea} />
          ) : (
            <div className="h-[500px] flex items-center justify-center text-gray-500">
              Select a service area to view on map
            </div>
          )}
        </div>
      </div>

      {editingArea && (
        <Dialog open={!!editingArea} onOpenChange={() => setEditingArea(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Service Area</DialogTitle>
            </DialogHeader>
            <ServiceAreaForm
              area={editingArea}
              onSubmit={(data) =>
                updateArea.mutate({ id: editingArea.id, ...data })
              }
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
