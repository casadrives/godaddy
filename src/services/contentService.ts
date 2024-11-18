import { api } from '@/lib/axios';

interface Vehicle {
  id: string;
  name: string;
  type: string;
  capacity: number;
  baseRate: number;
  active: boolean;
}

interface ServiceArea {
  id: string;
  name: string;
  coordinates: [number, number][];
  active: boolean;
  baseRate: number;
}

interface PricingRule {
  id: string;
  name: string;
  type: 'surge' | 'discount';
  factor: number;
  conditions: {
    timeOfDay?: [string, string];
    daysOfWeek?: string[];
    demand?: number;
  };
  active: boolean;
}

interface Promotion {
  id: string;
  title: string;
  description: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: string;
  endDate: string;
  active: boolean;
}

export const contentService = {
  // Vehicle Management
  async getVehicles(): Promise<Vehicle[]> {
    const response = await api.get('/content/vehicles');
    return response.data;
  },

  async addVehicle(vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> {
    const response = await api.post('/content/vehicles', vehicle);
    return response.data;
  },

  async updateVehicle(vehicle: Vehicle): Promise<Vehicle> {
    const response = await api.put(`/content/vehicles/${vehicle.id}`, vehicle);
    return response.data;
  },

  async deleteVehicle(id: string): Promise<void> {
    await api.delete(`/content/vehicles/${id}`);
  },

  // Service Areas
  async getServiceAreas(): Promise<ServiceArea[]> {
    const response = await api.get('/content/service-areas');
    return response.data;
  },

  async addServiceArea(area: Omit<ServiceArea, 'id'>): Promise<ServiceArea> {
    const response = await api.post('/content/service-areas', area);
    return response.data;
  },

  async updateServiceArea(area: ServiceArea): Promise<ServiceArea> {
    const response = await api.put(`/content/service-areas/${area.id}`, area);
    return response.data;
  },

  async deleteServiceArea(id: string): Promise<void> {
    await api.delete(`/content/service-areas/${id}`);
  },

  // Pricing Rules
  async getPricingRules(): Promise<PricingRule[]> {
    const response = await api.get('/content/pricing-rules');
    return response.data;
  },

  async addPricingRule(rule: Omit<PricingRule, 'id'>): Promise<PricingRule> {
    const response = await api.post('/content/pricing-rules', rule);
    return response.data;
  },

  async updatePricingRule(rule: PricingRule): Promise<PricingRule> {
    const response = await api.put(`/content/pricing-rules/${rule.id}`, rule);
    return response.data;
  },

  async deletePricingRule(id: string): Promise<void> {
    await api.delete(`/content/pricing-rules/${id}`);
  },

  // Promotions
  async getPromotions(): Promise<Promotion[]> {
    const response = await api.get('/content/promotions');
    return response.data;
  },

  async addPromotion(promotion: Omit<Promotion, 'id'>): Promise<Promotion> {
    const response = await api.post('/content/promotions', promotion);
    return response.data;
  },

  async updatePromotion(promotion: Promotion): Promise<Promotion> {
    const response = await api.put(`/content/promotions/${promotion.id}`, promotion);
    return response.data;
  },

  async deletePromotion(id: string): Promise<void> {
    await api.delete(`/content/promotions/${id}`);
  },
};
