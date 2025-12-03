import React, { useState, FormEvent } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  onLocateMe: () => void;
  locationStatus: 'idle' | 'locating' | 'located' | 'error';
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  isLoading, 
  onLocateMe,
  locationStatus
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-2 max-w-2xl mx-auto -mt-8 relative z-10 border border-gray-100">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a store, or ask 'Where can I buy ornaments?'"
            className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-hallmark-purple/20 bg-transparent"
            disabled={isLoading}
          />
        </div>
        
        <div className="h-8 w-px bg-gray-200 mx-1"></div>

        <button
          type="button"
          onClick={onLocateMe}
          disabled={locationStatus === 'locating' || isLoading}
          className={`p-3 rounded-xl transition-all duration-200 flex items-center gap-2 text-sm font-medium ${
            locationStatus === 'located' 
              ? 'text-green-600 bg-green-50' 
              : 'text-gray-500 hover:bg-gray-50'
          }`}
          title="Use my location"
        >
          {locationStatus === 'locating' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <MapPin className={`w-5 h-5 ${locationStatus === 'located' ? 'fill-current' : ''}`} />
          )}
          <span className="hidden sm:inline">Near Me</span>
        </button>

        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="bg-hallmark-purple text-white px-6 py-3 rounded-xl font-medium hover:bg-purple-900 transition-all shadow-lg shadow-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            'Search'
          )}
        </button>
      </form>
    </div>
  );
};