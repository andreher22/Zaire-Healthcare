"""
ZAIRE Healthcare — Admin de Historial Clínico
Configuración mejorada del panel para HistorialClinico y EventoClinico.
"""
from django.contrib import admin
from .models import HistorialClinico, EventoClinico


class EventoClinicoInline(admin.TabularInline):
    """Eventos clínicos inline dentro del historial."""
    model = EventoClinico
    extra = 0
    readonly_fields = ['fecha']
    fields = ['tipo', 'fecha', 'diagnostico', 'descripcion']
    ordering = ['-fecha']


@admin.register(HistorialClinico)
class HistorialClinicoAdmin(admin.ModelAdmin):
    """Admin para historial clínico con eventos inline."""
    list_display = ['paciente', 'fecha_apertura', 'alergias_corto', 'total_eventos']
    search_fields = ['paciente__nombre', 'alergias', 'antecedentes']
    list_filter = ['fecha_apertura']
    date_hierarchy = 'fecha_apertura'
    readonly_fields = ['fecha_apertura']
    inlines = [EventoClinicoInline]

    fieldsets = (
        ('Paciente', {
            'fields': ('paciente', 'fecha_apertura'),
        }),
        ('Información médica', {
            'fields': ('alergias', 'antecedentes', 'notas_adicionales'),
        }),
    )

    def alergias_corto(self, obj):
        """Truncar alergias para la lista."""
        if obj.alergias and len(obj.alergias) > 50:
            return obj.alergias[:50] + '...'
        return obj.alergias or 'Ninguna'
    alergias_corto.short_description = 'Alergias'

    def total_eventos(self, obj):
        """Contar eventos clínicos del historial."""
        return obj.eventos.count()
    total_eventos.short_description = 'Eventos'


@admin.register(EventoClinico)
class EventoClinicoAdmin(admin.ModelAdmin):
    """Admin para eventos clínicos individuales."""
    list_display = ['paciente_nombre', 'tipo', 'fecha', 'diagnostico', 'descripcion_corta']
    list_filter = ['tipo', 'fecha']
    search_fields = ['historial__paciente__nombre', 'diagnostico', 'descripcion']
    ordering = ['-fecha']
    date_hierarchy = 'fecha'
    list_per_page = 30
    readonly_fields = ['fecha']

    fieldsets = (
        ('Evento', {
            'fields': ('historial', 'tipo', 'fecha'),
        }),
        ('Detalle clínico', {
            'fields': ('diagnostico', 'descripcion', 'tratamiento'),
        }),
    )

    def paciente_nombre(self, obj):
        """Obtener nombre del paciente desde el historial."""
        return obj.historial.paciente.nombre
    paciente_nombre.short_description = 'Paciente'

    def descripcion_corta(self, obj):
        """Truncar descripción para la lista."""
        if obj.descripcion and len(obj.descripcion) > 60:
            return obj.descripcion[:60] + '...'
        return obj.descripcion or '—'
    descripcion_corta.short_description = 'Descripción'
