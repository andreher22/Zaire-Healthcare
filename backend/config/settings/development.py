"""
ZAIRE Healthcare - Settings de Desarrollo
Configuración para entorno local.

USO:
  Actualmente usa SQLite para desarrollo rápido.
  Para cambiar a SQL Server Express, sigue las instrucciones dentro de este archivo.
"""

from .base import *  # noqa: F401, F403

# =============================================================================
# DEBUG
# =============================================================================

DEBUG = True


# =============================================================================
# BASE DE DATOS
# =============================================================================
#
# OPCIÓN ACTUAL: SQLite (desarrollo rápido, no requiere instalación)
# Para usar SQL Server Express, sigue estos pasos:
#
# 1. Instalar SQL Server Express:
#    https://www.microsoft.com/es-es/sql-server/sql-server-downloads
#    → Seleccionar descarga Express (gratuita)
#
# 2. Instalar ODBC Driver 17 for SQL Server:
#    https://learn.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server
#
# 3. Crear la base de datos "ZaireDB" en SQL Server Management Studio (SSMS)
#    o en la terminal de SQL Server:
#    CREATE DATABASE ZaireDB;
#
# 4. Instalar el paquete mssql-django:
#    pip install mssql-django
#
# 5. Comentar la sección de SQLite y descomentar la de SQL Server abajo
#
# 6. Ejecutar migraciones:
#    python manage.py migrate
#
# =============================================================================

# ─── SQLite (comentado, era el motor anterior) ───
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }

# ─── SQL Server Express (ACTIVO) ───
DATABASES = {
    'default': {
        'ENGINE': 'mssql',
        'NAME': 'ZaireDB',               # Nombre de la base de datos
        'HOST': 'localhost\\SQLEXPRESS',  # Instancia de SQL Server Express
        'PORT': '',                       # Puerto (vacío usa default 1433)
        'USER': '',                       # Vacío = Windows Authentication
        'PASSWORD': '',                   # Vacío = Windows Authentication
        'OPTIONS': {
            'driver': 'ODBC Driver 17 for SQL Server',
            'extra_params': 'TrustServerCertificate=yes',
        },
    }
}


# =============================================================================
# CORS - Permitir todo en desarrollo
# =============================================================================

CORS_ALLOW_ALL_ORIGINS = True


# =============================================================================
# HOSTS PERMITIDOS EN DESARROLLO
# =============================================================================

ALLOWED_HOSTS = ['*']


# =============================================================================
# LOGGING
# =============================================================================

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '[{levelname}] {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}
