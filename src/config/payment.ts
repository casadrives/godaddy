export interface PaymentProvider {
  id: string;
  name: {
    en: string;
    fr: string;
    de: string;
    lb: string;
  };
  type: 'bank' | 'card' | 'mobile' | 'cash';
  methods: PaymentMethod[];
  countries: string[];
  currencies: string[];
  fees: {
    fixed: number;
    percentage: number;
  };
  limits: {
    min: number;
    max: number;
    daily?: number;
    monthly?: number;
  };
  features: string[];
  processingTime: {
    average: string;
    maximum: string;
  };
}

export interface PaymentMethod {
  id: string;
  name: {
    en: string;
    fr: string;
    de: string;
    lb: string;
  };
  type: 'card' | 'sepa' | 'digicash' | 'payconiq' | 'vpay' | 'satispay' | 'cash';
  category: 'debit' | 'credit' | 'mobile' | 'bank_transfer' | 'cash';
  networks?: string[];
  supported3DS: boolean;
  instantConfirmation: boolean;
  refundable: boolean;
}

export const LUXEMBOURG_PAYMENT_PROVIDERS: PaymentProvider[] = [
  {
    id: 'bcee',
    name: {
      en: 'Spuerkeess',
      fr: 'Spuerkeess',
      de: 'Spuerkeess',
      lb: 'Spuerkeess',
    },
    type: 'bank',
    methods: [
      {
        id: 'digicash',
        name: {
          en: 'Digicash',
          fr: 'Digicash',
          de: 'Digicash',
          lb: 'Digicash',
        },
        type: 'digicash',
        category: 'mobile',
        supported3DS: true,
        instantConfirmation: true,
        refundable: true,
      },
      {
        id: 'vpay',
        name: {
          en: 'V PAY',
          fr: 'V PAY',
          de: 'V PAY',
          lb: 'V PAY',
        },
        type: 'vpay',
        category: 'debit',
        networks: ['vpay'],
        supported3DS: true,
        instantConfirmation: true,
        refundable: true,
      },
    ],
    countries: ['LU'],
    currencies: ['EUR'],
    fees: {
      fixed: 0,
      percentage: 0.9,
    },
    limits: {
      min: 1,
      max: 10000,
      daily: 5000,
      monthly: 50000,
    },
    features: ['instant_confirmation', '3d_secure', 'refunds', 'recurring_payments'],
    processingTime: {
      average: 'instant',
      maximum: '1 hour',
    },
  },
  {
    id: 'payconiq',
    name: {
      en: 'Payconiq',
      fr: 'Payconiq',
      de: 'Payconiq',
      lb: 'Payconiq',
    },
    type: 'mobile',
    methods: [
      {
        id: 'payconiq_app',
        name: {
          en: 'Payconiq by Bancontact',
          fr: 'Payconiq by Bancontact',
          de: 'Payconiq by Bancontact',
          lb: 'Payconiq by Bancontact',
        },
        type: 'payconiq',
        category: 'mobile',
        supported3DS: true,
        instantConfirmation: true,
        refundable: true,
      },
    ],
    countries: ['LU', 'BE', 'NL'],
    currencies: ['EUR'],
    fees: {
      fixed: 0,
      percentage: 0.6,
    },
    limits: {
      min: 0.01,
      max: 5000,
      daily: 2500,
    },
    features: ['qr_code', 'instant_confirmation', 'refunds'],
    processingTime: {
      average: 'instant',
      maximum: '1 hour',
    },
  },
  {
    id: 'satispay',
    name: {
      en: 'Satispay',
      fr: 'Satispay',
      de: 'Satispay',
      lb: 'Satispay',
    },
    type: 'mobile',
    methods: [
      {
        id: 'satispay_app',
        name: {
          en: 'Satispay',
          fr: 'Satispay',
          de: 'Satispay',
          lb: 'Satispay',
        },
        type: 'satispay',
        category: 'mobile',
        supported3DS: false,
        instantConfirmation: true,
        refundable: true,
      },
    ],
    countries: ['LU', 'IT', 'DE', 'FR'],
    currencies: ['EUR'],
    fees: {
      fixed: 0,
      percentage: 0.5,
    },
    limits: {
      min: 0.01,
      max: 3000,
      daily: 1500,
    },
    features: ['qr_code', 'instant_confirmation', 'refunds', 'business_analytics'],
    processingTime: {
      average: 'instant',
      maximum: '1 hour',
    },
  },
  {
    id: 'cards',
    name: {
      en: 'Card Payments',
      fr: 'Paiements par Carte',
      de: 'Kartenzahlungen',
      lb: 'Kaartebezuelung',
    },
    type: 'card',
    methods: [
      {
        id: 'visa',
        name: {
          en: 'Visa',
          fr: 'Visa',
          de: 'Visa',
          lb: 'Visa',
        },
        type: 'card',
        category: 'credit',
        networks: ['visa'],
        supported3DS: true,
        instantConfirmation: true,
        refundable: true,
      },
      {
        id: 'mastercard',
        name: {
          en: 'Mastercard',
          fr: 'Mastercard',
          de: 'Mastercard',
          lb: 'Mastercard',
        },
        type: 'card',
        category: 'credit',
        networks: ['mastercard'],
        supported3DS: true,
        instantConfirmation: true,
        refundable: true,
      },
      {
        id: 'vpay',
        name: {
          en: 'V PAY',
          fr: 'V PAY',
          de: 'V PAY',
          lb: 'V PAY',
        },
        type: 'vpay',
        category: 'debit',
        networks: ['vpay'],
        supported3DS: true,
        instantConfirmation: true,
        refundable: true,
      },
    ],
    countries: ['LU', 'EU'],
    currencies: ['EUR'],
    fees: {
      fixed: 0,
      percentage: 1.4,
    },
    limits: {
      min: 0.01,
      max: 25000,
    },
    features: ['3d_secure', 'instant_confirmation', 'refunds', 'recurring_payments'],
    processingTime: {
      average: 'instant',
      maximum: '1 day',
    },
  },
  {
    id: 'sepa',
    name: {
      en: 'SEPA Bank Transfer',
      fr: 'Virement SEPA',
      de: 'SEPA-Überweisung',
      lb: 'SEPA-Iwwerweisung',
    },
    type: 'bank',
    methods: [
      {
        id: 'sepa_credit',
        name: {
          en: 'SEPA Credit Transfer',
          fr: 'Virement SEPA',
          de: 'SEPA-Überweisung',
          lb: 'SEPA-Iwwerweisung',
        },
        type: 'sepa',
        category: 'bank_transfer',
        supported3DS: false,
        instantConfirmation: false,
        refundable: true,
      },
      {
        id: 'sepa_instant',
        name: {
          en: 'SEPA Instant Transfer',
          fr: 'Virement Instantané SEPA',
          de: 'SEPA Instant-Überweisung',
          lb: 'SEPA Instant-Iwwerweisung',
        },
        type: 'sepa',
        category: 'bank_transfer',
        supported3DS: false,
        instantConfirmation: true,
        refundable: true,
      },
    ],
    countries: ['LU', 'EU'],
    currencies: ['EUR'],
    fees: {
      fixed: 0,
      percentage: 0.3,
    },
    limits: {
      min: 0.01,
      max: 100000,
    },
    features: ['high_value_payments', 'refunds', 'batch_processing'],
    processingTime: {
      average: '1 business day',
      maximum: '3 business days',
    },
  },
];

export const PAYMENT_FEATURES = {
  threeDSecure: {
    required: true,
    version: '2.0',
    exemptions: ['low_value', 'recurring'],
  },
  instantPayments: {
    preferred: true,
    maxAmount: 100000,
  },
  refunds: {
    automaticApproval: true,
    maxDays: 30,
  },
  recurring: {
    supported: true,
    frequencies: ['weekly', 'monthly', 'yearly'],
  },
  multicurrency: {
    supported: false,
    baseCurrency: 'EUR',
  },
};
