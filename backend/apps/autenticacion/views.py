from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Count, Q
from .models import Usuario, RegistroAcceso
from .serializers import (
    UsuarioSerializer,
    RegistroUsuarioSerializer,
    LoginSerializer,
    EditarPerfilSerializer,
    RegistroAccesoSerializer,
)


class LoginView(APIView):
    """
    POST /api/auth/login/
    Inicio de sesión con JWT (RF-01).
    Retorna access y refresh token.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        usuario = serializer.validated_data['usuario']
        refresh = RefreshToken.for_user(usuario)

        # Registrar acceso (RF-12)
        RegistroAcceso.objects.create(
            usuario=usuario,
            tipo_operacion=RegistroAcceso.TipoOperacion.LOGIN,
            direccion_ip=self._get_client_ip(request),
            detalle='Inicio de sesión exitoso'
        )

        return Response({
            'mensaje': 'Inicio de sesión exitoso',
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            },
            'usuario': UsuarioSerializer(usuario).data,
        }, status=status.HTTP_200_OK)

    def _get_client_ip(self, request):
        """Obtener la IP del cliente."""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0]
        return request.META.get('REMOTE_ADDR')


class LogoutView(APIView):
    """
    POST /api/auth/logout/
    Cierre de sesión — invalida el refresh token (RF-11).
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()

            # Registrar cierre de sesión (RF-12)
            RegistroAcceso.objects.create(
                usuario=request.user,
                tipo_operacion=RegistroAcceso.TipoOperacion.LOGOUT,
                detalle='Cierre de sesión'
            )

            return Response(
                {'mensaje': 'Sesión cerrada correctamente'},
                status=status.HTTP_200_OK
            )
        except Exception:
            return Response(
                {'error': 'Token inválido'},
                status=status.HTTP_400_BAD_REQUEST
            )


class RegistroUsuarioView(APIView):
    """
    POST /api/auth/registro/
    Registro de nuevos usuarios (solo admin).
    """
    permission_classes = [permissions.IsAdminUser]

    def post(self, request):
        serializer = RegistroUsuarioSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        usuario = serializer.save()

        return Response({
            'mensaje': 'Usuario registrado exitosamente',
            'usuario': UsuarioSerializer(usuario).data,
        }, status=status.HTTP_201_CREATED)


class PerfilView(APIView):
    """
    GET  /api/auth/perfil/ — Obtener perfil del usuario autenticado.
    PUT  /api/auth/perfil/ — Actualizar datos del perfil.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Retornar datos del perfil del usuario autenticado."""
        serializer = UsuarioSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        """Actualizar datos editables del perfil (nombre)."""
        serializer = EditarPerfilSerializer(
            request.user, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            'mensaje': 'Perfil actualizado correctamente',
            'usuario': UsuarioSerializer(request.user).data,
        })

    def patch(self, request):
        """Alias de PUT para actualización parcial."""
        return self.put(request)


class EstadisticasView(APIView):
    """
    GET /api/auth/estadisticas/
    Retornar estadísticas del dashboard para el médico autenticado.
    Incluye conteos reales de pacientes, diagnósticos y pendientes.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Calcular y retornar estadísticas en tiempo real."""
        from apps.pacientes.models import Paciente
        from apps.diagnostico.models import ResultadoIA
        from apps.historial.models import EventoClinico
        from django.utils import timezone
        from datetime import timedelta

        usuario = request.user
        hoy = timezone.now().date()
        inicio_semana = hoy - timedelta(days=hoy.weekday())

        # Conteos generales
        total_pacientes = Paciente.objects.filter(usuario=usuario).count()
        total_diagnosticos = ResultadoIA.objects.filter(
            paciente__usuario=usuario
        ).count()
        pendientes = ResultadoIA.objects.filter(
            paciente__usuario=usuario,
            estado='pendiente'
        ).count()

        # Estadísticas de la semana
        diagnosticos_semana = ResultadoIA.objects.filter(
            paciente__usuario=usuario,
            fecha__date__gte=inicio_semana
        ).count()
        pacientes_semana = Paciente.objects.filter(
            usuario=usuario,
            fecha_registro__date__gte=inicio_semana
        ).count()

        # Eventos recientes (últimos 5)
        eventos_recientes = EventoClinico.objects.filter(
            historial__paciente__usuario=usuario
        ).select_related(
            'historial__paciente'
        ).order_by('-fecha')[:5].values(
            'id', 'tipo', 'fecha',
            'historial__paciente__nombre',
            'diagnostico'
        )

        # Diagnósticos más frecuentes (top 5)
        diagnosticos_frecuentes = ResultadoIA.objects.filter(
            paciente__usuario=usuario
        ).values('diagnostico_predicho').annotate(
            total=Count('id')
        ).order_by('-total')[:5]

        return Response({
            'resumen': {
                'total_pacientes': total_pacientes,
                'total_diagnosticos': total_diagnosticos,
                'pendientes': pendientes,
            },
            'semana': {
                'diagnosticos': diagnosticos_semana,
                'pacientes_nuevos': pacientes_semana,
            },
            'actividad_reciente': list(eventos_recientes),
            'diagnosticos_frecuentes': list(diagnosticos_frecuentes),
        })


class RegistroAccesoListView(generics.ListAPIView):
    """
    GET /api/auditoria/accesos/
    Listar registros de acceso (RF-12).
    """
    serializer_class = RegistroAccesoSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        return RegistroAcceso.objects.select_related('usuario').all()
