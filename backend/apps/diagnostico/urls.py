from django.urls import path
from . import views

app_name = 'diagnostico'

urlpatterns = [
    path('predecir/', views.DiagnosticarView.as_view(), name='predecir'),
    path('sintomas/', views.SintomasDisponiblesView.as_view(), name='sintomas'),
    path('historial/', views.HistorialDiagnosticosView.as_view(), name='historial'),
    path('<int:pk>/', views.DetalleResultadoView.as_view(), name='detalle'),
    path('<int:pk>/estado/', views.ActualizarEstadoView.as_view(), name='actualizar-estado'),
]
