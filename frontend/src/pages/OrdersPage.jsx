import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, Truck, ChevronRight, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getSessionId } from '../utils/telemetry';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const url = user ? `/api/orders/?user_id=${user.id}` : `/api/orders/?session_id=${getSessionId()}`;
        const res = await fetch(url);
        if (res.ok) {
          setOrders(await res.json());
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 font-heading">
          Order History & Tracking
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Review recent transactions and simulated delivery milestones.
        </p>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center text-slate-400 text-xs">
          Loading order history...
        </div>
      ) : orders.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <Package className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No orders placed yet</h3>
          <p className="text-xs text-slate-500">Items you purchase will appear here with simulated tracking statuses.</p>
          <Link to="/products" className="inline-block px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div key={ord.order_id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                <div className="flex items-center gap-2 font-mono">
                  <span className="font-bold text-slate-900">{ord.order_id}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {ord.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                  <span>Payment: {ord.payment_method}</span>
                  <span>•</span>
                  <span>Total: <strong className="text-slate-900 font-bold">₹{parseInt(ord.final_amount).toLocaleString('en-IN')}</strong></span>
                </div>
              </div>

              <div className="space-y-3">
                {ord.items && ord.items.map((it) => (
                  <div key={it.id} className="flex items-center gap-3 text-xs">
                    <img src={it.image_url} alt={it.product_name} className="w-12 h-14 object-cover rounded-lg bg-slate-100 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-900 truncate">{it.product_name}</p>
                      <p className="text-[11px] text-slate-500">{it.brand} • Size: {it.size} • Qty: {it.quantity}</p>
                      <p className="font-bold text-slate-900">₹{parseInt(it.unit_price).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
