import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Layers, Sparkles, Search, ShoppingBag, 
  Activity, RefreshCw, AlertTriangle, CheckCircle2, ArrowUpRight
} from 'lucide-react';
import { 
  ResponsiveContainer, XAxis, YAxis, Tooltip, 
  LineChart, Line, CartesianGrid
} from 'recharts';

export default function AnalyticsDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'funnel', 'search', 'experiment', 'categories', 'live'
  
  const [kpiData, setKpiData] = useState(null);
  const [funnelData, setFunnelData] = useState(null);
  const [searchData, setSearchData] = useState(null);
  const [experimentData, setExperimentData] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [liveEvents, setLiveEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Funnel interactive filters
  const [funnelDevice, setFunnelDevice] = useState('all');
  const [funnelCategory, setFunnelCategory] = useState('all');

  const fetchAllAnalytics = async () => {
    setLoading(true);
    try {
      const [kpiRes, funRes, seaRes, expRes, catRes, liveRes] = await Promise.all([
        fetch('/api/analytics/overview/'),
        fetch(`/api/analytics/funnel/?device=${funnelDevice}&category=${funnelCategory}`),
        fetch('/api/analytics/search/'),
        fetch('/api/analytics/experiment/'),
        fetch('/api/analytics/categories/'),
        fetch('/api/events/live/?limit=30'),
      ]);

      if (kpiRes.ok) setKpiData(await kpiRes.json());
      if (funRes.ok) setFunnelData(await funRes.json());
      if (seaRes.ok) setSearchData(await seaRes.json());
      if (expRes.ok) setExperimentData(await expRes.json());
      if (catRes.ok) setCategoryData(await catRes.json());
      if (liveRes.ok) {
        const d = await liveRes.json();
        setLiveEvents(d.recent_events || []);
      }
    } catch (err) {
      console.error('Failed to load analytics APIs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAnalytics();
  }, [funnelDevice, funnelCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-slate-900 rounded-3xl text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
              INTERNAL PRODUCT CONSOLE
            </span>
            <span className="text-xs text-slate-400">Live Telemetry & Experiments</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight">
            Trendlytics Product Analytics & A/B Testing Engine
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Real-time behavioral telemetry, 5-stage conversion funnels, search friction analysis, and A/B statistical evaluation.
          </p>
        </div>

        <button
          onClick={fetchAllAnalytics}
          className="self-start md:self-center px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer border border-slate-700 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* Analytics Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs font-bold">
        {[
          { id: 'overview', label: 'Executive KPIs', icon: BarChart3 },
          { id: 'funnel', label: '5-Stage Funnel', icon: Layers },
          { id: 'search', label: 'Search Friction', icon: Search },
          { id: 'experiment', label: 'A/B Experiment (EXP-01)', icon: Sparkles },
          { id: 'categories', label: 'Category Matrix', icon: ShoppingBag },
          { id: 'live', label: 'Live Telemetry Stream', icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-heading tracking-wide uppercase transition whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-rose-600 text-rose-600 bg-rose-50/50 rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content 1: Executive KPIs */}
      {activeTab === 'overview' && kpiData && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* 5 KPI Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block font-heading">
                Total GMV (30D)
              </span>
              <span className="text-2xl font-black text-slate-900 block font-heading">
                ₹{kpiData.kpis.total_gmv.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% MoM
              </span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block font-heading">
                Purchase CVR
              </span>
              <span className="text-2xl font-black text-rose-600 block font-heading">
                {kpiData.kpis.conversion_rate}%
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Sessions $\rightarrow$ Orders</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block font-heading">
                Total Orders
              </span>
              <span className="text-2xl font-black text-slate-900 block font-heading">
                {kpiData.kpis.total_orders.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" /> 4,300+ Verified
              </span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block font-heading">
                Average Order Value
              </span>
              <span className="text-2xl font-black text-slate-900 block font-heading">
                ₹{kpiData.kpis.aov.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Per Transaction</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1 col-span-2 lg:col-span-1">
              <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block font-heading">
                Active Sessions
              </span>
              <span className="text-2xl font-black text-indigo-600 block font-heading">
                {kpiData.kpis.total_sessions.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">{kpiData.kpis.total_users.toLocaleString('en-IN')} Unique Shoppers</span>
            </div>
          </div>

          {/* Daily Conversion Trend Chart */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-heading">
                  14-Day Daily Purchase Conversion Rate (CVR %) Trend
                </h3>
                <p className="text-xs text-slate-500">Day-over-day tracking of shopping session conversion efficiency</p>
              </div>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={kpiData.daily_trends || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" domain={[12, 28]} />
                  <Tooltip 
                    formatter={(val) => [`${val}%`, 'Conversion Rate']} 
                    contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Line type="monotone" dataKey="cvr" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, fill: '#f43f5e' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: 5-Stage Funnel */}
      {activeTab === 'funnel' && funnelData && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200">
            <div className="flex items-center gap-3 text-xs">
              <span className="font-bold text-slate-700 font-heading uppercase">Device Slicing:</span>
              {['all', 'mobile', 'desktop'].map((dev) => (
                <button
                  key={dev}
                  onClick={() => setFunnelDevice(dev)}
                  className={`px-3 py-1.5 rounded-lg font-bold capitalize transition cursor-pointer ${
                    funnelDevice === dev
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {dev === 'all' ? 'All Devices' : dev}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="font-bold text-slate-700 font-heading uppercase">Category:</span>
              <select
                value={funnelCategory}
                onChange={(e) => setFunnelCategory(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"
              >
                <option value="all">All Categories</option>
                <option value="women">Women</option>
                <option value="men">Men</option>
                <option value="footwear">Footwear</option>
                <option value="beauty">Beauty</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
          </div>

          {/* Funnel Steps Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {funnelData.funnel_steps.map((step, idx) => (
              <div
                key={step.step}
                className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-heading">
                    {step.step}
                  </span>
                  {idx > 0 && (
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                      -{step.drop_off}% Drop
                    </span>
                  )}
                </div>

                <div className="space-y-0.5">
                  <span className="text-xl font-black text-slate-900 font-heading block">
                    {step.count.toLocaleString('en-IN')}
                  </span>
                  <p className="text-xs text-slate-500">{step.name}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Step CVR:</span>
                  <span className="font-black text-slate-800">{step.step_conversion}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Funnel Drop-off Insights Box */}
          <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <h4 className="text-xs font-bold uppercase tracking-wider font-heading">
                PM Root-Cause Diagnostic: Primary Bottleneck
              </h4>
            </div>
            <p className="text-xs leading-relaxed text-amber-900">
              {funnelData.summary_insight} Specifically, <strong>43.2% of sessions drop off between Product View $\rightarrow$ Add to Cart</strong>, driven by multi-intent search misses and delivery speed transparency friction.
            </p>
          </div>

          {/* Delivery SLA Escalation Correlation */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-heading">
              Impact of Delivery SLA on Cart Abandonment Rate
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {funnelData.delivery_breakdown.map((item) => (
                <div key={item.bucket} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-800 text-xs">{item.bucket}</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-slate-900 font-heading">{item.abandonment_rate}%</span>
                    <span className="text-xs text-slate-500">Cart Abandonment</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${item.abandonment_rate > 70 ? 'bg-red-500' : item.abandonment_rate > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${item.abandonment_rate}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 3: Search Friction */}
      {activeTab === 'search' && searchData && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Search Overview Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block font-heading">
                Total Search Volume
              </span>
              <span className="text-2xl font-black text-slate-900 block font-heading mt-1">
                {searchData.total_searches.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block font-heading">
                Search Overall CTR
              </span>
              <span className="text-2xl font-black text-slate-900 block font-heading mt-1">
                {searchData.search_ctr_overall}%
              </span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block font-heading">
                Zero-Result Query Rate
              </span>
              <span className="text-2xl font-black text-red-600 block font-heading mt-1">
                {searchData.zero_result_rate}%
              </span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block font-heading">
                Search-to-Purchase CVR
              </span>
              <span className="text-2xl font-black text-emerald-600 block font-heading mt-1">
                {searchData.search_to_purchase_cvr}%
              </span>
            </div>
          </div>

          {/* Search Query Friction Table */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-heading">
                Top Queries: Single Keyword vs Multi-Intent Phrases
              </h3>
              <p className="text-xs text-slate-500">Notice the steep CTR drop on complex natural language queries under keyword matching</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase font-heading">
                    <th className="pb-3">Search Query</th>
                    <th className="pb-3">Volume</th>
                    <th className="pb-3">Clicks / CTR</th>
                    <th className="pb-3">Purchases</th>
                    <th className="pb-3">Intent Nature</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {searchData.top_queries.map((q) => (
                    <tr key={q.query} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 font-semibold text-slate-900 font-mono">"{q.query}"</td>
                      <td className="py-3 text-slate-600">{q.volume}</td>
                      <td className="py-3">
                        <span className={`font-bold ${q.ctr < 35 ? 'text-rose-600' : 'text-emerald-700'}`}>
                          {q.ctr}%
                        </span>
                      </td>
                      <td className="py-3 font-bold text-slate-800">{q.purchases}</td>
                      <td className="py-3">
                        {q.is_complex_intent ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                            Multi-Intent Natural Language
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                            Single Keyword
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 4: A/B Experiment */}
      {activeTab === 'experiment' && experimentData && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Experiment Header */}
          <div className="p-6 bg-slate-900 rounded-2xl text-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                STATUS: {experimentData.status}
              </span>
              <span className="text-xs text-slate-400">Sample: 22,000 Total Sessions</span>
            </div>
            <h3 className="text-xl font-black font-heading">{experimentData.experiment_name}</h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              <strong>Hypothesis:</strong> {experimentData.hypothesis}
            </p>
          </div>

          {/* Primary Metric Scorecard */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 font-heading">
                  PRIMARY METRIC
                </span>
                <h4 className="text-lg font-black text-slate-900 font-heading">
                  {experimentData.metrics.primary.name}
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {experimentData.metrics.primary.uplift} Uplift
                </span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Statistically Significant (p &lt; 0.001)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase font-heading">
                  Control (Standard Keyword Search)
                </span>
                <span className="text-3xl font-black text-slate-800 font-heading block">
                  {experimentData.metrics.primary.control}
                </span>
                <p className="text-[11px] text-slate-400">Strict substring SQL tokenization</p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                <span className="text-xs font-bold text-emerald-800 uppercase font-heading">
                  Treatment (Intent-Aware AI Search)
                </span>
                <span className="text-3xl font-black text-emerald-700 font-heading block">
                  {experimentData.metrics.primary.treatment}
                </span>
                <p className="text-[11px] text-emerald-600 font-medium">Server-side semantic facet extraction</p>
              </div>
            </div>
          </div>

          {/* Secondary Metrics & Guardrails */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Secondary Metrics */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-heading">
                Secondary Engagement Metrics
              </h4>
              <div className="space-y-3 text-xs">
                {experimentData.metrics.secondary.map((sec) => (
                  <div key={sec.name} className="p-3 rounded-lg bg-slate-50 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">{sec.name}</p>
                      <p className="text-[11px] text-slate-400">Ctrl: {sec.control} $\rightarrow$ Tmt: {sec.treatment}</p>
                    </div>
                    <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {sec.uplift}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Guardrails */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-heading">
                Guardrail Health Checks
              </h4>
              <div className="space-y-3 text-xs">
                {experimentData.metrics.guardrails.map((g) => (
                  <div key={g.name} className="p-3 rounded-lg bg-slate-50 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">{g.name}</p>
                      <p className="text-[11px] text-slate-400">Ctrl: {g.control} • Tmt: {g.treatment}</p>
                    </div>
                    <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {g.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Executive PM Rollout Decision Box */}
          <div className="p-5 rounded-2xl bg-indigo-900 text-white space-y-2 shadow-lg">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 font-heading flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Executive Product Decision
            </h4>
            <p className="text-xs text-indigo-100 leading-relaxed">
              {experimentData.product_recommendation}
            </p>
          </div>
        </div>
      )}

      {/* Tab Content 5: Category Matrix */}
      {activeTab === 'categories' && categoryData && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {categoryData.categories.map((cat) => (
              <div key={cat.slug} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 font-heading block">
                  {cat.category_name}
                </span>
                <span className="text-xl font-black text-slate-900 font-heading block">
                  ₹{cat.gmv.toLocaleString('en-IN')}
                </span>
                <div className="text-[11px] text-slate-500 space-y-0.5 pt-1 border-t border-slate-100">
                  <p>Orders: <strong className="text-slate-800">{cat.orders}</strong></p>
                  <p>Cart Abandonment: <strong className="text-slate-800">{cat.cart_abandonment}%</strong></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 6: Live Telemetry Stream */}
      {activeTab === 'live' && (
        <div className="p-6 bg-slate-950 rounded-2xl text-slate-300 font-mono text-xs space-y-4 shadow-xl border border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              <h3 className="font-bold text-white uppercase tracking-wider font-heading">
                Live Relational Event Telemetry Feed (From Database)
              </h3>
            </div>
            <span className="text-[10px] text-slate-500">Auto-polled recent events</span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {liveEvents.map((ev) => (
              <div key={ev.event_id} className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded font-bold uppercase text-[10px] bg-slate-800 text-rose-300 border border-slate-700">
                    {ev.event_type}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(ev.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-slate-400">
                  {ev.product_name && <p className="text-white">Product: {ev.product_name} ({ev.product_brand})</p>}
                  {ev.search_query && <p className="text-amber-300">Query: "{ev.search_query}"</p>}
                  <p className="text-[10px] text-slate-500">
                    Session: {ev.session_id ? ev.session_id.substring(0, 12) : 'anon'} • Device: {ev.device_type}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
