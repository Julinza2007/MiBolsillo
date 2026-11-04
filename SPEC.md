# SPEC.md — MiBolsillo

**Versión:** 1.0  
**Estado:** Especificación del MVP implementado  
**Tipo de proyecto:** Aplicación web de gestión de finanzas personales

---

# 1. Descripción del proyecto

MiBolsillo es una aplicación web destinada a la gestión de finanzas personales. Su objetivo es permitir que los usuarios registren sus ingresos y gastos, organicen sus movimientos mediante categorías y controlen sus gastos a través de presupuestos mensuales.

La aplicación permitirá visualizar información financiera mediante un panel principal con indicadores y gráficos que faciliten el seguimiento de la economía personal.

Cada usuario contará con una cuenta independiente y solamente podrá acceder a sus propios datos.

# 2. Objetivo general

Desarrollar una aplicación web que permita administrar las finanzas personales mediante el registro de ingresos y gastos, la organización de movimientos, la creación de presupuestos mensuales y la visualización de información financiera.

# 3. Alcance del proyecto

## 3.1. Funcionalidades incluidas

- Registro e inicio de sesión de usuarios.
- Gestión de ingresos y gastos.
- Consulta, modificación y eliminación de movimientos.
- Gestión de categorías predefinidas y personalizadas.
- Creación y administración de presupuestos mensuales.
- Advertencias cuando se alcance o supere un presupuesto.
- Panel principal con información financiera.
- Gráficos y estadísticas de ingresos y gastos.
- Filtros para consultar movimientos por fecha, tipo y categoría.
- Separación de los datos pertenecientes a cada usuario.

## 3.2. Funcionalidades fuera del alcance inicial

Para mantener el proyecto dentro de un alcance razonable, inicialmente no se contemplan:

- Integración con cuentas bancarias.
- Importación automática de movimientos bancarios.
- Conversión entre diferentes monedas.
- Transferencias entre cuentas.
- Gestión de inversiones.
- Pagos mediante la aplicación.
- Aplicación móvil nativa.

Estas funcionalidades podrían considerarse para futuras versiones.

# 4. Actores

## 4.1. Usuario registrado

Es la persona que utiliza MiBolsillo para administrar sus finanzas personales.

Puede:
- Iniciar y cerrar sesión.
- Registrar ingresos y gastos.
- Consultar, modificar y eliminar sus movimientos.
- Administrar sus categorías personalizadas.
- Crear y consultar presupuestos.
- Visualizar estadísticas y resúmenes financieros.

## 4.2. Visitante

Es una persona que todavía no inició sesión.

Puede:
- Acceder a la pantalla de inicio de sesión.
- Registrarse en la aplicación.

No puede acceder a las funcionalidades privadas ni consultar información financiera.

# 5. Reglas de negocio

Las siguientes reglas definen el comportamiento obligatorio de la aplicación.

## 5.1. Usuarios y autenticación

**RN-01. Registro de usuarios:** Para utilizar las funcionalidades privadas de MiBolsillo, una persona debe disponer de una cuenta registrada.

**RN-02. Correo electrónico único:** Cada cuenta debe estar asociada a un correo electrónico único. No se permitirá registrar dos cuentas con el mismo correo.

**RN-03. Contraseñas seguras:** Las contraseñas deben almacenarse mediante un mecanismo de hash seguro. Nunca deben guardarse en texto plano.

**RN-04. Inicio de sesión:** Para acceder a su información personal, el usuario debe iniciar sesión utilizando sus credenciales.

**RN-05. Separación de información:** Cada usuario solamente podrá consultar y administrar la información que le pertenece.

## 5.2. Movimientos financieros

**RN-06. Propiedad de los movimientos:** Todo movimiento debe pertenecer a un usuario registrado. Un usuario no puede modificar ni eliminar movimientos de otra persona.

**RN-07. Tipos de movimiento:** Cada movimiento debe clasificarse obligatoriamente como ingreso o gasto.

**RN-08. Importe positivo:** El importe de un movimiento debe ser mayor que cero y admitir como máximo dos posiciones decimales.

**RN-09. Datos obligatorios:** Todo movimiento debe contener:
- Descripción.
- Importe.
- Fecha.
- Tipo de movimiento.
- Categoría.

**RN-10. Correspondencia de categorías:** La categoría seleccionada debe corresponder al tipo de movimiento. Una categoría de ingreso no puede utilizarse para registrar un gasto, ni viceversa.

**RN-11. Administración de movimientos:** El usuario podrá registrar, consultar, modificar y eliminar sus movimientos. Antes de eliminar uno, la aplicación deberá solicitar confirmación.

## 5.3. Categorías

**RN-12. Categorías predefinidas:** La aplicación debe proporcionar categorías iniciales para ingresos y gastos, disponibles para todos los usuarios.

**RN-13. Categorías personalizadas:** El usuario podrá crear sus propias categorías para organizar sus movimientos.

**RN-14. Tipo de categoría:** Cada categoría debe estar clasificada como ingreso o gasto.

**RN-15. Identificación de categorías:** No se permitirá crear categorías personalizadas duplicadas para un mismo usuario y tipo de movimiento.

**RN-16. Eliminación de categorías:** Una categoría que tenga movimientos o presupuestos asociados no podrá eliminarse. La aplicación deberá informar el motivo.

**Categorías predefinidas propuestas**

Gastos:
- Alimentación.
- Transporte.
- Vivienda.
- Servicios.
- Salud.
- Educación.
- Entretenimiento.
- Compras.
- Otros.

Ingresos:
- Sueldo.
- Trabajo independiente.
- Ventas.
- Inversiones.
- Otros.

Las categorías predefinidas no podrán ser modificadas ni eliminadas por los usuarios.

## 5.4. Presupuestos

**RN-17. Presupuestos por categoría:** El usuario podrá establecer presupuestos mensuales asociados a categorías de gastos.

**RN-18. Unicidad del presupuesto:** Un usuario no podrá establecer más de un presupuesto para la misma categoría durante el mismo mes y año.

**RN-19. Importe del presupuesto:** El importe establecido para un presupuesto debe ser mayor que cero y admitir como máximo dos posiciones decimales.

**RN-20. Cálculo del gasto:** El consumo de un presupuesto se calculará sumando los gastos registrados en su categoría durante el mes correspondiente.

**RN-21. Advertencia de presupuesto:** Cuando el gasto acumulado de una categoría alcance o supere el importe del presupuesto, la aplicación deberá mostrar una advertencia al usuario.

**RN-22. Superación del presupuesto:** Alcanzar o superar un presupuesto no impedirá registrar nuevos gastos. La aplicación solamente deberá informar la situación.

**RN-23. Actualización del presupuesto:** El consumo y el estado de un presupuesto deberán actualizarse cuando se registre, modifique o elimine un movimiento relacionado.

## 5.5. Cálculos financieros

**RN-24. Cálculo de ingresos:** El total de ingresos de un período se obtiene sumando los importes de todos los movimientos de tipo ingreso correspondientes a ese período.

**RN-25. Cálculo de gastos:** El total de gastos de un período se obtiene sumando los importes de todos los movimientos de tipo gasto correspondientes a ese período.

**RN-26. Cálculo del balance:** El balance de un período se obtiene mediante la siguiente operación:

Balance = Total de ingresos - Total de gastos.

**RN-27. Actualización de los indicadores:** Los totales y balances deberán actualizarse cuando un movimiento sea registrado, modificado o eliminado.

**RN-28. Separación de cálculos:** Todos los indicadores y estadísticas deben calcularse utilizando exclusivamente los movimientos pertenecientes al usuario que inició sesión.

**RN-29. Moneda:** Todos los importes de la aplicación se expresarán en pesos argentinos (ARS). No se realizarán conversiones monetarias.

**RN-30. Edición de presupuestos:** El usuario podrá modificar el importe y el período de sus presupuestos existentes. La aplicación debe impedir que se creen duplicados para la misma categoría y período.

**RN-31. Eliminación de presupuestos:** El usuario podrá eliminar sus propios presupuestos sin eliminar los movimientos financieros asociados.

**RN-32. Edición de categorías personalizadas:** El usuario podrá cambiar el nombre y el tipo de sus categorías personalizadas. No se permitirá cambiar el tipo si la categoría ya está asociada a movimientos o presupuestos.

**RN-33. Filtros de movimientos:** El historial permitirá filtrar movimientos por descripción, tipo, categoría y mes.

**RN-34. Sesiones:** La sesión se identificará mediante un token firmado con vencimiento. Las rutas privadas requerirán un token válido.

# 6. Requisitos funcionales

Los siguientes requisitos describen las funcionalidades que debe ofrecer el sistema.

| Código | Requisito |
|---|---|
| RF-01 | El sistema debe permitir registrar usuarios. |
| RF-02 | El sistema debe permitir iniciar y cerrar sesión. |
| RF-03 | El sistema debe permitir registrar ingresos y gastos. |
| RF-04 | El sistema debe permitir consultar el historial de movimientos. |
| RF-05 | El sistema debe permitir modificar y eliminar movimientos. |
| RF-06 | El sistema debe permitir filtrar movimientos por fecha, tipo y categoría. |
| RF-07 | El sistema debe permitir consultar categorías predefinidas. |
| RF-08 | El sistema debe permitir crear categorías personalizadas. |
| RF-09 | El sistema debe permitir administrar las categorías personalizadas. |
| RF-10 | El sistema debe permitir crear presupuestos mensuales. |
| RF-11 | El sistema debe permitir consultar el consumo de cada presupuesto. |
| RF-12 | El sistema debe mostrar advertencias al alcanzar o superar un presupuesto. |
| RF-13 | El sistema debe mostrar un panel con ingresos, gastos y balance. |
| RF-14 | El sistema debe mostrar estadísticas y gráficos financieros. |
| RF-15 | El sistema debe permitir consultar información de diferentes períodos. |
| RF-16 | El sistema debe permitir modificar y eliminar presupuestos propios. |
| RF-17 | El sistema debe permitir modificar y eliminar categorías personalizadas, respetando las restricciones de uso. |
| RF-18 | El sistema debe permitir filtrar movimientos por descripción y mes, además de tipo y categoría. |

# 7. Requisitos no funcionales

**RNF-01. Seguridad:** El sistema debe proteger las contraseñas mediante scrypt y controlar el acceso a los recursos privados mediante tokens firmados con vencimiento.

**RNF-02. Integridad:** El sistema debe validar la información recibida antes de almacenarla en la base de datos.

**RNF-03. Persistencia:** Los datos registrados deben permanecer almacenados aunque el usuario cierre sesión o abandone la aplicación.

**RNF-04. Disponibilidad:** La aplicación debe estar publicada en Internet para permitir su utilización sin necesidad de descargar o ejecutar el proyecto localmente.

**RNF-05. Interfaz:** La aplicación debe contar con una interfaz clara, organizada y fácil de utilizar.

**RNF-06. Adaptabilidad:** La interfaz debe poder utilizarse desde computadoras y dispositivos móviles.

**RNF-07. Mantenibilidad:** El código debe estar organizado y documentado para facilitar futuras modificaciones.

**RNF-08. Protección de datos:** El sistema no debe permitir que un usuario acceda a información perteneciente a otra cuenta.

# 8. Pantallas principales

La aplicación deberá contar, como mínimo, con las siguientes pantallas:

1. **Registro:** formulario para crear una cuenta.
2. **Inicio de sesión:** formulario para acceder a una cuenta existente.
3. **Dashboard:** panel principal con indicadores financieros y gráficos.
4. **Movimientos:** listado de ingresos y gastos registrados.
5. **Nuevo movimiento:** formulario para registrar un ingreso o gasto.
6. **Editar movimiento:** formulario para modificar un movimiento existente.
7. **Categorías:** administración de categorías predefinidas y personalizadas.
8. **Presupuestos:** consulta y administración de presupuestos mensuales.
9. **Estadísticas:** visualización de información financiera por períodos.

# 9. Criterios generales de aceptación

Se considerará que el sistema cumple con su objetivo cuando:

- Los usuarios puedan registrarse e iniciar sesión correctamente.
- Los movimientos puedan registrarse, consultarse, modificarse y eliminarse.
- Las validaciones y reglas de negocio se cumplan.
- Las categorías se comporten según su tipo.
- Los presupuestos calculen correctamente los gastos asociados.
- Las advertencias de presupuesto funcionen correctamente.
- Los indicadores financieros reflejen los movimientos registrados.
- Los datos de diferentes usuarios permanezcan separados.
- Las funcionalidades principales puedan utilizarse desde la interfaz.
- El sistema esté publicado y pueda probarse mediante Internet.
- Las pruebas correspondientes se ejecuten correctamente.

# 10. Consideraciones para el desarrollo

- La moneda utilizada será ARS.
- Se utilizará PostgreSQL como motor de base de datos.
- El frontend se desarrollará utilizando React.
- El backend se desarrollará utilizando Node.js y Express.
- La aplicación deberá comunicarse mediante una API.
- Las validaciones importantes deberán realizarse en el backend, aunque también existan validaciones en el frontend.
- Las reglas de negocio deben implementarse de forma consistente y verificarse mediante pruebas.
- Los secretos y credenciales deberán mantenerse fuera del repositorio público.

---

**Fin de la especificación inicial de MiBolsillo.**

Versión 0.1 — Documento sujeto a revisión antes de comenzar el desarrollo.
