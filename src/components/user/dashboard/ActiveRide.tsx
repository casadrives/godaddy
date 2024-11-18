import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Car, Phone } from 'lucide-react';

export function ActiveRide() {
  // This would normally come from a real-time service
  const mockRide = {
    status: 'en-route', // ['waiting', 'confirmed', 'en-route', 'arrived', 'in-progress', 'completed']
    driver: {
      name: 'Jean Dupont',
      phone: '+352 691 234 567',
      rating: 4.8,
      vehicle: {
        model: 'Toyota Corolla',
        color: 'Silver',
        plate: 'LU 1234',
      },
    },
    pickup: '2 Rue du Fort Thüngen, Luxembourg',
    destination: 'Luxembourg Central Station',
    estimatedArrival: '5 mins',
    estimatedDuration: '15 mins',
    price: '25.50',
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Status Banner */}
        <div className="bg-primary/10 p-4 rounded-lg">
          <h2 className="text-xl font-semibold">
            Your driver is on the way
          </h2>
          <p className="text-muted-foreground">
            Estimated arrival in {mockRide.estimatedArrival}
          </p>
        </div>

        {/* Driver & Vehicle Info */}
        <div className="flex items-start space-x-4 p-4 bg-muted rounded-lg">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Car className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{mockRide.driver.name}</h3>
            <p className="text-sm text-muted-foreground">
              {mockRide.driver.vehicle.model} • {mockRide.driver.vehicle.color}
            </p>
            <p className="text-sm font-semibold mt-1">
              {mockRide.driver.vehicle.plate}
            </p>
          </div>
          <Button variant="outline" size="icon">
            <Phone className="h-4 w-4" />
          </Button>
        </div>

        {/* Trip Details */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-primary mt-1" />
            <div>
              <p className="text-sm text-muted-foreground">Pickup</p>
              <p className="font-medium">{mockRide.pickup}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-destructive mt-1" />
            <div>
              <p className="text-sm text-muted-foreground">Destination</p>
              <p className="font-medium">{mockRide.destination}</p>
            </div>
          </div>
        </div>

        {/* Trip Info */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">Duration</p>
            <p className="font-semibold">{mockRide.estimatedDuration}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Distance</p>
            <p className="font-semibold">4.2 km</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Price</p>
            <p className="font-semibold">€{mockRide.price}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button variant="destructive" className="flex-1">
            Cancel Ride
          </Button>
          <Button variant="outline" className="flex-1">
            Share Trip
          </Button>
        </div>
      </div>
    </Card>
  );
}
