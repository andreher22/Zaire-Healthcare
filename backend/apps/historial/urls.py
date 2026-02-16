from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'historial'

router = DefaultRouter()
router.register(r'', views.HistorialClinicoViewSet, basename='historial')

urlpatterns = [
    path('', include(router.urls)),
    path(
        '<int:historial_pk>/eventos/',
        views.EventoClinicoViewSet.as_view({'get': 'list', 'post': 'create'}),
        name='eventos-list'
    ),
    path(
        '<int:historial_pk>/eventos/<int:pk>/',
        views.EventoClinicoViewSet.as_view({
            'get': 'retrieve', 'put': 'update',
            'patch': 'partial_update', 'delete': 'destroy'
        }),
        name='eventos-detail'
    ),
]
