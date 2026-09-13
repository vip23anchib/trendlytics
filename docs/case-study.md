# Trendlytics — Product Management Portfolio Case Study

*A Comprehensive Case Study on Eliminating Fashion Discovery Friction with Intent-Aware AI Search & Telemetry Analytics*

---

## 1. Context & Business Background
Fashion e-commerce is characterized by visual browsing, high consideration cycles, and fragmented customer intent. Unlike commodities where users search for an exact model number, fashion shoppers think in vibes, occasions, and constraints (e.g. *"black maxi dress for summer evening party under 3000"*).

---

## 2. The User & Problem Statement
* **User Archetype**: High-intent shoppers looking for specific combinations of style, color, occasion, and budget.
* **The Problem**: When users type natural language queries into standard keyword search bars, traditional token matchers fail on multi-word strings. This leads to high zero-result rates (14.2%) and session abandonment.

---

## 3. Data Investigation & Discovery
Using SQL and Python telemetry analysis on 22,000 user sessions and 112,000+ behavioral events:
1. **Search CTR disparity**: 1-word queries achieved 74.2% CTR, but $\ge 3$-word natural language queries slumped to 24.1% CTR.
2. **Funnel drop-off**: Searchers who received 0 results abandoned the app 82% of the time within 15 seconds.

---

## 4. Hypothesis & Solution Exploration
* **Hypothesis**: Replacing keyword string search with server-side AI Intent Extraction will eliminate zero-result dead ends and lift search conversion by $\ge 25\%$.
* **Options Evaluated**: 
  - Option A: GenAI/Semantic Intent Search (RICE: 114.75)
  - Option B: Delivery Time Transparency (RICE: 69.33)
  - Option C: 1-Click Guest Checkout (RICE: 27.00)

---

## 5. Experimentation & Execution (A/B Test)
An A/B experiment ran across 22,000 sessions (50% Control / 50% Treatment):
- **Treatment Result**:
  - **Zero-result queries reduced by 85.2%** (from 14.2% to 2.1%).
  - **Search-to-Purchase CVR surged +50.0%** (from 3.2% to 4.8%).
  - **Statistically Significant**: $Z = 3.61, p < 0.001$ ($99.9\%$ confidence).

---

## 6. Product Decision & Next Horizon
- **Shipped**: 100% rollout of Intent-Aware AI Search.
- **Next Horizon Roadmap**:
  1. **Visual Search & Outfit Matcher**: Enable image-to-catalog matching.
  2. **Delivery SLA Dynamic Badging**: Tackle the secondary finding (5+ day delivery abandonment).
