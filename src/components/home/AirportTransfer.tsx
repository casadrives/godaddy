import React, { useState } from 'react';
import { Plane, Car, Clock, Shield, Check, ArrowRight, Calendar, MapPin, Users } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { motion } from 'framer-motion';

export function AirportTransfer() {
  const { t } = useTranslation();
  const [bookingData, setBookingData] = useState({
    type: 'arrival',
    date: '',
    time: '',
    passengers: '1',
    flightNumber: '',
    pickupLocation: '',
    dropoffLocation: '',
  });

  const features = [
    {
      icon: Clock,
      title: t('airport.feature1.title'),
      description: t('airport.feature1.desc')
    },
    {
      icon: Shield,
      title: t('airport.feature2.title'),
      description: t('airport.feature2.desc')
    },
    {
      icon: Car,
      title: t('airport.feature3.title'),
      description: t('airport.feature3.desc')
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle booking submission
    console.log('Booking data:', bookingData);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=2048"
          alt="Luxembourg Airport"
          className="w-full h-full object-cover opacity-5"
        />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center space-x-3 mb-4"
          >
            <Plane className="h-10 w-10 text-blue-600" />
            <h2 className="text-4xl font-bold text-gray-900">{t('airport.title')}</h2>
          </motion.div>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            {t('airport.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Booking Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h3 className="text-2xl font-bold mb-6">Book Your Transfer</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="radio"
                    name="type"
                    value="arrival"
                    checked={bookingData.type === 'arrival'}
                    onChange={(e) => setBookingData({ ...bookingData, type: e.target.value })}
                    className="text-blue-600"
                  />
                  <span>Airport Arrival</span>
                </label>
                <label className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="radio"
                    name="type"
                    value="departure"
                    checked={bookingData.type === 'departure'}
                    onChange={(e) => setBookingData({ ...bookingData, type: e.target.value })}
                    className="text-blue-600"
                  />
                  <span>Airport Departure</span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="date"
                      value={bookingData.date}
                      onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                      className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="time"
                      value={bookingData.time}
                      onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                      className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Flight Number</label>
                  <div className="relative">
                    <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      value={bookingData.flightNumber}
                      onChange={(e) => setBookingData({ ...bookingData, flightNumber: e.target.value })}
                      placeholder="e.g., LH1234"
                      className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <select
                      value={bookingData.passengers}
                      onChange={(e) => setBookingData({ ...bookingData, passengers: e.target.value })}
                      className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'passenger' : 'passengers'}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {bookingData.type === 'arrival' ? 'Dropoff Location' : 'Pickup Location'}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={bookingData.type === 'arrival' ? bookingData.dropoffLocation : bookingData.pickupLocation}
                    onChange={(e) => setBookingData(bookingData.type === 'arrival' 
                      ? { ...bookingData, dropoffLocation: e.target.value }
                      : { ...bookingData, pickupLocation: e.target.value }
                    )}
                    placeholder="Enter address"
                    className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white rounded-xl px-8 py-4 font-semibold text-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                Book Transfer
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </form>
          </motion.div>

          {/* Pricing and Features */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-xl"
            >
              <h3 className="text-2xl font-bold mb-6">{t('airport.pricing.title')}</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Check className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <p className="font-medium text-lg">{t('airport.pricing.city')}</p>
                    <p className="text-sm text-gray-600">Fixed rate, no hidden fees</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <p className="font-medium text-lg">{t('airport.pricing.kirchberg')}</p>
                    <p className="text-sm text-gray-600">Business district transfer</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <p className="font-medium text-lg">{t('airport.pricing.waiting')}</p>
                    <p className="text-sm text-gray-600">Flight monitoring included</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <p className="font-medium text-lg">{t('airport.pricing.cancellation')}</p>
                    <p className="text-sm text-gray-600">Flexible booking policy</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}