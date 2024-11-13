import React from 'react';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

export function Reviews() {
  const reviews = [
    {
      id: 1,
      name: 'Sophie Martin',
      role: 'Business Executive',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
      content: 'Excellent service! The driver was professional and punctual. Perfect for business travel in Luxembourg.',
      rating: 5
    },
    {
      id: 2,
      name: 'Jean Dupont',
      role: 'Frequent Traveler',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256',
      content: 'Regular user of CasaDrive for airport transfers. Always reliable and comfortable.',
      rating: 5
    },
    {
      id: 3,
      name: 'Marie Weber',
      role: 'Hotel Manager',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=256',
      content: 'Our hotel guests love CasaDrive. Top-notch service and professional drivers.',
      rating: 5
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">What Our Clients Say</h2>
          <p className="mt-4 text-xl text-gray-600">Trusted by business professionals and travelers across Luxembourg</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg p-8 relative"
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-blue-100" />
              
              <div className="flex items-center mb-6">
                <img
                  src={review.image}
                  alt={review.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">{review.name}</h3>
                  <p className="text-sm text-gray-500">{review.role}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-gray-600">{review.content}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 text-blue-600">
            <span className="font-semibold">4.9</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-gray-500">from 500+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
}