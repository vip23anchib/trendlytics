# Trendlytics 🛍️📊

### Fashion E-Commerce Product Analytics & Intent Discovery Platform
*An end-to-end full-stack marketplace and first-party product analytics engine showcasing Product Management, Behavioral Data Science, SQL Analytics, A/B Testing, and GenAI Search.*

---

## 🌟 Why I Built Trendlytics

In fashion e-commerce platforms (like Myntra, ASOS, and Zalando), customer intent is inherently multi-faceted: shoppers search in natural language combining occasions, colors, seasons, and budgets (e.g. *"black floral maxi dress for summer wedding under 3000"*).

Traditional keyword search engines fail on multi-word intent, causing high **zero-result query rates (14.2%)** and session abandonment.

**Trendlytics** was built from scratch to demonstrate the complete, rigorous product loop:
$$\text{User Telemetry} \longrightarrow \text{Funnel & SQL Analytics} \longrightarrow \text{Root-Cause Diagnostic} \longrightarrow \text{Product PRD} \longrightarrow \text{AI Search Solution} \longrightarrow \text{A/B Experiment} \longrightarrow \text{Executive Decision}$$

---

## 🏗️ System Architecture

```
                                  TRENDLYTICS ARCHITECTURE
                                  
+-----------------------------------------------------------------------------------------------+
|                                    CUSTOMER EXPERIENCE LAYER                                  |
|                                                                                               |
|  [ Storefront UI ]           [ Faceted Filters ]           [ Smart Search Bar ]               |
|  - Home / Trending           - Price, Brand, Color         - Keyword vs AI Intent (A/B)       |
|  - PDP & Recommendations     - Occasion, Season, Material  - Natural Language Parsing         |
|                                                                                               |
|  [ Cart & Checkout Flow ]    [ Persona Switcher ]          [ In-App PM Console (/analytics) ] |
|  - Multi-step simulated buy  - Demo User Profiles          - Executive KPIs & Live Debugger   |
+-----------------------------------------------+-----------------------------------------------+
                                                |
                                    Telemetry   | First-Party SDK
                                    Events (14) |
                                                v
+-----------------------------------------------------------------------------------------------+
|                                    BACKEND & TELEMETRY ENGINE                                 |
|                                   (Django REST Framework API)                                 |
|                                                                                               |
|   /api/products/              /api/events/track/             /api/search/ai/                  |
|   - Catalog & Facets          - High-throughput Ingestion    - LLM + Local NLP Intent Parser  |
|                                                                                               |
|   /api/orders/checkout/       /api/session/init/             /api/analytics/                  |
|   - Purchase simulation       - Deterministic A/B Hashing    - Funnel & Metric Aggregations   |
+-----------------------------------------------+-----------------------------------------------+
                                                |
                                                v
+-----------------------------------------------------------------------------------------------+
|                                        DATA & STORAGE                                         |
|                               (PostgreSQL / SQLite Database)                                  |
|                                                                                               |
|  - 6,000+ Users        - 22,000+ Sessions        - 112,000+ Behavioral Events                 |
|  - 220+ Fashion SKUs   - 4,300+ Orders           - 5 Star-Schema Tables                       |
+-----------------------------------------------+-----------------------------------------------+
                                                |
                        +-----------------------+-----------------------+
                        |                                               |
                        v                                               v
+-----------------------------------------------+   +-------------------------------------------+
|             SQL & PYTHON ANALYTICS            |   |               POWER BI / BI               |
|                                               |   |                                           |
|  - 15 PM Question SQL Scripts (/analytics/sql)|   |  - Star-Schema Data Model                 |
|  - Pandas/Matplotlib Visualizations           |   |  - Executive & Experiment DAX Measures    |
|  - Statistical Hypothesis Testing (Z-Test)    |   |  - Multi-tab Dashboard Blueprint          |
+-----------------------------------------------+   +-------------------------------------------+
```

---

## 🚀 Key Features

### 1. Customer E-Commerce Storefront
- **Responsive Marketplace**: Homepage, Product Listing, Product Detail Page (PDP), Cart, Simulated Multi-Step Checkout, Orders, and Wishlist.
- **Smart Discovery**: Real-time faceted filtering across 5 categories, brands, price sliders, colors, occasions, and seasons.
- **Dynamic Recommendations**: Attribute-based "Similar Products" and "Recommended for You" engines.
- **Demo Persona Switcher**: Instantly test user journeys as *High-Intent Shopper*, *Budget Hunter*, *Luxury Seeker*, or *First-Time Guest*.

### 2. First-Party Telemetry & Event Ingestion Layer
- 14 distinct lifecycle events captured automatically with session, device, and payload context.
- High-throughput endpoint (`/api/events/track/`) with live event streaming debugger.

### 3. Big Data Synthetic Telemetry Pipeline
- Generates 6,000+ realistic users, 22,000+ sessions, and 112,000+ behavioral events modeling real-world shopping patterns, mobile checkout friction, and delivery delay abandonment.

### 4. AI-Powered Natural Language Intent Search
- Server-side NLP engine (Gemini 1.5 Flash + Local Deterministic Semantic NLP rule fallback).
- Extracts structured shopping parameters: `{ category, color, occasion, season, max_price, material }`.

### 5. A/B Testing & Statistical Rigor
- Control (Keyword Search) vs Treatment (Intent-Aware AI Search).
- **Results**: $+50.0\%$ Search-to-Purchase conversion uplift ($Z = 3.61, p < 0.001$), $-85.2\%$ drop in zero-result queries, with P95 latency (185 ms) well within 300 ms SLA.

### 6. In-App PM Analytics Console (`/analytics`)
- Executive KPIs (GMV, AOV, Orders, Active Users, Overall Conversion Rate).
- Interactive 5-stage conversion funnel with slicing by device and category.
- Search friction auditor and live event stream.

---

## 📂 Project Structure

```
trendlytics/
│
├── frontend/                     # React 19 + Vite + Tailwind CSS + Lucide
│   ├── src/
│   │   ├── components/           # Navbar, ProductCard, FilterSidebar, EventDebugger
│   │   ├── pages/                # Home, Products, ProductDetail, Search, Cart, Checkout, Analytics
│   │   ├── context/              # CartContext, AuthContext, TelemetryContext
│   │   └── utils/telemetry.js    # First-party client event tracking SDK
│
├── backend/                      # Django 6.0 + Django REST Framework
│   ├── core/                     # Auth, Sessions, A/B Experiment assignment
│   ├── products/                 # Products, Categories, Recommendations, AI Search Parser
│   ├── events/                   # First-party event ingestion & live stream
│   ├── orders/                   # Orders, OrderItems, Wishlist, Checkout simulation
│   └── analytics_api/            # KPI aggregations, Funnel metrics, Search analytics
│
├── analytics/                    # Data Analytics Suite
│   ├── generate_data.py          # Synthetic telemetry simulator (100k+ events)
│   ├── seed_products.py          # Catalog seeder (220+ fashion SKUs)
│   ├── sql/                      # 15 PM Question SQL queries + test runner
│   ├── python/                   # Pandas, NumPy, Matplotlib analysis & charts
│   ├── charts/                   # Generated PNG analytical plots
│   └── powerbi/                  # Star-Schema exporter & DAX measure guide
│
├── docs/                         # Product Management Documentation
│   ├── product-overview.md       # Product vision & architecture
│   ├── metrics.md                # North Star & KPI hierarchy
│   ├── event-tracking.md         # Telemetry taxonomy & schema
│   ├── analytics-questions.md    # 15 Product questions & answers
│   ├── funnel-analysis.md        # Multi-dimensional funnel investigation
│   ├── product-decision.md       # Structured PRD & RICE prioritization
│   ├── experiment.md             # A/B testing design & statistical results
│   ├── case-study.md             # Myntra PM portfolio case study
│   └── learnings.md              # Engineering tradeoffs & analytics lessons
│
├── data/                         # Exported CSV datasets (events, orders, products)
├── README.md
└── .env.example
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 2. Backend Setup
```bash
# Navigate to backend
cd backend

# Run database migrations
python manage.py migrate

# Seed 220+ fashion products catalog
python ../analytics/seed_products.py

# Generate 100k+ realistic behavioral events
python ../analytics/generate_data.py

# Start Django backend server
python manage.py runserver 8000
```

### 3. Frontend Setup
```bash
# Open new terminal in frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
Open **`http://localhost:5173`** in your browser to experience Trendlytics!

---

## 📊 Running Product Analytics Suite

### Run all 15 SQL Queries
```bash
python analytics/sql/run_all_queries.py
```

### Generate Python Analytics & Charts
```bash
python analytics/python/exploratory_and_funnel_analysis.py
python analytics/python/search_and_experiment_deepdive.py
```

### Export Power BI Star-Schema Tables
```bash
python analytics/powerbi/export_powerbi_dataset.py
```

---

## 📑 PM Documentation Directory
- 📘 [Product Overview & Architecture](file:///f:/my%20projects%202026/trendlytics/docs/product-overview.md)
- 📊 [North Star & Metric Hierarchy](file:///f:/my%20projects%202026/trendlytics/docs/metrics.md)
- 📡 [First-Party Telemetry Taxonomy](file:///f:/my%20projects%202026/trendlytics/docs/event-tracking.md)
- 💡 [15 Product Analytics Questions & SQL](file:///f:/my%20projects%202026/trendlytics/docs/analytics-questions.md)
- 🔻 [Funnel Drop-Off & Root-Cause Analysis](file:///f:/my%20projects%202026/trendlytics/docs/funnel-analysis.md)
- 🎯 [Product Decision PRD (RICE Framework)](file:///f:/my%20projects%202026/trendlytics/docs/product-decision.md)
- 🧪 [A/B Experimentation & Statistical Results](file:///f:/my%20projects%202026/trendlytics/docs/experiment.md)
- 🏆 [Myntra PM Portfolio Case Study](file:///f:/my%20projects%202026/trendlytics/docs/case-study.md)
- 🧠 [Product & Engineering Learnings](file:///f:/my%20projects%202026/trendlytics/docs/learnings.md)

---

## 👤 Author
**Final-Year Computer Science Engineering Student**  
*Aspiring Product Manager @ Myntra / E-Commerce Marketplaces*
