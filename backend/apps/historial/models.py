"""
ZAIRE Healthcare - Módulo de Historial Clínico
Modelos de Historial Clínico y Evento Clínico según diagrama E-R.
"""
from django.db import models
from apps.pacientes.models import Paciente


class HistorialClinico(models.Model):
    """
    Historial clínico de un paciente (RF-04, RF-05, RF-06).
    Cada paciente tiene UN solo historial.
    """

    paciente = models.OneToOneField(
        Paciente,
        on_delete=models.CASCADE,
        related_name='historial',
        verbose_name='Paciente'
    )
    fecha_apertura = models.DateTimeField(
        'Fecha de apertura',
        auto_now_add=True
    )
    observaciones_generales = models.TextField(
        'Observaciones generales',
        blank=True,
        default=''
    )
    alergias = models.TextField(
        'Alergias conocidas',
        blank=True,
        default=''
    )
    antecedentes = models.TextField(
        'Antecedentes médicos',
        blank=True,
        default=''
    )

    class Meta:
        db_table = 'historial_clinico'
        verbose_name = 'Historial clínico'
        verbose_name_plural = 'Historiales clínicos'

    def __str__(self):
        return f'Historial de {self.paciente.nombre}'


class EventoClinico(models.Model):
    """
    Evento o consulta dentro del historial clínico.
    Cada evento representa una visita o acontecimiento médico.
    """

    class TipoEvento(models.TextChoices):
        CONSULTA = 'consulta', 'Consulta'
        DIAGNOSTICO = 'diagnostico', 'Diagnóstico'
        TRATAMIENTO = 'tratamiento', 'Tratamiento'
        SEGUIMIENTO = 'seguimiento', 'Seguimiento'
        EMERGENCIA = 'emergencia', 'Emergencia'

    historial = models.ForeignKey(
        HistorialClinico,
        on_delete=models.CASCADE,
        related_name='eventos',
        verbose_name='Historial clínico'
    )
    tipo = models.CharField(
        'Tipo de evento',
        max_length=20,
        choices=TipoEvento.choices,
        default=TipoEvento.CONSULTA
    )
    descripcion = models.TextField(
        'Descripción del evento'
    )
    sintomas = models.TextField(
        'Síntomas reportados',
        blank=True,
        default=''
    )
    diagnostico = models.TextField(
        'Diagnóstico',
        blank=True,
        default=''
    )
    tratamiento = models.TextField(
        'Tratamiento indicado',
        blank=True,
        default=''
    )
    notas = models.TextField(
        'Notas adicionales',
        blank=True,
        default=''
    )
    fecha = models.DateTimeField(
        'Fecha del evento',
        auto_now_add=True
    )

    class Meta:
        db_table = 'evento_clinico'
        verbose_name = 'Evento clínico'
        verbose_name_plural = 'Eventos clínicos'
        ordering = ['-fecha']

    def __str__(self):
        return f'{self.tipo} - {self.historial.paciente.nombre} ({self.fecha.strftime("%d/%m/%Y")})'
