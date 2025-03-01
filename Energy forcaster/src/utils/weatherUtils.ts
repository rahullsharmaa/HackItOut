
import { WeatherData, HourlyForecast, DailyForecast, EnergyForecast, UnitSystem } from '../types/weatherTypes';

// Format temperature based on unit system
export const formatTemperature = (temp: number, unitSystem: UnitSystem): string => {
  const unit = unitSystem === 'metric' ? '°C' : '°F';
  return `${Math.round(temp)}${unit}`;
};

// Format wind speed based on unit system
export const formatWindSpeed = (speed: number, unitSystem: UnitSystem): string => {
  if (unitSystem === 'metric') {
    return `${speed.toFixed(1)} m/s`;
  }
  return `${speed.toFixed(1)} mph`;
};

// Format date from Unix timestamp
export const formatDate = (timestamp: number, format: 'short' | 'long' = 'short'): string => {
  const date = new Date(timestamp * 1000);
  
  if (format === 'short') {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(date);
  }
  
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

// Format time from Unix timestamp
export const formatTime = (timestamp: number, hour12 = true): string => {
  const date = new Date(timestamp * 1000);
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12,
  }).format(date);
};

// Get weather icon URL
export const getWeatherIconUrl = (iconCode: string, large = false): string => {
  return `https://openweathermap.org/img/wn/${iconCode}${large ? '@2x' : ''}.png`;
};

// Calculate solar energy potential based on UVI and cloud cover
export const calculateSolarPotential = (uvi: number, clouds: number): number => {
  // Simple model: UVI (0-12) adjusted by cloud cover (0-100%)
  const baseOutput = (uvi / 12) * 100; // Convert UVI to percentage of max potential
  const cloudFactor = 1 - (clouds / 100); // Cloud cover reduction factor
  return Math.max(0, Math.min(100, baseOutput * cloudFactor));
};

// Calculate wind energy potential based on wind speed
export const calculateWindPotential = (windSpeed: number, unitSystem: UnitSystem): number => {
  // Convert to m/s if imperial
  const speedInMS = unitSystem === 'imperial' ? windSpeed * 0.44704 : windSpeed;
  
  // Wind turbines typically start generating at 3 m/s and reach rated capacity around 12-15 m/s
  if (speedInMS < 3) return 0;
  if (speedInMS > 25) return 0; // Cut-off speed
  
  // Simple model: Linear increase from 3 m/s to 12 m/s, then constant until 25 m/s
  if (speedInMS <= 12) {
    return ((speedInMS - 3) / 9) * 100;
  }
  return 100;
};

// Generate energy forecast from weather data
export const generateEnergyForecast = (
  hourlyForecasts: HourlyForecast[],
  unitSystem: UnitSystem,
  hours: number = 24
): EnergyForecast => {
  const forecasts = hourlyForecasts.slice(0, hours);
  
  const solar = forecasts.map(hour => 
    calculateSolarPotential(hour.uvi, hour.clouds)
  );
  
  const wind = forecasts.map(hour => 
    calculateWindPotential(hour.wind_speed, unitSystem)
  );
  
  const labels = forecasts.map(hour => 
    formatTime(hour.dt)
  );
  
  return { solar, wind, labels };
};
