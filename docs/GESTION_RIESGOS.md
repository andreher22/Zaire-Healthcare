# Plan de Gestión de Riesgos — Sistema ZAIRE Healthcare

**Versión:** 1.0  
**Fecha:** 08/03/2026  
**Elaborado por:** Equipo ZAIRE  
**Docente:** Mtra. Miriam López SanLuis

---

## 1. Objetivo

Identificar, analizar y establecer estrategias de mitigación para los riesgos técnicos, operativos y de seguridad que puedan afectar el desarrollo, despliegue y operación del sistema ZAIRE.

---

## 2. Metodología

Cada riesgo se evalúa con:
- **Probabilidad:** Baja (1), Media (2), Alta (3)
- **Impacto:** Bajo (1), Medio (2), Alto (3)
- **Severidad:** Probabilidad × Impacto (1-9)

| Severidad | Nivel | Acción |
|-----------|-------|--------|
| 1 – 2 | 🟢 Bajo | Monitorear |
| 3 – 4 | 🟡 Medio | Plan de contingencia |
| 6 – 9 | 🔴 Alto | Mitigación inmediata obligatoria |

---

## 3. Matriz de Riesgos

### 3.1 Riesgos Técnicos

| ID | Riesgo | Prob. | Impacto | Sev. | Mitigación |
|----|--------|-------|---------|------|------------|
| RT-01 | **Fallo de conexión a SQL Server** — El backend no puede conectar a la BD | 2 | 3 | 🔴 6 | Configuración de SQLite como fallback en `development.py`. Documentación de troubleshooting incluida |
| RT-02 | **Incompatibilidad de versión de mssql-django** — El driver no soporta la versión de SQL Server instalada | 2 | 2 | 🟡 4 | Parche aplicado en `base.py` para v17. Documentar versiones compatibles |
| RT-03 | **Modelo IA con baja precisión en datos reales** — El modelo entrenado con datos generados no funciona bien con pacientes reales | 2 | 2 | 🟡 4 | El modelo es herramienta de apoyo, no diagnóstico final. Reentrenar con dataset de Kaggle real cuando esté disponible |
| RT-04 | **Dependencias de npm/pip desactualizadas** — Breaking changes en paquetes | 1 | 2 | 🟢 2 | Versiones fijadas en `package.json` y `requirements.txt` |
| RT-05 | **Pérdida de datos en migración** — Datos perdidos al cambiar de SQLite a SQL Server | 1 | 3 | 🟡 3 | Script `seed_data.py` permite regenerar datos demo en cualquier momento |

### 3.2 Riesgos de Seguridad

| ID | Riesgo | Prob. | Impacto | Sev. | Mitigación |
|----|--------|-------|---------|------|------------|
| RS-01 | **Acceso no autorizado a datos clínicos** — Un usuario sin permisos accede a información de pacientes | 1 | 3 | 🟡 3 | Autenticación JWT obligatoria, filtrado por `usuario=request.user` en todas las queries |
| RS-02 | **Token JWT comprometido** — Robo de token de sesión | 1 | 3 | 🟡 3 | Tokens con expiración corta, refresh tokens, almacenamiento seguro en AsyncStorage |
| RS-03 | **Inyección SQL** — Intento de manipulación de la base de datos | 1 | 3 | 🟡 3 | ORM de Django previene inyección SQL. No se usan queries raw |
| RS-04 | **Exposición de credenciales** — Contraseñas o claves en código fuente | 1 | 3 | 🟡 3 | Usar `.env` para variables sensibles, `.gitignore` configurado |

### 3.3 Riesgos Operativos

| ID | Riesgo | Prob. | Impacto | Sev. | Mitigación |
|----|--------|-------|---------|------|------------|
| RO-01 | **Diagnóstico IA tomado como definitivo** — El médico confía ciegamente en la IA sin validación | 2 | 3 | 🔴 6 | Aviso obligatorio en la UI: "Este es un apoyo diagnóstico, no un diagnóstico definitivo". Estado de aceptar/rechazar resultado |
| RO-02 | **Falta de respaldos de BD** — Pérdida de información por fallo de hardware | 2 | 3 | 🔴 6 | Programar respaldos automáticos de SQL Server. Script de backup documentado |
| RO-03 | **Servidor Django no disponible** — El backend deja de responder | 1 | 2 | 🟢 2 | La app muestra estados de error amigables y spinners de carga. Reconexión automática |
| RO-04 | **Tiempo insuficiente para completar funcionalidades** — El periodo académico se agota | 2 | 2 | 🟡 4 | Desarrollo basado en MVP. Funcionalidades core ya implementadas, mejoras son incrementales |

### 3.4 Riesgos de Proyecto

| ID | Riesgo | Prob. | Impacto | Sev. | Mitigación |
|----|--------|-------|---------|------|------------|
| RP-01 | **Falta de coordinación del equipo** — Entregas tardías o incompletas | 2 | 2 | 🟡 4 | Repositorio compartido en GitHub, tareas asignadas, comunicación constante |
| RP-02 | **Requisitos cambiantes** — Nuevas funcionalidades solicitadas a último momento | 2 | 2 | 🟡 4 | Scope definido en documentación. Cambios se evalúan por impacto antes de implementar |
| RP-03 | **Equipo sin experiencia en alguna tecnología** — Curva de aprendizaje en Django o React Native | 2 | 1 | 🟢 2 | Documentación interna del proyecto, código comentado, arquitectura modular |

---

## 4. Mapa de Calor de Riesgos

```
         IMPACTO →
         Bajo(1)    Medio(2)    Alto(3)
Alta(3)  │          │           │
         │          │           │
Media(2) │ RP-03    │ RT-03,    │ RT-01,
P        │          │ RT-02,    │ RO-01,
R        │          │ RO-04,    │ RO-02
O        │          │ RP-01,    │
B        │          │ RP-02     │
         │          │           │
Baja(1)  │          │ RT-04,    │ RT-05,
         │          │ RO-03     │ RS-01,
         │          │           │ RS-02,
         │          │           │ RS-03,
         │          │           │ RS-04
```

---

## 5. Plan de Contingencia

### Contingencia para riesgos de severidad alta (🔴)

| Riesgo | Plan de Contingencia |
|--------|---------------------|
| **RT-01** (Fallo SQL Server) | 1. Verificar servicio SQL Server activo. 2. Revisar string de conexión. 3. Si persiste, revertir a SQLite temporalmente comentando/descomentando en `development.py` |
| **RO-01** (IA como diagnóstico definitivo) | 1. Disclaimer obligatorio en pantalla de resultados. 2. El médico DEBE marcar "Aceptar" o "Rechazar" cada resultado. 3. Registro de auditoría de todas las decisiones |
| **RO-02** (Sin respaldos) | 1. Configurar respaldo automático semanal de ZaireDB. 2. Almacenar respaldos en ubicación diferente al servidor. 3. Script de restore documentado |

---

## 6. Monitoreo y Revisión

| Actividad | Frecuencia | Responsable |
|-----------|-----------|-------------|
| Revisión de logs de error del backend | Semanal | Equipo de desarrollo |
| Verificación de respaldos de BD | Semanal | Administrador |
| Revisión de nuevos riesgos identificados | Quincenal | Todo el equipo |
| Actualización de este documento | Mensual o por evento crítico | Líder del proyecto |
