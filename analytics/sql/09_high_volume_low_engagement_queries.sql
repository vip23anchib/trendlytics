-- ==============================================================================
-- Trendlytics SQL Product Analytics
-- Query 09: High Volume Search Queries with Low Engagement
-- 
-- PRODUCT QUESTION:
-- Which user search queries generate large search volume but suffer from poor click-through and zero results?
-- This isolates the primary Search & Discovery PM opportunity.
-- ==============================================================================

WITH search_sessions AS (
    SELECT 
        e.search_query,
        COUNT(DISTINCT e.session_id) AS search_volume,
        COUNT(DISTINCT CASE WHEN v.event_type = 'product_view' THEN v.session_id END) AS clicked_sessions,
        COUNT(DISTINCT CASE WHEN v.event_type = 'purchase_completed' THEN v.session_id END) AS purchased_sessions
    FROM events_event e
    LEFT JOIN events_event v 
        ON e.session_id = v.session_id 
        AND v.event_type IN ('product_view', 'purchase_completed')
        AND v.timestamp >= e.timestamp
    WHERE e.event_type = 'search' 
      AND e.search_query IS NOT NULL 
      AND e.search_query != ''
    GROUP BY e.search_query
    HAVING COUNT(DISTINCT e.session_id) >= 50
)
SELECT 
    search_query,
    search_volume,
    clicked_sessions,
    purchased_sessions,
    ROUND(100.0 * clicked_sessions / NULLIF(search_volume, 0), 2) AS search_ctr_pct,
    ROUND(100.0 * purchased_sessions / NULLIF(search_volume, 0), 2) AS search_to_purchase_cvr_pct
FROM search_sessions
ORDER BY search_volume DESC, search_ctr_pct ASC
LIMIT 15;
