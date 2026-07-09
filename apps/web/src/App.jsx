import React, { useState } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from '@/hooks/useCart';
import ScrollToTop from '@/components/ScrollToTop';
import ShoppingCart from '@/components/ShoppingCart';
import HomePage from '@/pages/HomePage';
import ProductsList from '@/pages/ProductsList';
import ProductDetailPage from '@/pages/ProductDetailPage';
import SuccessPage from '@/pages/SuccessPage';
import CheckoutPage from '@/pages/CheckoutPage';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <HelmetProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <ShoppingCart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
          <Routes>
            <Route path="/" element={<HomePage setIsCartOpen={setIsCartOpen} />} />
            <Route path="/products" element={<ProductsList setIsCartOpen={setIsCartOpen} />} />
            <Route path="/product/:id" element={<ProductDetailPage setIsCartOpen={setIsCartOpen} />} />
            <Route path="/success" element={<SuccessPage setIsCartOpen={setIsCartOpen} />} />
            <Route path="/checkout" element={<CheckoutPage setIsCartOpen={setIsCartOpen} />} />
          </Routes>
        </Router>
      </CartProvider>
    </HelmetProvider>
  );
}

export default App;