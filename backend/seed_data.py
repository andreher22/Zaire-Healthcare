"""
ZAIRE Healthcare - Script de datos de demostración.
Puebla la base de datos con pacientes, historiales, eventos y resultados IA
para que el sistema se vea funcional desde el primer momento.

Uso: python manage.py shell < seed_data.py
  o: python manage.py runscript seed_data  (si instalas django-extensions)
"""
import os
import sys
import django
from datetime import date, timedelta
import random

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)
django.setup()

from apps.autenticacion.models import Usuario, RegistroAcceso
from apps.pacientes.models import Paciente
from apps.historial.models import HistorialClinico, EventoClinico
from apps.diagnostico.models import ResultadoIA


def run():
    print("\n🏥 ZAIRE Healthcare — Generando datos de demostración...\n")

    # =========================================================================
    # 1. USUARIOS
    # =========================================================================
    print("👤 Creando usuarios...")

    admin, created = Usuario.objects.get_or_create(
        correo='admin@zaire.com',
        defaults={
            'nombre': 'Administrador General',
            'rol': 'admin',
            'is_staff': True,
            'is_superuser': True,
        }
    )
    if created:
        admin.set_password('Admin2025!')
        admin.save()
        print(f"   ✅ Admin: admin@zaire.com / Admin2025!")

    medico1, created = Usuario.objects.get_or_create(
        correo='medico@zaire.com',
        defaults={
            'nombre': 'Dr. Carlos Ramírez López',
            'rol': 'medico',
        }
    )
    if created:
        medico1.set_password('password123')
        medico1.save()
        print(f"   ✅ Médico 1: medico@zaire.com / password123")

    medico2, created = Usuario.objects.get_or_create(
        correo='dra.martinez@zaire.com',
        defaults={
            'nombre': 'Dra. María Fernanda Martínez',
            'rol': 'medico',
        }
    )
    if created:
        medico2.set_password('password123')
        medico2.save()
        print(f"   ✅ Médico 2: dra.martinez@zaire.com / password123")

    enfermero, created = Usuario.objects.get_or_create(
        correo='enfermero@zaire.com',
        defaults={
            'nombre': 'Enf. Roberto Sánchez',
            'rol': 'enfermero',
        }
    )
    if created:
        enfermero.set_password('password123')
        enfermero.save()
        print(f"   ✅ Enfermero: enfermero@zaire.com / password123")

    # =========================================================================
    # 2. PACIENTES (para medico1)
    # =========================================================================
    print("\n👥 Creando pacientes...")

    pacientes_data = [
        {
            'nombre': 'Ana María García Hernández',
            'fecha_nacimiento': date(1985, 3, 15),
            'sexo': 'F',
            'contacto': '555-0101',
            'direccion': 'Av. Insurgentes Sur 1234, CDMX',
        },
        {
            'nombre': 'José Luis Pérez Rodríguez',
            'fecha_nacimiento': date(1978, 7, 22),
            'sexo': 'M',
            'contacto': '555-0102',
            'direccion': 'Calle Reforma 567, Guadalajara',
        },
        {
            'nombre': 'María del Carmen López Torres',
            'fecha_nacimiento': date(1992, 11, 8),
            'sexo': 'F',
            'contacto': '555-0103',
            'direccion': 'Blvd. Manuel Ávila Camacho 890, Monterrey',
        },
        {
            'nombre': 'Roberto Alejandro Sánchez Díaz',
            'fecha_nacimiento': date(1965, 1, 30),
            'sexo': 'M',
            'contacto': '555-0104',
            'direccion': 'Av. Universidad 321, Puebla',
        },
        {
            'nombre': 'Guadalupe Fernanda Martínez Ruiz',
            'fecha_nacimiento': date(2000, 5, 18),
            'sexo': 'F',
            'contacto': '555-0105',
            'direccion': 'Calle Morelos 456, Querétaro',
        },
        {
            'nombre': 'Miguel Ángel Torres Castillo',
            'fecha_nacimiento': date(1988, 9, 12),
            'sexo': 'M',
            'contacto': '555-0106',
            'direccion': 'Av. Juárez 789, León',
        },
        {
            'nombre': 'Laura Patricia Hernández Flores',
            'fecha_nacimiento': date(1972, 12, 25),
            'sexo': 'F',
            'contacto': '555-0107',
            'direccion': 'Calle 5 de Mayo 234, Oaxaca',
        },
        {
            'nombre': 'Fernando David Ramírez Salazar',
            'fecha_nacimiento': date(1995, 4, 7),
            'sexo': 'M',
            'contacto': '555-0108',
            'direccion': 'Av. Constituyentes 567, Mérida',
        },
    ]

    pacientes = []
    for data in pacientes_data:
        paciente, created = Paciente.objects.get_or_create(
            nombre=data['nombre'],
            usuario=medico1,
            defaults=data,
        )
        pacientes.append(paciente)
        if created:
            print(f"   ✅ {data['nombre']}")

    # =========================================================================
    # 3. HISTORIALES CLÍNICOS
    # =========================================================================
    print("\n📋 Creando historiales clínicos...")

    historiales_info = [
        {'alergias': 'Penicilina, polen', 'antecedentes': 'Hipertensión arterial diagnosticada en 2019'},
        {'alergias': 'Ninguna conocida', 'antecedentes': 'Diabetes tipo 2 desde 2015, cirugía de rodilla 2020'},
        {'alergias': 'Sulfonamidas', 'antecedentes': 'Sin antecedentes relevantes'},
        {'alergias': 'Aspirina, mariscos', 'antecedentes': 'EPOC, tabaquismo crónico 30 años'},
        {'alergias': 'Ninguna conocida', 'antecedentes': 'Asma leve desde la infancia'},
        {'alergias': 'Lactosa', 'antecedentes': 'Fractura de brazo derecho 2017'},
        {'alergias': 'Polvo, ácaros', 'antecedentes': 'Artritis reumatoide, hipotiroidismo'},
        {'alergias': 'Ninguna conocida', 'antecedentes': 'Gastritis crónica'},
    ]

    historiales = []
    for i, paciente in enumerate(pacientes):
        historial, created = HistorialClinico.objects.get_or_create(
            paciente=paciente,
            defaults={
                'observaciones_generales': f'Historial clínico activo del paciente {paciente.nombre}.',
                'alergias': historiales_info[i]['alergias'],
                'antecedentes': historiales_info[i]['antecedentes'],
            }
        )
        historiales.append(historial)
        if created:
            print(f"   ✅ Historial de {paciente.nombre}")

    # =========================================================================
    # 4. EVENTOS CLÍNICOS
    # =========================================================================
    print("\n📝 Creando eventos clínicos...")

    eventos_data = [
        # Paciente 0 - Ana María
        {'historial_idx': 0, 'tipo': 'consulta', 'descripcion': 'Consulta de control rutinario',
         'sintomas': 'Dolor de cabeza frecuente, fatiga', 'diagnostico': 'Cefalea tensional',
         'tratamiento': 'Paracetamol 500mg c/8h, reducir estrés'},
        {'historial_idx': 0, 'tipo': 'seguimiento', 'descripcion': 'Seguimiento de cefalea',
         'sintomas': 'Mejoría del dolor', 'diagnostico': 'Cefalea tensional en remisión',
         'tratamiento': 'Continuar tratamiento, yoga recomendado'},
        # Paciente 1 - José Luis
        {'historial_idx': 1, 'tipo': 'consulta', 'descripcion': 'Control de diabetes',
         'sintomas': 'Polidipsia, visión borrosa, fatiga', 'diagnostico': 'Diabetes Tipo 2 descompensada',
         'tratamiento': 'Metformina 850mg c/12h, dieta baja en azúcar'},
        {'historial_idx': 1, 'tipo': 'diagnostico', 'descripcion': 'Análisis de laboratorio',
         'sintomas': 'Glucosa 280 mg/dL', 'diagnostico': 'Hiperglucemia',
         'tratamiento': 'Insulina NPH 10 UI sc, cita en 2 semanas'},
        # Paciente 2 - María del Carmen
        {'historial_idx': 2, 'tipo': 'consulta', 'descripcion': 'Dolor abdominal agudo',
         'sintomas': 'Dolor abdominal, náuseas, fiebre leve', 'diagnostico': 'Probable gastroenteritis',
         'tratamiento': 'Hidratación oral, ciprofloxacino 500mg c/12h por 5 días'},
        # Paciente 3 - Roberto
        {'historial_idx': 3, 'tipo': 'emergencia', 'descripcion': 'Dificultad respiratoria severa',
         'sintomas': 'Disnea, tos productiva, sibilancias', 'diagnostico': 'Exacerbación de EPOC',
         'tratamiento': 'Salbutamol nebulizado, prednisona 40mg, oxigenoterapia'},
        {'historial_idx': 3, 'tipo': 'seguimiento', 'descripcion': 'Control post-exacerbación',
         'sintomas': 'Mejoría progresiva de disnea', 'diagnostico': 'EPOC estable',
         'tratamiento': 'Inhalador combinado, ejercicios respiratorios'},
        # Paciente 4 - Guadalupe
        {'historial_idx': 4, 'tipo': 'consulta', 'descripcion': 'Revisión general',
         'sintomas': 'Congestión nasal, estornudos, dolor de garganta',
         'diagnostico': 'Resfriado común', 'tratamiento': 'Reposo, líquidos abundantes, antigripal'},
        # Paciente 5 - Miguel
        {'historial_idx': 5, 'tipo': 'consulta', 'descripcion': 'Dolor de espalda',
         'sintomas': 'Lumbalgia, rigidez matutina', 'diagnostico': 'Lumbalgia mecánica',
         'tratamiento': 'Naproxeno 500mg c/12h, terapia física'},
        # Paciente 6 - Laura
        {'historial_idx': 6, 'tipo': 'diagnostico', 'descripcion': 'Control de artritis',
         'sintomas': 'Dolor articular, inflamación de manos, rigidez',
         'diagnostico': 'Artritis reumatoide activa', 'tratamiento': 'Metotrexato 15mg semanal, ácido fólico'},
        {'historial_idx': 6, 'tipo': 'tratamiento', 'descripcion': 'Ajuste de medicación',
         'sintomas': 'Persistencia de inflamación', 'diagnostico': 'Artritis reumatoide con respuesta parcial',
         'tratamiento': 'Agregar Leflunomida 20mg diario'},
        # Paciente 7 - Fernando
        {'historial_idx': 7, 'tipo': 'consulta', 'descripcion': 'Malestar gástrico',
         'sintomas': 'Ardor epigástrico, acidez, distensión',
         'diagnostico': 'Gastritis crónica', 'tratamiento': 'Omeprazol 20mg en ayunas, dieta blanda'},
    ]

    for i, data in enumerate(eventos_data):
        historial = historiales[data['historial_idx']]
        evento, created = EventoClinico.objects.get_or_create(
            historial=historial,
            descripcion=data['descripcion'],
            defaults={
                'tipo': data['tipo'],
                'sintomas': data['sintomas'],
                'diagnostico': data['diagnostico'],
                'tratamiento': data['tratamiento'],
                'notas': '',
            }
        )
        if created:
            print(f"   ✅ Evento: {data['descripcion'][:50]}...")

    # =========================================================================
    # 5. RESULTADOS IA
    # =========================================================================
    print("\n🤖 Creando resultados de IA de ejemplo...")

    resultados_ia_data = [
        {
            'paciente_idx': 0,
            'sintomas_ingresados': ['headache', 'fatigue', 'nausea'],
            'diagnostico_predicho': 'Migraine',
            'confianza': 78.5,
            'top_predicciones': [
                {'diagnostico': 'Migraine', 'confianza': 78.5},
                {'diagnostico': 'Hypertension', 'confianza': 12.3},
                {'diagnostico': 'Common Cold', 'confianza': 5.1},
            ],
            'estado': 'aceptado',
            'notas_medico': 'Coincide con síntomas reportados por la paciente.',
        },
        {
            'paciente_idx': 1,
            'sintomas_ingresados': ['excessive_hunger', 'weight_loss', 'fatigue', 'blurred_and_distorted_vision'],
            'diagnostico_predicho': 'Diabetes',
            'confianza': 92.1,
            'top_predicciones': [
                {'diagnostico': 'Diabetes', 'confianza': 92.1},
                {'diagnostico': 'Hypoglycemia', 'confianza': 4.5},
                {'diagnostico': 'Hyperthyroidism', 'confianza': 1.8},
            ],
            'estado': 'aceptado',
            'notas_medico': 'Confirmado con laboratorio. Glucosa 280 mg/dL.',
        },
        {
            'paciente_idx': 3,
            'sintomas_ingresados': ['breathlessness', 'cough', 'phlegm', 'chest_pain'],
            'diagnostico_predicho': 'Bronchial Asthma',
            'confianza': 65.3,
            'top_predicciones': [
                {'diagnostico': 'Bronchial Asthma', 'confianza': 65.3},
                {'diagnostico': 'Pneumonia', 'confianza': 22.1},
                {'diagnostico': 'Tuberculosis', 'confianza': 8.4},
            ],
            'estado': 'rechazado',
            'notas_medico': 'El diagnóstico correcto es EPOC, no asma. El paciente es fumador crónico.',
        },
        {
            'paciente_idx': 4,
            'sintomas_ingresados': ['continuous_sneezing', 'runny_nose', 'cough', 'throat_irritation'],
            'diagnostico_predicho': 'Common Cold',
            'confianza': 88.7,
            'top_predicciones': [
                {'diagnostico': 'Common Cold', 'confianza': 88.7},
                {'diagnostico': 'Allergy', 'confianza': 7.2},
                {'diagnostico': 'Bronchial Asthma', 'confianza': 2.1},
            ],
            'estado': 'aceptado',
            'notas_medico': '',
        },
        {
            'paciente_idx': 6,
            'sintomas_ingresados': ['joint_pain', 'swelling_joints', 'movement_stiffness', 'muscle_weakness'],
            'diagnostico_predicho': 'Arthritis',
            'confianza': 91.4,
            'top_predicciones': [
                {'diagnostico': 'Arthritis', 'confianza': 91.4},
                {'diagnostico': 'Osteoarthristis', 'confianza': 5.6},
                {'diagnostico': 'Cervical spondylosis', 'confianza': 1.9},
            ],
            'estado': 'aceptado',
            'notas_medico': 'Corresponde con diagnóstico previo de artritis reumatoide.',
        },
        {
            'paciente_idx': 7,
            'sintomas_ingresados': ['stomach_pain', 'acidity', 'indigestion', 'nausea'],
            'diagnostico_predicho': 'GERD',
            'confianza': 73.8,
            'top_predicciones': [
                {'diagnostico': 'GERD', 'confianza': 73.8},
                {'diagnostico': 'Peptic ulcer diseae', 'confianza': 18.2},
                {'diagnostico': 'Gastroenteritis', 'confianza': 5.3},
            ],
            'estado': 'pendiente',
            'notas_medico': '',
        },
    ]

    for data in resultados_ia_data:
        paciente = pacientes[data['paciente_idx']]
        resultado, created = ResultadoIA.objects.get_or_create(
            paciente=paciente,
            diagnostico_predicho=data['diagnostico_predicho'],
            defaults={
                'sintomas_ingresados': data['sintomas_ingresados'],
                'confianza': data['confianza'],
                'top_predicciones': data['top_predicciones'],
                'estado': data['estado'],
                'notas_medico': data['notas_medico'],
            }
        )
        if created:
            print(f"   ✅ IA: {data['diagnostico_predicho']} para {paciente.nombre}")

    # =========================================================================
    # 6. REGISTROS DE ACCESO
    # =========================================================================
    print("\n🔒 Creando registros de acceso de ejemplo...")

    accesos = [
        {'usuario': medico1, 'tipo': 'login', 'detalle': 'Inicio de sesión exitoso'},
        {'usuario': medico1, 'tipo': 'consulta', 'detalle': 'Consulta de pacientes'},
        {'usuario': medico1, 'tipo': 'diagnostico', 'detalle': 'Diagnóstico IA para Ana María García'},
        {'usuario': medico1, 'tipo': 'registro', 'detalle': 'Registro de evento clínico'},
        {'usuario': admin, 'tipo': 'login', 'detalle': 'Inicio de sesión del administrador'},
    ]

    for acc in accesos:
        RegistroAcceso.objects.create(
            usuario=acc['usuario'],
            tipo_operacion=acc['tipo'],
            direccion_ip='127.0.0.1',
            detalle=acc['detalle'],
        )

    print(f"   ✅ {len(accesos)} registros de acceso creados")

    # =========================================================================
    # RESUMEN
    # =========================================================================
    print("\n" + "=" * 60)
    print("✅ DATOS DE DEMOSTRACIÓN CREADOS EXITOSAMENTE")
    print("=" * 60)
    print(f"   👤 Usuarios: {Usuario.objects.count()}")
    print(f"   👥 Pacientes: {Paciente.objects.count()}")
    print(f"   📋 Historiales: {HistorialClinico.objects.count()}")
    print(f"   📝 Eventos: {EventoClinico.objects.count()}")
    print(f"   🤖 Resultados IA: {ResultadoIA.objects.count()}")
    print(f"   🔒 Accesos: {RegistroAcceso.objects.count()}")
    print()
    print("🔑 Credenciales de acceso:")
    print("   Admin:     admin@zaire.com / Admin2025!")
    print("   Médico 1:  medico@zaire.com / password123")
    print("   Médico 2:  dra.martinez@zaire.com / password123")
    print("   Enfermero: enfermero@zaire.com / password123")
    print()


if __name__ == '__main__':
    run()
