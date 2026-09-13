-- ==============================================================================
-- Trendlytics SQL Product Analytics
-- Query 01: Overall Purchase Conversion Rate
-- 
-- PRODUCT QUESTION:
-- What proportion of all shopping sessions culminate in a confirmed purchase?
-- Why it matters: North star top-of-funnel efficiency metric for fashion commerce.
-- ==============================================================================

WITH session_metrics AS (
    SELECT 
        COUNT(DISTINCT session_id) AS total_sessions,
        COUNT(DISTINCT CASE WHEN event_type = 'purchase_completed' THEN session_id END) AS purchasing_sessions
    FROM events_event
)
SELECT 
    total_sessions,
    purchasing_sessions,
    ROUND(100.0 * purchasing_sessions / NULLIF(total_sessions, 0), 2) AS overall_purchase_conversion_rate_pct
FROM session_metrics;
