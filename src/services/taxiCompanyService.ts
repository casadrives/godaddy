import { createApi } from '@/lib/api';

export interface TaxiCompany {
  id: string;
  name: string;
  phone: string;
  website?: string;
  address: string;
  fleetSize: number;
  active: boolean;
  rating: number;
  operatingHours: string;
  regions: string[];
  email: string;
  licenseNumber: string;
  foundedYear: number;
  insuranceStatus: 'valid' | 'expired' | 'pending';
  lastInspectionDate: string;
  averageResponseTime: number; // in minutes
}

export interface CompanyAnalytics {
  totalTrips: number;
  completionRate: number;
  averageRating: number;
  revenueData: {
    daily: number;
    weekly: number;
    monthly: number;
    yearToDate: number;
  };
  tripDistribution: {
    date: string;
    trips: number;
  }[];
  popularRoutes: {
    from: string;
    to: string;
    count: number;
  }[];
  customerFeedback: {
    positive: number;
    neutral: number;
    negative: number;
  };
  driverPerformance: {
    totalDrivers: number;
    activeDrivers: number;
    topPerformers: number;
    averageRating: number;
  };
}

export interface TaxiCompanyFormData extends Omit<TaxiCompany, 'id'> {}

// Initial data with more Luxembourg taxi companies
const mockCompanies: TaxiCompany[] = [
  {
    id: '1',
    name: 'Webtaxi',
    phone: '+352 27 515',
    website: 'https://www.webtaxi.lu',
    email: 'info@webtaxi.lu',
    address: '2, rue des Mines, L-4244 Esch-sur-Alzette',
    fleetSize: 120,
    active: true,
    rating: 4.5,
    operatingHours: '24/7',
    regions: ['Luxembourg City', 'Esch-sur-Alzette', 'Differdange'],
    licenseNumber: 'LUX-TX-001',
    foundedYear: 2012,
    insuranceStatus: 'valid',
    lastInspectionDate: '2024-01-15',
    averageResponseTime: 5,
  },
  {
    id: '2',
    name: 'Colux Taxi',
    phone: '+352 48 22 33',
    website: 'https://www.coluxtaxi.lu',
    email: 'contact@coluxtaxi.lu',
    address: '31, rue de Hollerich, L-1741 Luxembourg',
    fleetSize: 85,
    active: true,
    rating: 4.3,
    operatingHours: '24/7',
    regions: ['Luxembourg City', 'Kirchberg', 'Findel Airport'],
    licenseNumber: 'LUX-TX-002',
    foundedYear: 1995,
    insuranceStatus: 'valid',
    lastInspectionDate: '2024-02-01',
    averageResponseTime: 6,
  },
  {
    id: '3',
    name: 'Inter Taxi',
    phone: '+352 49 49 49',
    website: 'https://www.intertaxi.lu',
    email: 'info@intertaxi.lu',
    address: '5, rue de Bonnevoie, L-1260 Luxembourg',
    fleetSize: 65,
    active: true,
    rating: 4.2,
    operatingHours: '24/7',
    regions: ['Luxembourg City', 'Gare', 'Bonnevoie'],
    licenseNumber: 'LUX-TX-003',
    foundedYear: 1998,
    insuranceStatus: 'valid',
    lastInspectionDate: '2024-01-20',
    averageResponseTime: 7,
  },
  {
    id: '4',
    name: 'City Taxi',
    phone: '+352 48 00 58',
    website: 'https://www.citytaxi.lu',
    email: 'contact@citytaxi.lu',
    address: '12, avenue de la Liberté, L-1930 Luxembourg',
    fleetSize: 45,
    active: true,
    rating: 4.0,
    operatingHours: '24/7',
    regions: ['Luxembourg City', 'Limpertsberg', 'Belair'],
    licenseNumber: 'LUX-TX-004',
    foundedYear: 2000,
    insuranceStatus: 'valid',
    lastInspectionDate: '2024-01-10',
    averageResponseTime: 8,
  },
  {
    id: '5',
    name: 'Benelux Taxi',
    phone: '+352 40 38 40',
    website: 'https://www.beneluxtaxi.lu',
    email: 'info@beneluxtaxi.lu',
    address: '45, route d'Arlon, L-8009 Strassen',
    fleetSize: 55,
    active: true,
    rating: 4.1,
    operatingHours: '24/7',
    regions: ['Luxembourg City', 'Strassen', 'Bertrange'],
    licenseNumber: 'LUX-TX-005',
    foundedYear: 1997,
    insuranceStatus: 'valid',
    lastInspectionDate: '2024-02-05',
    averageResponseTime: 7,
  },
  {
    id: '6',
    name: 'Gare Taxi',
    phone: '+352 48 15 15',
    website: 'https://www.garetaxi.lu',
    email: 'dispatch@garetaxi.lu',
    address: '20, place de la Gare, L-1616 Luxembourg',
    fleetSize: 35,
    active: true,
    rating: 4.0,
    operatingHours: '24/7',
    regions: ['Luxembourg City', 'Gare', 'Gasperich'],
    licenseNumber: 'LUX-TX-006',
    foundedYear: 2005,
    insuranceStatus: 'valid',
    lastInspectionDate: '2024-01-25',
    averageResponseTime: 6,
  },
];

// Mock analytics data generator
const generateMockAnalytics = (companyId: string): CompanyAnalytics => {
  const baseTrips = Math.floor(Math.random() * 5000) + 3000;
  const baseDailyRevenue = Math.floor(Math.random() * 5000) + 2000;

  return {
    totalTrips: baseTrips,
    completionRate: 95 + Math.random() * 4,
    averageRating: 4 + Math.random(),
    revenueData: {
      daily: baseDailyRevenue,
      weekly: baseDailyRevenue * 7,
      monthly: baseDailyRevenue * 30,
      yearToDate: baseDailyRevenue * 365,
    },
    tripDistribution: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      trips: Math.floor(Math.random() * 200) + 100,
    })).reverse(),
    popularRoutes: [
      {
        from: 'Luxembourg City',
        to: 'Findel Airport',
        count: Math.floor(Math.random() * 1000) + 500,
      },
      {
        from: 'Kirchberg',
        to: 'Gare',
        count: Math.floor(Math.random() * 800) + 300,
      },
      {
        from: 'Cloche d\'Or',
        to: 'City Center',
        count: Math.floor(Math.random() * 600) + 200,
      },
    ],
    customerFeedback: {
      positive: Math.floor(Math.random() * 1000) + 500,
      neutral: Math.floor(Math.random() * 200) + 100,
      negative: Math.floor(Math.random() * 100) + 50,
    },
    driverPerformance: {
      totalDrivers: Math.floor(Math.random() * 50) + 30,
      activeDrivers: Math.floor(Math.random() * 40) + 20,
      topPerformers: Math.floor(Math.random() * 10) + 5,
      averageRating: 4 + Math.random(),
    },
  };
};

// Create API endpoints
export const taxiCompanyService = createApi({
  getCompanies: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockCompanies;
  },

  getCompany: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const company = mockCompanies.find(c => c.id === id);
    if (!company) throw new Error('Company not found');
    return company;
  },

  createCompany: async (data: TaxiCompanyFormData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newCompany: TaxiCompany = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
    };
    mockCompanies.push(newCompany);
    return newCompany;
  },

  updateCompany: async (id: string, data: Partial<TaxiCompanyFormData>) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const index = mockCompanies.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Company not found');
    
    const updatedCompany = {
      ...mockCompanies[index],
      ...data,
    };
    mockCompanies[index] = updatedCompany;
    return updatedCompany;
  },

  deleteCompany: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const index = mockCompanies.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Company not found');
    mockCompanies.splice(index, 1);
  },

  getCompanyAnalytics: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return generateMockAnalytics(id);
  },
});
