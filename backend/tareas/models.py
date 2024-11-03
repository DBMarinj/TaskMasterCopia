from django.db import models
from authentification.models import User

# Modelo Prioridad
class Prioridad(models.Model):
    id_prioridad = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50, choices=[
        ('baja', 'Baja'),
        ('media', 'Media'),
        ('alta', 'Alta')
    ])

    def __str__(self):
        return self.nombre

# Modelo Estado
class Estado(models.Model):
    id_estado = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50, choices=[
        ('pendiente', 'Pendiente'),
        ('progreso', 'En Progreso'),
        ('completado', 'Completado')
    ])

    def __str__(self):
        return self.nombre

# Modelo Etiqueta
class Etiqueta(models.Model):
    id_etiqueta = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre   


# Modelo Tareas
class Tarea(models.Model):
    id_tarea = models.AutoField(primary_key=True)
    titulo = models.CharField(max_length=100, null=True, blank=True)  # Nuevo campo para título
    descripcion = models.CharField(max_length=255)    
    fecha_vencimiento = models.DateTimeField(null=True, blank=True)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tareas')
    prioridad = models.ForeignKey(Prioridad, on_delete=models.CASCADE, related_name='tareas')
    estado = models.ForeignKey(Estado, on_delete=models.CASCADE, related_name='tareas')
    etiquetas = models.ManyToManyField(Etiqueta, related_name='tareas', blank=True)

    def __str__(self):
        return self.titulo if self.titulo else self.descripcion  # Devuelve título si está presente
