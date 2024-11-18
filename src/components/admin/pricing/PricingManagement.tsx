import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { usePricingStore } from '@/services/pricingService';
import { toast } from 'sonner';

export function PricingManagement() {
  const { baseRate, perKilometerRate, perMinuteRate, minimumFare, updateRates } = usePricingStore();
  
  const [rates, setRates] = React.useState({
    baseRate,
    perKilometerRate,
    perMinuteRate,
    minimumFare,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRates(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateRates(rates);
    toast.success('Pricing rates updated successfully');
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Pricing Management</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="baseRate">Base Rate (EUR)</Label>
            <Input
              id="baseRate"
              name="baseRate"
              type="number"
              step="0.01"
              value={rates.baseRate}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="perKilometerRate">Rate per Kilometer (EUR)</Label>
            <Input
              id="perKilometerRate"
              name="perKilometerRate"
              type="number"
              step="0.01"
              value={rates.perKilometerRate}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="perMinuteRate">Rate per Minute (EUR)</Label>
            <Input
              id="perMinuteRate"
              name="perMinuteRate"
              type="number"
              step="0.01"
              value={rates.perMinuteRate}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="minimumFare">Minimum Fare (EUR)</Label>
            <Input
              id="minimumFare"
              name="minimumFare"
              type="number"
              step="0.01"
              value={rates.minimumFare}
              onChange={handleChange}
              className="w-full"
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          Update Pricing
        </Button>
      </form>

      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Current Pricing Example:</h3>
        <p>5 km, 10 minute ride would cost:</p>
        <p className="text-xl font-bold">
          €{(
            rates.baseRate +
            (rates.perKilometerRate * 5) +
            (rates.perMinuteRate * 10)
          ).toFixed(2)}
        </p>
      </div>
    </Card>
  );
}
