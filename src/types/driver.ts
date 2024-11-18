export enum CarType {
  ECONOMIC = 'economic',
  COMFORT = 'comfort',
  LUXURY = 'luxury',
  VAN = 'van'
}

export enum DriverStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  OFFLINE = 'offline',
  ONLINE = 'online',
  BUSY = 'busy'
}

export interface Vehicle {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  type: CarType;
  color: string;
}

export interface DriverDocuments {
  driverLicense: boolean;
  insurance: boolean;
  registration: boolean;
  photo: boolean;
}

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  licenseNumber: string;
  avatar?: string;
  vehicle: Vehicle;
  status: DriverStatus;
  createdAt: string;
  documents: DriverDocuments;
  rating: number;
  totalRides: number;
  totalEarnings?: number;
  availableForDuty: boolean;
}