import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Home, Briefcase, Heart, Plus, Edit2, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface SavedLocation {
  id: string;
  name: string;
  address: string;
  type: 'home' | 'work' | 'favorite';
  notes?: string;
}

export function SavedLocations() {
  const [locations, setLocations] = React.useState<SavedLocation[]>([
    {
      id: '1',
      name: 'Home',
      address: '15 Rue des Roses, Luxembourg',
      type: 'home',
      notes: 'Gate code: 1234',
    },
    {
      id: '2',
      name: 'Office',
      address: '2 Avenue de la Liberté, Luxembourg',
      type: 'work',
    },
    {
      id: '3',
      name: 'Gym',
      address: '8 Rue du Commerce, Luxembourg',
      type: 'favorite',
    },
  ]);

  const getIconForType = (type: SavedLocation['type']) => {
    switch (type) {
      case 'home':
        return <Home className="h-4 w-4" />;
      case 'work':
        return <Briefcase className="h-4 w-4" />;
      case 'favorite':
        return <Heart className="h-4 w-4" />;
    }
  };

  const AddLocationDialog = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add New Location
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Location</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Location Name</Label>
            <Input id="name" placeholder="e.g., Home, Office, Gym" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" placeholder="Enter the full address" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input id="notes" placeholder="e.g., Gate code, Building number" />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline">Cancel</Button>
          <Button>Save Location</Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Saved Locations</h2>
          <AddLocationDialog />
        </div>

        <div className="grid gap-4">
          {locations.map((location) => (
            <Card key={location.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    {getIconForType(location.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{location.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {location.address}
                    </p>
                    {location.notes && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Note: {location.notes}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <Button variant="outline" className="w-full">
                  <MapPin className="h-4 w-4 mr-2" />
                  Set as Pickup
                </Button>
                <Button variant="outline" className="w-full">
                  <MapPin className="h-4 w-4 mr-2" />
                  Set as Destination
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}
