-- ==============================================================================
-- Trendlytics SQL Product Analytics
-- Query 10: Average Order Value (AOV) by Customer Segment & Payment Method
-- 
-- PRODUCT QUESTION:
-- What is our Average Order Value across customer segments and payment methods?
-- ==============================================================================

SELECT 
    COALESCE(p.segment, 'guest/anonymous') AS customer_segment,
    o.payment_method,
    COUNT(o.order_id) AS total_orders,
    ROUND(SUM(o.final_amount), 2) AS total_gmv,
    ROUND(AVG(o.final_amount), 2) AS average_order_value_inr,
    ROUND(AVG(o.discount_amount), 2) AS average_discount_given_inr
FROM orders_order o
LEFT JOIN auth_user u ON o.user_id = u.id
LEFT JOIN core_userprofile p ON p.user_id = u.id
GROUP BY COALESCE(p.segment, 'guest/anonymous'), o.payment_method
ORDER BY total_gmv DESC;
