# Revisión de calidad y seguridad del primer incremento

Fecha de referencia: **14 de noviembre de 2026, America/Bogota**. Rama: `revision-calidad-seguridad`. Línea base: `a4d34de` (`primera version funcional del sistema de gestion de tareas`).

## 1. Introducción

Se revisó el incremento existente del Sistema Web de Gestión de Tareas Académicas. El objetivo fue identificar defectos demostrables, corregirlos sin reconstruir el sistema y verificar las historias HU-01 a HU-08. Se conservan Angular, Laravel y MySQL, los endpoints y el diseño visual. No se implementa autenticación ni se amplía el alcance.

Se consultaron nuevamente los DOCX originales de semanas 3 y 4. El diseño de semana 4 mantiene precedencia sobre la propuesta inicial de localStorage. Ambos originales permanecen intactos; sus SHA-256 se registran en `DECISIONES.md` y se verificaron durante la revisión.

Se inspeccionaron código propio, plantillas, configuración, migraciones, pruebas, documentos y scripts de `frontend/`, `backend/`, `docs/` y `scripts/`. Las dependencias de terceros se revisaron mediante los auditores y, para contrastes concretos, leyendo su implementación instalada. No se auditaron línea por línea los árboles completos de `vendor/` y `node_modules/`.

## 2. Herramientas utilizadas

| Herramienta | Uso |
| --- | --- |
| Git | Rama, línea base, diferencias, exclusión de secretos y commit local. |
| Angular CLI 22.2.7 / TypeScript 6.0.3 | Compilación de producción, tipado y plantillas estrictos. |
| ESLint 10.15.0, angular-eslint 22.6.0, typescript-eslint 8.72.2 | Reglas de TypeScript con información de tipos y revisión de plantillas externas e inline, incluida accesibilidad. |
| Vitest | Pruebas de formularios, fechas, navegación y normalización de respuestas HTTP. |
| Laravel Pint 1.32.3 / PHP 8.5.12 | Estilo de PHP y verificación de sintaxis con `php -l`. |
| PHPUnit 12.5.44 | API, reglas de negocio, integridad y guardias del destino de pruebas. |
| Playwright 1.56.0 / Chromium | CRUD sobre MySQL, recarga, filtros, tamaños de pantalla, fecha en Tokio y escape de HTML. |
| Node.js 24.19.0, `node:test` y parser PowerShell | Rechazo del arranque E2E inseguro y sintaxis de scripts. |
| npm 11.17.0 / Composer 2.11.2 | Auditorías totales y separadas de producción. |
| Codex, agente principal | Inspección, herramientas, reproducción, correcciones y documentación. |
| Agente independiente **gpt-6-astra** | Segunda revisión de código, reproducción aislada de fechas y revisión posterior de los cambios. |

ESLint no estaba instalado en la línea base. Su instalación fue exclusivamente como dependencia de desarrollo; no cambió ninguna versión ya existente en el lockfile. La configuración analiza `frontend/src`, no los scripts Node ni las pruebas E2E; estos últimos se ejecutan y se comprueban por separado. Pint y compiladores no sustituyen una auditoría de seguridad.

Compatibilidad consultada en la [documentación oficial de angular-eslint](https://github.com/angular-eslint/angular-eslint/blob/main/docs/CONFIGURING_ESLINT.md). Opciones de auditoría contrastadas con [Composer](https://getcomposer.org/doc/03-cli.md#audit).

## 3. Metodología y línea base

1. Se verificaron rama y Git limpio antes de editar.
2. Se extrajeron ambos DOCX mediante ZIP/XML y se revisó la trazabilidad existente.
3. Se creó una **base MySQL nueva y exclusiva** para la revisión, con nombre aleatorio terminado en `_testing`. No se borraron bases ni datos preexistentes. Se aplicaron migraciones solo a esa base nueva.
4. Se ejecutaron las suites existentes antes de refactorizar. Los escenarios CRUD operaron únicamente sobre la base nueva; PHPUnit usa transacciones y las eliminaciones E2E se dirigen a tareas creadas por la propia prueba.
5. Se ejecutaron estilo, sintaxis, auditorías y ESLint; se contrastaron sus advertencias con el código y con pruebas.
6. Se solicitó una revisión a otro agente/modelo, sin entregarle hallazgos iniciales que condicionaran su inspección.
7. Se aplicaron cambios localizados y se ejecutaron regresiones y comprobaciones finales.

| Línea base | Resultado ejecutado |
| --- | --- |
| `git branch --show-current`; `git status --short` | Rama correcta; árbol limpio. |
| `php artisan test --compact` | **18 pruebas, 73 aserciones, aprobadas**, en la base nueva todavía sin los 200 fixtures. |
| `npm.cmd test -- --watch=false` | **5 pruebas, 3 archivos, aprobadas**. |
| `npm.cmd run build` | Aprobado; bundle inicial 310,17 kB. |
| `npm.cmd run e2e` | **8 pruebas aprobadas**, 29,2 s, con 200 fixtures exclusivos de revisión. |
| `php vendor/bin/pint --test --format=json` | Aprobado, sin modificar archivos. |
| `php -l` en el PHP propio | Sin errores de sintaxis. |
| `npm audit --json` y `npm audit --omit=dev --json` | Cero avisos en la línea base. |
| `composer audit --locked --format=json` y variante `--no-dev` | Sin advisories ni paquetes abandonados. |

Después de instalar el linter aparecieron **17 diagnósticos**: 11 sobre importaciones de tipos, uno sobre acceso a `any` y cinco sobre métodos estáticos de validación. Los cinco últimos se verificaron como falsos positivos. El resultado del linter recién configurado no se confunde con el estado original, que no tenía linter.

Los logs completos de esta sesión permanecen en `artifacts/revision/` (ignorados por Git). El resumen portable y sin secretos se conserva en `evidencia_revision.json`.

## 4. Checklist de calidad y seguridad

| Criterio | Resultado | Evidencia | Observaciones |
| --- | --- | --- | --- |
| Legibilidad y nombres | Cumple | Componentes, servicios y controladores por dominio | Se documentaron los métodos principales. |
| Separación de responsabilidades | Cumple | HttpClient en servicio; formularios en componentes; Form Requests y Resources | Se mantuvo la organización existente. |
| Duplicación relevante | Cumple | Inspección manual; guardia compartida `TestDatabaseSafety` | No se utilizó detector automático de clones; no se afirma ausencia absoluta de duplicación. |
| Funciones extensas | Cumple | Revisión de componentes y controladores | El componente de tareas coordina la vista; no se extrajo un gestor de estado innecesario para este alcance. |
| Variables/importaciones sin uso | Cumple | ESLint final con `--max-warnings=0` | Correcciones de importaciones de tipos; no hubo variables TS sin usar reportadas. |
| Tipado y plantillas estrictos | Cumple | `tsconfig.json`, compilación y linter | Sin `any` explícito en la aplicación; el `any` de la biblioteca HTTP se trata como `unknown`. |
| Formularios y validación visual | Cumple | Formularios reactivos y pruebas | Errores 422 se normalizan antes de presentarse. |
| Validaciones de servidor | Cumple | Form Requests y pruebas API | Longitudes, campos obligatorios, fechas, enumeraciones y FK. |
| Consultas y Eloquent | Cumple | `validated()`, `$fillable`, `where` parametrizado y `with('asignatura')` | No se construye SQL desde entradas del usuario en los endpoints. |
| Integridad y concurrencia | Cumple | FK restrictiva, enums, transacción y bloqueo de fila | Se rechaza completar de nuevo una tarea completada. |
| Excepciones JSON | Cumple | `bootstrap/app.php`; prueba 500 con debug activado | El error inesperado no presenta detalles internos. |
| Secretos en Git | Cumple | `git ls-files`, revisión de diferencias e ignorados | Solo `.env.example` y `.env.testing.example`; valores reales no impresos ni añadidos. |
| Variables de entorno | Cumple | `.env` revisado sin contraseñas, `APP_DEBUG=false`, MySQL | `.gitignore` evita versionar secretos; no equivale a cifrado o control de permisos del sistema operativo. |
| XSS | Cumple | Interpolación Angular, sin `innerHTML` ni bypass de sanitización; prueba Chromium | El HTML almacenado se muestra como texto. No constituye prueba exhaustiva de todas las variantes XSS. |
| Inyección SQL | Cumple | Eloquent/Query Builder parametrizados y prueba de comillas SQL | El texto de prueba no se ejecuta como SQL. |
| CORS | Cumple | Orígenes explícitos; sin comodín ni credenciales | CORS regula acceso del navegador a respuestas; no sustituye autenticación ni impide todo envío de solicitudes. |
| Base exclusiva de pruebas | Cumple | Preflight, guardia por solicitud y pruebas negativas | Se rechazan configuración cacheada, fallback `.env`, `DB_URL`, entorno o base incorrectos. |
| Auditoría de producción | Cumple | `npm audit --omit=dev`, `composer audit --no-dev` | Cero avisos en las consultas ejecutadas. |
| Auditoría total de desarrollo | No cumple | Aviso GHSA de minimatch descrito en S-02 | Un advisory raíz se refleja en siete paquetes; pendiente una solución compatible upstream. |
| Autenticación multiusuario | No aplica | Diseño de semana 4 y alcance aprobado | Ausencia intencional, con riesgo residual de acceso sin identidad. No es apto para publicación multiusuario. |
| HU-01 a HU-08 y persistencia | Cumple | Suites de API e integración sobre MySQL | Incluye cancelar/confirmar eliminación y recargar datos y estado. |
| Diseño responsivo y apariencia | Cumple | Pruebas a 375 y 1920 px; sin cambios CSS | El único cambio visible funcional es corregir el día de entrega en ciertos husos horarios. |

## 5. Hallazgos y decisiones

Ubicaciones indicadas por símbolo estable; las líneas originales corresponden a `a4d34de` y pueden desplazarse por la documentación añadida.

| ID | Problema / archivo y ubicación | Gravedad | Evidencia y verificación | Decisión y estado |
| --- | --- | --- | --- | --- |
| Q-01 | Sin ESLint: `frontend/package.json`, scripts/devDependencies | Baja | `npm ls eslint angular-eslint --depth=0` no los encontraba | **Corregir / corregido**: configuración compatible y comando reproducible. |
| Q-02 | Importaciones usadas solo como tipos, en 11 declaraciones de `frontend/src/app/` | Baja | ESLint `consistent-type-imports` | **Corregir / corregido** con `import type`; sin cambios de comportamiento. |
| Q-03 | Respuestas HTTP asumidas sin comprobar forma: `services/notificaciones.service.ts`, `erroresCampos` y `mensajeError` | Baja | Un `no-unsafe-member-access`; un cuerpo malformado podía propagarse como un tipo incorrecto al formulario | **Corregir / corregido**: `unknown`, comprobación de objetos/listas/cadenas y tres pruebas nuevas. No se reporta como XSS. |
| Q-04 | Falta de documentación en servicio HTTP, componentes, controladores y requests | Baja | Inspección de métodos sin JSDoc/PHPDoc | **Corregir / corregido** en métodos principales y reglas relevantes. |
| F-01 | Día anterior al mostrar una fecha: `pages/tareas/tareas.component.html:138`, `pages/inicio/inicio.component.html:114` originales | Media | Chromium Tokio mostró **13 nov 2026** para entrega **2026-11-14**; prueba nueva falló antes del fix | **Corregir / corregido**: instante UTC explícito; prueba posterior aprobada. No cambia el valor guardado. |
| S-01 | Servidor E2E sin comprobar base efectiva: `scripts/serve-backend.mjs:9-11` originales | Media | Solo forzaba `APP_ENV=testing`; podía heredar otra base o cargar configuración cacheada; no se provocaron escrituras en desarrollo | **Corregir / corregido**: helper común, comando de preflight y guardia durante el bootstrap HTTP. Siete pruebas PHP y tres Node comprueban rechazos. |
| S-02 | minimatch 10.2.6 transitivo del nuevo linter: `frontend/package-lock.json`, cadena typescript-eslint → typescript-estree → minimatch | Moderada según advisory; exposición observada baja | npm audit reporta siete paquetes derivados de **un mismo advisory**, exclusivamente de desarrollo | **Aceptar temporalmente / pendiente humana y upstream**. No se fuerza una dependencia mayor ni se baja TypeScript ESLint a una versión incompatible. |
| FP-01 | Posible aceptación de arrays en `Rule::in` | No aplica | gpt-6-astra verificó cinco casos aislados; nuevas pruebas API también rechazan arrays | **Descartar**: Laravel instalado rechaza arrays en estas reglas sin necesitar una regla `string` adicional. |
| FP-02 | Cinco `unbound-method` sobre `Validators.required` | No aplica | Métodos estáticos Angular sin uso de `this`; formularios y pruebas funcionan | **Descartar**: opción `ignoreStatic: true`, manteniendo activa la regla para métodos de instancia. |

### Detalle de S-02

La [advertencia oficial GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249) afecta minimatch `>=7.0.0 <11.0.1`. Describe agotamiento de recursos mediante patrones controlados por un atacante con `optimizationLevel >= 2`. El parche publicado empieza en 11.0.1; typescript-estree instalado declara `^10.2.2`.

La llamada encontrada en el parser utiliza `{dot: true}`, sin activar nivel 2, y pertenece a `allowDefaultProject`, opción que esta configuración no usa. `npm ls minimatch --omit=dev` devuelve árbol vacío. Esto reduce la exposición en este uso local con patrones propios, pero **no resuelve el advisory**. No se ejecutó `npm audit fix --force`; su sugerencia implicaba bajar TypeScript ESLint a 8.36.0, anterior al soporte utilizado para TypeScript 6.

**Validación humana pendiente:** la estudiante debe revisar la aceptación temporal de S-02, usar el linter sobre código confiable y actualizar cuando la cadena publique un parche compatible. No se le atribuye una aprobación ya realizada.

## 6. Segunda revisión con IA

Se utilizó otro agente con modelo **gpt-6-astra**, contexto inicial separado y encargo de solo lectura. No fue una segunda pasada del mismo agente presentada como independiente.

El segundo agente leyó código, configuración y scripts; contrastó las reglas con Laravel 13.42.0 instalado. Reprodujo aisladamente la fecha en Bogotá, Madrid y Tokio y rechazó cinco entradas no escalares mediante el validador real, sin DB. Identificó F-01 y S-01; descartó FP-01 y no encontró un fallo concreto en el fallback 500 o en las relaciones. No ejecutó PHPUnit, E2E ni mutaciones MySQL.

Tras recibir las diferencias realizó otra inspección: confirmó el ISO UTC correcto en tres zonas, la doble guardia E2E y la normalización de errores. También detectó un cierre de `describe` incorrecto en una nueva prueba durante la edición; se corrigió y se volvieron a ejecutar compilación/pruebas. Coincidió con documentar S-02 como residual, sin afirmar que está resuelto. Los resultados de las suites corresponden al agente principal, no a la estudiante ni al segundo agente.

| Observación independiente | Verificación del agente principal | Resultado |
| --- | --- | --- |
| F-01, desfase de fecha | Regresión Chromium falla con 13 en lugar de 14; pasa después | Aceptada y corregida. |
| S-01, servidor E2E sin guardia | Trazado de configuración y pruebas negativas sin abrir HTTP ni escribir desarrollo | Aceptada y corregida. |
| FP-01, arrays en enumeraciones | Pruebas API 422 | Descartada. |
| S-02, advisory dev de minimatch | Auditoría, árbol de dependencias y restricciones upstream | Aceptación temporal pendiente humana. |

## 7. Correcciones y alcance del cambio

- Se añadió `frontend/eslint.config.mjs` y `npm run lint`, con análisis de tipos y de plantillas. Solo se añadieron dependencias de desarrollo.
- Se normalizaron las respuestas de error y se añadieron retornos explícitos a los métodos del servicio HTTP.
- Se corrigieron dos expresiones de fecha para construir `YYYY-MM-DDT00:00:00Z` antes de formatear en UTC.
- Se añadió `TestDatabaseSafety`, reutilizado por PHPUnit, fixtures y servidor E2E. El comando `academic:check-test-database` solo consulta configuración, sin ejecutar SQL.
- El servidor E2E comprueba antes de escuchar y vuelve a comprobar en el bootstrap mediante `ACADEMICA_E2E=1`. La aplicación normal no activa esta guardia.
- Playwright fija `PORT=4300` y `BACKEND_PORT=8001` para su proxy, evitando que variables heredadas lo redirijan a la API de desarrollo. Esta protección complementa la guardia del servidor.
- Se documentaron métodos principales con JSDoc/PHPDoc y se añadieron regresiones sobre errores HTTP, arrays, asignación masiva, texto SQL, HTML y fecha.

No se cambiaron CSS, arquitectura, autenticación, contratos de endpoints, credenciales ni documentos originales. No hubo actualización de versiones preexistentes en el lockfile; se compararon los paquetes presentes antes/después.

## 8. Pruebas posteriores y comandos reproducibles

Los resultados finales y códigos de salida están en `evidencia_revision.json`. Los comandos completos de instalación y ejecución permanecen en el README. La variable `DB_DATABASE` se estableció explícitamente con la base nueva de revisión; los secretos se obtienen de archivos locales ignorados y no se incluyen aquí.

| Comprobación final | Resultado real |
| --- | --- |
| ESLint con tipos y plantillas | 24 unidades reportadas, **0 errores y 0 advertencias**, salida 0. |
| PHPUnit | **28 pruebas, 227 aserciones**, aprobadas, salida 0. |
| Angular/Vitest | **8 pruebas en 4 archivos**, aprobadas, salida 0. |
| Playwright/Chromium | **10 pruebas**, aprobadas en 26,5 s; sin omisiones, fallos ni inestabilidad. |
| Node: guardia del servidor | **3 pruebas** aprobadas; destinos inseguros rechazados antes de escuchar. |
| Angular producción | Compila; bundle inicial 310,33 kB, transferencia estimada 83,70 kB. |
| Pint y Composer validate | Aprobados; lockfile Composer válido. |
| Sintaxis | 40 archivos PHP del conjunto revisado, más el script PHP local, y scripts Node/PowerShell sin errores. |
| npm audit total | Salida **1**: siete paquetes señalados por el advisory transitivo S-02; no es un resultado aprobado sin avisos. |
| npm audit producción | Salida 0, cero avisos. |
| Composer audit total / producción | Salida 0 en ambos, sin advisories ni abandonados. |

RNF-01 se volvió a medir con 200 registros de MySQL, HTTP, bundle de producción y OPcache: **677, 414 y 350 ms**, con solicitudes de tareas de 167, 124 y 91 ms. Las tres muestras locales quedaron bajo 1500 ms. Esta serie no se utiliza para atribuir una mejora de rendimiento a la refactorización.

Se repitió después la suite completa con `PORT=4399` y `BACKEND_PORT=8000` heredados deliberadamente. Playwright los sustituyó por los puertos seguros 4300/8001: **10 pruebas aprobadas en 27,5 s**, sin tocar desarrollo. En esa última ejecución, RNF-01 registró **681, 348 y 358 ms**. El JSON conserva esta última serie.

```powershell
# Desde backend, con DB_DATABASE apuntando a una base exclusiva terminada en _testing
..\.tools\php\php.exe artisan academic:check-test-database --env=testing --no-interaction
..\.tools\php\php.exe artisan test --compact
..\.tools\php\php.exe vendor/bin/pint --dirty --format agent
..\.tools\php\php.exe ..\.tools\composer.phar validate --no-check-publish
..\.tools\php\php.exe ..\.tools\composer.phar audit --locked --format=json
..\.tools\php\php.exe ..\.tools\composer.phar audit --locked --no-dev --format=json

# Desde frontend
npm.cmd run lint
npm.cmd test -- --watch=false
npm.cmd run build
npm.cmd run e2e
npm.cmd audit --json
npm.cmd audit --omit=dev --json

# Desde la raiz
node --test scripts/serve-backend.test.mjs
```

La prueba de HTML y la de texto SQL se ejecutan exclusivamente contra el entorno local de pruebas. La primera verifica que no se cree un elemento `img` ni se ejecute su evento; la segunda comprueba almacenamiento parametrizado y conservación de la tabla. No se atacaron servicios externos.

Las aserciones de PHPUnit aumentan al haber 200 fixtures; por eso no se comparan 73 aserciones iniciales con el número final como una métrica de cobertura. No se midió cobertura de líneas: el informe describe escenarios ejecutados, no un porcentaje inventado.

## 9. Riesgos residuales y revisión humana pendiente

1. **S-02:** advisory moderado en desarrollo, descrito arriba. La auditoría total continúa señalándolo; producción no lo incluye.
2. **API sin autenticación:** cualquier proceso con acceso puede leer o modificar datos. CORS no proporciona identidad ni autorización y no bloquea todas las solicitudes de otros sitios. Solo se acepta como demostración personal en loopback; publicar o compartir requiere una decisión adicional y controles adecuados. La estudiante debe validar esa restricción antes de exponerla.
3. Los secretos locales requieren protección del equipo y de sus copias de seguridad. No se evaluaron ACL de Windows, cifrado de disco ni seguridad de OneDrive.
4. La guardia distingue bases por configuración y sufijo; la estudiante debe reservar las bases `_testing` para fixtures, sin información personal que quiera conservar.
5. Se verificó Chromium, no Firefox/Safari ni dispositivos físicos. El rendimiento es una medición local; no hay prueba de penetración exhaustiva, carga concurrente o certificación de ausencia de vulnerabilidades.
6. La estudiante todavía debe revisar el diff, confirmar los riesgos aceptados y realizar su propia validación académica. Ninguna verificación humana pendiente se presenta como completada.

## 10. Conclusiones

La revisión conserva el incremento y añade comprobaciones reproducibles. Se corrigieron defectos verificables de fechas, aislamiento de pruebas y tratamiento de errores, y se incorporaron linter y documentación. Los resultados automatizados permiten evaluar regresiones; no sustituyen la revisión de la estudiante ni eliminan los riesgos expresamente documentados.

## 11. Observaciones de revisión humana del commit 80c1917

La estudiante comunicó dos observaciones textuales detectadas **al comparar el diff**. Esta es una revisión humana parcial; no implica que haya ejecutado las pruebas del agente ni aceptado los riesgos residuales del informe.

| ID | Observación humana | Comprobación del agente en el código y el commit | Resultado |
| --- | --- | --- | --- |
| RH-01 | Se indicó `Porcomenzar` en `frontend/src/app/pages/inicio/inicio.component.html`; texto solicitado: `Por comenzar`. | La copia actual y `80c1917` ya contienen `<small>Por comenzar</small>`, con espacio. No se encontró literalmente la forma unida. | Texto solicitado verificado; no fue necesario modificar el HTML. |
| RH-02 | Se indicó `durantela edicion` en el JSDoc de `fechaNoPasada`; texto solicitado: `durante la edición`. | La copia actual decía `durante la edicion`, ya separada, pero sin tilde. | Se corrigió exclusivamente `edicion` a `edición` en ese comentario. |

Para comprobar otras uniones accidentales se compararon los nodos de texto de las dos plantillas externas modificadas en `80c1917` con su padre, normalizando espacios: inicio mantuvo 43 nodos y tareas 41. Las únicas diferencias textuales fueron las expresiones UTC intencionales. El texto del formulario inline fue idéntico y se inspeccionaron los comentarios añadidos al diff. No se detectaron otras concatenaciones en ese alcance; no se afirma una revisión ortográfica exhaustiva del repositorio.

Verificación posterior **ejecutada por el agente** desde `frontend/`:

- `npm.cmd run lint`: aprobado, salida 0.
- `npm.cmd test -- --watch=false`: **8 pruebas en 4 archivos aprobadas**, salida 0.
- Comparación con `80c1917`: ambas plantillas conservan `T00:00:00Z` y formato `UTC`, sin cambios HTML, funcionales ni visuales.

No se ejecutaron operaciones MySQL. El ajuste se registra en un commit nuevo, sin modificar `80c1917` ni realizar push.
