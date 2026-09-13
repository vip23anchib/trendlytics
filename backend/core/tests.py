from django.test import TestCase
from django.contrib.auth.models import User
from .models import UserProfile, UserSession, Experiment

class CoreApiTests(TestCase):
    def test_session_init_and_ab_assignment(self):
        # 1. Test session initialization with deterministic A/B hashing
        res = self.client.post('/api/session/init/', {
            'session_id': 'test_sess_001',
            'device_type': 'mobile',
        }, content_type='application/json')
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data['session_id'], 'test_sess_001')
        self.assertIn(data['experiment_variant'], ['control_keyword', 'treatment_ai_search'])

    def test_demo_personas_endpoint(self):
        res = self.client.get('/api/personas/')
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertGreaterEqual(len(data), 3)

    def test_user_registration_and_login(self):
        res = self.client.post('/api/auth/register/', {
            'email': 'pm.candidate@trendlytics.io',
            'password': 'safePassword123',
            'name': 'PM Candidate',
            'segment': 'trendsetter',
        }, content_type='application/json')
        self.assertEqual(res.status_code, 201)

        # Login
        login_res = self.client.post('/api/auth/login/', {
            'email': 'pm.candidate@trendlytics.io',
            'password': 'safePassword123',
        }, content_type='application/json')
        self.assertEqual(login_res.status_code, 200)
