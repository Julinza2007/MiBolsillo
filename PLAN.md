# PLAN.md — MiBolsillo

**Versión:** 0.1  
**Estado:** Planificación inicial

# 1. Objetivo

Organizar el desarrollo de MiBolsillo en etapas y tareas concretas, permitiendo realizar un seguimiento del progreso y verificar el cumplimiento de los requisitos establecidos en `SPEC.md`.

# 2. Metodología de trabajo

El desarrollo se organizará mediante tareas identificadas individualmente.

Cada tarea deberá:

- Tener un identificador único.
- Tener un objetivo concreto.
- Contar con un criterio de finalización verificable.
- Ser implementada y probada antes de marcarse como terminada.
- Contar con un commit individual en Git.

Las tareas se marcarán como completadas únicamente cuando se haya verificado su cumplimiento.

# 3. Etapas del proyecto

## Etapa 1 — Documentación y planificación

- [x] T-001: Crear README.md inicial.
- [x] T-002: Crear SPEC.md inicial.
- [ ] T-003: Revisar y cerrar las reglas de negocio.
- [x] T-004: Crear AGENTS.md con las instrucciones para los agentes de IA.  
- [ ] T-005: Completar la planificación del proyecto.

## Etapa 2 — Preparación del entorno

- [x] T-006: Definir la estructura general del repositorio.
- [x] T-007: Inicializar el proyecto frontend con React y Vite.
- [x] T-008: Inicializar el proyecto backend con Node.js y Express.
- [ ] T-009: Configurar las variables de entorno y el archivo .env.example.
- [ ] T-010: Configurar la conexión con PostgreSQL.
- [ ] T-011: Preparar la estructura inicial de pruebas.

## Etapa 3 — Base de datos y backend

- [ ] T-012: Diseñar e implementar el modelo de datos.
- [ ] T-013: Implementar el registro de usuarios.
- [ ] T-014: Implementar el inicio y cierre de sesión.
- [ ] T-015: Implementar la protección de rutas y recursos privados.
- [ ] T-016: Implementar la consulta de categorías predefinidas.
- [ ] T-017: Implementar la gestión de categorías personalizadas.
- [ ] T-018: Implementar el registro y consulta de movimientos.
- [ ] T-019: Implementar la modificación y eliminación de movimientos.
- [ ] T-020: Implementar los filtros de movimientos.
- [ ] T-021: Implementar la creación y administración de presupuestos.
- [ ] T-022: Implementar el cálculo del consumo y las advertencias de presupuestos.
- [ ] T-023: Implementar los cálculos e indicadores financieros.
- [ ] T-024: Implementar las pruebas automatizadas del backend.

## Etapa 4 — Desarrollo del frontend

- [ ] T-025: Implementar la estructura general de navegación.
- [ ] T-026: Desarrollar las pantallas de registro e inicio de sesión.
- [ ] T-027: Desarrollar el panel principal.
- [ ] T-028: Desarrollar la gestión de movimientos.
- [ ] T-029: Desarrollar la gestión de categorías.
- [ ] T-030: Desarrollar la gestión de presupuestos.
- [ ] T-031: Desarrollar las estadísticas y gráficos.
- [ ] T-032: Implementar validaciones y mensajes de error.
- [ ] T-033: Adaptar la interfaz a dispositivos móviles.

## Etapa 5 — Integración y validación

- [ ] T-034: Integrar completamente el frontend con el backend.
- [ ] T-035: Verificar las reglas de negocio mediante pruebas.
- [ ] T-036: Realizar pruebas de integración.
- [ ] T-037: Corregir los errores detectados.
- [ ] T-038: Elaborar el informe de pruebas.

## Etapa 6 — Publicación

- [ ] T-039: Publicar la base de datos en un servicio online.
- [ ] T-040: Publicar el backend.
- [ ] T-041: Publicar el frontend.
- [ ] T-042: Configurar la comunicación entre los servicios.
- [ ] T-043: Verificar el funcionamiento de la aplicación publicada.
- [ ] T-044: Completar el README con instrucciones de instalación y enlaces públicos.

# 4. Criterios generales de finalización

Una tarea podrá marcarse como completada cuando:

1. Se haya implementado lo solicitado.
2. Se haya verificado su funcionamiento.
3. Se hayan ejecutado las pruebas correspondientes.
4. Se haya realizado su commit individual.

# 5. Control del progreso

El estado de las tareas se actualizará a medida que avance el desarrollo.

Las tareas pendientes no deberán considerarse terminadas hasta cumplir sus respectivos criterios de finalización.

---

**Fin del plan inicial de desarrollo de MiBolsillo.**
