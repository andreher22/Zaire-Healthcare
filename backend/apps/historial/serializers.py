from rest_framework import serializers
from .models import HistorialClinico, EventoClinico


class EventoClinicoSerializer(serializers.ModelSerializer):
    """Serializer para eventos clínicos individuales."""

    class Meta:
        model = EventoClinico
        fields = [
            'id', 'historial', 'tipo', 'descripcion',
            'sintomas', 'diagnostico', 'tratamiento',
            'notas', 'fecha'
        ]
        read_only_fields = ['id', 'fecha']


class HistorialClinicoSerializer(serializers.ModelSerializer):
    """Serializer del historial clínico con eventos anidados."""
    eventos = EventoClinicoSerializer(many=True, read_only=True)
    paciente_nombre = serializers.CharField(source='paciente.nombre', read_only=True)

    class Meta:
        model = HistorialClinico
        fields = [
            'id', 'paciente', 'paciente_nombre', 'fecha_apertura',
            'observaciones_generales', 'alergias', 'antecedentes',
            'eventos'
        ]
        read_only_fields = ['id', 'fecha_apertura']


class HistorialClinicoResumenSerializer(serializers.ModelSerializer):
    """Serializer resumido sin eventos (para listados)."""
    paciente_nombre = serializers.CharField(source='paciente.nombre', read_only=True)
    total_eventos = serializers.IntegerField(source='eventos.count', read_only=True)

    class Meta:
        model = HistorialClinico
        fields = [
            'id', 'paciente', 'paciente_nombre',
            'fecha_apertura', 'total_eventos'
        ]
