import React from 'react';
import { SlidersHorizontal, RotateCcw, Check, Star } from 'lucide-react';

export default function FilterSidebar({
  filters,
  facets,
  onFilterChange,
  onReset,
  totalMatches,
}) {
  const handleCheckboxChange = (filterKey, value) => {
    const currentList = filters[filterKey] ? filters[filterKey].split(',').filter(Boolean) : [];
    const exists = currentList.includes(value);
    const updated = exists ? currentList.filter((item) => item !== value) : [...currentList, value];
    onFilterChange(filterKey, updated.join(','));
  };

  const handleRadioChange = (filterKey, value) => {
    onFilterChange(filterKey, filters[filterKey] === value ? '' : value);
  };

  const currentBrands = filters.brands ? filters.brands.split(',').filter(Boolean) : [];
  const currentColors = filters.colors ? filters.colors.split(',').filter(Boolean) : [];

  return (
    <aside className="w-full lg:w-64 shrink-0 bg-white rounded-xl border border-slate-200/80 p-5 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-700" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading">
            Filters
          </h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer transition"
        >
          <RotateCcw className="w-3 h-3" />
          Reset All
        </button>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
          Categories
        </h4>
        <div className="space-y-1.5 text-xs">
          {['all', 'women', 'men', 'footwear', 'beauty', 'accessories'].map((cat) => (
            <label
              key={cat}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition capitalize ${
                (filters.category || 'all') === cat
                  ? 'bg-rose-50 text-rose-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{cat === 'all' ? 'All Products' : cat}</span>
              <input
                type="radio"
                name="category"
                checked={(filters.category || 'all') === cat}
                onChange={() => onFilterChange('category', cat === 'all' ? '' : cat)}
                className="hidden"
              />
              {(filters.category || 'all') === cat && <Check className="w-3.5 h-3.5 text-rose-600" />}
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
          Max Price (₹)
        </h4>
        <div className="space-y-2">
          <input
            type="range"
            min="499"
            max="12999"
            step="500"
            value={filters.max_price || 12999}
            onChange={(e) => onFilterChange('max_price', e.target.value)}
            className="w-full accent-rose-600 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-slate-500 font-medium">
            <span>₹499</span>
            <span className="font-bold text-slate-900">
              Under ₹{parseInt(filters.max_price || 12999).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Minimum Discount */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
          Discount
        </h4>
        <div className="space-y-1.5 text-xs">
          {[
            { label: '30% and above', val: '30' },
            { label: '40% and above', val: '40' },
            { label: '50% and above', val: '50' },
          ].map((item) => (
            <label
              key={item.val}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.min_discount === item.val}
                onChange={() => handleRadioChange('min_discount', item.val)}
                className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands Facet */}
      {facets && facets.brands && facets.brands.length > 0 && (
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
            Brands
          </h4>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 text-xs">
            {facets.brands.map((brand) => (
              <label
                key={brand}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={currentBrands.includes(brand)}
                  onChange={() => handleCheckboxChange('brands', brand)}
                  className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                />
                <span className="truncate">{brand}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Occasions */}
      {facets && facets.occasions && facets.occasions.length > 0 && (
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
            Occasion
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {facets.occasions.map((occ) => {
              const active = filters.occasion === occ;
              return (
                <button
                  key={occ}
                  onClick={() => handleRadioChange('occasion', occ)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition cursor-pointer ${
                    active
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {occ}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Minimum Rating */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
          Customer Rating
        </h4>
        <div className="space-y-1.5 text-xs">
          {['4.5', '4.0', '3.5'].map((r) => (
            <label
              key={r}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.min_rating === r}
                onChange={() => handleRadioChange('min_rating', r)}
                className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
              />
              <span className="flex items-center gap-1 font-medium">
                {r} ★ & above
              </span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
