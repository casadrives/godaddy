export const DRIVER_SUBSCRIPTION = {
  monthlyFee: 30.00, // EUR per month
  commissionRate: 0.15, // 15% commission on rides
};

export const RIDE_PRICING = {
  baseRate: 5.00,
  perKilometerRates: {
    economy: 3.65,
    comfort: 4.50,
    premium: 5.75,
    van: 6.50,
  },
  perMinuteRate: 0.50,
  minimumFare: 10.00,
};

export const PAYMENT_LINKS = {
  DRIVER: {
    SUMUP: 'https://pay.sumup.com/b2c/Q34W1GM9',
  },
};

export const PAYMENT_CONFIG = {
  PAYPAL: {
    EMAIL: 'admin@casadrives.com',
    CURRENCY: 'EUR',
  },
  SUPPORTED_METHODS: ['paypal', 'sumup'] as const,
};

export const PRICING = {
  // Global trial settings
  TRIAL: {
    DURATION_MONTHS: 1,
    FEATURES: 'all', // During trial, users get access to all features
  },

  // Company specific pricing
  COMPANY: {
    TAXI_MONTHLY_FEE: 10, // EUR per taxi per month
    RIDE_COMMISSION_PERCENTAGE: 10, // 10% of ride fare
    PAYMENT_METHODS: {
      PAYPAL: PAYMENT_CONFIG.PAYPAL.EMAIL,
    },
    TRIAL_BENEFITS: {
      waiveTaxiFees: true,
      waiveCommission: true,
      accessAllFeatures: true,
    },
    SUBSCRIPTION_PLANS: {
      basic: {
        name: 'Basic',
        basePrice: 0, // EUR per month
        features: {
          prioritySupport: false,
          customBranding: false,
          analytics: false,
          api: false,
        },
      },
      premium: {
        name: 'Premium',
        basePrice: 99.99, // EUR per month
        features: {
          prioritySupport: true,
          customBranding: true,
          analytics: true,
          api: false,
        },
      },
      enterprise: {
        name: 'Enterprise',
        basePrice: 299.99, // EUR per month
        features: {
          prioritySupport: true,
          customBranding: true,
          analytics: true,
          api: true,
        },
      },
    },
  },
  
  // Individual driver pricing
  INDIVIDUAL_DRIVER: {
    MONTHLY_FEE: 30, // EUR per month
    COMMISSION_PERCENTAGE: 15, // 15% of ride fare
    PAYMENT_METHODS: {
      SUMUP: PAYMENT_LINKS.DRIVER.SUMUP,
      PAYPAL: PAYMENT_CONFIG.PAYPAL.EMAIL,
    },
    TRIAL_BENEFITS: {
      waiveMonthlyFee: true,
      waiveCommission: true,
      accessAllFeatures: true,
    },
    SUBSCRIPTION_PLANS: {
      standard: {
        name: 'Standard Driver',
        price: 30, // EUR per month
        features: {
          maxRidesPerDay: 'unlimited',
          prioritySupport: false,
          analytics: false,
          insurance: 'basic',
        },
      },
      premium: {
        name: 'Premium Driver',
        price: 49.99, // Additional to monthly fee
        features: {
          maxRidesPerDay: 'unlimited',
          prioritySupport: true,
          analytics: true,
          insurance: 'premium',
          priorityMatching: true,
          professionalProfile: true,
        },
      },
    },
  },
} as const;

export interface EarningsCalculation {
  totalFare: number;
  adminCommission: number;
  driverEarnings: number;
}

export interface TaxiRegistration {
  id: string;
  companyId: string;
  licensePlate: string;
  vehicleType: string;
  registrationDate: Date;
  status: 'active' | 'inactive';
}

export interface CompanyBilling {
  companyId: string;
  month: string; // YYYY-MM format
  activeTaxis: number;
  taxiFees: number; // Total taxi fees for the month
  totalRides: number;
  totalRideRevenue: number;
  commissionAmount: number;
  totalDue: number; // taxiFees + commissionAmount
  status: 'pending' | 'paid' | 'overdue';
  dueDate: Date;
}

export type AccountType = 'company' | 'individual_driver';

export interface Account {
  id: string;
  type: AccountType;
  name: string;
  email: string;
  phone: string;
  registrationDate: Date;
  status: 'active' | 'inactive' | 'suspended';
  subscriptionPlan: string;
  // Company specific fields
  companyDetails?: {
    registrationNumber: string;
    vatNumber: string;
    address: string;
    numberOfTaxis: number;
  };
  // Individual driver specific fields
  driverDetails?: {
    licenseNumber: string;
    vehicleInfo: {
      licensePlate: string;
      model: string;
      year: number;
    };
  };
}

export interface TrialStatus {
  isInTrial: boolean;
  trialStartDate: Date;
  trialEndDate: Date;
  daysRemaining: number;
}

export interface AccountBilling extends Account {
  trial: TrialStatus;
}

export function calculateDriverEarnings(rideFare: number): EarningsCalculation {
  const adminCommission = rideFare * DRIVER_SUBSCRIPTION.commissionRate;
  const driverEarnings = rideFare - adminCommission;

  return {
    totalFare: rideFare,
    adminCommission,
    driverEarnings,
  };
}
