import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addItem, removeItem } from '../store/cartSlice';
import { Product } from '../data/mockData';
import { Plus, Minus, Zap } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const cartItem = useAppSelector((state) => 
    state.cart.items.find((i) => i.product.id === product.id)
  );
  
  const qty = cartItem ? cartItem.quantity : 0;
  
  // Find lowest price across platforms for display
  const lowestPrice = Math.min(...Object.values(product.prices).filter((p): p is number => p !== null));

  return (
    <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 flex flex-col relative h-full">
      <div className="aspect-square bg-gray-50 rounded-xl mb-2 overflow-hidden relative p-2">
        <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" referrerPolicy="no-referrer" />
        
        {/* Add Button positioned over the image */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-11/12 max-w-[100px]">
          {qty === 0 ? (
            <button
              onClick={() => dispatch(addItem(product))}
              className="w-full bg-white text-[#e83362] border border-gray-200 hover:bg-gray-50 rounded-lg px-2 py-1.5 font-bold shadow-sm transition-colors text-sm"
            >
              ADD
            </button>
          ) : (
            <div className="w-full flex items-center justify-between bg-[#e83362] text-white rounded-lg shadow-sm px-1 py-1.5">
              <button onClick={() => dispatch(removeItem(product.id))} className="p-0.5">
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm font-bold">{qty}</span>
              <button onClick={() => dispatch(addItem(product))} className="p-0.5">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col px-1 pt-4">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-sm font-bold text-gray-900">₹{lowestPrice}</span>
          {product.mrp > lowestPrice && (
            <span className="text-xs text-gray-400 line-through">₹{product.mrp}</span>
          )}
        </div>
        
        {product.discount && (
          <span className="text-[10px] font-bold text-[#e83362] mb-1">{product.discount}</span>
        )}
        
        <h3 className="text-xs font-medium text-gray-800 leading-tight line-clamp-2 mb-1">{product.name}</h3>
        
        <div className="mt-auto pt-2">
          <p className="text-[10px] text-gray-500">{product.size}</p>
          {product.deliveryTime && (
            <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-500 font-medium">
              <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              {product.deliveryTime}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
