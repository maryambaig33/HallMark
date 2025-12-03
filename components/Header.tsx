import React from 'react';
import { Gift } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-hallmark-purple p-2 rounded-lg">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-hallmark-purple tracking-tight">Hallmark</h1>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-sans font-bold -mt-1">Store Locator</p>
          </div>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
          <a href="#" className="hover:text-hallmark-purple transition-colors">Find a Store</a>
          <a href="#" className="hover:text-hallmark-purple transition-colors">Ornaments</a>
          <a href="#" className="hover:text-hallmark-purple transition-colors">Cards</a>
          <a href="#" className="hover:text-hallmark-purple transition-colors">Gifts</a>
        </nav>
      </div>
    </header>
  );
};