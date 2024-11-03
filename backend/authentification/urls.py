from django.urls import path, include  # Importa las funciones para crear rutas y permitir la inclusión de otras rutas
from . import views  # Importa las vistas personalizadas desde el archivo views.py
from rest_framework.routers import DefaultRouter  # Importa DefaultRouter para registrar viewsets automáticamente
from .views import CurrentUserView, UserViewSet, UpdateProfileView, RegisterView, UserDetailView, ChangePasswordView, PasswordResetRequestView  # Importa las vistas que se utilizarán en las rutas
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth.views import PasswordResetCompleteView
from .views import PasswordResetCompleteView, PasswordResetConfirmView, UserUpdateView  # Vista para completar el cambio de contraseña

# Crea una instancia de DefaultRouter, que gestiona automáticamente las rutas para los viewsets
router = DefaultRouter()

# Registra el UserViewSet para gestionar el CRUD del usuario (creación, lectura, actualización, eliminación)
router.register(r'users', UserViewSet)  # El endpoint será 'users/' y permitirá manejar todas las operaciones de usuario

# Registra el UpdateProfileView, un viewset personalizado para actualizar el perfil del usuario
# router.register(r'update-profile', UpdateProfileView, basename='update-profile')  # El endpoint será 'update-profile/'



# Define las rutas principales del proyecto
urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('user/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Ruta para obtener los datos del usuario autenticado
    path('current-user/', CurrentUserView.as_view(), name='current-user'),
    
    # Incluye todas las rutas generadas automáticamente por el router, como 'users/' y 'update-profile/'
    path('', include(router.urls)),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('password-reset-confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('password-reset-complete/', PasswordResetCompleteView.as_view(), name='password_reset_complete'),
    path('update-profile/users/<int:pk>/update/', UpdateProfileView.as_view({'put': 'update'}), name='update-profile'),
    path('current-user/', CurrentUserView.as_view(), name='current-user'),
    path('users/<int:pk>/update/',UserUpdateView.as_view(), name='user-update')
]

# Añade rutas adicionales que no están relacionadas con los viewsets
urlpatterns += [
    # Ruta para la vista 'home', que muestra una página de bienvenida
    path('home/', views.HomeView.as_view(), name='home'),
    
    # Ruta para cerrar sesión, que probablemente invalida el token o realiza logout
    path('logout/', views.LogoutView.as_view(), name='logout'),
]
