# Trendlytics — Product Decision & PRD Document

---

# 1. Product Problem

### What user problem did we identify?
Users looking for specific fashion items often think in natural language concepts (e.g. *"red heels for party wear under 3500"* or *"linen shirts for summer"*). 

When they search using natural language strings:
1. Standard keyword search does literal substring matching, returning **zero results** (34.8% failure rate) or irrelevant products.
2. The user is forced to manually re-search, navigate multiple category menus, and apply 4–5 individual faceted filters.
3. This creates friction, causing **48% of high-intent searchers to abandon the session**.

---

# 2. Evidence from Data

* **Search Telemetry**: 32% of all search queries contain $\ge 3$ words combining occasion, color, category, or price constraints.
* **Conversion Gap**: Single keyword search yields **4.2% Search-to-Purchase CVR**, whereas multi-word natural language search drops to **1.4% CVR**.
* **Zero-Result Rate**: 14.2% overall zero-result rate, heavily concentrated in natural language queries.

---

# 3. User Segmentation

| Segment | Search Behavior | Failure Rate | Impact on GMV |
|---|---|---|---|
| **Trendsetters & High-Intent** | Highly specific phrases (e.g. "emerald satin slip dress") | 38% Zero-result | High revenue loss |
| **Occasion / Wedding Shoppers** | Multi-attribute constraints (color + event + budget) | 44% Zero-result | High AOV loss |
| **Budget Hunters** | Price-anchored queries ("...under 2000", "...below 1500") | 29% Zero-result | Volume loss |

---

# 4. Hypothesis

> **Hypothesis**: Implementing **Intent-Aware Natural Language Search** powered by server-side semantic entity extraction will:
> 1. Reduce zero-result search queries from **14.2% to < 3%**.
> 2. Increase Search Click-Through Rate (CTR) from **58% to > 70%**.
> 3. Increase Search-to-Purchase Conversion Rate by **$\ge 25\%$**, unlocking incremental GMV.

---

# 5. Possible Solutions Considered

1. **Option A: Intent-Aware Natural Language Search (GenAI / Semantic Parser)**
   - Server-side parsing of unstructured query into structured facet objects (`{ color, category, occasion, season, max_price }`) + hybrid catalog ranking.
2. **Option B: One-Click Express Delivery Badge on PDP**
   - Delivery date transparency pills on listing cards to address the 5+ day delivery abandonment.
3. **Option C: 1-Click Guest Checkout with Address Autofill**
   - Streamlining mobile checkout form steps.

---

# 6. Prioritization (RICE Framework)

| Solution Option | Reach (R) | Impact (I) | Confidence (C) | Effort (E) | RICE Score $\left(\frac{R \times I \times C}{E}\right)$ | Rank |
|---|---|---|---|---|---|---|
| **Option A: Intent-Aware AI Search** | 85 (High Search Traffic) | 3.0 (Massive CVR Uplift) | 90% | 2.0 (Weeks) | **114.75** | **#1 (Selected)** |
| **Option B: Delivery Transparency** | 65 | 2.0 | 80% | 1.5 | **69.33** | **#2** |
| **Option C: 1-Click Checkout** | 45 (Cart Stage only) | 2.0 | 75% | 2.5 | **27.00** | **#3** |

---

# 7. Decision

**Selected Solution**: **Option A — Intent-Aware Natural Language AI Search Engine**.

### Why?
1. **Highest RICE score (114.75)** and directly addresses top-of-funnel discovery failure.
2. Searchers represent our **highest-intent customer segment**; recovering lost search traffic yields the highest marginal return per session.
3. Scalable architecture: Works across all 5 fashion categories with zero catalog manual tagging.

---

# 8. Success Metrics & Guardrails

### Primary KPI
- **Search $\rightarrow$ Purchase Conversion Rate** (Target: $\ge +25\%$ uplift).

### Secondary KPIs
- **Search CTR** (Target: $> 70\%$).
- **Zero-Result Rate** (Target: $< 3\%$).
- **Search-to-Cart Conversion** (Target: $> 18\%$).

### Guardrail Metrics
- **P95 Search Latency**: $\le 300\text{ ms}$ (enforced with server-side caching & fallback).
- **Return Rate**: $\le 20\%$ (ensuring accurate semantic matching).
- **AOV Stability**: $\ge \text{Baseline}$.

---

# 9. Tradeoffs & Mitigation

| Potential Risk / Tradeoff | Mitigation Strategy |
|---|---|
| **LLM API Latency Spike** | Fast JSON structured temperature 0.1 API call + instant local Deterministic Semantic NLP rule fallback engine. |
| **Hallucination Risk** | LLM only outputs structured query constraints; products are strictly queried from our Postgres catalog database. |
| **API Costs** | Cache frequent queries and tokenize common fashion taxonomy locally. |
