import { Driver, CarType, DriverStatus } from '../types/driver';

const economicCars = [
  { make: 'Toyota', model: 'Corolla', year: 2020 },
  { make: 'Honda', model: 'Civic', year: 2021 },
  { make: 'Volkswagen', model: 'Golf', year: 2019 },
  { make: 'Hyundai', model: 'Elantra', year: 2020 },
  { make: 'Skoda', model: 'Octavia', year: 2021 },
  { make: 'Peugeot', model: '308', year: 2020 },
  { make: 'Renault', model: 'Megane', year: 2021 },
  { make: 'Ford', model: 'Focus', year: 2020 },
  { make: 'Opel', model: 'Astra', year: 2019 },
  { make: 'Seat', model: 'Leon', year: 2021 }
];

const luxembourgCities = [
  'Luxembourg City', 'Esch-sur-Alzette', 'Differdange', 
  'Dudelange', 'Ettelbruck', 'Diekirch', 'Wiltz',
  'Echternach', 'Remich', 'Mersch'
];

const generatePhoneNumber = () => {
  return `+352 ${Math.floor(Math.random() * 900000 + 100000)}`;
};

const generateLicensePlate = () => {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const letter1 = letters[Math.floor(Math.random() * letters.length)];
  const letter2 = letters[Math.floor(Math.random() * letters.length)];
  const numbers = Math.floor(Math.random() * 9000 + 1000);
  return `${letter1}${letter2} ${numbers}`;
};

const generateEmail = (firstName: string, lastName: string) => {
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
};

export const generateMockDrivers = (count: number): Driver[] => {
  const drivers: Driver[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = `Driver${i + 1}`;
    const lastName = `LastName${i + 1}`;
    const randomCar = economicCars[Math.floor(Math.random() * economicCars.length)];
    const randomCity = luxembourgCities[Math.floor(Math.random() * luxembourgCities.length)];

    drivers.push({
      id: `DRV${(i + 1).toString().padStart(3, '0')}`,
      firstName,
      lastName,
      email: generateEmail(firstName, lastName),
      phone: generatePhoneNumber(),
      address: `${Math.floor(Math.random() * 100 + 1)} Rue de ${randomCity}`,
      city: randomCity,
      country: 'Luxembourg',
      licenseNumber: `LUX${Math.floor(Math.random() * 900000 + 100000)}`,
      vehicle: {
        make: randomCar.make,
        model: randomCar.model,
        year: randomCar.year,
        licensePlate: generateLicensePlate(),
        type: CarType.ECONOMIC,
        color: ['White', 'Black', 'Silver', 'Grey'][Math.floor(Math.random() * 4)],
      },
      status: DriverStatus.PENDING,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      documents: {
        driverLicense: true,
        insurance: true,
        registration: true,
        photo: true,
      },
      rating: 0,
      totalRides: 0,
      availableForDuty: false,
    });
  }

  return drivers;
};
