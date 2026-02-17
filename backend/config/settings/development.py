"""
ZAIRE Healthcare - Settings de Desarrollo
Configuración para entorno local con SQL Server Express.
"""

from .base import *  # noqa: F401, F403

# =============================================================================
# DEBUG
# =============================================================================

DEBUG = True


# =============================================================================
# BASE DE DATOS - SQL Server Express (Local)
# =============================================================================

# Base de datos (SQLite por defecto para desarrollo simple y demo)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Configuración SQL Server (Comentada para evitar errores de driver si no está instalado)
# DATABASES = {
#     'default': {
#         'ENGINE': 'mssql',
#         'NAME': 'ZaireDB',
#         'HOST': 'localhost\\SQLEXPRESS',
#         'PORT': '',
#         'OPTIONS': {
#             'driver': 'ODBC Driver 17 for SQL Server',
#         },
#     }
# }


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
