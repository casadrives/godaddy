export interface FinancialReport {
  id: string;
  driverId: string;
  period: {
    start: Date;
    end: Date;
  };
  summary: {
    totalRides: number;
    totalEarnings: number;
    totalCommission: number;
    subscriptionFee: number;
    netEarnings: number;
  };
  rides: {
    id: string;
    date: Date;
    fare: number;
    commission: number;
    distance: number;
    duration: number;
  }[];
  paymentBreakdown: {
    cash: number;
    card: number;
    sepa: number;
  };
  trends: {
    averageRidesPerDay: number;
    averageEarningsPerRide: number;
    topEarningDays: {
      date: Date;
      earnings: number;
    }[];
    peakHours: {
      hour: number;
      rides: number;
    }[];
  };
}

export interface AdminFinancialReport {
  period: {
    start: Date;
    end: Date;
  };
  summary: {
    totalDrivers: number;
    activeDrivers: number;
    totalRides: number;
    totalRevenue: number;
    totalCommission: number;
    subscriptionRevenue: number;
    totalProfit: number;
  };
  driverStats: {
    topEarners: {
      driverId: string;
      name: string;
      earnings: number;
      rides: number;
    }[];
    newDrivers: number;
    churned: number;
    subscriptionRenewalRate: number;
  };
  paymentStats: {
    successful: number;
    failed: number;
    pending: number;
    methodBreakdown: {
      cash: number;
      card: number;
      sepa: number;
    };
  };
}

export interface FinancialMetrics {
  totalEarnings: number;
  totalCommission: number;
  totalRides: number;
  averageEarningsPerRide: number;
  averageCommissionPerRide: number;
  subscriptionStatus: 'active' | 'inactive' | 'pending';
  lastSubscriptionPayment: Date;
  nextSubscriptionPayment: Date;
  paymentMethodDistribution: Record<string, number>; // percentage of rides per payment method
  peakHoursEarnings: Record<number, number>; // earnings by hour of day
  weekdayDistribution: Record<string, number>; // percentage of rides per weekday
  monthlyTrends: {
    earnings: number[];
    rides: number[];
    commission: number[];
  };
}

export interface RegionalMetrics {
  topPickupLocations: Array<{
    location: string;
    rides: number;
    earnings: number;
  }>;
  topDropoffLocations: Array<{
    location: string;
    rides: number;
    earnings: number;
  }>;
  crossBorderRides: {
    total: number;
    earnings: number;
    countries: Record<string, number>; // rides per country
  };
}

// Mock reports service - replace with real implementation
export class ReportsService {
  async generateDriverReport(driverId: string, start: Date, end: Date): Promise<FinancialReport> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock data
    return {
      id: `report_${Math.random().toString(36).substr(2, 9)}`,
      driverId,
      period: { start, end },
      summary: {
        totalRides: 45,
        totalEarnings: 1250.75,
        totalCommission: 187.61,
        subscriptionFee: 30.00,
        netEarnings: 1033.14,
      },
      rides: Array(45).fill(null).map((_, index) => ({
        id: `ride_${index}`,
        date: new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())),
        fare: 25 + Math.random() * 30,
        commission: 5 + Math.random() * 4,
        distance: 5 + Math.random() * 10,
        duration: 15 + Math.random() * 30,
      })),
      paymentBreakdown: {
        cash: 450.25,
        card: 680.50,
        sepa: 120.00,
      },
      trends: {
        averageRidesPerDay: 1.5,
        averageEarningsPerRide: 27.79,
        topEarningDays: Array(5).fill(null).map((_, index) => ({
          date: new Date(start.getTime() + index * 24 * 60 * 60 * 1000),
          earnings: 100 + Math.random() * 50,
        })),
        peakHours: Array(24).fill(null).map((_, hour) => ({
          hour,
          rides: Math.floor(Math.random() * 5),
        })),
      },
    };
  }

  async generateAdminReport(start: Date, end: Date): Promise<AdminFinancialReport> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock data
    return {
      period: { start, end },
      summary: {
        totalDrivers: 150,
        activeDrivers: 120,
        totalRides: 3500,
        totalRevenue: 85000.50,
        totalCommission: 12750.08,
        subscriptionRevenue: 3600.00,
        totalProfit: 16350.08,
      },
      driverStats: {
        topEarners: Array(10).fill(null).map((_, index) => ({
          driverId: `driver_${index}`,
          name: `Driver ${index + 1}`,
          earnings: 2000 + Math.random() * 1000,
          rides: 80 + Math.floor(Math.random() * 40),
        })),
        newDrivers: 15,
        churned: 3,
        subscriptionRenewalRate: 0.95,
      },
      paymentStats: {
        successful: 145,
        failed: 3,
        pending: 2,
        methodBreakdown: {
          cash: 25000.50,
          card: 55000.00,
          sepa: 5000.00,
        },
      },
    };
  }

  async generateDriverFinancialReport(
    driverId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{
    metrics: FinancialMetrics;
    regional: RegionalMetrics;
  }> {
    // Mock implementation
    return {
      metrics: {
        totalEarnings: 2500.50,
        totalCommission: 375.08,
        totalRides: 120,
        averageEarningsPerRide: 20.84,
        averageCommissionPerRide: 3.13,
        subscriptionStatus: 'active',
        lastSubscriptionPayment: new Date('2024-01-01'),
        nextSubscriptionPayment: new Date('2024-02-01'),
        paymentMethodDistribution: {
          card: 45,
          cash: 20,
          digicash: 15,
          payconiq: 12,
          vpay: 8,
        },
        peakHoursEarnings: {
          7: 180.50,
          8: 320.75,
          9: 280.25,
          // ... more hours
        },
        weekdayDistribution: {
          monday: 18,
          tuesday: 15,
          wednesday: 14,
          thursday: 16,
          friday: 22,
          saturday: 10,
          sunday: 5,
        },
        monthlyTrends: {
          earnings: [2200, 2350, 2500, 2450, 2500.50],
          rides: [105, 112, 118, 115, 120],
          commission: [330, 352.50, 375, 367.50, 375.08],
        },
      },
      regional: {
        topPickupLocations: [
          {
            location: 'Luxembourg Central Station',
            rides: 25,
            earnings: 525.50,
          },
          {
            location: 'Kirchberg',
            rides: 20,
            earnings: 420.75,
          },
          {
            location: 'Luxembourg Airport',
            rides: 18,
            earnings: 378.25,
          },
        ],
        topDropoffLocations: [
          {
            location: 'Luxembourg Airport',
            rides: 22,
            earnings: 462.00,
          },
          {
            location: 'Kirchberg',
            rides: 19,
            earnings: 399.00,
          },
          {
            location: 'Cloche d\'Or',
            rides: 15,
            earnings: 315.25,
          },
        ],
        crossBorderRides: {
          total: 35,
          earnings: 875.50,
          countries: {
            france: 15,
            belgium: 12,
            germany: 8,
          },
        },
      },
    };
  }

  async downloadReport(reportId: string, format: 'pdf' | 'csv'): Promise<Blob> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock PDF/CSV generation
    return new Blob(['Mock report data'], { type: format === 'pdf' ? 'application/pdf' : 'text/csv' });
  }

  async scheduleReport(driverId: string, frequency: 'daily' | 'weekly' | 'monthly'): Promise<void> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    // Mock implementation
  }
}
