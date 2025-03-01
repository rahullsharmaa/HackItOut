
import React from 'react';
import { useWeather } from '../hooks/useWeather';
import NavBar from '../components/NavBar';
import LocationSearch from '../components/LocationSearch';
import WeatherCard from '../components/WeatherCard';
import UnitToggle from '../components/UnitToggle';
import ForecastChart from '../components/ForecastChart';
import EnergyMetrics from '../components/EnergyMetrics';
import { generateEnergyForecast } from '../utils/weatherUtils';
import { Loader2, RefreshCw, Cloud, Wind, Sun, Thermometer, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const {
    weatherData,
    isLoading,
    isError,
    error,
    unitSystem,
    geolocationError,
    toggleUnitSystem,
    handleLocationSelect,
    refetch,
    searchLocations,
  } = useWeather();

  const handleRefresh = () => {
    refetch();
    toast.success('Weather data refreshed');
  };

  // Generate energy forecast if weather data is available
  const energyForecast = weatherData
    ? generateEnergyForecast(weatherData.hourly, unitSystem)
    : { solar: [], wind: [], labels: [] };

  return (
    <>
      <NavBar />
      <main className="min-h-screen pt-20 pb-16 px-4 md:px-6">
        <div className="container max-w-7xl mx-auto space-y-12">
          {/* Hero Section */}
          <section id="about" className="py-12 md:py-16">
            <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
              <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
                <Cloud className="h-5 w-5 text-primary mr-2" />
                <span className="text-sm font-medium">Renewable Energy Forecast</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Smart Weather Insights for{' '}
                <span className="text-primary">Renewable Energy</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Real-time weather data and forecasting to help you optimize your renewable energy usage 
                and make informed decisions for a sustainable future.
              </p>
              
              <div className="pt-4">
                <LocationSearch
                  onLocationSelect={handleLocationSelect}
                  searchLocations={searchLocations}
                  isLoading={isLoading}
                />
                {geolocationError && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {geolocationError}
                  </p>
                )}
              </div>
            </div>
          </section>
          
          {/* Current Weather Section */}
          <section className="space-y-6" id="forecast">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Weather Forecast</h2>
                <p className="text-muted-foreground">Current weather conditions and forecast</p>
              </div>
              
              <div className="flex items-center gap-4">
                <UnitToggle unitSystem={unitSystem} toggleUnitSystem={toggleUnitSystem} />
                
                <button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted/60 hover:bg-muted transition-colors text-sm font-medium"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <h3 className="text-xl font-medium">Loading weather data...</h3>
                <p className="text-muted-foreground mt-2">Fetching the latest weather information</p>
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
                <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
                <h3 className="text-xl font-medium">Failed to load weather data</h3>
                <p className="text-muted-foreground mt-2">
                  {error instanceof Error 
                    ? error.message 
                    : 'Please check your connection and try again'}
                </p>
                <button
                  onClick={handleRefresh}
                  className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : weatherData ? (
              <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
                <WeatherCard weatherData={weatherData} unitSystem={unitSystem} />
                
                <div className="glass-card p-6 lg:col-span-2">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-muted-foreground">
                        24-Hour Forecast
                      </span>
                      <h3 className="text-xl font-bold">Hourly Breakdown</h3>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-energy-blue-100 rounded-full">
                        <Thermometer className="h-4 w-4 text-energy-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Temperature</p>
                        <p className="font-medium">
                          {weatherData.daily[0].temp.max.toFixed(1)}°
                          <span className="text-muted-foreground text-xs"> high</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-energy-blue-100 rounded-full">
                        <Cloud className="h-4 w-4 text-energy-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Cloud Cover</p>
                        <p className="font-medium">
                          {weatherData.current.clouds}
                          <span className="text-muted-foreground text-xs">%</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-energy-blue-100 rounded-full">
                        <Wind className="h-4 w-4 text-energy-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Wind</p>
                        <p className="font-medium">
                          {unitSystem === 'metric' 
                            ? `${weatherData.current.wind_speed.toFixed(1)} m/s` 
                            : `${weatherData.current.wind_speed.toFixed(1)} mph`
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-energy-blue-100 rounded-full">
                        <Sun className="h-4 w-4 text-energy-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">UV Index</p>
                        <p className="font-medium">
                          {weatherData.current.uvi.toFixed(1)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="overflow-hidden">
                    {weatherData.hourly.length > 0 && (
                      <div className="flex gap-4 pb-2 overflow-x-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                        {weatherData.hourly.slice(0, 12).map((hour, index) => (
                          <div 
                            key={hour.dt} 
                            className="flex flex-col items-center min-w-[60px] p-2 rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <span className="text-xs text-muted-foreground">
                              {index === 0 ? 'Now' : new Date(hour.dt * 1000).getHours() + ':00'}
                            </span>
                            <img 
                              src={`https://openweathermap.org/img/wn/${hour.weather.icon}.png`} 
                              alt={hour.weather.description}
                              className="w-8 h-8 my-1"
                            />
                            <span className="font-medium text-sm">
                              {hour.temp.toFixed(0)}°
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </section>
          
          {/* Energy Forecast Section */}
          {weatherData && (
            <section className="space-y-6" id="energy">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Energy Forecast</h2>
                <p className="text-muted-foreground">
                  Renewable energy potential based on weather conditions
                </p>
              </div>
              
              <div className="glass-card p-6">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      Next 24 Hours
                    </span>
                    <h3 className="text-xl font-bold">Energy Production Potential</h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-energy-green-500"></div>
                      <span className="text-sm">Solar</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-energy-blue-500"></div>
                      <span className="text-sm">Wind</span>
                    </div>
                  </div>
                </div>
                
                <ForecastChart forecast={energyForecast} />
              </div>
              
              <EnergyMetrics forecast={energyForecast} />
            </section>
          )}
        </div>
      </main>
      
      <footer className="glass py-8 border-t border-border/50">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="bg-gradient-to-br from-energy-green-500 to-energy-blue-500 rounded-md p-1 flex items-center justify-center">
                <Cloud className="text-white h-4 w-4" />
              </div>
              <span className="font-medium">EnergyForecast</span>
            </div>
            
            <div className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} EnergyForecast. Weather data provided by OpenWeatherMap.
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Index;
