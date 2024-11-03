from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from authentification.models import User
from tareas.models import Prioridad, Estado, Etiqueta, Tarea
from rest_framework_simplejwt.tokens import RefreshToken

class TareaAPITestCase(APITestCase):

    def setUp(self):
        # Crear un usuario con datos adicionales para las pruebas
        self.user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpassword',
            nombre='Test',
            apellido='User',
            direccion='123 Calle Falsa',
            celular='123456789',
            estado=True,
            role='comprador'
        )

        # Crear una prioridad, estado y etiqueta para asociar con la tarea
        self.prioridad = Prioridad.objects.create(nombre='alta')
        self.estado = Estado.objects.create(nombre='pendiente')
        self.etiqueta = Etiqueta.objects.create(nombre='Importante')

        # Generar el token de autenticación
        refresh = RefreshToken.for_user(self.user)
        self.token = str(refresh.access_token)

        # URL para la creación de tareas
        self.tareas_url = reverse('tarea-list')

    def test_crear_tarea(self):
        # Datos para la creación de una tarea, asegurando que el campo 'usuario' esté presente
        data = {
            'descripcion': 'Nueva tarea de prueba',
            'fecha_vencimiento': '2024-12-31T23:59:59Z',
            'prioridad': self.prioridad.id_prioridad,
            'estado': self.estado.id_estado,
            'etiquetas': [{'nombre': 'Importante'}],
            'usuario': self.user.id  # Se incluye el campo 'usuario'
        }

        # Hacer la solicitud de creación con el token de autorización
        response = self.client.post(
            self.tareas_url,
            data,
            HTTP_AUTHORIZATION=f'Bearer {self.token}',
            format='json'
        )

        # Imprimir respuesta para inspección en caso de fallo
        print(response.data)

        # Verificar que la tarea se haya creado correctamente
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Tarea.objects.count(), 1)
        self.assertEqual(Tarea.objects.get().descripcion, 'Nueva tarea de prueba')

    def test_crear_tarea_sin_autenticacion(self):
        # Datos para la creación de una tarea sin enviar el token
        data = {
            'descripcion': 'Tarea sin autenticación',
            'fecha_vencimiento': '2024-12-31T23:59:59Z',
            'prioridad': self.prioridad.id_prioridad,
            'estado': self.estado.id_estado,
            'etiquetas': [{'nombre': 'Importante'}],
            'usuario': self.user.id  # Se incluye el campo 'usuario'
        }

        # Hacer la solicitud de creación sin token
        response = self.client.post(self.tareas_url, data, format='json')

        # Verificar que el acceso sea denegado
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
