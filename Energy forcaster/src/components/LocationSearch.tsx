
import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { GeocodingResult } from '../types/weatherTypes';

interface LocationSearchProps {
  onLocationSelect: (location: GeocodingResult) => void;
  searchLocations: (query: string) => Promise<GeocodingResult[]>;
  isLoading: boolean;
}

const LocationSearch: React.FC<LocationSearchProps> = ({
  onLocationSelect,
  searchLocations,
  isLoading,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Handle search input change
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length >= 2) {
      setSearching(true);
      setIsOpen(true);
      try {
        const results = await searchLocations(query);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching locations:', error);
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    } else {
      setSearchResults([]);
      setIsOpen(false);
    }
  };
  
  // Handle location selection
  const handleSelect = (location: GeocodingResult) => {
    onLocationSelect(location);
    setSearchQuery(`${location.name}, ${location.country}`);
    setIsOpen(false);
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div ref={searchRef} className="relative w-full max-w-md mx-auto animate-fade-in">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <input
          type="text"
          className="w-full bg-card border border-border rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          placeholder="Search for a location..."
          value={searchQuery}
          onChange={handleSearchChange}
          disabled={isLoading}
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-3 flex items-center">
            <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
          </div>
        )}
      </div>
      
      {isOpen && searchResults.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-auto glass-card animate-scale-in">
          {searching ? (
            <div className="p-4 text-center text-muted-foreground">
              <Loader2 className="h-5 w-5 mx-auto animate-spin" />
              <p className="mt-2 text-sm">Searching locations...</p>
            </div>
          ) : (
            <ul className="py-1">
              {searchResults.map((result, index) => (
                <li key={`${result.lat}-${result.lon}-${index}`}>
                  <button
                    onClick={() => handleSelect(result)}
                    className="w-full text-left px-4 py-2 hover:bg-muted transition-colors flex items-center gap-2 group"
                  >
                    <MapPin className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <div>
                      <span className="font-medium">{result.name}</span>
                      <span className="text-muted-foreground ml-1 text-sm">
                        {result.state ? `${result.state}, ` : ''}{result.country}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
