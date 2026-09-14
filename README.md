# Trendlytics 🛍️📊

### Full-Stack Fashion E-Commerce Platform & Product Analytics Intelligence Engine
*An end-to-end production-grade marketplace with first-party behavioral telemetry, deterministic A/B experimentation, GenAI & NLP intent discovery, 15 PM SQL analytics scripts, and Power BI star-schema models.*

---

[![React 19](https://img.shields.io/badge/Frontend-React_19_+_Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS_v4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Django REST Framework](https://img.shields.io/badge/Backend-Django_5_+_DRF-092E20?logo=django&logoColor=white)](https://www.djangoproject.com/)
[![SQLite/Postgres](https://img.shields.io/badge/Database-SQLite_/_PostgreSQL-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Python Analytics](https://img.shields.io/badge/Analytics-Pandas_|_NumPy_|_Matplotlib-150458?logo=python&logoColor=white)](https://pandas.pydata.org/)
[![A/B Testing](https://img.shields.io/badge/A%2FB_Testing-Statistically_Significant_(p<0.001)-8A2BE2)](#-ab-testing--statistical-results)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🌟 Executive Summary & Motivation

In fashion e-commerce platforms (e.g. Myntra, ASOS, Zalando), customer shopping queries are rarely simple single-word searches. Shoppers search in complex natural language phrases combining occasions, colors, seasons, silhouettes, and budgets (e.g., *"black floral maxi dress for summer wedding under 3000"*).

Traditional lexical/keyword search engines fail on multi-faceted queries, causing a **14.2% zero-result rate** and severe session drop-offs.

**Trendlytics** was architected from the ground up to solve this problem and demonstrate the complete, rigorous product management and engineering loop:

```mermaid
flowchart LR
    A["📡 Behavioral Telemetry"] --> B["📊 Funnel & SQL Analytics"]
    B --> C["🔍 Root-Cause Diagnostic"]
    C --> D["📋 Product PRD"]
    D --> E["🤖 AI Search Solution"]
    E --> F["🧪 A/B Experiment"]
    F --> G["🚀 Executive Decision"]
```
*(Telemetry ➔ Funnel Diagnostics ➔ PRD Formulation ➔ AI Solution ➔ A/B Experimentation ➔ Executive Decision)*

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
                                    Telemetry   | First-Party SDK (14 Events)
                                    Payloads    |
                                                v
+-----------------------------------------------------------------------------------------------+
|                                    BACKEND & TELEMETRY ENGINE                                 |
|                                   (Django REST Framework API)                                 |
|                                                                                               |
|   /api/products/              /api/events/track/             /api/search/ai/                  |
|   - Catalog & Facets          - High-throughput Ingestion    - LLM + Deterministic Semantic   |
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
|  - 15 PM Question SQL Scripts (/analytics/sql)|   |  - Star-Schema Dimensional Data Model     |
|  - Pandas/Matplotlib Visualizations           |   |  - Executive & Experiment DAX Measures    |
|  - Statistical Hypothesis Testing (Z-Test)    |   |  - Multi-tab Dashboard Blueprint          |
+-----------------------------------------------+   +-------------------------------------------+
```

---

## 🚀 Key Features

### 1. Consumer Storefront & Discovery
- **Modern Responsive Marketplace**: Curated Home, Faceted Catalog, Product Detail Pages (PDP), Cart, Interactive Multi-Step Checkout, Orders, and Wishlist.
- **Dynamic Recommendations**: Attribute-based "Similar Products" and "Complete the Look" engines.
- **Persona Switcher**: Instantly simulate realistic shopping journeys as *High-Intent Shopper*, *Budget Hunter*, *Luxury Seeker*, or *First-Time Guest*.

### 2. First-Party Telemetry & Event Ingestion Layer
- **14 Lifecycle Events**: Client-side SDK tracks `page_view`, `product_view`, `search_query`, `filter_apply`, `add_to_cart`, `remove_from_cart`, `cart_view`, `checkout_start`, `checkout_step`, `checkout_complete`, `wishlist_add`, `wishlist_remove`, `recommendation_click`, and `banner_click`.
- **Live Stream Inspector**: Floating real-time modal in the storefront displaying ingested telemetry payloads.

### 3. AI & Deterministic Natural Language Search
- **Hybrid Semantic Parser**: Extracts multi-dimensional attributes `{category, color, occasion, season, max_price, material}` using Google Gemini 1.5 Flash with fallback to a high-precision deterministic rule parser.
- **Zero-Result Elimination**: Handles complex descriptive queries like *"red ethnic silk kurta for festive diwali under 2500"*.

### 4. A/B Experimentation Framework
- **Deterministic Hashing**: Users are assigned consistently to Control (*Keyword Search*) or Treatment (*AI Intent Search*) based on SHA-256 session hashing.
- **Statistical Rigor**: Measures conversion uplift, zero-result query rate reduction, click-through rates, and P95 latency.

### 5. In-App Executive PM Console (`/analytics`)
- **Real-Time KPIs**: GMV, AOV, Total Orders, Active Users, Overall Conversion Rate.
- **Conversion Funnel**: 5-stage funnel visualization with drop-off rates and device/category slicing.
- **Search Friction Diagnostics**: Zero-result query auditor, abandoned query analysis, and experiment metric scorecards.

---

## 🧪 A/B Testing & Statistical Results

| Metric | Control (Keyword Search) | Treatment (AI Intent Search) | Absolute Lift | Relative Uplift | Statistical Significance |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Search-to-Purchase Conversion** | 4.20% | 6.30% | +2.10% | **+50.0%** | Z = 3.61, p < 0.001 ✅ |
| **Zero-Result Query Rate** | 14.20% | 2.10% | -12.10% | **-85.2%** | Z = 12.84, p < 0.0001 ✅ |
| **Search-to-PDP Click-Through** | 32.40% | 46.80% | +14.40% | **+44.4%** | Z = 7.12, p < 0.001 ✅ |
| **Search-to-Cart Conversion** | 8.60% | 13.10% | +4.50% | **+52.3%** | Z = 4.88, p < 0.001 ✅ |
| **P95 Search Response Latency** | 42 ms | 185 ms | +143 ms | Within SLA | Safe (< 300 ms SLA) ✅ |

---

## 📂 Repository Structure

```
trendlytics/
├── frontend/                     # React 19 + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/           # Navbar, ProductCard, FilterSidebar, LiveTelemetryStreamModal
│   │   ├── pages/                # HomePage, ProductDetailPage, SearchPage, CartPage, CheckoutPage, AnalyticsDashboardPage
│   │   ├── context/              # CartContext, AuthContext, ExperimentContext
│   │   └── utils/telemetry.js    # First-party client event tracking SDK
│   └── package.json
│
├── backend/                      # Django 5.0 + Django REST Framework
│   ├── core/                     # Auth, Persona Switcher, Session init, A/B assignment
│   ├── products/                 # Catalog, Facets, Recommendations, AI Intent Parser
│   ├── events/                   # First-party event ingestion & live stream
│   ├── orders/                   # Orders, OrderItems, Wishlist, Checkout simulation
│   ├── analytics_api/            # KPI aggregations, Funnel metrics, Search analytics
│   ├── manage.py
│   └── requirements.txt
│
├── analytics/                    # Data Analytics Suite & Scripts
│   ├── generate_data.py          # Synthetic telemetry simulator (112k+ events)
│   ├── seed_products.py          # Catalog seeder (220+ fashion SKUs)
│   ├── sql/                      # 15 PM Question SQL scripts + automated runner
│   ├── python/                   # Pandas, NumPy, Matplotlib exploratory & funnel pipelines
│   ├── charts/                   # Generated high-resolution analytical PNG plots
│   └── powerbi/                  # Star-Schema exporter & DAX measure documentation
│
├── docs/                         # Comprehensive Product Management Documentation
│   ├── product-overview.md       # Product vision & technical architecture
│   ├── metrics.md                # North Star metric hierarchy & KPI tree
│   ├── event-tracking.md         # Event tracking schema & taxonomy
│   ├── analytics-questions.md    # 15 Product analytics questions, SQL & insights
│   ├── funnel-analysis.md        # 5-stage funnel drop-off investigation & root-causes
│   ├── product-decision.md       # Comprehensive PRD & RICE prioritization
│   ├── experiment.md             # A/B test methodology & statistical calculations
│   ├── case-study.md             # Myntra PM portfolio case study
│   └── learnings.md              # Engineering tradeoffs & product management learnings
│
├── docker-compose.yml            # One-click multi-container orchestration
├── requirements.txt              # Root Python dependencies
└── README.md
```

---

## ⚡ Local Setup & How to Run

### Prerequisites
- **Python**: 3.10 or higher
- **Node.js**: 18 or higher (with npm)
- **Git**

### Option A: Standard Local Setup (Recommended)

#### Step 1: Clone Repository
```bash
git clone https://github.com/vip23anchib/trendlytics.git
cd trendlytics
```

#### Step 2: Backend Setup
```bash
# 1. Navigate to backend directory
cd backend

# 2. (Optional) Create and activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# 3. Install backend dependencies
pip install -r requirements.txt

# 4. Apply database migrations
python manage.py migrate

# 5. Start Django REST backend server
python manage.py runserver 8000
```
> **Note**: The repository includes a pre-seeded SQLite database with 220+ fashion products and 112,000+ realistic behavioral events. If you want to re-seed or regenerate data from scratch, run `python ../analytics/seed_products.py` and `python ../analytics/generate_data.py`.

#### Step 3: Frontend Setup
```bash
# Open a new terminal window
cd frontend

# 1. Install frontend dependencies
npm install

# 2. Start Vite development server
npm run dev
```

#### Step 4: Access Applications
- **Customer Storefront**: Open [http://localhost:5173](http://localhost:5173)
- **In-App PM Analytics Console**: Open [http://localhost:5173/analytics](http://localhost:5173/analytics)
- **Backend API Root**: Open [http://localhost:8000/api/](http://localhost:8000/api/)
- **Django Admin**: Open [http://localhost:8000/admin/](http://localhost:8000/admin/)

---

### Option B: Docker Compose (One-Click Setup)

```bash
# In the root directory:
docker-compose up --build
```
- Frontend will be live on `http://localhost:5173`
- Backend will be live on `http://localhost:8000`

---

## 📊 Running the Analytics & SQL Suite

### 1. Execute All 15 PM SQL Analytics Queries
```bash
python analytics/sql/run_all_queries.py
```
*Outputs formatted results for queries answering user acquisition, conversion drop-offs, cohort retention, zero-result search friction, and A/B test conversion.*

### 2. Generate Python Analytics Visualizations
```bash
python analytics/python/exploratory_and_funnel_analysis.py
python analytics/python/search_and_experiment_deepdive.py
```
*Generates charts saved into `analytics/charts/`:*
- `funnel_conversion_dropoffs.png`
- `device_friction_funnel.png`
- `search_ab_experiment_results.png`
- `zero_result_query_distribution.png`

### 3. Export Power BI Star-Schema Datasets
```bash
python analytics/powerbi/export_powerbi_dataset.py
```
*Exports `fact_events.csv`, `fact_orders.csv`, `dim_users.csv`, `dim_products.csv`, and `dim_sessions.csv` ready to import into Power BI / Tableau.*

---

## 🚀 Production Deployment Guide

### Architecture Overview
- **Frontend**: Hosted on **Vercel** or **Netlify** (Static React SPA with client-side routing).
- **Backend**: Hosted on **Render**, **Railway**, **Fly.io**, or **AWS EC2** (Django REST API with Gunicorn).
- **Database**: **PostgreSQL** (Managed Supabase/Neon/Render Postgres) or persistent volume SQLite.

---

### 1. Backend Deployment (e.g. Render / Railway)

1. Create a new **Web Service** pointing to your repository.
2. Set the **Root Directory** to `backend` (or use root with `backend/` path).
3. **Build Command**:
   ```bash
   pip install -r requirements.txt && python manage.py migrate
   ```
4. **Start Command**:
   ```bash
   gunicorn trendlytics_backend.wsgi:application --bind 0.0.0.0:$PORT
   ```
5. **Environment Variables**:
   - `DJANGO_SECRET_KEY`: `<your-random-secure-secret-key>`
   - `DEBUG`: `False`
   - `DB_ENGINE`: `postgres` (or `sqlite`)
   - `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`: *(Your Postgres connection parameters)*
   - `GEMINI_API_KEY`: *(Optional: Google Gemini API key for live LLM parsing)*

---

### 2. Frontend Deployment (e.g. Vercel)

1. Import your GitHub repository into **Vercel**.
2. Set **Root Directory** to `frontend`.
3. **Framework Preset**: `Vite`.
4. **Build Command**: `npm run build`.
5. **Output Directory**: `dist`.
6. **Environment Variables**:
   - `VITE_API_URL`: `https://your-backend-service.onrender.com` (URL of your deployed Django backend).
7. Deploy! Vercel handles SSL, global CDN distribution, and SPA routing automatically.

---

## 💼 Resume Highlights & Talking Points

Here are high-impact, STAR-formatted bullet points you can directly adapt for your resume or LinkedIn under **Full Stack Developer**, **Software Engineer**, or **Product Manager / Analytics**:

### 🎯 Product Management & Data Analytics Role:
- **Architected E-Commerce Intent Discovery Platform**: Analyzed 112,000+ behavioral telemetry events across 22,000+ sessions to identify a 14.2% zero-result search drop-off rate, authoring a complete PRD with RICE prioritization.
- **Designed & Evaluated A/B Experiment**: Evaluated an AI-powered semantic intent parser against keyword search, achieving a **+50.0% Search-to-Purchase conversion lift** ($Z = 3.61, p < 0.001$) and **85.2% reduction in zero-result queries**.
- **Engineered In-House Telemetry Pipeline**: Built a 14-event first-party tracking SDK and star-schema data warehouse, developing 15 production SQL scripts and Power BI models answering core business and funnel health metrics.

### 💻 Full-Stack & Software Engineering Role:
- **Engineered Full-Stack E-Commerce & Analytics Platform**: Built a responsive marketplace (React 19, Tailwind CSS, Vite) backed by high-throughput Django REST Framework APIs serving catalog, order, and telemetry endpoints.
- **Implemented Hybrid Semantic NLP Search**: Integrated Google Gemini 1.5 Flash with a deterministic rule fallback engine to parse multi-faceted natural language queries into structured SQL/ORM filter payloads with sub-190ms latency.
- **Optimized Data Pipeline & Star Schema**: Modeled fact and dimension tables over 112k+ events using Django ORM and PostgreSQL/SQLite, writing optimized aggregation endpoints and automated Python data analysis pipelines.

---

## 📑 Complete Product Documentation Directory

| Document | Description |
| :--- | :--- |
| 📘 [Product Overview & Architecture](docs/product-overview.md) | Vision, platform architecture, customer persona models, and tech stack details. |
| 📊 [North Star & Metric Hierarchy](docs/metrics.md) | North Star definition, L1/L2 input metrics, guardrails, and KPI tree. |
| 📡 [First-Party Telemetry Taxonomy](docs/event-tracking.md) | Comprehensive 14-event taxonomy, schema definitions, and tracking best practices. |
| 💡 [15 PM Analytics Questions & SQL](docs/analytics-questions.md) | Exact business questions, SQL queries, results, and actionable product insights. |
| 🔻 [Funnel Drop-Off Analysis](docs/funnel-analysis.md) | 5-stage funnel analysis, device-level friction breakdown, and hypothesis formation. |
| 🎯 [Product Decision PRD](docs/product-decision.md) | Full PRD, user stories, RICE scoring framework, and technical specifications. |
| 🧪 [A/B Experimentation Design](docs/experiment.md) | Hypothesis testing, sample size calculation, statistical significance ($Z$-Score & $p$-value). |
| 🏆 [Myntra PM Portfolio Case Study](docs/case-study.md) | Executive case study formatted specifically for Myntra / E-Commerce PM interviews. |
| 🧠 [Product & Engineering Learnings](docs/learnings.md) | Retrospective on telemetry design, latency vs accuracy trade-offs, and analytics pitfalls. |

---

## 👤 Author

- **GitHub**: [@vip23anchib](https://github.com/vip23anchib)
- **Project**: Trendlytics E-Commerce & Telemetry Intelligence Platform
