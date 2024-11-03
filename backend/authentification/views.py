from django.contrib.auth import authenticate, login, logout, get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status,viewsets,permissions, generics
from .models import User
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import UserSerializer, RegisterSerializer, ChangePasswordSerializer,PasswordResetRequestSerializer,SetNewPasswordSerializer,UserUpdateSerializer
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth.views import PasswordResetView
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.template.loader import render_to_string
from django.urls import reverse
from .tokens import custom_token_generator  # Token personalizado
from django.utils.http import urlsafe_base64_decode
from django.contrib.sites.shortcuts import get_current_site
from django.contrib.auth.tokens import default_token_generator
from django.utils.html import strip_tags
from django.core.mail import EmailMultiAlternatives # permiten q los tag de html los pueda enviar y las alternitivas para enviar el correo para que vaya como un adjunto y no como html

user = get_user_model()

authentication_classes = [JWTAuthentication]

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]  # Permitir que cualquier persona pueda crear un usuario

    def create(self, request):# crea el usuario
        serializer = self.get_serializer(data=request.data)#obtiene los datos enviados
        serializer.is_valid(raise_exception=True)#valida si hay una restricción
        user = serializer.save()#inserta los datos
        return Response(serializer.data, status=status.HTTP_201_CREATED)#retorna 'usuario creado exitosamente'
    
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_data = {
            'id': user.id,  # Asegúrate de incluir el ID del usuario
            'username': user.username,
            'nombre': user.nombre,
            'apellido': user.apellido,
            'direccion': user.direccion,
            'celular': user.celular,
            'estado': user.estado,
            'email' : user.email
        }
        return Response(user_data)


class HomeView(APIView):
   permission_classes = (IsAuthenticated, )
   def get(self, request):
       content = {'message': 'Welcome to the JWT Authentication page using React Js and Django!'}
       return Response(content)
   
class LogoutView(APIView):
    permission_classes = (IsAuthenticated, )
    def post(self, request):
        # Borramos de la request la información de sesión
        refresh_token = request.data["refresh_token"]
        #print(refresh_token)
        token = RefreshToken(refresh_token)
        token.blacklist()
        #logout(request)        
        # Devolvemos la respuesta al cliente
        return Response(status=status.HTTP_200_OK)

class UpdateProfileView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        # Filtrar solo el perfil del usuario autenticado
        return User.objects.filter(id=self.request.user.id)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)  # Si 'partial' es True, se usará PATCH
        instance = self.get_object()  # Obtener el usuario actual
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def perform_update(self, serializer):
        """Guarda los cambios en el usuario autenticado, incluyendo la actualización segura del password."""
        # Extraer los datos validados
        validated_data = serializer.validated_data

        # Si la nueva contraseña está presente, encriptarla antes de guardar
        password = validated_data.get('password', None)
        if password:
            # Establecer la contraseña encriptada
            serializer.instance.set_password(password)

        # Guardar el resto de los datos
        serializer.save()


User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


class UserUpdateView(generics.UpdateAPIView):
    queryset = user.objects.all()
    serializer_class = UserUpdateSerializer

class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

@method_decorator(csrf_exempt, name='dispatch')
class CustomPasswordResetView(PasswordResetView):
    pass

class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self, queryset=None):
        return self.request.user

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Verificar la contraseña antigua
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": "Incorrecta"}, status=status.HTTP_400_BAD_REQUEST)

            # Cambiar la contraseña
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            return Response({"status": "Contraseña actualizada con éxito"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetCompleteView(APIView):
    def get(self, request):
        return Response({"message": "Tu contraseña ha sido restablecida con éxito."}, status=status.HTTP_200_OK)

class PasswordResetRequestView(APIView):
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = User.objects.get(email=email)

            # Generar el token de restablecimiento de contraseña
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = custom_token_generator.make_token(user)

            # Crear el enlace de restablecimiento de contraseña
            #reset_link = reverse('password_reset_confirm', kwargs={'uidb64': uid, 'token': token})
            reset_url = f"http://localhost:3000/password-reset-confirm/{uid}/{token}/"

            # Enviar el correo electrónico
            subject = 'Recuperación de contraseña'
            message = render_to_string('password_reset_email.html', {
                'user': user,
                'reset_url': reset_url,
            })
            contenido_html= strip_tags(message)
            correo=EmailMultiAlternatives(subject, contenido_html, 'noreply@myapp.com', [email])

            correo.attach_alternative(message, "text/html")
            correo.send()
            

            return Response({"message": "Correo de recuperación de contraseña enviado."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class PasswordResetConfirmView(APIView):
    def post(self, request, uidb64, token):
        try:
            # Decodificar el UID del usuario
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"error": "Enlace inválido."}, status=status.HTTP_400_BAD_REQUEST)


        # Verificar si el token es válido
        if not default_token_generator.check_token(user, token):
            return Response({"error": "El enlace para restablecer la contraseña es inválido o ha expirado."}, status=status.HTTP_400_BAD_REQUEST)

        # Si el token es válido, permitir al usuario cambiar la contraseña
        serializer = SetNewPasswordSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response({"message": "La contraseña ha sido restablecida con éxito."}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
"""permission_classes = (IsAuthenticated,)
     def post(self, request):
          
          try:
               refresh_token = request.data["refresh_token"]
               token = RefreshToken(refresh_token)
               token.blacklist()

               return Response(status=status.HTTP_205_RESET_CONTENT)
          except Exception as e:
               return Response(status=status.HTTP_400_BAD_REQUEST)   """