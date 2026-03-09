from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

app_name = 'autenticacion'

urlpatterns = [
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('registro/', views.RegistroUsuarioView.as_view(), name='registro'),
    path('perfil/', views.PerfilView.as_view(), name='perfil'),
    path('estadisticas/', views.EstadisticasView.as_view(), name='estadisticas'),
]
