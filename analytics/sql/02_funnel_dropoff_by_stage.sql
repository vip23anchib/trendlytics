-- ==============================================================================
-- Trendlytics SQL Product Analytics
-- Query 02: Funnel Drop-off by Stage
-- 
-- PRODUCT QUESTION:
-- At which stage of the customer journey do we lose the largest volume and percentage of shoppers?
-- Stages: Session Start -> Product View -> Add to Cart -> Checkout Started -> Purchase
-- ==============================================================================

WITH stage_counts AS (
    SELECT 
        COUNT(DISTINCT session_id) AS step_1_sessions,
        COUNT(DISTINCT CASE WHEN event_type = 'product_view' THEN session_id END) AS step_2_product_views,
        COUNT(DISTINCT CASE WHEN event_type = 'add_to_cart' THEN session_id END) AS step_3_cart_adds,
        COUNT(DISTINCT CASE WHEN event_type = 'checkout_started' THEN session_id END) AS step_4_checkout_starts,
        COUNT(DISTINCT CASE WHEN event_type = 'purchase_completed' THEN session_id END) AS step_5_purchases
    FROM events_event
)
SELECT 
    '1. Session Start' AS funnel_stage,
    step_1_sessions AS sessions_count,
    100.0 AS stage_conversion_pct,
    0.0 AS drop_off_pct
FROM stage_counts
UNION ALL
SELECT 
    '2. Product View',
    step_2_product_views,
    ROUND(100.0 * step_2_product_views / NULLIF(step_1_sessions, 0), 2),
    ROUND(100.0 * (step_1_sessions - step_2_product_views) / NULLIF(step_1_sessions, 0), 2)
FROM stage_counts
UNION ALL
SELECT 
    '3. Add to Cart',
    step_3_cart_adds,
    ROUND(100.0 * step_3_cart_adds / NULLIF(step_2_product_views, 0), 2),
    ROUND(100.0 * (step_2_product_views - step_3_cart_adds) / NULLIF(step_2_product_views, 0), 2)
FROM stage_counts
UNION ALL
SELECT 
    '4. Checkout Started',
    step_4_checkout_starts,
    ROUND(100.0 * step_4_checkout_starts / NULLIF(step_3_cart_adds, 0), 2),
    ROUND(100.0 * (step_3_cart_adds - step_4_checkout_starts) / NULLIF(step_3_cart_adds, 0), 2)
FROM stage_counts
UNION ALL
SELECT 
    '5. Purchase Completed',
    step_5_purchases,
    ROUND(100.0 * step_5_purchases / NULLIF(step_4_checkout_starts, 0), 2),
    ROUND(100.0 * (step_4_checkout_starts - step_5_purchases) / NULLIF(step_4_checkout_starts, 0), 2)
FROM stage_counts;
