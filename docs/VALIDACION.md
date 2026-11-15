# Registro de validación

Fecha: 14 de noviembre de 2026, zona de referencia `America/Bogota`.

Entorno real: Windows x64, Node.js 24.19.0, Angular 22.2.6, CLI 22.2.7, PHP 8.5.12, Laravel 13.42.0 y **MySQL Community 8.4.13**. Se extrajeron ambos DOCX antes de implementar; las sumas SHA-256 finales coinciden con las originales registradas en `DECISIONES.md`.

## Pruebas ejecutadas

| Comprobación | Resultado y evidencia |
| --- | --- |
| API Laravel / PHPUnit | **18 pruebas, 205 aserciones, todas aprobadas**, sobre MySQL real. Última ejecución registrada: 1624 ms. |
| Angular / Vitest | **5 pruebas en 3 archivos, todas aprobadas**: navegación, texto obligatorio, fecha colombiana, edición de fecha vencida y actualización reactiva de errores. |
| Compilación de producción Angular | Aprobada con `strict: true` y `strictTemplates: true`, sin errores. Bundle inicial aproximado: **310,17 kB**, transferencia estimada: 83,58 kB. |
| Chromium / Playwright | **8 pruebas completas aprobadas**, incluyendo CRUD, recarga, confirmación/cancelación, filtros, estados, diseño adaptable y rendimiento. Reporte local: `frontend/playwright-report/index.html`. |
| Composer | `composer validate --no-check-publish`: válido; archivo de bloqueo sincronizado sin cambiar versiones. |
| Formato PHP | `pint --dirty --format agent`: aprobado después de aplicar formato. |
| Herramientas portátiles | PHP, Composer y MySQL ejecutados. Script de instalación repetido con herramientas existentes: aprobado, sin reinstalación. |
| Arranque de desarrollo y proxy | Comandos del README ejecutados: Angular respondió HTTP 200 en 4200; `/api/asignaturas` devolvió 4 asignaturas y `/api/tareas` 5 tareas de demostración, tanto por el proxy Angular como directamente desde Laravel en 8000. |
| Secretos | `.env`, `.env.testing`, credenciales MySQL, binarios y dependencias excluidos por `.gitignore`; verificado con `git check-ignore`. |

Comandos de pruebas de backend y frontend se ejecutan desde sus propias carpetas, como indica el README. Los servidores de Playwright se detienen al finalizar la suite. MySQL de desarrollo conserva los datos académicos de demostración.

## Criterios solicitados

| N.º | Caso | Verificación ejecutada |
| --- | --- | --- |
| 1 | Registro de asignaturas | PHPUnit + formulario Chromium; persistencia después de recargar. |
| 2 | Nombre vacío | API 422 y mensaje exacto visible, incluidos espacios en blanco. |
| 3 | Creación de tareas | POST real y formulario con guardado en MySQL. |
| 4 | Fecha pasada | API 422 y formulario; aceptación de hoy en Colombia. |
| 5 | Orden por fecha | API y navegador: fecha ascendente con id como desempate. |
| 6 | Cambios de estado | Pendiente → En progreso → Completada, persistencia al recargar; completar dos veces se rechaza y se deshabilita el botón. |
| 7 | Prioridad | Consulta HTTP filtrada y filas correspondientes; combinación con estado. |
| 8 | Eliminación confirmada/cancelada | Cancelar conserva el registro incluso al recargar; confirmar lo elimina de MySQL y de la interfaz. |
| 9 | Edición | Carga de datos existentes, modificación de título/descripción y persistencia al recargar. |
| 10 | Descripción vacía | API 422 y mensaje exacto en formulario de edición. |
| 11 | Persistencia MySQL tras recarga | Asignaturas, datos de tareas y estados verificados en navegaciones nuevas; sin localStorage. |
| 12 | Integridad relacional | MySQL rechaza tareas huérfanas y eliminación de asignaturas con tareas. |
| 13 | Compilación | Angular de producción con tipado y plantillas estrictos. |
| 14 | API | Siete rutas funcionales, 200/201/204/404/422/500, CORS y errores JSON. |

La prueba de presentación de estados vacíos simula exclusivamente una lista vacía y un fallo de red. El registro, edición, filtros, estados, eliminación, persistencia y rendimiento usan Laravel y MySQL reales. Las pruebas de API usan transacciones; la base de desarrollo no se vacía.

## RNF-01: medición de 200 tareas

Base: `gestion_tareas_academicas_testing`; exactamente 200 tareas al comenzar. Bundle de producción servido por HTTP en `127.0.0.1:4300`, proxy a Laravel en `127.0.0.1:8001`, PHP con OPcache habilitado, MySQL en `127.0.0.1:3307`. Chromium a 1920 × 1080, sin limitación artificial de red/CPU. El servidor y el navegador se ejecutan en el mismo equipo.

El cronómetro empieza en `NavigationStart`. Un `MutationObserver` instalado antes de Angular detecta las 200 filas y guarda el tiempo en el siguiente frame del navegador. Se comprueba además la cantidad de filas y la respuesta HTTP. El tiempo que Playwright tarda en contar elementos no se agrega a la medición. El trazado de Playwright permanece desactivado.

Ejecución aprobada registrada en `artifacts/rnf-01-validada.json`:

| Navegación | Interfaz con 200 filas | Solicitud HTTP de tareas |
| --- | --- | --- |
| 1 | 575 ms | 91 ms |
| 2 | 434 ms | 80 ms |
| 3 | 360 ms | 91 ms |

Las tres muestras de esta ejecución están por debajo de 1500 ms. Las ejecuciones posteriores quedan en `artifacts/rnf-01.json`, junto al reporte JSON general `artifacts/playwright-results.json`.

La última ejecución completa, después de comprobar también los enlaces directos del filtro de estado, aprobó las 8 pruebas en 23,5 segundos, sin pruebas omitidas ni inestables. Sus muestras fueron **481, 376 y 338 ms**, con solicitudes HTTP de **82, 79 y 70 ms**, respectivamente.

**Resultado inicial conservado:** antes de habilitar OPcache y separar el cronómetro del trabajo del comprobador, se obtuvieron 2464, 1558 y 2048 ms, con solicitudes HTTP de 588, 272 y 334 ms. Esa ejecución no cumplió el objetivo. Las dos series tienen condiciones y método de captura distintos; no se presentan como una comparación controlada. El resultado aprobado describe la configuración local indicada, no una garantía de rendimiento en otros equipos, con servidor frío, en Internet o con carga concurrente.

## RNF-02 y RNF-03

Chromium verificó inicio, tareas y asignaturas a **375 × 812** y **1920 × 1080** sin desbordamiento horizontal. También comprobó el diálogo de registro dentro del ancho móvil. Se inspeccionaron visualmente las capturas de inicio en ambos tamaños. Capturas locales: `artifacts/inicio-375.png`, `inicio-1920.png`, `tareas-375.png` y `tareas-1920.png`.

TypeScript y las plantillas se compilaron con comprobación estricta. No se usan tipos `any` explícitos en el código de aplicación.

## Correcciones verificadas durante el desarrollo

- Arranque del servidor PHP de pruebas desde `public/`, compatible con las rutas de Windows.
- Mensajes de validación conectados a eventos de controles reactivos; prueba de regresión dedicada.
- Estado seleccionado correctamente después de recrear las opciones del listado al recargar.
- Selección de etiquetas del formulario que incluyen el asterisco obligatorio.
- Archivo de bloqueo Composer actualizado tras adaptar los comandos a un backend exclusivamente API.

## Diagnóstico de conexión Angular–Laravel–MySQL

Se revisó el error `ECONNREFUSED 127.0.0.1:8000` sin cambiar datos. Al comenzar, Angular estaba activo en 4200 y devolvía 502 en `/api/tareas`; Laravel no atendía en 8000. MySQL sí estaba funcionando en 3307. Laravel 13.42.0 y sus dependencias estaban instalados, `composer validate` fue correcto, las siete rutas API existían y ambas migraciones figuraban como ejecutadas. No había configuración Laravel cacheada que invalidara el `.env`.

El `.env` apunta a MySQL y a la base `gestion_tareas_academicas`. Se comprobaron la configuración y la presencia de credenciales sin imprimir contraseñas. El proxy de Angular apunta correctamente a `http://127.0.0.1:8000`; no fue necesario modificarlo.

Después de iniciar Laravel se ejecutaron cuatro solicitudes HTTP reales:

| Endpoint | Laravel 8000 | Proxy Angular 4200 | Registros |
| --- | --- | --- | --- |
| `/api/tareas` | 200, JSON | 200, JSON idéntico | 5 |
| `/api/asignaturas` | 200, JSON | 200, JSON idéntico | 4 |

Chromium abrió las vistas del servidor Angular de desarrollo y verificó 5 filas de tareas y 4 tarjetas de asignaturas, recibidas por HttpClient a través del proxy. No hubo errores JavaScript ni mensajes para reintentar. Estas comprobaciones solo realizaron GET; no se ejecutaron seeders, migraciones ni operaciones de eliminación.

Se añadió `scripts/start-backend.ps1`: reconoce/inicia la instancia MySQL existente, consulta las migraciones y ejecuta Laravel con PHP portable en el puerto 8000. `--tries=1` impide el cambio automático de puerto y `-CheckOnly` permite verificar los requisitos sin iniciar otra API. Se actualizó el README con el arranque en dos terminales y el diagnóstico de ECONNREFUSED.

## Límites de la verificación general

No se verificaron Firefox, Safari, dispositivos físicos, lectores de pantalla, un despliegue público, múltiples usuarios ni carga concurrente. La instalación completa de herramientas se hizo durante el desarrollo; el script reutilizable se comprobó después con los binarios ya presentes, no en una segunda máquina limpia. No se ejecutaron operaciones destructivas sobre bases preexistentes. Los documentos DOCX originales no se modificaron.
