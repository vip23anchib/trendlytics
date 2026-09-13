import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, ArrowRight, TrendingUp, ShieldCheck, Zap, 
  ShoppingBag, Star, Tag, ChevronRight, Compass, Search
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { trackEvent } from '../utils/telemetry';
import { useExperiment } from '../context/ExperimentContext';

export default function HomePage() {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchIntentInput, setSearchIntentInput] = useState('');
  
  const navigate = useNavigate();
  const { isTreatment } = useExperiment();

  useEffect(() => {
    trackEvent('homepage_view', { metadata: { viewport_width: window.innerWidth } });

    async function loadData() {
      try {
        const [catRes, trendRes, recRes] = await Promise.all([
          fetch('/api/categories/'),
          fetch('/api/products/?is_trending=true&page_size=8'),
          fetch('/api/products/recommended/'),
        ]);

        if (catRes.ok) setCategories(await catRes.json());
        if (trendRes.ok) {
          const trendData = await trendRes.json();
          setTrendingProducts(trendData.results || []);
        }
        if (recRes.ok) setRecommendedProducts(await recRes.json());
      } catch (err) {
        console.error('Failed to load homepage feeds:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (!searchIntentInput.trim()) return;
    trackEvent('search', {
      searchQuery: searchIntentInput.trim(),
      metadata: { source: 'hero_search' }
    });
    navigate(`/search?q=${encodeURIComponent(searchIntentInput.trim())}`);
  };

  const sampleSearchPills = [
    'black floral maxi dress for summer wedding under 3000',
    'pastel peach lehenga silk blend',
    'oversized white linen shirt under 2000',
    'red party heels size 8',
    'navy oxford cotton shirt',
  ];

  return (
    <div className="space-y-14 pb-16">
      {/* Editorial Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.15),transparent_50%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          <div className="lg:col-span-7 space-y-6">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-rose-300">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>Next-Gen Intent-Aware Fashion Discovery</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] font-heading">
              Discover Fashion That Matches Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-300 to-indigo-300">Exact Intent</span>.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl font-normal">
              Say goodbye to failed zero-result searches. Search naturally with colors, occasions, fabrics, and budgets — our semantic engine translates your phrases into curated wardrobe picks.
            </p>

            {/* Smart Search Bar */}
            <form onSubmit={handleHeroSearch} className="pt-2 max-w-xl">
              <div className="relative flex items-center shadow-2xl">
                <input
                  type="text"
                  value={searchIntentInput}
                  onChange={(e) => setSearchIntentInput(e.target.value)}
                  placeholder="e.g. black floral maxi dress for summer wedding under 3000..."
                  className="w-full pl-11 pr-32 py-3.5 rounded-xl bg-white text-slate-900 text-sm font-medium border-0 focus:ring-4 focus:ring-rose-500/30 shadow-lg placeholder:text-slate-400"
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="submit"
                  className="absolute right-2 px-4 py-2 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5 text-rose-200" />
                  Search
                </button>
              </div>

              {/* Sample Intent Query Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-3">
                <span className="text-[11px] text-slate-400 font-medium">Try asking:</span>
                {sampleSearchPills.slice(0, 3).map((pill) => (
                  <button
                    key={pill}
                    type="button"
                    onClick={() => {
                      setSearchIntentInput(pill);
                      navigate(`/search?q=${encodeURIComponent(pill)}`);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 transition truncate max-w-[200px]"
                  >
                    "{pill}"
                  </button>
                ))}
              </div>
            </form>

            {/* Quick Metrics Badge */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/10 text-xs text-slate-300">
              <div>
                <span className="font-bold text-white text-sm">220+</span> Curated SKUs
              </div>
              <span className="text-slate-600">•</span>
              <div>
                <span className="font-bold text-emerald-400 text-sm">14-Event</span> Real-Time Telemetry
              </div>
              <span className="text-slate-600">•</span>
              <div>
                <span className="font-bold text-rose-400 text-sm">+50%</span> Search CVR Uplift
              </div>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md p-3 group">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80"
                alt="Fashion Edit"
                className="w-full h-80 object-cover rounded-xl group-hover:scale-105 transition duration-500"
              />
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Editorial Drop</span>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">New Season</span>
                </div>
                <h3 className="text-lg font-bold text-white font-heading">Summer Evening & Wedding Collection</h3>
                <p className="text-xs text-slate-400">Handcrafted silk blends, lightweight French linen, and timeless tailoring.</p>
                <Link
                  to="/products?category=women"
                  className="mt-3 w-full py-2 bg-white text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  Explore Collection <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 font-heading">
              Shop by Category
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Explore curated collections for every occasion</p>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
          >
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              onClick={() => trackEvent('category_view', { metadata: { category: cat.slug } })}
              className="group relative rounded-xl overflow-hidden aspect-4/5 bg-slate-100 shadow-xs hover:shadow-lg transition duration-200 border border-slate-100"
            >
              <img
                src={cat.image_url}
                alt={cat.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-108 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent flex flex-col justify-end p-4 text-white">
                <span className="text-base font-black tracking-tight font-heading group-hover:text-rose-300 transition">
                  {cat.name}
                </span>
                <span className="text-[11px] text-slate-300 font-normal">
                  {cat.product_count || 40}+ Products
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Promotional Flash Deal Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-700 p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="space-y-2 max-w-lg z-10">
            <span className="px-2.5 py-1 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider">
              Limited Time Promo
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-heading leading-tight">
              Flat 20% OFF on All New Season Essentials
            </h3>
            <p className="text-xs text-rose-100 leading-relaxed">
              Use code <strong className="font-black bg-white/20 px-2 py-0.5 rounded text-white">TREND20</strong> at simulated checkout to claim your savings.
            </p>
          </div>

          <div className="flex items-center gap-3 z-10 shrink-0">
            <Link
              to="/products?min_discount=40"
              className="px-6 py-3 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-black shadow-md transition flex items-center gap-2"
            >
              <Tag className="w-4 h-4 text-rose-600" />
              Shop Deals (40%+ Off)
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Now */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 font-heading">
                Trending Drops
              </h2>
              <p className="text-xs text-slate-500">Most viewed fashion pieces this week</p>
            </div>
          </div>
          <Link
            to="/products?trending=true"
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
          >
            View All Trending <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-72 rounded-xl bg-slate-100 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {trendingProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Recommended for You */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 font-heading">
                Recommended for You
              </h2>
              <p className="text-xs text-slate-500">Curated based on high customer satisfaction & rating</p>
            </div>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            Explore Catalog <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {recommendedProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
