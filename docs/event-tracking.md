# Trendlytics — First-Party Event Tracking & Telemetry Architecture

Telemetry is the foundational data layer of Trendlytics. Without reliable, real-time first-party event tracking, product analytics and experimentation cannot exist.

---

## 1. Tracking Principles & Governance
1. **First-Party Ingestion**: All events are delivered directly to the internal API endpoint (`/api/events/track/`), bypassing client-side ad-blockers and privacy filters.
2. **Context Persistence**: Every event automatically carries `session_id`, `device_type`, `user_id` (if authenticated), and high-resolution `timestamp`.
3. **No Sensitive PII**: Telemetry payload only collects behavioral metadata, never passwords, full payment cards, or personally identifying raw records.
4. **Resilient Buffering**: The frontend telemetry SDK queues events and flushes them either instantly for critical milestones (e.g. checkout, purchase) or in lightweight batches.

---

## 2. Event Taxonomy

| Event Name | Trigger Location | Key Payload Attributes | Funnel Stage |
|---|---|---|---|
| `session_start` | App load / first page | `entry_point`, `referrer`, `variant` | Top of Funnel |
| `homepage_view` | Route `/` | `viewport`, `campaign_tag` | Discovery |
| `category_view` | Category tab clicked | `category_slug`, `category_id` | Discovery |
| `search` | User submits query | `search_query`, `search_type`, `variant` | Discovery |
| `search_result_view`| Search response rendered | `results_count`, `intent_tokens` | Discovery |
| `filter_used` | Filter pill / facet applied | `filter_type` (price, brand, color), `filter_val` | Consideration |
| `sort_used` | Sort dropdown changed | `sort_option` (popularity, price, rating) | Consideration |
| `product_view` | Route `/products/:id` | `product_id`, `brand`, `price`, `source` | Consideration |
| `wishlist_add` | Heart icon clicked | `product_id`, `category` | Consideration |
| `wishlist_remove` | Heart icon toggled off | `product_id` | Consideration |
| `add_to_cart` | Add to Cart button clicked | `product_id`, `size`, `unit_price`, `quantity` | Intent |
| `remove_from_cart` | Cart trash icon clicked | `product_id`, `quantity` | Intent |
| `checkout_started` | Proceed to Checkout clicked| `cart_value`, `item_count`, `coupon_code` | Transaction |
| `checkout_abandoned`| User exits checkout page | `stage_abandoned`, `reason_inferred` | Drop-off |
| `purchase_completed`| Order confirmation page | `order_id`, `final_amount`, `payment_method` | Conversion |

---

## 3. Telemetry Payload Schema

```json
{
  "session_id": "sess_89f02cb8a192",
  "user_id": 102,
  "event_type": "product_view",
  "product_id": 48,
  "search_query": "black floral maxi dress under 3000",
  "device_type": "mobile",
  "timestamp": "2026-09-14T02:15:30.120Z",
  "metadata": {
    "brand": "Aura & Silk",
    "price": 2799.00,
    "discount": 44,
    "source": "ai_search_results",
    "delivery_days": 2,
    "variant": "treatment_ai_search"
  }
}
```
