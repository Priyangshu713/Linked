import React, { useEffect, useState } from 'react';
import { Cloud, Sun, CloudRain, Loader2, MapPin } from 'lucide-react';
import { getCurrentWeather } from '../services/weatherApi';
import type { WeatherResponse } from '../services/weatherApi';

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);

  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
          setError(null);
        },
        (error) => {
          setError('Location access denied. Please enable location services.');
          setLoading(false);
          console.error('Error getting location:', error);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchWeather = async () => {
      if (!location) return;

      try {
        setLoading(true);
        const data = await getCurrentWeather(location.lat, location.lon);
        setWeather(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load weather data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (location) {
      fetchWeather();
      // Refresh weather data every 5 minutes
      const interval = setInterval(fetchWeather, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [location]);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return <Sun className="w-6 h-6" />;
      case 'rain':
      case 'drizzle':
        return <CloudRain className="w-6 h-6" />;
      default:
        return <Cloud className="w-6 h-6" />;
    }
  };

  if (!location) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            <p>Please enable location access to see your local weather</p>
          </div>
          <button
            onClick={requestLocationPermission}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Enable Location Access
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <p className="text-red-500 dark:text-red-400">{error || 'Weather data unavailable'}</p>
        <button
          onClick={requestLocationPermission}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {weather.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {weather.weather[0].description}
          </p>
        </div>
        <div className="flex items-center">
          {getWeatherIcon(weather.weather[0].main)}
          <span className="text-2xl font-bold ml-2 text-gray-900 dark:text-white">
            {Math.round(weather.main.temp)}°C
          </span>
        </div>
      </div>
    </div>
  );
}