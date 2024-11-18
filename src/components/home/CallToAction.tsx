import React from 'react';
import { Car, UserCircle, Building, Shield, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

interface CallToActionProps {
  onBookRide: () => void;
  onBecomeDriver: () => void;
  onCompanyAccess: () => void;
  onAdminAccess: () => void;
}

export function CallToAction({ onBookRide, onBecomeDriver, onCompanyAccess, onAdminAccess }: CallToActionProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white">
            <Car className="h-12 w-12 mb-6" />
            <h3 className="text-2xl font-bold mb-4">{t('cta.needRide')}</h3>
            <p className="mb-6">{t('cta.rideDesc')}</p>
            <button 
              onClick={onBookRide}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              {t('cta.bookNow')}
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white">
            <Building className="h-12 w-12 mb-6" />
            <h3 className="text-2xl font-bold mb-4">{t('cta.company')}</h3>
            <p className="mb-6">{t('cta.companyDesc')}</p>
            <button 
              onClick={onCompanyAccess}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              {t('cta.companyAccess')}
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white">
            <UserCircle className="h-12 w-12 mb-6" />
            <h3 className="text-2xl font-bold mb-4">{t('cta.driver')}</h3>
            <p className="mb-6">{t('cta.driverDesc')}</p>
            <button 
              onClick={onBecomeDriver}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              {t('cta.driverAccess')}
            </button>
          </div>
        </div>

        {/* Admin Access & Social Media */}
        <div className="mt-12 flex flex-col items-center">
          <button 
            onClick={onAdminAccess}
            className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors mb-8"
          >
            <Shield className="h-5 w-5" />
            <span>Admin Access</span>
          </button>

          <div className="flex space-x-6">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-colors"
            >
              <Facebook className="h-6 w-6" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-colors"
            >
              <Twitter className="h-6 w-6" />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-colors"
            >
              <Instagram className="h-6 w-6" />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-colors"
            >
              <Linkedin className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}