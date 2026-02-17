# 🤝 Guía de Contribución — ZAIRE Healthcare

## Equipo de Trabajo

| Integrante | Rol | Área |
|-----------|-----|------|
| Andrea Robles Hernández | Backend / IA | Endpoints, IA, conectividad |
| Juan Pablo González Arauz | Frontend Mobile | React Native, consumo API |
| Itzel Galván Contreras | UX/UI | Diseño móvil |
| Jerónimo Israel Macías Quintero | Documentador / RRHH | Documentación y gestión |

---

## Flujo de Trabajo con Git

### Ramas

| Rama | Propósito |
|------|-----------|
| `main` | Código estable, listo para producción |
| `develop` | Integración de features antes de pasar a main |
| `feature/<nombre>` | Desarrollo de una nueva funcionalidad |
| `fix/<nombre>` | Corrección de bugs |
| `docs/<nombre>` | Cambios en documentación |

### Flujo para Agregar una Funcionalidad

```bash
# 1. Actualizar la rama principal
git checkout main
git pull origin main

# 2. Crear rama de feature
git checkout -b feature/nombre-descriptivo

# 3. Hacer cambios y commits descriptivos
git add .
git commit -m "feat: descripción breve del cambio"

# 4. Subir la rama
git push origin feature/nombre-descriptivo

# 5. Crear Pull Request en GitHub
# Descripción clara + capturas si aplica

# 6. Después del merge, eliminar la rama
git branch -d feature/nombre-descriptivo
```

---

## Convención de Commits

Usamos el estándar **Conventional Commits**:

| Prefijo | Uso | Ejemplo |
|---------|-----|---------|
| `feat:` | Nueva funcionalidad | `feat: agregar endpoint de diagnóstico IA` |
| `fix:` | Corrección de bug | `fix: corregir validación de contraseña` |
| `docs:` | Cambios en documentación | `docs: actualizar guía de instalación` |
| `style:` | Formato, sin cambio de lógica | `style: formatear código con black` |
| `refactor:` | Reestructuración sin cambiar funcionalidad | `refactor: separar servicio IA en clase` |
| `test:` | Agregar o modificar tests | `test: agregar tests para el módulo pacientes` |
| `chore:` | Tareas de mantenimiento | `chore: actualizar dependencias` |

---

## Configuración del Entorno de Desarrollo

### Prerrequisitos
- Python 3.12+
- Node.js 20+
- SQL Server Express 2022 (ver [BASE-DE-DATOS.md](BASE-DE-DATOS.md))
- Git
- VS Code (recomendado)

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
copy .env.example .env         # Configurar variables
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npx expo start
```

---

## Extensiones de VS Code Recomendadas

| Extensión | Para qué |
|-----------|---------|
| Python | Soporte completo de Python |
| Pylance | IntelliSense avanzado |
| Django | Sintaxis y snippets Django |
| ES7+ React/Redux/React-Native | Snippets de React Native |
| Prettier | Formato de código JS |
| GitLens | Historial de git visual |
| Thunder Client | Probar API (alternativa a Postman) |

---

## Estructura de Pull Request

```markdown
## Descripción
Breve descripción de los cambios realizados.

## Tipo de cambio
- [ ] Nueva funcionalidad (feature)
- [ ] Corrección de bug (fix)
- [ ] Documentación (docs)
- [ ] Refactorización (refactor)

## Cambios realizados
- Cambio 1
- Cambio 2

## Capturas de pantalla (si aplica)

## Checklist
- [ ] Mi código sigue las convenciones del proyecto
- [ ] He probado mis cambios localmente
- [ ] He actualizado la documentación si es necesario
```

---

## Reglas del Proyecto

1. **No hacer push directo a `main`** — siempre usar Pull Request
2. **Commits claros y descriptivos** — usar Conventional Commits
3. **Código en español** — variables, comentarios y documentación en español
4. **Un PR por funcionalidad** — no mezclar cambios no relacionados
5. **Probar antes de subir** — verificar que el servidor inicia sin errores
