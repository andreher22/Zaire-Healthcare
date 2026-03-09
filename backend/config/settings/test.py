from .base import *

# Usar SQLite para pruebas para evitar dependencia de SQL Server
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db_test.sqlite3',
    }
}

# Desactivar migraciones durante tests para velocidad
class DisableMigrations(object):
    def __contains__(self, item):
        return True
    def __getitem__(self, item):
        return None

MIGRATION_MODULES = DisableMigrations()
