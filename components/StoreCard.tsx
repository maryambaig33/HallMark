import React from 'react';
import { MapSource } from '../types';
import { MapPin, Navigation, Star, ExternalLink } from 'lucide-react';

interface StoreCardProps {
  store: MapSource;
  index: number;
}

export const StoreCard: React.FC<StoreCardProps> = ({ store, index }) => {
  const reviews = store.placeAnswerSources?.reviewSnippets || [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 overflow-hidden group">
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-start gap-3">
            <div className="bg-hallmark-purple/10 text-hallmark-purple font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0">
              {index + 1}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-hallmark-purple transition-colors">
                {store.title}
              </h3>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                <span>Hallmark Retailer</span>
              </div>
            </div>
          </div>
          <a
            href={store.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-hallmark-purple transition-colors p-1"
            title="View on Google Maps"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>

        {reviews.length > 0 && (
          <div className="mt-4 bg-gray-50 rounded-lg p-3 text-sm text-gray-600 italic border-l-2 border-hallmark-gold">
            <div className="flex items-start gap-2">
              <Star className="w-3 h-3 text-hallmark-gold mt-1 shrink-0 fill-current" />
              <p>"{reviews[0].content}"</p>
            </div>
          </div>
        )}

        <div className="mt-5 flex gap-3">
          <a
            href={store.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-hallmark-purple text-white py-2 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-purple-900 transition-colors"
          >
            <Navigation className="w-4 h-4" />
            Get Directions
          </a>
        </div>
      </div>
    </div>
  );
};