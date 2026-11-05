# MiBolsillo

**Gestor de gastos personales**

MiBolsillo es una aplicación web para organizar ingresos y gastos personales, administrar categorías, definir presupuestos mensuales y consultar estadísticas financieras. Cada cuenta mantiene su propia información y los importes se expresan en pesos argentinos (ARS).

Proyecto desarrollado como Trabajo Práctico Final de Generación T.

## 🚀 Proyecto desplegado

- **Aplicación web (Netlify):** https://julinza2007-mibolsillo.netlify.app
- **Backend API (Render):** https://mibolsillo-api-j597.onrender.com
- **Estado del backend:** https://mibolsillo-api-j597.onrender.com/api/health
- **Base de datos:** PostgreSQL alojada en [Neon](https://neon.tech/).

## Funcionalidades

- Registro, inicio y cierre de sesión.
- Contraseñas protegidas mediante scrypt y sesiones firmadas con JWT.
- Registro, consulta, edición y eliminación de ingresos y gastos.
- Filtros de movimientos por texto, tipo, categoría y mes.
- Categorías predefinidas y categorías personalizadas editables.
- Presupuestos mensuales por categoría de gasto, con seguimiento y advertencias al alcanzar o superar el límite.
- Dashboard con balance, ingresos, gastos, últimos movimientos y presupuestos.
- Estadísticas con evolución de los últimos seis meses y distribución de gastos.
- Separación de datos por usuario y validaciones en el backend.

## Tecnologías

| Componente | Tecnología |
|---|---|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Base de datos | PostgreSQL |
| Proveedor de base de datos | Neon |
| Frontend publicado | Netlify |
| Backend publicado | Render |
| Control de versiones | Git + GitHub |

## Requisitos

- Node.js 22.12 o superior.
- npm.
- Una base de datos PostgreSQL. Para producción se utiliza Neon.

## Configuración local

### 1. Backend

Desde la raíz del repositorio:

```bash
cd backend
npm install
cp .env.example .env
```

Editá `backend/.env` y completá `DATABASE_URL` con la cadena de conexión de PostgreSQL/Neon. `PORT` puede mantenerse en `3000`. Para desarrollo local, si no definís `JWT_SECRET`, la aplicación utiliza una clave de desarrollo; **en producción es obligatorio definir una clave propia de al menos 32 caracteres**.

Podés generar una clave con:

```bash
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
```

Iniciá el backend:

```bash
npm run dev
```

Al iniciar, el backend crea las tablas necesarias y carga las categorías predefinidas si todavía no existen. La comprobación de conexión queda disponible en `http://localhost:3000/api/health`.

### 2. Frontend

Abrí otra terminal desde la raíz:

```bash
cd frontend
npm install
cp .env.example .env
```

El archivo `frontend/.env` utiliza por defecto `VITE_API_URL=http://localhost:3000/api`. Iniciá la interfaz:

```bash
npm run dev
```

Abrí la dirección que informa Vite, normalmente `http://localhost:5173`.

### 3. Primer uso

Registrá una cuenta desde la pantalla inicial. Después podés cargar ingresos y gastos, crear categorías y configurar presupuestos. Los datos se guardan en PostgreSQL.

## Pruebas y calidad

Backend:

```bash
cd backend
npm test
```

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

Las pruebas automatizadas del backend cubren validaciones, períodos mensuales, hash de contraseñas y firma/verificación de sesiones. La conexión real con la base requiere acceso de red a Neon.

## API principal

Todas las rutas, salvo registro, inicio de sesión y health check, requieren `Authorization: Bearer <token>`.

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Estado de la API y PostgreSQL |
| POST | `/api/auth/register` | Crear una cuenta |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/categories` | Listar categorías disponibles |
| POST / PUT / DELETE | `/api/categories` | Administrar categorías personalizadas |
| GET / POST | `/api/transactions` | Consultar y registrar movimientos |
| PUT / DELETE | `/api/transactions/:id` | Editar y eliminar movimientos |
| GET / POST | `/api/budgets` | Consultar y crear presupuestos |
| PUT / DELETE | `/api/budgets/:id` | Editar y eliminar presupuestos |
| GET | `/api/dashboard` | Indicadores, evolución y resumen financiero |

## Publicación

### Neon

1. Crear un proyecto PostgreSQL en Neon.
2. Copiar la cadena de conexión y configurarla como `DATABASE_URL` en Render.
3. El esquema se inicializa automáticamente al iniciar el backend.

### Render

El archivo `render.yaml` define el servicio `mibolsillo-api`. Al crear el servicio desde el repositorio, configurar:

- `DATABASE_URL`: cadena de conexión de Neon.
- `JWT_SECRET`: una clave aleatoria de al menos 32 caracteres (Render puede generarla).
- `FRONTEND_URL`: URL pública del sitio Netlify, sin barra final.
- `NODE_ENV`: `production`.

La comprobación de salud es `/api/health`.

### Netlify

El archivo `netlify.toml` configura `frontend` como directorio base, `npm run build` como comando de compilación y `dist` como directorio publicado. Configurar la variable `VITE_API_URL` con la URL pública del backend más `/api`, por ejemplo `https://tu-api.onrender.com/api`.

Después de conocer el dominio de Netlify, actualizar `FRONTEND_URL` en Render para habilitar CORS desde ese origen.

## Variables de entorno y seguridad

- No subir `backend/.env`, `frontend/.env` ni credenciales al repositorio.
- Los archivos `.env.example` son plantillas sin secretos.
- No compartir la cadena `DATABASE_URL`.
- En producción usar una clave `JWT_SECRET` propia, larga y aleatoria.
- Los tokens se transmiten mediante `Authorization: Bearer`.

## Documentación del proyecto

- `SPEC.md`: reglas de negocio y requisitos.
- `PLAN.md`: etapas, tareas y estado del desarrollo.
- `AGENTS.md`: instrucciones para agentes de IA.
- `INFORME_PRUEBAS.md`: pruebas ejecutadas y limitaciones conocidas.

## Estado

El MVP está implementado en el código fuente. La publicación en Render y Netlify y la verificación en línea final deben completarse con las cuentas y variables de entorno del propietario del proyecto.

---

*MiBolsillo — Una forma más organizada de administrar tus finanzas personales.*
