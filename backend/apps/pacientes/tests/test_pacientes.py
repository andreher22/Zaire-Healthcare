from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.pacientes.models import Paciente

User = get_user_model()

class PacientesCRUDTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.medico = User.objects.create_user(
            correo='medico@zaire.com', 
            nombre='Dr. House',
            password='password123', 
            rol='medico'
        )
        self.client.force_authenticate(user=self.medico)
        
        self.paciente_data = {
            'nombre': 'Juan Perez',
            'fecha_nacimiento': '1990-01-01',
            'sexo': 'M',
            'contacto': '555-1234',
            'direccion': 'Calle Falsa 123'
        }

    def test_crear_paciente(self):
        """Prueba de creación de paciente"""
        response = self.client.post('/api/pacientes/', self.paciente_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Paciente.objects.count(), 1)
        self.assertEqual(Paciente.objects.get().nombre, 'Juan Perez')

    def test_listar_pacientes(self):
        """Prueba de listado de pacientes propios"""
        Paciente.objects.create(usuario=self.medico, **self.paciente_data)
        response = self.client.get('/api/pacientes/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
