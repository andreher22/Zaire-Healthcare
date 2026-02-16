"""
ZAIRE Healthcare - Módulo de Diagnóstico IA
Modelo para almacenar resultados de inferencia del modelo de IA.
"""
from django.db import models
from apps.pacientes.models import Paciente


class ResultadoIA(models.Model):
    """
    Resultado del diagnóstico asistido por IA (RF-08, RF-09).
    Almacena la predicción del modelo, su confianza y los síntomas ingresados.
    """

    class EstadoResultado(models.TextChoices):
        PENDIENTE = 'pendiente', 'Pendiente de revisión'
        ACEPTADO = 'aceptado', 'Aceptado por el médico'
        RECHAZADO = 'rechazado', 'Rechazado por el médico'

    paciente = models.ForeignKey(
        Paciente,
        on_delete=models.CASCADE,
        related_name='resultados_ia',
        verbose_name='Paciente'
    )
    sintomas_ingresados = models.JSONField(
        'Síntomas ingresados',
        help_text='Lista de síntomas seleccionados por el médico'
    )
    diagnostico_predicho = models.CharField(
        'Diagnóstico predicho',
        max_length=255
    )
    confianza = models.FloatField(
        'Nivel de confianza (%)',
        help_text='Porcentaje de confianza del modelo (0-100)'
    )
    top_predicciones = models.JSONField(
        'Top predicciones',
        help_text='Las 3 predicciones más probables con sus porcentajes',
        default=list
    )
    estado = models.CharField(
        'Estado',
        max_length=20,
        choices=EstadoResultado.choices,
        default=EstadoResultado.PENDIENTE
    )
    notas_medico = models.TextField(
        'Notas del médico',
        blank=True,
        default='',
        help_text='Observaciones del médico sobre la predicción'
    )
    fecha = models.DateTimeField(
        'Fecha del diagnóstico',
        auto_now_add=True
    )

    class Meta:
        db_table = 'resultado_ia'
        verbose_name = 'Resultado IA'
        verbose_name_plural = 'Resultados IA'
        ordering = ['-fecha']

    def __str__(self):
        return f'{self.diagnostico_predicho} ({self.confianza:.1f}%) - {self.paciente.nombre}'
