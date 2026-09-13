from django.urls import path
from .views import InitSessionView, RegisterView, LoginView, DemoPersonasView, SwitchPersonaView

urlpatterns = [
    path('session/init/', InitSessionView.as_view(), name='init_session'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('personas/', DemoPersonasView.as_view(), name='demo_personas'),
    path('personas/switch/', SwitchPersonaView.as_view(), name='switch_persona'),
]
