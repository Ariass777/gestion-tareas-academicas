# Bitácora de IA — revisión del primer incremento

Fecha de esta actividad: **14 de noviembre de 2026**, zona `America/Bogota`. Algunas herramientas registran timestamps UTC del 15 de noviembre; corresponden todavía al día 14 en Colombia.

Rama de trabajo: `revision-calidad-seguridad`. Commit inicial: `a4d34de`. El commit final puede consultarse con `git log -1 --oneline`; no se realizó push.

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
