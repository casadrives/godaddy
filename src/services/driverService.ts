import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  rating: number;
  status: 'active' | 'inactive' | 'suspended';
  vehicle: {
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    type: 'economy' | 'comfort' | 'luxury';
    color: string;
  };
  totalTrips: number;
  totalEarnings: number;
  joiningDate: Date;
  lastActive: Date;
  documentsVerified: boolean;
  address: string;
  profileImage?: string;
}

interface DriverState {
  drivers: Driver[];
  addDriver: (driver: Omit<Driver, 'id'>) => void;
  updateDriver: (id: string, updates: Partial<Driver>) => void;
  deleteDriver: (id: string) => void;
  generateMockDrivers: (count: number) => void;
}

// List of economy cars for random assignment
const economyCars = [
  { make: 'Toyota', model: 'Corolla', years: [2018, 2019, 2020, 2021, 2022] },
  { make: 'Honda', model: 'Civic', years: [2018, 2019, 2020, 2021, 2022] },
  { make: 'Volkswagen', model: 'Golf', years: [2018, 2019, 2020, 2021, 2022] },
  { make: 'Hyundai', model: 'i30', years: [2018, 2019, 2020, 2021, 2022] },
  { make: 'Skoda', model: 'Octavia', years: [2018, 2019, 2020, 2021, 2022] },
  { make: 'Peugeot', model: '308', years: [2018, 2019, 2020, 2021, 2022] },
  { make: 'Renault', model: 'Megane', years: [2018, 2019, 2020, 2021, 2022] },
];

const colors = ['Black', 'White', 'Silver', 'Gray', 'Blue', 'Red'];

// Luxembourg phone number format
const generateLuxembourgPhone = () => {
  return `+352 ${faker.number.int({ min: 621, max: 699 })} ${faker.number.int({ min: 100, max: 999 })}`;
};

// Luxembourg license plate format (XX1234)
const generateLuxembourgLicensePlate = () => {
  const letters = faker.string.alpha({ length: 2, casing: 'upper' });
  const numbers = faker.number.int({ min: 1000, max: 9999 });
  return `${letters}${numbers}`;
};

// Luxembourg driver's license format (12345678)
const generateLuxembourgDriverLicense = () => {
  return faker.number.int({ min: 10000000, max: 99999999 }).toString();
};

export const useDriverStore = create<DriverState>((set) => ({
  drivers: [],
  addDriver: (driver) => {
    set((state) => ({
      drivers: [...state.drivers, { ...driver, id: uuidv4() }],
    }));
  },
  updateDriver: (id, updates) => {
    set((state) => ({
      drivers: state.drivers.map((driver) =>
        driver.id === id ? { ...driver, ...updates } : driver
      ),
    }));
  },
  deleteDriver: (id) => {
    set((state) => ({
      drivers: state.drivers.filter((driver) => driver.id !== id),
    }));
  },
  generateMockDrivers: (count) => {
    const mockDrivers: Driver[] = Array.from({ length: count }, () => {
      const randomCar = faker.helpers.arrayElement(economyCars);
      const randomYear = faker.helpers.arrayElement(randomCar.years);
      const joiningDate = faker.date.past({ years: 3 });
      const totalTrips = faker.number.int({ min: 100, max: 5000 });
      
      return {
        id: uuidv4(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phone: generateLuxembourgPhone(),
        licenseNumber: generateLuxembourgDriverLicense(),
        rating: faker.number.float({ min: 4.0, max: 5.0, precision: 0.1 }),
        status: faker.helpers.arrayElement(['active', 'inactive', 'suspended']),
        vehicle: {
          make: randomCar.make,
          model: randomCar.model,
          year: randomYear,
          licensePlate: generateLuxembourgLicensePlate(),
          type: 'economy',
          color: faker.helpers.arrayElement(colors),
        },
        totalTrips,
        totalEarnings: totalTrips * faker.number.float({ min: 15, max: 25 }),
        joiningDate,
        lastActive: faker.date.recent(),
        documentsVerified: faker.datatype.boolean(),
        address: faker.location.streetAddress({ useFullAddress: true }),
        profileImage: faker.image.avatar(),
      };
    });

    set((state) => ({
      drivers: [...state.drivers, ...mockDrivers],
    }));
  },
}));
