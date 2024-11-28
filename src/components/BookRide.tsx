import React, { useState } from 'react';
import { MapPin, Navigation, Clock, User, Search, CreditCard, Banknote, Users, Calendar, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DriverTrackingModal } from './tracking/DriverTrackingModal';
import { useGeolocation } from '../hooks/useGeolocation';
import { rideService, RideOffer, RideRequest } from '../services/rideService';
import { format } from 'date-fns';

export function BookRide() {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [notes, setNotes] = useState('');
  const [scheduledTime, setScheduledTime] = useState<Date | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('card');
  const [showDrivers, setShowDrivers] = useState(false);
  const [availableDrivers, setAvailableDrivers] = useState<RideOffer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<RideOffer | null>(null);
  const [showTracking, setShowTracking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { formatAmount } = useApp();
  const { location, error: locationError } = useGeolocation();

  const handleUseCurrentLocation = async () => {
    if (location) {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${location.longitude},${location.latitude}.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`
        );
        const data = await response.json();
        const address = data.features[0]?.place_name;
        if (address) {
          setPickup(address);
        }
      } catch (error) {
        console.error('Error getting address:', error);
        setError('Failed to get current location address. Please check your network connection or try again later.');
      }
    }
  };

  const handleSearchDrivers = async () => {
    if (!pickup || !dropoff) return;
    
    setIsLoading(true);
    setError('');
    setShowDrivers(false);
    setAvailableDrivers([]);

    try {
      const request: RideRequest = {
        pickup: {
          address: pickup,
          coordinates: [6.13, 49.61], // Demo coordinates
        },
        dropoff: {
          address: dropoff,
          coordinates: [6.14, 49.62], // Demo coordinates
        },
        passengers,
        notes,
        scheduledTime: scheduledTime || undefined,
        paymentMethod,
      };

      const offers = await rideService.searchDrivers(request);
      setAvailableDrivers(offers);
      setShowDrivers(true);
    } catch (err) {
      setError('Failed to find available drivers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOffer = (offer: RideOffer) => {
    setSelectedOffer(offer);
  };

  const handleBooking = async () => {
    if (!selectedOffer) return;
    
    setIsLoading(true);
    setError('');

    try {
      const request: RideRequest = {
        pickup: {
          address: pickup,
          coordinates: [6.13, 49.61], // Demo coordinates
        },
        dropoff: {
          address: dropoff,
          coordinates: [6.14, 49.62], // Demo coordinates
        },
        passengers,
        notes,
        scheduledTime: scheduledTime || undefined,
        paymentMethod,
      };

      await rideService.requestRide(request, selectedOffer);
      setShowTracking(true);
    } catch (err) {
      setError('Failed to book ride. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="space-y-6">
        {/* Pickup Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pickup Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 h-5 w-5" />
            <input
              type="text"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="Enter pickup location"
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleUseCurrentLocation}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700"
              title="Use current location"
            >
              <Navigation className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Dropoff Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dropoff Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500 h-5 w-5" />
            <input
              type="text"
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
              placeholder="Enter destination"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Additional Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Number of Passengers */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Passengers
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                {[1, 2, 3, 4].map(num => (
                  <option key={num} value={num}>{num} passenger{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Scheduled Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Schedule For Later
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="datetime-local"
                min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) => setScheduledTime(e.target.value ? new Date(e.target.value) : null)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes for Driver (Optional)
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special instructions..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
            />
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`flex items-center justify-center px-4 py-3 rounded-lg border ${
                paymentMethod === 'card'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <CreditCard className="h-5 w-5 mr-2" />
              Card
            </button>
            <button
              onClick={() => setPaymentMethod('cash')}
              className={`flex items-center justify-center px-4 py-3 rounded-lg border ${
                paymentMethod === 'cash'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Banknote className="h-5 w-5 mr-2" />
              Cash
            </button>
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm p-3 bg-red-50 rounded-lg border border-red-100">
            {error}
          </div>
        )}

        {!showDrivers && (
          <button
            onClick={handleSearchDrivers}
            disabled={!pickup || !dropoff || isLoading}
            className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              'Searching...'
            ) : (
              <>
                <Search className="h-5 w-5 mr-2" />
                Find Drivers
              </>
            )}
          </button>
        )}

        {showDrivers && availableDrivers.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Available Drivers</h3>
            <div className="space-y-4">
              {availableDrivers.map((offer) => (
                <div
                  key={offer.driver.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedOffer?.driver.id === offer.driver.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'hover:border-gray-400'
                  }`}
                  onClick={() => handleSelectOffer(offer)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{offer.driver.name}</h4>
                        <div className="text-sm text-gray-500">
                          {offer.driver.vehicle.make} {offer.driver.vehicle.model} • {offer.driver.vehicle.color}
                        </div>
                        <div className="flex items-center mt-1">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1 text-sm">{offer.driver.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-blue-600">
                        {formatAmount(offer.price)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {offer.estimatedTime} min
                      </div>
                      {offer.surge > 1 && (
                        <div className="text-xs text-orange-600 mt-1">
                          {(offer.surge * 100 - 100).toFixed(0)}% surge pricing
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedOffer && (
              <button
                onClick={handleBooking}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed mt-4 flex items-center justify-center"
              >
                {isLoading ? (
                  'Requesting Ride...'
                ) : (
                  `Book ${selectedOffer.driver.name}`
                )}
              </button>
            )}
          </div>
        )}

        {showDrivers && availableDrivers.length === 0 && !isLoading && (
          <div className="text-center py-8 text-gray-500">
            No drivers available at the moment. Please try again later.
          </div>
        )}
      </div>

      {selectedOffer && showTracking && (
        <DriverTrackingModal
          isOpen={showTracking}
          onClose={() => setShowTracking(false)}
          driver={selectedOffer.driver}
          ride={{
            pickup: {
              address: pickup,
              coordinates: [6.13, 49.61]
            },
            dropoff: {
              address: dropoff,
              coordinates: [6.14, 49.62]
            },
            estimatedTime: selectedOffer.estimatedTime,
            distance: selectedOffer.distance,
            amount: selectedOffer.price
          }}
        />
      )}
    </div>
  );
}