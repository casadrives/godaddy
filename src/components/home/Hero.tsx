import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { ArrowRight, PhoneCall } from 'lucide-react';

interface HeroProps {
  onBookRide: () => void;
}

export function Hero({ onBookRide }: HeroProps) {
  const { t } = useTranslation();

  const handleEmergencyCall = () => {
    window.location.href = 'tel:+352112';
  };

  const handleLearnMore = () => {
    document.getElementById('about')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleDownloadApp = () => {
    document.getElementById('download-app')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <div id="hero" className="relative">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=2000"
          alt="Luxembourg City at Night"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-48">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onBookRide}
              className="group bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
              aria-label="Book a Ride"
            >
              {t('hero.bookRide')}
              <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={handleLearnMore}
              className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300"
              aria-label="Learn More About Our Services"
            >
              Learn More
            </button>
            <button 
              onClick={handleDownloadApp}
              className="bg-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
              aria-label="Download Our Mobile App"
            >
              Download App
            </button>
          </div>

          {/* Emergency Call Button */}
          <button
            onClick={handleEmergencyCall}
            className="mt-6 inline-flex items-center text-white/80 hover:text-white transition-colors group"
            aria-label="Emergency Call"
          >
            <PhoneCall className="h-5 w-5 mr-2 group-hover:animate-pulse" />
            <span className="group-hover:underline">Emergency? Call Now</span>
          </button>
        </div>
      </div>

      {/* Floating Stats */}
      <div className="absolute bottom-0 right-0 mb-8 mr-8 z-20 hidden lg:block">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">500+</p>
              <p className="text-sm text-gray-200">Daily Rides</p>
            </div>
            <div className="text-center border-l border-r border-white/20 px-8">
              <p className="text-3xl font-bold text-white">4.9</p>
              <p className="text-sm text-gray-200">Rating</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">24/7</p>
              <p className="text-sm text-gray-200">Support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}