import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Euro,
  Calendar,
  TrendingUp,
  Clock,
  AlertCircle,
} from 'lucide-react';
import {
  DRIVER_SUBSCRIPTION,
  calculateDriverEarnings,
} from '@/config/pricing';

interface Ride {
  id: string;
  date: Date;
  fare: number;
  distance: number;
  duration: number;
}

export function DriverEarnings() {
  // Mock data - replace with real API data
  const [rides, setRides] = React.useState<Ride[]>([
    {
      id: '1',
      date: new Date(),
      fare: 45.50,
      distance: 12.3,
      duration: 25,
    },
    // Add more mock rides as needed
  ]);

  const [subscriptionStatus, setSubscriptionStatus] = React.useState({
    active: true,
    nextPaymentDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    lastPaymentDate: new Date(),
  });

  const calculateTotalEarnings = () => {
    return rides.reduce((total, ride) => {
      const earnings = calculateDriverEarnings(ride.fare);
      return total + earnings.driverEarnings;
    }, 0);
  };

  const calculateTotalCommission = () => {
    return rides.reduce((total, ride) => {
      const earnings = calculateDriverEarnings(ride.fare);
      return total + earnings.adminCommission;
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Subscription Status */}
      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Driver Subscription</h2>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Euro className="h-4 w-4 mr-2" />
                <span>€{DRIVER_SUBSCRIPTION.monthlyFee.toFixed(2)} per month</span>
              </div>
              <div className="flex items-center text-sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                <span>{(DRIVER_SUBSCRIPTION.commissionRate * 100).toFixed(0)}% commission on rides</span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Next payment: {subscriptionStatus.nextPaymentDate.toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full ${
            subscriptionStatus.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {subscriptionStatus.active ? 'Active' : 'Inactive'}
          </div>
        </div>
      </Card>

      {/* Earnings Overview */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Earnings Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-primary/5">
            <h3 className="text-sm font-medium text-muted-foreground">Total Earnings</h3>
            <div className="mt-2 flex items-center">
              <Euro className="h-4 w-4 mr-1" />
              <span className="text-2xl font-bold">
                {calculateTotalEarnings().toFixed(2)}
              </span>
            </div>
          </Card>
          
          <Card className="p-4 bg-primary/5">
            <h3 className="text-sm font-medium text-muted-foreground">Admin Commission</h3>
            <div className="mt-2 flex items-center">
              <Euro className="h-4 w-4 mr-1" />
              <span className="text-2xl font-bold">
                {calculateTotalCommission().toFixed(2)}
              </span>
            </div>
          </Card>

          <Card className="p-4 bg-primary/5">
            <h3 className="text-sm font-medium text-muted-foreground">Total Rides</h3>
            <div className="mt-2 flex items-center">
              <span className="text-2xl font-bold">{rides.length}</span>
            </div>
          </Card>
        </div>
      </Card>

      {/* Recent Rides */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Recent Rides</h2>
        <div className="space-y-4">
          {rides.map((ride) => {
            const earnings = calculateDriverEarnings(ride.fare);
            return (
              <Card key={ride.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{ride.date.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{ride.duration} minutes</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">€{earnings.driverEarnings.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">
                      Commission: €{earnings.adminCommission.toFixed(2)}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Card>

      {!subscriptionStatus.active && (
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center space-x-2 text-red-800">
            <AlertCircle className="h-5 w-5" />
            <span>Your subscription is inactive. Please renew to continue accepting rides.</span>
          </div>
          <Button className="mt-2" variant="destructive">
            Renew Subscription
          </Button>
        </Card>
      )}
    </div>
  );
}
