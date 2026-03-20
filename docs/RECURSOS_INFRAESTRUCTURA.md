# Especificación de Recursos e Infraestructura — Sistema ZAIRE Healthcare

**Versión:** 1.0  
**Fecha:** 19/03/2026  
**Elaborado por:** Equipo ZAIRE  

---

## 1. Visión General
Este documento detalla los recursos humanos, técnicos y la infraestructura necesarios para el óptimo desarrollo, despliegue y maduración del sistema de gestión hospitalaria ZAIRE Healthcare. 

---

## 2. Recursos Humanos (Equipo Base Recomendado)
Para la ejecución, mantenimiento y soporte del proyecto, se requiere la siguiente estructura organizacional:

| Rol | Cantidad | Perfil / Responsabilidad Principal |
|-----|----------|---------------------------------|
| **Project Manager / Scrum Master** | 1 | Planificación de sprints, gestión de bloqueos y enlace con Stakeholders (médicos, gerencia). |
| **Ingeniero de Software (Backend / Python)** | 2 | Desarrollo de la API RESTful en Django, configuración ORM, bases de datos e integración de Modelos ML. |
| **Desarrollador Frontend (React Native)** | 2 | Diseño UI/UX responsivo (Móvil y Web), consumo de API, manejo de estados asíncronos en Expo. |
| **Científico de Datos / Especialista AI** | 1 | Carga, limpieza y optimización del modelo `RandomForestClassifier`. Actualización periódica de datasets. |
| **DevOps / SysAdmin** | 1 | Integración Continua (CI/CD), orquestación en la nube, gestión de contenedores docker y respaldos. |
| **Especialista QA (Tester)** | 1 | Pruebas end-to-end, pruebas de penetración (seguridad en endpoints) y automatización. |

---

## 3. Arquitectura e Infraestructura Tecnológica

El despliegue de ZAIRE utilizará un modelo conceptual de tres capas para asegurar escalabilidad y separación de responsabilidades.

### 3.1. Entornos de Despliegue
Se establecen tres ambientes separados:
1. **Desarrollo (Local):** Uso de SQLite temporal, servidores integrados de Django (`runserver`) y Metro Bundler local.
2. **Staging / Pruebas:** Espejo del entorno de producción pero con datos anonimizados. Despliegue semiautomatizado para QA.
3. **Producción:** Entorno vivo, altamente disponible y con datos protegidos PII.

### 3.2. Hardware / Cloud Services
| Componente | Especificación Mínima Sugerida | Proveedor Cloud Orientativo |
|------------|--------------------------------|-----------------------------|
| **Servidor de Aplicaciones Backend** | VM Linux (Ubuntu 22.04 LTS), 2 vCPU, 4GB RAM, 50GB SSD | AWS EC2 (t3.medium) / Azure / DigitalOcean Droplet |
| **Base de Datos Principal** | Instancia administrada PostgreSQL o SQL Server. 4GB RAM, 100GB Almacenamiento SSD | AWS RDS / Azure SQL Database |
| **Servidor Frontend Web** | CDN / Alojamiento Estático SPA | Vercel / Netlify / AWS S3 + CloudFront |
| **Almacenamiento de Archivos y Backups** | Almacenamiento de Objetos para assets, reportes PDF e imágenes | AWS S3 Bucket / Azure Blob Storage |

### 3.3. Stack Tecnológico de Software
- **Frontend App:** React Native v0.7x + Expo v54+.
- **Frontend Web:** React DOM / React Native Web.
- **Backend API:** Django 5.x + Django REST Framework.
- **Base de Datos:** SQLite (Desarrollo), SQL Server o PostgreSQL (Producción).
- **Inteligencia Artificial:** Scikit-Learn (`RandomForestClassifier`), Pandas, Numpy (Empaquetado vía Joblib).
- **Seguridad:** Autenticación vía JWT (JSON Web Tokens).

---

## 4. Requerimientos Físicos (En sitio hospitalario)
Para que las clínicas u hospitales puedan consumir el producto, requieren configuraciones básicas:
- **Conectividad:** Enlace de internet dedicado o de banda ancha estable (Fibra óptica preferencial), ping < 50ms al servidor cloud.
- **Equipos Médicos (Terminales):** Computadoras con navegadores modernos (Chrome 100+, Edge, Safari 15+) o tablets iOS/Android de gama media con soporte para renderizado rápido.
- **Red Interna:** Acceso no bloqueado por firewall a las IPs de la API ZAIRE, o VPN si el sistema será on-premise.

---

## 5. Mantenimiento y Disponibilidad
- Toda la base de datos contará con *respaldos automatizados (incremental)* ejecutados todos los días a las 02:00 hrs.
- Mantenimiento predictivo de la infraestructura mediante integración de Prometheus / Grafana para monitorear CPU y Cuellos de botella de red de la API.
- Se asegura como mínimo un SLA objetivo de disponibilidad técnica superior al **99.9%** mensual ("Three Nines").
