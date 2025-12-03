import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { StoreCard } from './components/StoreCard';
import { searchStores } from './services/geminiService';
import { Coordinates, MapSource } from './types';
import { Sparkles, Map as MapIcon, Info, Heart, Gift } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function App() {
  const [stores, setStores] = useState<MapSource[]>([]);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<Coordinates | undefined>(undefined);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'locating' | 'located' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  // Suggested queries for quick start
  const suggestions = [
    "Stores open now near me",
    "Where can I find Keepsake Ornaments?",
    "Hallmark Gold Crown stores nearby",
    "Stores with the best greeting card selection"
  ];

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      return;
    }

    setLocationStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationStatus('located');
      },
      (err) => {
        console.error(err);
        setLocationStatus('error');
      },
      { timeout: 10000 }
    );
  };

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    setStores([]); // Clear previous results immediately for better UX
    
    try {
      const result = await searchStores(query, userLocation);
      setAiResponse(result.text);
      setStores(result.stores);
      
      if (result.stores.length === 0) {
        setError("We couldn't find any specific stores matching that request nearby. Try a broader area or different search terms.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Run a default search if location is found and no stores are listed yet
  useEffect(() => {
    if (locationStatus === 'located' && stores.length === 0 && !loading && !aiResponse) {
      handleSearch("Find Hallmark stores near me");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationStatus]);

  return (
    <div className="min-h-screen bg-[#F9F5F0] flex flex-col font-sans text-gray-800">
      <Header />

      {/* Hero Section */}
      <div className="bg-hallmark-purple pb-16 pt-12 px-4 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <div className="absolute top-10 left-10 transform rotate-12"><Gift size={120} /></div>
           <div className="absolute bottom-10 right-10 transform -rotate-12"><Heart size={140} /></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">
            Find Your Perfect Hallmark Moment
          </h2>
          <p className="text-purple-100 text-lg md:text-xl max-w-2xl mx-auto">
            Locate stores, check stock for ornaments, and find the perfect gift near you.
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <SearchBar 
          onSearch={handleSearch} 
          isLoading={loading}
          onLocateMe={handleLocateMe}
          locationStatus={locationStatus}
        />

        {/* Suggestions / Initial State */}
        {!aiResponse && !loading && (
          <div className="mt-12 text-center">
            <h3 className="text-gray-400 font-medium uppercase tracking-wider text-sm mb-6">Popular Searches</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSearch(s)}
                  className="bg-white border border-gray-200 px-5 py-2 rounded-full text-gray-600 hover:border-hallmark-gold hover:text-hallmark-purple hover:bg-white transition-all shadow-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Area */}
        {(aiResponse || loading) && (
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: AI Response & Context */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4 text-hallmark-purple">
                  <Sparkles className="w-5 h-5 fill-hallmark-gold text-hallmark-gold" />
                  <h3 className="font-bold font-serif text-lg">Assistant's Answer</h3>
                </div>
                {loading ? (
                  <div className="space-y-3 animate-pulse">
                    <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-100 rounded w-full"></div>
                    <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                  </div>
                ) : (
                  <div className="prose prose-purple prose-sm">
                    <ReactMarkdown>{aiResponse}</ReactMarkdown>
                  </div>
                )}
              </div>
              
              {!loading && stores.length > 0 && (
                <div className="bg-hallmark-gold/10 p-5 rounded-xl border border-hallmark-gold/20">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-hallmark-purple shrink-0 mt-0.5" />
                    <p className="text-sm text-hallmark-purple/80">
                      Store hours and inventory may vary. We recommend calling ahead to confirm specific items like Keepsake Ornaments.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Store List */}
            <div className="lg:col-span-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif font-bold text-2xl text-gray-800">
                  {loading ? 'Searching...' : `Found ${stores.length} Locations`}
                </h3>
                {!loading && stores.length > 0 && (
                  <div className="flex items-center text-sm text-gray-500 gap-1">
                    <MapIcon className="w-4 h-4" />
                    <span>Based on Google Maps data</span>
                  </div>
                )}
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="bg-white h-48 rounded-xl shadow-sm border border-gray-100 animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stores.map((store, index) => (
                    <StoreCard key={index} store={store} index={index} />
                  ))}
                  {stores.length === 0 && !loading && error && (
                     <div className="col-span-2 bg-white p-8 rounded-xl text-center border-2 border-dashed border-gray-200">
                       <p className="text-gray-500">{error}</p>
                     </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}