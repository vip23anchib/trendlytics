import React, { useState, useEffect } from 'react';
import { Activity, Radio, ChevronUp, ChevronDown, Trash2, ShieldCheck, Zap } from 'lucide-react';

export default function LiveTelemetryStreamModal() {
  const [events, setEvents] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const handleEvent = (e) => {
      const newEv = {
        ...e.detail,
        id: Math.random().toString(36).substring(2, 9),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };
      setEvents((prev) => [newEv, ...prev.slice(0, 40)]);
      setUnreadCount((c) => c + 1);
    };

    window.addEventListener('tl_telemetry_event', handleEvent);
    return () => window.removeEventListener('tl_telemetry_event', handleEvent);
  }, []);

  const eventColorMap = {
    session_start: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    homepage_view: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    category_view: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    search: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    search_result_view: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    product_view: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    add_to_cart: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    remove_from_cart: 'bg-red-500/20 text-red-400 border-red-500/30',
    wishlist_add: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    wishlist_remove: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    checkout_started: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    purchase_completed: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Expanded Stream Console */}
      {isOpen && (
        <div className="w-96 max-w-[95vw] h-96 bg-slate-950/95 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl flex flex-col mb-2 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading">
                First-Party Telemetry Stream
              </h4>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setEvents([])}
                className="p-1 text-slate-400 hover:text-rose-400 transition"
                title="Clear feed"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-white transition"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Events Log List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-xs font-mono">
            {events.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center p-4">
                <Radio className="w-6 h-6 mb-2 text-slate-600 animate-pulse" />
                <p>Waiting for user interactions...</p>
                <p className="text-[10px] text-slate-600 mt-1">Browse items, search, or add to cart to trigger live events.</p>
              </div>
            ) : (
              events.map((ev) => (
                <div
                  key={ev.id}
                  className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        eventColorMap[ev.event_type] || 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {ev.event_type}
                    </span>
                    <span className="text-[10px] text-slate-500">{ev.time}</span>
                  </div>

                  <div className="text-[11px] text-slate-300">
                    {ev.search_query && (
                      <p className="truncate">
                        <span className="text-slate-500">query:</span> "{ev.search_query}"
                      </p>
                    )}
                    {ev.product_id && (
                      <p>
                        <span className="text-slate-500">product_id:</span> #{ev.product_id}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-0.5">
                      <span>sess: {ev.session_id ? ev.session_id.substring(0, 8) : 'anon'}</span>
                      <span>•</span>
                      <span>dev: {ev.device_type}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Info */}
          <div className="px-3 py-1.5 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Direct POST to /api/events/track/
            </span>
            <span className="font-semibold text-slate-300">{events.length} tracked</span>
          </div>
        </div>
      )}

      {/* Floating Pill Toggle */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setUnreadCount(0);
        }}
        className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xl border border-slate-700 transition cursor-pointer group"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <Activity className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-12 transition" />
        <span>Live Telemetry</span>
        {events.length > 0 && (
          <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-bold">
            {events.length}
          </span>
        )}
        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
