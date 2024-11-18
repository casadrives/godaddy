import { useState, useCallback } from 'react';
import { Driver, DriverStatus, CarType, FilterState } from '../types/driver';
import { generateMockDrivers } from '../utils/mockDriverData';

export const useMockDriverService = () => {
  const [drivers, setDrivers] = useState<Driver[]>(generateMockDrivers(50));
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>(drivers);

  const applyFilters = useCallback((filters: FilterState) => {
    let result = [...drivers];

    // Apply status filter
    if (filters.status !== 'ALL') {
      result = result.filter(driver => driver.status === filters.status);
    }

    // Apply car type filter
    if (filters.carType !== 'ALL') {
      result = result.filter(driver => driver.vehicle.type === filters.carType);
    }

    // Apply city filter
    if (filters.city) {
      result = result.filter(driver => 
        driver.address.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    // Apply search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(driver => 
        driver.firstName.toLowerCase().includes(query) ||
        driver.lastName.toLowerCase().includes(query) ||
        driver.email.toLowerCase().includes(query) ||
        driver.phone.includes(query)
      );
    }

    // Apply date range
    if (filters.dateRange.start || filters.dateRange.end) {
      result = result.filter(driver => {
        const driverDate = new Date(driver.registrationDate);
        if (filters.dateRange.start && new Date(filters.dateRange.start) > driverDate) {
          return false;
        }
        if (filters.dateRange.end && new Date(filters.dateRange.end) < driverDate) {
          return false;
        }
        return true;
      });
    }

    setFilteredDrivers(result);
  }, [drivers]);

  const getDriverStatistics = useCallback(() => {
    const stats = {
      totalDrivers: filteredDrivers.length,
      statusDistribution: {
        ACTIVE: 0,
        PENDING: 0,
        SUSPENDED: 0,
      },
      carTypeDistribution: {
        ECONOMIC: 0,
        COMFORT: 0,
        LUXURY: 0,
        VAN: 0,
      },
      cityDistribution: {} as Record<string, number>,
    };

    filteredDrivers.forEach(driver => {
      // Status distribution
      stats.statusDistribution[driver.status]++;

      // Car type distribution
      stats.carTypeDistribution[driver.vehicle.type]++;

      // City distribution
      const city = driver.address.city;
      stats.cityDistribution[city] = (stats.cityDistribution[city] || 0) + 1;
    });

    return stats;
  }, [filteredDrivers]);

  const updateDriverStatus = useCallback((driverId: string, status: DriverStatus) => {
    setDrivers(prevDrivers => 
      prevDrivers.map(driver => 
        driver.id === driverId ? { ...driver, status } : driver
      )
    );
  }, []);

  const getPendingDrivers = useCallback(() => {
    return filteredDrivers.filter(driver => driver.status === 'PENDING');
  }, [filteredDrivers]);

  return {
    drivers: filteredDrivers,
    applyFilters,
    getDriverStatistics,
    updateDriverStatus,
    getPendingDrivers,
  };
};
