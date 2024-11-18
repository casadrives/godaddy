import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { Apple, PlayCircle } from 'lucide-react';

export function DownloadApp() {
  const { t } = useTranslation();

  const handleAppStoreClick = () => {
    window.open('https://apps.apple.com/lu/app/luxembourg-taxi', '_blank');
  };

  const handlePlayStoreClick = () => {
    window.open('https://play.google.com/store/apps/details?id=com.luxembourgtaxi', '_blank');
  };

  return (
    <section id="download-app" className="bg-gradient-to-br from-blue-900 to-blue-700 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-white mb-6">
              {t('downloadApp.title')}
            </h2>
            <p className="text-xl text-gray-200 mb-8">
              {t('downloadApp.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAppStoreClick}
                className="group bg-black text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
                aria-label="Download from App Store"
              >
                <Apple className="h-6 w-6 mr-2" />
                App Store
              </button>
              <button
                onClick={handlePlayStoreClick}
                className="group bg-black text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
                aria-label="Download from Play Store"
              >
                <PlayCircle className="h-6 w-6 mr-2" />
                Play Store
              </button>
            </div>
            <div className="mt-8 text-gray-300">
              <p className="text-sm">
                {t('downloadApp.features')}
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-green-400 rounded-full mr-2"></span>
                  {t('downloadApp.feature1')}
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-green-400 rounded-full mr-2"></span>
                  {t('downloadApp.feature2')}
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-green-400 rounded-full mr-2"></span>
                  {t('downloadApp.feature3')}
                </li>
              </ul>
            </div>
          </div>
          <div className="relative">
            <img
              src="/images/app-preview.png"
              alt="Luxembourg Taxi App Preview"
              className="w-full max-w-md mx-auto rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute -top-4 -right-4 bg-green-500 text-white px-6 py-2 rounded-full transform rotate-12">
              {t('downloadApp.newVersion')}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}