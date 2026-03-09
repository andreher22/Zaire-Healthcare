"""
ZAIRE Healthcare — Admin de Pacientes
Configuración mejorada del panel de administración para Paciente.
"""
from django.contrib import admin
from .models import Paciente


@admin.register(Paciente)
class PacienteAdmin(admin.ModelAdmin):
    """Admin para gestión de pacientes con fieldsets y filtros avanzados."""
    list_display = ['nombre', 'sexo', 'edad', 'contacto', 'usuario', 'fecha_registro']
    list_filter = ['sexo', 'fecha_registro', 'usuario']
    search_fields = ['nombre', 'contacto', 'direccion']
    ordering = ['-fecha_registro']
    date_hierarchy = 'fecha_registro'
    list_per_page = 30
    readonly_fields = ['fecha_registro', 'edad']

    fieldsets = (
        ('Datos personales', {
            'fields': ('nombre', 'fecha_nacimiento', 'sexo', 'edad'),
        }),
        ('Contacto', {
            'fields': ('contacto', 'direccion'),
        }),
        ('Registro', {
            'fields': ('usuario', 'fecha_registro'),
            'classes': ('collapse',),
        }),
    )

    def edad(self, obj):
        """Mostrar edad calculada del paciente."""
        return f"{obj.edad} años" if obj.edad else '—'
    edad.short_description = 'Edad'
