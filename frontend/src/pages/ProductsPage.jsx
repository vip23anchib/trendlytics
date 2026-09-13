import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ArrowUpDown, X, Loader2, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import { trackEvent } from '../utils/telemetry';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [facets, setFacets] = useState({});
  const [totalMatches, setTotalMatches] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Extract filter state from query parameters
  const currentCategory = searchParams.get('category') || '';
  const currentBrands = searchParams.get('brands') || '';
  const currentColors = searchParams.get('colors') || '';
  const currentMaxPrice = searchParams.get('max_price') || '';
  const currentMinDiscount = searchParams.get('min_discount') || '';
  const currentMinRating = searchParams.get('min_rating') || '';
  const currentOccasion = searchParams.get('occasion') || '';
  const currentSort = searchParams.get('sort_by') || 'popularity';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const isTrendingOnly = searchParams.get('trending') === 'true';

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const queryStr = new URLSearchParams(searchParams).toString();
        const res = await fetch(`/api/products/?${queryStr}&page_size=20`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.results || []);
          setFacets(data.facets || {});
          setTotalMatches(data.total_count || 0);
          setTotalPages(data.total_pages || 1);
        }
      } catch (err) {
        console.error('Failed to fetch catalog:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [searchParams]);

  const updateFilters = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    newParams.set('page', '1'); // Reset to page 1 on filter change
    setSearchParams(newParams);

    trackEvent('filter_used', {
      metadata: { filter_key: key, filter_val: value }
    });
  };

  const handleSortChange = (e) => {
    const sortVal = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort_by', sortVal);
    newParams.set('page', '1');
    setSearchParams(newParams);

    trackEvent('sort_used', {
      metadata: { sort_option: sortVal }
    });
  };

  const resetAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const activeFilters = [];
  if (currentCategory) activeFilters.push({ key: 'category', label: `Category: ${currentCategory}` });
  if (currentBrands) activeFilters.push({ key: 'brands', label: `Brand: ${currentBrands}` });
  if (currentOccasion) activeFilters.push({ key: 'occasion', label: `Occasion: ${currentOccasion}` });
  if (currentMinDiscount) activeFilters.push({ key: 'min_discount', label: `Min ${currentMinDiscount}% Off` });
  if (currentMinRating) activeFilters.push({ key: 'min_rating', label: `Rating ${currentMinRating}★+` });
  if (currentMaxPrice && currentMaxPrice !== '12999') activeFilters.push({ key: 'max_price', label: `Under ₹${currentMaxPrice}` });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-heading capitalize">
            {currentCategory ? `${currentCategory} Collection` : isTrendingOnly ? 'Trending Pieces' : 'Fashion Catalog'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing {totalMatches} curated styles matching your preferences
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
          >
            <SlidersHorizontal className="w-4 h-4 text-slate-600" />
            Filters {activeFilters.length > 0 && `(${activeFilters.length})`}
          </button>

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={currentSort}
              onChange={handleSortChange}
              className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-rose-500 cursor-pointer"
            >
              <option value="popularity">Sort by: Recommended (Popularity)</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="discount">Highest Discount</option>
              <option value="newest">New Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-500 font-medium">Active Filters:</span>
          {activeFilters.map((f) => (
            <span
              key={f.key}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200"
            >
              {f.label}
              <button
                onClick={() => updateFilters(f.key, '')}
                className="hover:text-rose-900 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            onClick={resetAllFilters}
            className="text-xs text-slate-500 hover:text-rose-600 underline font-medium ml-2 cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Grid + Sidebar */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar (Desktop) */}
        <div className="hidden lg:block">
          <FilterSidebar
            filters={{
              category: currentCategory,
              brands: currentBrands,
              colors: currentColors,
              max_price: currentMaxPrice,
              min_discount: currentMinDiscount,
              min_rating: currentMinRating,
              occasion: currentOccasion,
            }}
            facets={facets}
            onFilterChange={updateFilters}
            onReset={resetAllFilters}
            totalMatches={totalMatches}
          />
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="lg:hidden w-full">
            <FilterSidebar
              filters={{
                category: currentCategory,
                brands: currentBrands,
                colors: currentColors,
                max_price: currentMaxPrice,
                min_discount: currentMinDiscount,
                min_rating: currentMinRating,
                occasion: currentOccasion,
              }}
              facets={facets}
              onFilterChange={updateFilters}
              onReset={resetAllFilters}
              totalMatches={totalMatches}
            />
          </div>
        )}

        {/* Products Grid */}
        <div className="flex-1 w-full space-y-8">
          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center text-slate-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-rose-600" />
              <p className="text-xs font-medium">Fetching curated styles...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="h-96 flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl border border-slate-200">
              <Sparkles className="w-12 h-12 text-slate-300 mb-3" />
              <h3 className="text-base font-bold text-slate-800 font-heading">No items match your exact filters</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Try widening your price range or clearing selected brands/occasions to see more options.
              </p>
              <button
                onClick={resetAllFilters}
                className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-rose-600 transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-200">
              <button
                disabled={currentPage <= 1}
                onClick={() => {
                  const p = new URLSearchParams(searchParams);
                  p.set('page', String(currentPage - 1));
                  setSearchParams(p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Previous
              </button>
              <span className="text-xs text-slate-500 px-3">
                Page <strong className="text-slate-900">{currentPage}</strong> of {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => {
                  const p = new URLSearchParams(searchParams);
                  p.set('page', String(currentPage + 1));
                  setSearchParams(p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
