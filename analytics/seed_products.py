import os
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

import django
from decimal import Decimal
import random

# Setup django environment
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'trendlytics_backend.settings')
django.setup()

from products.models import Category, SubCategory, Product
from core.models import Experiment

def seed_categories():
    categories_data = [
        {
            'name': 'Women',
            'slug': 'women',
            'description': 'Dresses, Kurtas, Tops, Ethnic Wear & Contemporary Western',
            'image_url': 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80',
            'icon_name': 'Sparkles',
            'subcategories': ['Dresses', 'Kurtas & Suits', 'Tops & Tees', 'Sarees', 'Trousers & Jeans', 'Blazers & Jackets']
        },
        {
            'name': 'Men',
            'slug': 'men',
            'description': 'Casual Shirts, Formal Trousers, Polos, Denim & Winter Wear',
            'image_url': 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&auto=format&fit=crop&q=80',
            'icon_name': 'Shirt',
            'subcategories': ['Casual Shirts', 'Formal Shirts', 'T-Shirts & Polos', 'Jeans & Chinos', 'Jackets & Hoodies', 'Kurtas']
        },
        {
            'name': 'Footwear',
            'slug': 'footwear',
            'description': 'Sneakers, Formal Shoes, High Heels, Loafers & Sports Running Shoes',
            'image_url': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80',
            'icon_name': 'Footprints',
            'subcategories': ['Sneakers', 'Formal Shoes', 'Heels & Pumps', 'Loafers & Flats', 'Running & Training Shoes']
        },
        {
            'name': 'Beauty',
            'slug': 'beauty',
            'description': 'Fragrances, Luxury Skincare, Matte Lipsticks & Radiant Makeup',
            'image_url': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
            'icon_name': 'Heart',
            'subcategories': ['Fragrances & Perfumes', 'Lipsticks & Lip Care', 'Serums & Skincare', 'Face Makeup & Blush']
        },
        {
            'name': 'Accessories',
            'slug': 'accessories',
            'description': 'Designer Handbags, Chronograph Watches, Sunglasses & Leather Belts',
            'image_url': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
            'icon_name': 'Watch',
            'subcategories': ['Handbags & Totes', 'Watches & Chronos', 'Sunglasses', 'Wallets & Belts', 'Fashion Jewellery']
        },
    ]

    cat_objs = {}
    for item in categories_data:
        cat, _ = Category.objects.get_or_create(
            slug=item['slug'],
            defaults={
                'name': item['name'],
                'description': item['description'],
                'image_url': item['image_url'],
                'icon_name': item['icon_name']
            }
        )
        cat_objs[item['slug']] = cat

        for sub_name in item['subcategories']:
            sub_slug = sub_name.lower().replace(' & ', '-').replace(' ', '-')
            SubCategory.objects.get_or_create(
                category=cat,
                slug=sub_slug,
                defaults={'name': sub_name}
            )

    print(f"✅ Seeded {len(cat_objs)} Categories and subcategories.")
    return cat_objs

def seed_products(categories):
    # Brands
    brands = [
        'Aura & Silk', 'Urban Thread', 'Saffron Studio', 'Noir Paris',
        'Loom & Weave', 'Vibe Republic', 'SoleCraft Co.', 'Velora Luxe',
        'Stitch & Stone', 'Aethel Modern', 'Kritika Ethnics', 'Verona Street'
    ]

    # Pre-curated realistic product catalog templates
    catalog_templates = [
        # WOMEN
        {
            'category': 'women',
            'subcategory': 'dresses',
            'name': 'Emerald Floral Chiffon Maxi Dress',
            'brand': 'Aura & Silk',
            'price': 2799,
            'original_price': 4999,
            'discount': 44,
            'rating': 4.6,
            'rating_count': 328,
            'color': 'Emerald',
            'available_sizes': ['XS', 'S', 'M', 'L', 'XL'],
            'delivery_days': 2,
            'occasion': 'Party',
            'season': 'Summer',
            'material': 'Chiffon Silk Blend',
            'image_url': 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80',
            'is_trending': True,
            'popularity_score': 96.0
        },
        {
            'category': 'women',
            'subcategory': 'dresses',
            'name': 'Midnight Black Satin Evening Slip Dress',
            'brand': 'Noir Paris',
            'price': 3499,
            'original_price': 5999,
            'discount': 41,
            'rating': 4.8,
            'rating_count': 512,
            'color': 'Black',
            'available_sizes': ['S', 'M', 'L'],
            'delivery_days': 3,
            'occasion': 'Party',
            'season': 'All Season',
            'material': 'Mulberry Satin',
            'image_url': 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80',
            'is_trending': True,
            'popularity_score': 98.0
        },
        {
            'category': 'women',
            'subcategory': 'kurtas-suits',
            'name': 'Pastel Peach Handcrafted Anarkali Kurta Set',
            'brand': 'Saffron Studio',
            'price': 4299,
            'original_price': 7499,
            'discount': 42,
            'rating': 4.7,
            'rating_count': 410,
            'color': 'Pink',
            'available_sizes': ['S', 'M', 'L', 'XL', 'XXL'],
            'delivery_days': 2,
            'occasion': 'Wedding',
            'season': 'All Season',
            'material': 'Chanderi Silk with Zari Work',
            'image_url': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
            'is_trending': True,
            'popularity_score': 94.5
        },
        {
            'category': 'women',
            'subcategory': 'tops-tees',
            'name': 'Ivory Linen Boxy Crop Top',
            'brand': 'Urban Thread',
            'price': 1299,
            'original_price': 2199,
            'discount': 40,
            'rating': 4.3,
            'rating_count': 189,
            'color': 'White',
            'available_sizes': ['XS', 'S', 'M', 'L'],
            'delivery_days': 3,
            'occasion': 'Casual',
            'season': 'Summer',
            'material': '100% Pure Organic Linen',
            'image_url': 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
            'is_trending': False,
            'popularity_score': 82.0
        },
        {
            'category': 'women',
            'subcategory': 'trousers-jeans',
            'name': 'High-Waist Wide Leg Vintage Denim Trousers',
            'brand': 'Stitch & Stone',
            'price': 2199,
            'original_price': 3999,
            'discount': 45,
            'rating': 4.5,
            'rating_count': 275,
            'color': 'Blue',
            'available_sizes': ['26', '28', '30', '32', '34'],
            'delivery_days': 4,
            'occasion': 'Casual',
            'season': 'All Season',
            'material': 'Rigid Cotton Denim',
            'image_url': 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80',
            'is_trending': True,
            'popularity_score': 89.0
        },

        # MEN
        {
            'category': 'men',
            'subcategory': 'casual-shirts',
            'name': 'Oversized Cuban Collar Linen Shirt',
            'brand': 'Urban Thread',
            'price': 1899,
            'original_price': 3299,
            'discount': 42,
            'rating': 4.5,
            'rating_count': 420,
            'color': 'Beige',
            'available_sizes': ['S', 'M', 'L', 'XL'],
            'delivery_days': 2,
            'occasion': 'Casual',
            'season': 'Summer',
            'material': '100% French Linen',
            'image_url': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
            'is_trending': True,
            'popularity_score': 95.0
        },
        {
            'category': 'men',
            'subcategory': 'formal-shirts',
            'name': 'Navy Tailored Egyptian Cotton Oxford Shirt',
            'brand': 'Loom & Weave',
            'price': 2499,
            'original_price': 4299,
            'discount': 41,
            'rating': 4.7,
            'rating_count': 380,
            'color': 'Navy',
            'available_sizes': ['38', '40', '42', '44'],
            'delivery_days': 3,
            'occasion': 'Formal',
            'season': 'All Season',
            'material': 'Giza Egyptian Cotton',
            'image_url': 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80',
            'is_trending': False,
            'popularity_score': 88.0
        },
        {
            'category': 'men',
            'subcategory': 't-shirts-polos',
            'name': 'Heavyweight Supima Cotton Crewneck Tee',
            'brand': 'Vibe Republic',
            'price': 999,
            'original_price': 1699,
            'discount': 41,
            'rating': 4.4,
            'rating_count': 650,
            'color': 'Black',
            'available_sizes': ['S', 'M', 'L', 'XL', 'XXL'],
            'delivery_days': 2,
            'occasion': 'Casual',
            'season': 'All Season',
            'material': '240 GSM Supima Cotton',
            'image_url': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
            'is_trending': True,
            'popularity_score': 92.0
        },
        {
            'category': 'men',
            'subcategory': 'jackets-hoodies',
            'name': 'Structured Charcoal Wool Blend Blazer',
            'brand': 'Noir Paris',
            'price': 5499,
            'original_price': 9999,
            'discount': 45,
            'rating': 4.8,
            'rating_count': 195,
            'color': 'Grey',
            'available_sizes': ['38', '40', '42', '44'],
            'delivery_days': 3,
            'occasion': 'Formal',
            'season': 'Winter',
            'material': 'Fine Merino Wool Blend',
            'image_url': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
            'is_trending': False,
            'popularity_score': 86.0
        },
        {
            'category': 'men',
            'subcategory': 'jeans-chinos',
            'name': 'Slim Tapered Stretch Selvedge Jeans',
            'brand': 'Stitch & Stone',
            'price': 2799,
            'original_price': 4999,
            'discount': 44,
            'rating': 4.6,
            'rating_count': 340,
            'color': 'Blue',
            'available_sizes': ['30', '32', '34', '36'],
            'delivery_days': 5,
            'occasion': 'Casual',
            'season': 'All Season',
            'material': 'Japanese Selvedge Denim',
            'image_url': 'https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80',
            'is_trending': True,
            'popularity_score': 87.0
        },

        # FOOTWEAR
        {
            'category': 'footwear',
            'subcategory': 'sneakers',
            'name': 'CloudGlide Retro Minimalist Leather Sneakers',
            'brand': 'SoleCraft Co.',
            'price': 3499,
            'original_price': 6499,
            'discount': 46,
            'rating': 4.7,
            'rating_count': 820,
            'color': 'White',
            'available_sizes': ['7', '8', '9', '10', '11'],
            'delivery_days': 2,
            'occasion': 'Casual',
            'season': 'All Season',
            'material': 'Full Grain Italian Leather',
            'image_url': 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80',
            'is_trending': True,
            'popularity_score': 99.0
        },
        {
            'category': 'footwear',
            'subcategory': 'heels-pumps',
            'name': 'Stiletto Pointed-Toe Velvet Pumps',
            'brand': 'Velora Luxe',
            'price': 2999,
            'original_price': 5299,
            'discount': 43,
            'rating': 4.6,
            'rating_count': 230,
            'color': 'Red',
            'available_sizes': ['5', '6', '7', '8', '9'],
            'delivery_days': 3,
            'occasion': 'Party',
            'season': 'All Season',
            'material': 'Plush Suede Velvet',
            'image_url': 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80',
            'is_trending': True,
            'popularity_score': 91.0
        },
        {
            'category': 'footwear',
            'subcategory': 'formal-shoes',
            'name': 'Classic Hand-Burnished Leather Oxford Brogues',
            'brand': 'SoleCraft Co.',
            'price': 4499,
            'original_price': 7999,
            'discount': 43,
            'rating': 4.8,
            'rating_count': 310,
            'color': 'Brown',
            'available_sizes': ['7', '8', '9', '10', '11'],
            'delivery_days': 2,
            'occasion': 'Formal',
            'season': 'All Season',
            'material': 'Hand-Burnished Calfskin Leather',
            'image_url': 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&auto=format&fit=crop&q=80',
            'is_trending': False,
            'popularity_score': 89.0
        },

        # BEAUTY
        {
            'category': 'beauty',
            'subcategory': 'fragrances-perfumes',
            'name': 'Oud Amber Noir Eau De Parfum (100ml)',
            'brand': 'Velora Luxe',
            'price': 3899,
            'original_price': 6500,
            'discount': 40,
            'rating': 4.9,
            'rating_count': 640,
            'color': 'Gold',
            'available_sizes': ['50ml', '100ml'],
            'delivery_days': 2,
            'occasion': 'Party',
            'season': 'All Season',
            'material': 'Artisanal Essential Oils',
            'image_url': 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
            'is_trending': True,
            'popularity_score': 97.0
        },
        {
            'category': 'beauty',
            'subcategory': 'lipsticks-lip-care',
            'name': 'Velvet Matte Liquid Lip Duo - Berry & Crimson',
            'brand': 'Velora Luxe',
            'price': 1199,
            'original_price': 1999,
            'discount': 40,
            'rating': 4.7,
            'rating_count': 920,
            'color': 'Red',
            'available_sizes': ['Pack of 2'],
            'delivery_days': 2,
            'occasion': 'Party',
            'season': 'All Season',
            'material': 'Hyaluronic Acid Infused Matte Pigment',
            'image_url': 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80',
            'is_trending': True,
            'popularity_score': 95.0
        },

        # ACCESSORIES
        {
            'category': 'accessories',
            'subcategory': 'handbags-totes',
            'name': 'Monogram Structured Leather Tote Bag',
            'brand': 'Noir Paris',
            'price': 4999,
            'original_price': 8999,
            'discount': 44,
            'rating': 4.8,
            'rating_count': 430,
            'color': 'Beige',
            'available_sizes': ['One Size'],
            'delivery_days': 3,
            'occasion': 'Formal',
            'season': 'All Season',
            'material': 'Vegan Saffiano Leather',
            'image_url': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
            'is_trending': True,
            'popularity_score': 96.0
        },
        {
            'category': 'accessories',
            'subcategory': 'watches-chronos',
            'name': 'Sapphire Crystal Chronograph Rose Gold Watch',
            'brand': 'Aethel Modern',
            'price': 6999,
            'original_price': 12999,
            'discount': 46,
            'rating': 4.9,
            'rating_count': 380,
            'color': 'Rose Gold',
            'available_sizes': ['40mm', '42mm'],
            'delivery_days': 2,
            'occasion': 'Formal',
            'season': 'All Season',
            'material': '316L Stainless Steel & Sapphire Crystal',
            'image_url': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
            'is_trending': True,
            'popularity_score': 98.0
        }
    ]

    # Additional high-quality fashion images for procedural generation
    fashion_photos = {
        'women': [
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=800&auto=format&fit=crop&q=80',
        ],
        'men': [
            'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1618886614638-8c038d432361?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&auto=format&fit=crop&q=80',
        ],
        'footwear': [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=800&auto=format&fit=crop&q=80',
        ],
        'beauty': [
            'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1617897903246-719242758050?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80',
        ],
        'accessories': [
            'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
        ]
    }

    # Generate 220+ high-quality catalog items
    adjectives = ['Tailored', 'Vintage', 'Artisanal', 'Bespoke', 'Relaxed Fit', 'Minimalist', 'Embroidered', 'Textured', 'Structured', 'Boho', 'Signature', 'Urban']
    colors_pool = ['Black', 'White', 'Navy', 'Emerald', 'Beige', 'Red', 'Pink', 'Burgundy', 'Olive', 'Maroon', 'Lavender', 'Charcoal']
    materials_pool = ['100% Cotton', 'Organic Linen', 'Mulberry Silk', 'Selvedge Denim', 'Merino Wool', 'Rayon Chiffon', 'Genuine Leather', 'Velvet Blend']
    occasions_pool = ['Casual', 'Party', 'Formal', 'Wedding', 'Sports', 'Loungewear']
    seasons_pool = ['Summer', 'Winter', 'All Season', 'Monsoon']

    created_products = []

    # 1. Insert manually curated core templates
    for item in catalog_templates:
        cat = categories.get(item['category'])
        sub = SubCategory.objects.filter(category=cat, slug=item['subcategory']).first()
        prod = Product.objects.create(
            name=item['name'],
            brand=item['brand'],
            category=cat,
            subcategory=sub,
            description=f"Crafted with premium {item['material']} for an unmatched luxurious silhouette. Designed for the discerning shopper seeking comfort and elegance.",
            price=Decimal(str(item['price'])),
            original_price=Decimal(str(item['original_price'])),
            discount_percentage=item['discount'],
            rating=item['rating'],
            rating_count=item['rating_count'],
            color=item['color'],
            available_sizes=item['available_sizes'],
            stock=random.randint(15, 120),
            delivery_days=item['delivery_days'],
            occasion=item['occasion'],
            season=item['season'],
            material=item['material'],
            popularity_score=item['popularity_score'],
            image_url=item['image_url'],
            is_trending=item['is_trending'],
            is_featured=True
        )
        created_products.append(prod)

    # 2. Expand procedural catalog to reach 220+ items across categories
    cat_keys = list(categories.keys())
    for i in range(210):
        cat_key = cat_keys[i % len(cat_keys)]
        cat = categories[cat_key]
        sub = SubCategory.objects.filter(category=cat).order_by('?').first()

        brand = random.choice(brands)
        adj = random.choice(adjectives)
        color = random.choice(colors_pool)
        material = random.choice(materials_pool)
        occasion = random.choice(occasions_pool)
        season = random.choice(seasons_pool)

        sub_name = sub.name if sub else 'Fashion Item'
        name = f"{brand} {adj} {color} {sub_name}"

        # Pricing realistic bands
        if cat_key == 'accessories' or cat_key == 'footwear':
            orig_p = random.randint(2499, 9999)
        elif cat_key == 'beauty':
            orig_p = random.randint(899, 3999)
        else:
            orig_p = random.randint(1499, 6999)

        disc = random.choice([20, 25, 30, 35, 40, 45, 50, 60])
        price = int(orig_p * (1 - disc / 100))

        # Size array depending on category
        if cat_key == 'footwear':
            sizes = ['6', '7', '8', '9', '10', '11']
        elif cat_key == 'accessories' or cat_key == 'beauty':
            sizes = ['One Size', 'Standard']
        else:
            sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

        photo_urls = fashion_photos.get(cat_key, fashion_photos['women'])
        img = random.choice(photo_urls)

        # Delivery days (1-5 days with realistic distribution)
        deliv = random.choices([2, 3, 4, 5, 6], weights=[35, 35, 15, 10, 5])[0]

        prod = Product.objects.create(
            name=name,
            brand=brand,
            category=cat,
            subcategory=sub,
            description=f"Elevate your daily wardrobe with this {adj.lower()} {sub_name.lower()}. Meticulously engineered from {material.lower()} offering breathable ease and modern style.",
            price=Decimal(str(price)),
            original_price=Decimal(str(orig_p)),
            discount_percentage=disc,
            rating=round(random.uniform(3.8, 4.9), 1),
            rating_count=random.randint(45, 950),
            color=color,
            available_sizes=sizes[:random.randint(1, len(sizes))] if len(sizes) > 1 else sizes,
            stock=random.randint(10, 80),
            delivery_days=deliv,
            occasion=occasion,
            season=season,
            material=material,
            popularity_score=round(random.uniform(65.0, 99.0), 1),
            image_url=img,
            is_trending=(random.random() < 0.25),
            is_featured=(random.random() < 0.15)
        )
        created_products.append(prod)

    print(f"✅ Total {len(created_products)} realistic fashion products successfully seeded in Database.")

def seed_experiment():
    exp, created = Experiment.objects.get_or_create(
        key='exp_ai_search_2026',
        defaults={
            'name': 'Natural Language Intent Search vs Keyword Search',
            'description': 'Evaluating the impact of AI semantic intent parsing on zero-result queries and search-to-purchase conversion.',
            'is_active': True,
            'control_name': 'control_keyword',
            'treatment_name': 'treatment_ai_search',
            'traffic_split_percent': 50
        }
    )
    print("✅ Seeded Experiment Configuration.")

if __name__ == '__main__':
    print("Starting Trendlytics Product Catalog Seeding...")
    cats = seed_categories()
    seed_products(cats)
    seed_experiment()
    print("Seeding Complete!")
