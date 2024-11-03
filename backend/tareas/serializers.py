from rest_framework import serializers
from .models import Prioridad, Estado, Etiqueta, Tarea

# Serializador para el modelo de Prioridad
class PrioridadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prioridad
        fields = ['id_prioridad', 'nombre']

# Serializador para el modelo de Estado
class EstadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estado
        fields = ['id_estado', 'nombre']

# Serializador para el modelo de Etiqueta
class EtiquetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Etiqueta
        fields = ['id_etiqueta', 'nombre']

# Serializador para el modelo de Tarea/envío por id estado y prioridad
class TareaSerializer(serializers.ModelSerializer):
    etiquetas = EtiquetaSerializer(many=True, required=False)
    estado = serializers.PrimaryKeyRelatedField(queryset=Estado.objects.all())  # Usamos el ID en lugar del objeto
    prioridad = serializers.PrimaryKeyRelatedField(queryset=Prioridad.objects.all())  # Usamos el ID en lugar del objeto

    class Meta:
        model = Tarea
        fields = [
            'id_tarea', 'titulo', 'descripcion', 'fecha_vencimiento', 
            'usuario', 'prioridad', 'estado', 'etiquetas'  # Incluye el nuevo campo 'título'
        ]

    # Método para crear una nueva tarea junto con etiquetas relacionadas
    def create(self, validated_data):
        # Extrae datos de etiquetas del diccionario validated_data
        etiquetas_data = validated_data.pop('etiquetas', [])
        # Crea una nueva instancia de Tarea con el resto de validated_data, incluyendo 'titulo'
        tarea = Tarea.objects.create(**validated_data)

        # Crea o obtiene etiquetas, y las asocia a la tarea
        for etiqueta in etiquetas_data:
            etiqueta_obj, created = Etiqueta.objects.get_or_create(nombre=etiqueta['nombre'])
            tarea.etiquetas.add(etiqueta_obj)  # Cambiado a 'etiquetas'
        
        return tarea

    # Método para actualizar una tarea existente junto con etiquetas relacionadas
    def update(self, instance, validated_data):
        # Extrae datos de etiquetas del diccionario validated_data
        etiquetas_data = validated_data.pop('etiquetas', [])
        
        # Actualiza los campos restantes de la tarea, incluyendo 'titulo'
        for attr, value in validated_data.items():
            setattr(instance, attr, value)  # Aplica los cambios en los campos restantes
        instance.save()  # Guarda la instancia actualizada

        # Actualiza las etiquetas asociadas
        if etiquetas_data:
            instance.etiquetas.clear()  # Elimina etiquetas actuales
            for etiqueta in etiquetas_data:
                etiqueta_obj, created = Etiqueta.objects.get_or_create(nombre=etiqueta['nombre'])
                instance.etiquetas.add(etiqueta_obj)  # Cambiado a 'etiquetas'
        
        return instance
