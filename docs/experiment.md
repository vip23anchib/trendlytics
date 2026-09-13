# Trendlytics — Product Experimentation & A/B Testing Design Doc

---

## 1. Experiment Overview

* **Experiment ID**: `EXP-2026-01`
* **Title**: Evaluating Intent-Aware AI Search vs Traditional Keyword Search
* **Target Surface**: Search Results Page (SLP) & Global Search Bar
* **Traffic Allocation**: 50% Control / 50% Treatment (Deterministic Session Hashing)
* **Duration**: 14 Days

---

## 2. Variants

### Control Variant (`control_keyword`)
- Standard substring and SQL `icontains` keyword matching across title and description.
- Strict multi-word matching (all tokens must match).

### Treatment Variant (`treatment_ai_search`)
- Server-side semantic intent extraction engine (Gemini 1.5 Flash + Local Deterministic NLP Parser).
- Unpacks complex queries into structured facet filters: `{ category, color, occasion, season, max_price, min_price, material }`.
- Hybrid catalog scoring and relaxed fallback on zero results.

---

## 3. Statistical Experiment Results

```
+------------------------------------+--------------------+--------------------+--------------------+--------------------+
| Metric                             | Control (Keyword)  | Treatment (AI)     | Absolute Delta     | Relative Uplift %  |
+------------------------------------+--------------------+--------------------+--------------------+--------------------+
| Sample Size (Sessions)             | 11,000             | 11,000             | -                  | -                  |
| Search Volume                      | 3,820              | 3,845              | +25                | +0.6%              |
| Search Click-Through Rate (CTR)    | 58.4%              | 76.8%              | +18.4%             | +31.5%             |
| Zero-Result Query Rate             | 14.2%              | 2.1%               | -12.1%             | -85.2% (WIN)       |
| Search-to-Cart Conversion          | 11.8%              | 19.4%              | +7.6%              | +64.4%             |
| Search-to-Purchase Conversion (KPI)| 3.2%               | 4.8%               | +1.6%              | +50.0% (PRIMARY)   |
| Average Order Value (AOV)          | ₹2,450             | ₹2,680             | +₹230              | +9.4%              |
| P95 Latency (Guardrail)            | 42 ms              | 185 ms             | +143 ms            | PASS (< 300ms SLA) |
+------------------------------------+--------------------+--------------------+--------------------+--------------------+
```

---

## 4. Hypothesis Testing & Statistical Significance

### Two-Sample Proportion Z-Test for Primary KPI (Search-to-Purchase CVR):
* **Control Sample**: $n_1 = 3820, x_1 = 122$ ($p_1 = 0.0319$)
* **Treatment Sample**: $n_2 = 3845, x_2 = 185$ ($p_2 = 0.0481$)
* **Pooled Proportion**: $\hat{p} = 0.0400$
* **Standard Error (SE)**: $SE = 0.00449$
* **Z-Score**: $Z = \frac{0.0481 - 0.0319}{0.00449} = \mathbf{3.61}$
* **P-Value**: $p = 0.00030 < 0.01$ (Statistically significant at 99.9% confidence level)

---

## 5. Rollout Decision

**Decision: 100% TRAFFIC ROLLOUT APPROVED.**

### Justification:
1. **Primary KPI (+50.0% conversion uplift)** achieved well beyond the required $+25\%$ threshold with overwhelming statistical significance ($p < 0.001$).
2. **Zero-Result Rate plummeted by 85.2%**, converting previously dead ends into active catalog exploration.
3. **Guardrails Intact**: P95 latency (185 ms) is well within the 300 ms SLA, and AOV increased by +9.4%.
