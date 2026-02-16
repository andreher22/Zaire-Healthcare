from django.contrib import admin
from .models import ResultadoIA


@admin.register(ResultadoIA)
class ResultadoIAAdmin(admin.ModelAdmin):
    list_display = ['paciente', 'diagnostico_predicho', 'confianza', 'estado', 'fecha']
    list_filter = ['estado', 'fecha', 'diagnostico_predicho']
    search_fields = ['paciente__nombre', 'diagnostico_predicho']
    ordering = ['-fecha']
