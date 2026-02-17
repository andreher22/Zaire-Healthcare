"""
Script de entrenamiento para el modelo de diagnóstico IA.
Uso: python apps/diagnostico/ml/entrenar_modelo.py
"""
import os
import sys
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

# Configurar path para importar desde backend
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
sys.path.append(BASE_DIR)

# Rutas
DATASET_DIR = os.path.join(BASE_DIR, 'apps', 'diagnostico', 'ml', 'datasets')
MODEL_DIR = os.path.join(BASE_DIR, 'apps', 'diagnostico', 'ml', 'modelos_guardados')
CSV_PATH = os.path.join(DATASET_DIR, 'Training.csv')

# Síntomas comunes para el modo sintético (fallback)
SINTOMAS_COMUNES = [
    'itching', 'skin_rash', 'nodal_skin_eruptions', 'continuous_sneezing', 'shivering', 'chills',
    'joint_pain', 'stomach_pain', 'acidity', 'ulcers_on_tongue', 'muscle_wasting', 'vomiting',
    'burning_micturition', 'spotting_urination', 'fatigue', 'weight_gain', 'anxiety',
    'cold_hands_and_feets', 'mood_swings', 'weight_loss', 'restlessness', 'lethargy',
    'patches_in_throat', 'irregular_sugar_level', 'cough', 'high_fever', 'sunken_eyes',
    'breathlessness', 'sweating', 'dehydration', 'indigestion', 'headache', 'yellowish_skin',
    'dark_urine', 'nausea', 'loss_of_appetite', 'pain_behind_the_eyes', 'back_pain',
    'constipation', 'abdominal_pain', 'diarrhoea', 'mild_fever', 'yellow_urine',
    'yellowing_of_eyes', 'acute_liver_failure', 'fluid_overload', 'swelling_of_stomach',
    'swelled_lymph_nodes', 'malaise', 'blurred_and_distorted_vision', 'phlegm',
    'throat_irritation', 'redness_of_eyes', 'sinus_pressure', 'runny_nose', 'congestion',
    'chest_pain', 'weakness_in_limbs', 'fast_heart_rate', 'pain_during_bowel_movements',
    'pain_in_anal_region', 'bloody_stool', 'irritation_in_anus', 'neck_pain', 'dizziness',
    'cramps', 'bruising', 'obesity', 'swollen_legs', 'swollen_blood_vessels', 'puffy_face_and_eyes',
    'enlarged_thyroid', 'brittle_nails', 'swollen_extremeties', 'excessive_hunger',
    'extra_marital_contacts', 'drying_and_tingling_lips', 'slurred_speech', 'knee_pain',
    'hip_joint_pain', 'muscle_weakness', 'stiff_neck', 'swelling_joints', 'movement_stiffness',
    'spinning_movements', 'loss_of_balance', 'unsteadiness', 'weakness_of_one_body_side',
    'loss_of_smell', 'bladder_discomfort', 'foul_smell_of_urine', 'continuous_feel_of_urine',
    'passage_of_gases', 'internal_itching', 'toxic_look_(typhos)', 'depression', 'irritability',
    'muscle_pain', 'altered_sensorium', 'red_spots_over_body', 'belly_pain',
    'abnormal_menstruation', 'dischromic_patches', 'watering_from_eyes', 'increased_appetite',
    'polyuria', 'family_history', 'mucoid_sputum', 'rusty_sputum', 'lack_of_concentration',
    'visual_disturbances', 'receiving_blood_transfusion', 'receiving_unsterile_injections',
    'coma', 'stomach_bleeding', 'distention_of_abdomen', 'history_of_alcohol_consumption',
    'fluid_overload', 'blood_in_sputum', 'prominent_veins_on_calf', 'palpitations',
    'painful_walking', 'pus_filled_pimples', 'blackheads', 'scurring', 'skin_peeling',
    'silver_like_dusting', 'small_dents_in_nails', 'inflammatory_nails', 'blister',
    'red_sore_around_nose', 'yellow_crust_ooze'
]

ENFERMEDADES_COMUNES = [
    'Fungal infection', 'Allergy', 'GERD', 'Chronic cholestasis', 'Drug Reaction',
    'Peptic ulcer diseae', 'AIDS', 'Diabetes', 'Gastroenteritis', 'Bronchial Asthma',
    'Hypertension', 'Migraine', 'Cervical spondylosis', 'Paralysis (brain hemorrhage)',
    'Jaundice', 'Malaria', 'Chicken pox', 'Dengue', 'Typhoid', 'hepatitis A',
    'Hepatitis B', 'Hepatitis C', 'Hepatitis D', 'Hepatitis E', 'Alcoholic hepatitis',
    'Tuberculosis', 'Common Cold', 'Pneumonia', 'Dimorphic hemmorhoids(piles)',
    'Heart attack', 'Varicose veins', 'Hypothyroidism', 'Hyperthyroidism', 'Hypoglycemia',
    'Osteoarthristis', 'Arthritis', '(vertigo) Paroymsal  Positional Vertigo', 'Acne',
    'Urinary tract infection', 'Psoriasis', 'Impetigo'
]


def generar_dataset_sintetico():
    """Generar un dataset sintético realista si no existe el CSV."""
    print("⚠️  No se encontró Training.csv. Generando dataset sintético para demostración...")
    print(f"    - Síntomas: {len(SINTOMAS_COMUNES)}")
    print(f"    - Enfermedades: {len(ENFERMEDADES_COMUNES)}")

    n_samples = 1000
    data = []

    for _ in range(n_samples):
        # Seleccionar una enfermedad al azar
        enfermedad = np.random.choice(ENFERMEDADES_COMUNES)
        
        # Simular síntomas (3 a 7 síntomas aleatorios)
        n_sintomas = np.random.randint(3, 8)
        sintomas_paciente = np.random.choice(SINTOMAS_COMUNES, n_sintomas, replace=False)
        
        row = {sintoma: 0 for sintoma in SINTOMAS_COMUNES}
        for s in sintomas_paciente:
            row[s] = 1
        
        row['prognosis'] = enfermedad
        data.append(row)

    return pd.DataFrame(data)


def main():
    print("🏥 Iniciando entrenamiento del modelo de diagnóstico ZAIRE...")

    # 1. Cargar datos
    if os.path.exists(CSV_PATH):
        print(f"✅ Cargando dataset real desde: {CSV_PATH}")
        df = pd.read_csv(CSV_PATH)
    else:
        df = generar_dataset_sintetico()

    # Limpieza básica
    # Eliminar columna vacía que a veces aparece en datasets de Kaggle
    if 'Unnamed: 133' in df.columns:
        df = df.drop(columns=['Unnamed: 133'])

    # Separar X e y
    X = df.drop(columns=['prognosis'])
    y = df['prognosis']

    print(f"📊 Dataset cargado: {X.shape[0]} registros, {X.shape[1]} síntomas")

    # 2. Split train/test
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # 3. Entrenar modelo
    print("🧠 Entrenando Random Forest Classifier...")
    modelo = RandomForestClassifier(n_estimators=100, random_state=42)
    modelo.fit(X_train, y_train)

    # 4. Evaluar
    y_pred = modelo.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"🎯 Precisión del modelo: {accuracy * 100:.2f}%")
    
    # 5. Guardar modelo y columnas
    if not os.path.exists(MODEL_DIR):
        os.makedirs(MODEL_DIR)

    ruta_modelo = os.path.join(MODEL_DIR, 'modelo_diagnostico.joblib')
    ruta_columnas = os.path.join(MODEL_DIR, 'columnas_sintomas.joblib')

    joblib.dump(modelo, ruta_modelo)
    # Guardar nombres de columnas normalizados
    columnas_normalizadas = [col.strip().lower().replace(' ', '_') for col in X.columns]
    joblib.dump(columnas_normalizadas, ruta_columnas)

    print("\n✅ Modelo guardado exitosamente:")
    print(f"   - Modelo: {ruta_modelo}")
    print(f"   - Columnas: {ruta_columnas}")
    print("\n📝 Instrucciones:")
    print("   Para usar el dataset real de Kaggle:")
    print("   1. Descarga 'Training.csv' de https://www.kaggle.com/datasets/kaushil268/disease-symptom-prediction-up-to-date")
    print(f"   2. Guárdalo en: {CSV_PATH}")
    print("   3. Vuelve a ejecutar este script.")


if __name__ == '__main__':
    main()
