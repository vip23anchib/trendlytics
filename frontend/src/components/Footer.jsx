import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Shield, Sparkles, Database, FileText, GitBranch, Terminal } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-sm mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand & Vision */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-600 to-indigo-600 flex items-center justify-center text-white font-black text-base shadow-md">
                TL
              </div>
              <span className="text-lg font-black tracking-tight text-white font-heading">
                TREND<span className="text-rose-500">LYTICS</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              An original full-stack fashion discovery marketplace & first-party product analytics platform built for the <strong>Myntra Product Management (PM) Internship</strong> portfolio.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400">
              <Shield className="w-3.5 h-3.5" />
              <span>Synthetic behavioral data for PM evaluation</span>
            </div>
          </div>

          {/* Customer Store */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 font-heading">
              Shop Collections
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/products?category=women" className="hover:text-white transition">Women Fashion & Kurtas</Link></li>
              <li><Link to="/products?category=men" className="hover:text-white transition">Men Casual & Formalwear</Link></li>
              <li><Link to="/products?category=footwear" className="hover:text-white transition">Footwear & Sneakers</Link></li>
              <li><Link to="/products?category=beauty" className="hover:text-white transition">Luxury Fragrances & Makeup</Link></li>
              <li><Link to="/products?category=accessories" className="hover:text-white transition">Handbags, Watches & Belts</Link></li>
              <li><Link to="/products?trending=true" className="hover:text-white transition">Trending Drops</Link></li>
            </ul>
          </div>

          {/* PM Analytics System */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 font-heading">
              Product Analytics Layer
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/analytics" className="text-rose-400 font-semibold hover:text-rose-300 flex items-center gap-1">
                  <BarChart3 className="w-3.5 h-3.5" />
                  In-App PM Console (/analytics)
                </Link>
              </li>
              <li><span className="text-slate-500">14-Event Telemetry Taxonomy</span></li>
              <li><span className="text-slate-500">5-Stage Conversion Funnel</span></li>
              <li><span className="text-slate-500">A/B Testing: AI Intent vs Keyword</span></li>
              <li><span className="text-slate-500">Power BI Star-Schema Dataset</span></li>
              <li><span className="text-slate-500">15 SQL Analytics Questions</span></li>
            </ul>
          </div>

          {/* PM Documentation & Architecture */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 font-heading">
              PM Case Study & Code
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <p className="font-semibold text-slate-200 text-[11px] mb-1">Architecture Summary:</p>
                <p className="text-[10px] text-slate-400">
                  React 19 + Tailwind + Django REST + 100k+ Synthetic Telemetry Events + Intent-Aware AI Search.
                </p>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                Zero proprietary Myntra branding or data used. 100% original implementation.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Trendlytics Platform. Designed for Fashion E-Commerce PM Portfolio Showcase.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>React + Vite</span>
            <span>•</span>
            <span>Django REST Framework</span>
            <span>•</span>
            <span>PostgreSQL Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
