# Revisión de seguridad y calidad — Semana 6

## 1. Herramientas y criterios.

Se revisó el primer incremento de **Sistema Web de Gestión de Tareas Académicas**, sin reconstruirlo ni cambiar su diseño. Fuentes: [informe detallado](docs/revision_seguridad.md), [bitácora](docs/bitacora_ia.md) y [evidencia de ejecución](docs/evidencia_revision.json). Se mantienen Angular, Laravel y MySQL y la precedencia del diseño de semana 4.

La revisión registrada el **14/11/2026 (America/Bogota)** utilizó TypeScript estricto, ESLint/angular-eslint, Laravel Pint, `php -l`, Vitest, PHPUnit, Playwright/Chromium, `node:test`, Git, `npm audit` y `composer audit`. Se evaluaron validaciones, errores, responsabilidades, integridad, persistencia y HU-01 a HU-08. Resultados históricos del agente: **28 pruebas PHP (227 aserciones), 8 Angular, 10 E2E y 3 Node aprobadas**; compilación, Pint y ESLint sin errores. No se repitieron estas suites durante el presente ajuste documental.

**Criterios de seguridad:** inyección SQL: consultas Eloquent parametrizadas, entradas validadas y prueba de texto SQL; sin defecto confirmado. Secretos y contraseñas: revisión de archivos versionados e ignorados, sin credenciales reales detectadas; `.env` y secretos locales quedan fuera de Git. El sistema no administra contraseñas de estudiantes: su almacenamiento y recuperación **no aplican** al alcance; sí se protegen las credenciales de MySQL. XSS: interpolación Angular y comprobación de escape de HTML. Control de acceso: no hay autenticación por decisión académica de un solo usuario; cualquiera que alcance la API puede modificar datos. CORS no reemplaza autorización; el uso previsto es local en loopback. Dependencias: las auditorías registradas de producción npm y Composer dieron cero avisos; la auditoría npm completa conserva S-02, con siete paquetes señalados por un mismo aviso, no siete vulnerabilidades independientes.

## 2. Tabla de hallazgos.

Las líneas corresponden al código actual de `main` heredado en esta rama documental, no a las ubicaciones anteriores a la refactorización. Los commits son antecedentes verificables con `git show <commit>`.

| ID | Archivo y línea real | Problema | Categoría | Severidad | Corrección realizada / estado | Commit correspondiente |
| --- | --- | --- | --- | --- | --- | --- |
| F-01 | [tareas.component.html:137](frontend/src/app/pages/tareas/tareas.component.html#L137); [inicio.component.html:112](frontend/src/app/pages/inicio/inicio.component.html#L112) | Fecha mostrada un día antes en ciertos husos. | Calidad funcional | Media | **Corregido:** ISO con `T00:00:00Z` y formato UTC; regresión Chromium. | `80c1917` |
| S-01 | [serve-backend.mjs:11](scripts/serve-backend.mjs#L11); [TestDatabaseSafety.php:19](backend/app/Support/TestDatabaseSafety.php#L19) | El servidor E2E podía usar configuración de desarrollo. | Seguridad de datos de pruebas | Media | **Corregido:** preflight y guardia en bootstrap; entorno testing, MySQL, `.env.testing`, sin `DB_URL` ni caché y sufijo `_testing`. Límites abajo. | `80c1917`; aclaración `3ead49e` |
| S-02 | [package-lock.json:6485](frontend/package-lock.json#L6485) | minimatch 10.2.6 transitivo en desarrollo, GHSA-g3hv-75wg-m249. | Dependencias | Moderada | **Pendiente, no corregido:** propuesta de aceptación temporal local; aprobación definitiva pendiente. Sin forzar actualizaciones. | Introducido/documentado: `80c1917`; seguimiento: `81a6cb4` |
| Q-01 | [package.json:12](frontend/package.json#L12) | Faltaba linter frontend reproducible. | Calidad / análisis estático | Baja | **Corregido:** ESLint compatible y `lint`, sin advertencias finales. | `80c1917` |
| Q-02 | [academico.service.ts:4](frontend/src/app/services/academico.service.ts#L4), ejemplo de 11 declaraciones | Importaciones de tipos sin `import type`. | Calidad / tipado | Baja | **Corregido:** importaciones explícitas de tipos. | `80c1917` |
| Q-03 | [notificaciones.service.ts:15](frontend/src/app/services/notificaciones.service.ts#L15) | Se asumía la forma del cuerpo de error HTTP. | Calidad / manejo de errores | Baja | **Corregido:** `unknown`, comprobación de estructura y tres pruebas. No se clasificó como XSS. | `80c1917` |
| Q-04 | [academico.service.ts:25](frontend/src/app/services/academico.service.ts#L25); [TareaController.php:19](backend/app/Http/Controllers/Api/TareaController.php#L19) | Documentación insuficiente de métodos principales. | Calidad / mantenibilidad | Baja | **Corregido:** JSDoc/PHPDoc de contratos, retornos y validaciones. | `80c1917` |
| FP-01 | [ListTareasRequest.php:19](backend/app/Http/Requests/ListTareasRequest.php#L19) | Sospecha de aceptar arrays con `Rule::in`. | Validación | No aplica | **Falso positivo:** Laravel instalado los rechaza; sin cambio de reglas. | Verificación: `80c1917` |
| FP-02 | [eslint.config.mjs:34](frontend/eslint.config.mjs#L34) | Cinco avisos `unbound-method` sobre validadores estáticos. | Calidad / análisis estático | No aplica | **Falso positivo:** `ignoreStatic: true`; regla activa para métodos de instancia. | `80c1917` |

## 3. Revisión con IA.

Codex realizó inspección, correcciones y suites; un agente independiente **gpt-6-astra**, con contexto separado, contrastó código y reprodujo fechas/validadores sin operar MySQL. Confirmó F-01/S-01 y descartó FP-01. No se presenta una segunda pasada del mismo agente como revisión independiente. Prompts y evidencias se conservan en la bitácora.

**Supervisión humana efectuada:** al comparar diffs, la estudiante comunicó observaciones de documentación. El contraste del agente no confirmó las concatenaciones `Porcomenzar`, `durantela edicion`, `seaexclusivo`, `modificaMySQL` ni `conexionno`: los espacios ya existían. Se corrigieron únicamente las tildes de [«edición»:19](frontend/src/app/config/fechas.ts#L19) (`9c72fbb`) y [«conexión»:17](backend/app/Support/TestDatabaseSafety.php#L17) (`3ead49e`). No se presentan las uniones descartadas como defectos confirmados.

La estudiante consideró adecuada S-01 para el alcance académico, advirtiendo que `_testing` **no demuestra una base vacía ni verifica independientemente la identidad física del servidor**: usar bases nuevas y desechables. El agente trazó la invocación: `frontend/playwright.config.ts` → `scripts/serve-backend.mjs` → `academic:check-test-database` → `TestDatabaseSafety::assertSafe()`; `AppServiceProvider::boot()` la invoca también con `ACADEMICA_E2E=1` al arrancar Laravel para la API.

La estudiante reportó ejecutar desde `frontend/` **`npm ls minimatch`**: ESLint 10.15.0 y @eslint/config-array 0.23.6 utilizan 11.0.8; @typescript-eslint/typescript-estree 8.72.2 utiliza 10.2.6. También reportó **`npm audit --omit=dev` → `found 0 vulnerabilities`**. Son comprobaciones humanas comunicadas, sin inferir fecha de ejecución ni aprobación definitiva. Las suites automatizadas citadas corresponden al agente.

## 4. Pendientes.

- **S-02:** sigue abierto. Confirmar humanamente la propuesta temporal y seguir actualizaciones compatibles; repetir árbol y auditorías antes de cambiar su estado.
- Mantener pruebas en bases nuevas y desechables; S-01 valida configuración, no contenido ni identidad física de MySQL. No exponer la API sin control de acceso fuera del alcance local aprobado.
- Verificar instalación completa en una carpeta limpia: los comandos se contrastaron con scripts/manifiestos; el antecedente de instalación reutiliza herramientas existentes. No se declara verificada una instalación limpia.
- Decidir licencia global: no existe archivo `LICENSE`; `backend/composer.json` declara MIT, sin una licencia global documentada. Completar aprobación académica humana. Este ajuste solo modifica documentación y no realiza push.
