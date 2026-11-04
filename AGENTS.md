# AGENTS.md — MiBolsillo

Este documento establece las instrucciones y convenciones que deben respetar los agentes de inteligencia artificial durante el desarrollo de MiBolsillo.

Su objetivo es mantener la coherencia del proyecto, evitar modificaciones innecesarias y garantizar que las funcionalidades implementadas respeten las especificaciones establecidas.

# 1. Documentación obligatoria

Antes de realizar cualquier modificación, el agente debe consultar:

- `README.md`: descripción general del proyecto.
- `SPEC.md`: reglas de negocio y requisitos funcionales y no funcionales.
- `PLAN.md`: etapas y tareas del desarrollo.
- `AGENTS.md`: instrucciones y convenciones de trabajo.

La especificación (`SPEC.md`) es la referencia principal para determinar el comportamiento esperado de la aplicación.

No se deben implementar funcionalidades que contradigan sus reglas de negocio.

# 2. Tecnologías del proyecto

Se utilizarán las siguientes tecnologías:

## Frontend
- React.
- Vite.
- JavaScript.

## Backend
- Node.js.
- Express.
- JavaScript.

## Base de datos
- PostgreSQL.

## Infraestructura
- Netlify para el frontend.
- Render para el backend.
- Neon para la base de datos.

No se deben incorporar tecnologías o dependencias adicionales sin una justificación concreta.

Se debe priorizar el uso de las herramientas y dependencias que ya existan en el proyecto.

# 3. Organización del proyecto

Se deberá mantener una separación clara entre frontend y backend.

La estructura general prevista es:

```text
MiBolsillo/
│
├── frontend/
│   ├── src/
│   └── package.json
│
├── backend/
│   ├── src/
│   └── package.json
│
├── tests/
│
├── README.md
├── SPEC.md
├── PLAN.md
├── AGENTS.md
├── INFORME_PRUEBAS.md
├── .gitignore
└── .env.example
```

Esta estructura es orientativa. Podrá ajustarse durante la preparación del proyecto, siempre manteniendo una organización clara y consistente.

# 4. Reglas generales de desarrollo

- Mantener el código simple, legible y fácil de mantener.
- Evitar duplicaciones innecesarias.
- Utilizar nombres descriptivos para variables, funciones y archivos.
- Respetar la organización y convenciones existentes.
- Separar las responsabilidades de los distintos componentes.
- Evitar incorporar mecanismos o abstracciones que no aporten una utilidad real.
- No modificar funcionalidades que no estén relacionadas con la tarea asignada.
- No introducir cambios que contradigan la especificación del proyecto.
- No eliminar código existente sin justificar su necesidad.

# 5. Reglas de negocio

Todas las funcionalidades deben respetar las reglas definidas en `SPEC.md`.

Se debe prestar especial atención a los siguientes aspectos:

## Usuarios
- Cada usuario debe acceder exclusivamente a su propia información.
- Las operaciones sobre recursos privados deben verificar la identidad y autorización del usuario.
- Las contraseñas nunca deben almacenarse en texto plano.

## Movimientos
- Todo movimiento debe pertenecer a un usuario.
- Los movimientos deben clasificarse como ingresos o gastos.
- Los importes deben ser mayores que cero.
- Las categorías deben corresponder al tipo de movimiento.
- Las operaciones de modificación y eliminación deben respetar la propiedad del recurso.

## Categorías
- Debe existir una separación entre categorías de ingresos y gastos.
- Las categorías predefinidas no deben poder modificarse ni eliminarse por los usuarios.
- Las categorías personalizadas deben pertenecer a su usuario.
- No se deben eliminar categorías que tengan movimientos o presupuestos asociados.

## Presupuestos
- Los presupuestos corresponden a categorías de gastos.
- Debe existir un único presupuesto por categoría, usuario y período mensual.
- El consumo se calcula a partir de los gastos registrados durante el período correspondiente.
- Superar un presupuesto no debe impedir registrar nuevos gastos.

## Cálculos financieros
- Los ingresos y gastos deben calcularse utilizando los movimientos correspondientes al período consultado.
- El balance se obtiene restando los gastos de los ingresos.
- Los indicadores deben actualizarse cuando se registren, modifiquen o eliminen movimientos.
- Todos los importes se expresan en pesos argentinos (ARS).

# 6. Seguridad y protección de datos

- Nunca incluir contraseñas, tokens, claves API o credenciales dentro del código fuente.
- No subir archivos `.env` al repositorio.
- Mantener las variables sensibles en el entorno de ejecución.
- Actualizar `.env.example` cuando se incorporen nuevas variables de entorno, utilizando únicamente valores de ejemplo.
- Utilizar consultas SQL parametrizadas para evitar inyecciones SQL.
- Validar la identidad y los permisos en el backend.
- No confiar exclusivamente en las validaciones realizadas desde el frontend.
- No exponer información sensible en mensajes de error o registros del servidor.
- No permitir que un usuario consulte, modifique o elimine información perteneciente a otra cuenta.

# 7. Validaciones y manejo de errores

Toda información recibida desde el frontend debe validarse en el backend.

Se deben contemplar:

- Campos obligatorios.
- Tipos de datos.
- Importes inválidos.
- Fechas incorrectas.
- Categorías inexistentes o incompatibles.
- Recursos que no pertenecen al usuario.
- Operaciones duplicadas.
- Errores de conexión con la base de datos.

Los errores deben manejarse de forma controlada y proporcionar respuestas comprensibles, sin revelar detalles internos del servidor.

# 8. Base de datos

- Utilizar PostgreSQL como motor de base de datos.
- Mantener relaciones coherentes entre usuarios, movimientos, categorías y presupuestos.
- Establecer restricciones de integridad cuando corresponda.
- Utilizar tipos numéricos adecuados para los importes monetarios, evitando errores de precisión.
- Evitar duplicaciones innecesarias de información.
- No eliminar registros relacionados sin verificar previamente las reglas de negocio.
- Mantener las consultas organizadas y utilizar parámetros para los datos recibidos.

# 9. Pruebas

Toda funcionalidad nueva o modificada debe contar con las pruebas correspondientes.

Se deberán contemplar:

- Pruebas unitarias para la lógica de negocio.
- Pruebas de integración para las operaciones del backend.
- Pruebas de validación de datos.
- Pruebas de autorización y separación de usuarios.
- Pruebas de los cálculos financieros.
- Pruebas de los presupuestos y sus advertencias.

Los tests deben comprobar el comportamiento real esperado.

No se deben modificar o eliminar pruebas únicamente para conseguir que pasen.

Antes de finalizar una tarea, se deben ejecutar las pruebas relacionadas y corregir los errores detectados.

# 10. Metodología de trabajo y tareas

El desarrollo se organizará mediante las tareas identificadas en `PLAN.md`.

Para cada tarea, el agente deberá:

1. Leer la descripción y el objetivo de la tarea.
2. Consultar las reglas de negocio y requisitos relacionados.
3. Revisar el código existente antes de modificarlo.
4. Implementar únicamente lo necesario para cumplir el objetivo.
5. Ejecutar las pruebas correspondientes.
6. Verificar que no se hayan generado errores o regresiones.
7. Informar los archivos modificados y los resultados obtenidos.
8. Preparar un commit individual para la tarea.

No se deben marcar tareas como completadas si todavía no cumplen sus criterios de finalización.

Si una tarea presenta dependencias, contradicciones o requiere modificar la especificación, se debe informar antes de avanzar con cambios que alteren el alcance definido.

# 11. Control de versiones

Se utilizará Git y GitHub para el control de versiones.

Convenciones:

- Realizar un commit por cada tarea completada.
- Utilizar mensajes descriptivos.
- No agrupar tareas independientes en un mismo commit.
- No incluir archivos innecesarios o temporales.
- No realizar commits que contengan secretos.
- No modificar el historial existente sin una justificación y autorización.

Formato recomendado para los mensajes:

```text
tipo: descripción breve del cambio
```

Tipos recomendados:

- `feat`: nueva funcionalidad.
- `fix`: corrección de errores.
- `docs`: documentación.
- `test`: pruebas.
- `refactor`: reorganización o mejora interna del código.
- `chore`: tareas de mantenimiento y configuración.

Ejemplos:

```text
feat: implementa registro de usuarios
feat: agrega gestión de movimientos
fix: corrige cálculo del balance mensual
test: agrega pruebas para presupuestos
docs: actualiza documentación del proyecto
```

# 12. Documentación

Cuando una modificación afecte el comportamiento o la organización del proyecto, se deberá evaluar si corresponde actualizar la documentación.

En particular:

- Actualizar `SPEC.md` cuando se aprueben cambios en las reglas de negocio o requisitos.
- Actualizar `PLAN.md` cuando se modifiquen las tareas o etapas.
- Actualizar `README.md` cuando cambien las instrucciones de instalación, tecnologías o información general.
- Actualizar `INFORME_PRUEBAS.md` con los resultados de las pruebas realizadas.

La documentación debe mantenerse coherente con el estado real del proyecto.

# 13. Criterio general

La prioridad durante el desarrollo de MiBolsillo es construir una aplicación funcional, segura y coherente con los requisitos establecidos.

Se debe priorizar la simplicidad, la claridad y el cumplimiento de las reglas de negocio por encima de la incorporación de funcionalidades innecesarias o soluciones excesivamente complejas.

Ante cualquier duda sobre el comportamiento esperado, se debe consultar la documentación existente y comunicar las inconsistencias antes de asumir decisiones que puedan modificar el alcance del proyecto.

---

**Fin de las instrucciones para agentes de MiBolsillo.**
