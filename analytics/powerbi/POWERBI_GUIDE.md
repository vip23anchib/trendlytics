# Trendlytics Power BI Analytics Model & Dashboard Blueprint

This document defines the Star-Schema Data Model, DAX Measures, Visual Hierarchy, and setup instructions to build or reproduce the **Trendlytics Fashion Product Analytics & Experimentation Dashboard** in Microsoft Power BI or Tableau.

---

## 1. Star-Schema Data Model

```
                 +-------------------+
                 |    Dim_Users      |
                 +-------------------+
                 | PK: user_id       |
                 |     email         |
                 |     segment       |
                 |     is_returning  |
                 +---------+---------+
                           | 1
                           |
                           | *
                 +---------+---------+
                 |    Dim_Sessions   |
                 +-------------------+
                 | PK: session_id    |
                 | FK: user_id       |
                 |     device_type   |
                 | experiment_variant|
                 +----+---------+----+
                      | 1       | 1
                      |         |
                      | *       | *
+---------------------+--+   +--+---------------------+
|      Fact_Events       |   |      Fact_Orders       |
+------------------------+   +------------------------+
| PK: event_id           |   | PK: order_id           |
| FK: session_id         |   | FK: session_id         |
| FK: user_id            |   | FK: user_id            |
| FK: product_id         |   |     total_amount       |
|     event_type         |   |     discount_amount    |
|     search_query       |   |     delivery_fee       |
|     device_type        |   |     final_amount       |
|     timestamp          |   |     delivery_days      |
+------------+-----------+   |     payment_method     |
             | *             |     status             |
             |               +------------------------+
             | 1
+------------+-----------+
|     Dim_Products       |
+------------------------+
| PK: product_id         |
|     product_name       |
|     brand              |
|     category_name      |
|     price              |
|     delivery_days      |
|     popularity_score   |
+------------------------+
```

---

## 2. Core DAX Measures

### 2.1 Executive KPIs
```dax
Total_Sessions = DISTINCTCOUNT(Dim_Sessions[session_id])

Total_Users = DISTINCTCOUNT(Dim_Users[user_id])

Total_Orders = COUNTROWS(Fact_Orders)

Total_GMV = SUM(Fact_Orders[final_amount])

Average_Order_Value = DIVIDE([Total_GMV], [Total_Orders], 0)

Overall_Conversion_Rate = 
DIVIDE(
    CALCULATE(DISTINCTCOUNT(Fact_Events[session_id]), Fact_Events[event_type] = "purchase_completed"),
    [Total_Sessions],
    0
)
```

### 2.2 Funnel & Abandonment Metrics
```dax
Product_View_Sessions = CALCULATE(DISTINCTCOUNT(Fact_Events[session_id]), Fact_Events[event_type] = "product_view")

Cart_Add_Sessions = CALCULATE(DISTINCTCOUNT(Fact_Events[session_id]), Fact_Events[event_type] = "add_to_cart")

Checkout_Started_Sessions = CALCULATE(DISTINCTCOUNT(Fact_Events[session_id]), Fact_Events[event_type] = "checkout_started")

Purchase_Sessions = CALCULATE(DISTINCTCOUNT(Fact_Events[session_id]), Fact_Events[event_type] = "purchase_completed")

View_to_Cart_Rate = DIVIDE([Cart_Add_Sessions], [Product_View_Sessions], 0)

Cart_Abandonment_Rate = 
DIVIDE(
    [Cart_Add_Sessions] - [Purchase_Sessions],
    [Cart_Add_Sessions],
    0
)
```

### 2.3 Search & Discovery Metrics
```dax
Total_Searches = CALCULATE(COUNT(Fact_Events[event_id]), Fact_Events[event_type] = "search")

Search_CTR = 
DIVIDE(
    CALCULATE(DISTINCTCOUNT(Fact_Events[session_id]), Fact_Events[event_type] = "product_view", Fact_Events[search_query] <> BLANK()),
    [Total_Searches],
    0
)

Search_to_Purchase_CVR = 
DIVIDE(
    CALCULATE(DISTINCTCOUNT(Fact_Events[session_id]), Fact_Events[event_type] = "purchase_completed", Fact_Events[search_query] <> BLANK()),
    [Total_Searches],
    0
)
```

### 2.4 A/B Experimentation Metrics
```dax
Control_Search_CVR = 
CALCULATE(
    [Search_to_Purchase_CVR],
    Dim_Sessions[experiment_variant] = "control_keyword"
)

Treatment_Search_CVR = 
CALCULATE(
    [Search_to_Purchase_CVR],
    Dim_Sessions[experiment_variant] = "treatment_ai_search"
)

Experiment_CVR_Uplift = 
DIVIDE(
    [Treatment_Search_CVR] - [Control_Search_CVR],
    [Control_Search_CVR],
    0
)
```

---

## 3. Power BI Dashboard Layout (4 Tab Canvas)

### Tab 1: Executive PM Overview
- **Header Card Tiles**: Total GMV (₹), Total Orders, AOV, Active Sessions, Overall Conversion Rate (%).
- **Funnel Visual**: 5-step horizontal funnel chart (Sessions -> Views -> Carts -> Checkouts -> Purchases).
- **Time Series Ribbon**: Daily GMV and Conversion Rate over past 30 days.

### Tab 2: Customer & Device Segmentation
- **Donut Chart**: Traffic share by Device Type (Mobile: ~62%, Desktop: ~33%, Tablet: ~5%).
- **Bar Chart**: Funnel Drop-off by Device (Highlights Mobile checkout drop-off).
- **Matrix Visual**: New vs Returning Customer performance (LTV, CVR, AOV).

### Tab 3: Search & Discovery Diagnostics
- **Table Visual**: Top 15 Search Queries with Search Volume, CTR %, and Zero-result flags.
- **Bar Chart**: Single-word keyword CTR (74%) vs Complex multi-intent queries (24% without AI).
- **Opportunity Matrix**: High view / low purchase products.

### Tab 4: A/B Experiment Monitor
- **Variant Comparison Cards**: Control vs Treatment metrics.
- **KPI Uplift Gauge**: Search-to-Purchase conversion uplift (+38.2%).
- **Guardrail Monitor**: P95 Latency (185ms), AOV stability, Return rate.

---

## 4. How to Refresh Data
1. Run `python analytics/generate_data.py` to simulate updated events.
2. Run `python analytics/powerbi/export_powerbi_dataset.py`.
3. In Power BI Desktop, click **Refresh** on the `data_model/` folder data source.
