-- ==============================================================================
-- Trendlytics SQL Product Analytics
-- Query 07: Discount Depth vs Conversion Elasticity
-- 
-- PRODUCT QUESTION:
-- How does discount percentage (e.g. 0-20%, 21-40%, 41-60%) correlate with conversion rate?
-- ==============================================================================

WITH discount_tiers AS (
    SELECT 
        CASE 
            WHEN p.discount_percentage < 25 THEN 'Low Discount (< 25%)'
            WHEN p.discount_percentage BETWEEN 25 AND 45 THEN 'Medium Discount (25-45%)'
            ELSE 'High Discount (> 45%)'
        END AS discount_tier,
        COUNT(DISTINCT CASE WHEN e.event_type = 'product_view' THEN e.session_id END) AS views,
        COUNT(DISTINCT CASE WHEN e.event_type = 'add_to_cart' THEN e.session_id END) AS cart_adds,
        COUNT(DISTINCT CASE WHEN e.event_type = 'purchase_completed' THEN e.session_id END) AS purchases
    FROM products_product p
    JOIN events_event e ON e.product_id = p.id
    GROUP BY 
        CASE 
            WHEN p.discount_percentage < 25 THEN 'Low Discount (< 25%)'
            WHEN p.discount_percentage BETWEEN 25 AND 45 THEN 'Medium Discount (25-45%)'
            ELSE 'High Discount (> 45%)'
        END
)
SELECT 
    discount_tier,
    views,
    cart_adds,
    purchases,
    ROUND(100.0 * cart_adds / NULLIF(views, 0), 2) AS view_to_cart_rate_pct,
    ROUND(100.0 * purchases / NULLIF(views, 0), 2) AS view_to_purchase_cvr_pct
FROM discount_tiers
ORDER BY view_to_purchase_cvr_pct DESC;
