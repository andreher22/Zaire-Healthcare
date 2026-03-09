# Plan de Gestión de Calidad — Sistema ZAIRE Healthcare

**Versión:** 1.0  
**Fecha:** 08/03/2026  
**Elaborado por:** Equipo ZAIRE  
**Docente:** Mtra. Miriam López SanLuis  
**Cuatrimestre:** 8° Grupo "A"

---

## 1. Objetivo

Definir los criterios, estándares y procesos que garanticen que el sistema ZAIRE cumpla con los requerimientos funcionales, de seguridad y de usabilidad establecidos, asegurando un producto confiable para su uso en entornos de atención clínica.

---

## 2. Alcance

El plan aplica a todos los módulos del sistema:

| Módulo | Componentes |
|--------|-------------|
| **Autenticación** | Login JWT, roles (admin/médico/enfermero), perfil |
| **Pacientes** | CRUD de pacientes, búsqueda, filtros |
| **Historial Clínico** | Timeline de eventos, creación de eventos, exportación PDF |
| **Diagnóstico IA** | Selección de síntomas, predicción RandomForest, top 3 resultados |
| **Dashboard** | Estadísticas dinámicas, actividad reciente |
| **Admin Django** | Panel de administración con fieldsets y auditoría |

---

## 3. Estándares de Calidad

### 3.1 Calidad del Código

| Criterio | Estándar |
|----------|----------|
| Documentación | JSDoc en funciones principales del frontend, docstrings en Python |
| Nombrado | camelCase (JS), snake_case (Python), nombres descriptivos en español para modelos |
| Estructura | Separación por capas: services → screens → components (frontend), apps → views → serializers (backend) |
| Reutilización | Componentes compartidos (`StatsCard`, `EmptyState`, `LoadingSpinner`) |

### 3.2 Calidad del Modelo IA

| Métrica | Valor Objetivo | Valor Actual |
|---------|---------------|--------------|
| Precisión (accuracy) | ≥ 90% | 99.59% ✅ |
| Enfermedades cubiertas | ≥ 30 | 41 ✅ |
| Síntomas reconocidos | ≥ 100 | 131 ✅ |
| Tiempo de respuesta | < 2 segundos | < 0.5s ✅ |

### 3.3 Calidad de la Interfaz

| Criterio | Estándar |
|----------|----------|
| Responsive | Adaptación automática móvil (< 768px) y escritorio (≥ 768px) |
| Paleta de colores | Consistente con manual de identidad (5 colores base) |
| Feedback al usuario | Spinners de carga, estados vacíos, mensajes de error descriptivos |
| Navegación | Máximo 3 taps para llegar a cualquier funcionalidad |

---

## 4. Procesos de Aseguramiento de Calidad

### 4.1 Revisión de Código

- Todo cambio debe probarse localmente antes de subir al repositorio
- Verificar que `python manage.py check` no reporte errores
- Verificar que la app no muestre errores en consola de Metro Bundler

### 4.2 Pruebas Funcionales

| Flujo | Pasos a Verificar |
|-------|-------------------|
| **Login** | Credenciales válidas → token → redirección a Home |
| **Dashboard** | Stats cargadas desde API, avatar con iniciales, actividad reciente |
| **Pacientes** | Crear, ver lista, filtrar, ver detalle, eliminar |
| **Diagnóstico IA** | Seleccionar paciente → síntomas → resultado con confianza |
| **Historial** | Seleccionar paciente → ver timeline → crear evento |
| **Perfil** | Ver datos → editar nombre → guardar cambios |
| **Admin** | Login admin → ver fieldsets → filtrar por fecha |

### 4.3 Pruebas de Seguridad

| Aspecto | Verificación |
|---------|-------------|
| Autenticación | Endpoints protegidos devuelven 401 sin token |
| Autorización | Médico solo ve sus propios pacientes |
| Tokens | JWT con expiración configurada |
| Contraseñas | Hasheadas con PBKDF2 (Django default) |
| SQL Injection | Protegido por ORM de Django |

---

## 5. Criterios de Aceptación

El sistema se considera listo para despliegue cuando:

- [ ] Todos los flujos de la sección 4.2 funcionan sin errores
- [ ] `python manage.py check` → 0 issues
- [ ] La app carga en < 3 segundos en conexión estándar
- [ ] El modelo IA responde en < 2 segundos
- [ ] No hay errores en consola del navegador/Expo
- [ ] Los 3 roles de usuario pueden acceder a sus funcionalidades correspondientes
- [ ] La base de datos SQL Server contiene datos de demostración

---

## 6. Plan de Mejora Continua

| Fase | Acción | Periodo |
|------|--------|---------|
| **Corto plazo** | Corregir bugs reportados en pruebas | Semana 1-2 |
| **Mediano plazo** | Agregar validaciones RBAC estrictas por rol | Mes 2 |
| **Largo plazo** | Reentrenar modelo IA con datos clínicos reales | Post-evaluación |
