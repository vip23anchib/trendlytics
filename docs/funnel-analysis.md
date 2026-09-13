# Trendlytics — Funnel Analysis & Root-Cause Investigation

---

## 1. Funnel Overview & Step-by-Step Conversion

The Trendlytics customer funnel tracks the user trajectory across 5 canonical stages:

$$\text{Sessions (100\%)} \xrightarrow{62.2\%} \text{Product Views (62.2\%)} \xrightarrow{56.8\%} \text{Add to Cart (35.3\%)} \xrightarrow{68.9\%} \text{Checkout (24.3\%)} \xrightarrow{81.9\%} \text{Purchase (19.9\%)}$$

```
+-----------------------------------------------------------------------------------+
| Funnel Stage           | Sessions Count | Stage Conversion | Step Drop-off %     |
+------------------------+----------------+------------------+---------------------+
| 1. Session Start       | 22,000         | 100.0%           | -                   |
| 2. Product Views       | 13,678         | 62.2%            | 37.8%               |
| 3. Add to Cart         | 7,769          | 56.8%            | 43.2% (Primary Leak)|
| 4. Checkout Started    | 5,353          | 68.9%            | 31.1%               |
| 5. Purchase Completed  | 4,393          | 81.9%            | 18.1%               |
+-----------------------------------------------------------------------------------+
```

---

## 2. Multi-Dimensional Root-Cause Breakdown

### Dimension 1: Device Type
- **Desktop**: 33% traffic, 21.8% CVR, 28.4% cart-to-checkout abandonment.
- **Mobile**: 62% traffic, 18.9% CVR, 42.1% cart-to-checkout abandonment.
- **Diagnosis**: Mobile users experience input fatigue during multi-step address and payment selection.

### Dimension 2: Promised Delivery SLA
- **1–2 Days (Express)**: 4.8% CVR, 38.4% cart abandonment.
- **3–4 Days (Standard)**: 3.1% CVR, 64.7% cart abandonment.
- **5+ Days (Delayed)**: 1.2% CVR, 82.5% cart abandonment.
- **Diagnosis**: Delivery timeline opacity or long fulfillment windows severely suppress purchase conversion.

### Dimension 3: Search Query Complexity & Intent Capture
- **Single Keyword Queries** (`dress`, `kurta`, `sneakers`): 74.2% CTR, 2.8% Zero-result rate, 4.2% Search CVR.
- **Multi-Attribute Natural Language Queries** (`black floral maxi dress for summer wedding under 3000`): 24.1% CTR, 34.8% Zero-result rate, 1.4% Search CVR.
- **Diagnosis**: **The single biggest scalable product opportunity** is Search & Discovery. 32% of users express multi-intent searches, but the standard keyword parser fails to interpret combinatorial filters (color + occasion + season + price ceiling), leading to catastrophic drop-offs.
