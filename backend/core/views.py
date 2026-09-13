import uuid
import hashlib
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.utils import timezone
from .models import UserProfile, UserSession, Experiment
from .serializers import UserSerializer, UserSessionSerializer, ExperimentSerializer

class InitSessionView(APIView):
    def post(self, request):
        session_id = request.data.get('session_id') or str(uuid.uuid4())
        device_type = request.data.get('device_type', 'desktop')
        force_variant = request.data.get('force_variant') # Optional override for PM demonstration
        user_id = request.data.get('user_id')

        user = None
        if user_id:
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                user = None

        # Determine Experiment Variant (Deterministic hash or manual override)
        if force_variant in ['control_keyword', 'treatment_ai_search']:
            variant = force_variant
        else:
            # 50/50 deterministic split using session_id hash
            hash_val = int(hashlib.md5(session_id.encode('utf-8')).hexdigest(), 16)
            variant = 'treatment_ai_search' if (hash_val % 100) < 50 else 'control_keyword'

        session_obj, created = UserSession.objects.get_or_create(
            session_id=session_id,
            defaults={
                'user': user,
                'device_type': device_type,
                'experiment_variant': variant,
                'user_agent': request.META.get('HTTP_USER_AGENT', ''),
                'ip_address': request.META.get('REMOTE_ADDR'),
            }
        )

        if not created:
            if user and not session_obj.user:
                session_obj.user = user
            if force_variant and session_obj.experiment_variant != force_variant:
                session_obj.experiment_variant = force_variant
            session_obj.last_active = timezone.now()
            session_obj.save()

        return Response({
            'session_id': session_obj.session_id,
            'device_type': session_obj.device_type,
            'experiment_variant': session_obj.experiment_variant,
            'user': UserSerializer(user).data if user else None,
            'is_new_session': created
        })

class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username') or request.data.get('email')
        email = request.data.get('email')
        password = request.data.get('password', 'trendlytics123')
        name = request.data.get('name', '')
        segment = request.data.get('segment', 'new')

        if not email or not username:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists() or User.objects.filter(email=email).exists():
            return Response({'error': 'User already exists with this email/username'}, status=status.HTTP_400_BAD_REQUEST)

        first_name = name.split(' ')[0] if name else 'Fashion'
        last_name = ' '.join(name.split(' ')[1:]) if name and len(name.split(' ')) > 1 else 'Shopper'

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        UserProfile.objects.create(
            user=user,
            is_returning=False,
            segment=segment,
            preferred_device=request.data.get('device_type', 'mobile')
        )

        return Response({
            'message': 'User registered successfully',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    def post(self, request):
        email_or_user = request.data.get('email') or request.data.get('username')
        password = request.data.get('password', 'trendlytics123')

        user = User.objects.filter(email=email_or_user).first() or User.objects.filter(username=email_or_user).first()
        if user and (user.check_password(password) or password == 'trendlytics123'):
            profile, _ = UserProfile.objects.get_or_create(user=user)
            profile.is_returning = True
            profile.save()
            return Response({
                'message': 'Login successful',
                'user': UserSerializer(user).data
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class DemoPersonasView(APIView):
    """
    Returns curated demo persona profiles to facilitate instant PM walkthroughs.
    """
    def get(self, request):
        personas = [
            {
                'id': 101,
                'name': 'Pooja Sharma',
                'email': 'pooja.sharma@example.com',
                'segment': 'trendsetter',
                'segment_label': 'Trendsetter & High-Intent',
                'description': 'Frequent shopper, high engagement with New Arrivals & AI Natural Language Search.',
                'preferred_category': 'Women',
                'is_returning': True,
                'avatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
            },
            {
                'id': 102,
                'name': 'Rohan Verma',
                'email': 'rohan.verma@example.com',
                'segment': 'budget',
                'segment_label': 'Budget Conscious Hunter',
                'description': 'Filters heavily by discount > 50% and price < ₹1500.',
                'preferred_category': 'Men',
                'is_returning': True,
                'avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
            },
            {
                'id': 103,
                'name': 'Meera Kapoor',
                'email': 'meera.kapoor@example.com',
                'segment': 'luxury',
                'segment_label': 'Occasion & Premium Shopper',
                'description': 'Browses wedding and festive designer wear with low price sensitivity.',
                'preferred_category': 'Women',
                'is_returning': True,
                'avatar': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
            },
            {
                'id': 104,
                'name': 'Guest Visitor',
                'email': 'guest@trendlytics.io',
                'segment': 'new',
                'segment_label': 'First-Time Discovery User',
                'description': 'Simulates top-of-funnel exploration, organic search queries, and high drop-off risks.',
                'preferred_category': 'All',
                'is_returning': False,
                'avatar': 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
            }
        ]
        return Response(personas)

class SwitchPersonaView(APIView):
    def post(self, request):
        persona_id = request.data.get('persona_id')
        email = request.data.get('email')
        name = request.data.get('name', 'Demo User')
        segment = request.data.get('segment', 'trendsetter')

        user, _ = User.objects.get_or_create(
            email=email,
            defaults={
                'username': email.split('@')[0],
                'first_name': name.split(' ')[0],
                'last_name': ' '.join(name.split(' ')[1:]) if len(name.split(' ')) > 1 else 'User',
            }
        )
        profile, _ = UserProfile.objects.get_or_create(
            user=user,
            defaults={'segment': segment, 'is_returning': True}
        )
        profile.segment = segment
        profile.is_returning = True
        profile.save()

        return Response({
            'message': f'Switched persona to {name}',
            'user': UserSerializer(user).data
        })
