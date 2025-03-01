
import React from 'react';
import { WeatherData, UnitSystem } from '../types/weatherTypes';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Clock, 
  Sun, 
  CloudRain, 
  Compass 
} from 'lucide-react';
import { formatTemperature, formatWindSpeed, formatDate, formatTime, getWeatherIconUrl } from '../utils/weatherUtils';

interface WeatherCardProps {
  weatherData: WeatherData;
  unitSystem: UnitSystem;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weatherData, unitSystem }) => {
  const { location, current } = weatherData;
  
  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            Current Weather
          </span>
          <h2 className="text-2xl font-bold mb-1">{location.name}</h2>
          <p className="text-sm text-muted-foreground">{location.country}</p>
          <p className="text-sm text-muted-foreground">
            {formatDate(current.dt, 'long')} • {formatTime(current.dt)}
          </p>
        </div>
        
        <div className="flex flex-col items-center">
          <img 
            src={getWeatherIconUrl(current.weather.icon, true)} 
            alt={current.weather.description}
            className="w-20 h-20"
          />
          <p className="text-sm font-medium capitalize">{current.weather.description}</p>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Thermometer className="h-5 w-5 text-energy-blue-500 mr-2" />
            <span className="text-3xl font-bold">
              {formatTemperature(current.temp, unitSystem)}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            Feels like {formatTemperature(current.feels_like, unitSystem)}
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex flex-col items-center p-3 rounded-lg bg-muted/40">
            <Droplets className="h-4 w-4 text-energy-blue-500 mb-1" />
            <span className="text-sm font-medium">{current.humidity}%</span>
            <span className="text-xs text-muted-foreground">Humidity</span>
          </div>
          
          <div className="flex flex-col items-center p-3 rounded-lg bg-muted/40">
            <Wind className="h-4 w-4 text-energy-blue-500 mb-1" />
            <span className="text-sm font-medium">
              {formatWindSpeed(current.wind_speed, unitSystem)}
            </span>
            <span className="text-xs text-muted-foreground">Wind</span>
          </div>
          
          <div className="flex flex-col items-center p-3 rounded-lg bg-muted/40">
            <Compass className="h-4 w-4 text-energy-blue-500 mb-1" />
            <span className="text-sm font-medium">{current.wind_deg}°</span>
            <span className="text-xs text-muted-foreground">Direction</span>
          </div>
          
          <div className="flex flex-col items-center p-3 rounded-lg bg-muted/40">
            <Sun className="h-4 w-4 text-energy-blue-500 mb-1" />
            <span className="text-sm font-medium">{current.uvi}</span>
            <span className="text-xs text-muted-foreground">UV Index</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
