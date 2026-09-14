import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, ShoppingBag, Heart, BarChart3, Sparkles, UserCheck, 
  Menu, X, ChevronDown, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useExperiment } from '../context/ExperimentContext';
import { trackEvent } from '../utils/telemetry';

export default function Navbar() {
  const { user, personas, switchPersona } = useAuth();
  const { totalItemCount, wishlist } = useCart();
  const { variant, isTreatment, toggleVariant } = useExperiment();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showPersonaModal, setShowPersonaModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    trackEvent('search', {
      searchQuery: searchQuery.trim(),
      metadata: { source: 'navbar_omnibar', variant }
    });
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const navCategories = [
    { name: 'Women', path: '/products?category=women' },
    { name: 'Men', path: '/products?category=men' },
    { name: 'Footwear', path: '/products?category=footwear' },
    { name: 'Beauty', path: '/products?category=beauty' },
    { name: 'Accessories', path: '/products?category=accessories' },
    { name: 'Trending', path: '/products?trending=true' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all shadow-xs">
      {/* Top PM Telemetry Banner */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              PM PORTFOLIO
            </span>
            <span className="hidden sm:inline text-slate-400">
              Trendlytics Product Analytics & A/B Experiment Platform
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* A/B Experiment Toggle Pill */}
            <button
              onClick={toggleVariant}
              title="Click to toggle between Control and Treatment A/B experiment variants"
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium transition cursor-pointer ${
                isTreatment 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30' 
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Variant: <strong className="font-bold">{isTreatment ? 'AI Intent Search (Treatment)' : 'Keyword Match (Control)'}</strong></span>
              <span className="text-[9px] underline ml-1">Switch</span>
            </button>

            {/* Persona Switcher Pill */}
            <button
              onClick={() => setShowPersonaModal(true)}
              className="flex items-center gap-1 text-slate-300 hover:text-white transition cursor-pointer text-[11px]"
            >
              <UserCheck className="w-3 h-3 text-sky-400" />
              <span className="hidden md:inline">Demo Persona:</span>
              <span className="font-semibold text-white truncate max-w-[120px]">
                {user ? user.first_name : 'Guest'}
              </span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-rose-600 flex items-center justify-center text-white font-black text-lg shadow-md group-hover:scale-105 transition">
              TL
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 font-heading">
                TREND<span className="text-rose-600">LYTICS</span>
              </span>
              <span className="text-[9px] tracking-wider uppercase font-semibold text-slate-500 -mt-1">
                Fashion Analytics
              </span>
            </div>
          </Link>

          {/* Search Bar with AI hint */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-lg mx-2 relative">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isTreatment ? 'Try: "black floral maxi dress for wedding under 3000"' : 'Search by keyword (e.g. dress, shirt, shoes)...'}
                className="w-full pl-10 pr-24 py-2 text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-rose-500 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-slate-900 hover:bg-rose-600 text-white rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1"
              >
                {isTreatment && <Sparkles className="w-3 h-3 text-rose-300" />}
                Search
              </button>
            </div>
          </form>

          {/* Action Links */}
          <div className="flex items-center gap-3">
            {/* IN-APP ANALYTICS BUTTON (Primary PM Showcase Button) */}
            <Link
              to="/analytics"
              onClick={() => trackEvent('analytics_page_opened', { metadata: { source: 'navbar' } })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-xs ${
                location.pathname === '/analytics'
                  ? 'bg-rose-600 text-white'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200/80'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Product Analytics</span>
              <span className="sm:hidden">Analytics</span>
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 text-slate-700 hover:text-rose-600 transition hover:bg-slate-50 rounded-full"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-slate-700 hover:text-rose-600 transition hover:bg-slate-50 rounded-full"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {totalItemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-slate-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Category Navigation Bar */}
        <nav className="hidden md:flex items-center space-x-8 py-2.5 border-t border-slate-100 text-sm font-medium">
          <Link
            to="/products"
            className={`transition hover:text-rose-600 ${location.pathname === '/products' && !location.search ? 'text-rose-600 font-bold' : 'text-slate-700'}`}
          >
            All Catalog
          </Link>
          {navCategories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.path}
              className="text-slate-600 hover:text-rose-600 transition"
            >
              {cat.name}
            </Link>
          ))}
          <div className="ml-auto flex items-center gap-2 text-xs text-slate-400 font-normal">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Simulated E-Commerce & Telemetry Store</span>
          </div>
        </nav>
      </div>

      {/* Mobile Search & Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 bg-white border-b border-slate-200 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fashion..."
              className="w-full pl-10 pr-20 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-slate-900 text-white rounded-md text-xs font-semibold"
            >
              Search
            </button>
          </form>

          <div className="grid grid-cols-2 gap-2 text-sm pt-2">
            <Link to="/products" className="p-2 rounded bg-slate-50 text-slate-800 font-medium">All Catalog</Link>
            {navCategories.map((cat) => (
              <Link key={cat.name} to={cat.path} className="p-2 rounded bg-slate-50 text-slate-700">
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Persona Switcher Modal */}
      {showPersonaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-indigo-600" />
                  Select Demo User Persona
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Simulate different customer segments and behavior patterns.
                </p>
              </div>
              <button onClick={() => setShowPersonaModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-2.5 max-h-[60vh] overflow-y-auto">
              {personas.map((p) => {
                const isCurrent = user && user.email === p.email;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      switchPersona(p);
                      setShowPersonaModal(false);
                    }}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start gap-3.5 ${
                      isCurrent
                        ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="w-11 h-11 rounded-full object-cover shrink-0 border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-900 truncate">{p.name}</h4>
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
                          {p.segment}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-indigo-700 mt-0.5">{p.segment_label}</p>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
                        {p.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
