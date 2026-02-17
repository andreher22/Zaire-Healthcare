# 🔐 Variables de Entorno — ZAIRE Healthcare

## Archivo `.env`

El archivo `.env` contiene la configuración sensible del proyecto. **Nunca debe subirse a Git** (ya está en `.gitignore`).

### Ubicación
```
backend/.env          ← Tu configuración local
backend/.env.example  ← Plantilla de referencia (sí se sube a Git)
```

---

## Variables Disponibles

### Django — Configuración General

| Variable | Descripción | Ejemplo | Requerido |
|----------|------------|---------|-----------|
| `SECRET_KEY` | Clave secreta de Django | `django-insecure-abc123...` | ✅ Producción |
| `DEBUG` | Modo depuración | `True` / `False` | ✅ |
| `ALLOWED_HOSTS` | Hosts permitidos (separados por coma) | `127.0.0.1,localhost` | ✅ |

#### Generar un SECRET_KEY nuevo para producción:
```python
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

---

### Base de Datos — SQL Server

| Variable | Descripción | Desarrollo | Producción |
|----------|------------|------------|------------|
| `DB_ENGINE` | Motor de BD | `mssql` | `mssql` |
| `DB_NAME` | Nombre de la BD | `zaire_healthcare` | `zaire_healthcare` |
| `DB_USER` | Usuario de la BD | `sa` | `admin_zaire` |
| `DB_PASSWORD` | Contraseña | `tu_password_local` | `password_segura_azure` |
| `DB_HOST` | Host del servidor | `localhost` | `zaire-server.database.windows.net` |
| `DB_PORT` | Puerto TCP | `1433` | `1433` |

---

### JWT — Tokens de Autenticación

| Variable | Descripción | Default | Ejemplo |
|----------|------------|---------|---------|
| `JWT_ACCESS_TOKEN_LIFETIME_MINUTES` | Duración del access token | `60` | `30` |
| `JWT_REFRESH_TOKEN_LIFETIME_DAYS` | Duración del refresh token | `7` | `14` |

---

### CORS — Orígenes Permitidos

| Variable | Descripción | Default |
|----------|------------|---------|
| `CORS_ALLOWED_ORIGINS` | URLs permitidas (separadas por coma) | `http://localhost:8081,http://localhost:19006` |

> En desarrollo (`development.py`), CORS está abierto para todas las URLs. Esta variable solo aplica en producción.

---

### IA — Modelo de Machine Learning

| Variable | Descripción | Default |
|----------|------------|---------|
| `MODEL_PATH` | Ruta relativa al modelo entrenado | `apps/diagnostico/ml/modelos_guardados/` |

---

## Ejemplo Completo — Desarrollo Local

```env
# Django
SECRET_KEY=django-insecure-clave-solo-para-desarrollo
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost,0.0.0.0

# Base de Datos (SQL Server Express)
DB_ENGINE=mssql
DB_NAME=zaire_healthcare
DB_USER=sa
DB_PASSWORD=MiContraseñaLocal123!
DB_HOST=localhost
DB_PORT=1433

# JWT
JWT_ACCESS_TOKEN_LIFETIME_MINUTES=60
JWT_REFRESH_TOKEN_LIFETIME_DAYS=7

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:8081,http://localhost:19006

# IA
MODEL_PATH=apps/diagnostico/ml/modelos_guardados/
```

---

## Ejemplo Completo — Producción (Azure + AWS)

```env
# Django
SECRET_KEY=una-clave-secreta-muy-larga-y-aleatoria-generada-con-el-comando-de-arriba
DEBUG=False
ALLOWED_HOSTS=tu-servicio.awsapprunner.com

# Base de Datos (Azure SQL)
DB_ENGINE=mssql
DB_NAME=zaire_healthcare
DB_USER=admin_zaire
DB_PASSWORD=ContraseñaSegura!Azure2026
DB_HOST=zaire-server.database.windows.net
DB_PORT=1433

# JWT
JWT_ACCESS_TOKEN_LIFETIME_MINUTES=30
JWT_REFRESH_TOKEN_LIFETIME_DAYS=7

# CORS
CORS_ALLOWED_ORIGINS=https://tu-dominio.com

# IA
MODEL_PATH=apps/diagnostico/ml/modelos_guardados/
```

---

## Cómo Configurar

1. **Copiar la plantilla**:
   ```bash
   copy backend\.env.example backend\.env    # Windows
   cp backend/.env.example backend/.env      # Linux/Mac
   ```

2. **Editar los valores** con tu editor de texto favorito

3. **Verificar que funciona**:
   ```bash
   cd backend
   venv\Scripts\activate
   python manage.py check
   ```

> ⚠️ **NUNCA** compartas tu archivo `.env` ni lo subas a Git. Si sospechas que se filtró un SECRET_KEY, genera uno nuevo inmediatamente.
