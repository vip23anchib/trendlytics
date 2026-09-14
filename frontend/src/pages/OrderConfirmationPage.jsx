import React, { useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { 
  CheckCircle, Truck, BarChart3, 
  ShoppingBag 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const order = location.state?.order;

  useEffect(() => {
    // Fire celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#6366f1', '#10b981', '#f59e0b'],
      });
    } catch (e) {}
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Success Hero */}
      <div className="text-center space-y-3 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle className="w-9 h-9" />
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
          Order Confirmed
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
          Thank You For Your Order!
        </h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Your simulated purchase has been written to the database and logged to the <strong>purchase_completed</strong> telemetry pipeline.
        </p>

        <div className="pt-2 text-xs font-mono text-slate-700 bg-slate-50 py-2 px-4 rounded-xl inline-block border border-slate-200">
          Order Reference: <strong className="text-slate-900 font-bold">{orderId}</strong>
        </div>
      </div>

      {/* Simulated Tracking Timeline */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 font-heading">
          <Truck className="w-4 h-4 text-slate-700" />
          Fulfillment Timeline
        </h3>

        <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2">
          <div className="space-y-1">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-xs font-bold">
              ✓
            </div>
            <p className="font-bold text-slate-900">Order Placed</p>
            <p className="text-[10px] text-slate-400">Just Now</p>
          </div>

          <div className="space-y-1">
            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto text-xs font-bold">
              2
            </div>
            <p className="font-bold text-slate-900">Express Packed</p>
            <p className="text-[10px] text-slate-400">Within 12 Hours</p>
          </div>

          <div className="space-y-1">
            <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xs font-bold">
              3
            </div>
            <p className="font-bold text-slate-900">Delivered</p>
            <p className="text-[10px] text-slate-400">In 2-3 Business Days</p>
          </div>
        </div>
      </div>

      {/* Next Steps CTA */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link
          to="/analytics"
          className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition"
        >
          <BarChart3 className="w-4 h-4" />
          <span>View In Product Analytics (/analytics)</span>
        </Link>

        <Link
          to="/products"
          className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-rose-600 text-white text-xs font-bold flex items-center justify-center gap-2 transition"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>
    </div>
  );
}
