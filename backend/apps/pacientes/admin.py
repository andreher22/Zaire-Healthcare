from django.contrib import admin
from .models import Paciente


@admin.register(Paciente)
class PacienteAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'sexo', 'fecha_nacimiento', 'contacto', 'usuario', 'fecha_registro']
    list_filter = ['sexo', 'fecha_registro']
    search_fields = ['nombre', 'contacto']
    ordering = ['-fecha_registro']
