import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RideHistory } from './RideHistory';
import { ActiveRide } from './ActiveRide';
import { UserProfile } from './UserProfile';
import { SavedLocations } from './SavedLocations';
import { PaymentMethods } from './PaymentMethods';

export function UserDashboard() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 hover:bg-muted transition cursor-pointer">
          <h3 className="font-semibold mb-2">Book a Ride</h3>
          <p className="text-sm text-muted-foreground">Request a taxi now</p>
        </Card>
        
        <Card className="p-4 hover:bg-muted transition cursor-pointer">
          <h3 className="font-semibold mb-2">Schedule Later</h3>
          <p className="text-sm text-muted-foreground">Book a ride for later</p>
        </Card>
        
        <Card className="p-4 hover:bg-muted transition cursor-pointer">
          <h3 className="font-semibold mb-2">Get Fare Estimate</h3>
          <p className="text-sm text-muted-foreground">Calculate trip cost</p>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="active-ride" className="w-full">
        <TabsList>
          <TabsTrigger value="active-ride">Active Ride</TabsTrigger>
          <TabsTrigger value="history">Ride History</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="locations">Saved Locations</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="active-ride">
          <ActiveRide />
        </TabsContent>

        <TabsContent value="history">
          <RideHistory />
        </TabsContent>

        <TabsContent value="profile">
          <UserProfile />
        </TabsContent>

        <TabsContent value="locations">
          <SavedLocations />
        </TabsContent>

        <TabsContent value="payment">
          <PaymentMethods />
        </TabsContent>
      </Tabs>
    </div>
  );
}
