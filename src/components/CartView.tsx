import React from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { optimizeCartAsync, resetOptimization } from '../store/cartSlice';
import { ChevronLeft, Heart, Search, ChevronRight, Zap, Plus, Minus } from 'lucide-react';

interface CartViewProps {
  onBack: () => void;
}

export const CartView: React.FC<CartViewProps> = ({ onBack }) => {
  const dispatch = useAppDispatch();
  const { items, isOptimizing, optimizedSplits } = useAppSelector((state) => state.cart);

  const cartTotalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = items.reduce((acc, item) => {
    const lowestPrice = Math.min(...Object.values(item.product.prices).filter((p): p is number => p !== null));
    return acc + (lowestPrice * item.quantity);
  }, 0);

  if (cartTotalItems === 0) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <div className="bg-white p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={onBack}><ChevronLeft className="w-6 h-6" /></button>
            <h1 className="text-xl font-bold">Cart</h1>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-7359557-6024626.png" alt="Empty Cart" className="w-48 h-48 mb-4 opacity-50" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
          <button onClick={onBack} className="bg-[#e83362] text-white font-bold py-3 px-8 rounded-xl shadow-md">
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 pb-24 overflow-y-auto">
      {/* Header */}
      <div className="bg-white p-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={onBack}><ChevronLeft className="w-6 h-6" /></button>
          <h1 className="text-xl font-bold">Cart</h1>
        </div>
        <Heart className="w-6 h-6 text-gray-400" />
      </div>

      {/* Savings Banner */}
      <div className="bg-green-50 text-green-700 py-2 px-4 text-center text-sm font-medium flex items-center justify-center gap-1">
        Yay! You saved ₹99 on this order <ChevronDown className="w-4 h-4" />
      </div>

      <div className="p-4 space-y-4">
        {/* Coupons Section */}
        <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100 flex items-center gap-3">
          <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded">NEW</span>
          <span className="text-sm text-blue-700 font-medium">Apply coupons + payment offers & save more</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <h2 className="font-bold p-4 pb-2 text-lg">Coupons & offers</h2>
          <div className="p-4 pt-2 space-y-4">
            <div className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full text-green-600">
                  <span className="font-bold">%</span>
                </div>
                <span className="font-medium">View coupons</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
            <div className="border-t border-dashed border-gray-200"></div>
            <div className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                  <span className="font-bold">💳</span>
                </div>
                <span className="font-medium">View payment offers</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded-full">
              <Zap className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Delivering in 7 mins</h3>
              <p className="text-sm text-gray-500">{cartTotalItems} items</p>
            </div>
          </div>
          <button className="flex items-center gap-1 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-lg text-sm font-bold border border-orange-200">
            <span>📅</span> Schedule
          </button>
        </div>

        {/* Cart Items List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
          {items.map((item) => {
            const lowestPrice = Math.min(...Object.values(item.product.prices).filter((p): p is number => p !== null));
            return (
              <div key={item.product.id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain mix-blend-multiply p-1" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-800 leading-tight mb-1">{item.product.name}</h4>
                  <p className="text-xs text-gray-500 mb-2">{item.product.size}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">₹{lowestPrice}</span>
                      {item.product.mrp > lowestPrice && (
                        <span className="text-xs text-gray-400 line-through">₹{item.product.mrp}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center bg-pink-50 text-[#e83362] rounded-lg border border-pink-100">
                      <button className="p-1 px-2"><Minus className="w-4 h-4" /></button>
                      <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                      <button className="p-1 px-2"><Plus className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          <div className="text-center pt-2">
            <button onClick={onBack} className="text-[#e83362] font-bold text-sm">
              Forgot something? Add More Items
            </button>
          </div>
        </div>

        {/* Bill Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <h2 className="font-bold p-4 pb-2 text-lg">Bill details</h2>
          <div className="p-4 pt-2 space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Item Total</span>
              <div className="flex items-center gap-2">
                <span className="line-through text-gray-400">₹{cartSubtotal + 80}</span>
                <span className="font-medium text-gray-900">₹{cartSubtotal}</span>
              </div>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <div className="flex items-center gap-2">
                <span className="line-through text-gray-400">₹29</span>
                <span className="font-bold text-green-600">FREE</span>
              </div>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Handling Fee</span>
              <div className="flex items-center gap-2">
                <span className="line-through text-gray-400">₹10</span>
                <span className="font-bold text-green-600">FREE</span>
              </div>
            </div>
            <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between font-bold text-lg text-gray-900">
              <span>To Pay</span>
              <span>₹{cartSubtotal}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
        <div className="max-w-md mx-auto">
          <button 
            onClick={() => dispatch(optimizeCartAsync())}
            disabled={isOptimizing}
            className="w-full bg-[#e83362] hover:bg-[#d02d58] text-white font-bold py-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
          >
            {isOptimizing ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Optimize & Proceed to Pay'
            )}
          </button>
        </div>
      </div>

      {/* Optimization Modal Overlay */}
      {optimizedSplits && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center sm:items-center">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Smart Cart Split</h2>
              <button onClick={() => dispatch(resetOptimization())} className="text-gray-500 hover:text-gray-700">
                <ChevronDown className="w-6 h-6" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              We've optimized your cart across platforms to save you the most money!
            </p>

            <div className="space-y-4 mb-6">
              {optimizedSplits.map((split) => (
                <div key={split.platform} className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-lg text-gray-900">{split.platform}</span>
                    <span className="font-bold text-green-600 text-lg">₹{split.total}</span>
                  </div>
                  <div className="space-y-2 mb-3">
                    {split.items.map((item) => (
                      <div key={item.product.id} className="flex justify-between text-sm">
                        <span className="text-gray-600 truncate pr-2">
                          {item.quantity}x {item.product.name}
                        </span>
                        <span className="text-gray-900 font-medium">
                          ₹{item.product.prices[split.platform]! * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 border-t border-gray-200 pt-3">
                    <span>Delivery Fee</span>
                    <span className="font-medium">{split.deliveryFee === 0 ? 'FREE' : `₹${split.deliveryFee}`}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200 mb-6">
              <span className="font-bold text-gray-900 text-lg">Total Optimized Cost</span>
              <span className="text-2xl font-bold text-[#e83362]">
                ₹{optimizedSplits.reduce((acc, split) => acc + split.total, 0)}
              </span>
            </div>

            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-md transition-colors">
              Confirm & Place Orders
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for the ChevronDown icon used in the banner
const ChevronDown = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m6 9 6 6 6-6"/>
  </svg>
);
