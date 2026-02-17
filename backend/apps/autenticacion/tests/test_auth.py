from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()

class AuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            'correo': 'medico@zaire.com',
            'nombre': 'Dr. Test',
            'password': 'password123',
            'rol': 'medico'
        }
        self.user = User.objects.create_user(**self.user_data)

        """Prueba de login exitoso con credenciales correctas"""
        response = self.client.post('/api/auth/login/', {
            'correo': 'medico@zaire.com',
            'password': 'password123'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('tokens', response.data)
        self.assertIn('access', response.data['tokens'])

    def test_login_failure(self):
        """Prueba de login fallido con contraseña incorrecta"""
        response = self.client.post('/api/auth/login/', {
            'correo': 'medico@zaire.com',
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
