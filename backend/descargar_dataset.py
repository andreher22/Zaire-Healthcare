"""
Script para descargar el dataset Training.csv de predicción de enfermedades.
Intenta múltiples fuentes en caso de que alguna no esté disponible.
"""
import os
import sys
import requests

DATASET_DIR = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    'apps', 'diagnostico', 'ml', 'datasets'
)
CSV_PATH = os.path.join(DATASET_DIR, 'Training.csv')

# Múltiples fuentes para el dataset
URLS = [
    # Mirror en GitHub (itachi9604)
    "https://raw.githubusercontent.com/itachi9604/healthcare-chatbot/master/Training.csv",
    # Mirror en GitHub (anujdutt9)
    "https://raw.githubusercontent.com/anujdutt9/Disease-Prediction-from-Symptoms/master/dataset/Training.csv",
]


def descargar_dataset():
    print("📥 Descargando dataset Training.csv...")
    os.makedirs(DATASET_DIR, exist_ok=True)

    if os.path.exists(CSV_PATH):
        print(f"⚠️  El archivo ya existe en: {CSV_PATH}")
        respuesta = input("   ¿Desea sobrescribirlo? (s/n): ").strip().lower()
        if respuesta != 's':
            print("   Descarga cancelada.")
            return

    for i, url in enumerate(URLS):
        print(f"   Intentando fuente {i + 1}/{len(URLS)}...")
        try:
            response = requests.get(url, timeout=30)
            if response.status_code == 200 and len(response.content) > 1000:
                with open(CSV_PATH, 'wb') as f:
                    f.write(response.content)
                
                # Verificar que el CSV sea válido
                lineas = response.text.strip().split('\n')
                print(f"   ✅ Dataset descargado exitosamente:")
                print(f"      - Ruta: {CSV_PATH}")
                print(f"      - Tamaño: {len(response.content) / 1024:.1f} KB")
                print(f"      - Registros: {len(lineas) - 1}")
                print(f"      - Columnas: {len(lineas[0].split(','))}")
                return True
            else:
                print(f"   ❌ Fuente {i + 1} no disponible (status: {response.status_code})")
        except Exception as e:
            print(f"   ❌ Error en fuente {i + 1}: {e}")

    print("\n❌ No se pudo descargar el dataset de ninguna fuente.")
    print("   Por favor descárgalo manualmente desde:")
    print("   https://www.kaggle.com/datasets/kaushil268/disease-symptom-prediction-up-to-date")
    print(f"   Y guárdalo en: {CSV_PATH}")
    return False


if __name__ == '__main__':
    descargar_dataset()
