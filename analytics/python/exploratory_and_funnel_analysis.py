import os
import sys
import sqlite3
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Set style
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['font.sans-serif'] = ['DejaVu Sans', 'Arial', 'Helvetica']

def run_exploratory_analysis():
    db_path = os.path.join(os.path.dirname(__file__), '..', '..', 'backend', 'db.sqlite3')
    charts_dir = os.path.join(os.path.dirname(__file__), '..', 'charts')
    os.makedirs(charts_dir, exist_ok=True)

    conn = sqlite3.connect(db_path)

    print("==============================================================================")
    print("  TRENDLYTICS PYTHON PRODUCT ANALYTICS & VISUALIZATION PIPELINE")
    print("==============================================================================")

    # 1. Funnel Stages Analysis
    print("\n1. Analyzing 5-Stage Customer Funnel...")
    query_funnel = """
    SELECT 
        COUNT(DISTINCT session_id) AS sessions,
        COUNT(DISTINCT CASE WHEN event_type = 'product_view' THEN session_id END) AS product_views,
        COUNT(DISTINCT CASE WHEN event_type = 'add_to_cart' THEN session_id END) AS add_to_cart,
        COUNT(DISTINCT CASE WHEN event_type = 'checkout_started' THEN session_id END) AS checkout_started,
        COUNT(DISTINCT CASE WHEN event_type = 'purchase_completed' THEN session_id END) AS purchases
    FROM events_event;
    """
    df_funnel = pd.read_sql_query(query_funnel, conn)
    
    stages = ['1. Sessions', '2. Product Views', '3. Add to Cart', '4. Checkout Started', '5. Purchases']
    counts = [
        df_funnel['sessions'][0],
        df_funnel['product_views'][0],
        df_funnel['add_to_cart'][0],
        df_funnel['checkout_started'][0],
        df_funnel['purchases'][0]
    ]
    pct_from_start = [round(100.0 * c / counts[0], 1) for c in counts]

    # Chart 1: Funnel Drop-off
    fig, ax = plt.subplots(figsize=(10, 6), dpi=300)
    colors = ['#1e293b', '#334155', '#475569', '#0ea5e9', '#10b981']
    bars = ax.bar(stages, counts, color=colors, width=0.55, edgecolor='none')
    
    for i, (bar, count, pct) in enumerate(zip(bars, counts, pct_from_start)):
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height + (max(counts)*0.015),
                f"{count:,}\n({pct}%)", ha='center', va='bottom', fontsize=10, fontweight='bold', color='#0f172a')

    ax.set_title("Trendlytics E-Commerce Customer Conversion Funnel", fontsize=14, fontweight='bold', pad=20)
    ax.set_ylabel("Unique User Sessions", fontsize=11, labelpad=10)
    ax.yaxis.set_major_formatter(ticker.FuncFormatter(lambda x, p: f"{int(x):,}"))
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    plt.tight_layout()
    funnel_path = os.path.join(charts_dir, 'funnel_dropoff_stages.png')
    plt.savefig(funnel_path)
    plt.close()
    print(f"   [SAVED] {funnel_path}")

    # 2. Device Comparison Chart
    print("\n2. Analyzing Device Conversion Dynamics...")
    query_device = """
    SELECT 
        device_type,
        COUNT(DISTINCT session_id) AS total_sessions,
        COUNT(DISTINCT CASE WHEN event_type = 'purchase_completed' THEN session_id END) AS purchases
    FROM events_event
    GROUP BY device_type;
    """
    df_device = pd.read_sql_query(query_device, conn)
    df_device['cvr'] = round(100.0 * df_device['purchases'] / df_device['total_sessions'], 2)

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5), dpi=300)
    # Traffic Share
    ax1.pie(df_device['total_sessions'], labels=df_device['device_type'].str.capitalize(), 
            autopct='%1.1f%%', colors=['#0ea5e9', '#6366f1', '#a855f7'], startangle=140,
            wedgeprops={'edgecolor': 'white', 'linewidth': 2})
    ax1.set_title("Session Traffic Share by Device", fontsize=12, fontweight='bold')

    # Conversion Rate
    bars2 = ax2.bar(df_device['device_type'].str.capitalize(), df_device['cvr'], color=['#0ea5e9', '#6366f1', '#a855f7'], width=0.45)
    for b in bars2:
        ax2.text(b.get_x() + b.get_width()/2., b.get_height() + 0.3, f"{b.get_height()}%", ha='center', va='bottom', fontweight='bold')
    ax2.set_title("Purchase Conversion Rate (CVR) by Device", fontsize=12, fontweight='bold')
    ax2.set_ylabel("Conversion Rate (%)", fontsize=11)
    ax2.set_ylim(0, max(df_device['cvr']) * 1.25)
    ax2.spines['top'].set_visible(False)
    ax2.spines['right'].set_visible(False)

    plt.tight_layout()
    device_path = os.path.join(charts_dir, 'device_conversion_comparison.png')
    plt.savefig(device_path)
    plt.close()
    print(f"   [SAVED] {device_path}")

    # 3. Delivery Speed Correlation
    print("\n3. Analyzing Delivery Days vs Checkout Drop-off...")
    query_delivery = """
    SELECT 
        CASE 
            WHEN p.delivery_days <= 2 THEN '1-2 Days (Express)'
            WHEN p.delivery_days <= 4 THEN '3-4 Days (Standard)'
            ELSE '5+ Days (Delayed)'
        END AS delivery_tier,
        COUNT(DISTINCT CASE WHEN e.event_type = 'add_to_cart' THEN e.session_id END) AS cart_adds,
        COUNT(DISTINCT CASE WHEN e.event_type = 'purchase_completed' THEN e.session_id END) AS purchases
    FROM products_product p
    JOIN events_event e ON e.product_id = p.id
    GROUP BY delivery_tier;
    """
    df_deliv = pd.read_sql_query(query_delivery, conn)
    df_deliv['abandonment_pct'] = round(100.0 * (df_deliv['cart_adds'] - df_deliv['purchases']) / df_deliv['cart_adds'], 1)

    fig, ax = plt.subplots(figsize=(9, 5), dpi=300)
    bars_deliv = ax.bar(df_deliv['delivery_tier'], df_deliv['abandonment_pct'], color=['#10b981', '#f59e0b', '#ef4444'], width=0.45)
    for b in bars_deliv:
        ax.text(b.get_x() + b.get_width()/2., b.get_height() + 1.2, f"{b.get_height()}%", ha='center', va='bottom', fontweight='bold', fontsize=11)

    ax.set_title("Cart Abandonment Rate Escalation by Promised Delivery Time", fontsize=13, fontweight='bold', pad=15)
    ax.set_ylabel("Cart Abandonment Rate (%)", fontsize=11)
    ax.set_ylim(0, 100)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    plt.tight_layout()
    deliv_path = os.path.join(charts_dir, 'delivery_delay_vs_abandonment.png')
    plt.savefig(deliv_path)
    plt.close()
    print(f"   [SAVED] {deliv_path}")

    conn.close()
    print("\n[DONE] Exploratory visualizations generated successfully.")

if __name__ == '__main__':
    run_exploratory_analysis()
