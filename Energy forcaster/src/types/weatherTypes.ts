
export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    wind_deg: number;
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    };
    clouds: number;
    uvi: number;
    visibility: number;
    dt: number;
  };
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

export interface HourlyForecast {
  dt: number;
  temp: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
  pop: number; // Probability of precipitation
  wind_speed: number;
  wind_deg: number;
  clouds: number;
  uvi: number;
}

export interface DailyForecast {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
  };
  feels_like: {
    day: number;
    night: number;
    eve: number;
    morn: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
  clouds: number;
  pop: number;
  rain?: number;
  uvi: number;
  wind_speed: number;
  wind_deg: number;
}

export interface EnergyForecast {
  solar: number[];
  wind: number[];
  labels: string[];
}

export interface GeocodingResult {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export type UnitSystem = 'metric' | 'imperial';
