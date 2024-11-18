export interface DriverDocument {
  id: string;
  type: 'license' | 'id_card' | 'insurance' | 'vehicle_registration' | 'criminal_record' | 'medical_certificate';
  status: 'pending' | 'approved' | 'rejected';
  uploadDate: Date;
  expiryDate?: Date;
  verificationDate?: Date;
  verifiedBy?: string;
  rejectionReason?: string;
  documentUrl: string;
}

export interface VehicleDetails {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  type: 'economy' | 'comfort' | 'premium' | 'van';
  color: string;
  capacity: number;
  features: string[];
  inspectionDate: Date;
  insuranceExpiryDate: Date;
}

export interface DriverOnboarding {
  id: string;
  status: 'incomplete' | 'documents_pending' | 'verification_pending' | 'approved' | 'rejected';
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    dateOfBirth: Date;
    nationality: string;
    languages: string[];
  };
  documents: DriverDocument[];
  vehicle: VehicleDetails;
  bankInfo?: {
    accountHolder: string;
    iban: string;
    bankName: string;
    swiftCode: string;
  };
  training: {
    completed: boolean;
    completionDate?: Date;
    score?: number;
    certificateUrl?: string;
  };
  background: {
    checkStatus: 'pending' | 'passed' | 'failed';
    checkDate?: Date;
    provider?: string;
    referenceNumber?: string;
  };
}

export interface LuxembourgDriverRequirements {
  minimumAge: number;
  requiredDocuments: {
    driverLicense: {
      type: string[];
      validityYears: number;
    };
    taxiPermit: {
      type: string;
      validityYears: number;
      renewalProcess: string;
    };
    criminalRecord: {
      type: string;
      validityMonths: number;
      issuingAuthority: string;
    };
    medicalCertificate: {
      type: string;
      validityYears: number;
      requiredTests: string[];
    };
    proofOfResidence: {
      type: string[];
      validityMonths: number;
    };
    insuranceCertificate: {
      type: string;
      minimumCoverage: number;
      requiredClauses: string[];
    };
  };
  languageRequirements: {
    required: string[];
    preferred: string[];
    minimumLevel: string;
  };
  vehicleRequirements: {
    maximumAge: number;
    minimumDoors: number;
    minimumSeats: number;
    requiredFeatures: string[];
    emissions: {
      standard: string;
      maxEmissions: number;
    };
  };
  trainingRequirements: {
    initialTraining: {
      durationHours: number;
      modules: string[];
      provider: string;
    };
    ongoingTraining: {
      frequencyMonths: number;
      durationHours: number;
      topics: string[];
    };
  };
}

export const LUXEMBOURG_DRIVER_REQUIREMENTS: LuxembourgDriverRequirements = {
  minimumAge: 21,
  requiredDocuments: {
    driverLicense: {
      type: ['B', 'D1'],
      validityYears: 10,
    },
    taxiPermit: {
      type: 'Luxembourg Taxi Permit',
      validityYears: 5,
      renewalProcess: 'Submit renewal application 3 months before expiry',
    },
    criminalRecord: {
      type: 'Bulletin N°3',
      validityMonths: 3,
      issuingAuthority: 'Luxembourg Ministry of Justice',
    },
    medicalCertificate: {
      type: 'Professional Driver Medical Certificate',
      validityYears: 2,
      requiredTests: [
        'Vision',
        'Hearing',
        'Cardiovascular',
        'Diabetes',
        'Sleep Apnea',
      ],
    },
    proofOfResidence: {
      type: ['Certificate of Residence', 'Luxembourg ID Card'],
      validityMonths: 3,
    },
    insuranceCertificate: {
      type: 'Professional Taxi Insurance',
      minimumCoverage: 2500000,
      requiredClauses: [
        'Passenger Coverage',
        'Third Party Liability',
        'Professional Usage',
      ],
    },
  },
  languageRequirements: {
    required: ['French', 'German'],
    preferred: ['Luxembourgish', 'English'],
    minimumLevel: 'B1',
  },
  vehicleRequirements: {
    maximumAge: 7,
    minimumDoors: 4,
    minimumSeats: 5,
    requiredFeatures: [
      'Air Conditioning',
      'GPS Navigation',
      'Card Payment Terminal',
      'First Aid Kit',
      'Safety Triangle',
      'High Visibility Vest',
    ],
    emissions: {
      standard: 'Euro 6',
      maxEmissions: 95, // g/km CO2
    },
  },
  trainingRequirements: {
    initialTraining: {
      durationHours: 40,
      modules: [
        'Luxembourg Traffic Laws',
        'Customer Service',
        'City Geography',
        'Safety Procedures',
        'Payment Systems',
        'Language Skills',
        'First Aid',
      ],
      provider: 'Luxembourg Transport Authority',
    },
    ongoingTraining: {
      frequencyMonths: 12,
      durationHours: 8,
      topics: [
        'Regulation Updates',
        'Safety Refresher',
        'Customer Service Excellence',
        'New Technology Systems',
      ],
    },
  },
};

// Mock onboarding service - replace with real implementation
export class OnboardingService {
  async createOnboarding(driverId: string, initialData: Partial<DriverOnboarding>): Promise<DriverOnboarding> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      id: `onb_${Math.random().toString(36).substr(2, 9)}`,
      status: 'incomplete',
      personalInfo: {
        name: '',
        email: '',
        phone: '',
        address: '',
        dateOfBirth: new Date(),
        nationality: '',
        languages: [],
        ...initialData.personalInfo,
      },
      documents: [],
      vehicle: {
        id: '',
        make: '',
        model: '',
        year: new Date().getFullYear(),
        licensePlate: '',
        type: 'economy',
        color: '',
        capacity: 4,
        features: [],
        inspectionDate: new Date(),
        insuranceExpiryDate: new Date(),
        ...initialData.vehicle,
      },
      training: {
        completed: false,
      },
      background: {
        checkStatus: 'pending',
      },
    };
  }

  async uploadDocument(
    driverId: string,
    type: DriverDocument['type'],
    file: File
  ): Promise<DriverDocument> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
      id: `doc_${Math.random().toString(36).substr(2, 9)}`,
      type,
      status: 'pending',
      uploadDate: new Date(),
      documentUrl: URL.createObjectURL(file),
    };
  }

  async updateVehicleDetails(
    driverId: string,
    vehicleDetails: Partial<VehicleDetails>
  ): Promise<VehicleDetails> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      id: `veh_${Math.random().toString(36).substr(2, 9)}`,
      make: '',
      model: '',
      year: new Date().getFullYear(),
      licensePlate: '',
      type: 'economy',
      color: '',
      capacity: 4,
      features: [],
      inspectionDate: new Date(),
      insuranceExpiryDate: new Date(),
      ...vehicleDetails,
    };
  }

  async submitForVerification(driverId: string): Promise<void> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  async startBackgroundCheck(driverId: string): Promise<void> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  async completeTraining(
    driverId: string,
    score: number
  ): Promise<{ passed: boolean; certificateUrl?: string }> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const passed = score >= 80;
    return {
      passed,
      certificateUrl: passed ? 'https://example.com/certificate.pdf' : undefined,
    };
  }

  async getOnboardingStatus(driverId: string): Promise<DriverOnboarding> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock data
    return {
      id: `onb_${driverId}`,
      status: 'documents_pending',
      personalInfo: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+352 123 456 789',
        address: '123 Main St, Luxembourg',
        dateOfBirth: new Date('1990-01-01'),
        nationality: 'Luxembourg',
        languages: ['English', 'French', 'German'],
      },
      documents: [
        {
          id: 'doc_1',
          type: 'license',
          status: 'approved',
          uploadDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          documentUrl: 'https://example.com/license.pdf',
        },
        {
          id: 'doc_2',
          type: 'insurance',
          status: 'pending',
          uploadDate: new Date(),
          documentUrl: 'https://example.com/insurance.pdf',
        },
      ],
      vehicle: {
        id: 'veh_1',
        make: 'Mercedes-Benz',
        model: 'E-Class',
        year: 2022,
        licensePlate: 'LU 1234',
        type: 'comfort',
        color: 'Black',
        capacity: 4,
        features: ['Leather seats', 'Climate control', 'WiFi'],
        inspectionDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        insuranceExpiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      },
      bankInfo: {
        accountHolder: 'John Doe',
        iban: 'LU12 3456 7890 1234 5678',
        bankName: 'Luxembourg Bank',
        swiftCode: 'LUXBLU22',
      },
      training: {
        completed: true,
        completionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        score: 95,
        certificateUrl: 'https://example.com/certificate.pdf',
      },
      background: {
        checkStatus: 'passed',
        checkDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        provider: 'Background Check Co.',
        referenceNumber: 'BGC123456',
      },
    };
  }

  async validateDriverDocuments(
    driverId: string,
    documents: {
      driverLicense: File;
      taxiPermit: File;
      criminalRecord: File;
      medicalCertificate: File;
      proofOfResidence: File;
      insuranceCertificate: File;
    }
  ): Promise<{
    isValid: boolean;
    validations: Record<string, { valid: boolean; message?: string }>;
  }> {
    // Mock implementation
    return {
      isValid: true,
      validations: {
        driverLicense: { valid: true },
        taxiPermit: { valid: true },
        criminalRecord: { valid: true },
        medicalCertificate: { valid: true },
        proofOfResidence: { valid: true },
        insuranceCertificate: { valid: true },
      },
    };
  }

  async validateVehicle(
    driverId: string,
    vehicleDetails: {
      make: string;
      model: string;
      year: number;
      registrationNumber: string;
      insuranceNumber: string;
      lastInspectionDate: Date;
      features: string[];
      emissions: number;
    }
  ): Promise<{
    isValid: boolean;
    validations: Record<string, { valid: boolean; message?: string }>;
  }> {
    // Mock implementation
    const currentYear = new Date().getFullYear();
    const vehicleAge = currentYear - vehicleDetails.year;

    return {
      isValid: vehicleAge <= LUXEMBOURG_DRIVER_REQUIREMENTS.vehicleRequirements.maximumAge,
      validations: {
        age: {
          valid: vehicleAge <= LUXEMBOURG_DRIVER_REQUIREMENTS.vehicleRequirements.maximumAge,
          message: vehicleAge > LUXEMBOURG_DRIVER_REQUIREMENTS.vehicleRequirements.maximumAge
            ? `Vehicle age (${vehicleAge} years) exceeds maximum allowed age (${LUXEMBOURG_DRIVER_REQUIREMENTS.vehicleRequirements.maximumAge} years)`
            : undefined,
        },
        features: {
          valid: LUXEMBOURG_DRIVER_REQUIREMENTS.vehicleRequirements.requiredFeatures.every(
            feature => vehicleDetails.features.includes(feature)
          ),
          message: 'Missing required features',
        },
        emissions: {
          valid: vehicleDetails.emissions <= LUXEMBOURG_DRIVER_REQUIREMENTS.vehicleRequirements.emissions.maxEmissions,
          message: vehicleDetails.emissions > LUXEMBOURG_DRIVER_REQUIREMENTS.vehicleRequirements.emissions.maxEmissions
            ? `Emissions (${vehicleDetails.emissions} g/km) exceed maximum allowed (${LUXEMBOURG_DRIVER_REQUIREMENTS.vehicleRequirements.emissions.maxEmissions} g/km)`
            : undefined,
        },
      },
    };
  }

  async scheduleTraining(
    driverId: string,
    trainingType: 'initial' | 'ongoing'
  ): Promise<{
    scheduled: boolean;
    trainingDetails: {
      type: string;
      date: Date;
      location: string;
      duration: number;
      modules: string[];
      trainer: string;
    };
  }> {
    // Mock implementation
    const requirements = LUXEMBOURG_DRIVER_REQUIREMENTS.trainingRequirements;
    const training = trainingType === 'initial' ? requirements.initialTraining : requirements.ongoingTraining;

    return {
      scheduled: true,
      trainingDetails: {
        type: trainingType,
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        location: 'Luxembourg Transport Authority Training Center',
        duration: training.durationHours,
        modules: trainingType === 'initial' ? training.modules : training.topics,
        trainer: 'Luxembourg Transport Authority',
      },
    };
  }
}
