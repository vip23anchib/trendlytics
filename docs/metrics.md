# Trendlytics — Product Metrics & KPI Framework

This document establishes the product measurement framework, defining the North Star Metric, primary conversion KPIs, secondary engagement signals, and guardrail health metrics for Trendlytics.

---

## 1. Metric Hierarchy

```
                                +-----------------------------------+
                                |        NORTH STAR METRIC          |
                                | Gross Merchandise Value (GMV) / W |
                                +-----------------+-----------------+
                                                  |
                     +----------------------------+----------------------------+
                     |                                                         |
                     v                                                         v
      +-----------------------------+                           +-----------------------------+
      |      VOLUME DRIVERS         |                           |     EFFICIENCY DRIVERS      |
      +--------------+--------------+                           +--------------+--------------+
                     |                                                         |
        +------------+------------+                               +------------+------------+
        |                         |                               |                         |
        v                         v                               v                         v
+---------------+         +---------------+               +---------------+         +---------------+
| Total Sessions|         | Active Buyers |               | Conversion    |         | Average Order |
| (Traffic)     |         | (Retention)   |               | Rate (CVR %)  |         | Value (AOV)   |
+---------------+         +---------------+               +---------------+         +---------------+
```

---

## 2. Metric Catalog

### 2.1 North Star Metric
- **Metric Name**: Weekly Gross Merchandise Value (GMV)
- **Formula**: $\sum (\text{Order Items Quantity} \times \text{Item Final Price})$
- **Why It Matters**: Reflects the aggregate value delivered to shoppers and captured by the marketplace.

---

### 2.2 Primary Product KPIs

| Metric | Formula | Why It Matters | What a Rise Means | What a Decline Means |
|---|---|---|---|---|
| **Overall Purchase Conversion Rate (CVR)** | $\frac{\text{Sessions with Purchase}}{\text{Total Sessions}} \times 100$ | Primary measure of end-to-end user shopping efficiency. | Friction reduction, better targeting, higher purchase intent. | Broken funnel, discovery failure, checkout friction, high delivery times. |
| **Search-to-Purchase Conversion Rate** | $\frac{\text{Search Sessions with Purchase}}{\text{Total Search Sessions}} \times 100$ | Measures effectiveness of search discovery in converting intent into revenue. | Search accurately surfaces desired items matching customer intent. | Zero results, irrelevant product ranking, token mismatch. |
| **Product View to Cart Rate** | $\frac{\text{Sessions with Add to Cart}}{\text{Sessions with Product View}} \times 100$ | Measures product detail page (PDP) appeal, pricing fit, and clarity. | Strong product-market pricing fit, good imagery, transparent specs. | Price resistance, lack of size availability, high delivery latency. |
| **Cart Abandonment Rate** | $\frac{\text{Cart Add Sessions} - \text{Purchase Sessions}}{\text{Cart Add Sessions}} \times 100$ | Quantifies friction between intent to buy and final transaction. | High shipping fees, unexpected delivery dates, payment gateway friction. | Smooth checkout flow, trust in delivery timeliness, high coupon engagement. |

---

### 2.3 Secondary Engagement Metrics

| Metric | Formula | Definition & Purpose |
|---|---|---|
| **Search Click-Through Rate (CTR)** | $\frac{\text{Search Result Clicks}}{\text{Total Search Queries}} \times 100$ | Gauges relevancy of search listing page (SLP) results. |
| **Zero-Result Query Rate** | $\frac{\text{Searches Returning 0 SKUs}}{\text{Total Searches}} \times 100$ | Critical measure of search vocabulary gaps and strict parser failures. |
| **Average Order Value (AOV)** | $\frac{\text{Total GMV}}{\text{Total Orders}}$ | Measures customer basket size and willingness to cross-shop. |
| **Repeat Purchase Rate (30-Day)** | $\frac{\text{Users with } \ge 2 \text{ Orders}}{\text{Total Purchasing Users}} \times 100$ | Cohort retention metric indicating customer satisfaction and loyalty. |
| **Wishlist-to-Cart Conversion** | $\frac{\text{Wishlisted Items Added to Cart}}{\text{Total Wishlist Adds}} \times 100$ | Measures delayed conversion recovery from passive consideration. |

---

### 2.4 Guardrail Metrics (What We Must NOT Hurt)

| Guardrail Metric | Threshold / Target | Risk Monitored |
|---|---|---|
| **Search Latency (P95)** | $\le 300\text{ ms}$ | GenAI query parsing overhead must not degrade perceived site speed. |
| **30-Day Product Return Rate** | $\le 20.0\%$ | AI search must not misrepresent product attributes causing post-purchase remorse. |
| **AOV Degradation** | $\ge \text{Baseline } (\pm 3\%)$ | Recommendations and search filters must not cannibalize high-margin luxury basket value. |
| **Checkout Error Rate** | $\le 0.5\%$ | Payment gateway or address validation bugs during checkout. |
