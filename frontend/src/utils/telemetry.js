// First-Party Telemetry SDK for Trendlytics

const API_BASE = '/api';

export function getSessionId() {
  let sid = localStorage.getItem('tl_session_id');
  if (!sid) {
    sid = 'sess_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    localStorage.setItem('tl_session_id', sid);
  }
  return sid;
}

export function getDeviceType() {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

export async function initSession(forceVariant = null) {
  const sessionId = getSessionId();
  const deviceType = getDeviceType();
  const user = JSON.parse(localStorage.getItem('tl_user') || 'null');

  try {
    const res = await fetch(`${API_BASE}/session/init/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId,
        device_type: deviceType,
        user_id: user ? user.id : null,
        force_variant: forceVariant || localStorage.getItem('tl_experiment_variant'),
      }),
    });
    const data = await res.json();
    if (data.experiment_variant) {
      localStorage.setItem('tl_experiment_variant', data.experiment_variant);
    }
    return data;
  } catch (err) {
    console.error('Failed to init session telemetry:', err);
    return {
      session_id: sessionId,
      device_type: deviceType,
      experiment_variant: localStorage.getItem('tl_experiment_variant') || 'treatment_ai_search',
    };
  }
}

export async function trackEvent(eventType, payload = {}) {
  const sessionId = getSessionId();
  const deviceType = getDeviceType();
  const user = JSON.parse(localStorage.getItem('tl_user') || 'null');
  const variant = localStorage.getItem('tl_experiment_variant') || 'treatment_ai_search';

  const eventPayload = {
    session_id: sessionId,
    event_type: eventType,
    user_id: user ? user.id : null,
    product_id: payload.productId || payload.product_id || null,
    search_query: payload.searchQuery || payload.search_query || '',
    device_type: deviceType,
    metadata: {
      ...payload.metadata,
      variant: variant,
      path: window.location.pathname,
      timestamp_local: new Date().toISOString(),
    },
  };

  // Broadcast to in-app live telemetry inspector
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('tl_telemetry_event', { detail: eventPayload })
    );
  }

  // Non-blocking server dispatch
  try {
    fetch(`${API_BASE}/events/track/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventPayload),
      keepalive: true, // Guarantees delivery even on page unload
    }).catch(() => {});
  } catch (err) {
    // Fail silently so user shopping UX is never impacted
  }
}
