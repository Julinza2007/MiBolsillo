# INFORME_PRUEBAS — MiBolsillo

**Versión del informe:** 1.0  
**Fecha:** 4 de noviembre de 2026

## 1. Objetivo

Registrar las verificaciones realizadas sobre el MVP de MiBolsillo y dejar identificadas las pruebas que requieren acceso al entorno publicado.

## 2. Pruebas automatizadas del backend

Comando ejecutado desde `backend/`:

```bash
npm test
```

**Resultado: 9 pruebas aprobadas, 0 fallidas.**

| Área | Verificación | Resultado |
|---|---|---|
| Correo electrónico | Formatos válidos e inválidos | Aprobada |
| Contraseña | Longitud mínima y máxima | Aprobada |
| Importe | Positivo, máximo dos decimales y límites | Aprobada |
| Fecha | Formato ISO y fecha calendario válida | Aprobada |
| Movimientos | Validación de campos obligatorios | Aprobada |
| Presupuestos | Importe, categoría, mes y año | Aprobada |
| Categorías | Nombre y tipo | Aprobada |
| Períodos | Rangos mensuales, incluido diciembre/enero | Aprobada |
| Seguridad | Hash scrypt, verificación de contraseña y firma JWT | Aprobada |

## 3. Frontend

Comando ejecutado desde `frontend/`:

```bash
npm run lint
```

**Resultado: aprobado, sin errores ni advertencias.**

La compilación `npm run build` no pudo completarse en el entorno de revisión porque el ZIP incluía `node_modules` instalados en Windows y el entorno de revisión es Linux; faltaba el binding nativo de Rolldown para Linux. Esto es una incompatibilidad de los módulos instalados del ZIP, no un error reportado por ESLint. En la computadora de desarrollo o en Netlify se debe ejecutar `npm install` para instalar las dependencias correspondientes a esa plataforma y luego `npm run build`.

## 4. Base de datos

El backend incluye inicialización automática de tablas e inserción de categorías predefinidas. Se intentó volver a probar la conexión desde el entorno de revisión, pero la resolución DNS del host de Neon no estuvo disponible (`EAI_AGAIN`). La conexión ya había sido confirmada anteriormente por el propietario del proyecto; por eso la verificación de extremo a extremo del esquema y de las rutas con Neon queda pendiente de repetirse desde su equipo o desde Render.

## 5. Verificaciones pendientes antes de la entrega

- Ejecutar `npm install` en `frontend/` y comprobar `npm run build` en el entorno del proyecto.
- Iniciar backend y frontend con las variables locales configuradas.
- Registrar dos cuentas distintas y comprobar que no puedan acceder a los datos de la otra.
- Probar altas, modificaciones, consultas y eliminaciones de movimientos.
- Probar categorías predefinidas y personalizadas, incluyendo la restricción de eliminación cuando tienen datos asociados.
- Probar creación, edición y eliminación de presupuestos y sus advertencias.
- Publicar el backend en Render y el frontend en Netlify.
- Verificar el flujo completo usando las URLs públicas.

## 6. Conclusión

Las pruebas unitarias del backend y el análisis estático del frontend finalizaron correctamente. La comprobación de compilación en Linux y las pruebas integrales con la base de datos y los servicios publicados quedan pendientes por las limitaciones de entorno y por requerir las credenciales y dominios del propietario.
