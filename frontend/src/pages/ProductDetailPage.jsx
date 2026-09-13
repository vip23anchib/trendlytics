import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Heart, Star, ShoppingBag, Truck, ShieldCheck, RefreshCw, 
  ChevronRight, Sparkles, Check, AlertCircle, Info, Zap
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { trackEvent } from '../utils/telemetry';
import ProductCard from '../components/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart, isWishlisted, toggleWishlist } = useCart();

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [pincode, setPincode] = useState('560001');
  const [pincodeChecked, setPincodeChecked] = useState(true);
  const [loading, setLoading] = useState(true);
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const [prodRes, simRes] = await Promise.all([
          fetch(`/api/products/${id}/`),
          fetch(`/api/products/${id}/similar/`),
        ]);

        if (prodRes.ok) {
          const data = await prodRes.json();
          setProduct(data);
          if (data.available_sizes && data.available_sizes.length > 0) {
            setSelectedSize(data.available_sizes[0]);
          }

          // Track product_view event
          trackEvent('product_view', {
            productId: data.id,
            metadata: {
              brand: data.brand,
              price: parseFloat(data.price),
              category: data.category_name,
              source: 'product_detail_page',
            },
          });
        }
        if (simRes.ok) {
          setSimilarProducts(await simRes.json());
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex items-center justify-center text-slate-400">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-slate-600">Loading fashion details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 font-heading">Product Not Found</h2>
        <p className="text-xs text-slate-500">The fashion item you are looking for might be out of stock or archived.</p>
        <Link to="/products" className="inline-block px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const wish = isWishlisted(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart(product, selectedSize, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500">
        <Link to="/" className="hover:text-slate-900">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/products?category=${product.category_slug}`} className="hover:text-slate-900 capitalize">
          {product.category_name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Product Media Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.discount_percentage > 0 && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white shadow-md">
                {product.discount_percentage}% OFF
              </span>
            )}
            {product.is_trending && (
              <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold bg-slate-900/90 text-white backdrop-blur-md shadow-md flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-rose-400" />
                Trending
              </span>
            )}
          </div>
        </div>

        {/* Right: Product Purchase Options & Details */}
        <div className="lg:col-span-6 space-y-6">
          {/* Brand & Title */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 font-heading">
              {product.brand}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading tracking-tight mt-1 leading-snug">
              {product.name}
            </h1>
            
            {/* Rating pill */}
            <div className="flex items-center gap-3 mt-3">
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <span>{product.rating}</span>
                <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
              </div>
              <span className="text-xs text-slate-500">
                {product.rating_count} Verified Customer Ratings
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60 flex items-baseline gap-3">
            <span className="text-3xl font-black text-slate-900">
              ₹{parseInt(product.price).toLocaleString('en-IN')}
            </span>
            {product.original_price && parseFloat(product.original_price) > parseFloat(product.price) && (
              <span className="text-base text-slate-400 line-through">
                ₹{parseInt(product.original_price).toLocaleString('en-IN')}
              </span>
            )}
            {product.discount_percentage > 0 && (
              <span className="text-sm font-bold text-rose-600">
                ({product.discount_percentage}% OFF)
              </span>
            )}
            <span className="text-[11px] text-slate-400 ml-auto font-medium">Inclusive of all taxes</span>
          </div>

          {/* Size Selector */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Select Size
              </h3>
              <span className="text-xs text-indigo-600 font-semibold cursor-pointer hover:underline">
                Size Chart Guide
              </span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {(product.available_sizes || ['S', 'M', 'L', 'XL']).map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-12 h-11 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center cursor-pointer border ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                        : 'border-slate-200 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>

            {product.stock <= 25 && (
              <p className="text-[11px] text-amber-600 font-semibold flex items-center gap-1 mt-2">
                <AlertCircle className="w-3.5 h-3.5" />
                Hurry, only {product.stock} items left in stock!
              </p>
            )}
          </div>

          {/* Action Buttons: Add to Cart & Wishlist */}
          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                addedAnimation
                  ? 'bg-emerald-600 text-white ring-4 ring-emerald-500/20'
                  : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/25'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Shopping Bag!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </>
              )}
            </button>

            <button
              onClick={() => toggleWishlist(product)}
              className={`py-3.5 px-5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 border cursor-pointer ${
                wish
                  ? 'bg-rose-50 border-rose-300 text-rose-600'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${wish ? 'fill-rose-600 text-rose-600' : ''}`} />
              <span>{wish ? 'Wishlisted' : 'Save to Wishlist'}</span>
            </button>
          </div>

          {/* Delivery & Logistics Calculator */}
          <div className="p-4 rounded-xl border border-slate-200 space-y-3 bg-white">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-slate-700" />
              Delivery Options & SLA
            </h4>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter Pincode (e.g. 560001)"
                maxLength={6}
                className="w-44 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500"
              />
              <button
                onClick={() => setPincodeChecked(true)}
                className="px-3.5 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition"
              >
                Check
              </button>
            </div>

            {pincodeChecked && (
              <div className="text-xs space-y-1.5 text-slate-600 pt-1">
                <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <Zap className="w-3.5 h-3.5 fill-emerald-600" />
                  <span>
                    Get it in {product.delivery_days} Business Days ({product.delivery_days <= 2 ? 'Express Dispatch' : 'Standard Delivery'})
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Free delivery on simulated orders above ₹999. Pay on Delivery available.
                </p>
              </div>
            )}
          </div>

          {/* Product Specifications & Material Tags */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Product Specifications & Details
            </h4>
            
            <p className="text-xs text-slate-600 leading-relaxed">
              {product.description}
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Fabric / Material</span>
                <span className="font-semibold text-slate-800">{product.material}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Occasion</span>
                <span className="font-semibold text-slate-800">{product.occasion} Wear</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Season</span>
                <span className="font-semibold text-slate-800">{product.season}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Color Hue</span>
                <span className="font-semibold text-slate-800">{product.color}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products Recommendation Carousel */}
      {similarProducts.length > 0 && (
        <section className="pt-10 border-t border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900 font-heading">
                Similar Styles You May Like
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Based on category, fabric, color, and price range</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {similarProducts.slice(0, 4).map((sim) => (
              <ProductCard key={sim.id} product={sim} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
