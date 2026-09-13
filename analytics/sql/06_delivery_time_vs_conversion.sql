-- ==============================================================================
-- Trendlytics SQL Product Analytics
-- Query 06: Delivery Time vs Purchase Conversion Correlation
-- 
-- PRODUCT QUESTION:
-- Does promised delivery time (e.g. 1-2 days express vs 5+ days) impact checkout abandonment?
-- ==============================================================================

WITH delivery_buckets AS (
    SELECT 
        CASE 
            WHEN p.delivery_days <= 2 THEN '1. Express (1-2 Days)'
            WHEN p.delivery_days <= 4 THEN '2. Standard (3-4 Days)'
            ELSE '3. Delayed (5+ Days)'
        END AS delivery_speed_tier,
        COUNT(DISTINCT CASE WHEN e.event_type = 'product_view' THEN e.session_id END) AS view_sessions,
        COUNT(DISTINCT CASE WHEN e.event_type = 'add_to_cart' THEN e.session_id END) AS cart_sessions,
        COUNT(DISTINCT CASE WHEN e.event_type = 'purchase_completed' THEN e.session_id END) AS purchase_sessions
    FROM products_product p
    JOIN events_event e ON e.product_id = p.id
    GROUP BY 
        CASE 
            WHEN p.delivery_days <= 2 THEN '1. Express (1-2 Days)'
            WHEN p.delivery_days <= 4 THEN '2. Standard (3-4 Days)'
            ELSE '3. Delayed (5+ Days)'
        END
)
SELECT 
    delivery_speed_tier,
    view_sessions,
    cart_sessions,
    purchase_sessions,
    ROUND(100.0 * cart_sessions / NULLIF(view_sessions, 0), 2) AS view_to_cart_pct,
    ROUND(100.0 * purchase_sessions / NULLIF(cart_sessions, 0), 2) AS cart_to_purchase_pct,
    ROUND(100.0 * (cart_sessions - purchase_sessions) / NULLIF(cart_sessions, 0), 2) AS cart_abandonment_pct
FROM delivery_buckets
ORDER BY delivery_speed_tier ASC;
