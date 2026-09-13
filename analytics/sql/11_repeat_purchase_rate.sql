-- ==============================================================================
-- Trendlytics SQL Product Analytics
-- Query 11: Repeat Purchase Rate & Customer Retention Cohort
-- 
-- PRODUCT QUESTION:
-- What percentage of registered customers place more than one order?
-- ==============================================================================

WITH user_order_counts AS (
    SELECT 
        user_id,
        COUNT(order_id) AS order_count,
        SUM(final_amount) AS customer_lifetime_value
    FROM orders_order
    WHERE user_id IS NOT NULL
    GROUP BY user_id
)
SELECT 
    COUNT(user_id) AS total_paying_users,
    COUNT(CASE WHEN order_count = 1 THEN 1 END) AS one_time_buyers,
    COUNT(CASE WHEN order_count > 1 THEN 1 END) AS repeat_buyers,
    ROUND(100.0 * COUNT(CASE WHEN order_count > 1 THEN 1 END) / NULLIF(COUNT(user_id), 0), 2) AS repeat_purchase_rate_pct,
    ROUND(AVG(customer_lifetime_value), 2) AS avg_customer_ltv_inr
FROM user_order_counts;
