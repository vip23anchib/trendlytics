import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, Sparkles, Clock, 
  Cpu, AlertTriangle, RefreshCw
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useExperiment } from '../context/ExperimentContext';
import { trackEvent } from '../utils/telemetry';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const { variant, isTreatment, toggleVariant } = useExperiment();

  const [inputVal, setInputVal] = useState(query);
  const [results, setResults] = useState([]);
  const [intentData, setIntentData] = useState(null);
  const [latencyMs, setLatencyMs] = useState(0);
  const [parserEngine, setParserEngine] = useState('');
  const [loading, setLoading] = useState(false);

  const sampleQueries = [
    'black floral maxi dress for summer wedding under 3000',
    'pastel peach lehenga silk blend',
    'oversized white linen shirt under 2000',
    'red party heels size 8',
    'summer cotton casual kurta below 1500',
    'charcoal wool blazer formal',
  ];

  useEffect(() => {
    if (!query.trim()) return;

    async function executeSearch() {
      setLoading(true);
      const startTime = performance.now();

      try {
        if (isTreatment) {
          // Treatment: Intent-Aware Natural Language Search API
          const res = await fetch('/api/search/ai/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: query.trim() }),
          });

          if (res.ok) {
            const data = await res.json();
            setResults(data.results || []);
            setIntentData(data.intent || {});
            setLatencyMs(data.execution_time_ms || Math.round(performance.now() - startTime));
            setParserEngine(data.parser_engine || 'Semantic Intent Parser');

            trackEvent('search_result_view', {
              searchQuery: query.trim(),
              metadata: {
                variant: 'treatment_ai_search',
                results_count: (data.results || []).length,
                latency_ms: data.execution_time_ms,
              },
            });
          }
        } else {
          // Control: Traditional Keyword Substring Matching API
          const res = await fetch(`/api/products/?search=${encodeURIComponent(query.trim())}`);
          if (res.ok) {
            const data = await res.json();
            setResults(data.results || []);
            setIntentData(null);
            setLatencyMs(Math.round(performance.now() - startTime));
            setParserEngine('Standard Keyword Substring Matcher (SQL icontains)');

            trackEvent('search_result_view', {
              searchQuery: query.trim(),
              metadata: {
                variant: 'control_keyword',
                results_count: (data.results || []).length,
                latency_ms: Math.round(performance.now() - startTime),
              },
            });
          }
        }
      } catch (err) {
        console.error('Search execution failed:', err);
      } finally {
        setLoading(false);
      }
    }

    executeSearch();
  }, [query, isTreatment]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    setSearchParams({ q: inputVal.trim() });
    trackEvent('search', {
      searchQuery: inputVal.trim(),
      metadata: { source: 'search_page_form', variant },
    });
  };

  const handlePillClick = (qText) => {
    setInputVal(qText);
    setSearchParams({ q: qText });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Bar Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 font-heading">
              Smart Fashion Discovery
            </span>
            <h1 className="text-xl font-black text-slate-900 font-heading">
              Search Results
            </h1>
          </div>

          {/* A/B Variant Interactive Switcher */}
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-600 pl-2">
              A/B Test Mode:
            </span>
            <button
              onClick={toggleVariant}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                isTreatment
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-amber-600 text-white shadow-xs'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isTreatment ? 'Treatment (Intent AI)' : 'Control (Keyword)'}</span>
            </button>
            <span className="text-[10px] text-slate-400 pr-2">(Click to test delta)</span>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder='Type natural phrase: e.g. "black floral maxi dress for summer wedding under 3000"'
            className="w-full pl-11 pr-28 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 shadow-inner"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-slate-900 hover:bg-rose-600 text-white rounded-lg text-xs font-bold transition"
          >
            Search
          </button>
        </form>

        {/* Sample Query Quick Pickers */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-slate-500 font-semibold">Test Natural Intent Queries:</span>
          {sampleQueries.map((s) => (
            <button
              key={s}
              onClick={() => handlePillClick(s)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            >
              "{s}"
            </button>
          ))}
        </div>
      </div>

      {/* Query Diagnostics & Intent Telemetry Banner */}
      {query && (
        <div className={`p-4 rounded-xl border transition ${
          isTreatment
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
            : 'bg-amber-50/70 border-amber-200 text-amber-950'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider text-white ${
                  isTreatment ? 'bg-emerald-600' : 'bg-amber-600'
                }`}>
                  {isTreatment ? 'AI Intent Parser Active' : 'Keyword Substring Active'}
                </span>
                <span className="text-xs font-bold">Query: "{query}"</span>
              </div>
              <p className="text-xs text-slate-600 flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-slate-500" />
                <span>Engine: <strong>{parserEngine}</strong></span>
                <span>•</span>
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Execution: <strong>{latencyMs} ms</strong></span>
              </p>
            </div>

            {/* Extracted Intent Attributes (in Treatment mode) */}
            {isTreatment && intentData && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-emerald-800">Extracted Intent:</span>
                {intentData.category && (
                  <span className="px-2 py-0.5 rounded-md bg-white text-emerald-800 text-xs font-bold border border-emerald-300">
                    Category: {intentData.category}
                  </span>
                )}
                {intentData.color && (
                  <span className="px-2 py-0.5 rounded-md bg-white text-emerald-800 text-xs font-bold border border-emerald-300">
                    Color: {intentData.color}
                  </span>
                )}
                {intentData.occasion && (
                  <span className="px-2 py-0.5 rounded-md bg-white text-emerald-800 text-xs font-bold border border-emerald-300">
                    Occasion: {intentData.occasion}
                  </span>
                )}
                {intentData.season && (
                  <span className="px-2 py-0.5 rounded-md bg-white text-emerald-800 text-xs font-bold border border-emerald-300">
                    Season: {intentData.season}
                  </span>
                )}
                {intentData.max_price && (
                  <span className="px-2 py-0.5 rounded-md bg-white text-emerald-800 text-xs font-bold border border-emerald-300">
                    Budget: ≤ ₹{intentData.max_price}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 font-heading">
          {results.length} Matches Found
        </h2>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="h-72 flex items-center justify-center text-slate-400">
          <div className="text-center space-y-2">
            <RefreshCw className="w-7 h-7 animate-spin text-rose-600 mx-auto" />
            <p className="text-xs font-medium">Analyzing search intent...</p>
          </div>
        </div>
      ) : results.length === 0 ? (
        <div className="p-10 rounded-2xl bg-white border border-slate-200 text-center space-y-4 max-w-lg mx-auto">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 font-heading">Zero Results in Current Mode</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {!isTreatment ? (
              <>
                Traditional keyword search failed on this multi-word query. 
                <strong className="block text-slate-800 mt-1">
                  Switch to the <span className="text-emerald-600 font-bold">Treatment (AI Intent)</span> variant above to see how natural language parsing resolves this!
                </strong>
              </>
            ) : (
              "No products found matching all constraints. Try adjusting budget or color filter."
            )}
          </p>
          {!isTreatment && (
            <button
              onClick={toggleVariant}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-md transition"
            >
              Switch to AI Intent Search (Treatment)
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
