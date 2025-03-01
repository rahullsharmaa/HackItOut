
import React from 'react';
import { EnergyForecast } from '../types/weatherTypes';
import { getBestEnergyTime } from '../utils/chartUtils';
import { Sun, Wind, Zap } from 'lucide-react';

interface EnergyMetricsProps {
  forecast: EnergyForecast;
}

const EnergyMetrics: React.FC<EnergyMetricsProps> = ({ forecast }) => {
  const { solarBestTime, windBestTime, combinedBestTime } = getBestEnergyTime(forecast);
  
  // Get current solar and wind potential
  const currentSolarPotential = forecast.solar[0];
  const currentWindPotential = forecast.wind[0];
  const currentCombinedPotential = currentSolarPotential + currentWindPotential;
  
  // Get maximum potential values
  const maxSolarPotential = Math.max(...forecast.solar);
  const maxWindPotential = Math.max(...forecast.wind);
  const combinedValues = forecast.solar.map((s, i) => s + forecast.wind[i]);
  const maxCombinedPotential = Math.max(...combinedValues);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium">Solar Energy</h3>
          <Sun className="h-5 w-5 text-energy-green-500" />
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1 text-sm">
              <span>Current Potential</span>
              <span className="font-medium">{currentSolarPotential.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div 
                className="bg-energy-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${currentSolarPotential}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1 text-sm">
              <span>24h Maximum</span>
              <span className="font-medium">{maxSolarPotential.toFixed(1)}%</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Best time:</span>
              <span className="font-medium text-foreground">{solarBestTime}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium">Wind Energy</h3>
          <Wind className="h-5 w-5 text-energy-blue-500" />
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1 text-sm">
              <span>Current Potential</span>
              <span className="font-medium">{currentWindPotential.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div 
                className="bg-energy-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${currentWindPotential}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1 text-sm">
              <span>24h Maximum</span>
              <span className="font-medium">{maxWindPotential.toFixed(1)}%</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Best time:</span>
              <span className="font-medium text-foreground">{windBestTime}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium">Combined</h3>
          <Zap className="h-5 w-5 text-primary" />
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1 text-sm">
              <span>Current Potential</span>
              <span className="font-medium">{(currentCombinedPotential / 2).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-energy-green-500 to-energy-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${currentCombinedPotential / 2}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1 text-sm">
              <span>24h Maximum</span>
              <span className="font-medium">{(maxCombinedPotential / 2).toFixed(1)}%</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Best time:</span>
              <span className="font-medium text-foreground">{combinedBestTime}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergyMetrics;
