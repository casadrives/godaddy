import { DRIVER_SUBSCRIPTION } from '@/config/pricing';

export interface PaymentMethod {
  id: string;
  type: 'card' | 'sepa' | 'digicash' | 'payconiq' | 'vpay' | 'cash';
  last4: string;
  expMonth?: number;
  expYear?: number;
  brand?: string;
  bankName?: string;
  iban?: string;
  details?: any;
}

export interface PaymentMethodDetails {
  card?: {
    number: string;
    exp_month: number;
    exp_year: number;
    cvc: string;
  };
  sepa?: {
    iban: string;
    name: string;
  };
  digicash?: {
    // Add Digicash-specific details
  };
  payconiq?: {
    // Add Payconiq-specific details
  };
  vpay?: {
    // Add V PAY-specific details
  };
}

export interface PaymentIntent {
  id: string;
  amount: number;
  status: 'pending' | 'succeeded' | 'failed';
  paymentMethod: PaymentMethod;
  created: Date;
  description: string;
  currency: string;
}

export interface SubscriptionPayment {
  id: string;
  driverId: string;
  amount: number;
  status: 'pending' | 'succeeded' | 'failed';
  billingPeriod: {
    start: Date;
    end: Date;
  };
  paymentIntent: PaymentIntent;
}

export interface LuxPaymentProvider {
  name: string;
  type: 'card' | 'sepa' | 'digicash' | 'payconiq' | 'vpay' | 'cash';
  supportedCurrencies: string[];
  minAmount: number;
  maxAmount: number;
  supportedCountries: string[];
}

export const LUXEMBOURG_PAYMENT_PROVIDERS: LuxPaymentProvider[] = [
  {
    name: 'Digicash',
    type: 'digicash',
    supportedCurrencies: ['EUR'],
    minAmount: 0.01,
    maxAmount: 10000,
    supportedCountries: ['LU'],
  },
  {
    name: 'Payconiq',
    type: 'payconiq',
    supportedCurrencies: ['EUR'],
    minAmount: 0.01,
    maxAmount: 5000,
    supportedCountries: ['LU', 'BE', 'NL'],
  },
  {
    name: 'V PAY',
    type: 'vpay',
    supportedCurrencies: ['EUR'],
    minAmount: 0.01,
    maxAmount: 5000,
    supportedCountries: ['LU', 'EU'],
  },
];

export class PaymentService {
  async createPaymentMethod(
    driverId: string,
    type: LuxPaymentProvider['type'],
    details: PaymentMethodDetails
  ): Promise<PaymentMethod> {
    // Validate payment provider
    const provider = LUXEMBOURG_PAYMENT_PROVIDERS.find(p => p.type === type);
    if (type !== 'card' && type !== 'sepa' && type !== 'cash' && !provider) {
      throw new Error(`Unsupported payment provider: ${type}`);
    }

    // Mock implementation
    const paymentMethod: PaymentMethod = {
      id: `pm_${Math.random().toString(36).substr(2, 9)}`,
      driverId,
      type,
      details,
      created: new Date(),
      isDefault: false,
    };

    return paymentMethod;
  }

  async createSubscriptionPayment(driverId: string): Promise<SubscriptionPayment> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    return {
      id: `sub_${Math.random().toString(36).substr(2, 9)}`,
      driverId,
      amount: DRIVER_SUBSCRIPTION.monthlyFee,
      status: 'pending',
      billingPeriod: {
        start: startDate,
        end: endDate,
      },
      paymentIntent: {
        id: `pi_${Math.random().toString(36).substr(2, 9)}`,
        amount: DRIVER_SUBSCRIPTION.monthlyFee,
        status: 'pending',
        paymentMethod: {
          id: 'pm_mock',
          type: 'card',
          last4: '4242',
          brand: 'visa',
        },
        created: new Date(),
        description: `Driver Subscription - ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`,
        currency: 'EUR',
      },
    };
  }

  async processSubscriptionPayment(
    driverId: string,
    paymentMethodId: string,
    amount: number,
    currency: string = 'EUR'
  ): Promise<PaymentIntent> {
    // Validate currency
    if (currency !== 'EUR') {
      throw new Error('Only EUR is supported for Luxembourg taxi payments');
    }

    // Mock implementation
    const paymentIntent: PaymentIntent = {
      id: `pi_${Math.random().toString(36).substr(2, 9)}`,
      driverId,
      amount,
      currency,
      paymentMethodId,
      status: 'succeeded',
      created: new Date(),
      description: 'Monthly Subscription Payment',
    };

    return paymentIntent;
  }

  async confirmPayment(paymentIntentId: string): Promise<PaymentIntent> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      id: paymentIntentId,
      amount: DRIVER_SUBSCRIPTION.monthlyFee,
      status: 'succeeded',
      paymentMethod: {
        id: 'pm_mock',
        type: 'card',
        last4: '4242',
        brand: 'visa',
      },
      created: new Date(),
      description: 'Payment confirmed',
      currency: 'EUR',
    };
  }

  async listPaymentMethods(driverId: string): Promise<PaymentMethod[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    return [
      {
        id: 'pm_mock1',
        type: 'card',
        last4: '4242',
        expMonth: 12,
        expYear: 2024,
        brand: 'visa',
      },
      {
        id: 'pm_mock2',
        type: 'sepa',
        last4: '1234',
        bankName: 'Luxembourg Bank',
        iban: 'LU12 3456 7890 1234 5678',
      },
    ];
  }

  async getPaymentHistory(driverId: string): Promise<PaymentIntent[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    return Array(5).fill(null).map((_, index) => ({
      id: `pi_${Math.random().toString(36).substr(2, 9)}`,
      amount: DRIVER_SUBSCRIPTION.monthlyFee,
      status: 'succeeded',
      paymentMethod: {
        id: 'pm_mock',
        type: 'card',
        last4: '4242',
        brand: 'visa',
      },
      created: new Date(Date.now() - index * 30 * 24 * 60 * 60 * 1000),
      description: `Monthly Subscription Payment`,
      currency: 'EUR',
    }));
  }
}
