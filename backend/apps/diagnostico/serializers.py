from rest_framework import serializers
from .models import ResultadoIA


class DiagnosticoInputSerializer(serializers.Serializer):
    """Serializer para la entrada de síntomas al diagnóstico IA."""
    paciente_id = serializers.IntegerField()
    sintomas = serializers.ListField(
        child=serializers.CharField(max_length=100),
        min_length=1,
        help_text='Lista de síntomas seleccionados'
    )


class ResultadoIASerializer(serializers.ModelSerializer):
    """Serializer completo del resultado de diagnóstico IA."""
    paciente_nombre = serializers.CharField(source='paciente.nombre', read_only=True)

    class Meta:
        model = ResultadoIA
        fields = [
            'id', 'paciente', 'paciente_nombre',
            'sintomas_ingresados', 'diagnostico_predicho',
            'confianza', 'top_predicciones', 'estado',
            'notas_medico', 'fecha'
        ]
        read_only_fields = ['id', 'fecha']


class ActualizarEstadoSerializer(serializers.Serializer):
    """Serializer para actualizar el estado de un resultado IA."""
    estado = serializers.ChoiceField(choices=ResultadoIA.EstadoResultado.choices)
    notas_medico = serializers.CharField(required=False, allow_blank=True, default='')
