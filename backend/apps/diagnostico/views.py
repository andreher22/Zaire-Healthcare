from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView

from .models import ResultadoIA
from .serializers import (
    DiagnosticoInputSerializer,
    ResultadoIASerializer,
    ActualizarEstadoSerializer,
)
from .ml.servicio_ia import predecir_diagnostico, obtener_lista_sintomas
from apps.pacientes.models import Paciente
from apps.autenticacion.models import RegistroAcceso


class DiagnosticarView(APIView):
    """
    POST /api/diagnostico/predecir/
    Enviar síntomas y obtener diagnóstico asistido por IA (RF-08).
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = DiagnosticoInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Verificar que el paciente pertenece al médico
        try:
            paciente = Paciente.objects.get(
                pk=serializer.validated_data['paciente_id'],
                usuario=request.user
            )
        except Paciente.DoesNotExist:
            return Response(
                {'error': 'Paciente no encontrado o no tiene acceso.'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Realizar predicción
        sintomas = serializer.validated_data['sintomas']
        resultado = predecir_diagnostico(sintomas)

        if resultado.get('error') and resultado['diagnostico'] is None:
            return Response(
                {'error': resultado['error']},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        # Guardar resultado en BD
        resultado_ia = ResultadoIA.objects.create(
            paciente=paciente,
            sintomas_ingresados=sintomas,
            diagnostico_predicho=resultado['diagnostico'],
            confianza=resultado['confianza'],
            top_predicciones=resultado['top_predicciones'],
        )

        # Registrar operación de diagnóstico (RF-12)
        RegistroAcceso.objects.create(
            usuario=request.user,
            tipo_operacion=RegistroAcceso.TipoOperacion.DIAGNOSTICO,
            detalle=f'Diagnóstico IA para paciente {paciente.nombre}: {resultado["diagnostico"]}'
        )

        return Response({
            'mensaje': 'Diagnóstico realizado exitosamente',
            'resultado': ResultadoIASerializer(resultado_ia).data,
        }, status=status.HTTP_201_CREATED)


class SintomasDisponiblesView(APIView):
    """
    GET /api/diagnostico/sintomas/
    Obtener lista de síntomas disponibles para el modelo de IA.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        sintomas = obtener_lista_sintomas()
        return Response({
            'total': len(sintomas),
            'sintomas': sintomas,
        })


class HistorialDiagnosticosView(ListAPIView):
    """
    GET /api/diagnostico/historial/
    Listar todos los diagnósticos IA realizados por el médico (RF-09).
    """
    serializer_class = ResultadoIASerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ResultadoIA.objects.filter(
            paciente__usuario=self.request.user
        ).select_related('paciente')


class DetalleResultadoView(RetrieveAPIView):
    """
    GET /api/diagnostico/<id>/
    Obtener detalle de un resultado de diagnóstico IA.
    """
    serializer_class = ResultadoIASerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ResultadoIA.objects.filter(
            paciente__usuario=self.request.user
        ).select_related('paciente')


class ActualizarEstadoView(APIView):
    """
    PATCH /api/diagnostico/<id>/estado/
    Actualizar el estado de un resultado IA (aceptar/rechazar) (RF-10).
    """
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            resultado = ResultadoIA.objects.get(
                pk=pk,
                paciente__usuario=request.user
            )
        except ResultadoIA.DoesNotExist:
            return Response(
                {'error': 'Resultado no encontrado.'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ActualizarEstadoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        resultado.estado = serializer.validated_data['estado']
        resultado.notas_medico = serializer.validated_data.get('notas_medico', '')
        resultado.save()

        return Response({
            'mensaje': 'Estado actualizado correctamente',
            'resultado': ResultadoIASerializer(resultado).data,
        })
