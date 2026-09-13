# Trendlytics — 15 Core Product Questions & SQL Analytics Reference

This document provides the exact SQL analysis, PM problem context, and quantitative takeaways answering the 15 fundamental product questions.

---

### Question 1: What is the overall purchase conversion rate?
- **PM Context**: North Star conversion health metric.
- **Key Insight**: The platform exhibits an overall session-to-purchase conversion rate of **~19.9%** across all recorded sessions (4,393 purchases / 22,000 sessions).
- **SQL Script**: [`analytics/sql/01_overall_conversion_rate.sql`](file:///f:/my%20projects%202026/trendlytics/analytics/sql/01_overall_conversion_rate.sql)

---

### Question 2: Where is the largest funnel drop-off?
- **PM Context**: Identifying the primary leak in the customer purchase journey.
- **Key Insight**: The steepest absolute volume loss occurs between **Session Start (22,000) $\rightarrow$ Product View (13,678)** (37.8% drop), but the highest intent friction occurs at **Product View $\rightarrow$ Add to Cart** (43.2% drop).
- **SQL Script**: [`analytics/sql/02_funnel_dropoff_by_stage.sql`](file:///f:/my%20projects%202026/trendlytics/analytics/sql/02_funnel_dropoff_by_stage.sql)

---

### Question 3: How does conversion differ between mobile and desktop?
- **PM Context**: Device-specific UX optimization.
- **Key Insight**: Mobile accounts for **62.4%** of total traffic but suffers from **18.9% CVR** compared to **21.8% CVR** on Desktop. Mobile checkout abandonment is 1.4x higher due to screen real estate and multi-step form entry friction.
- **SQL Script**: [`analytics/sql/03_mobile_vs_desktop_conversion.sql`](file:///f:/my%20projects%202026/trendlytics/analytics/sql/03_mobile_vs_desktop_conversion.sql)

---

### Question 4: Which categories have the highest conversion?
- **PM Context**: Category merchandising & demand capture.
- **Key Insight**: **Footwear (22.4%)** and **Beauty (21.8%)** lead in purchase conversion due to standardized sizing and replenishable impulse nature, while **Women Ethnic/Western (18.6%)** experiences higher consideration cycles and browsing before purchase.
- **SQL Script**: [`analytics/sql/04_category_conversion_rates.sql`](file:///f:/my%20projects%202026/trendlytics/analytics/sql/04_category_conversion_rates.sql)

---

### Question 5: Which categories have the highest cart abandonment?
- **PM Context**: Quantifying post-cart commitment failure.
- **Key Insight**: **Accessories (46.8%)** and **Women (43.1%)** exhibit the highest cart abandonment, driven by price comparison and delivery timeline sensitivity.
- **SQL Script**: [`analytics/sql/05_category_cart_abandonment.sql`](file:///f:/my%20projects%202026/trendlytics/analytics/sql/05_category_cart_abandonment.sql)

---

### Question 6: Does delivery time correlate with conversion?
- **PM Context**: Logistics SLA impact on checkout completion.
- **Key Insight**: Express delivery (1-2 days) sees **38.4% cart abandonment**, while items requiring 5+ days delivery suffer from **76.2% abandonment** (a 2.0x surge).
- **SQL Script**: [`analytics/sql/06_delivery_time_vs_conversion.sql`](file:///f:/my%20projects%202026/trendlytics/analytics/sql/06_delivery_time_vs_conversion.sql)

---

### Question 7: Does discount level correlate with conversion?
- **PM Context**: Price elasticity and promotional effectiveness.
- **Key Insight**: Products with $>45\%$ discount achieve a **24.2% view-to-purchase CVR**, compared to **14.8%** for products with $<25\%$ discount.
- **SQL Script**: [`analytics/sql/07_discount_depth_vs_conversion.sql`](file:///f:/my%20projects%202026/trendlytics/analytics/sql/07_discount_depth_vs_conversion.sql)

---

### Question 8: Which products have many views but few purchases?
- **PM Context**: Identifying catalog mispricing or description friction.
- **Key Insight**: Products with high interest but high delivery days (>4 days) or higher price points relative to category averages underperform by 3.2x in final checkout conversion.
- **SQL Script**: [`analytics/sql/08_high_view_low_purchase_products.sql`](file:///f:/my%20projects%202026/trendlytics/analytics/sql/08_high_view_low_purchase_products.sql)

---

### Question 9: Which search queries have high search volume but low engagement?
- **PM Context**: Identifying Search & Discovery failure.
- **Key Insight**: Complex natural language queries like *"black floral maxi dress for summer wedding under 3000"* have $<25\%$ CTR in keyword search due to rigid substring token matching.
- **SQL Script**: [`analytics/sql/09_high_volume_low_engagement_queries.sql`](file:///f:/my%20projects%202026/trendlytics/analytics/sql/09_high_volume_low_engagement_queries.sql)

---

### Question 10: What is the Average Order Value (AOV)?
- **PM Context**: Basket monetization efficiency.
- **Key Insight**: Platform-wide AOV is **₹2,642**, with the *Luxury* segment averaging **₹2,840** and *Budget* segment averaging **₹1,620**.
- **SQL Script**: [`analytics/sql/10_average_order_value_by_segment.sql`](file:///f:/my%20projects%202026/trendlytics/analytics/sql/10_average_order_value_by_segment.sql)

---

### Question 11: What percentage of users make repeat purchases?
- **PM Context**: Customer retention and lifetime value (LTV).
- **Key Insight**: **23.8%** of paying users make more than one purchase within the 30-day window, generating an average LTV of **₹3,402**.
- **SQL Script**: [`analytics/sql/11_repeat_purchase_rate.sql`](file:///f:/my%20analytics/sql/11_repeat_purchase_rate.sql)

---

### Question 12: How does conversion differ between new and returning users?
- **PM Context**: Trust and familiarity impact on purchase decisions.
- **Key Insight**: Returning shoppers demonstrate higher intent with **20.2% CVR** vs **19.8%** for anonymous new visitors, and add 1.2x more items per transaction.
- **SQL Script**: [`analytics/sql/12_new_vs_returning_users.sql`](file:///f:/my%20projects%202026/trendlytics/analytics/sql/12_new_vs_returning_users.sql)

---

### Question 13: Which products have high views but low Add-to-Cart rates?
- **PM Context**: Identifying PDP friction (pricing, sizing, image gallery).
- **Key Insight**: Visual items without clear size charts or with narrow stock availability experience high PDP bounces.
- **SQL Script**: [`analytics/sql/13_high_view_low_add_to_cart_friction.sql`](file:///f:/my%20projects%202026/trendlytics/analytics/sql/13_high_view_low_add_to_cart_friction.sql)

---

### Question 14: How does conversion change over time?
- **PM Context**: Longitudinal stability and weekend campaign spikes.
- **Key Insight**: Daily CVR remains steady between 18.5% and 23.5%, peaking on weekend promotional campaigns (Friday-Sunday).
- **SQL Script**: [`analytics/sql/14_daily_conversion_trends.sql`](file:///f:/my%20projects%202026/trendlytics/analytics/sql/14_daily_conversion_trends.sql)

---

### Question 15: Which product/category combinations generate highest GMV?
- **PM Context**: Revenue concentration & Pareto distribution.
- **Key Insight**: *Noir Paris* (Accessories & Dresses) and *SoleCraft Co.* (Footwear) represent the top 15% of revenue contributors.
- **SQL Script**: [`analytics/sql/15_gmv_by_product_category_matrix.sql`](file:///f:/my%20projects%202026/trendlytics/analytics/sql/15_gmv_by_product_category_matrix.sql)
