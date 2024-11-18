import { Driver } from '../types/driver';

export const exportToCSV = (drivers: Driver[]): void => {
  const headers = [
    'ID',
    'First Name',
    'Last Name',
    'Email',
    'Phone',
    'Status',
    'Registration Date',
    'City',
    'Vehicle Type',
    'Vehicle Make',
    'Vehicle Model',
    'License Plate',
  ];

  const rows = drivers.map((driver) => [
    driver.id,
    driver.firstName,
    driver.lastName,
    driver.email,
    driver.phone,
    driver.status,
    driver.registrationDate,
    driver.address.city,
    driver.vehicle.type,
    driver.vehicle.make,
    driver.vehicle.model,
    driver.vehicle.licensePlate,
  ]);

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `drivers_export_${new Date().toISOString()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (drivers: Driver[]): void => {
  const jsonString = JSON.stringify(drivers, null, 2);
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(jsonString);
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute(
    'download',
    `drivers_export_${new Date().toISOString()}.json`
  );
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

export const generateDriverReport = (drivers: Driver[]) => {
  const stats = {
    total: drivers.length,
    statusDistribution: {} as Record<string, number>,
    vehicleTypes: {} as Record<string, number>,
    cityCoverage: {} as Record<string, number>,
    averageVehicleAge: 0,
    documentsVerificationRate: 0,
  };

  let totalVehicleAge = 0;
  let totalVerifiedDocuments = 0;
  let totalDocuments = 0;

  drivers.forEach((driver) => {
    // Status distribution
    stats.statusDistribution[driver.status] = (stats.statusDistribution[driver.status] || 0) + 1;

    // Vehicle types
    stats.vehicleTypes[driver.vehicle.type] = (stats.vehicleTypes[driver.vehicle.type] || 0) + 1;

    // City coverage
    stats.cityCoverage[driver.address.city] = (stats.cityCoverage[driver.address.city] || 0) + 1;

    // Vehicle age
    const vehicleAge = new Date().getFullYear() - driver.vehicle.year;
    totalVehicleAge += vehicleAge;

    // Document verification rate
    Object.values(driver.documents).forEach((doc) => {
      totalDocuments++;
      if (doc.verified) {
        totalVerifiedDocuments++;
      }
    });
  });

  stats.averageVehicleAge = totalVehicleAge / drivers.length;
  stats.documentsVerificationRate = (totalVerifiedDocuments / totalDocuments) * 100;

  return stats;
};
