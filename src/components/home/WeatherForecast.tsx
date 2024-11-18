import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Wind, Droplets, ThermometerSun, ThermometerSnowflake } from 'lucide-react';

interface WeatherData {
  current: {
    temp: number;
    humidity: number;
    windSpeed: number;
    description: string;
    icon: string;
  };
  daily: Array<{
    date: string;
    temp: {
      min: number;
      max: number;
    };
    description: string;
    icon: string;
  }>;
}

export function WeatherForecast() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production, this would be a real API call
    // For demo, using mock data
    const mockWeather: WeatherData = {
      current: {
        temp: 18,
        humidity: 65,
        windSpeed: 12,
        description: 'Partly cloudy',
        icon: 'cloudy'
      },
      daily: [
        {
          date: new Date().toISOString(),
          temp: { min: 14, max: 22 },
          description: 'Partly cloudy',
          icon: 'cloudy'
        },
        {
          date: new Date(Date.now() + 86400000).toISOString(),
          temp: { min: 13, max: 20 },
          description: 'Light rain',
          icon: 'rain'
        },
        {
          date: new Date(Date.now() + 172800000).toISOString(),
          temp: { min: 12, max: 19 },
          description: 'Sunny',
          icon: 'sunny'
        },
        {
          date: new Date(Date.now() + 259200000).toISOString(),
          temp: { min: 11, max: 18 },
          description: 'Cloudy',
          icon: 'cloudy'
        },
        {
          date: new Date(Date.now() + 345600000).toISOString(),
          temp: { min: 13, max: 21 },
          description: 'Partly cloudy',
          icon: 'cloudy'
        }
      ]
    };

    setTimeout(() => {
      setWeather(mockWeather);
      setLoading(false);
    }, 1000);
  }, []);

  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case 'sunny':
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'rain':
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      case 'snow':
        return <CloudSnow className="h-8 w-8 text-blue-300" />;
      case 'thunder':
        return <CloudLightning className="h-8 w-8 text-yellow-600" />;
      case 'cloudy':
      default:
        return <Cloud className="h-8 w-8 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
        <div className="h-24 w-full bg-gray-200 rounded mb-4"></div>
        <div className="grid grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Luxembourg Weather</h2>
      
      {/* Current Weather */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-4xl font-bold">{weather.current.temp}°C</div>
            <div className="text-lg mt-1">{weather.current.description}</div>
          </div>
          <div className="text-6xl">
            {getWeatherIcon(weather.current.icon)}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="flex items-center">
            <Wind className="h-5 w-5 mr-2" />
            <span>{weather.current.windSpeed} km/h</span>
          </div>
          <div className="flex items-center">
            <Droplets className="h-5 w-5 mr-2" />
            <span>{weather.current.humidity}%</span>
          </div>
          <div className="flex items-center">
            <ThermometerSun className="h-5 w-5 mr-2" />
            <span>Feels like {weather.current.temp + 2}°C</span>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div className="grid grid-cols-5 gap-4">
        {weather.daily.map((day, index) => (
          <div 
            key={index}
            className="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-colors"
          >
            <div className="text-sm font-medium text-gray-500 mb-2">
              {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            <div className="flex justify-center mb-2">
              {getWeatherIcon(day.icon)}
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm">
              <span className="flex items-center">
                <ThermometerSun className="h-4 w-4 text-red-500 mr-1" />
                {day.temp.max}°
              </span>
              <span className="text-gray-300">|</span>
              <span className="flex items-center">
                <ThermometerSnowflake className="h-4 w-4 text-blue-500 mr-1" />
                {day.temp.min}°
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center text-sm text-gray-500">
        Weather data for Luxembourg City, Luxembourg
      </div>
    </div>
  );
}