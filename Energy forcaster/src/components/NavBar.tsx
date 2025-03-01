
import React from 'react';
import { Cloud, Wind } from 'lucide-react';

const NavBar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass backdrop-blur-xl shadow-sm py-3 px-4 md:px-6">
      <div className="container max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 animate-fade-in">
            <div className="bg-gradient-to-br from-energy-green-500 to-energy-blue-500 rounded-md p-1 flex items-center justify-center">
              <Cloud className="text-white h-5 w-5" />
            </div>
            <h1 className="font-bold text-lg md:text-xl tracking-tight">EnergyForecast</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <a 
              href="#about" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              About
            </a>
            <a 
              href="#forecast" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Forecast
            </a>
            <a 
              href="#energy" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Energy
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
