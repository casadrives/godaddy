import React from 'react';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Receipt } from 'lucide-react';

export function RideHistory() {
  // Mock data - would come from an API
  const rides = [
    {
      id: '1',
      date: '2024-01-15',
      time: '14:30',
      from: 'Luxembourg Airport',
      to: 'Place d\'Armes',
      driver: 'Marie Weber',
      price: '32.50',
      status: 'completed',
      rating: 5,
    },
    {
      id: '2',
      date: '2024-01-14',
      time: '09:15',
      from: 'Kirchberg',
      to: 'Luxembourg Central Station',
      driver: 'Pierre Muller',
      price: '25.75',
      status: 'completed',
      rating: 4,
    },
    {
      id: '3',
      date: '2024-01-13',
      time: '18:45',
      from: 'Cloche d\'Or',
      to: 'Place Guillaume II',
      driver: 'Sophie Klein',
      price: '28.90',
      status: 'completed',
      rating: 5,
    },
  ];

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Recent Rides</h2>
          <Button variant="outline">Download History</Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rides.map((ride) => (
              <TableRow key={ride.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{ride.date}</p>
                    <p className="text-sm text-muted-foreground">{ride.time}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <MapPin className="h-3 w-3 text-primary mr-1" />
                      {ride.from}
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-3 w-3 text-destructive mr-1" />
                      {ride.to}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{ride.driver}</TableCell>
                <TableCell>€{ride.price}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                    {ride.rating}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Receipt className="h-4 w-4 mr-1" />
                      Receipt
                    </Button>
                    <Button variant="outline" size="sm">
                      Book Again
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-center">
          <Button variant="outline">Load More</Button>
        </div>
      </div>
    </Card>
  );
}
