# Presupuesto del Proyecto — Sistema ZAIRE Healthcare

**Versión:** 1.0  
**Fecha:** 08/03/2026  
**Periodo:** 3 meses (periodo académico)  
**Elaborado por:** Equipo ZAIRE

---

## 1. Resumen Ejecutivo

El sistema ZAIRE se desarrolla utilizando exclusivamente tecnologías **gratuitas y open-source**, lo que reduce el costo total del proyecto a un rango de **$0 a $1,000 MXN** dependiendo de si se requiere despliegue en servidor externo para demostración.

---

## 2. Stack Tecnológico y Costos de Licenciamiento

| Tecnología | Propósito | Licencia | Costo |
|-----------|-----------|----------|-------|
| React Native + Expo | Frontend multiplataforma | MIT (open-source) | $0 |
| Django + DRF | Backend API REST | BSD (open-source) | $0 |
| Python 3.14 | Lenguaje backend e IA | PSF (open-source) | $0 |
| scikit-learn | Modelo de IA (RandomForest) | BSD (open-source) | $0 |
| SQL Server Express | Base de datos | Microsoft (gratuito) | $0 |
| Git + GitHub | Control de versiones | Gratuito | $0 |
| VS Code | Editor de código | Microsoft (gratuito) | $0 |
| **Subtotal licencias** | | | **$0 MXN** |

---

## 3. Costos de Infraestructura

### 3.1 Entorno de Desarrollo (Local)

| Recurso | Descripción | Costo |
|---------|-------------|-------|
| Computadora | Equipo personal de los desarrolladores | $0 (ya disponible) |
| Internet | Conexión existente | $0 (ya disponible) |
| SQL Server Express | Instalación local | $0 |
| **Subtotal desarrollo** | | **$0 MXN** |

### 3.2 Entorno de Despliegue (Opcional — para demo)

| Concepto | Proveedor sugerido | Costo mensual | Costo 3 meses |
|----------|-------------------|---------------|----------------|
| Hosting VPS básico | DigitalOcean / Railway | $100 – $200 MXN | $300 – $600 MXN |
| Dominio .com | Namecheap / GoDaddy | $67 – $133 MXN | $200 – $400 MXN |
| Certificado SSL | Let's Encrypt | $0 (gratuito) | $0 |
| **Subtotal despliegue** | | | **$500 – $1,000 MXN** |

> **Nota:** Para evaluación académica, el sistema funciona completamente en entorno local sin necesidad de hosting externo. El despliegue es opcional.

---

## 4. Costos de Recurso Humano

| Rol | Integrantes | Dedicación | Costo real |
|-----|-------------|------------|------------|
| Desarrolladores | 4 estudiantes | ~10 hrs/semana c/u | $0 (académico) |
| Docente/Asesor | 1 | Revisión y retroalimentación | $0 (institucional) |
| **Subtotal RRHH** | | | **$0 MXN** |

> Al ser un proyecto académico, el recurso humano no genera costo monetario directo. En un escenario profesional, el costo estimado de desarrollo sería de $80,000 – $120,000 MXN (4 desarrolladores × 3 meses × $7,000-$10,000/mes).

---

## 5. Resumen de Costos

| Categoría | Costo Mínimo | Costo Máximo |
|-----------|-------------|-------------|
| Licencias de software | $0 | $0 |
| Desarrollo local | $0 | $0 |
| Despliegue (opcional) | $0 | $1,000 MXN |
| Recurso humano | $0 | $0 |
| **TOTAL** | **$0 MXN** | **$1,000 MXN** |

---

## 6. Alternativas de Despliegue Gratuito

Si se desea tener el sistema accesible en línea sin costo:

| Servicio | Qué aloja | Plan gratuito |
|----------|-----------|---------------|
| **Railway** | Backend Django | 500 hrs/mes gratis |
| **Render** | Backend Django | Tier gratuito con sleep |
| **Expo Go** | Frontend móvil | Gratuito (escaneo QR) |
| **Vercel** | Frontend web | Tier gratuito |
| **GitHub** | Código fuente | Repositorios ilimitados |

Con estas alternativas, el costo total del proyecto puede ser **$0 MXN**.

---

## 7. Análisis Costo-Beneficio

| Aspecto | Detalle |
|---------|---------|
| **Inversión total** | $0 – $1,000 MXN |
| **Funcionalidades entregadas** | Auth con roles, CRUD pacientes, historial clínico, diagnóstico IA, dashboard, admin |
| **Usuarios beneficiados** | Médicos, enfermeros, administradores |
| **Escalabilidad** | El sistema puede crecer sin cambio de tecnologías |
| **ROI académico** | Alto — proyecto funcional con IA real, base de datos empresarial y app multiplataforma |
