-- ==============================================================================
-- Trendlytics SQL Product Analytics
-- Query 03: Mobile vs Desktop Conversion Rate Delta
-- 
-- PRODUCT QUESTION:
-- How does conversion performance differ across device types (Mobile vs Desktop)?
-- Is there disproportionate friction on Mobile checkout?
-- ==============================================================================

WITH device_funnel AS (
    SELECT 
        device_type,
        COUNT(DISTINCT session_id) AS total_sessions,
        COUNT(DISTINCT CASE WHEN event_type = 'product_view' THEN session_id END) AS view_sessions,
        COUNT(DISTINCT CASE WHEN event_type = 'add_to_cart' THEN session_id END) AS cart_sessions,
        COUNT(DISTINCT CASE WHEN event_type = 'checkout_started' THEN session_id END) AS checkout_sessions,
        COUNT(DISTINCT CASE WHEN event_type = 'purchase_completed' THEN session_id END) AS purchase_sessions
    FROM events_event
    GROUP BY device_type
)
SELECT 
    device_type,
    total_sessions,
    ROUND(100.0 * view_sessions / NULLIF(total_sessions, 0), 2) AS view_rate_pct,
    ROUND(100.0 * cart_sessions / NULLIF(view_sessions, 0), 2) AS cart_add_rate_pct,
    ROUND(100.0 * checkout_sessions / NULLIF(cart_sessions, 0), 2) AS checkout_init_rate_pct,
    ROUND(100.0 * purchase_sessions / NULLIF(checkout_sessions, 0), 2) AS checkout_completion_rate_pct,
    ROUND(100.0 * purchase_sessions / NULLIF(total_sessions, 0), 2) AS overall_session_conversion_pct
FROM device_funnel
ORDER BY total_sessions DESC;
