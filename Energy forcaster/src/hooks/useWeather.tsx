
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { WeatherData, GeocodingResult, UnitSystem } from '../types/weatherTypes';
import { toast } from 'sonner';

// Your OpenWeatherMap API key
const API_KEY = '3ac2f3d871cc6d9218b7dd6dc9c425b2'; // Using the provided API key

// Function to get user's current location
const getCurrentLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

// Function to fetch weather data for a location using the free API endpoints
const fetchWeatherData = async (
  lat: number,
  lon: number,
  units: UnitSystem
): Promise<WeatherData> => {
  try {
    // Fetch current weather data from OpenWeatherMap API (free endpoint)
    const currentResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
    );
    
    if (!currentResponse.ok) {
      throw new Error('Failed to fetch current weather data');
    }
    
    const currentData = await currentResponse.json();
    
    // Fetch forecast data from OpenWeatherMap API (free endpoint)
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
    );
    
    if (!forecastResponse.ok) {
      throw new Error('Failed to fetch forecast data');
    }
    
    const forecastData = await forecastResponse.json();
    
    // Fetch city name from coordinates
    const geoResponse = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
    );
    
    if (!geoResponse.ok) {
      throw new Error('Failed to fetch location data');
    }
    
    const geoData = await geoResponse.json();
    const location = geoData[0] || { name: 'Unknown', country: '' };
    
    // Process and format the 5-day forecast into hourly and daily forecasts
    const hourlyForecasts = forecastData.list.slice(0, 24).map((item: any) => ({
      dt: item.dt,
      temp: item.main.temp,
      weather: {
        id: item.weather[0].id,
        main: item.weather[0].main,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
      },
      pop: item.pop * 100, // Convert probability to percentage
      wind_speed: item.wind.speed,
      wind_deg: item.wind.deg,
      clouds: item.clouds.all,
      uvi: 0, // UV index not available in the free API, estimate based on time of day and clouds
    }));
    
    // Estimate UV index based on time of day and cloud cover
    hourlyForecasts.forEach((hour: any) => {
      const date = new Date(hour.dt * 1000);
      const hourOfDay = date.getHours();
      
      // Simple UV estimation: higher during midday, lower with more clouds
      if (hourOfDay >= 10 && hourOfDay <= 16) {
        hour.uvi = Math.max(0, 8 - (hour.clouds / 25)); // Max 8 at midday with no clouds
      } else if (hourOfDay >= 7 && hourOfDay <= 19) {
        hour.uvi = Math.max(0, 4 - (hour.clouds / 50)); // Max 4 in morning/evening with no clouds
      } else {
        hour.uvi = 0; // Night time
      }
    });
    
    // Create a simplified daily forecast from the 5-day forecast data
    // Group forecasts by day and find min/max temperatures
    const dailyMap = new Map();
    
    forecastData.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const day = date.toISOString().split('T')[0];
      
      if (!dailyMap.has(day)) {
        dailyMap.set(day, {
          dt: item.dt,
          temp: {
            day: item.main.temp,
            min: item.main.temp_min,
            max: item.main.temp_max,
            night: item.main.temp,
            eve: item.main.temp,
            morn: item.main.temp,
          },
          feels_like: {
            day: item.main.feels_like,
            night: item.main.feels_like,
            eve: item.main.feels_like,
            morn: item.main.feels_like,
          },
          weather: item.weather[0],
          clouds: item.clouds.all,
          pop: item.pop * 100,
          uvi: 0, // Estimated below
          wind_speed: item.wind.speed,
          wind_deg: item.wind.deg,
          sunrise: 0, // Not available in free API
          sunset: 0, // Not available in free API
        });
      } else {
        const existing = dailyMap.get(day);
        
        // Update min/max temperatures
        existing.temp.min = Math.min(existing.temp.min, item.main.temp_min);
        existing.temp.max = Math.max(existing.temp.max, item.main.temp_max);
        
        // Update temp based on time of day
        const hour = date.getHours();
        if (hour >= 5 && hour < 12) {
          existing.temp.morn = item.main.temp;
          existing.feels_like.morn = item.main.feels_like;
        } else if (hour >= 12 && hour < 17) {
          existing.temp.day = item.main.temp;
          existing.feels_like.day = item.main.feels_like;
        } else if (hour >= 17 && hour < 22) {
          existing.temp.eve = item.main.temp;
          existing.feels_like.eve = item.main.feels_like;
        } else {
          existing.temp.night = item.main.temp;
          existing.feels_like.night = item.main.feels_like;
        }
        
        // Update other properties if needed
        if (hour >= 10 && hour <= 14) {
          // Use midday forecast for representative weather
          existing.weather = item.weather[0];
          existing.clouds = item.clouds.all;
          existing.wind_speed = item.wind.speed;
          existing.wind_deg = item.wind.deg;
        }
        
        // Estimate UV index (higher for clearer days)
        existing.uvi = Math.max(0, 8 - (existing.clouds / 25));
      }
    });
    
    const dailyForecasts = Array.from(dailyMap.values());
    
    // Format the data to match our WeatherData interface
    return {
      location: {
        name: location.name,
        country: location.country,
        lat,
        lon,
      },
      current: {
        temp: currentData.main.temp,
        feels_like: currentData.main.feels_like,
        humidity: currentData.main.humidity,
        wind_speed: currentData.wind.speed,
        wind_deg: currentData.wind.deg,
        weather: {
          id: currentData.weather[0].id,
          main: currentData.weather[0].main,
          description: currentData.weather[0].description,
          icon: currentData.weather[0].icon,
        },
        clouds: currentData.clouds.all,
        uvi: estimateUVIndex(currentData.dt, currentData.clouds.all), // Estimate UV index
        visibility: currentData.visibility,
        dt: currentData.dt,
      },
      hourly: hourlyForecasts,
      daily: dailyForecasts,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

// Helper function to estimate UV index based on time and cloud cover
const estimateUVIndex = (timestamp: number, cloudCover: number): number => {
  const date = new Date(timestamp * 1000);
  const hour = date.getHours();
  
  // Simple UV estimation based on time of day and cloud cover
  if (hour >= 10 && hour <= 16) {
    return Math.max(0, 8 - (cloudCover / 25)); // Max 8 at midday with no clouds
  } else if (hour >= 7 && hour <= 19) {
    return Math.max(0, 4 - (cloudCover / 50)); // Max 4 in morning/evening with no clouds
  } else {
    return 0; // Night time
  }
};

// Function to search for locations by name
export const searchLocations = async (query: string): Promise<GeocodingResult[]> => {
  if (!query || query.length < 2) return [];
  
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
    
    const data = await response.json();
    
    return data.map((item: any) => ({
      name: item.name,
      country: item.country,
      state: item.state,
      lat: item.lat,
      lon: item.lon,
    }));
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
};

// Custom hook for weather data
export const useWeather = () => {
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [geolocationError, setGeolocationError] = useState<string | null>(null);
  
  // Initialize with user's location if available
  useEffect(() => {
    const initLocation = async () => {
      try {
        const position = await getCurrentLocation();
        setCoordinates({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      } catch (error) {
        console.error('Error getting current location:', error);
        setGeolocationError('Unable to get your location. Please search for a location manually.');
        // Default to New York if geolocation fails
        setCoordinates({ lat: 40.7128, lon: -74.0060 });
      }
    };
    
    initLocation();
  }, []);
  
  // Fetch weather data
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['weather', coordinates?.lat, coordinates?.lon, unitSystem],
    queryFn: () => 
      coordinates 
        ? fetchWeatherData(coordinates.lat, coordinates.lon, unitSystem)
        : Promise.reject('No coordinates provided'),
    enabled: !!coordinates,
    staleTime: 1000 * 60 * 15, // 15 minutes
    refetchOnWindowFocus: false,
  });
  
  // Change location
  const changeLocation = (lat: number, lon: number) => {
    setCoordinates({ lat, lon });
  };
  
  // Toggle unit system
  const toggleUnitSystem = () => {
    setUnitSystem(prev => (prev === 'metric' ? 'imperial' : 'metric'));
  };
  
  // Handle location selection
  const handleLocationSelect = async (location: GeocodingResult) => {
    changeLocation(location.lat, location.lon);
    toast.success(`Weather data loaded for ${location.name}`);
  };
  
  return {
    weatherData: data,
    isLoading,
    isError,
    error,
    coordinates,
    unitSystem,
    geolocationError,
    changeLocation,
    toggleUnitSystem,
    handleLocationSelect,
    refetch,
    searchLocations,
  };
};
