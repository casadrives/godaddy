import React from 'react';
import { Card } from '@/components/ui/card';
import { MapPin, Navigation2 } from 'lucide-react';

interface RideMapProps {
  pickup: {
    lat: number;
    lng: number;
    address: string;
  };
  destination: {
    lat: number;
    lng: number;
    address: string;
  };
  driverLocation?: {
    lat: number;
    lng: number;
  };
}

export function RideMap({ pickup, destination, driverLocation }: RideMapProps) {
  React.useEffect(() => {
    // Initialize map here using a mapping service like Google Maps or Mapbox
    // This is a placeholder for the actual map implementation
    console.log('Map initialized with:', { pickup, destination, driverLocation });
  }, [pickup, destination, driverLocation]);

  return (
    <Card className="relative w-full h-[400px] bg-muted">
      <div className="absolute inset-0 flex items-center justify-center">
        {/* This is a placeholder for the actual map */}
        <div className="text-center space-y-2">
          <Navigation2 className="h-8 w-8 mx-auto text-primary animate-pulse" />
          <p className="text-sm text-muted-foreground">
            Map view will be displayed here
          </p>
        </div>
      </div>

      {/* Map overlay with route info */}
      <div className="absolute bottom-4 left-4 right-4 bg-background/95 p-4 rounded-lg shadow-lg">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-primary" />
            <p className="text-sm">{pickup.address}</p>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-destructive" />
            <p className="text-sm">{destination.address}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
