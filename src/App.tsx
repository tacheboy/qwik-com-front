import React, { useState } from 'react';
import { Header } from './components/Header';
import { CategoryView } from './components/CategoryView';
import { FloatingCart } from './components/FloatingCart';
import { CartView } from './components/CartView';

export default function App() {
  const [showCart, setShowCart] = useState(false);

  if (showCart) {
    return <CartView onBack={() => setShowCart(false)} />;
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />
      <CategoryView />
      <FloatingCart onViewCart={() => setShowCart(true)} />
    </div>
  );
}
