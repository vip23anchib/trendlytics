-- ==============================================================================
-- Trendlytics SQL Product Analytics
-- Query 15: GMV and Revenue Concentration by Category & Brand
-- 
-- PRODUCT QUESTION:
-- Which product, category, and brand combinations generate the highest Gross Merchandise Value (GMV)?
-- ==============================================================================

SELECT 
    c.name AS category_name,
    p.brand,
    COUNT(DISTINCT oi.order_id) AS total_orders,
    SUM(oi.quantity) AS total_units_sold,
    ROUND(SUM(oi.quantity * oi.unit_price), 2) AS total_gmv_inr,
    ROUND(100.0 * SUM(oi.quantity * oi.unit_price) / (SELECT SUM(quantity * unit_price) FROM orders_orderitem), 2) AS gmv_share_pct
FROM orders_orderitem oi
JOIN products_product p ON oi.product_id = p.id
JOIN products_category c ON p.category_id = c.id
GROUP BY c.name, p.brand
ORDER BY total_gmv_inr DESC
LIMIT 20;
