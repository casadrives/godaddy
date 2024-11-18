import React, { useState } from 'react';
import { MapPin, Navigation2, Clock, User, Search, Loader2 } from 'lucide-react';
import { useLocationSearch } from '../hooks/useLocationSearch';
import { useGeolocation } from '../hooks/useGeolocation';
import { LocationMap } from './LocationMap';
import { rideService, type Driver, type RideRequest } from '../services/rideService';
import { useStore } from '../store/useStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';

interface LocationInputProps {
  label: string;
  value: string;
  onChange: (value: string, coordinates?: [number, number]) => void;
  icon: React.ReactNode;
  placeholder: string;
  suggestions: Array<{ place_name: string; center: [number, number] }>;
  isLoading: boolean;
  onUseCurrentLocation?: () => void;
}

const LocationInput: React.FC<LocationInputProps> = ({
  label,
  value,
  onChange,
  icon,
  placeholder,
  suggestions,
  isLoading,
  onUseCurrentLocation,
}) => (
  <div className="relative">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        {icon}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
      />
      {onUseCurrentLocation && (
        <button
          onClick={onUseCurrentLocation}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700"
        >
          <Navigation2 className="h-5 w-5" />
        </button>
      )}
    </div>
    
    {/* Suggestions dropdown */}
    <AnimatePresence>
      {(suggestions.length > 0 || isLoading) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200"
        >
          {isLoading ? (
            <div className="p-4 flex items-center justify-center text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Searching...
            </div>
          ) : (
            suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                onClick={() => onChange(suggestion.place_name, suggestion.center)}
              >
                {suggestion.place_name}
              </button>
            ))
          )}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

interface BookRideProps {
  onSubmit: (request: RideRequest) => void;
}

interface Location {
  address: string;
  coordinates: [number, number] | null;
}

export function BookRide({ onSubmit }: BookRideProps) {
  // State
  const [pickup, setPickup] = useState<Location>({ address: '', coordinates: null });
  const [dropoff, setDropoff] = useState<Location>({ address: '', coordinates: null });
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const { currentBooking, setCurrentBooking } = useStore();
  
  // Hooks
  const { location } = useGeolocation();
  const pickupSearch = useLocationSearch();
  const dropoffSearch = useLocationSearch();

  // Mutations
  const searchDriversMutation = useMutation({
    mutationFn: async (request: Omit<RideRequest, 'driverId'>) => {
      const drivers = await rideService.searchNearbyDrivers(request);
      return drivers;
    },
  });

  const requestRideMutation = useMutation({
    mutationFn: (request: RideRequest) => rideService.requestRide(request),
  });

  // Price estimation
  const { data: priceEstimate } = useQuery({
    queryKey: ['priceEstimate', pickup.coordinates, dropoff.coordinates],
    queryFn: () =>
      pickup.coordinates && dropoff.coordinates
        ? rideService.estimatePrice({
            pickupLocation: {
              address: pickup.address,
              coordinates: pickup.coordinates,
            },
            dropoffLocation: {
              address: dropoff.address,
              coordinates: dropoff.coordinates,
            },
          })
        : Promise.resolve(null),
    enabled: !!(pickup.coordinates && dropoff.coordinates),
  });

  // Handlers
  const handleUseCurrentLocation = async () => {
    if (location) {
      const address = await pickupSearch.reverseGeocode([
        location.longitude,
        location.latitude,
      ]);
      if (address) {
        setPickup({
          address,
          coordinates: [location.longitude, location.latitude],
        });
      }
    }
  };

  const handleSearchDrivers = async () => {
    if (!pickup.coordinates || !dropoff.coordinates) return;

    try {
      const drivers = await searchDriversMutation.mutateAsync({
        pickupLocation: {
          address: pickup.address,
          coordinates: pickup.coordinates,
        },
        dropoffLocation: {
          address: dropoff.address,
          coordinates: dropoff.coordinates,
        },
      });

      if (drivers && drivers.length === 0) {
        // Show no drivers available message
        console.log('No drivers available');
      }
    } catch (error) {
      console.error('Error searching for drivers:', error);
    }
  };

  const handleBookRide = async () => {
    if (!selectedDriver || !pickup.coordinates || !dropoff.coordinates) return;

    const request: RideRequest = {
      driverId: selectedDriver.id,
      pickupLocation: {
        address: pickup.address,
        coordinates: pickup.coordinates,
      },
      dropoffLocation: {
        address: dropoff.address,
        coordinates: dropoff.coordinates,
      },
    };

    try {
      await onSubmit(request);
      // Reset form
      setPickup({ address: '', coordinates: null });
      setDropoff({ address: '', coordinates: null });
      setSelectedDriver(null);
    } catch (error) {
      console.error('Error booking ride:', error);
    }
  };

  // Map markers
  const markers = [
    ...(pickup.coordinates ? [{ coordinates: pickup.coordinates, type: 'pickup' as const }] : []),
    ...(dropoff.coordinates ? [{ coordinates: dropoff.coordinates, type: 'dropoff' as const }] : []),
    ...(selectedDriver?.location ? [{ coordinates: selectedDriver.location.coordinates, type: 'driver' as const }] : []),
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="space-y-6">
        <LocationInput
          label="Pickup Location"
          value={pickup.address}
          onChange={(address, coordinates) =>
            setPickup({ address, coordinates: coordinates || null })
          }
          icon={<MapPin className="h-5 w-5" />}
          placeholder="Enter pickup location"
          suggestions={pickupSearch.suggestions}
          isLoading={pickupSearch.isLoading}
          onUseCurrentLocation={handleUseCurrentLocation}
        />

        <LocationInput
          label="Dropoff Location"
          value={dropoff.address}
          onChange={(address, coordinates) =>
            setDropoff({ address, coordinates: coordinates || null })
          }
          icon={<MapPin className="h-5 w-5" />}
          placeholder="Enter dropoff location"
          suggestions={dropoffSearch.suggestions}
          isLoading={dropoffSearch.isLoading}
        />

        {pickup.coordinates && dropoff.coordinates && (
          <div className="h-64 relative rounded-lg overflow-hidden">
            <LocationMap markers={markers} />
          </div>
        )}

        {priceEstimate && (
          <div className="text-lg font-semibold text-gray-900">
            Estimated Price: ${priceEstimate.toFixed(2)}
          </div>
        )}

        {searchDriversMutation.data?.map((driver) => (
          <div
            key={driver.id}
            className={`p-4 border rounded-lg cursor-pointer ${
              selectedDriver?.id === driver.id ? 'border-blue-500' : 'border-gray-200'
            }`}
            onClick={() => setSelectedDriver(driver)}
          >
            <div className="flex items-center">
              <div className="flex-1">
                <h3 className="font-semibold">{driver.name}</h3>
                <p className="text-sm text-gray-500">{driver.vehicleInfo?.model}</p>
              </div>
              <div className="text-right">
                <div className="font-semibold">{driver.rating}⭐</div>
                <div className="text-sm text-gray-500">{driver.totalRides} rides</div>
              </div>
            </div>
          </div>
        ))}

        <div className="flex space-x-4">
          <button
            onClick={handleSearchDrivers}
            disabled={!pickup.coordinates || !dropoff.coordinates}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
          >
            {searchDriversMutation.isPending ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Searching...
              </div>
            ) : (
              'Search Drivers'
            )}
          </button>

          {selectedDriver && (
            <button
              onClick={handleBookRide}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              {requestRideMutation.isPending ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Booking...
                </div>
              ) : (
                'Book Ride'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}