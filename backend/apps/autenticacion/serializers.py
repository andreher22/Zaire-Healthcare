from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import Usuario, RegistroAcceso


class UsuarioSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Usuario."""

    class Meta:
        model = Usuario
        fields = [
            'id', 'correo', 'nombre', 'rol',
            'is_active', 'fecha_creacion', 'fecha_actualizacion'
        ]
        read_only_fields = ['id', 'fecha_creacion', 'fecha_actualizacion']


class RegistroUsuarioSerializer(serializers.ModelSerializer):
    """Serializer para registrar un nuevo usuario."""
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = Usuario
        fields = ['correo', 'nombre', 'password', 'password_confirm', 'rol']

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': 'Las contraseñas no coinciden.'
            })
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        return Usuario.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    """Serializer para el inicio de sesión."""
    correo = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        usuario = authenticate(
            username=data['correo'],
            password=data['password']
        )
        if not usuario:
            raise serializers.ValidationError(
                'Credenciales inválidas. Verifique su correo y contraseña.'
            )
        if not usuario.is_active:
            raise serializers.ValidationError(
                'Esta cuenta ha sido desactivada.'
            )
        data['usuario'] = usuario
        return data


class EditarPerfilSerializer(serializers.ModelSerializer):
    """Serializer para editar el perfil del usuario autenticado."""

    class Meta:
        model = Usuario
        fields = ['nombre']

    def validate_nombre(self, value):
        """Validar que el nombre tenga al menos 3 caracteres."""
        if len(value.strip()) < 3:
            raise serializers.ValidationError(
                'El nombre debe tener al menos 3 caracteres.'
            )
        return value.strip()


class RegistroAccesoSerializer(serializers.ModelSerializer):
    """Serializer para registros de acceso."""
    usuario_nombre = serializers.CharField(source='usuario.nombre', read_only=True)

    class Meta:
        model = RegistroAcceso
        fields = [
            'id', 'usuario', 'usuario_nombre', 'tipo_operacion',
            'fecha', 'direccion_ip', 'detalle'
        ]
        read_only_fields = ['id', 'fecha']
