# Pruebas y cobertura — semana 10

Fecha: **27/11/2026, America/Bogota**. Ejecución local de Codex, no atribuida a la estudiante ni a GitHub Actions. Se mantienen las 87 pruebas Vitest y 327 PHPUnit existentes y todos sus resultados esperados. No se modifica lógica de producción.

Este documento conserva la medición local de la preparación inicial. Posteriormente se publicó la rama, se corrigió CORS y se autorizaron actualizaciones de seguridad: [validación remota posterior](VALIDACION_REMOTA_S10.md). Los estados pendientes de seguridad/pipeline citados como límites de aquella etapa no sustituyen el resultado posterior comprobado.

## Herramientas, ámbito y resultados

Angular 22.2.6/CLI 22.2.7, Vitest 5.1.0 y `@vitest/coverage-v8` **5.1.0**, añadido solo en desarrollo; PHP 8.5.12, PHPUnit 12.5.44, Xdebug **3.5.3** NTS x64 VS17 y MySQL **8.4.13**. Se verificó que ninguna versión de paquete preexistente cambiara al instalar el proveedor de cobertura: doce paquetes nuevos de desarrollo. Xdebug se carga solo para el comando de cobertura con `-d zend_extension=...`; no se cambia `php.ini`.

| Comprobación | Resultado local observado |
|---|---|
| Vitest con cobertura | **87/87**, siete archivos, cero fallidas/pendientes. |
| PHPUnit con cobertura | **327/327**, **1014 aserciones**, cero fallos/errores/omitidas. |
| ESLint | Salida 0, cero advertencias permitidas. |
| TypeScript de aplicación y pruebas | `npm run typecheck`, salida 0. |
| Compilación Angular | Salida 0; inicial 310,33 kB; transferencia estimada 83,70 kB. |
| Node: rechazo de destinos E2E inseguros | **3/3**, salida 0. |
| Playwright/Chromium final | **10/10**, salida 0, 31,1 s; cero omitidas e inestables. |
| RNF-01 final | 200 tareas: **449, 324 y 322 ms**; API 67, 63 y 67 ms. Medición local con OPcache, sin cobertura PHP activa en el servidor E2E. |

Reportes brutos locales: `artifacts/ci/vitest.json`, `vitest.xml`, `phpunit.xml`, `phpunit-clover.xml`, `phpunit-coverage/`; frontend en `frontend/coverage/frontend/`. Logs de comandos: `artifacts/semana10/`. Los resúmenes portables seleccionados se enlazan en el [índice de evidencias](EVIDENCIAS_S10.md).

## Cobertura real

| Ámbito | Líneas ejecutables cubiertas | Sentencias | Funciones/métodos | Ramas |
|---|---:|---:|---:|---:|
| Frontend: `src/app/**/*.ts`, informe de 14 archivos | **195/319 = 61,12 %** | **273/428 = 63,78 %** | **43/112 = 38,39 %** | **132/188 = 70,21 %** |
| Frontend: reglas puras `config/fechas.ts` | **8/8 = 100 %** | 100 % | 100 % | **10/11 = 90,90 %** |
| Frontend: formulario real `components/tarea-form.component.ts` | **80/80 = 100 %** | 99,15 % | 85,71 % | 100 % |
| Backend: todo `app/`, 15 archivos | **83/112 = 74,11 %** | El formato Clover cuenta aquí las líneas ejecutables como statements. | **25/29 = 86,21 %** | No medida en esta ejecución. |
| Backend: HTTP y modelos, subconjunto explícito de negocio | **65/66 = 98,48 %** | Mismo denominador Clover. | **23/24 = 95,83 %** | No medida. |

El subconjunto backend se calcula desde los archivos `app/Http/` y `app/Models/` del mismo Clover, sin volver a ejecutar o excluirlos del total global. La línea pendiente corresponde al método de relación `Asignatura::tareas()`. `Support/TestDatabaseSafety.php` mide 12/12 por separado; las herramientas de consola y el proveedor siguen dentro del 74,11 % global.

La cobertura frontend instrumenta TS y código generado de componentes; sus métricas no son equivalentes a una inspección de cada expresión HTML. Excluye specs y tests, dependencias, e2e, CSS/HTML como archivos independientes y arranque `src/main.ts` fuera de `src/app`. No se excluyen vistas con cobertura baja para mejorar el total: Inicio figura con 0 %, el servicio HTTP con 5,55 % de líneas y Tareas con 48,07 %. Las pruebas E2E sí ejercitan esas rutas, pero no se fusionan con la cobertura Vitest.

PHPUnit incluye archivos no ejecutados de `app/`; excluye por ámbito `vendor`, pruebas, rutas, bootstrap, configuración, factories, seeders y migraciones. Estas últimas se ejecutaron al preparar la base, pero no se contabilizan como cobertura de `app`. No se solicitó `--path-coverage`; los ceros de conditionals del Clover no significan cobertura de ramas completa. No se añade un umbral arbitrario ni se presenta un porcentaje seleccionado como cobertura de todo el sistema.

## Datos y seguridad

Se creó una base nueva aleatoria de semana 10, terminada en `_testing`, y un usuario nuevo sin permisos sobre desarrollo. Se comprobó que una consulta a la base de desarrollo con ese usuario es rechazada. El mismo usuario solo puede acceder a las bases nuevas de pruebas/restauración; las credenciales quedan en `.runtime/semana10/`, ignorado. Las variables de prueba se cargan explícitamente, se exige el patrón del usuario dedicado y se aplican las guardias existentes antes de migrar o preparar fixtures. Los `.env` originales se conservan.

## Incidentes y límites reales

1. El primer Vitest quedó bloqueado por lectura de OneDrive en el sandbox, antes de ejecutar casos. La repetición con acceso adecuado aprobó 87/87. No se cambiaron imports ni esperados para ese bloqueo.
2. La primera invocación PHP intentó cargar un script de variables mediante dot-source; la política PowerShell lo impidió y la shell continuó usando la configuración `_testing` anterior. Se interrumpió la ejecución. Esa invocación no es evidencia válida de la base dedicada y no produjo el reporte final que se cita. La corrección carga JSON en la propia shell, detiene ante errores y exige el usuario/base nuevos antes de comenzar. Las pruebas usan transacciones; no se afirma haber probado un snapshot previo de esa base de pruebas anterior, que no se había capturado. No se usó la base de desarrollo para esa suite.
3. El arranque MySQL bajo el sandbox informó que no veía el puerto, aunque PDO pudo conectarse y MySQL registró readiness. `start-backend.ps1 -CheckOnly` con acceso a los servicios de Windows sí aprobó y reconoció la instancia. No se cambió el script ni se ocultó la diferencia de entorno.
4. La primera invocación Playwright escribió un JSON con 10 aprobadas, pero PowerShell convirtió una advertencia de colores de stderr en excepción. Se repite con redirección nativa de stdout/stderr y captura del código real; el resultado final se incorpora al índice de evidencias.

Continúan pendientes los casos F-14, E-17, T-15/T-16 y extremos A-06/A-08 del [registro histórico](../registro_pruebas.md). La cobertura no demuestra concurrencia, ausencia de defectos o aceptación humana. Las auditorías de dependencias históricas y S-02 siguen con sus límites; no se declara resuelto ese riesgo. El pipeline remoto aún no se ha ejecutado.
