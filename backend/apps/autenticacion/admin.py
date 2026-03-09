"""
ZAIRE Healthcare — Admin de Autenticación
Configuración mejorada del panel de administración para Usuario y RegistroAcceso.
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, RegistroAcceso


@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    """Admin personalizado para el modelo Usuario (extiende UserAdmin)."""
    model = Usuario
    list_display = ['correo', 'nombre', 'rol', 'is_active', 'is_staff', 'fecha_creacion']
    list_filter = ['rol', 'is_active', 'is_staff', 'fecha_creacion']
    search_fields = ['correo', 'nombre']
    ordering = ['-fecha_creacion']
    date_hierarchy = 'fecha_creacion'
    list_per_page = 25
    readonly_fields = ['fecha_creacion', 'last_login']

    fieldsets = (
        ('Información de cuenta', {
            'fields': ('correo', 'nombre', 'password'),
        }),
        ('Rol y permisos', {
            'fields': ('rol', 'is_active', 'is_staff', 'is_superuser'),
        }),
        ('Fechas', {
            'fields': ('fecha_creacion', 'last_login'),
            'classes': ('collapse',),
        }),
        ('Permisos avanzados', {
            'fields': ('groups', 'user_permissions'),
            'classes': ('collapse',),
        }),
    )

    add_fieldsets = (
        ('Crear usuario', {
            'classes': ('wide',),
            'fields': ('correo', 'nombre', 'rol', 'password1', 'password2', 'is_active', 'is_staff'),
        }),
    )


@admin.register(RegistroAcceso)
class RegistroAccesoAdmin(admin.ModelAdmin):
    """Admin para RegistroAcceso — auditoría de operaciones."""
    list_display = ['usuario', 'tipo_operacion', 'fecha', 'direccion_ip', 'detalle_corto']
    list_filter = ['tipo_operacion', 'fecha']
    search_fields = ['usuario__nombre', 'usuario__correo', 'detalle']
    ordering = ['-fecha']
    date_hierarchy = 'fecha'
    list_per_page = 50
    readonly_fields = ['usuario', 'tipo_operacion', 'fecha', 'direccion_ip', 'detalle']

    fieldsets = (
        ('Información del acceso', {
            'fields': ('usuario', 'tipo_operacion', 'fecha'),
        }),
        ('Detalles', {
            'fields': ('direccion_ip', 'detalle'),
        }),
    )

    def detalle_corto(self, obj):
        """Truncar el campo detalle para mostrar en lista."""
        if obj.detalle and len(obj.detalle) > 60:
            return obj.detalle[:60] + '...'
        return obj.detalle or '—'
    detalle_corto.short_description = 'Detalle'

    def has_add_permission(self, request):
        """Los registros de acceso solo se crean automáticamente."""
        return False

    def has_change_permission(self, request, obj=None):
        """No se pueden editar los registros de auditoría."""
        return False
