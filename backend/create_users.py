import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

def create_users():
    # Crear Superadmin
    if not User.objects.filter(correo='admin@zaire.com').exists():
        User.objects.create_superuser(
            correo='admin@zaire.com',
            nombre='Admin Zaire',
            password='admin123',
            rol='admin'
        )
        print("✅ Usuario ADMIN creado: admin@zaire.com / admin123")
    else:
        print("ℹ️ Usuario ADMIN ya existe")

    # Crear Médico
    if not User.objects.filter(correo='medico@zaire.com').exists():
        User.objects.create_user(
            correo='medico@zaire.com',
            nombre='Dr. House',
            password='password123',
            rol='medico'
        )
        print("✅ Usuario MÉDICO creado: medico@zaire.com / password123")
    else:
        print("ℹ️ Usuario MÉDICO ya existe")

if __name__ == '__main__':
    create_users()
