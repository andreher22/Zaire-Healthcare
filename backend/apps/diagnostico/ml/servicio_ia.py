"""
ZAIRE Healthcare - Servicio de Inferencia IA
Carga el modelo entrenado y realiza predicciones de diagnóstico.
"""
import os
import logging
import numpy as np
from django.conf import settings

logger = logging.getLogger(__name__)

# Variable global para cachear el modelo
_modelo = None
_columnas_sintomas = None


def cargar_modelo():
    """
    Cargar el modelo entrenado desde disco.
    Se cachea en memoria para evitar recargarlo en cada petición.
    """
    global _modelo, _columnas_sintomas

    if _modelo is not None:
        return _modelo, _columnas_sintomas

    try:
        import joblib

        ruta_modelo = os.path.join(
            settings.BASE_DIR,
            settings.MODEL_PATH,
            'modelo_diagnostico.joblib'
        )
        ruta_columnas = os.path.join(
            settings.BASE_DIR,
            settings.MODEL_PATH,
            'columnas_sintomas.joblib'
        )

        if not os.path.exists(ruta_modelo):
            logger.warning(
                f'Modelo no encontrado en {ruta_modelo}. '
                'Ejecute el script de entrenamiento primero.'
            )
            return None, None

        _modelo = joblib.load(ruta_modelo)
        _columnas_sintomas = joblib.load(ruta_columnas)

        logger.info(f'Modelo cargado exitosamente desde {ruta_modelo}')
        return _modelo, _columnas_sintomas

    except Exception as e:
        logger.error(f'Error al cargar el modelo: {e}')
        return None, None


def predecir_diagnostico(sintomas_seleccionados):
    """
    Realizar predicción de diagnóstico basado en síntomas.
    
    Args:
        sintomas_seleccionados: Lista de strings con los nombres de los síntomas.
    
    Returns:
        dict con:
            - diagnostico: nombre del diagnóstico más probable
            - confianza: porcentaje de confianza (0-100)
            - top_predicciones: lista de las 3 predicciones más probables
            - sintomas_procesados: cantidad de síntomas reconocidos
    """
    modelo, columnas = cargar_modelo()

    if modelo is None:
        return {
            'error': 'Modelo no disponible. Contacte al administrador.',
            'diagnostico': None,
            'confianza': 0,
            'top_predicciones': [],
        }

    # Crear vector de features binario (0/1)
    vector = np.zeros(len(columnas))
    sintomas_reconocidos = 0

    for sintoma in sintomas_seleccionados:
        # Normalizar el nombre del síntoma
        sintoma_normalizado = sintoma.strip().lower().replace(' ', '_')
        if sintoma_normalizado in columnas:
            idx = list(columnas).index(sintoma_normalizado)
            vector[idx] = 1
            sintomas_reconocidos += 1

    if sintomas_reconocidos == 0:
        return {
            'error': 'Ninguno de los síntomas fue reconocido por el modelo.',
            'diagnostico': None,
            'confianza': 0,
            'top_predicciones': [],
        }

    # Realizar predicción
    vector_reshaped = vector.reshape(1, -1)
    prediccion = modelo.predict(vector_reshaped)[0]
    probabilidades = modelo.predict_proba(vector_reshaped)[0]

    # Obtener top 3 predicciones
    indices_top = np.argsort(probabilidades)[::-1][:3]
    clases = modelo.classes_

    top_predicciones = [
        {
            'diagnostico': str(clases[idx]),
            'confianza': round(float(probabilidades[idx]) * 100, 2)
        }
        for idx in indices_top
    ]

    return {
        'diagnostico': str(prediccion),
        'confianza': round(float(max(probabilidades)) * 100, 2),
        'top_predicciones': top_predicciones,
        'sintomas_procesados': sintomas_reconocidos,
    }


def obtener_lista_sintomas():
    """Retornar la lista completa de síntomas disponibles."""
    _, columnas = cargar_modelo()
    if columnas is not None:
        return sorted([s.replace('_', ' ').title() for s in columnas])
    return []
