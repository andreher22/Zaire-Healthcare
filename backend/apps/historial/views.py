import io
from django.http import HttpResponse
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

from .models import HistorialClinico, EventoClinico
from .serializers import (
    HistorialClinicoSerializer,
    EventoClinicoSerializer,
)
from apps.pacientes.models import Paciente


class HistorialClinicoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para historial clínico (RF-04, RF-05, RF-06).
    
    GET    /api/historial/                     → Listar historiales
    POST   /api/historial/                     → Crear historial
    GET    /api/historial/<id>/                 → Detalle con eventos
    GET    /api/historial/<id>/pdf/             → Descargar PDF (RF-07)
    """
    serializer_class = HistorialClinicoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return HistorialClinico.objects.filter(
            paciente__usuario=self.request.user
        ).select_related('paciente').prefetch_related('eventos')

    @action(detail=True, methods=['get'], url_path='pdf')
    def generar_pdf(self, request, pk=None):
        """
        Generar PDF del historial clínico (RF-07).
        GET /api/historial/<id>/pdf/
        """
        historial = self.get_object()
        paciente = historial.paciente

        # Crear buffer de memoria para el PDF
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        elementos = []
        estilos = getSampleStyleSheet()

        # Estilos personalizados con colores ZAIRE
        estilo_titulo = ParagraphStyle(
            'TituloZaire',
            parent=estilos['Heading1'],
            textColor=colors.HexColor('#283618'),
            spaceAfter=12,
        )
        estilo_subtitulo = ParagraphStyle(
            'SubtituloZaire',
            parent=estilos['Heading2'],
            textColor=colors.HexColor('#606C38'),
            spaceAfter=8,
        )

        # Título
        elementos.append(Paragraph('🏥 ZAIRE Healthcare', estilo_titulo))
        elementos.append(Paragraph('Historial Clínico Digital', estilo_subtitulo))
        elementos.append(Spacer(1, 0.3 * inch))

        # Datos del paciente
        datos_paciente = [
            ['Campo', 'Valor'],
            ['Nombre', paciente.nombre],
            ['Fecha de nacimiento', str(paciente.fecha_nacimiento)],
            ['Sexo', paciente.get_sexo_display()],
            ['Edad', f'{paciente.edad} años'],
            ['Contacto', paciente.contacto or 'No especificado'],
        ]

        tabla_paciente = Table(datos_paciente, colWidths=[2 * inch, 4 * inch])
        tabla_paciente.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#606C38')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#FEFAE0')),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#DDA15E')),
        ]))
        elementos.append(Paragraph('Datos del Paciente', estilo_subtitulo))
        elementos.append(tabla_paciente)
        elementos.append(Spacer(1, 0.3 * inch))

        # Antecedentes y alergias
        if historial.alergias:
            elementos.append(Paragraph('Alergias:', estilo_subtitulo))
            elementos.append(Paragraph(historial.alergias, estilos['Normal']))
            elementos.append(Spacer(1, 0.15 * inch))

        if historial.antecedentes:
            elementos.append(Paragraph('Antecedentes:', estilo_subtitulo))
            elementos.append(Paragraph(historial.antecedentes, estilos['Normal']))
            elementos.append(Spacer(1, 0.15 * inch))

        # Eventos clínicos
        eventos = historial.eventos.all()
        if eventos:
            elementos.append(Paragraph('Eventos Clínicos', estilo_subtitulo))
            for evento in eventos:
                datos_evento = [
                    ['Tipo', evento.get_tipo_display()],
                    ['Fecha', evento.fecha.strftime('%d/%m/%Y %H:%M')],
                    ['Descripción', evento.descripcion],
                ]
                if evento.sintomas:
                    datos_evento.append(['Síntomas', evento.sintomas])
                if evento.diagnostico:
                    datos_evento.append(['Diagnóstico', evento.diagnostico])
                if evento.tratamiento:
                    datos_evento.append(['Tratamiento', evento.tratamiento])

                tabla_evento = Table(datos_evento, colWidths=[1.5 * inch, 4.5 * inch])
                tabla_evento.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#DDA15E')),
                    ('TEXTCOLOR', (0, 0), (0, -1), colors.white),
                    ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, -1), 9),
                    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#BC6C25')),
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ]))
                elementos.append(tabla_evento)
                elementos.append(Spacer(1, 0.2 * inch))

        # Generar PDF
        doc.build(elementos)
        buffer.seek(0)

        nombre_archivo = f'historial_{paciente.nombre.replace(" ", "_")}.pdf'
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{nombre_archivo}"'
        return response


class EventoClinicoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para eventos clínicos.
    
    GET/POST /api/historial/<historial_id>/eventos/
    """
    serializer_class = EventoClinicoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        historial_id = self.kwargs.get('historial_pk')
        return EventoClinico.objects.filter(
            historial_id=historial_id,
            historial__paciente__usuario=self.request.user
        )

    def perform_create(self, serializer):
        historial_id = self.kwargs.get('historial_pk')
        historial = HistorialClinico.objects.get(
            pk=historial_id,
            paciente__usuario=self.request.user
        )
        serializer.save(historial=historial)
