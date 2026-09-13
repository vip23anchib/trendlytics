import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, 
  Truck, CheckCircle, ChevronRight, AlertCircle, Plus, Minus
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { trackEvent } from '../utils/telemetry';

export default function CartPage() {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    coupon, 
    setCoupon, 
    rawSubtotal, 
    discountAmount, 
    deliveryFee, 
    grandTotal 
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponAppliedMessage, setCouponAppliedMessage] = useState(coupon ? `Coupon ${coupon} applied` : '');
  const navigate = useNavigate();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = inputCoupon.trim().toUpperCase();
    if (['TREND20', 'FIRST500', 'MYNTRASTYLE'].includes(code)) {
      setCoupon(code);
      setCouponAppliedMessage(`Coupon ${code} applied successfully!`);
    } else {
      setCouponAppliedMessage('Invalid coupon code. Try TREND20 or FIRST500');
    }
  };

  const handleProceedToCheckout = () => {
    trackEvent('checkout_started', {
      metadata: {
        cart_value: rawSubtotal,
        final_amount: grandTotal,
        item_count: cart.length,
        coupon_code: coupon,
      },
    });
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 font-heading">Your Shopping Bag is Empty</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Explore our new season drops, high-intent discovery search, and curated fashion recommendations.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow-md transition"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 font-heading">
          Shopping Bag ({cart.length} {cart.length === 1 ? 'Item' : 'Items'})
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">Review items, apply discount coupons, and proceed to simulated checkout</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => (
            <div
              key={`${item.product.id}-${item.size}`}
              className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.product.image_url}
                  alt={item.product.name}
                  className="w-20 h-24 object-cover rounded-xl bg-slate-100 shrink-0"
                />
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 font-heading">
                    {item.product.brand}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                    {item.product.name}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 pt-0.5">
                    <span>Size: <strong className="text-slate-800">{item.size}</strong></span>
                    <span>•</span>
                    <span className="text-emerald-700 font-medium">⚡ {item.product.delivery_days}-Day Delivery</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-sm font-black text-slate-900">
                      ₹{parseInt(item.product.price).toLocaleString('en-IN')}
                    </span>
                    {item.product.original_price && (
                      <span className="text-xs text-slate-400 line-through">
                        ₹{parseInt(item.product.original_price).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quantity & Delete Controls */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                    className="p-1.5 text-slate-600 hover:bg-slate-200 transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-slate-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                    className="p-1.5 text-slate-600 hover:bg-slate-200 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.product.id, item.size)}
                  className="text-xs text-slate-400 hover:text-rose-600 transition flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Order Summary & Coupon */}
        <div className="lg:col-span-4 space-y-5">
          {/* Coupon Code Box */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5 font-heading">
              <Tag className="w-4 h-4 text-rose-600" />
              Apply Promotional Coupons
            </h4>

            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                value={inputCoupon}
                onChange={(e) => setInputCoupon(e.target.value)}
                placeholder="e.g. TREND20, FIRST500"
                className="flex-1 px-3 py-2 text-xs uppercase border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500 font-semibold"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-slate-900 hover:bg-rose-600 text-white rounded-lg text-xs font-bold transition cursor-pointer"
              >
                Apply
              </button>
            </form>

            {couponAppliedMessage && (
              <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                {couponAppliedMessage}
              </p>
            )}

            <div className="p-2 rounded-lg bg-rose-50/70 border border-rose-100 text-[11px] text-rose-800 space-y-0.5">
              <p><strong>TREND20</strong>: Flat 20% Off on all items</p>
              <p><strong>FIRST500</strong>: ₹500 Off on orders above ₹1500</p>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-heading">
              Order Price Details
            </h4>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Total Bag MRP</span>
                <span className="font-semibold text-slate-900">₹{rawSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Coupon Discount ({coupon})</span>
                <span className="font-bold">-₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Delivery Fee</span>
                <span className="font-semibold text-slate-900">
                  {deliveryFee === 0 ? <strong className="text-emerald-700 uppercase">Free</strong> : `₹${deliveryFee}`}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900">Total Amount</span>
              <span className="text-2xl font-black text-slate-900">
                ₹{Math.round(grandTotal).toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-600/25 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <span>Proceed to Simulated Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Simulated payment flow (No real money charged)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
