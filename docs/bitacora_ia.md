# Bitácora de IA — revisión del primer incremento

> Continuación de semana 10 al final del documento. Los registros históricos conservan sus fechas y límites originales.

Fecha de esta actividad: **14 de noviembre de 2026**, zona `America/Bogota`. Algunas herramientas registran timestamps UTC del 15 de noviembre; corresponden todavía al día 14 en Colombia.

Revisión inicial: rama `revision-calidad-seguridad`, desde `a4d34de`; corrección principal `80c1917`. Esta etapa no realizó push. Posteriormente se integró en `main` mediante `1adaacd`. El ajuste documental de la entrega se realiza en `ajuste-entrega-semana-6`, sin push; los resultados anteriores se conservan como antecedentes, no como pruebas repetidas en esta etapa.

## Consigna de la estudiante

Extractos literales del prompt recibido, conservando su intención y límites:

> Actúa como un ingeniero de software senior especializado en revisión de código (Code Review), seguridad de aplicaciones web, calidad de software y refactorización segura.
>
> NO quiero reconstruir el proyecto ni cambiar su diseño visual. Quiero revisar, mejorar, documentar y verificar el código que ya existe.
>
> Debes corregir únicamente los problemas confirmados, mantener las funcionalidades existentes y documentar todo el proceso.
>
> No presentes una segunda pasada del mismo agente como una revisión independiente realizada por otro modelo.
>
> Empieza por la inspección y las pruebas de línea base.

La consigna completa de la conversación especificó inspección, herramientas, checklists, segunda IA, refactorización, JSDoc/PHPDoc, README, informe, bitácora, validación y commit sin push. Los extractos anteriores no se presentan como transcripción íntegra del prompt largo.

## Actividades realmente realizadas

| Fecha | Herramienta y prompt/instrucción | Objetivo | Respuesta y problemas sugeridos | Comprobación realizada por el agente | Decisión/corrección | Verificación humana |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-11-14 | Codex principal; consigna anterior | Establecer línea base y preservar el proyecto | Confirmó rama y árbol limpio; extrajo ambos DOCX | Git, hashes, suites existentes y compilación antes de refactorizar | Mantener arquitectura y documentos originales | Pendiente revisión de la estudiante. |
| 2026-11-14 | Codex principal, comandos de npm/Composer/Pint/PHP | Identificar herramientas y estado de dependencias | Faltaban ESLint/angular-eslint; Pint estaba instalado; auditorías iniciales sin avisos | Consultas locales, auditorías remotas de paquetes y documentación oficial de compatibilidad | Añadir herramientas de desarrollo compatibles, sin actualizar versiones preexistentes | Pendiente revisar configuración y comandos. |
| 2026-11-14 | Agente independiente **gpt-6-astra**; prompt reproducido abajo | Contrastar críticamente el código sin modificarlo | Detectó desfase de fecha y falta de guardia E2E; descartó arrays en Rule::in | Revisión independiente y pruebas aisladas de fecha/validadores, sin DB | Aceptar F-01 y S-01; descartar FP-01 | La estudiante no ejecutó esas comprobaciones durante esta sesión. |
| 2026-11-14 | Codex principal, ESLint con tipos y plantillas | Confirmar avisos de análisis estático | 11 importaciones de tipos, un acceso inseguro a any y cinco unbound-method | Revisión de los símbolos y ejecución de formularios | Corregir imports y errores HTTP; descartar métodos estáticos como falsos positivos | Pendiente revisar el diff. |
| 2026-11-14 | Codex principal, regresión Chromium en Tokio | Verificar F-01 antes y después del cambio | El navegador mostraba 13 para entrega 14 | Prueba falló antes; pasó tras usar ISO UTC explícito | Corregir dos expresiones de plantilla, sin CSS ni cambios de MySQL | Pendiente validación visual de la estudiante. |
| 2026-11-14 | Codex principal, pruebas de seguridad de configuración | Impedir que E2E escriba desarrollo | La guardia anterior solo protegía PHPUnit y preparación de fixtures | Siete pruebas PHP y tres Node; el servidor rechaza destinos inseguros antes de escuchar | Helper compartido, preflight y comprobación en el bootstrap E2E | Pendiente reservar bases _testing solo para fixtures. |
| 2026-11-14 | Codex principal, npm audit y advisory oficial | Evaluar los avisos surgidos al instalar el linter | Un advisory de minimatch propagado a siete paquetes dev | Árbol de dependencias, rangos upstream y auditoría separada de producción | No forzar mayor ni downgrade; propuesta de aceptación temporal, S-02 sin corregir | **Comprobaciones humanas reportadas en el seguimiento S-02; confirmación definitiva pendiente.** |
| 2026-11-14 | gpt-6-astra; revisión posterior con diferencias | Detectar errores en los propios cambios de IA | Confirmó fixes y avisó de un cierre de describe incompleto durante la edición | El principal corrigió el spec y volvió a ejecutar pruebas/linter; el segundo agente repitió fechas en tres zonas | Corrección del error de edición; no se ocultó como éxito la compilación fallida intermedia | Pendiente revisión humana del resultado. |
| 2026-11-14 | Codex principal, JSDoc/PHPDoc y validación final | Entregar cambios comprensibles y reproducibles | Documentación de métodos, contratos y límites; regresiones ampliadas | Compilación, linter, PHPUnit, Vitest, Node, Chromium, sintaxis y auditorías; resultados en evidencia_revision.json | Documentar resultados y hacer commit local sin push | Pendiente aprobación académica de la estudiante. |

## Prompt de segunda revisión

Se invocó un agente distinto con modelo **gpt-6-astra**, esfuerzo alto y contexto inicial separado. Extracto literal del encargo:

> Realiza una revisión independiente y crítica SOLO DE LECTURA del proyecto en C:\Users\linda\OneDrive\Escritorio\gestion-tareas-academicas. Usuario solicita explícitamente segunda revisión con otro modelo/IA; eres el agente independiente gpt-6-astra y debes identificarte así, sin atribuir comprobaciones a la estudiante. Revisa AGENTS aplicables, frontend/src, backend/app config bootstrap rutas migrations/tests, scripts, tests E2E. Arquitectura Angular22/Laravel13/MySQL8.4, demostración single-user sin autenticación intencional, no rediseñar ni reconstruir. No modifiques archivos, no ejecutes operaciones MySQL que muten ni fixtures destructivos, no hagas commit, no expongas secretos ni .env íntegros. Devuelve hallazgos reales con archivo:línea, gravedad, evidencia y escenarios; distingue falsos positivos/limitaciones fuera de alcance; revisa especialmente validaciones arrays de query/body, excepciones, fallback500, CORS, integridad y comandos scripts de prueba.

El mismo encargo pidió indicar metodología y límites y explicó que las herramientas/línea base las ejecutaría el agente principal. No se entregaron hallazgos iniciales al segundo agente. Después se le comunicaron los cambios concretos y se pidió contrastarlos, incluyendo el residual de minimatch, sin modificar archivos ni bases.

## Hallazgos aceptados y descartados

- **Aceptados y corregidos:** F-01, S-01, Q-01 a Q-04, según el informe. Las correcciones no añaden autenticación ni cambian la apariencia.
- **Propuesta de aceptación temporal, pendiente de confirmación definitiva:** S-02, aviso de minimatch solo en desarrollo, todavía sin corregir. La auditoría total no se presenta como limpia.
- **Descartados con evidencia:** FP-01 (arrays en enumeraciones de Laravel) y FP-02 (validadores estáticos de Angular). No se inventó SQL injection o XSS por el simple hecho de existir texto proporcionado por el usuario.
- **Límite del diseño:** endpoints sin autenticación. No se etiquetó como defecto inventado de implementación; se documentó el riesgo antes de cualquier publicación o uso compartido.

## Evidencia y resultados

El informe [revision_seguridad.md](revision_seguridad.md) y el resumen [evidencia_revision.json](evidencia_revision.json) contienen los comandos, cifras y decisiones. Los logs completos y reportes de navegador permanecen en `artifacts/revision/` y `frontend/playwright-report/`, ignorados por Git.

Se utilizó una base nueva de revisión con 200 fixtures; no se eliminaron datos de las bases existentes. Las pruebas de eliminación se limitaron a tareas generadas por sus propios escenarios. Las pruebas de estados vacíos/fallo de red simulan respuestas explícitamente; CRUD, fechas y rendimiento usan HTTP y MySQL reales.

El agente principal detectó además que un `BACKEND_PORT` heredado podía redirigir el proxy de pruebas. Se fijaron los puertos en Playwright y se repitieron las diez pruebas con valores heredados deliberadamente incorrectos: todas aprobaron. Esta comprobación complementaria corresponde al agente principal.

Hubo fallos intermedios registrados: la regresión de fecha falló antes del arreglo y un nuevo spec tuvo un cierre sintáctico incompleto que fue corregido. También se repitió en la carpeta correcta una consulta Composer iniciada por error desde frontend. Esos intentos fallidos no se contaron como verificaciones aprobadas.

## Tareas pendientes de la estudiante

La estudiante debe completar la revisión global del diff y del informe, confirmar el uso personal en loopback y su decisión definitiva sobre S-02. Sus comprobaciones parciales ya comunicadas se registran en los seguimientos siguientes; no equivalen a aprobación académica completa. La IA realizó sus propios análisis y pruebas automatizadas, sin sustituir la validación humana ni certificar ausencia total de vulnerabilidades.

## Seguimiento: observaciones humanas al comparar el diff de 80c1917

La estudiante realizó una revisión parcial del diff y comunicó dos observaciones de redacción. Esto actualiza el registro anterior únicamente respecto de esa comparación humana; las pruebas automatizadas y la aceptación de riesgos siguen distinguiéndose de su revisión.

**Prompt recibido, extractos literales:**

> En `frontend/src/app/pages/inicio/inicio.component.html` aparece el texto `Porcomenzar`. Debe corregirse a `Por comenzar`.
>
> En `frontend/src/app/config/fechas.ts`, el comentario JSDoc de `fechaNoPasada` contiene `durantela edicion`. Debe corregirse a `durante la edición`.
>
> Corrige únicamente estos dos problemas. Conserva la corrección de fechas UTC ya implementada.

| Actividad | Responsable real | Resultado |
| --- | --- | --- |
| Detección y comunicación de las dos observaciones al comparar el diff | Estudiante | Observaciones registradas como RH-01 y RH-02 en el informe. No se atribuyen al agente como hallazgos humanos propios. |
| Contraste con la copia actual y el commit | Codex, agente principal | `Por comenzar` ya tenía espacio; el JSDoc decía `durante la edicion`. No se encontraron literalmente las dos formas unidas comunicadas. |
| Corrección aplicada | Codex, agente principal | Solo la tilde pendiente en `durante la edición`; el HTML ya cumplía el texto solicitado. |
| Revisión de otras concatenaciones de formateo | Codex, agente principal | Comparación de textos de plantillas externas e inline y revisión de comentarios del diff, sin otras uniones detectadas en ese alcance. |
| Linter y pruebas posteriores | Codex, agente principal | ESLint aprobado y 8 pruebas Angular aprobadas. La estudiante no ejecutó estas comprobaciones durante este seguimiento. |
| Conservación de UTC | Codex, agente principal | Las plantillas no cambiaron respecto de `80c1917` y mantienen ISO UTC explícito. No se modificaron funcionalidades, CSS ni datos MySQL. |

Herramienta de IA utilizada en este seguimiento: **Codex, agente principal**. No se solicitó otra revisión por IA para este ajuste textual. Se crea un commit nuevo, sin reescribir el historial y sin push. La aprobación académica completa y la confirmación definitiva de la decisión sobre S-02 siguen pendientes de la estudiante.

## Seguimiento: revisión humana y propuesta de aceptación temporal de S-02

La estudiante comunicó resultados de comandos ejecutados por ella desde `frontend/`. Este registro los atribuye a la estudiante, según su mensaje, y los distingue de las ejecuciones previas del agente. No se infiere una fecha u hora de ejecución ni una aprobación definitiva no comunicada.

**Prompt recibido, extracto literal:**

> La decisión propuesta es aceptar temporalmente el riesgo para la demostración académica local, sin declararlo corregido, manteniendo seguimiento de actualizaciones compatibles.
>
> Distingue claramente las comprobaciones realizadas por la estudiante de los análisis del agente. No atribuyas a la estudiante una aprobación definitiva sin su confirmación.

| Actividad | Responsable real | Resultado comunicado o trabajo realizado |
| --- | --- | --- |
| Ejecutar `npm ls minimatch` desde `frontend/` | Estudiante, según su reporte | ESLint 10.15.0 y @eslint/config-array 0.23.6 usan minimatch 11.0.8; @typescript-eslint/typescript-estree 8.72.2 usa minimatch 10.2.6. |
| Ejecutar `npm audit --omit=dev` desde `frontend/` | Estudiante, según su reporte | `found 0 vulnerabilities`. Corresponde a la auditoría que excluye desarrollo. |
| Confirmar la permanencia de la dependencia afectada | Revisión humana reportada por la estudiante | minimatch 10.2.6 continúa instalado en desarrollo y afectado por GHSA-g3hv-75wg-m249. No se declara corregido. |
| Proponer aceptación temporal para la demostración académica local | Estudiante | Propuesta registrada; **confirmación definitiva pendiente**. Se mantiene seguimiento de actualizaciones compatibles. |
| Integrar los resultados y revisar coherencia/rutas | Codex, agente principal | Actualización documental de la tabla S-02, sus estados y referencias locales; sin nuevas ejecuciones de npm o pruebas. |

**Estado actual:** S-02 sigue abierto, sin corregir, con una propuesta de aceptación temporal limitada a la demostración académica local. El análisis previo del agente y la segunda revisión por IA son antecedentes técnicos, no autorizaciones de la estudiante. La aprobación definitiva y la aprobación académica completa siguen pendientes de confirmación expresa.

El seguimiento propuesto es revisar actualizaciones compatibles y volver a comprobar el árbol completo y las auditorías total y de producción antes de cambiar el estado. No se modificaron dependencias, lockfiles ni código y no se ejecutó `npm audit fix --force`. Esta actividad corresponde únicamente a documentación con Codex; no se invocó otro modelo de IA ni se ejecutaron pruebas adicionales por parte del agente.

Detalle y resultados humanos: [revisión de seguridad, sección 13](revision_seguridad.md#13-comprobaciones-humanas-y-propuesta-de-decisión-para-s-02). Las rutas relativas del informe y de esta bitácora fueron revisadas por el agente; los artefactos ignorados se identifican como evidencia local, no como archivos que se publiquen con el commit.

## Semana 6: ajuste a la plantilla oficial

Fecha de registro: **14/11/2026 (America/Bogota)**. Las tres entradas siguientes corresponden a actividades distintas de esta semana, realizadas por Codex en este ajuste documental. No asignan una nueva fecha de ejecución a los comandos previamente reportados por la estudiante.

**Prompt de esta actividad, extractos literales:**

> Crea `revision_seguridad.md` en la RAÍZ del repositorio, con una extensión aproximada de 1 a 2 páginas.
>
> No modifiques código funcional ni dependencias. No ejecutes operaciones destructivas de MySQL.
>
> Si el proyecto todavía no tiene licencia definida, indícalo claramente y deja pendiente la elección.
>
> Comprueba que existan al menos tres entradas correspondientes a esta semana y que reflejen la revisión con IA, las correcciones y la supervisión humana.
>
> Crea una rama nueva llamada ajuste-entrega-semana-6, aplica exclusivamente los cambios documentales, revisa el diff y crea un commit. No hagas push todavía.

| Fecha / entrada | IA e instrucción aplicada | Objetivo y respuesta | Problemas sugeridos / decisión | Corrección y evidencia del agente | Supervisión humana real / pendiente |
| --- | --- | --- | --- | --- | --- |
| 2026-11-14 / S6-01: revisión documental con IA | Codex; sintetizar el informe detallado, la bitácora y el JSON según los cuatro apartados oficiales | Contrastar fuentes, historial y líneas actuales de F-01, S-01, S-02, Q-01 a Q-04 y falsos positivos | Mantener S-02 abierto; descartar FP-01/FP-02 según las verificaciones históricas, sin inventar nuevos defectos | Creación de [informe oficial](../revision_seguridad.md), con archivos/líneas y commits obtenidos del repositorio; se conserva el [informe complementario](revision_seguridad.md) | La estudiante proporcionó la plantilla y delimitó el alcance. No se solicitó una nueva revisión independiente ni se atribuyen nuevas pruebas a la estudiante. |
| 2026-11-14 / S6-02: correcciones de entrega | Codex; ocho secciones de README, revisión de comandos y licencia sin inventar | Reorganizar instalación, ejecución, pruebas, estructura, IA y autoría; distinguir resultados históricos | No existe `LICENSE`; el manifiesto del backend declara MIT. Se deja pendiente la elección global. Instalación limpia no verificada | Actualización de [README](../README.md), contraste con scripts/manifiestos y declaración explícita de límites; sin modificar código ni dependencias | La estudiante aclaró que la licencia debe quedar pendiente si no está definida y que no se declare una instalación limpia sin comprobarla. Elección y validación final pendientes. |
| 2026-11-14 / S6-03: supervisión humana y trazabilidad | Codex; registrar únicamente comprobaciones humanas comunicadas y verificar referencias | Consolidar revisión de diffs, observación S-01 y resultados humanos de `npm ls minimatch` / `npm audit --omit=dev` | Las concatenaciones reportadas no se confirmaron; solo se corrigieron históricamente las tildes de «edición» y «conexión». La aceptación temporal de S-02 sigue siendo propuesta | El informe breve enlaza líneas reales y commits `9c72fbb`, `3ead49e`, `81a6cb4`; las suites anteriores conservan autoría del agente. La validación documental se registra abajo | Sí consta revisión humana parcial del diff, valoración del alcance de S-01 y los dos comandos reportados. No consta aprobación definitiva de S-02 ni aprobación académica global. |

Los antecedentes de S6-03 proceden de los seguimientos humanos ya registrados, no de nuevas ejecuciones humanas durante esta edición. No se repitieron PHPUnit, Vitest, E2E, compilación ni auditorías: el alcance es documental. No se operó sobre MySQL ni se cambiaron lockfiles. Quedan pendientes la instalación limpia, la licencia global y las confirmaciones humanas indicadas; no se consideran defectos corregidos por este ajuste.

### Validación documental ejecutada por el agente

| Comprobación / comando o mecanismo | Resultado de esta edición |
| --- | --- |
| `git status --short --branch` y `git log -7 --oneline` | Se partió de `main` limpio en `1adaacd`; se creó `ajuste-entrega-semana-6`. Solo se editan README, informe breve nuevo y esta bitácora. |
| `git ls-files -- '*.md'`, lectura UTF-8 y resolución de enlaces relativos con PowerShell/.NET | 10 documentos revisados, 39 enlaces relativos válidos; 14 referencias a líneas existentes y un ancla de encabezado resuelta. No se comprobaron URLs externas. |
| `Test-Path -LiteralPath` sobre rutas de código, scripts, originales y fuentes documentales citadas | 45 rutas existentes. Los ejemplos locales ignorados por Git no se presentan como archivos distribuidos con el repositorio. |
| Comparación de encabezados y entradas de bitácora | Ocho secciones exactas de README, cuatro del informe oficial y tres entradas adicionales de semana 6. Las entradas históricas se conservan. |
| `System.Management.Automation.Language.Parser.ParseInput` | Los 17 bloques PowerShell del README no tienen errores de sintaxis; **no fueron ejecutados**. La sintaxis no demuestra una instalación correcta. |
| Lectura de manifiestos/scripts, `JSON.parse` con Node y `git cat-file -e <commit>^{commit}` | S-02 coincide con minimatch 10.2.6 de desarrollo en el lockfile; el JSON de evidencia es legible y los cinco commits citados existen. Se contrastó `--tries` con `ServeCommand.php` instalado. |
| `git diff --check` | Sin errores de espacios en la revisión del diff; Git avisa de su conversión habitual LF/CRLF. Revisión final del contenido limitada a documentación. |

Un intento de leer `package-lock.json` con `ConvertFrom-Json` de Windows PowerShell falló por la clave vacía de `packages`; la comprobación se repitió correctamente con `JSON.parse` de Node, sin alterar el archivo. No se contó el intento fallido como validación aprobada. Todas estas comprobaciones son del agente, no de la estudiante. La paginación exacta del Markdown depende del exportador; el informe se mantiene breve para la extensión aproximada solicitada.

## Semana 7 — fase 2: generación y revisión de pruebas

Fecha: **22/11/2026, America/Bogota**. Herramienta: Codex, agente principal. Se mantuvo la rama `semana-7-pruebas`. Las actividades siguientes pertenecen al agente; la estudiante definió el alcance y las interpretaciones provisionales, pero no se presume su revisión personal de los archivos ni la aprobación de resultados.

**Prompt recibido, extractos literales:**

> Utiliza Vitest para las funciones reales de TypeScript y PHPUnit para las reglas reales de Laravel.
>
> No modifiques la lógica de producción para hacer pasar las pruebas.
>
> Registra qué casos conservaste, corregiste o descartaste y por qué.
>
> No atribuyas a la estudiante decisiones que todavía no haya verificado personalmente.
>
> Usa una base exclusiva de pruebas para cualquier operación con MySQL, conservando las protecciones de seguridad de la Semana 6.
>
> No declares completada la sección de errores intencionales todavía.

| Entrada | Trabajo del agente | Verificación real / correcciones | Supervisión humana y límites |
| --- | --- | --- | --- |
| S7-F2-01: generación trazable | Crear tres specs Vitest, proveedores `Semana7Data.php`, `Semana7ValidationTest.php` y `Semana7ApiTest.php`, importando reglas/componentes/solicitudes reales. `test.each()` y `DataProviderExternal`, esperados fijos, ASCII en límites y datos ficticios con tildes, ñ/apóstrofos. | TestBed obtiene formularios reales mediante FormGroupDirective; las pruebas Laravel ejecutan Validator/FormRequest y HTTP/MySQL. Se conservaron los archivos de prueba anteriores y la lógica de producción. Los esqueletos Artisan sin valor se sustituyeron antes de ejecutar pruebas de negocio. | A-01/A-02/A-03 son interpretaciones provisionales de la revisión académica recibidas en el prompt, no requisitos confirmados por el cliente. A-04/A-05 no se extendieron a Unicode ambiguo. |
| S7-F2-02: revisión técnica de IA | Evaluar cada ID F/T/E por fuente del esperado, fallo que discrimina y aporte/redundancia; registrar decisiones en [registro_pruebas.md](../registro_pruebas.md), sección 2. | Primer PHPUnit aislado: 117 casos, 73 aprobados y 44 errores del harness. Se corrigió Route sin enlazar y objetos PHP que no representaban la decodificación JSON de Laravel; segundo intento 117/117. No se cambiaron oráculos. Se añadió T-10 explícito de M espacios y se descartaron tres parámetros HTTP válidos redundantes con la matriz; no se eliminó ninguna prueba anterior. | Revisión realizada por Codex, no por la estudiante. Las hipótesis de errores detectables se evaluaron sin introducirlos: no son evidencia de mutación. Unicode, extremos de año, clave estado vacía, multizona específica y concurrencia real permanecen pendientes según el registro. |
| S7-F2-03: ejecución y datos | Base nueva `gestion_semana7_20261122_d6465605_testing`, migraciones no destructivas, guardias conservadas y transacciones por prueba. Ejecutar pruebas nuevas y suites completas con reportes JSON/JUnit locales en `artifacts/semana7/`. | Nuevas iniciales: Vitest 69/69, PHPUnit validación corregida 117/117 y API 175/175. Primera suite completa: Vitest 79/79, PHPUnit 320/320, 991 aserciones. Después de completar T-10, Vitest final 87/87; resultados finales PHP y detalle de comandos en sección 4 del registro. ESLint/Pint ejecutados; no se ejecutaron Playwright, Node ni pytest en esta fase. | La salida inicial de Angular fue bloqueo de lectura de OneDrive, no pruebas fallidas; se repitió con permisos adecuados. MySQL informó readiness aunque el script no detectó el puerto; PDO/migraciones/API funcionaron. No se modificaron scripts, dependencias ni archivos `.env`. |

Los comandos, conteos finales, errores intermedios, datos esperados/observados y límites se consolidan en el [registro de pruebas](../registro_pruebas.md). Los reportes ignorados por Git son evidencia local, no se presentan como archivos distribuidos al clonar. El registro guarda el resumen comprobado y los fuentes de pruebas conservan la trazabilidad de cada parámetro. No se introdujeron los tres errores intencionales, no se hizo push/merge ni se alteró el historial anterior. La revisión personal de la estudiante queda pendiente.

**Cierre comprobado de S7-F2-03 por Codex:** suite final Vitest **87/87** (79 nuevas y 8 anteriores); suite final PHPUnit **327/327**, **1014 aserciones** (299 nuevas y 28 anteriores). Cero fallos, errores y omitidas entre los casos implementados. Pint y ESLint finales aprobaron. La consulta de estado con guardia activa confirmó la base exclusiva y **0 asignaturas/0 tareas** después de las transacciones, sin limpieza destructiva. El aumento respecto de los primeros conteos procede de T-10 explícito y de las pruebas de componente de estados; se retiraron tres parámetros HTTP nuevos redundantes. No se sumaron repeticiones como nuevas pruebas.

## Semana 7 — fase final: mutaciones y entrega local

Fecha: **22/11/2026, America/Bogota**. Responsable de introducir/restaurar mutantes, ejecutar comandos y revisar evidencia: **Codex**. La estudiante autorizó expresamente esta fase; ello no equivale a afirmar que haya ejecutado o revisado personalmente sus resultados.

**Prompt recibido, extractos literales:**

> Ejecuta una sola mutación a la vez.
>
> No modifiques los resultados esperados de las pruebas para hacerlas pasar.
>
> No alteres las pruebas originales.
>
> Verifica mediante diff que el código de producción haya quedado exactamente igual al original.
>
> Prepara solamente los archivos de pruebas y documentación de la Semana 7.
>
> Crea un commit descriptivo en `semana-7-pruebas`.
>
> No hagas push ni merge.

| Entrada | Actividad y decisión del agente | Evidencia realmente observada |
| --- | --- | --- |
| S7-FINAL-01: seguridad y fechas | Verificar rama/status, conservar archivos no versionados, copiar bytes de producción y guardar hashes de producción/pruebas/configuración. Mutar solo `<` a `<=` en fechaNoPasada, línea 25. Restaurar con finally antes de continuar. | F-02 falló: esperaba null y obtuvo `{ pasada: true }`; F-01/F-03 aprobaron. Tras restaurar: 3/3 seleccionadas aprobaron; hash igual al original. No se usó reset/clean/restore de Git. |
| S7-FINAL-02: textos | Retirar temporalmente trim al contar texto, línea 17. No cambiar pruebas ni esperados. Repetir invocación tras error de quoting de npm.cmd. | Primer filtro con tubería terminó 255 porque T-10 fue interpretado como comando; no se contó como detección. Con filtro compatible `T-[01][01]`: siete fallos (T-01 con blancos/control y T-10 con 150/30/200/5000 espacios), esperaban required y recibieron null. Restauración exacta y 8/8 aprobadas. Se conservó el intento fallido. |
| S7-FINAL-03: estados | Desactivar temporalmente la guarda con `false &&` en TareaController::estado, línea 63. Validar base exclusiva mediante TestDatabaseSafety y comando de preflight; ejecutar solo estados/doble finalización. Restaurar inmediatamente. | Dos pruebas esperaban HTTP 422 y recibieron 200; una esperaba ValidationException y no se lanzó. Mutante: 3 fallidas y 8 aprobadas. Original restaurado: 11/11, 40 aserciones. La prueba anterior AcademicApiTest también detectó la mutación. |

Los cambios exactos, nombres completos de pruebas, comandos, hashes y resultados están en [registro_pruebas.md, sección 3](../registro_pruebas.md#3-romper-el-código-a-propósito). Las copias/diffs/logs temporales están en `artifacts/semana7/mutaciones-final/`, ignorado por Git. Se trabajó exclusivamente con la base existente de pruebas `gestion_semana7_20261122_d6465605_testing`; no se modificaron `.env`, bases de desarrollo, pruebas ni oráculos. No coexistieron dos mutantes. Se detectaron 3/3 mutantes manuales seleccionados; no se presenta como una medición exhaustiva de mutación ni como prueba de concurrencia.

**S7-FINAL-04, cierre automatizado por Codex:** después de restaurar los tres errores se volvieron a ejecutar las suites completas: **87/87 Vitest**, **327/327 PHPUnit y 1014 aserciones**, sin fallos, errores ni omitidas. ESLint y Pint aprobaron. Se comprobaron 93 entradas SHA-256 del manifiesto inicial, todas idénticas, incluidos archivos de producción, pruebas y `.env`; el diff de producción está vacío. La consulta posterior con guardia activa confirmó **0 asignaturas/0 tareas** en la misma base exclusiva. Comandos y reportes de esta ejecución final figuran en §3.4 del registro y `artifacts/semana7/mutaciones-final/`.

La entrega local selecciona exclusivamente seis archivos de pruebas y dos documentos de Semana 7. Las copias, logs/diffs y secretos permanecen ignorados, sin incorporarse al commit. Se conserva la rama, sin push/merge ni alteración del historial previo. La validación académica personal de la estudiante y los casos ambiguos o de infraestructura previamente pendientes no se declaran completados por estas pruebas de mutación.

## Semana 10 — auditoría y etapa 1: integración continua

Fecha real: **27/11/2026, America/Bogota**. Herramienta: Codex, agente principal; no se invocó un segundo agente en esta actividad. La estudiante entregó la rúbrica y autorizó cinco etapas técnicas, commits separados en `semana-10-entrega-final`, sin push ni integración a `main`, sin informe final ni diapositivas.

- **S10-AUD-01, auditoría previa:** inspección de los diez commits y cuatro ramas, DOCX mediante ZIP/XML, código, pruebas y reportes ignorados. ESLint, TypeScript de aplicación/pruebas y sintaxis PHP/PowerShell/Node aprobaron. No se repitieron entonces suites que escribieran archivos o datos. La API de GitHub confirmó cero workflows/ejecuciones/checks. Se identificaron carencias de fundamentos, operación, cobertura, evidencias portables y reflexión ética; se comprobó el error de suma de la matriz de diseño. No se atribuye ese error a IA sin prueba de su origen. La auditoría se entregó en conversación y se registra ahora, después de recibir autorización para escribir.
- **S10-CI-01, preparación:** rama creada desde `main` en `8657ed02e508d62475967b345514ff0373d912e8`. Workflow con MySQL efímero, usuario limitado a una base de pruebas, credencial ficticia y ningún secreto de producción; lockfiles, guardias y resultados esperados conservados. Acciones fijadas por SHA de sus repositorios oficiales. Reportes seleccionados con `always()` y retención de 14 días.
- **S10-CI-02, error real de la propuesta de Codex:** la primera versión puso `job.services.mysql.ports[3306]` en `jobs.verificar.env`. actionlint 1.7.12 lo rechazó: contexto `job` no disponible en ese nivel e índice numérico donde se exige cadena. Se corrigió en un paso de ejecución mediante `job.services.mysql.ports['3306']` y `GITHUB_ENV`. Log inicial local: `artifacts/semana10/actionlint-inicial.log`. No se presenta esa versión como pipeline ejecutado; la validación corregida se registra en CI y en el resumen de evidencias.

La revisión y las pruebas realizadas por Codex no equivalen a una aprobación académica personal de la estudiante. La ejecución remota queda pendiente del push; la licencia global y S-02 permanecen pendientes. Las actividades siguientes se añadirán con sus resultados reales.

### S10-TEST-01 — etapa 2: pruebas y cobertura

27/11/2026, Codex. Se añadió únicamente `@vitest/coverage-v8` 5.1.0 compatible con Vitest instalado; doce paquetes dev nuevos y ninguna versión preexistente modificada. Configuración CI con cobertura amplia de `src/app`, reportes JSON/JUnit/HTML/LCOV, y PHP/Xdebug 3.5.3 sobre todo `app/`. Se conservan pruebas, oráculos y lógica del producto.

Resultados locales: Vitest 87/87; PHPUnit 327/327, 1014 aserciones; ESLint y TypeScript salida 0; compilación 310,33 kB; Node 3/3. Cobertura frontend: 195/319 líneas (61,12 %), ramas 132/188 (70,21 %); fechas 8/8 líneas (100 %). Backend global: 83/112 (74,11 %); HTTP/modelos: 65/66 (98,48 %), 23/24 métodos. No se midieron ramas PHP. Ámbito, exclusiones y limitaciones: `docs/COBERTURA_Y_PRUEBAS_S10.md`.

Se creó una base nueva y un usuario limitado sin acceso a desarrollo, comprobando un rechazo real de permisos. Incidentes: compilación inicial bloqueada por sandbox/OneDrive; carga de variables PHP bloqueada por política PowerShell que permitió continuar inicialmente sobre la base `_testing` anterior (ejecución detenida y sustituida por carga inline con fallo cerrado); detección de puerto MySQL restringida por sandbox; advertencia stderr interpretada como error por PowerShell en primera invocación E2E. No se presentan esos intentos como gates aprobados ni se afirma un snapshot previo inexistente de la base de pruebas anterior. Se repitieron los comandos corrigiendo el entorno de invocación, sin cambiar esperados. Detalles y reportes en el documento de pruebas. La ejecución remota permanece pendiente.

### S10-DOC-01 — etapa 3: reconciliación documental

27/11/2026, Codex, a petición explícita de la estudiante. Se crea `docs/ADENDA_REQUISITOS_DISENO_S10.md`: HU-08-R1 cambia formalmente el requisito original de localStorage por API/MySQL, conserva necesidad de persistencia y sustituye el escenario de caché corrupta por recuperación de error de conexión. Distingue recarga del navegador de reinicio de servicios. Corrige por cálculo la matriz (66/90/79), mantiene ADR-001, registra ambos textos obligatorios, PUT completo, PATCH separado y descripción en el modelo. Conserva ambigüedades A-04/A-05/A-08 sin inventar decisiones del cliente. Los DOCX no se modifican y sus SHA-256 coinciden con los originales; las correcciones se fechan en semana 10, no retrospectivamente. La revisión académica de la estudiante queda pendiente.

### S10-OPS-01 — etapa 4: despliegue y operación local

27/11/2026, Codex. Se preparan guía y plan para un usuario en loopback, sin autenticación ni afirmación de producción pública. Copia nueva extraída de `7c4b865`, sin vendor/node_modules; instalaciones completas desde lockfiles, dos migraciones desde cero y seeder sintético en otra base nueva con usuario limitado. Build desde esa copia aprobado. API aislada 8002 y frontend/proxy 4301 respondieron 200: cuatro asignaturas y cinco tareas, tanto directamente como por proxy. Los procesos propios se detuvieron en finally.

Se exportó con mysqldump sin contraseña en argumentos y se restauró con mysql en otra base comprobada vacía. Conteos y huellas de todas las filas de asignaturas/tareas/migrations coinciden. Se volvió a iniciar la aplicación apuntando a la base restaurada: cuatro GET 200 y conteos 4/5; después se detuvieron los servidores propios. Respaldo/archivos de credenciales privados permanecen ignorados; resumen portable en `docs/evidencias/semana10/operacion.json`. La base de desarrollo no fue destino de migraciones, seeders o restauración.

Las invocaciones iniciales de instalación tuvieron problemas de captura local: redirección con demasiados niveles relativos impidió iniciar npm y PowerShell interpretó el progreso stderr de Composer como excepción. Se corrigieron las rutas y se capturó stdout/stderr en el proceso nativo; solo las instalaciones completas con salida 0 se cuentan como aprobadas. npm ci advirtió scripts de instalación no aprobados; el build posterior desde dependencias nuevas aprobó. No se cambió código para ocultar esos intentos.

No se ejecutó apagado global MySQL, reinstalación completa de binarios en otra máquina, incidente real ni despliegue público. La reversión de configuración se ejercitó contra datos restaurados; la reversión entre versiones con esquemas diferentes sigue sin comprobarse. No se otorga aprobación humana ni se elige licencia global.

### S10-EVD-01 — etapa 5: organización y trazabilidad

27/11/2026, Codex. README principal y de componentes actualizados; índice documental por seis módulos; catálogo de casos que distingue testimonios de requisitos/diseño, reportes de pruebas y el error nuevo de configuración CI. Se conservan documentos originales e históricos; las ausencias (propuesta inicial, transcripción y respuestas originales de IA) quedan asignadas a recuperación por la estudiante, sin reconstruirlas. No se redacta informe integrador ni presentación.

Se incorporan resúmenes pequeños de reportes S6/S7 y S10, métricas por archivo con rutas relativas, operación y aislamiento. Los originales que E2E iba a reemplazar se copiaron antes a `artifacts/semana10/historicos/`. El exportador `scripts/resumir-evidencias.php` no lee credenciales, no copia mensajes completos y marca reportes ausentes. Se comprobó con los seis reportes disponibles y con un directorio aislado sin ellos: informa seis ausencias y no inventa suites aprobadas. Sintaxis PHP y Pint aprobaron; actionlint final 0. El workflow exporta el resumen antes de conservar artefactos, incluso tras fallos si PHP está disponible.

Cierre de ejecuciones: Playwright final 10/10, salida 0, 31,14 s; RNF-01 449/324/322 ms. La comparación final conservó cantidades de desarrollo (5 asignaturas/3 tareas) y hashes de `.env`/`.env.testing`; el usuario dedicado fue rechazado al consultar desarrollo. Esto no se presenta como un snapshot previo completo de sus filas.

**Seguridad actual:** npm total salida 1, siete paquetes de desarrollo por GHSA-g3hv-75wg-m249; npm producción salida 0, cero avisos. Una consulta se prolongó; la consulta posterior con timeout explícito también devolvió resultados válidos. Composer salida 1: cinco avisos publicados el 25/11/2026 en http-kernel, mailer y routing, posteriores al informe S6. Se documentan abiertos con versiones y referencias del proveedor. `composer.lock` sigue intacto; no se afirma que los tests solucionen esos avisos. S-02 conserva su estado y aprobación humana pendiente; no se elige licencia global.

Las referencias Markdown locales de los documentos nuevos/modificados se comprobaron, sin destinos faltantes. La selección versionable se contrastó con secretos locales conocidos y no contiene coincidencias ni rutas personales en sus resúmenes. Los DOCX conservan sus SHA originales; `frontend/src`, `backend/app`, migraciones, rutas, pruebas anteriores y `composer.lock` no tienen diferencias respecto de main. Quedan pendientes ejecución remota tras push, revisión humana, documentos históricos ausentes, reflexión ética/política de uso/licencia y los límites de pruebas ya registrados. No hubo push, merge ni segunda revisión independiente durante estas actividades.
