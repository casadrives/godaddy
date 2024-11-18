import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VehicleManagement } from './VehicleManagement';
import { ServiceAreas } from './ServiceAreas';
import { TaxiCompanies } from './TaxiCompanies';
import { PricingRules } from './PricingRules';
import { PricingManagement } from '../pricing/PricingManagement';
import { Promotions } from './Promotions';
import { SignupRequests } from './SignupRequests';
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/services/authService';
import { LoginForm } from '../auth/LoginForm';
import { DriverManagement } from '../drivers/DriverManagement';

export function ContentDashboard() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Content Management</h2>
        <p className="text-muted-foreground">
          Manage vehicles, service areas, and partner companies
        </p>
      </div>

      <Tabs defaultValue="vehicles">
        <TabsList>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="areas">Service Areas</TabsTrigger>
          <TabsTrigger value="companies">Taxi Companies</TabsTrigger>
          <TabsTrigger value="pricing">Pricing Rules</TabsTrigger>
          <TabsTrigger value="pricing-management">Pricing Management</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="requests">Registration Requests</TabsTrigger>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
        </TabsList>

        <TabsContent value="vehicles" className="mt-6">
          <VehicleManagement />
        </TabsContent>

        <TabsContent value="areas" className="mt-6">
          <ServiceAreas />
        </TabsContent>

        <TabsContent value="companies" className="mt-6">
          <TaxiCompanies />
        </TabsContent>

        <TabsContent value="pricing" className="mt-6">
          <PricingRules />
        </TabsContent>

        <TabsContent value="pricing-management" className="mt-6">
          <PricingManagement />
        </TabsContent>

        <TabsContent value="promotions" className="mt-6">
          <Promotions />
        </TabsContent>

        <TabsContent value="requests" className="mt-6">
          <SignupRequests />
        </TabsContent>

        <TabsContent value="drivers" className="mt-6">
          <DriverManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
