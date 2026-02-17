"""
ZAIRE Healthcare - Módulo de Autenticación
Modelo de Usuario personalizado con roles y autenticación JWT.
"""
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class UsuarioManager(BaseUserManager):
    """Manager personalizado para el modelo Usuario."""

    def create_user(self, correo, nombre, password=None, **extra_fields):
        """Crear y retornar un usuario regular."""
        if not correo:
            raise ValueError('El correo electrónico es obligatorio')
        correo = self.normalize_email(correo)
        usuario = self.model(correo=correo, nombre=nombre, **extra_fields)
        usuario.set_password(password)
        usuario.save(using=self._db)
        return usuario

    def create_superuser(self, correo, nombre, password=None, **extra_fields):
        """Crear y retornar un superusuario."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('rol', 'admin')

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superusuario debe tener is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superusuario debe tener is_superuser=True.')

        return self.create_user(correo, nombre, password, **extra_fields)


class Usuario(AbstractBaseUser, PermissionsMixin):
    """
    Modelo de Usuario personalizado para ZAIRE Healthcare.
    Usa correo electrónico como identificador único en lugar de username.
    """

    class Roles(models.TextChoices):
        ADMIN = 'admin', 'Administrador'
        MEDICO = 'medico', 'Médico'
        ENFERMERO = 'enfermero', 'Enfermero/a'

    correo = models.EmailField(
        'Correo electrónico',
        unique=True,
        max_length=255
    )
    nombre = models.CharField(
        'Nombre completo',
        max_length=255
    )
    rol = models.CharField(
        'Rol',
        max_length=20,
        choices=Roles.choices,
        default=Roles.MEDICO
    )
    is_active = models.BooleanField(
        'Activo',
        default=True
    )
    is_staff = models.BooleanField(
        'Staff',
        default=False
    )
    fecha_creacion = models.DateTimeField(
        'Fecha de creación',
        auto_now_add=True
    )
    fecha_actualizacion = models.DateTimeField(
        'Última actualización',
        auto_now=True
    )

    objects = UsuarioManager()

    USERNAME_FIELD = 'correo'
    REQUIRED_FIELDS = ['nombre']

    class Meta:
        db_table = 'usuario'
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        ordering = ['-fecha_creacion']

    def __str__(self):
        return f'{self.nombre} ({self.correo})'


class RegistroAcceso(models.Model):
    """
    Modelo para registrar los accesos al sistema (RF-12).
    """

    class TipoOperacion(models.TextChoices):
        LOGIN = 'login', 'Inicio de sesión'
        LOGOUT = 'logout', 'Cierre de sesión'
        CONSULTA = 'consulta', 'Consulta de datos'
        REGISTRO = 'registro', 'Registro de datos'
        DIAGNOSTICO = 'diagnostico', 'Diagnóstico IA'

    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='registros_acceso',
        verbose_name='Usuario'
    )
    tipo_operacion = models.CharField(
        'Tipo de operación',
        max_length=20,
        choices=TipoOperacion.choices
    )
    fecha = models.DateTimeField(
        'Fecha y hora',
        auto_now_add=True
    )
    direccion_ip = models.GenericIPAddressField(
        'Dirección IP',
        null=True,
        blank=True
    )
    detalle = models.TextField(
        'Detalle',
        blank=True,
        default=''
    )

    class Meta:
        db_table = 'registro_acceso'
        verbose_name = 'Registro de acceso'
        verbose_name_plural = 'Registros de acceso'
        ordering = ['-fecha']

    def __str__(self):
        return f'{self.usuario.nombre} - {self.tipo_operacion} - {self.fecha}'
