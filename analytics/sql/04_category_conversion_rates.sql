-- ==============================================================================
-- Trendlytics SQL Product Analytics
-- Query 04: Conversion Rate by Category
-- 
-- PRODUCT QUESTION:
-- Which fashion categories deliver the highest purchase conversion vs highest drop-offs?
-- ==============================================================================

WITH cat_metrics AS (
    SELECT 
        c.name AS category_name,
        COUNT(DISTINCT CASE WHEN e.event_type = 'product_view' THEN e.session_id END) AS view_sessions,
        COUNT(DISTINCT CASE WHEN e.event_type = 'add_to_cart' THEN e.session_id END) AS cart_sessions,
        COUNT(DISTINCT CASE WHEN e.event_type = 'purchase_completed' THEN e.session_id END) AS purchase_sessions
    FROM products_category c
    JOIN products_product p ON p.category_id = c.id
    JOIN events_event e ON e.product_id = p.id
    GROUP BY c.name
)
SELECT 
    category_name,
    view_sessions,
    cart_sessions,
    purchase_sessions,
    ROUND(100.0 * cart_sessions / NULLIF(view_sessions, 0), 2) AS view_to_cart_rate_pct,
    ROUND(100.0 * purchase_sessions / NULLIF(cart_sessions, 0), 2) AS cart_to_purchase_rate_pct,
    ROUND(100.0 * purchase_sessions / NULLIF(view_sessions, 0), 2) AS overall_category_cvr_pct
FROM cat_metrics
ORDER BY overall_category_cvr_pct DESC;
