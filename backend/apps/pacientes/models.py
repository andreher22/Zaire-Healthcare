"""
ZAIRE Healthcare - Módulo de Pacientes
Modelo de Paciente vinculado al Usuario responsable.
"""
from django.db import models
from django.conf import settings


class Paciente(models.Model):
    """
    Modelo de Paciente según el diagrama E-R.
    Vinculado al usuario (médico) que lo registra.
    """

    class Sexo(models.TextChoices):
        MASCULINO = 'M', 'Masculino'
        FEMENINO = 'F', 'Femenino'
        OTRO = 'O', 'Otro'

    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='pacientes',
        verbose_name='Médico responsable'
    )
    nombre = models.CharField(
        'Nombre completo',
        max_length=255
    )
    fecha_nacimiento = models.DateField(
        'Fecha de nacimiento'
    )
    sexo = models.CharField(
        'Sexo',
        max_length=1,
        choices=Sexo.choices
    )
    contacto = models.CharField(
        'Contacto (teléfono o correo)',
        max_length=255,
        blank=True,
        default=''
    )
    direccion = models.TextField(
        'Dirección',
        blank=True,
        default=''
    )
    fecha_registro = models.DateTimeField(
        'Fecha de registro',
        auto_now_add=True
    )
    fecha_actualizacion = models.DateTimeField(
        'Última actualización',
        auto_now=True
    )

    class Meta:
        db_table = 'paciente'
        verbose_name = 'Paciente'
        verbose_name_plural = 'Pacientes'
        ordering = ['-fecha_registro']

    def __str__(self):
        return f'{self.nombre} (ID: {self.pk})'

    @property
    def edad(self):
        """Calcular la edad del paciente."""
        from datetime import date
        hoy = date.today()
        nacimiento = self.fecha_nacimiento
        return hoy.year - nacimiento.year - (
            (hoy.month, hoy.day) < (nacimiento.month, nacimiento.day)
        )
