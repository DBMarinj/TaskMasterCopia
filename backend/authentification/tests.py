from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from authentification.models import User

class AuthAPITestCase(APITestCase):
    def setUp(self):
        # Crear un usuario para las pruebas
        self.user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpassword',
            nombre = 'test',
            apellido = 'test2',           
        )
        self.login_url = reverse('token_obtain_pair')  # Se Asume que usa `TokenObtainPairView`
   
    def test_login_incorrecto_data_real(self):#información que se encuentra en la BD
        # Datos correctos para hacer login
        data = {
            'username': 'Mstudios',
            'password': 'Mstudios24**'
        }
        response = self.client.post(self.login_url, data)
       
          # Verificar que el código de estado sea 401 Unauthorized
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)       

    def test_login_correcto(self):
        # Datos correctos para hacer login
        data = {
            'username': 'testuser',
            'password': 'testpassword'
        }
        response = self.client.post(self.login_url, data)
       
        # Verificar que el código de estado sea 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)  # Verifica que el token de acceso esté presente en la respuesta
   
    def test_login_incorrecto(self):
        # Datos incorrectos para hacer login
        data = {
            'username': 'Yvelandia',
            'password': 'Yvelandia3+'
        }
        response = self.client.post(self.login_url, data)
       
      
   
