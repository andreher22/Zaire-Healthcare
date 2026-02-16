from django.contrib import admin
from .models import HistorialClinico, EventoClinico


@admin.register(HistorialClinico)
class HistorialClinicoAdmin(admin.ModelAdmin):
    list_display = ['paciente', 'fecha_apertura', 'alergias']
    search_fields = ['paciente__nombre']


@admin.register(EventoClinico)
class EventoClinicoAdmin(admin.ModelAdmin):
    list_display = ['historial', 'tipo', 'fecha', 'diagnostico']
    list_filter = ['tipo', 'fecha']
    search_fields = ['historial__paciente__nombre', 'descripcion']
