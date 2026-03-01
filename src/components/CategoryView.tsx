import React, { useState } from 'react';
import { MOCK_PRODUCTS } from '../data/mockData';
import { ProductCard } from './ProductCard';

const CATEGORIES = [
  { id: 'All', name: 'All', icon: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=100' },
  { id: 'Fresh Vegetables', name: 'Fresh Vegetables', icon: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&q=80&w=100' },
  { id: 'Fresh Fruits', name: 'Fresh Fruits', icon: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=100' },
  { id: 'Exotics & Premium', name: 'Exotics & Premium', icon: 'https://images.unsplash.com/photo-1596472251346-60195543c713?auto=format&fit=crop&q=80&w=100' },
  { id: 'Organics & Hydroponics', name: 'Organics & Hydroponics', icon: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=100' },
  { id: 'Leafy, Herbs & Seasonings', name: 'Leafy, Herbs & Seasonings', icon: 'https://images.unsplash.com/photo-1622484211148-7142cb1a148f?auto=format&fit=crop&q=80&w=100' },
  { id: 'Flowers & Leaves', name: 'Flowers & Leaves', icon: 'https://images.unsplash.com/photo-1563241527-2004ab3ba4aa?auto=format&fit=crop&q=80&w=100' }
];

export const CategoryView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProducts = activeCategory === 'All' 
    ? MOCK_PRODUCTS 
    : MOCK_PRODUCTS.filter(p => p.subCategory === activeCategory);

  return (
    <div className="flex h-[calc(100vh-140px)] bg-white">
      {/* Sidebar */}
      <div className="w-[85px] bg-[#f8f9fa] border-r border-gray-100 overflow-y-auto flex-shrink-0">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`w-full text-center px-1 py-3 text-[10px] font-medium border-l-4 transition-colors ${
              activeCategory === cat.id 
                ? 'border-[#e83362] text-[#e83362] bg-white' 
                : 'border-transparent text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center overflow-hidden border-2 ${activeCategory === cat.id ? 'border-[#e83362]' : 'border-transparent'}`}>
                <img 
                  src={cat.icon} 
                  alt={cat.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="leading-tight px-1">{cat.name}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="flex-1 overflow-y-auto p-3 bg-gray-50/50">
        <div className="grid grid-cols-2 gap-3 pb-24">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};
