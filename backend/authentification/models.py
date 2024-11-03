from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):#misma del modelo de django
    nombre = models.CharField(max_length=100, blank=True, null=True)
    apellido = models.CharField(max_length=100, blank=True, null=True)
    direccion = models.CharField(max_length=255, blank=True, null=True)    
    celular = models.CharField(max_length=15, blank=True, null=True) # Se recomienda CharField para números de teléfono
    estado = models.BooleanField(default=True)  # True para activo, False para inactivo 

    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('vendedor', 'Vendedor'),
        ('comprador', 'Comprador'),
    )
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='comprador')
    
    def __str__(self):
        return self.username