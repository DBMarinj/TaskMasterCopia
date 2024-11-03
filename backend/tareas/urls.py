from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TareaViewSet, EtiquetaViewSet, PrioridadViewSet, EstadoViewSet

router = DefaultRouter()
router.register(r'tareas', TareaViewSet)
router.register(r'etiquetas', EtiquetaViewSet)
router.register(r'prioridades', PrioridadViewSet)
router.register(r'estados', EstadoViewSet)




urlpatterns = [
    path('', include(router.urls)),
]
