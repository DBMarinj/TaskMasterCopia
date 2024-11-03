from rest_framework import serializers
from .models import User  # Asegúrate de importar el modelo User personalizado
from django.contrib.auth import get_user_model


User = get_user_model()  # Obtiene el modelo de usuario personalizado

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'nombre', 'apellido', 'estado', 'celular', 'direccion']
        extra_kwargs = {
            'password': {'write_only': True},
            'estado': {'required': False}  # Hacer el campo 'estado' opcional
        }

    def create(self, validated_data):
        # Crear un nuevo usuario con la contraseña encriptada
        user = User(**validated_data)
        user.set_password(validated_data['password'])  # Guardar la contraseña encriptada
        user.save()
        return user

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ['password']

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'nombre', 'apellido', 'estado', 'celular', 'direccion']
        extra_kwargs = {
            'password': {'write_only': True},
            'estado': {'required': False}  # Hacer el campo 'estado' opcional
        }

    def create(self, validated_data):
        # Usar un valor por defecto si 'estado' no está presente
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            nombre=validated_data.get('nombre', ''),  # Agregar valor por defecto si es None
            apellido=validated_data.get('apellido', ''),  # Agregar valor por defecto si es None
            estado=validated_data.get('estado', True),  # Usar True como valor predeterminado
            celular=validated_data.get('celular', ''),  # Agregar valor por defecto si es None
            direccion=validated_data.get('direccion', '')  # Agregar valor por defecto si es None
        )
        return user

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)  # Nuevo campo

    # Validaciones personalizadas para old_password
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Contraseña actual incorrecta.")
        return value

    # Validación personalizada para new_password
    def validate_new_password(self, value):
        # Ejemplo de regla: longitud mínima de 8 caracteres
        if len(value) < 8:
            raise serializers.ValidationError("La nueva contraseña debe tener al menos 8 caracteres.")
        return value

    # Validación global para confirmar la contraseña
    def validate(self, data):
        new_password = data.get('new_password')
        confirm_password = data.get('confirm_password')

        # Verifica que confirm_password coincida con new_password
        if new_password != confirm_password:
            raise serializers.ValidationError({
                "confirm_password": "Las contraseñas no coinciden."
            })

        return data

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        # Verificar si el correo existe en la base de datos
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("No hay ningún usuario con este correo.")
        return value

class SetNewPasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True, min_length=6)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("Las contraseñas no coinciden.")
        return data

    def save(self, user):
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user
