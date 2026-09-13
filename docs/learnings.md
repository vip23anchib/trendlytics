# Trendlytics — Product Management & Engineering Learnings

---

## 1. Product Analytics & Telemetry Hygiene
* **First-Party Telemetry is King**: Relying on third-party client trackers risks losing 20-30% of critical funnel events due to ad-blockers, iOS tracking restrictions, and network drops. Building a lightweight internal `/api/events/track/` endpoint provides 100% data fidelity.
* **Correlation vs. Causation**: While delivery time $>4$ days correlated with high cart abandonment (82.5%), further segmentation revealed that high-delivery items were also heavier winter outerwear items with higher price tags. PMs must always control for price and category confounding factors before making logistics commitments.

---

## 2. GenAI Integration in Commerce
* **Never Let LLMs Generate Catalog SKUs**: In e-commerce, LLMs should only be used as **Intent Interpreters and Structured Parsers**, translating natural language into database filter parameters. Inventory and pricing must always be strictly grounded in the database of truth.
* **Graceful Degradation is Non-Negotiable**: LLM APIs can encounter rate limits or latency spikes. Implementing a fast, local Deterministic Semantic NLP rule fallback ensures 0% downtime and P95 latency $< 200\text{ ms}$.

---

## 3. Experimentation Rigor
* **Sample Size & Power Calculation Matter**: Running an experiment without calculating minimum detectable effect (MDE) leads to premature stopping and false positives. Always pre-register sample size and monitor guardrail metrics alongside the primary KPI.
