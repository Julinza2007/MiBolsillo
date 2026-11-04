# PLAN.md — MiBolsillo

**Versión:** 1.0  
**Estado:** MVP implementado; pruebas de integración y publicación pendientes.

# 1. Objetivo

Organizar el desarrollo de MiBolsillo en tareas concretas, con criterios verificables y un commit individual por tarea.

# 2. Metodología de trabajo

Cada tarea debe tener un objetivo concreto, cumplir los requisitos de `SPEC.md`, contar con verificaciones adecuadas y finalizar con un commit descriptivo. Una tarea no se marcará como terminada si no cumple su criterio de finalización.

# 3. Etapas del proyecto

## Etapa 1 — Documentación y planificación

- [x] T-001: Crear README.md inicial.
- [x] T-002: Crear SPEC.md inicial.
- [x] T-003: Revisar y cerrar las reglas de negocio del MVP.
- [x] T-004: Crear AGENTS.md con las instrucciones para los agentes de IA.
- [x] T-005: Completar la planificación inicial.

## Etapa 2 — Preparación del entorno

- [x] T-006: Definir la estructura general del repositorio.
- [x] T-007: Inicializar el frontend con React y Vite.
- [x] T-008: Inicializar el backend con Node.js y Express.
- [x] T-009: Configurar las variables de entorno y los archivos de ejemplo.
- [x] T-010: Configurar la conexión con PostgreSQL/Neon.

## Etapa 3 — Backend y base de datos

- [x] T-011: Preparar las pruebas automatizadas y las validaciones del backend.
- [x] T-012: Diseñar el modelo relacional e inicializar el esquema PostgreSQL.
- [x] T-013: Implementar registro, inicio de sesión, hash de contraseñas y protección de rutas.
- [x] T-014: Implementar la consulta y gestión de categorías predefinidas y personalizadas.
- [x] T-015: Implementar el CRUD de movimientos y sus filtros.
- [x] T-016: Implementar presupuestos mensuales, consumo y advertencias.
- [x] T-017: Implementar indicadores del dashboard y estadísticas financieras.
- [x] T-018: Integrar los módulos en la API e inicializar la base al iniciar el servidor.

## Etapa 4 — Frontend e integración

- [x] T-019: Implementar la interfaz completa y responsive: autenticación, dashboard, movimientos, categorías, presupuestos y estadísticas, conectada con la API.

## Etapa 5 — Documentación y validación

- [x] T-020: Actualizar SPEC, PLAN, AGENTS, README, informe de pruebas y configuración de despliegue.
- [ ] T-021: Ejecutar pruebas funcionales completas de las reglas de negocio contra Neon.
- [ ] T-022: Ejecutar pruebas de integración completas entre frontend, backend y PostgreSQL.

## Etapa 6 — Publicación

- [x] T-023: Crear la base de datos online en Neon.
- [ ] T-024: Publicar el backend en Render.
- [ ] T-025: Publicar el frontend en Netlify.
- [ ] T-026: Configurar las URLs y variables de entorno entre los servicios publicados.
- [ ] T-027: Verificar el funcionamiento completo mediante los enlaces públicos.

# 4. Criterios generales de finalización

Una tarea podrá marcarse como completada cuando:

1. Se haya implementado lo solicitado.
2. Se haya verificado su funcionamiento en el alcance correspondiente.
3. Se hayan ejecutado las pruebas disponibles.
4. Se haya realizado su commit individual.

# 5. Estado de entrega

El MVP está implementado en el código fuente. La validación integral contra Neon y la publicación en Render y Netlify todavía requieren ejecutarse con acceso a los servicios y sus variables de entorno.

---

**Fin del plan de desarrollo de MiBolsillo.**
