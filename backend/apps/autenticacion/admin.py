from django.contrib import admin
from .models import Usuario, RegistroAcceso


@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ['correo', 'nombre', 'rol', 'is_active', 'fecha_creacion']
    list_filter = ['rol', 'is_active']
    search_fields = ['correo', 'nombre']
    ordering = ['-fecha_creacion']


@admin.register(RegistroAcceso)
class RegistroAccesoAdmin(admin.ModelAdmin):
    list_display = ['usuario', 'tipo_operacion', 'fecha', 'direccion_ip']
    list_filter = ['tipo_operacion', 'fecha']
    search_fields = ['usuario__nombre', 'usuario__correo']
    ordering = ['-fecha']
