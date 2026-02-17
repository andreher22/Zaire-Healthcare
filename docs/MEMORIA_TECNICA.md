# 📘 Memoria Técnica del Proyecto ZAIRE Healthcare

## 1. Introducción y Contexto

Este documento detalla el proceso técnico seguido para desarrollar el MVP de **ZAIRE Healthcare**, un sistema de gestión clínica con soporte de Inteligencia Artificial. El objetivo fue crear una solución desacoplada (Backend API + App Móvil) que permita agilizar la atención médica y ofrecer diagnósticos preliminares basados en datos.

---

## 2. Metodología de Desarrollo y Ramas (Git Flow)

Para mantener un historial limpio y organizado, se siguió una estrategia de ramas basada en **Git Flow simplificado** para un equipo pequeño/académico.

### Estrategia de Ramas
*   `main`: Rama de producción. Código estable y listo para desplegar.
*   `feature/project-setup`: Rama principal de desarrollo para el MVP. Todas las nuevas características se integraron aquí antes de fusionarse a main.

### Buenas Prácticas Aplicadas
*   **Commits Semánticos**: Uso de prefijos estándar (`feat:`, `fix:`, `docs:`, `test:`) para describir los cambios.
    *   Ejemplo: `feat(auth): implementar jwt y roles de usuario`
    *   Ejemplo: `docs: agregar reporte tecnico de prototipado`
*   **Archivos Ignorados**: Configuración estricta de `.gitignore` para no subir archivos temporales (`__pycache__`, `.env`), bases de datos locales (`*.sqlite3`) o dependencias (`node_modules`, `venv`).

---

## 3. Bitácora de Desarrollo Paso a Paso

### Fase 1: Configuración Inicial del Monorepo
1.  **Estructura**: Se definió un monorepo con dos directorios raíz: `backend/` (Django) y `frontend/` (Expo).
2.  **Entorno Virtual**: Creación de `venv` en Python para aislar dependencias (`pip install django djangorestframework`).
3.  **Configuración Modular**: Se refactorizó `settings.py` en `config/settings/` (`base.py`, `development.py`, `production.py`) para manejar entornos local vs nube sin cambiar código.

### Fase 2: Backend (Django REST Framework)
Se implementaron 4 módulos principales como "Apps" de Django:
1.  **Autenticación (`apps.autenticacion`)**:
    *   Modelo `Usuario` personalizado extendiendo `AbstractBaseUser`.
    *   Implementación de JWT (JSON Web Tokens) para sesiones stateless seguras.
    *   Roles: Admin, Médico, Enfermero.
2.  **Pacientes (`apps.pacientes`)**:
    *   CRUD completo con validaciones.
    *   Permisos: Los médicos solo ven sus propios pacientes.
3.  **Historial Clínico (`apps.historial`)**:
    *   Modelo relacional: Paciente 1:N Eventos.
    *   **Generación PDF**: Integración de `reportlab` para crear reportes PDF dinámicos desde el backend.
4.  **Diagnóstico IA (`apps.diagnostico`)**:
    *   Entrenamiento de modelo `RandomForest` con `scikit-learn`.
    *   API Endpoint: Recibe JSON de síntomas -> Retorna Probabilidad y Enfermedad.
    *   Persistencia del modelo entrenado usando `joblib`.

### Fase 3: Frontend (React Native + Expo)
Desarrollo bajo filosofía **Mobile-First**:
1.  **Navegación**: Configuración de `React Navigation` con Stack (flujos lineales) y Tabs (menú principal).
2.  **Servicios API**: Capa de servicio (`src/services/api.js`) con interceptores para inyectar el Token JWT automáticamente en cada petición.
3.  **Interfaz de Usuario**:
    *   Uso de `React Native Paper` para componentes Material Design.
    *   Personalización con paleta de colores corporativa (Verde Oliva `colors.darkOliveGreen`).
4.  **Integración IA**: Pantalla con selectores de "Chips" para síntomas, enviando datos al backend y renderizando la respuesta predictiva.

### Fase 4: Calidad y Pruebas
*   **Pruebas Unitarias**: Scripts en `backend/apps/*/tests/` para validar lógica crítica (Login, Creación de Pacientes).
*   **Entorno de Test**: Configuración de SQLite en memoria para ejecución rápida de tests en CI/CD.

---

## 4. Tecnologías y Decisiones de Diseño

| Componente | Tecnología | Justificación |
|------------|------------|---------------|
| **Backend** | Django 5 + DRF | Robustez, seguridad integrada (Auth, SQL Injection protection) y rapidez de desarrollo. |
| **Base de Datos** | SQL Server (Dev) / SQLite (Demo) | Requisito académico. SQLite se usó en la demo final para portabilidad sin instalación de drivers. |
| **Frontend** | React Native (Expo) | Desarrollo híbrido (Android/iOS) con una sola base de código. |
| **IA** | Scikit-Learn | Librería estándar, eficiente para datasets tabulares de síntomas. |
| **Documentación** | Markdown | Formato universal, versionable junto con el código. |

---

## 5. Instrucciones de Ejecución Final

Para levantar el sistema completo en entorno local:

### Backend
Comando para correr el servidor servidor API (Puerto 8000):
```bash
cd backend
python manage.py runserver 0.0.0.0:8000
```
*Credenciales Demo*: `admin@zaire.com` / `admin123` | `medico@zaire.com` / `password123`

### Frontend
Comando para iniciar la aplicación móvil:
```bash
cd frontend
npx expo start --clear
```
Escanear el código QR con la app **Expo Go** en Android/iOS.
