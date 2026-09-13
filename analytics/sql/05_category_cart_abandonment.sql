-- ==============================================================================
-- Trendlytics SQL Product Analytics
-- Query 05: Cart Abandonment Rate by Category
-- 
-- PRODUCT QUESTION:
-- Which fashion categories suffer from the highest rate of cart abandonment?
-- Formula: (Cart Add Sessions - Purchase Sessions) / Cart Add Sessions * 100
-- ==============================================================================

WITH category_cart_funnel AS (
    SELECT 
        c.name AS category_name,
        COUNT(DISTINCT CASE WHEN e.event_type = 'add_to_cart' THEN e.session_id END) AS cart_add_sessions,
        COUNT(DISTINCT CASE WHEN e.event_type = 'purchase_completed' THEN e.session_id END) AS purchase_sessions
    FROM products_category c
    JOIN products_product p ON p.category_id = c.id
    JOIN events_event e ON e.product_id = p.id
    GROUP BY c.name
)
SELECT 
    category_name,
    cart_add_sessions,
    purchase_sessions,
    (cart_add_sessions - purchase_sessions) AS abandoned_cart_sessions,
    ROUND(100.0 * (cart_add_sessions - purchase_sessions) / NULLIF(cart_add_sessions, 0), 2) AS cart_abandonment_rate_pct
FROM category_cart_funnel
ORDER BY cart_abandonment_rate_pct DESC;
