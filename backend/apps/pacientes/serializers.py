from rest_framework import serializers
from .models import Paciente


class PacienteSerializer(serializers.ModelSerializer):
    """Serializer completo del modelo Paciente."""
    edad = serializers.IntegerField(read_only=True)
    medico_nombre = serializers.CharField(source='usuario.nombre', read_only=True)

    class Meta:
        model = Paciente
        fields = [
            'id', 'usuario', 'medico_nombre', 'nombre',
            'fecha_nacimiento', 'sexo', 'contacto', 'direccion',
            'edad', 'fecha_registro', 'fecha_actualizacion'
        ]
        read_only_fields = ['id', 'usuario', 'fecha_registro', 'fecha_actualizacion']

    def create(self, validated_data):
        """Asignar automáticamente el médico autenticado."""
        validated_data['usuario'] = self.context['request'].user
        return super().create(validated_data)


class PacienteResumenSerializer(serializers.ModelSerializer):
    """Serializer resumido para listados."""
    edad = serializers.IntegerField(read_only=True)

    class Meta:
        model = Paciente
        fields = ['id', 'nombre', 'edad', 'sexo', 'fecha_registro']
