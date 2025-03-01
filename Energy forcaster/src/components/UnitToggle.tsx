
import React from 'react';
import { UnitSystem } from '../types/weatherTypes';

interface UnitToggleProps {
  unitSystem: UnitSystem;
  toggleUnitSystem: () => void;
}

const UnitToggle: React.FC<UnitToggleProps> = ({ unitSystem, toggleUnitSystem }) => {
  return (
    <div className="flex items-center justify-center gap-2 animate-fade-in">
      <span className={`text-sm font-medium ${unitSystem === 'metric' ? 'text-primary' : 'text-muted-foreground'}`}>
        °C, m/s
      </span>
      
      <button
        onClick={toggleUnitSystem}
        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        style={{ 
          backgroundColor: unitSystem === 'metric' ? 'hsl(var(--primary))' : 'hsl(var(--muted))' 
        }}
      >
        <span
          className="pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0 transform"
          style={{ 
            transform: `translateX(${unitSystem === 'imperial' ? '18px' : '2px'})` 
          }}
        />
      </button>
      
      <span className={`text-sm font-medium ${unitSystem === 'imperial' ? 'text-primary' : 'text-muted-foreground'}`}>
        °F, mph
      </span>
    </div>
  );
};

export default UnitToggle;
