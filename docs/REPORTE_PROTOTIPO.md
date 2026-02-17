# Reporte de Prototipado y Caso Práctico - ZAIRE Healthcare

## 1. Objetivo del Prototipado

**Objetivo del prototipado de la aplicación ZAIRE Healthcare:**
Validar la viabilidad técnica y funcional de un **sistema integral de gestión médica y diagnóstico asistido por inteligencia artificial**. El prototipo busca demostrar cómo la integración de herramientas modernas (App Móvil + IA + Nube) puede optimizar el flujo de trabajo médico, desde la admisión del paciente hasta el diagnóstico preliminar y seguimiento histórico, garantizando la seguridad de los datos mediante autenticación robusta y roles definidos.

## 2. Perfil de Usuario

El sistema está diseñado para dos perfiles principales:

*   **Usuario Médico (Doctor/Especialista):**
    *   **Necesidades:** Acceso rápido a historiales clínicos, herramientas de apoyo al diagnóstico, gestión eficiente de su lista de pacientes.
    *   **Expectativas:** Una interfaz limpia, rápida (sin tiempos de carga excesivos), disponible en dispositivos móviles para rondas médicas, y certera en las sugerencias de la IA.
*   **Personal de Enfermería/Administrativo:**
    *   **Necesidades:** Registro ágil de nuevos pacientes, actualización de datos de contacto.
    *   **Expectativas:** Formularios claros y fáciles de llenar.

## 3. Funcionalidades Principales

El prototipo funcional (MVP) cubre los procesos críticos del ciclo de atención médica:

1.  **Seguridad y Acceso:** Autenticación segura vía JWT con roles diferenciados (Admin, Médico).
2.  **Gestión de Pacientes:** Registro, búsqueda en tiempo real, edición y visualización de perfil completo.
3.  **Diagnóstico Asistido por IA:** Selección de síntomas mediante interfaz visual (chips), análisis predictivo con modelo Machine Learning, y visualización de nivel de confianza.
4.  **Historial Clínico Digital:** Línea de tiempo de eventos médicos y **generación de reportes PDF** descargables para entrega al paciente o archivo físico.

## 4. Estructura de Pantallas y Flujos

### Mapa de Navegación

*   **LoginScreen:** Puerta de entrada segura.
*   **MainNavigator (Tab Bar):**
    *   🏠 **Inicio:** Dashboard con resumen del día y bienvenida personalizada.
    *   👥 **Pacientes (Stack):**
        *   Lista de Pacientes (Búsqueda + Pull-to-refresh).
        *   Nuevo Paciente (Formulario).
        *   Perfil Paciente (Detalle + Acciones rápidas).
    *   🧠 **Diagnóstico:** Herramienta interactiva de selección de síntomas y resultados.
    *   📋 **Historial (Stack):** Vista cronológica y descarga de reportes.

### Flujo Principal (Happy Path)
1.  Médico inicia sesión ➔ Dashboard.
2.  Busca paciente en pestaña "Pacientes" ➔ Selecciona perfil.
3.  Desde perfil, toca "Diagnóstico IA" ➔ Selecciona síntomas ➔ "Analizar".
4.  Revisa predicción IA ➔ Toca "Registrar en Historial".
5.  Confirma diagnóstico final y tratamiento ➔ Se guarda evento y se genera PDF actualizado.

## 5. Nivel de Fidelidad del Prototipo

**Prototipo de Alta Fidelidad (High-Fidelity) funcional.**

Se ha desarrollado una aplicación móvil funcional utilizando **React Native y Expo**, conectada a un **Backend real en Django**. No son solo wireframes estáticos; es software operativo con:
*   **Interacciones reales:** Navegación fluida, formularios funcionales, llamadas a API en tiempo real.
*   **Diseño Visual Final:** Aplicación estricta de la paleta de colores ZAIRE (Verde Oliva/Tierra) y componentes de UI modernos (Material Design 3 vía React Native Paper).
*   **Datos Dinámicos:** La información persiste en base de datos SQL Server y el modelo de IA realiza inferencias reales en el servidor.

**Justificación:** En esta etapa, era crítico validar la latencia de la IA y la usabilidad de los formularios en dispositivos móviles reales, algo que un mockup estático no permite evaluar.

## 6. Uso de Plantillas y Sistema de Diseño

Se utilizó la librería de componentes **React Native Paper** (basada en Material Design 3) para garantizar consistencia y accesibilidad, personalizada con el tema visual de ZAIRE.

*   **Estructura Base:**
    *   **Header:** Títulos claros, botones de acción (atrás, guardar) y acceso al perfil.
    *   **Navegación:** Tab Bar inferior persistente para las secciones principales.
    *   **Cards:** Contenedores elevados para info de pacientes y resultados de IA.
    *   **FAB (Floating Action Button):** Acciones principales (Nuevo Paciente, Nuevo Evento) siempre al alcance del pulgar.
    *   **Feedback:** Spinners de carga, diálogos de confirmación y mensajes "toast" para éxito/error.

## 7. Proceso de Prototipado Aplicado

1.  **Definición de Requisitos y Arquitectura:** Análisis del documento DOC-ZAIRE, definición de modelo de datos y arquitectura Cliente-Servidor.
2.  **Configuración del Entorno (Backend Primero):** Implementación de la API REST en Django para asegurar que los datos existieran antes de diseñar la UI.
3.  **Implementación Mobile-First:** Desarrollo del frontend en Expo comenzando por las pantallas críticas (Login, Lista).
4.  **Integración de Servicios:** Conexión de las pantallas con la API real y manejo de estados de carga/error.
5.  **Refinamiento Visual:** Aplicación de la paleta de colores corporativa y mejora de la experiencia de usuario (feedback visual, validaciones).

## 8. Herramientas Utilizadas

*   **Gestión y Planificación:** Markdown (Documentación técnica y guías).
*   **Backend & API:** Django REST Framework, Python, SQL Server.
*   **Inteligencia Artificial:** Scikit-learn (Entrenamiento del modelo), Joblib (Persistencia).
*   **Frontend & Prototipado:** React Native, Expo, React Native Paper.
*   **Control de Versiones:** Git & GitHub.

## 9. Diseño Responsive y Consistencia Visual

*   **Enfoque:** Mobile-First. Todo se diseñó pensando primero en la pantalla de un smartphone (interacciones táctiles, tamaños de fuente legibles).
*   **Paleta de Colores ZAIRE:**
    *   `Dark Olive Green (#606C38)`: Acción principal y branding.
    *   `Kombu Green (#283618)`: Textos y contrastes fuertes.
    *   `Cornsilk (#FEFAE0)`: Fondos suaves para reducir fatiga visual.
    *   `Fawn (#DDA15E)` y `Liver (#BC6C25)`: Alertas y estados secundarios.
*   **Tipografía:** Fuentes del sistema nativo (San Francisco/Roboto) para máxima legibilidad y familiaridad.

## 10. Conclusión del Caso Práctico

El prototipo del sistema **ZAIRE Healthcare** ha demostrado exitosamente que es posible integrar diagnósticos basados en IA en un flujo clínico tradicional sin sacrificar usabilidad. La arquitectura desacoplada permite escalar el backend (migrar a Azure) y el frontend (publicar en Stores) de manera independiente. La herramienta no sustituye al médico, sino que actúa como una "segunda opinión" instantánea, cumpliendo con el objetivo de optimizar la atención sanitaria mediante tecnología accesible.
