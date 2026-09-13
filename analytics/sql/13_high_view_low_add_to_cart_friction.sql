-- ==============================================================================
-- Trendlytics SQL Product Analytics
-- Query 13: High Views with Low Add-to-Cart (PDP Friction Analysis)
-- 
-- PRODUCT QUESTION:
-- Which fashion items receive disproportionate attention (impressions/views) but fail to be added to cart?
-- ==============================================================================

SELECT 
    p.id AS product_id,
    p.name AS product_name,
    p.brand,
    c.name AS category,
    p.price,
    p.discount_percentage,
    COUNT(CASE WHEN e.event_type = 'product_view' THEN 1 END) AS product_views,
    COUNT(CASE WHEN e.event_type = 'add_to_cart' THEN 1 END) AS cart_adds,
    ROUND(100.0 * COUNT(CASE WHEN e.event_type = 'add_to_cart' THEN 1 END) / NULLIF(COUNT(CASE WHEN e.event_type = 'product_view' THEN 1 END), 0), 2) AS add_to_cart_rate_pct
FROM products_product p
JOIN products_category c ON p.category_id = c.id
LEFT JOIN events_event e ON e.product_id = p.id
GROUP BY p.id, p.name, p.brand, c.name, p.price, p.discount_percentage
HAVING COUNT(CASE WHEN e.event_type = 'product_view' THEN 1 END) >= 40
ORDER BY product_views DESC, add_to_cart_rate_pct ASC
LIMIT 15;
