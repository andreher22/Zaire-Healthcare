"""
ZAIRE Healthcare — Admin de Diagnóstico IA
Configuración mejorada del panel para ResultadoIA.
"""
from django.contrib import admin
from .models import ResultadoIA


@admin.register(ResultadoIA)
class ResultadoIAAdmin(admin.ModelAdmin):
    """Admin para resultados de diagnóstico IA con detalles ampliados."""
    list_display = [
        'paciente', 'diagnostico_predicho', 'confianza_display',
        'estado', 'fecha', 'notas_cortas'
    ]
    list_filter = ['estado', 'fecha', 'diagnostico_predicho']
    search_fields = ['paciente__nombre', 'diagnostico_predicho', 'notas_medico']
    ordering = ['-fecha']
    date_hierarchy = 'fecha'
    list_per_page = 30
    readonly_fields = [
        'paciente', 'sintomas_ingresados', 'diagnostico_predicho',
        'confianza', 'top_predicciones', 'fecha'
    ]

    fieldsets = (
        ('Resultado de la predicción', {
            'fields': ('paciente', 'diagnostico_predicho', 'confianza', 'fecha'),
        }),
        ('Datos de entrada', {
            'fields': ('sintomas_ingresados', 'top_predicciones'),
            'classes': ('collapse',),
        }),
        ('Revisión médica', {
            'fields': ('estado', 'notas_medico'),
            'description': 'El médico puede aceptar o rechazar el diagnóstico de la IA.',
        }),
    )

    def confianza_display(self, obj):
        """Mostrar confianza con formato de porcentaje y color."""
        if obj.confianza >= 80:
            return f"🟢 {obj.confianza}%"
        elif obj.confianza >= 50:
            return f"🟡 {obj.confianza}%"
        return f"🔴 {obj.confianza}%"
    confianza_display.short_description = 'Confianza'

    def notas_cortas(self, obj):
        """Truncar notas del médico para la lista."""
        if obj.notas_medico and len(obj.notas_medico) > 50:
            return obj.notas_medico[:50] + '...'
        return obj.notas_medico or '—'
    notas_cortas.short_description = 'Notas'
