import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, CheckCircle2, CreditCard, 
  MapPin, Loader2, Sparkles, AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { trackEvent, getSessionId, getDeviceType } from '../utils/telemetry';

export default function CheckoutPage() {
  const { cart, grandTotal, rawSubtotal, discountAmount, deliveryFee, coupon, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingName, setShippingName] = useState(user ? `${user.first_name} ${user.last_name || ''}`.trim() : 'Pooja Sharma');
  const [shippingAddress, setShippingAddress] = useState('Flat 402, Royal Palms, 100ft Road, Indiranagar');
  const [shippingCity, setShippingCity] = useState('Bengaluru');
  const [shippingPincode, setShippingPincode] = useState('560001');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 font-heading">Your Bag is Empty</h2>
        <p className="text-xs text-slate-500">Please add items to your cart before proceeding to checkout.</p>
        <Link to="/products" className="inline-block px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg">
          Explore Products
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        session_id: getSessionId(),
        device_type: getDeviceType(),
        user_id: user ? user.id : null,
        shipping_name: shippingName,
        shipping_city: shippingCity,
        shipping_pincode: shippingPincode,
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        coupon_code: coupon,
        items: cart.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          size: item.size,
        })),
      };

      const res = await fetch('/api/orders/checkout/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const orderData = await res.json();
        clearCart();
        navigate(`/order-confirmation/${orderData.order_id}`, { state: { order: orderData } });
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'Failed to place simulated order. Please try again.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMsg('Network error. Make sure backend server is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 font-heading">
          Simulated Checkout
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Enter shipping details and choose a mock payment method to finalize order.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Shipping & Payment Steps */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Step 1: Shipping Address */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 font-heading">
              <MapPin className="w-4 h-4 text-rose-600" />
              1. Delivery Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={shippingName}
                  onChange={(e) => setShippingName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">City / State</label>
                <input
                  type="text"
                  required
                  value={shippingCity}
                  onChange={(e) => setShippingCity(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500 font-medium"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-semibold text-slate-700">Street Address</label>
                <input
                  type="text"
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Pincode</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={shippingPincode}
                  onChange={(e) => setShippingPincode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Payment Simulator */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 font-heading">
              <CreditCard className="w-4 h-4 text-indigo-600" />
              2. Simulated Payment Method
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {[
                { id: 'UPI', label: 'UPI (Instant)', desc: 'GPay / PhonePe / Paytm' },
                { id: 'Card', label: 'Credit / Debit Card', desc: 'Visa / Mastercard' },
                { id: 'NetBanking', label: 'Net Banking', desc: 'All Major Banks' },
                { id: 'COD', label: 'Cash on Delivery', desc: 'Pay at Doorstep' },
              ].map((m) => {
                const isSelected = paymentMethod === m.id;
                return (
                  <label
                    key={m.id}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={m.id}
                        checked={isSelected}
                        onChange={() => setPaymentMethod(m.id)}
                        className="hidden"
                      />
                      <span className="font-bold text-slate-900 block">{m.label}</span>
                      <span className="text-[10px] text-slate-500 mt-0.5 block">{m.desc}</span>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 mt-2" />
                    )}
                  </label>
                );
              })}
            </div>

            <div className="p-3 rounded-lg bg-indigo-50/60 border border-indigo-100 text-[11px] text-indigo-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>
                Simulated Gateway: Clicking "Place Order" writes confirmed records and logs <strong>purchase_completed</strong> telemetry events.
              </span>
            </div>
          </div>
        </div>

        {/* Right: Order Review & Place Order */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-heading">
              Order Items ({cart.length})
            </h4>

            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={`${item.product.id}-${item.size}`} className="flex items-center gap-3 text-xs">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-12 h-14 object-cover rounded-lg bg-slate-100 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900 truncate">{item.product.name}</p>
                    <p className="text-slate-500 text-[11px]">Size: {item.size} • Qty: {item.quantity}</p>
                    <p className="font-bold text-slate-900">₹{parseInt(item.product.price).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{rawSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Discount ({coupon})</span>
                <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
                <span>Total Payable</span>
                <span>₹{Math.round(grandTotal).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-600/25 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Confirming Order...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-rose-200" />
                  <span>Place Simulated Order</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
