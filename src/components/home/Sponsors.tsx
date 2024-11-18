import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Shield } from 'lucide-react';

export function Sponsors() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Trophy className="h-8 w-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">Official Transport Partner</h2>
          </div>
          <p className="mt-4 text-xl text-gray-600">Proud Official Transport Partner of the BGL Football League</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="relative h-96">
              <img
                src="https://images.unsplash.com/photo-1522778526097-ce0a22ceb253?auto=format&fit=crop&q=80&w=2048"
                alt="Football Stadium"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">BGL Football League</h3>
                <p className="text-white/90">Luxembourg's Premier Football Competition</p>
              </div>
            </div>

            <div className="p-8">
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-4"
                >
                  <div className="flex-shrink-0">
                    <Shield className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Official Partnership</h4>
                    <p className="text-gray-600">Providing premium transportation services for teams, officials, and VIP guests throughout the season</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-4"
                >
                  <div className="flex-shrink-0">
                    <Star className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">VIP Match Day Service</h4>
                    <p className="text-gray-600">Exclusive transportation service for match day experiences, ensuring comfort and punctuality</p>
                  </div>
                </motion.div>

                <div className="pt-6 mt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Season 2023/2024</p>
                      <p className="text-lg font-semibold text-gray-900">Official Transport Partner</p>
                    </div>
                    <img
                      src="https://images.unsplash.com/photo-1589487391730-58f20eb2c308?auto=format&fit=crop&q=80&w=512"
                      alt="BGL League Logo"
                      className="h-16 w-16 object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}