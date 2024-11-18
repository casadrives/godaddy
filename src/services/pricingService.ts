import { create } from 'zustand';

interface PricingState {
  baseRate: number;
  perKilometerRate: number;
  perMinuteRate: number;
  minimumFare: number;
  updateRates: (rates: Partial<PricingRates>) => void;
}

interface PricingRates {
  baseRate: number;
  perKilometerRate: number;
  perMinuteRate: number;
  minimumFare: number;
}

export const usePricingStore = create<PricingState>((set) => ({
  baseRate: 5.00, // Base fare in EUR
  perKilometerRate: 3.65, // Rate per kilometer in EUR
  perMinuteRate: 0.50, // Rate per minute in EUR
  minimumFare: 10.00, // Minimum fare in EUR
  
  updateRates: (rates: Partial<PricingRates>) => 
    set((state) => ({
      ...state,
      ...rates,
    })),
}));

export const calculateFare = (
  distanceKm: number,
  durationMinutes: number,
): number => {
  const { baseRate, perKilometerRate, perMinuteRate, minimumFare } = usePricingStore.getState();
  
  const distanceCost = distanceKm * perKilometerRate;
  const timeCost = durationMinutes * perMinuteRate;
  const totalFare = baseRate + distanceCost + timeCost;
  
  return Math.max(totalFare, minimumFare);
};
