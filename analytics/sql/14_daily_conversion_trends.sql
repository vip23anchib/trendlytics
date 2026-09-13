-- ==============================================================================
-- Trendlytics SQL Product Analytics
-- Query 14: Daily Conversion Rate Trends over Time
-- 
-- PRODUCT QUESTION:
-- How is store conversion rate trending day-over-day across the 30-day window?
-- ==============================================================================

WITH daily_stats AS (
    SELECT 
        DATE(timestamp) AS activity_date,
        COUNT(DISTINCT session_id) AS total_sessions,
        COUNT(DISTINCT CASE WHEN event_type = 'purchase_completed' THEN session_id END) AS completed_purchases
    FROM events_event
    GROUP BY DATE(timestamp)
)
SELECT 
    activity_date,
    total_sessions,
    completed_purchases,
    ROUND(100.0 * completed_purchases / NULLIF(total_sessions, 0), 2) AS daily_conversion_rate_pct,
    ROUND(AVG(100.0 * completed_purchases / NULLIF(total_sessions, 0)) OVER(
        ORDER BY activity_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ), 2) AS rolling_7day_avg_cvr_pct
FROM daily_stats
ORDER BY activity_date ASC;
