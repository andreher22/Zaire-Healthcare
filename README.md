# 🏥 ZAIRE Healthcare

> Sistema de salud con diagnóstico asistido por Inteligencia Artificial

[![Python](https://img.shields.io/badge/Python-3.12+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Django](https://img.shields.io/badge/Django-5.1-092E20?style=for-the-badge&logo=django&logoColor=white)](https://djangoproject.com)
[![React Native](https://img.shields.io/badge/React_Native-0.76-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo-52-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev)
[![SQL Server](https://img.shields.io/badge/SQL_Server-2022-CC2927?style=for-the-badge&logo=microsoftsqlserver&logoColor=white)](https://www.microsoft.com/sql-server)

---

## 📋 Descripción

**ZAIRE Healthcare** es una plataforma digital de salud que integra tecnologías de inteligencia artificial para apoyar el diagnóstico médico. El sistema permite la gestión de pacientes, el manejo de historial clínico digital y un módulo de apoyo al diagnóstico mediante IA, optimizando la atención médica.

### Características Principales

- 🔐 **Autenticación segura** con tokens JWT
- 👨‍⚕️ **Gestión de pacientes** — Registro, consulta y seguimiento
- 📋 **Historial clínico digital** — Eventos clínicos y generación de PDF
- 🤖 **Diagnóstico asistido por IA** — Análisis de síntomas con Machine Learning
- 📱 **App móvil multiplataforma** — React Native con Expo (Android/iOS)
- 🔒 **Seguridad HTTPS** — Comunicación cifrada entre cliente y servidor

---

## 🎨 Paleta de Colores

| Color | Hex | Muestra | Uso |
|-------|-----|---------|-----|
| Dark Olive Green | `#606C38` | 🟢 | Primario, botones, headers |
| Kombu Green | `#283618` | 🟤 | Fondos oscuros, navbar, texto |
| Cornsilk | `#FEFAE0` | 🟡 | Fondo principal, cards |
| Fawn | `#DDA15E` | 🟠 | Acentos, botones secundarios |
| Liver (Dogs) | `#BC6C25` | 🟫 | Alertas, estados activos |

---

## 🏗️ Arquitectura

```
┌─────────────────────┐
│   App Móvil          │
│   (React Native)     │
│   • Login            │
│   • Pacientes        │
│   • Diagnóstico IA   │
└─────────┬───────────┘
          │ HTTPS / JSON
          ▼
┌─────────────────────┐
│   API REST           │
│   (Django DRF)       │
│   • Autenticación JWT│
│   • Pacientes        │
│   • Historial Clínico│
│   • Servicio IA      │
└─────────┬───────────┘
          │ ORM
          ▼
┌─────────────────────┐
│   SQL Server         │
│   Base de Datos      │
└─────────────────────┘
```

---

## 📁 Estructura del Proyecto

```
Zaire-Healthcare/
├── README.md                 ← Este archivo
├── .gitignore
├── docs/                     ← Documentación técnica
│   ├── ARQUITECTURA.md
│   ├── API.md
│   ├── BASE-DE-DATOS.md
│   ├── DESPLIEGUE.md
│   └── CONTRIBUIR.md
├── backend/                  ← Django REST Framework
│   ├── manage.py
│   ├── requirements.txt
│   ├── config/               ← Configuración Django
│   └── apps/                 ← Módulos de la aplicación
│       ├── autenticacion/
│       ├── pacientes/
│       ├── historial/
│       └── diagnostico/
└── frontend/                 ← React Native + Expo
    ├── package.json
    ├── App.js
    └── src/
        ├── screens/
        ├── services/
        ├── components/
        └── navigation/
```

---

## 🚀 Inicio Rápido

### Requisitos Previos

- Python 3.12+
- Node.js 20+
- SQL Server Express 2022
- Expo CLI (`npm install -g expo-cli`)
- Git

### Backend

```bash
# Clonar repositorio
git clone https://github.com/andreher22/Zaire-Healthcare.git
cd Zaire-Healthcare/backend

# Crear entorno virtual
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Linux/Mac

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
copy .env.example .env         # Windows
# cp .env.example .env         # Linux/Mac

# Ejecutar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Iniciar servidor
python manage.py runserver 0.0.0.0:8000
```

### Frontend

```bash
cd Zaire-Healthcare/frontend

# Instalar dependencias
npm install

# Iniciar con Expo
npx expo start
```

> 📱 Escanea el código QR con **Expo Go** en tu celular (misma red WiFi)

---

## 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| [Arquitectura](docs/ARQUITECTURA.md) | Diagrama y flujo del sistema |
| [API](docs/API.md) | Especificación de endpoints REST |
| [Base de Datos](docs/BASE-DE-DATOS.md) | Guía de instalación SQL Server |
| [Despliegue](docs/DESPLIEGUE.md) | Plan de despliegue AWS + Azure |
| [Contribuir](docs/CONTRIBUIR.md) | Guía para colaboradores |

---

## 🛠️ Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | React Native, Expo, React Navigation, Axios |
| Backend | Python, Django, Django REST Framework |
| Autenticación | JWT (Simple JWT) |
| Base de Datos | SQL Server (Express / Azure) |
| IA | scikit-learn, TensorFlow |
| Despliegue | AWS App Runner, Azure SQL, EAS Build |

---

## 👥 Equipo de Trabajo

| Integrante | Rol | Responsabilidades |
|-----------|-----|-------------------|
| Andrea Robles Hernández | Backend / IA | Endpoints, IA, conectividad |
| Juan Pablo González Arauz | Frontend Mobile | React Native, consumo API |
| Itzel Galván Contreras | UX/UI | Diseño móvil |
| Jerónimo Israel Macías Quintero | Documentador / RRHH | Documentación y gestión |

---

## 📄 Licencia

Este proyecto es de uso académico. Desarrollado como proyecto final universitario.

---

## 📖 Referencias

- Pressman, R. S. (1992). *Ingeniería del software: un enfoque práctico.*
- Rocha et al. (2021). *Information Technology and Systems.* Springer.
- Piattini et al. (2019). *Quality of Information and Communications Technology.* Springer.
