import re
import os
import time
import json
import requests
from django.db.models import Q, Count, Min, Max, Avg
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Category, SubCategory, Product
from .serializers import CategorySerializer, ProductListSerializer, ProductDetailSerializer

class CategoryListView(APIView):
    def get(self, request):
        categories = Category.objects.prefetch_related('subcategories').all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

class ProductListView(APIView):
    def get(self, request):
        queryset = Product.objects.select_related('category', 'subcategory').all()

        # Filters
        category_param = request.query_params.get('category')
        if category_param:
            queryset = queryset.filter(Q(category__slug__iexact=category_param) | Q(category__name__iexact=category_param))

        subcategory_param = request.query_params.get('subcategory')
        if subcategory_param:
            queryset = queryset.filter(subcategory__slug__iexact=subcategory_param)

        min_price = request.query_params.get('min_price')
        if min_price:
            try:
                queryset = queryset.filter(price__gte=float(min_price))
            except ValueError:
                pass

        max_price = request.query_params.get('max_price')
        if max_price:
            try:
                queryset = queryset.filter(price__lte=float(max_price))
            except ValueError:
                pass

        brands = request.query_params.get('brands')
        if brands:
            brand_list = [b.strip() for b in brands.split(',') if b.strip()]
            if brand_list:
                queryset = queryset.filter(brand__in=brand_list)

        colors = request.query_params.get('colors')
        if colors:
            color_list = [c.strip() for c in colors.split(',') if c.strip()]
            if color_list:
                queryset = queryset.filter(color__in=color_list)

        sizes = request.query_params.get('sizes')
        if sizes:
            size_list = [s.strip() for s in sizes.split(',') if s.strip()]
            size_queries = Q()
            for s in size_list:
                size_queries |= Q(available_sizes__contains=s)
            queryset = queryset.filter(size_queries)

        min_rating = request.query_params.get('min_rating')
        if min_rating:
            try:
                queryset = queryset.filter(rating__gte=float(min_rating))
            except ValueError:
                pass

        min_discount = request.query_params.get('min_discount')
        if min_discount:
            try:
                queryset = queryset.filter(discount_percentage__gte=int(min_discount))
            except ValueError:
                pass

        occasion = request.query_params.get('occasion')
        if occasion:
            queryset = queryset.filter(occasion__iexact=occasion)

        season = request.query_params.get('season')
        if season:
            queryset = queryset.filter(season__iexact=season)

        material = request.query_params.get('material')
        if material:
            queryset = queryset.filter(material__icontains=material)

        is_trending = request.query_params.get('is_trending')
        if is_trending and is_trending.lower() == 'true':
            queryset = queryset.filter(is_trending=True)

        is_featured = request.query_params.get('is_featured')
        if is_featured and is_featured.lower() == 'true':
            queryset = queryset.filter(is_featured=True)

        # Keyword search (Standard Keyword Matching)
        search_query = request.query_params.get('search')
        if search_query:
            query = search_query.strip()
            queryset = queryset.filter(
                Q(name__icontains=query) |
                Q(brand__icontains=query) |
                Q(description__icontains=query) |
                Q(category__name__icontains=query) |
                Q(color__icontains=query) |
                Q(occasion__icontains=query) |
                Q(material__icontains=query)
            )

        # Sorting
        sort_by = request.query_params.get('sort_by', 'popularity')
        if sort_by == 'price_asc':
            queryset = queryset.order_by('price')
        elif sort_by == 'price_desc':
            queryset = queryset.order_by('-price')
        elif sort_by == 'rating':
            queryset = queryset.order_by('-rating', '-rating_count')
        elif sort_by == 'discount':
            queryset = queryset.order_by('-discount_percentage')
        elif sort_by == 'newest':
            queryset = queryset.order_by('-created_at')
        else: # 'popularity'
            queryset = queryset.order_by('-popularity_score', '-rating')

        # Pagination
        try:
            page = int(request.query_params.get('page', 1))
            page_size = int(request.query_params.get('page_size', 24))
        except ValueError:
            page = 1
            page_size = 24

        total_count = queryset.count()
        start = (page - 1) * page_size
        end = start + page_size
        paginated_products = queryset[start:end]

        serializer = ProductListSerializer(paginated_products, many=True)

        # Build facet metadata for dynamic sidebar filtering
        all_brands = Product.objects.values_list('brand', flat=True).distinct()[:25]
        all_colors = Product.objects.values_list('color', flat=True).distinct()[:20]
        all_occasions = [occ[0] for occ in Product.OCCASIONS]

        return Response({
            'total_count': total_count,
            'page': page,
            'page_size': page_size,
            'total_pages': (total_count + page_size - 1) // page_size if page_size > 0 else 1,
            'results': serializer.data,
            'facets': {
                'brands': sorted(list(set(all_brands))),
                'colors': sorted(list(set(all_colors))),
                'occasions': all_occasions,
                'price_range': {
                    'min': 399,
                    'max': 12999
                }
            }
        })

class ProductDetailView(APIView):
    def get(self, request, pk):
        try:
            product = Product.objects.select_related('category', 'subcategory').get(pk=pk)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProductDetailSerializer(product)
        return Response(serializer.data)

class SimilarProductsView(APIView):
    def get(self, request, pk):
        try:
            target = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        # Recommendations based on Category, Occasion, Color similarity and price band (+/- 40%)
        min_p = float(target.price) * 0.6
        max_p = float(target.price) * 1.4

        similar = Product.objects.filter(
            category=target.category
        ).exclude(id=target.id).filter(
            Q(occasion=target.occasion) | Q(color=target.color) | Q(price__range=(min_p, max_p))
        ).order_by('-popularity_score', '-rating')[:8]

        serializer = ProductListSerializer(similar, many=True)
        return Response(serializer.data)

class RecommendedProductsView(APIView):
    def get(self, request):
        user_id = request.query_params.get('user_id')
        category = request.query_params.get('category')

        queryset = Product.objects.all()
        if category:
            queryset = queryset.filter(category__slug__iexact=category)

        # High rating and popularity mix
        recommended = queryset.filter(rating__gte=4.2).order_by('-popularity_score', '-rating')[:12]
        serializer = ProductListSerializer(recommended, many=True)
        return Response(serializer.data)

class AISmartSearchView(APIView):
    """
    AI-Assisted Natural Language Intent Search (Treatment Variant).
    Extracts structured attributes from complex phrases and queries the catalog.
    E.g. 'black floral maxi dress for summer wedding under 3000' ->
    { category: 'dress', color: 'black', pattern: 'floral', occasion: 'wedding', season: 'summer', max_price: 3000 }
    """
    def post(self, request):
        start_time = time.time()
        query = request.data.get('query', '').strip()
        session_id = request.data.get('session_id', '')

        if not query:
            return Response({'error': 'Query string cannot be empty'}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Intent Extraction (LLM with local fallback)
        intent = self._extract_intent(query)
        extraction_time_ms = round((time.time() - start_time) * 1000, 2)

        # 2. Query Construction based on structured intent
        queryset = Product.objects.select_related('category', 'subcategory').all()

        filters_applied = {}

        if intent.get('category'):
            cat = intent['category']
            queryset = queryset.filter(
                Q(category__name__icontains=cat) |
                Q(category__slug__icontains=cat) |
                Q(subcategory__name__icontains=cat) |
                Q(name__icontains=cat)
            )
            filters_applied['category'] = cat

        if intent.get('color'):
            col = intent['color']
            queryset = queryset.filter(Q(color__icontains=col) | Q(name__icontains=col))
            filters_applied['color'] = col

        if intent.get('occasion'):
            occ = intent['occasion']
            queryset = queryset.filter(Q(occasion__icontains=occ) | Q(description__icontains=occ))
            filters_applied['occasion'] = occ

        if intent.get('season'):
            seas = intent['season']
            queryset = queryset.filter(Q(season__icontains=seas) | Q(description__icontains=seas))
            filters_applied['season'] = seas

        if intent.get('max_price'):
            p_max = float(intent['max_price'])
            queryset = queryset.filter(price__lte=p_max)
            filters_applied['max_price'] = p_max

        if intent.get('min_price'):
            p_min = float(intent['min_price'])
            queryset = queryset.filter(price__gte=p_min)
            filters_applied['min_price'] = p_min

        if intent.get('material'):
            mat = intent['material']
            queryset = queryset.filter(Q(material__icontains=mat) | Q(description__icontains=mat))
            filters_applied['material'] = mat

        # Fallback if too strict: relaxed search
        match_count = queryset.count()
        is_relaxed = False
        if match_count == 0:
            is_relaxed = True
            tokens = query.split()
            fallback_q = Q()
            for token in tokens:
                if len(token) > 2 and token.lower() not in ['for', 'the', 'and', 'with', 'under', 'less', 'than', 'below']:
                    fallback_q |= Q(name__icontains=token) | Q(brand__icontains=token) | Q(description__icontains=token)
            queryset = Product.objects.filter(fallback_q)

        total_latency_ms = round((time.time() - start_time) * 1000, 2)
        results = queryset.order_by('-popularity_score', '-rating')[:30]
        serializer = ProductListSerializer(results, many=True)

        return Response({
            'query': query,
            'intent': intent,
            'filters_applied': filters_applied,
            'is_relaxed_fallback': is_relaxed,
            'total_matches': len(results),
            'execution_time_ms': total_latency_ms,
            'extraction_time_ms': extraction_time_ms,
            'parser_engine': intent.get('engine', 'Deterministic Semantic NLP Engine'),
            'results': serializer.data
        })

    def _extract_intent(self, query):
        """
        Extracts structured shopping intent using LLM if configured, or deterministic rule engine.
        """
        gemini_api_key = os.environ.get('GEMINI_API_KEY')
        openai_api_key = os.environ.get('OPENAI_API_KEY')

        if gemini_api_key:
            try:
                # Call Gemini API
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_api_key}"
                prompt = f"""
                You are a fashion e-commerce intent parser. Extract structured shopping parameters from this user search:
                "{query}"

                Respond ONLY with a valid JSON object matching this schema:
                {{
                    "category": string or null (e.g. "dress", "shirt", "shoes", "jacket", "kurtas", "jeans", "t-shirt", "handbag", "sneakers", "heels", "watch", "makeup"),
                    "color": string or null (e.g. "black", "white", "red", "blue", "green", "pink", "beige", "floral", "navy", "yellow"),
                    "occasion": string or null (e.g. "Wedding", "Party", "Formal", "Casual", "Sports"),
                    "season": string or null (e.g. "Summer", "Winter", "All Season"),
                    "max_price": number or null,
                    "min_price": number or null,
                    "material": string or null (e.g. "cotton", "silk", "denim", "leather", "linen")
                }}
                """
                payload = {
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {"temperature": 0.1, "response_mime_type": "application/json"}
                }
                res = requests.post(url, json=payload, timeout=2.5)
                if res.status_code == 200:
                    text_resp = res.json()['candidates'][0]['content']['parts'][0]['text']
                    data = json.loads(text_resp)
                    data['engine'] = 'Gemini 1.5 Flash (Server-Side LLM)'
                    return data
            except Exception:
                pass # Fallback cleanly to semantic rule parser

        # Robust Deterministic Semantic NLP Parser (Zero-dependency, high precision fallback)
        intent = {
            'category': None,
            'color': None,
            'occasion': None,
            'season': None,
            'max_price': None,
            'min_price': None,
            'material': None,
            'engine': 'Deterministic Semantic NLP Engine (Local Fallback)'
        }
        q_lower = query.lower()

        # Colors
        colors = ['black', 'white', 'red', 'blue', 'green', 'pink', 'beige', 'yellow', 'navy', 'olive', 'maroon', 'floral', 'brown', 'grey', 'gray', 'purple', 'gold', 'silver', 'emerald', 'lavender', 'burgundy']
        for col in colors:
            if re.search(rf'\b{col}\b', q_lower):
                intent['color'] = col.capitalize()
                break

        # Categories & items
        categories = {
            'dress': ['dress', 'maxi', 'midi', 'frock', 'gown'],
            'shirt': ['shirt', 'shirts', 'button down', 'oxford'],
            't-shirt': ['t-shirt', 'tshirt', 'tee', 't-shirts', 'tees', 'polo'],
            'kurtas': ['kurta', 'kurtas', 'kurti', 'kurtis', 'anarkali', 'ethnic'],
            'shoes': ['shoes', 'sneakers', 'heels', 'flats', 'sandals', 'boots', 'loafers', 'footwear', 'pumps'],
            'jeans': ['jeans', 'denim pants', 'trousers', 'chinos', 'joggers'],
            'jacket': ['jacket', 'blazer', 'coat', 'hoodie', 'sweatshirt', 'cardigan', 'sweater'],
            'accessories': ['bag', 'handbag', 'tote', 'clutch', 'watch', 'sunglasses', 'belt', 'wallet', 'jewellery', 'earrings'],
            'beauty': ['perfume', 'fragrance', 'lipstick', 'serum', 'makeup', 'skincare']
        }
        for cat_key, synonyms in categories.items():
            for syn in synonyms:
                if re.search(rf'\b{syn}\b', q_lower):
                    intent['category'] = cat_key.capitalize()
                    break
            if intent['category']:
                break

        # Occasions
        occasions = {
            'Wedding': ['wedding', 'marriage', 'festive', 'festival', 'diwali', 'reception', 'shaadi'],
            'Party': ['party', 'clubbing', 'night out', 'cocktail', 'celebration'],
            'Formal': ['formal', 'office', 'work', 'interview', 'corporate', 'business'],
            'Casual': ['casual', 'daily wear', 'everyday', 'college', 'weekend'],
            'Sports': ['sports', 'gym', 'workout', 'running', 'athleisure', 'training']
        }
        for occ_key, synonyms in occasions.items():
            for syn in synonyms:
                if re.search(rf'\b{syn}\b', q_lower):
                    intent['occasion'] = occ_key
                    break
            if intent['occasion']:
                break

        # Seasons
        seasons = {
            'Summer': ['summer', 'spring', 'hot', 'beach', 'breathable', 'lightweight'],
            'Winter': ['winter', 'autumn', 'fall', 'cold', 'warm', 'woolen']
        }
        for seas_key, synonyms in seasons.items():
            for syn in synonyms:
                if re.search(rf'\b{syn}\b', q_lower):
                    intent['season'] = seas_key
                    break
            if intent['season']:
                break

        # Materials
        materials = ['cotton', 'silk', 'linen', 'denim', 'leather', 'polyester', 'velvet', 'chiffon', 'satin', 'wool']
        for mat in materials:
            if re.search(rf'\b{mat}\b', q_lower):
                intent['material'] = mat.capitalize()
                break

        # Max Price Regex ("under 3000", "below 2500", "< 1500", "less than 2000", "within 4000", "under 3k")
        price_patterns = [
            r'(?:under|below|less\s+than|within|<=?|budget\s+of)\s*(?:rs\.?|inr|₹)?\s*(\d+)(k\b)?',
            r'(?:rs\.?|inr|₹)\s*(\d+)\s*(?:or\s+less|max)',
        ]
        for pattern in price_patterns:
            match = re.search(pattern, q_lower)
            if match:
                val = int(match.group(1))
                if match.group(2) == 'k':
                    val *= 1000
                intent['max_price'] = val
                break

        # Min Price Regex ("above 1000", "over 2000", "> 1500")
        min_patterns = [
            r'(?:above|over|more\s+than|>=?)\s*(?:rs\.?|inr|₹)?\s*(\d+)(k\b)?'
        ]
        for pattern in min_patterns:
            match = re.search(pattern, q_lower)
            if match:
                val = int(match.group(1))
                if match.group(2) == 'k':
                    val *= 1000
                intent['min_price'] = val
                break

        return intent
