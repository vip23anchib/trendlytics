import os
import sys
import csv
import sqlite3
import pandas as pd

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def export_powerbi_tables():
    db_path = os.path.join(os.path.dirname(__file__), '..', '..', 'backend', 'db.sqlite3')
    bi_dir = os.path.join(os.path.dirname(__file__), 'data_model')
    os.makedirs(bi_dir, exist_ok=True)

    conn = sqlite3.connect(db_path)
    print("==============================================================================")
    print("  EXPORTING STAR-SCHEMA DATASET FOR POWER BI / TABLEAU DASHBOARD")
    print("==============================================================================")

    # 1. Fact Events
    print("Exporting Fact_Events...")
    df_events = pd.read_sql_query("""
        SELECT 
            event_id,
            user_id,
            session_id,
            event_type,
            product_id,
            search_query,
            device_type,
            timestamp,
            strftime('%Y-%m-%d', timestamp) AS event_date,
            strftime('%H', timestamp) AS event_hour
        FROM events_event;
    """, conn)
    df_events.to_csv(os.path.join(bi_dir, 'Fact_Events.csv'), index=False)

    # 2. Fact Orders
    print("Exporting Fact_Orders...")
    df_orders = pd.read_sql_query("""
        SELECT 
            order_id,
            user_id,
            session_id,
            total_amount,
            discount_amount,
            delivery_fee,
            final_amount,
            delivery_days,
            payment_method,
            status,
            shipping_city,
            shipping_pincode,
            created_at,
            strftime('%Y-%m-%d', created_at) AS order_date
        FROM orders_order;
    """, conn)
    df_orders.to_csv(os.path.join(bi_dir, 'Fact_Orders.csv'), index=False)

    # 3. Dim Products
    print("Exporting Dim_Products...")
    df_products = pd.read_sql_query("""
        SELECT 
            p.id AS product_id,
            p.name AS product_name,
            p.brand,
            c.name AS category_name,
            c.slug AS category_slug,
            p.price,
            p.original_price,
            p.discount_percentage,
            p.rating,
            p.rating_count,
            p.color,
            p.delivery_days,
            p.occasion,
            p.season,
            p.material,
            p.popularity_score,
            p.is_trending
        FROM products_product p
        JOIN products_category c ON p.category_id = c.id;
    """, conn)
    df_products.to_csv(os.path.join(bi_dir, 'Dim_Products.csv'), index=False)

    # 4. Dim Sessions (with A/B Experiment assignment)
    print("Exporting Dim_Sessions...")
    df_sessions = pd.read_sql_query("""
        SELECT 
            session_id,
            user_id,
            device_type,
            experiment_variant,
            created_at AS session_start_time,
            strftime('%Y-%m-%d', created_at) AS session_date
        FROM core_usersession;
    """, conn)
    df_sessions.to_csv(os.path.join(bi_dir, 'Dim_Sessions.csv'), index=False)

    # 5. Dim Users
    print("Exporting Dim_Users...")
    df_users = pd.read_sql_query("""
        SELECT 
            u.id AS user_id,
            u.username,
            u.email,
            u.first_name,
            u.last_name,
            u.date_joined,
            COALESCE(p.segment, 'new') AS customer_segment,
            COALESCE(p.is_returning, 0) AS is_returning_flag,
            COALESCE(p.preferred_device, 'mobile') AS preferred_device
        FROM auth_user u
        LEFT JOIN core_userprofile p ON p.user_id = u.id;
    """, conn)
    df_users.to_csv(os.path.join(bi_dir, 'Dim_Users.csv'), index=False)

    conn.close()
    print(f"\n[DONE] Exported 5 Star-Schema Tables into {bi_dir}/")

if __name__ == '__main__':
    export_powerbi_tables()
