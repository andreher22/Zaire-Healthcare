# 📡 Especificación de la API REST — ZAIRE Healthcare

## Información General

| Campo | Valor |
|-------|-------|
| **Base URL (desarrollo)** | `http://localhost:8000/api/` |
| **Base URL (producción)** | `https://tu-dominio.com/api/` |
| **Formato** | JSON |
| **Autenticación** | Bearer Token (JWT) |
| **Paginación** | 20 resultados por página |

---

## Autenticación

Todos los endpoints (excepto login) requieren el header:
```
Authorization: Bearer <access_token>
```

Si el token expira, usa el endpoint de refresh para obtener uno nuevo.

---

## 🔐 Módulo de Autenticación (`/api/auth/`)

### POST `/api/auth/login/`
Iniciar sesión y obtener tokens JWT.

**Permisos**: Público  
**Request Body**:
```json
{
  "correo": "doctor@zaire.com",
  "password": "mi_contraseña_segura"
}
```

**Response 200**:
```json
{
  "mensaje": "Inicio de sesión exitoso",
  "tokens": {
    "access": "eyJ0eXAiOiJKV1Qi...",
    "refresh": "eyJ0eXAiOiJKV1Qi..."
  },
  "usuario": {
    "id": 1,
    "correo": "doctor@zaire.com",
    "nombre": "Dr. García López",
    "rol": "medico",
    "is_active": true,
    "fecha_creacion": "2026-02-16 17:30:00"
  }
}
```

**Response 400** (credenciales inválidas):
```json
{
  "non_field_errors": ["Credenciales inválidas. Verifique su correo y contraseña."]
}
```

---

### POST `/api/auth/logout/`
Cerrar sesión e invalidar el refresh token.

**Permisos**: Autenticado  
**Request Body**:
```json
{
  "refresh": "eyJ0eXAiOiJKV1Qi..."
}
```

**Response 200**:
```json
{
  "mensaje": "Sesión cerrada correctamente"
}
```

---

### POST `/api/auth/refresh/`
Renovar el access token usando el refresh token.

**Permisos**: Público  
**Request Body**:
```json
{
  "refresh": "eyJ0eXAiOiJKV1Qi..."
}
```

**Response 200**:
```json
{
  "access": "eyJ0eXAiOiJKV1Qi..."
}
```

---

### POST `/api/auth/registro/`
Registrar un nuevo usuario (solo administradores).

**Permisos**: Admin  
**Request Body**:
```json
{
  "correo": "enfermera@zaire.com",
  "nombre": "Ana Martínez",
  "password": "contraseña_segura_123",
  "password_confirm": "contraseña_segura_123",
  "rol": "enfermero"
}
```

**Roles disponibles**: `admin`, `medico`, `enfermero`

**Response 201**:
```json
{
  "mensaje": "Usuario registrado exitosamente",
  "usuario": {
    "id": 2,
    "correo": "enfermera@zaire.com",
    "nombre": "Ana Martínez",
    "rol": "enfermero"
  }
}
```

---

### GET `/api/auth/perfil/`
Obtener perfil del usuario autenticado.

**Permisos**: Autenticado  
**Response 200**:
```json
{
  "id": 1,
  "correo": "doctor@zaire.com",
  "nombre": "Dr. García López",
  "rol": "medico",
  "is_active": true,
  "fecha_creacion": "2026-02-16 17:30:00",
  "fecha_actualizacion": "2026-02-16 17:30:00"
}
```

---

## 👨‍⚕️ Módulo de Pacientes (`/api/pacientes/`)

### GET `/api/pacientes/`
Listar pacientes del médico autenticado.

**Permisos**: Autenticado  
**Parámetros de consulta**:

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `search` | string | Buscar por nombre o contacto |
| `sexo` | string | Filtrar por sexo: `M`, `F`, `O` |
| `ordering` | string | Ordenar: `nombre`, `fecha_registro`, `fecha_nacimiento` |
| `page` | int | Número de página |

**Response 200**:
```json
{
  "count": 15,
  "next": "http://localhost:8000/api/pacientes/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "usuario": 1,
      "medico_nombre": "Dr. García López",
      "nombre": "María Fernández",
      "fecha_nacimiento": "1990-05-15",
      "sexo": "F",
      "contacto": "5551234567",
      "direccion": "Calle Reforma 123, CDMX",
      "edad": 35,
      "fecha_registro": "2026-02-16 17:45:00",
      "fecha_actualizacion": "2026-02-16 17:45:00"
    }
  ]
}
```

---

### POST `/api/pacientes/`
Registrar un nuevo paciente.

**Permisos**: Autenticado  
**Request Body**:
```json
{
  "nombre": "María Fernández",
  "fecha_nacimiento": "1990-05-15",
  "sexo": "F",
  "contacto": "5551234567",
  "direccion": "Calle Reforma 123, CDMX"
}
```

**Response 201**: Objeto del paciente creado.

---

### GET `/api/pacientes/<id>/`
Obtener detalle de un paciente específico.

**Permisos**: Autenticado (solo pacientes propios)

---

### PUT `/api/pacientes/<id>/`
Actualizar todos los campos de un paciente.

### PATCH `/api/pacientes/<id>/`
Actualizar campos parciales de un paciente.

### DELETE `/api/pacientes/<id>/`
Eliminar un paciente.

---

## 📋 Módulo de Historial Clínico (`/api/historial/`)

### GET `/api/historial/`
Listar historiales clínicos del médico autenticado.

**Permisos**: Autenticado  
**Response 200**: Lista de historiales con eventos anidados.

---

### POST `/api/historial/`
Crear un nuevo historial clínico para un paciente.

**Permisos**: Autenticado  
**Request Body**:
```json
{
  "paciente": 1,
  "observaciones_generales": "Paciente con historial de hipertensión familiar",
  "alergias": "Penicilina, Aspirina",
  "antecedentes": "Diabetes tipo 2 diagnosticada en 2020"
}
```

---

### GET `/api/historial/<id>/`
Detalle del historial con todos los eventos clínicos.

**Response 200**:
```json
{
  "id": 1,
  "paciente": 1,
  "paciente_nombre": "María Fernández",
  "fecha_apertura": "2026-02-16 17:50:00",
  "observaciones_generales": "Paciente con historial de hipertensión familiar",
  "alergias": "Penicilina, Aspirina",
  "antecedentes": "Diabetes tipo 2 diagnosticada en 2020",
  "eventos": [
    {
      "id": 1,
      "tipo": "consulta",
      "descripcion": "Consulta general por dolor abdominal",
      "sintomas": "Dolor abdominal, náuseas, fiebre leve",
      "diagnostico": "Gastritis aguda",
      "tratamiento": "Omeprazol 20mg cada 12 horas por 7 días",
      "notas": "Cita de seguimiento en 2 semanas",
      "fecha": "2026-02-16 18:00:00"
    }
  ]
}
```

---

### GET `/api/historial/<id>/pdf/`
Descargar el historial clínico en formato PDF.

**Permisos**: Autenticado  
**Response**: Archivo PDF (`application/pdf`)

---

### Eventos Clínicos (anidados)

#### POST `/api/historial/<id>/eventos/`
Agregar un evento clínico al historial.

**Request Body**:
```json
{
  "tipo": "consulta",
  "descripcion": "Consulta general por dolor abdominal",
  "sintomas": "Dolor abdominal, náuseas, fiebre leve",
  "diagnostico": "Gastritis aguda",
  "tratamiento": "Omeprazol 20mg cada 12 horas por 7 días",
  "notas": "Cita de seguimiento en 2 semanas"
}
```

**Tipos disponibles**: `consulta`, `diagnostico`, `tratamiento`, `seguimiento`, `emergencia`

#### GET `/api/historial/<id>/eventos/`
Listar eventos de un historial.

#### PUT/PATCH/DELETE `/api/historial/<id>/eventos/<evento_id>/`
Actualizar o eliminar un evento específico.

---

## 🤖 Módulo de Diagnóstico IA (`/api/diagnostico/`)

### POST `/api/diagnostico/predecir/`
Enviar síntomas y obtener diagnóstico asistido por IA.

**Permisos**: Autenticado  
**Request Body**:
```json
{
  "paciente_id": 1,
  "sintomas": [
    "fiebre",
    "dolor de cabeza",
    "fatiga",
    "nauseas"
  ]
}
```

**Response 201**:
```json
{
  "mensaje": "Diagnóstico realizado exitosamente",
  "resultado": {
    "id": 1,
    "paciente": 1,
    "paciente_nombre": "María Fernández",
    "sintomas_ingresados": ["fiebre", "dolor de cabeza", "fatiga", "nauseas"],
    "diagnostico_predicho": "Gripe",
    "confianza": 87.5,
    "top_predicciones": [
      { "diagnostico": "Gripe", "confianza": 87.5 },
      { "diagnostico": "Dengue", "confianza": 8.2 },
      { "diagnostico": "Tifoidea", "confianza": 2.1 }
    ],
    "estado": "pendiente",
    "notas_medico": "",
    "fecha": "2026-02-16 18:15:00"
  }
}
```

**Response 503** (modelo no disponible):
```json
{
  "error": "Modelo no disponible. Contacte al administrador."
}
```

---

### GET `/api/diagnostico/sintomas/`
Obtener la lista de síntomas que el modelo reconoce.

**Permisos**: Autenticado  
**Response 200**:
```json
{
  "total": 132,
  "sintomas": [
    "Acidez Estomacal",
    "Ansiedad",
    "Articulaciones Rígidas",
    "Calambres",
    "..."
  ]
}
```

---

### GET `/api/diagnostico/historial/`
Listar todos los diagnósticos IA realizados.

**Permisos**: Autenticado  
**Response 200**: Lista paginada de resultados IA.

---

### GET `/api/diagnostico/<id>/`
Detalle de un resultado de diagnóstico.

---

### PATCH `/api/diagnostico/<id>/estado/`
Aceptar o rechazar un resultado del diagnóstico IA.

**Permisos**: Autenticado  
**Request Body**:
```json
{
  "estado": "aceptado",
  "notas_medico": "Diagnóstico confirmado, se inicia tratamiento antiviral."
}
```

**Estados disponibles**: `pendiente`, `aceptado`, `rechazado`

---

## 📊 Auditoría (`/api/auditoria/`)

### GET `/api/auditoria/accesos/`
Listar registros de acceso al sistema.

**Permisos**: Admin  
**Response 200**:
```json
{
  "results": [
    {
      "id": 1,
      "usuario": 1,
      "usuario_nombre": "Dr. García López",
      "tipo_operacion": "login",
      "fecha": "2026-02-16 17:30:00",
      "direccion_ip": "192.168.1.100",
      "detalle": "Inicio de sesión exitoso"
    }
  ]
}
```

**Tipos de operación**: `login`, `logout`, `consulta`, `registro`, `diagnostico`

---

## Códigos de Estado HTTP

| Código | Significado |
|--------|------------|
| `200` | Operación exitosa |
| `201` | Recurso creado |
| `400` | Error de validación |
| `401` | No autenticado |
| `403` | Sin permisos |
| `404` | No encontrado |
| `503` | Servicio no disponible (modelo IA) |
