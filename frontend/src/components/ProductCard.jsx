import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingBag, Zap, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { trackEvent } from '../utils/telemetry';

export default function ProductCard({ product }) {
  const { isWishlisted, toggleWishlist, addToCart } = useCart();
  const wish = isWishlisted(product.id);

  const handleCardClick = () => {
    trackEvent('product_view', {
      productId: product.id,
      metadata: {
        price: parseFloat(product.price),
        brand: product.brand,
        source: 'catalog_grid',
      },
    });
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const size = product.available_sizes && product.available_sizes.length > 0 ? product.available_sizes[0] : 'M';
    addToCart(product, size, 1);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-xl overflow-hidden border border-slate-100 hover:border-slate-200 shadow-xs hover:shadow-lg transition-all duration-200">
      {/* Product Image Container */}
      <Link
        to={`/products/${product.id}`}
        onClick={handleCardClick}
        className="relative aspect-3/4 w-full overflow-hidden bg-slate-100"
      >
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />

        {/* Discount Badge */}
        {product.discount_percentage > 0 && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-600 text-white shadow-xs">
            {product.discount_percentage}% OFF
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          aria-label="Wishlist"
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition shadow-xs cursor-pointer ${
            wish
              ? 'bg-rose-50 text-rose-600'
              : 'bg-white/80 text-slate-600 hover:text-rose-600 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${wish ? 'fill-rose-600 text-rose-600' : ''}`} />
        </button>

        {/* Rating Floating Pill */}
        <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md text-[11px] font-bold bg-white/90 backdrop-blur-md text-slate-800 flex items-center gap-1 shadow-xs">
          <span>{product.rating}</span>
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="text-[10px] text-slate-400 font-normal">| {product.rating_count}</span>
        </div>

        {/* Quick Add Overlay on Hover */}
        <div className="absolute inset-x-2 bottom-2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200">
          <button
            onClick={handleQuickAdd}
            className="w-full py-2 px-3 bg-slate-900/95 hover:bg-rose-600 text-white rounded-lg text-xs font-semibold backdrop-blur-md shadow-md flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Quick Add to Cart</span>
          </button>
        </div>
      </Link>

      {/* Details Body */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          {/* Brand & Delivery Pill */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-xs font-bold text-slate-900 tracking-wide uppercase font-heading truncate">
              {product.brand}
            </span>
            {product.delivery_days <= 2 && (
              <span className="shrink-0 flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                <Zap className="w-2.5 h-2.5 fill-emerald-600 text-emerald-600" />
                2-Day Delivery
              </span>
            )}
          </div>

          {/* Product Name */}
          <Link
            to={`/products/${product.id}`}
            onClick={handleCardClick}
            className="text-xs text-slate-600 hover:text-slate-900 font-normal line-clamp-1 leading-snug mb-2"
            title={product.name}
          >
            {product.name}
          </Link>
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 pt-1 border-t border-slate-50">
          <span className="text-sm font-black text-slate-900">
            ₹{parseInt(product.price).toLocaleString('en-IN')}
          </span>
          {product.original_price && parseFloat(product.original_price) > parseFloat(product.price) && (
            <span className="text-xs text-slate-400 line-through">
              ₹{parseInt(product.original_price).toLocaleString('en-IN')}
            </span>
          )}
          {product.discount_percentage > 0 && (
            <span className="text-[11px] font-semibold text-rose-600 ml-auto">
              ({product.discount_percentage}% OFF)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
