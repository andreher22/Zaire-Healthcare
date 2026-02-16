from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Paciente
from .serializers import PacienteSerializer


class PacienteViewSet(viewsets.ModelViewSet):
    """
    ViewSet para CRUD completo de pacientes (RF-02, RF-03).
    
    GET    /api/pacientes/        → Listar pacientes
    POST   /api/pacientes/        → Registrar paciente
    GET    /api/pacientes/<id>/   → Detalle del paciente
    PUT    /api/pacientes/<id>/   → Actualizar paciente
    DELETE /api/pacientes/<id>/   → Eliminar paciente
    """
    serializer_class = PacienteSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nombre', 'contacto']
    ordering_fields = ['nombre', 'fecha_registro', 'fecha_nacimiento']
    filterset_fields = ['sexo']

    def get_queryset(self):
        """Retornar solo pacientes del médico autenticado."""
        return Paciente.objects.filter(
            usuario=self.request.user
        ).select_related('usuario')

    def perform_create(self, serializer):
        """Asignar el médico autenticado al crear un paciente."""
        serializer.save(usuario=self.request.user)
