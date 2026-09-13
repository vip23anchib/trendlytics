from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.contrib.auth.models import User
from .models import Event
from .serializers import EventSerializer, EventIngestSerializer
from products.models import Product
from core.models import UserSession

class TrackEventView(APIView):
    """
    First-party telemetry event ingestion endpoint.
    Accepts single event object or a batch list of event objects.
    """
    def post(self, request):
        data = request.data
        if isinstance(data, list):
            events_to_create = []
            for item in data:
                ev = self._parse_and_prepare(item)
                if ev:
                    events_to_create.append(ev)
            created = Event.objects.bulk_create(events_to_create)
            return Response({'status': 'success', 'tracked_count': len(created)}, status=status.HTTP_201_CREATED)
        else:
            ev = self._parse_and_prepare(data)
            if ev:
                ev.save()
                return Response({'status': 'success', 'event_id': str(ev.event_id)}, status=status.HTTP_201_CREATED)
            return Response({'error': 'Invalid event payload'}, status=status.HTTP_400_BAD_REQUEST)

    def _parse_and_prepare(self, data):
        session_id = data.get('session_id')
        event_type = data.get('event_type')
        if not session_id or not event_type:
            return None

        user_id = data.get('user_id')
        user = None
        if user_id:
            user = User.objects.filter(id=user_id).first()

        product_id = data.get('product_id')
        product = None
        if product_id:
            product = Product.objects.filter(id=product_id).first()

        device_type = data.get('device_type', 'desktop')
        search_query = data.get('search_query', '')
        metadata = data.get('metadata', {})

        # Ensure session exists in core UserSession table
        UserSession.objects.get_or_create(
            session_id=session_id,
            defaults={
                'user': user,
                'device_type': device_type,
            }
        )

        return Event(
            user=user,
            session_id=session_id,
            event_type=event_type,
            product=product,
            search_query=search_query,
            device_type=device_type,
            metadata=metadata,
            timestamp=timezone.now()
        )

class LiveEventFeedView(APIView):
    """
    Returns latest 50 live telemetry events for in-app real-time analytics inspection.
    """
    def get(self, request):
        limit = int(request.query_params.get('limit', 50))
        events = Event.objects.select_related('product', 'user').order_by('-timestamp')[:limit]
        serializer = EventSerializer(events, many=True)
        return Response({
            'total_events_in_db': Event.objects.count(),
            'recent_events': serializer.data
        })
