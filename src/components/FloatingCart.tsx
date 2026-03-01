import React from 'react';
import { useAppSelector } from '../store/hooks';
import { ShoppingCart, ChevronRight } from 'lucide-react';

interface FloatingCartProps {
  onViewCart: () => void;
}

export const FloatingCart: React.FC<FloatingCartProps> = ({ onViewCart }) => {
  const { items } = useAppSelector((state) => state.cart);
  
  const cartTotalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  
  if (cartTotalItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50 bg-white border-t border-gray-100">
      <div className="max-w-md mx-auto">
        <div className="bg-[#e83362] text-white rounded-xl p-3 flex items-center justify-between shadow-lg cursor-pointer" onClick={onViewCart}>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-lg leading-tight">{cartTotalItems} items</p>
              <p className="text-xs text-white/90">Free delivery unlocked 🎉</p>
            </div>
          </div>
          <div className="flex items-center gap-1 font-bold">
            <span>View Cart</span>
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};
