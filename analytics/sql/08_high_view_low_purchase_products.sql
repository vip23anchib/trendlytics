-- ==============================================================================
-- Trendlytics SQL Product Analytics
-- Query 08: High View but Low Purchase Products (Conversion Underperformers)
-- 
-- PRODUCT QUESTION:
-- Which catalog products attract high customer interest (views) but convert poorly to purchases?
-- Identifies potential pricing, sizing, imagery, or delivery expectation mismatches.
-- ==============================================================================

WITH product_traffic AS (
    SELECT 
        p.id AS product_id,
        p.name AS product_name,
        p.brand,
        p.price,
        p.delivery_days,
        c.name AS category_name,
        COUNT(CASE WHEN e.event_type = 'product_view' THEN 1 END) AS total_views,
        COUNT(CASE WHEN e.event_type = 'add_to_cart' THEN 1 END) AS total_cart_adds,
        COUNT(CASE WHEN e.event_type = 'purchase_completed' THEN 1 END) AS total_purchases
    FROM products_product p
    JOIN products_category c ON p.category_id = c.id
    LEFT JOIN events_event e ON e.product_id = p.id
    GROUP BY p.id, p.name, p.brand, p.price, p.delivery_days, c.name
    HAVING COUNT(CASE WHEN e.event_type = 'product_view' THEN 1 END) >= 200
)
SELECT 
    product_id,
    product_name,
    brand,
    category_name,
    price,
    delivery_days,
    total_views,
    total_cart_adds,
    total_purchases,
    ROUND(100.0 * total_cart_adds / NULLIF(total_views, 0), 2) AS view_to_cart_pct,
    ROUND(100.0 * total_purchases / NULLIF(total_views, 0), 2) AS view_to_purchase_cvr_pct
FROM product_traffic
ORDER BY total_views DESC, view_to_purchase_cvr_pct ASC
LIMIT 15;
