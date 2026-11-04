# AGENTS.md — MiBolsillo

Instrucciones obligatorias para agentes de IA que trabajen en el repositorio.

## 1. Documentación de referencia

Antes de modificar el proyecto, consultar:

- `SPEC.md`: reglas de negocio y requisitos.
- `PLAN.md`: tareas y estado del trabajo.
- `README.md`: instalación, ejecución y publicación.
- `INFORME_PRUEBAS.md`: verificaciones realizadas y pendientes.

`SPEC.md` es la fuente de verdad funcional. Ante una contradicción, no inventar reglas: informar la diferencia y actualizar la especificación cuando el cambio esté aprobado.

## 2. Tecnologías

- Frontend: React, Vite y JavaScript.
- Backend: Node.js, Express y JavaScript ES modules.
- Base de datos: PostgreSQL mediante `pg`.
- Persistencia: Neon en el entorno online.
- Hosting previsto: Netlify (frontend) y Render (backend).

No incorporar dependencias nuevas sin una necesidad concreta. El backend utiliza módulos nativos de Node.js para hash de contraseñas y firma de sesiones.

## 3. Estructura actual

```text
MiBolsillo/
├── frontend/
│   ├── src/
│   │   ├── lib/api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── .env.example
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── db/schema.sql
│   │   ├── middleware/auth.js
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── database.js
│   │   └── server.js
│   ├── tests/
│   ├── .env.example
│   └── package.json
├── README.md
├── SPEC.md
├── PLAN.md
├── AGENTS.md
├── INFORME_PRUEBAS.md
├── render.yaml
└── netlify.toml
```

## 4. Reglas de desarrollo

- Mantener el código legible, simple y coherente con la estructura existente.
- No modificar funcionalidades ajenas a la tarea.
- Evitar duplicaciones, abstracciones innecesarias y dependencias sin justificación.
- Usar consultas SQL parametrizadas.
- Validar en el backend todos los datos recibidos desde el frontend.
- No confiar en identificadores de usuario enviados por el cliente: tomar siempre el usuario desde el token autenticado.
- Mantener ARS como única moneda del MVP.

## 5. Seguridad

- Las contraseñas se guardan mediante scrypt; nunca en texto plano.
- Las rutas privadas requieren `Authorization: Bearer <token>`.
- Los tokens se firman con `JWT_SECRET` y tienen vencimiento.
- En producción `JWT_SECRET` debe ser una clave aleatoria propia de al menos 32 caracteres.
- Nunca subir `.env`, contraseñas, tokens ni cadenas de conexión.
- Mantener `backend/.env.example` y `frontend/.env.example` sin secretos.
- Todos los movimientos, categorías personalizadas y presupuestos deben filtrarse por el usuario autenticado.
- Las categorías predefinidas son globales y no editables por usuarios.
- No eliminar categorías que estén asociadas a movimientos o presupuestos.

## 6. Base de datos

- El esquema se define en `backend/src/db/schema.sql`.
- `initializeDatabase()` crea las tablas e inserta las categorías predefinidas al iniciar el backend.
- Utilizar `NUMERIC(12,2)` para importes persistidos.
- Las relaciones deben conservar integridad referencial.
- No introducir operaciones destructivas ni eliminar datos existentes durante una migración.

## 7. Pruebas

Antes de cerrar cambios:

- Backend: ejecutar `npm test` desde `backend/`.
- Frontend: ejecutar `npm run lint` y `npm run build` desde `frontend/`.
- Para cambios con PostgreSQL, probar también el flujo con una base de datos accesible.
- No marcar pruebas de integración como ejecutadas si no se realizaron realmente.
- No modificar tests únicamente para ocultar fallos.

## 8. Tareas y Git

- Seguir las tareas numeradas de `PLAN.md`.
- Realizar un commit por cada tarea completada.
- No agrupar tareas independientes en un único commit.
- Marcar `[x]` únicamente después de cumplir el criterio de finalización.
- Mensajes sugeridos: `feat`, `fix`, `docs`, `test`, `refactor` y `chore`.
- No modificar el historial existente ni hacer push forzado.

## 9. Criterio general

Priorizar una aplicación funcional, segura, fácil de explicar y coherente con la especificación. Si una regla no está clara, comunicarlo antes de asumir un comportamiento que cambie el alcance.
