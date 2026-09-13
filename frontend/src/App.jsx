import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ExperimentProvider } from './context/ExperimentContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LiveTelemetryStreamModal from './components/LiveTelemetryStreamModal';

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SearchPage from './pages/SearchPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrdersPage from './pages/OrdersPage';
import WishlistPage from './pages/WishlistPage';
import AnalyticsDashboardPage from './pages/AnalyticsDashboardPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ExperimentProvider>
            <div className="min-h-screen flex flex-col bg-[#fafafa] text-slate-900 font-sans">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/analytics" element={<AnalyticsDashboardPage />} />
                </Routes>
              </main>
              <Footer />
              <LiveTelemetryStreamModal />
            </div>
          </ExperimentProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
