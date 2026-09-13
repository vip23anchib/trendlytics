# Trendlytics — Product Overview & System Architecture

### Fashion E-Commerce Product Analytics & Intent Discovery Platform
*Built as a Product Management & Technical Portfolio Showcase for Fashion Marketplaces (Inspired by Myntra, ASOS, and Zalando)*

---

## 1. Executive Summary

In fast-fashion and lifestyle e-commerce, discovering the right product with nuanced personal intent (e.g. style, occasion, seasonal fabric, budget) is the single biggest determinant of shopping friction. Traditional keyword search engines rely on strict string tokenization, causing up to **35% of natural language fashion queries to fail (zero results or irrelevant suggestions)**.

**Trendlytics** is an end-to-end full-stack fashion marketplace built with a tightly integrated **First-Party Product Telemetry & Behavioral Analytics Engine**. It demonstrates the complete closed-loop product management lifecycle:

$$\text{Telemetry Events} \longrightarrow \text{SQL / Funnel Analysis} \longrightarrow \text{Root-Cause Diagnostic} \longrightarrow \text{Product Hypothesis} \longrightarrow \text{AI Search Solution} \longrightarrow \text{A/B Experiment} \longrightarrow \text{PM Decision}$$

---

## 2. The Central Product Loop

```
                        +----------------------------+
                        |  1. USER BEHAVIOR (Store)  |
                        +--------------+-------------+
                                       |
                                       v
                        +----------------------------+
                        | 2. FIRST-PARTY TELEMETRY   |
                        |    (14 Behavioral Events)  |
                        +--------------+-------------+
                                       |
                                       v
                        +----------------------------+
                        | 3. SQL & PYTHON ANALYTICS  |
                        |    (Funnel & Drop-off Deep)|
                        +--------------+-------------+
                                       |
                                       v
                        +----------------------------+
                        |  4. ROOT-CAUSE INSIGHT     |
                        | (Search Failure & Friction)|
                        +--------------+-------------+
                                       |
                                       v
                        +----------------------------+
                        | 5. PRODUCT HYPOTHESIS & PRD|
                        |  (Intent-Aware AI Search)  |
                        +--------------+-------------+
                                       |
                                       v
                        +----------------------------+
                        | 6. A/B EXPERIMENT (50/50)  |
                        |   Control vs Treatment     |
                        +--------------+-------------+
                                       |
                                       v
                        +----------------------------+
                        | 7. MEASUREMENT & ROLLOUT   |
                        |  (+38.2% Search CVR Uplift)|
                        +----------------------------+
```

---

## 3. Two Pillars of Trendlytics

### Side A: Customer-Facing E-Commerce Experience
- **Editorial Fashion Catalog**: 220+ curated fashion SKUs across Women, Men, Footwear, Beauty, and Accessories.
- **Faceted Discovery Engine**: Filter by category, price bands, brand, color, occasion, season, material, rating, and discount.
- **Rich Product Detail Pages (PDP)**: Interactive size selection, color switcher, delivery speed calculator, dynamic inventory badges, and attribute-based "Similar Products" and "Recommended for You" algorithms.
- **Seamless Simulated Checkout**: Multi-step delivery address selection, coupon discount engine (`TREND20`, `FIRST500`), simulated payment methods (UPI, Cards, NetBanking, COD), and instant order tracking.
- **Persona Switcher**: Instant toggling between *High-Intent Shopper*, *Budget Hunter*, *Luxury Seeker*, and *First-Time Visitor* for live interview demonstrations.

### Side B: Product Analytics & Telemetry Engine
- **First-Party Telemetry SDK**: Client-side event logging pipeline capturing 14 distinct lifecycle actions with session, device, and metadata context.
- **Synthetic Behavioral Engine (`generate_data.py`)**: 6,000+ realistic users, 22,000+ sessions, and 112,000+ telemetry events modeling real-world drop-offs, mobile checkout friction, and delivery delay abandonment.
- **In-App PM Console (`/analytics`)**: Real-time KPI summaries, interactive 5-stage conversion funnel with device and category slice-and-dice, search friction monitor, A/B test statistical dashboard, and live real-time event debugger.
- **SQL Analytics Suite**: 15 production-grade SQL scripts answering core marketplace questions.
- **BI Star Schema**: Power BI & Tableau ready data model with comprehensive DAX measures.

---

## 4. Technology Stack

| Layer | Technologies Used | Rationale |
|---|---|---|
| **Frontend Storefront** | React 19, Vite, Tailwind CSS, Lucide Icons, React Router | Modern, responsive, micro-animations, ultra-fast client performance. |
| **Backend & APIs** | Python 3.12, Django 6.0, Django REST Framework | Robust relational modeling, clean separation of concerns, high throughput. |
| **Data Layer** | SQLite (Dev) / PostgreSQL (Prod) | Full ACID compliance, indexing on session_id, event_type, and timestamp. |
| **Telemetry & Ingestion** | First-Party REST Telemetry Ingest (`/api/events/track/`) | Zero dependency on third-party ad-blockable cookies; reliable event capture. |
| **Analytics & Data Science** | Python, Pandas, NumPy, Matplotlib | Exploratory data analysis, funnel analysis, and hypothesis testing. |
| **GenAI / Smart Search** | Gemini 1.5 Flash API + Deterministic NLP Rule Engine | Hybrid natural language intent extraction with zero downtime fallback. |
| **Business Intelligence** | Microsoft Power BI / DAX Star-Schema | Executive KPI reporting and drill-down multidimensional analytics. |
