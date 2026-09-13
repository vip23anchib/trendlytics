-- ==============================================================================
-- Trendlytics SQL Product Analytics
-- Query 12: Conversion Rate: New vs Returning Shoppers
-- 
-- PRODUCT QUESTION:
-- How does purchase conversion rate differ between first-time visitors and returning customers?
-- ==============================================================================

WITH user_activity AS (
    SELECT 
        s.session_id,
        COALESCE(p.is_returning, 0) AS is_returning_user,
        MAX(CASE WHEN e.event_type = 'purchase_completed' THEN 1 ELSE 0 END) AS has_purchased
    FROM core_usersession s
    LEFT JOIN core_userprofile p ON s.user_id = p.user_id
    LEFT JOIN events_event e ON e.session_id = s.session_id
    GROUP BY s.session_id, COALESCE(p.is_returning, 0)
)
SELECT 
    CASE WHEN is_returning_user = 1 THEN 'Returning Customer' ELSE 'New / First-Time Visitor' END AS user_type,
    COUNT(session_id) AS total_sessions,
    SUM(has_purchased) AS completed_orders,
    ROUND(100.0 * SUM(has_purchased) / NULLIF(COUNT(session_id), 0), 2) AS conversion_rate_pct
FROM user_activity
GROUP BY is_returning_user
ORDER BY conversion_rate_pct DESC;
