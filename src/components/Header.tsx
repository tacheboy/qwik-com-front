import React from 'react';
import { Search, MapPin, User, ChevronDown } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <div className="sticky top-0 z-50 bg-[#e83362] text-white px-4 py-3 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-1 font-bold text-lg">
            <span>6 minutes</span>
            <ChevronDown className="w-5 h-5" />
          </div>
          <p className="text-xs text-white/80 truncate max-w-[200px]">
            Byatarayanapura - Kuvempu Road, Bya...
          </p>
        </div>
        <div className="bg-white/20 p-2 rounded-full">
          <User className="w-6 h-6" />
        </div>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search for 'Ice Cream'"
          className="w-full bg-white text-gray-900 rounded-xl py-3 pl-10 pr-4 focus:outline-none shadow-sm font-medium"
        />
      </div>
    </div>
  );
};
