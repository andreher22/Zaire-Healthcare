"""
ZAIRE Healthcare - URLs principales
Configuración central de rutas de la API.
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions


class APIRootView(APIView):
    """Vista raíz de la API — muestra los endpoints disponibles."""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({
            'proyecto': 'ZAIRE Healthcare API',
            'version': 'v1',
            'endpoints': {
                'auth': '/api/auth/',
                'pacientes': '/api/pacientes/',
                'historial': '/api/historial/',
                'diagnostico': '/api/diagnostico/',
                'auditoria': '/api/auditoria/',
                'admin': '/admin/',
            }
        })


urlpatterns = [
    # Panel de administración Django
    path('admin/', admin.site.urls),

    # Vista raíz de la API
    path('api/', APIRootView.as_view(), name='api-root'),

    # Módulos de la API
    path('api/auth/', include('apps.autenticacion.urls')),
    path('api/pacientes/', include('apps.pacientes.urls')),
    path('api/historial/', include('apps.historial.urls')),
    path('api/diagnostico/', include('apps.diagnostico.urls')),

]

# Registrar vista de auditoría desde autenticación
from apps.autenticacion.views import RegistroAccesoListView
urlpatterns.append(
    path('api/auditoria/accesos/', RegistroAccesoListView.as_view(), name='auditoria-accesos'),
)
