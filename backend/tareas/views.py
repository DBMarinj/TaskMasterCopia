from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Tarea, Etiqueta, Prioridad, Estado
from .serializers import TareaSerializer, EtiquetaSerializer, PrioridadSerializer, EstadoSerializer


# ViewSet para Tarea
class TareaViewSet(viewsets.ModelViewSet):
    serializer_class = TareaSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    # Definimos un queryset por defecto vacío para evitar el error del basename
    queryset = Tarea.objects.none()  # Esto es necesario para que DRF no lance el error

    # Sobrescribimos el método get_queryset para filtrar las tareas por usuario logueado
    def get_queryset(self):
        # Retorna solo las tareas que pertenecen al usuario logueado
        return Tarea.objects.filter(usuario=self.request.user)

    # Sobrescribimos perform_create para asegurarnos de que la tarea se asocie al usuario que la crea
    def perform_create(self, serializer):
        # Guarda el usuario actual como el usuario asociado a la tarea
        serializer.save(usuario=self.request.user)


# ViewSet para Etiqueta
class EtiquetaViewSet(viewsets.ModelViewSet):
    queryset = Etiqueta.objects.all()
    serializer_class = EtiquetaSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

# ViewSet para Prioridad
class PrioridadViewSet(viewsets.ModelViewSet):
    queryset = Prioridad.objects.all()
    serializer_class = PrioridadSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

# ViewSet para Estado
class EstadoViewSet(viewsets.ModelViewSet):
    queryset = Estado.objects.all()
    serializer_class = EstadoSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
