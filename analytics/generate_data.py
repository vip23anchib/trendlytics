import os
import sys
import uuid
import random
import math
from datetime import datetime, timedelta
from decimal import Decimal

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Setup django environment
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'trendlytics_backend.settings')

import django
django.setup()

from django.contrib.auth.models import User
from django.utils import timezone
from core.models import UserProfile, UserSession
from products.models import Product, Category
from events.models import Event
from orders.models import Order, OrderItem

def generate_synthetic_telemetry(num_users=6000, num_sessions=22000, min_events=105000):
    print(f"============================================================")
    print(f"  TRENDLYTICS SYNTHETIC PRODUCT ANALYTICS DATA GENERATOR")
    print(f"  Target: ~{num_users:,} Users | ~{num_sessions:,} Sessions | ~{min_events:,}+ Events")
    print(f"============================================================")

    # Clean old generated events/orders if any
    print("Clearing prior synthetic sessions/events/orders/users...")
    Event.objects.all().delete()
    OrderItem.objects.all().delete()
    Order.objects.all().delete()
    UserSession.objects.all().delete()
    UserProfile.objects.all().delete()
    User.objects.filter(email__contains='@trendlytics.io').delete()

    products = list(Product.objects.select_related('category').all())
    if not products:
        print("Error: No products found. Please run seed_products.py first.")
        return

    categories = list(Category.objects.all())

    # Curated Search Query Bank (Normal keywords + Complex Natural Language queries)
    simple_queries = [
        'dress', 'black shirt', 'white sneakers', 'kurta', 'denim jeans',
        'formal blazer', 'perfume', 'tote bag', 'leather boots', 'summer top',
        'red heels', 'linen trousers', 'oversized tee', 'silk saree', 'sunglasses'
    ]

    complex_intent_queries = [
        'black floral maxi dress for summer wedding under 3000',
        'pastel peach lehenga silk blend',
        'oversized white linen button down shirt under 2000',
        'red party heels size 8 under 3500',
        'summer cotton casual kurta below 1500',
        'emerald green satin slip dress for evening party',
        'navy tailored oxford shirt pure cotton',
        'charcoal wool blazer formal slim fit',
        'retro minimalist white leather sneakers'
    ]

    # Pre-generate Users
    print(f"1. Generating {num_users:,} User profiles...")
    users_to_create = []
    first_names = ['Aarav', 'Ananya', 'Rohan', 'Pooja', 'Vikram', 'Priya', 'Aditya', 'Neha', 'Kabir', 'Sneha', 'Rahul', 'Meera', 'Karan', 'Riya', 'Tanvi', 'Arjun']
    last_names = ['Sharma', 'Verma', 'Patel', 'Kapoor', 'Mehta', 'Nair', 'Iyer', 'Singh', 'Gupta', 'Reddy', 'Chopra', 'Das', 'Sen', 'Banerjee', 'Joshi']
    segments = ['budget', 'trendsetter', 'luxury', 'occasional']

    base_time = timezone.now() - timedelta(days=45)

    created_users = []
    user_objs = []
    for i in range(num_users):
        fn = random.choice(first_names)
        ln = random.choice(last_names)
        u_tag = uuid.uuid4().hex[:6]
        uname = f"{fn.lower()}.{ln.lower()}.{u_tag}"
        u = User(
            username=uname,
            email=f"{uname}@trendlytics.io",
            first_name=fn,
            last_name=ln,
            date_joined=base_time + timedelta(days=random.randint(0, 30))
        )
        user_objs.append(u)

    User.objects.bulk_create(user_objs, batch_size=2000)
    created_users = list(User.objects.filter(email__contains='@trendlytics.io'))

    # User Profiles
    profile_objs = []
    for u in created_users:
        profile_objs.append(UserProfile(
            user=u,
            is_returning=(random.random() < 0.42),
            segment=random.choice(segments),
            preferred_device=random.choices(['mobile', 'desktop', 'tablet'], weights=[65, 30, 5])[0],
            created_at=u.date_joined
        ))
    UserProfile.objects.bulk_create(profile_objs, batch_size=2000)
    print(f"   [DONE] {len(created_users):,} Users created.")

    # 2. Generating Sessions
    print(f"2. Generating {num_sessions:,} Sessions & Behavioral Event Telemetry...")
    sessions_to_create = []
    events_to_create = []
    orders_to_create = []
    order_items_to_create = []

    user_pool = created_users + [None] * int(num_users * 0.35) # 35% anonymous guest sessions

    # User Journeys distributions
    # 0: Bounce / Homepage only (18%)
    # 1: Browse -> Product view -> Exit (38%)
    # 2: Search -> Product view -> Cart -> Abandon (24%)
    # 3: Full Funnel -> Checkout -> Purchase (14%)
    # 4: Wishlist & Deferred Conversion (6%)

    event_count = 0
    now = timezone.now()

    for s_idx in range(num_sessions):
        sess_id = f"sess_{uuid.uuid4().hex[:16]}"
        user = random.choice(user_pool)
        device = random.choices(['mobile', 'desktop', 'tablet'], weights=[62, 33, 5])[0]
        
        # 50/50 Experiment Split
        variant = 'treatment_ai_search' if (s_idx % 2 == 0) else 'control_keyword'
        
        # Timestamp spread across past 30 days
        days_ago = random.uniform(0.05, 30.0)
        session_time = now - timedelta(days=days_ago)

        sessions_to_create.append(UserSession(
            session_id=sess_id,
            user=user,
            device_type=device,
            experiment_variant=variant,
            created_at=session_time,
            last_active=session_time + timedelta(minutes=random.randint(2, 35))
        ))

        # Start Telemetry Events for this Session
        t = session_time

        # Event: session_start
        events_to_create.append(Event(
            user=user,
            session_id=sess_id,
            event_type='session_start',
            device_type=device,
            timestamp=t,
            metadata={'entry': 'organic_direct', 'variant': variant}
        ))
        t += timedelta(seconds=random.randint(3, 10))

        # Event: homepage_view
        events_to_create.append(Event(
            user=user,
            session_id=sess_id,
            event_type='homepage_view',
            device_type=device,
            timestamp=t,
            metadata={'viewport': 'mobile_screen' if device == 'mobile' else 'desktop_1080p'}
        ))
        t += timedelta(seconds=random.randint(5, 20))

        # Determine path
        journey_type = random.choices([0, 1, 2, 3, 4], weights=[18, 36, 24, 16, 6])[0]

        # In Treatment variant (AI search), uplift journey_type 2 to 3 (higher search-to-purchase)
        if variant == 'treatment_ai_search' and journey_type == 2 and random.random() < 0.28:
            journey_type = 3

        # High delivery penalty: If cart has item with delivery > 4 days, increase cart abandonment
        # Mobile penalty: Mobile has higher checkout friction

        if journey_type == 0:
            # Bounced after homepage
            pass

        elif journey_type == 1:
            # Browse Category -> View 1-3 products -> Exit
            cat = random.choice(categories)
            events_to_create.append(Event(
                user=user,
                session_id=sess_id,
                event_type='category_view',
                device_type=device,
                timestamp=t,
                metadata={'category': cat.slug}
            ))
            t += timedelta(seconds=random.randint(8, 25))

            num_views = random.randint(1, 3)
            cat_prods = [p for p in products if p.category_id == cat.id] or products
            for _ in range(num_views):
                p = random.choice(cat_prods)
                events_to_create.append(Event(
                    user=user,
                    session_id=sess_id,
                    event_type='product_view',
                    product=p,
                    device_type=device,
                    timestamp=t,
                    metadata={'price': float(p.price), 'brand': p.brand, 'source': 'category_browse'}
                ))
                t += timedelta(seconds=random.randint(15, 60))

        elif journey_type == 2:
            # Search -> Product view -> Add to Cart -> Abandon
            is_complex = (random.random() < 0.45)
            q_text = random.choice(complex_intent_queries) if is_complex else random.choice(simple_queries)

            events_to_create.append(Event(
                user=user,
                session_id=sess_id,
                event_type='search',
                search_query=q_text,
                device_type=device,
                timestamp=t,
                metadata={'is_complex': is_complex, 'variant': variant}
            ))
            t += timedelta(seconds=random.randint(4, 12))

            # If Control and complex query -> 35% chance of zero-result drop
            if variant == 'control_keyword' and is_complex and random.random() < 0.35:
                events_to_create.append(Event(
                    user=user,
                    session_id=sess_id,
                    event_type='search_result_view',
                    search_query=q_text,
                    device_type=device,
                    timestamp=t,
                    metadata={'results_count': 0, 'variant': variant}
                ))
                # Exits on zero result
                continue

            # Viewed search results & clicked product
            p = random.choice(products)
            events_to_create.append(Event(
                user=user,
                session_id=sess_id,
                event_type='product_view',
                product=p,
                search_query=q_text,
                device_type=device,
                timestamp=t,
                metadata={'price': float(p.price), 'brand': p.brand, 'source': 'search_results'}
            ))
            t += timedelta(seconds=random.randint(15, 45))

            # Add to Cart
            events_to_create.append(Event(
                user=user,
                session_id=sess_id,
                event_type='add_to_cart',
                product=p,
                device_type=device,
                timestamp=t,
                metadata={'size': 'M', 'price': float(p.price)}
            ))
            t += timedelta(seconds=random.randint(20, 50))

            # Checkout started then abandoned
            events_to_create.append(Event(
                user=user,
                session_id=sess_id,
                event_type='checkout_started',
                device_type=device,
                timestamp=t,
                metadata={'cart_value': float(p.price)}
            ))
            t += timedelta(seconds=random.randint(25, 60))

            events_to_create.append(Event(
                user=user,
                session_id=sess_id,
                event_type='checkout_abandoned',
                device_type=device,
                timestamp=t,
                metadata={'reason': 'delivery_time_too_long' if p.delivery_days > 4 else 'friction_payment'}
            ))

        elif journey_type == 3:
            # Full Conversion Journey
            p = random.choice(products)
            is_search = random.random() < 0.65
            q_text = random.choice(complex_intent_queries if variant == 'treatment_ai_search' else simple_queries) if is_search else None

            if is_search:
                events_to_create.append(Event(
                    user=user,
                    session_id=sess_id,
                    event_type='search',
                    search_query=q_text,
                    device_type=device,
                    timestamp=t,
                    metadata={'variant': variant}
                ))
                t += timedelta(seconds=random.randint(4, 15))

            events_to_create.append(Event(
                user=user,
                session_id=sess_id,
                event_type='product_view',
                product=p,
                search_query=q_text,
                device_type=device,
                timestamp=t,
                metadata={'price': float(p.price), 'brand': p.brand}
            ))
            t += timedelta(seconds=random.randint(20, 60))

            events_to_create.append(Event(
                user=user,
                session_id=sess_id,
                event_type='add_to_cart',
                product=p,
                device_type=device,
                timestamp=t,
                metadata={'size': 'L', 'price': float(p.price)}
            ))
            t += timedelta(seconds=random.randint(25, 75))

            events_to_create.append(Event(
                user=user,
                session_id=sess_id,
                event_type='checkout_started',
                device_type=device,
                timestamp=t,
                metadata={'cart_value': float(p.price)}
            ))
            t += timedelta(seconds=random.randint(30, 90))

            # Purchase Completed!
            order_id = f"TL-ORD-{uuid.uuid4().hex[:10].upper()}"
            discount = Decimal(str(round(float(p.price) * 0.15, 2))) if random.random() < 0.4 else Decimal('0.00')
            delivery_fee = Decimal('0.00') if p.price >= 999 else Decimal('99.00')
            final_p = p.price - discount + delivery_fee

            ord_obj = Order(
                order_id=order_id,
                user=user,
                session_id=sess_id,
                total_amount=p.price,
                discount_amount=discount,
                delivery_fee=delivery_fee,
                final_amount=final_p,
                delivery_days=p.delivery_days,
                payment_method=random.choice(['UPI', 'Card', 'COD', 'NetBanking']),
                status='CONFIRMED',
                shipping_name=f"{user.first_name} {user.last_name}" if user else "Shopper",
                shipping_city=random.choice(['Bengaluru', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Pune', 'Chennai']),
                shipping_pincode=f"{random.randint(110001, 700099)}",
                created_at=t
            )
            orders_to_create.append(ord_obj)

            order_items_to_create.append(OrderItem(
                order=ord_obj,
                product=p,
                product_name=p.name,
                brand=p.brand,
                size='L',
                quantity=1,
                unit_price=p.price,
                image_url=p.image_url
            ))

            events_to_create.append(Event(
                user=user,
                session_id=sess_id,
                event_type='purchase_completed',
                product=p,
                device_type=device,
                timestamp=t,
                metadata={
                    'order_id': order_id,
                    'final_amount': float(final_p),
                    'payment_method': ord_obj.payment_method,
                    'variant': variant
                }
            ))

        elif journey_type == 4:
            # Wishlist add
            p = random.choice(products)
            events_to_create.append(Event(
                user=user,
                session_id=sess_id,
                event_type='product_view',
                product=p,
                device_type=device,
                timestamp=t,
                metadata={'price': float(p.price)}
            ))
            t += timedelta(seconds=random.randint(10, 30))

            events_to_create.append(Event(
                user=user,
                session_id=sess_id,
                event_type='wishlist_add',
                product=p,
                device_type=device,
                timestamp=t,
                metadata={'source': 'detail_page'}
            ))

    # Bulk insert sessions
    print("   Inserting UserSessions...")
    UserSession.objects.bulk_create(sessions_to_create, batch_size=3000)

    # Bulk insert orders and items
    print(f"   Inserting {len(orders_to_create):,} Orders...")
    Order.objects.bulk_create(orders_to_create, batch_size=2000)
    OrderItem.objects.bulk_create(order_items_to_create, batch_size=2000)

    # Bulk insert events
    print(f"   Inserting {len(events_to_create):,} Behavioral Telemetry Events...")
    Event.objects.bulk_create(events_to_create, batch_size=5000)

    total_ev = Event.objects.count()
    total_ord = Order.objects.count()
    total_sess = UserSession.objects.count()
    print(f"============================================================")
    print(f"  [SUCCESS] SYNTHETIC DATA GENERATION COMPLETE!")
    print(f"  - Total User Sessions: {total_sess:,}")
    print(f"  - Total Telemetry Events: {total_ev:,}")
    print(f"  - Total Converted Orders: {total_ord:,}")
    print(f"============================================================")

    # Export datasets to /data/ for SQL, Python, Power BI
    export_csv_data()

def export_csv_data():
    import csv
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
    os.makedirs(data_dir, exist_ok=True)

    print("Exporting datasets to /data/ CSV directory for BI & SQL analysis...")

    # Export Events
    events_path = os.path.join(data_dir, 'events.csv')
    with open(events_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['event_id', 'user_id', 'session_id', 'event_type', 'product_id', 'search_query', 'device_type', 'timestamp'])
        for ev in Event.objects.iterator(chunk_size=5000):
            writer.writerow([ev.event_id, ev.user_id, ev.session_id, ev.event_type, ev.product_id, ev.search_query, ev.device_type, ev.timestamp.isoformat()])

    # Export Orders
    orders_path = os.path.join(data_dir, 'orders.csv')
    with open(orders_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['order_id', 'user_id', 'session_id', 'total_amount', 'discount_amount', 'delivery_fee', 'final_amount', 'delivery_days', 'payment_method', 'status', 'created_at'])
        for o in Order.objects.iterator(chunk_size=2000):
            writer.writerow([o.order_id, o.user_id, o.session_id, o.total_amount, o.discount_amount, o.delivery_fee, o.final_amount, o.delivery_days, o.payment_method, o.status, o.created_at.isoformat()])

    # Export Products
    products_path = os.path.join(data_dir, 'products.csv')
    with open(products_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['id', 'name', 'brand', 'category_id', 'price', 'original_price', 'discount_percentage', 'rating', 'rating_count', 'color', 'delivery_days', 'occasion', 'season', 'material', 'popularity_score'])
        for p in Product.objects.iterator(chunk_size=1000):
            writer.writerow([p.id, p.name, p.brand, p.category_id, p.price, p.original_price, p.discount_percentage, p.rating, p.rating_count, p.color, p.delivery_days, p.occasion, p.season, p.material, p.popularity_score])

    print("   [DONE] Exported events.csv, orders.csv, products.csv successfully.")

if __name__ == '__main__':
    generate_synthetic_telemetry()
