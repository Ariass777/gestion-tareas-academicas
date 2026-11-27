# Base de evidencias para el informe final — semana 10

**Corte: 27 de noviembre de 2026, America/Bogota.** Proyecto: Sistema Web de Gestión de Tareas Académicas (interfaz «Académica»). Estudiante identificada en los documentos originales: Linda Verónica Arteaga Arias. Este archivo reúne fuentes y límites verificables; no constituye el informe final, una reflexión personal de la estudiante ni una certificación de cumplimiento de la rúbrica.

- [Repositorio público](https://github.com/Ariass777/gestion-tareas-academicas), [código integrado en main](https://github.com/Ariass777/gestion-tareas-academicas/tree/main), [PR #4 integrado](https://github.com/Ariass777/gestion-tareas-academicas/pull/4).
- [Pipeline aprobado sobre el merge de main: 46018960368](https://github.com/Ariass777/gestion-tareas-academicas/actions/runs/46018960368), SHA **6b5b57aa16731d8fdd6d738bc50f2861c6684613**, job único `verificar`: success.
- [Metadatos del cierre y pasos del job](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/evidencias/semana10/cierre-main.json), [resultados exportados del runner](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/evidencias/semana10/resultados-main.json).
- La revisión de cierre comprobó la rama publicada en `5933802faea0d1e12a8c3779ebe6836634a93ccd`, árbol limpio, checks de push/PR aprobados y ausencia de conflictos antes del merge. Se conservaron los nueve commits técnicos/documentales mediante un commit de merge. La publicación de esta base documental produce una ejecución posterior; no se atribuye este documento al SHA anterior.

## Problema, usuario y objetivos sustentados

El problema documentado es organizar entregas académicas dispersas y reducir olvidos/acumulación de actividades. El usuario objetivo es un estudiante que registra asignaturas, tareas, fechas, prioridades y avances. La fuente de requisitos describe una **entrevista simulada**, no una entrevista de campo acreditada; la transcripción completa no está en el repositorio. No se inventa cómo una persona concreta gestionaba sus tareas antes ni resultados de adopción.

Los objetivos derivados del alcance documentado son centralizar asignaturas y tareas, consultar pendientes por fecha, filtrar y actualizar el progreso, conservar la información al recargar y verificar el sistema con pruebas. El objetivo académico es aplicar IA con revisión crítica durante el ciclo de vida. Estos objetivos sintetizan los documentos existentes; no representan nuevos acuerdos con un cliente.

Evidencias: [requisitos S3, versión 24/10/2026](https://github.com/Ariass777/gestion-tareas-academicas/blob/a4d34de6ded5c48f19eb09bc50c2f3b30525e38a/docs/Arteaga_Veronica_S3_Requisitos.docx), [README](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/README.md), [adenda S10](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/ADENDA_REQUISITOS_DISENO_S10.md). La propuesta inicial del módulo 1 no se recuperó: debe aportarla la estudiante si existe.

## Arquitectura, tecnologías y decisiones

Arquitectura de tres capas: Angular standalone y formularios reactivos → API REST Laravel (validación, controladores, recursos y Eloquent) → MySQL. MySQL es la única persistencia; no hay almacenamiento de tareas en localStorage ni IA ejecutándose dentro del producto. Es una demostración local de un usuario, sin autenticación.

| Componente | Estado comprobado | Evidencia |
|---|---|---|
| Frontend | Angular 22.2.6, CLI 22.2.7, TypeScript 6.0.3 estricto; rutas Inicio, Asignaturas y Tareas; HttpClient. | [lockfile](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/frontend/package-lock.json), [rutas](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/frontend/src/app/app.routes.ts), [servicio HTTP](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/frontend/src/app/services/academico.service.ts) |
| Backend | Laravel 13.42.0; PHP 8.5; FormRequests, Resources y Eloquent. | [lockfile](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/backend/composer.lock), [código](https://github.com/Ariass777/gestion-tareas-academicas/tree/main/backend/app) |
| Datos | MySQL 8.4; Asignatura 1:N Tarea; FK con restricción de borrado; descripción incluida en Tarea. | [migraciones](https://github.com/Ariass777/gestion-tareas-academicas/tree/main/backend/database/migrations), [modelos](https://github.com/Ariass777/gestion-tareas-academicas/tree/main/backend/app/Models) |
| Diseño/ADR | C4, modelo y ADR-001 dentro del DOCX S4 del 31/10/2026; el ADR no es un archivo separado. | [DOCX original](https://github.com/Ariass777/gestion-tareas-academicas/blob/a4d34de6ded5c48f19eb09bc50c2f3b30525e38a/docs/Arteaga_Veronica_S4_Dise%C3%B1o.docx), [decisiones implementadas](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/DECISIONES.md) |
| Entorno de CI | Ubuntu 24.04, Node 24.19.0, PHP 8.5, Xdebug, MySQL efímero 8.4; instalación desde lockfiles. | [workflow](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/.github/workflows/ci.yml), [pasos ejecutados](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/evidencias/semana10/cierre-main.json) |

La adenda del 27/11 conserva los DOCX originales y declara el cambio de localStorage a MySQL, HU-08-R1 y sus criterios, campos obligatorios, modelo con descripción y contrato real de PUT/PATCH. Corrige la matriz ponderada S4: **66/90/79**, frente a 63/86/73; B sigue ganando. No se atribuye ese error aritmético a IA sin evidencia. [Adenda y hashes de los originales](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/ADENDA_REQUISITOS_DISENO_S10.md), commit [7c4b865fff4dd6fa4ef3e664381723cd31eae0ce](https://github.com/Ariass777/gestion-tareas-academicas/commit/7c4b865fff4dd6fa4ef3e664381723cd31eae0ce).

## Funcionalidades y requisitos Must

| Historia | Estado al cierre | Evidencia |
|---|---|---|
| HU-01 Must: registrar asignatura | Implementada: nombre y código obligatorios; listado. | [API de asignaturas](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/backend/app/Http/Controllers/Api/AsignaturaController.php), [pruebas API](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/backend/tests/Feature/AcademicApiTest.php) |
| HU-02 Must: crear tarea | Implementada: título, descripción, asignatura, fecha y prioridad obligatorios. | [validación](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/backend/app/Http/Requests/SaveTareaRequest.php), [formulario](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/frontend/src/app/components/tarea-form.component.ts) |
| HU-03 Must: consultar pendientes por fecha | Implementada; filtros por estado/prioridad y orden por fecha e id. | [API de tareas](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/backend/app/Http/Controllers/Api/TareaController.php), [página](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/frontend/src/app/pages/tareas/tareas.component.ts) |
| HU-04 Must: actualizar estado | Implementada; PATCH de estado; rechazo de completar nuevamente una tarea ya completada. | [controlador](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/backend/app/Http/Controllers/Api/TareaController.php), [pruebas S7](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/backend/tests/Feature/Semana7ApiTest.php) |
| HU-05, HU-06, HU-07 | Filtro de prioridad, eliminación con confirmación/cancelación y edición implementados. | [E2E CRUD/filtros](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/frontend/e2e/academica.spec.ts) |
| HU-08 → HU-08-R1 | Persistencia MySQL al recargar comprobada. El criterio original de caché local corrupta fue sustituido, no aprobado. Falta probar por separado el cierre/reinicio completo de MySQL con el mismo directorio (CA-08-R1-04). | [adenda](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/ADENDA_REQUISITOS_DISENO_S10.md), [E2E](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/frontend/e2e/academica.spec.ts) |

Contrato: GET/POST `/api/asignaturas`; GET/POST `/api/tareas`; PUT `/api/tareas/{id}` para edición completa de datos; PATCH `/api/tareas/{id}/estado`; DELETE `/api/tareas/{id}`. Creación 201, consulta/actualización 200, borrado 204, inexistente 404, entrada inválida 422. Datos con envoltura `data`. Título y descripción son ambos obligatorios; PUT no sustituye PATCH de estado. [Rutas](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/backend/routes/api.php), [contrato reconciliado](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/ADENDA_REQUISITOS_DISENO_S10.md).

Las fechas se interpretan como calendario de Colombia: creación desde hoy; edición permite conservar una fecha vencida idéntica, pero exige hoy o posterior si cambia. Las interpretaciones A02/A03 y otras ambigüedades conservan sus límites de aprobación en [DECISIONES](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/DECISIONES.md); una prueba aprobada no transforma esas interpretaciones en una nueva validación con cliente.

## IA en los seis módulos: evidencia histórica frente a semana 10

| Módulo/fase | Actividad y herramienta acreditadas | Verificación y límites | Evidencia pública |
|---|---|---|---|
| 1. Fundamentos | No se encontró la propuesta inicial ni una herramienta acreditada para esa actividad. | No se completa retrospectivamente con una actividad S10. Recuperación pendiente. | [Inventario documental](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/README.md) |
| 2. Requisitos | S3 atribuye a ChatGPT/Gemini apoyo para HU, escenarios, RNF y trazabilidad; conserva fichas de prompts. | Revisión de alcance registrada por la autora. Entrevista simulada y respuestas originales incompletas; testimonio documental, no reproducción independiente. | [S3](https://github.com/Ariass777/gestion-tareas-academicas/blob/a4d34de6ded5c48f19eb09bc50c2f3b30525e38a/docs/Arteaga_Veronica_S3_Requisitos.docx) |
| 3. Diseño | S4 atribuye a ChatGPT/Gemini comparación de alternativas, C4, modelo y API. | Contraste con HU y normalización documentados. Adenda S10 corrige discrepancias sin alterar el original. | [S4](https://github.com/Ariass777/gestion-tareas-academicas/blob/a4d34de6ded5c48f19eb09bc50c2f3b30525e38a/docs/Arteaga_Veronica_S4_Dise%C3%B1o.docx), [adenda](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/ADENDA_REQUISITOS_DISENO_S10.md) |
| 4. Código | Codex para implementación/revisión; bitácora S6 declara agente principal y revisión independiente gpt-6-astra. | Linter, compilación, revisión y regresiones. No están todas las respuestas iniciales; esta actividad S10 no tuvo una nueva revisión independiente por otro agente. | [bitácora](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/bitacora_ia.md), [revisión S6](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/revision_seguridad.md), [validación](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/VALIDACION.md) |
| 5. Pruebas | Codex para plan, casos parametrizados y mutaciones manuales S7. En S10: instrumentación V8/Xdebug y conservación de reportes. | Se detectó y corrigió un arnés de pruebas equivocado; suites ejecutadas y mutaciones restauradas. | [registro S7](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/registro_pruebas.md), [resumen histórico](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/evidencias/historico/resumen_s6_s7.json), [cobertura S10](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/COBERTURA_Y_PRUEBAS_S10.md) |
| 6. Operación | Codex, **27/11/2026**, para Actions, aislamiento, despliegue/operación, revisión de avisos y cierre técnico. | actionlint, dos fallos remotos reales, reproducción CORS, corrección, instalación limpia y restauración sintética; aprobación de main. | [CI](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/CI.md), [registro remoto](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/VALIDACION_REMOTA_S10.md), [operación ejecutada](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/evidencias/semana10/operacion.json), [pipeline main](https://github.com/Ariass777/gestion-tareas-academicas/actions/runs/46018960368) |

Las fechas S3/S4 son fechas de los documentos; su primera incorporación a Git fue el 14/11 en [a4d34de6ded5c48f19eb09bc50c2f3b30525e38a](https://github.com/Ariass777/gestion-tareas-academicas/commit/a4d34de6ded5c48f19eb09bc50c2f3b30525e38a). La ampliación de pruebas S7 se incorporó el 22/11 en [a63504a519bd6ad1d59f143a78aeb6e4b4098220](https://github.com/Ariass777/gestion-tareas-academicas/commit/a63504a519bd6ad1d59f143a78aeb6e4b4098220). Todo lo nuevo de preparación y cierre S10 se registra el **27/11**, incluida la elaboración asistida de esta base, sin trasladarlo a semanas anteriores. [Bitácora](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/bitacora_ia.md).

## Casos reales de verificación y fuerza de sus evidencias

### Caso 1 — Requisitos: funciones sin respaldo

- **Propuesta atribuida a IA:** notificaciones push y sincronización con Google Calendar (ChatGPT/Gemini según S3).
- **Error:** ampliaban el alcance sin respaldo.
- **Detección:** contraste con alcance/HU, registrado en apartado 7 y ficha de prompt 2.
- **Corrección registrada:** retirar funciones y escenarios ajenos.
- **Commit asociado:** [a4d34de6ded5c48f19eb09bc50c2f3b30525e38a](https://github.com/Ariass777/gestion-tareas-academicas/commit/a4d34de6ded5c48f19eb09bc50c2f3b30525e38a), que archiva el documento corregido.
- **Límite:** no hay respuesta original ni commit aislado del antes/después; no se presenta a4d34de como tal. [Fuente S3](https://github.com/Ariass777/gestion-tareas-academicas/blob/a4d34de6ded5c48f19eb09bc50c2f3b30525e38a/docs/Arteaga_Veronica_S3_Requisitos.docx).

### Caso 2 — Diseño: rutas y servicios no justificados

- **Propuesta atribuida a IA:** servicios externos, rutas inconsistentes y atributos sin respaldo, según apartado 7 de S4.
- **Error:** incoherencia con HU y modelo mínimo.
- **Detección:** revisión de alcance y convenciones HTTP/JSON, según documento.
- **Corrección registrada:** eliminar externos, normalizar `/api`, separar PATCH de estado y conservar modelo mínimo.
- **Commit asociado:** [a4d34de6ded5c48f19eb09bc50c2f3b30525e38a](https://github.com/Ariass777/gestion-tareas-academicas/commit/a4d34de6ded5c48f19eb09bc50c2f3b30525e38a), primera versión archivada.
- **Límite:** faltan borrador y respuestas originales. No se inventa una ruta incorrecta literal; tampoco se atribuye a IA la matriz corregida en S10. [Fuente S4](https://github.com/Ariass777/gestion-tareas-academicas/blob/a4d34de6ded5c48f19eb09bc50c2f3b30525e38a/docs/Arteaga_Veronica_S4_Dise%C3%B1o.docx).

### Caso 3 — Pruebas: contexto Laravel preparado incorrectamente

- **Propuesta real de Codex:** usar Route sin enlazar y enviar `stdClass` directamente al validador.
- **Error:** arnés incompatible con el contexto de solicitud/JSON: `Route is not bound`, errores de `mb_strlen` y conversión.
- **Detección ejecutada:** 117 casos iniciales, 73 aprobados y **44 errores**, sin fallos de aserción.
- **Corrección:** enlazar la ruta para edición y transformar por JSON asociativo; **117/117 y 231 aserciones** después. No cambiar producción ni esperados.
- **Commit:** [a63504a519bd6ad1d59f143a78aeb6e4b4098220](https://github.com/Ariass777/gestion-tareas-academicas/commit/a63504a519bd6ad1d59f143a78aeb6e4b4098220); [fuente corregido](https://github.com/Ariass777/gestion-tareas-academicas/blob/a63504a519bd6ad1d59f143a78aeb6e4b4098220/backend/tests/Unit/Semana7ValidationTest.php).
- **Evidencia/límite:** [registro §2.3](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/registro_pruebas.md#23-correcciones-y-descartes-reales), [resumen de JUnit históricos](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/evidencias/historico/resumen_s6_s7.json). El borrador fallido no tuvo commit; los reportes originales se conservan localmente, no todos están publicados.

### Caso 4 — Operación: CI heredaba un origen CORS incorrecto

**Sí puede documentarse como cuarto caso**, con esta atribución precisa: Codex preparó el workflow que copiaba el ejemplo con origen 4300 y omitía fijar 4200. Es una propuesta de integración incompleta de IA en S10; **no está acreditado que la línea 4300 del ejemplo histórico fuera originalmente propuesta por IA**.

- **Propuesta:** CI desde `.env.testing.example` sin reconciliar CORS con el contrato probado.
- **Error:** el ejemplo tenía FRONTEND_URL=4300; la prueba esperaba el origen de desarrollo 4200. El entorno local ya usaba 4200 y ocultó la divergencia.
- **Detección:** [push fallido 46012886635](https://github.com/Ariass777/gestion-tareas-academicas/actions/runs/46012886635) y [PR fallido 46012965021](https://github.com/Ariass777/gestion-tareas-academicas/actions/runs/46012965021), ambos sobre `6a594fe7001b3d192650ad7e4b1ee59dbc2712cb`: 327 casos/1011 aserciones, un fallo CORS por ausencia de Access-Control-Allow-Origin. Los pasos posteriores fueron omitidos, no aprobados.
- **Reproducción local:** 4300 → un fallo/3 aserciones; 4200 → 1/1 y 6 aserciones.
- **Corrección:** alinear ejemplo a 4200 y fijarlo explícitamente en workflow; sin ampliar CORS ni cambiar pruebas.
- **Commit:** [f5363225f5ece9c8787f067b14ab3d9ac14aea70](https://github.com/Ariass777/gestion-tareas-academicas/commit/f5363225f5ece9c8787f067b14ab3d9ac14aea70). [Primera ejecución aprobada](https://github.com/Ariass777/gestion-tareas-academicas/actions/runs/46015394370); [confirmación en main](https://github.com/Ariass777/gestion-tareas-academicas/actions/runs/46018960368).
- **Cadena de origen:** [workflow preparado por Codex en e394d79](https://github.com/Ariass777/gestion-tareas-academicas/blob/e394d79b00656eff97bcf7a8f6d37878ed8cb841/.github/workflows/ci.yml), [ejemplo histórico con 4300](https://github.com/Ariass777/gestion-tareas-academicas/blob/a4d34de6ded5c48f19eb09bc50c2f3b30525e38a/backend/.env.testing.example), [bitácora S10](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/bitacora_ia.md), [síntesis de fallos](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/evidencias/semana10/ci-fallos.json).

El error de contexto de Actions detectado por actionlint es evidencia complementaria de **la misma fase operación**: acceso a `job.services.mysql.ports[3306]` en un nivel no válido; corregido en el primer commit [e394d79b00656eff97bcf7a8f6d37878ed8cb841](https://github.com/Ariass777/gestion-tareas-academicas/commit/e394d79b00656eff97bcf7a8f6d37878ed8cb841), con [salida fallida conservada](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/evidencias/semana10/actionlint-fallo.txt). El borrador incorrecto no fue un commit publicado.

La regresión de fecha en Tokio tiene corrección y prueba en [80c19176ee72278735979c60ed05c1d2cb0c305f](https://github.com/Ariass777/gestion-tareas-academicas/commit/80c19176ee72278735979c60ed05c1d2cb0c305f); falta acreditar la respuesta IA inicial para atribuir el defecto. Las tres mutaciones manuales S7 prueban sensibilidad de tests: no son tres errores espontáneos de IA ni tres fases. [Detalle de casos y límites](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/CASOS_VERIFICACION_IA.md). Los casos 1 y 2 siguen siendo evidencia documental más débil; no se garantiza nivel excelente sin recuperar sus fuentes.

## Pruebas y cobertura definitivas del sistema integrado

Resultados **ejecutados remotamente**, no solo descritos, sobre SHA `6b5b57aa16731d8fdd6d738bc50f2861c6684613`:

| Comprobación | Resultado real |
|---|---|
| Vitest | 87/87, siete archivos, cero fallidas/pendientes. |
| PHPUnit | 327/327, 1014 aserciones, cero fallos/errores/omitidas. |
| Guardas Node del servidor E2E | 3/3; comprobado en el log del job. |
| Playwright/Chromium | 10/10, cero omitidas, inesperadas, inestables o errores globales; 11,51 s. |
| ESLint, TypeScript, compilación Angular | Pasos success; no se desactivaron controles para aprobar. |
| Exportación y artefactos | Success, sin reportes ausentes; conservación 14 días en Actions. |

Fuente común: [ejecución main](https://github.com/Ariass777/gestion-tareas-academicas/actions/runs/46018960368), [job y pasos](https://github.com/Ariass777/gestion-tareas-academicas/actions/runs/46018960368/job/140573290983), [resumen portable](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/evidencias/semana10/resultados-main.json), [metadatos/digest del artefacto](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/evidencias/semana10/cierre-main.json).

PHPUnit comprende 121 casos de validación que necesitan Laravel y 206 Feature (178 API S7, 21 API iniciales, siete guardas). No son 327 pruebas unitarias puras. E2E usa API/MySQL reales; únicamente el escenario explícito de vacío/error de red simula respuestas. [Tests backend](https://github.com/Ariass777/gestion-tareas-academicas/tree/main/backend/tests), [E2E](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/frontend/e2e/academica.spec.ts), [desglose](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/COBERTURA_Y_PRUEBAS_S10.md).

| Alcance | Líneas | Otras métricas y límites |
|---|---|---|
| Frontend completo `src/app`, 14 archivos | **195/319 = 61,12 %** | Sentencias 273/428 = 63,78 %; funciones 43/112 = 38,39 %; ramas 132/188 = 70,21 %. V8/Vitest. |
| Regla de fechas | 8/8 = 100 % | Ramas 10/11 = 90,90 %. |
| Formulario de tarea | 80/80 = 100 % | Este subconjunto no representa todo el frontend. |
| Backend completo `app`, 15 archivos | **83/112 = 74,11 %** | Métodos 25/29 = 86,21 %. PHPUnit/Xdebug. |
| Subconjunto declarado HTTP + modelos | **65/66 = 98,48 %** | Métodos 23/24 = 95,83 %; falta relación Asignatura::tareas. No es la cobertura global. |

Frontend conserva Inicio 0 %, servicio HTTP 5,55 % y página Tareas 48,07 %; no se ocultaron para elevar el total. El reporte no mide HTML/CSS ni cobertura combinada con E2E. Backend excluye vendor/tests/bootstrap/routes/config/migraciones/factories/seeders del conjunto `app`; **no se midieron ramas PHP** y cero condiciones no significa 100 %. [Configuración y exclusiones](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/COBERTURA_Y_PRUEBAS_S10.md), [datos completos por archivo](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/evidencias/semana10/resultados-main.json).

RNF-01 con 200 tareas: 207/148/153 ms en tres muestras del runner, API 30/22/21 ms, por debajo de 1500 ms en esa ejecución. No acredita concurrencia ni rendimiento en otro equipo. [Muestras](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/evidencias/semana10/resultados-main.json).

## Seguridad y auditorías de dependencias

El 27/11 se detectaron cinco avisos Symfony de producción y un aviso raíz de minimatch de desarrollo (siete paquetes afectados por propagación, no siete vulnerabilidades independientes). Tras propuesta/simulación y autorización explícita de ambas actualizaciones:

| Dependencia | Avisos y aplicabilidad revisada | Corrección autorizada |
|---|---|---|
| Symfony http-kernel | CVE-2026-133743: subsolicitudes/fragmentos y encabezados reenviados; no se encontró uso propio de Twig/fragmentos. El alcance local no descarta automáticamente esta CVE. | http-kernel y http-foundation 8.1.12 |
| Symfony mailer | CVE-2026-133751 y CVE-2026-133755: negociación TLS/SMTP; no hay función de correo y se usa log/array. | mailer 8.1.12 |
| Symfony routing | CVE-2026-133746 y CVE-2026-133754: generación de URL/host; Laravel usa su propio generador y no se halló entrada de API hacia esos casos Symfony. | routing 8.1.12 |
| minimatch | GHSA-g3hv-75wg-m249 / CVE-2026-118764; desarrollo, amplification con optimizationLevel >= 2. Ruta inspeccionada de typescript-estree no activa ese modo ni recibe patrones de API. | typescript-eslint 8.74.0 incorpora minimatch 11.0.9; sin override. |

Commits: [Symfony d1d387d9e7b83757964d0dd7368e84e3b4090bfe](https://github.com/Ariass777/gestion-tareas-academicas/commit/d1d387d9e7b83757964d0dd7368e84e3b4090bfe), [typescript-eslint d8a0cccbdc822e7317ed76e2a69ef570577bbe56](https://github.com/Ariass777/gestion-tareas-academicas/commit/d8a0cccbdc822e7317ed76e2a69ef570577bbe56). Sin cambiar PHP/Angular/TypeScript ni lógica del producto. La evaluación de aplicabilidad es acotada, sin explotación reproducida; no niega que las versiones anteriores estuvieran afectadas.

Auditorías posteriores reales del 27/11: **Composer locked cero avisos/cero abandonados; npm árbol completo cero avisos**. No se ejecuta un gate de auditorías en CI: las auditorías conservadas son locales y el pipeline valida compatibilidad con los lockfiles actualizados. No equivalen a ausencia de futuras vulnerabilidades ni a pentest. [Auditorías posteriores](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/evidencias/semana10/seguridad-actualizada.json), [anteriores preservadas](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/evidencias/semana10/seguridad.json), [análisis y consecuencias](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/SEGURIDAD_DEPENDENCIAS_S10.md). Referencias primarias: [Symfony kernel](https://symfony.com/cve-2026-133743), [mailer 133751](https://symfony.com/cve-2026-133751), [mailer 133755](https://symfony.com/cve-2026-133755), [routing 133746](https://symfony.com/cve-2026-133746), [routing 133754](https://symfony.com/cve-2026-133754), [minimatch](https://github.com/advisories/GHSA-g3hv-75wg-m249).

## Despliegue, operación y dilema de aislamiento

La [guía de despliegue local](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/GUIA_DESPLIEGUE_LOCAL.md) y el [plan de operación](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/PLAN_OPERACION_LOCAL.md) documentan entorno, instalación limpia, variables, MySQL, migraciones, arranque/apagado, comprobaciones, respaldos/restauración, monitoreo, incidentes, mantenimiento y reversión. Commit [06c6b4f21e46d3dc9ec3070061e57faeece25049](https://github.com/Ariass777/gestion-tareas-academicas/commit/06c6b4f21e46d3dc9ec3070061e57faeece25049).

**Ejecutado con seguridad:** copia nueva del código con herramientas existentes; instalación desde locks; dos migraciones; semilla sintética de cuatro asignaturas/cinco tareas; build; API y proxy HTTP 200; apagado de los servidores propios; respaldo con mysqldump y restauración en otra base vacía con comparación de hashes de filas y consultas posteriores. **Solo documentado o pendiente:** instalar todas las herramientas en otra máquina, reinicio global de MySQL con el mismo directorio, incidente real, despliegue público. No se acredita un simulacro de incidentes por haber redactado el procedimiento. [Evidencia de operación](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/evidencias/semana10/operacion.json).

**Dilema ético real:** verificar CRUD, limpieza de fixtures y rendimiento con una base real podía dañar tareas académicas si se reutilizaba una conexión de desarrollo. Se eligió una base descartable con usuario exclusivo, transacciones y datos sintéticos; CI crea además una instancia efímera y permisos limitados al esquema. El guard rechaza falta de `.env.testing`, configuración cacheada, entorno distinto de testing, DB_URL o nombre sin sufijo `_testing`. La preparación E2E rechaza tareas ajenas a sus fixtures. No se provocó pérdida de datos reales para demostrar el riesgo.

El sufijo por sí solo **no acredita que una base esté vacía ni identifica su servidor**. Se comprobó adicionalmente que el usuario de pruebas no accediera a la base de desarrollo; conteos antes/después permanecieron cinco asignaturas/tres tareas y hashes de configuración iguales. Son conteos, no comparación completa del contenido. [Guard](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/backend/app/Support/TestDatabaseSafety.php), [TestCase](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/backend/tests/TestCase.php), [pruebas de seguridad](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/backend/tests/Feature/TestDatabaseSafetyTest.php), [aislamiento observado](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/evidencias/semana10/aislamiento.json), [revisión histórica de ese límite](https://github.com/Ariass777/gestion-tareas-academicas/commit/3ead49e7570824b3cc20741b19cbd470115ae9c7).

La reversión exige compatibilidad de esquema y respaldo previo; restaurar en otra base evita sobrescribir sin revisión. El estado HTTP de Laravel no basta para vigilar MySQL: el plan incluye consultar recursos de API y revisar logs protegidos. No hay operación de producción pública.

## Decisiones éticas y legales sustentadas, sin certificación ficticia

| Principio | Decisión concreta y alcance | Evidencia / pendiente |
|---|---|---|
| Datos personales — Ley 1581 de 2012 | Modelo sin cuentas, emails o perfiles; fixtures sintéticos; secretos y respaldos fuera de Git; demostración en loopback. Los textos libres podrían contener datos personales si se usan datos reales. La identidad académica/autoria ya figura en documentos: no se afirma que todo el repositorio carezca de datos personales. | [Modelo](https://github.com/Ariass777/gestion-tareas-academicas/tree/main/backend/database/migrations), [ignore](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/.gitignore), [operación](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/PLAN_OPERACION_LOCAL.md). Falta política integral de tratamiento/retención y comprobación de datos que la estudiante muestre en capturas. No se certifica cumplimiento total. |
| Sesgo | Prioridad elegida por usuario, sin clasificador IA; fecha explícita Colombia y pruebas de entradas con acentos/ñ/apóstrofes. | [reglas de fecha](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/frontend/src/app/config/fechas.ts), [datos de prueba](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/backend/tests/Semana7Data.php), [ambigüedades Unicode/longitud](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/DECISIONES.md). No se hizo estudio formal de equidad. |
| Transparencia | IA declarada como asistencia del proceso; se conservan errores, fuentes y límites. La aplicación muestra errores/reintento sin reemplazar fallos por datos ficticios. | [bitácora](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/bitacora_ia.md), [servicio](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/frontend/src/app/services/academico.service.ts), [casos](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/CASOS_VERIFICACION_IA.md). |
| Responsabilidad | Autorizaciones de actualización/publicación/merge acotadas y pruebas verificables; se diferencia ejecución del agente de revisión humana y testimonio histórico. Aislamiento para proteger datos. | [PR #4](https://github.com/Ariass777/gestion-tareas-academicas/pull/4), [cierre](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/evidencias/semana10/cierre-main.json), [bitácora](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/bitacora_ia.md). La estudiante debe revisar y poder explicar el código; no se inventa una aprobación académica general. |
| Propiedad intelectual y política de uso | DOCX originales y autoría conservados; asistencia IA declarada; no se eligió licencia global. La declaración MIT del composer del backend no decide por sí sola la licencia de todo el proyecto. | [originales/hashes](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/ADENDA_REQUISITOS_DISENO_S10.md), [composer.json](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/backend/composer.json), [árbol raíz sin licencia global](https://github.com/Ariass777/gestion-tareas-academicas/tree/main). Falta decisión de la titular y revisión completa de licencias; no se atribuyen respuestas IA no conservadas. |

Referencia legal primaria para los principios de finalidad, libertad, transparencia y seguridad: [Ley 1581 de 2012, artículo 4, compilación oficial MinTIC](https://normograma.mintic.gov.co/mintic/compilacion/docs/ley_1581_2012.htm). La tabla relaciona decisiones técnicas con esos principios; no sustituye una política de tratamiento ni demuestra consentimiento de personas reales mediante una entrevista simulada.

## Cierre técnico, limitaciones y recuperación necesaria

La comparación del PR abarcó 32 archivos: CI/cobertura, dependencias autorizadas, ejemplos de configuración, documentos y reportes pequeños. No cambió `frontend/src`, `backend/app`, migraciones/rutas ni pruebas existentes. La inspección de rutas privadas, secretos locales conocidos, patrones de tokens/claves y rutas personales en resúmenes no halló coincidencias; esto no es una auditoría exhaustiva de todo el historial ni revocación de secretos. [Registro del cierre](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/evidencias/semana10/cierre-main.json), [diff público del PR](https://github.com/Ariass777/gestion-tareas-academicas/pull/4/files).

El merge [6b5b57aa16731d8fdd6d738bc50f2861c6684613](https://github.com/Ariass777/gestion-tareas-academicas/commit/6b5b57aa16731d8fdd6d738bc50f2861c6684613) conservó los nueve commits de la preparación, incluidos los cinco iniciales y las correcciones posteriores. La rama de trabajo no fue borrada. [Historial público](https://github.com/Ariass777/gestion-tareas-academicas/commits/main), [validación remota con antecedentes](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/VALIDACION_REMOTA_S10.md).

Pendientes reales para la entrega académica:

- Recuperar propuesta inicial del módulo 1, transcripción completa de la entrevista **simulada** y respuestas/borradores originales S3/S4 si existen. No fabricar una entrevista real ni commits históricos para reforzar la rúbrica.
- Revisar la suficiencia de los casos declarativos 1/2: carecen de un commit aislado de corrección y de respuesta original. El caso CORS es fuerte en operación, pero no rellena la evidencia ausente de fundamentos.
- Revisar ambigüedades funcionales pendientes (transiciones, trim/longitudes Unicode, estado vacío/null) y CA-08-R1-04; no se cerraron por tener CI verde.
- Completar reflexión personal de aprendizajes, confianza excesiva y cambios futuros **por la estudiante**. Esta base no inventa su voz ni vivencias.
- Revisar política de uso/privacidad, licencia global y material que se mostrará; no hay autenticación, seguridad multiusuario, pentest ni aptitud para producción pública.
- Descargar artefactos completos de Actions antes de su caducidad de 14 días; los resúmenes pequeños versionados y URLs de commits/runs quedan como evidencia durable.
- Redactar después el informe oficial de ocho secciones (6–10 páginas sugeridas), exportarlo a PDF y preparar hasta ocho diapositivas/10 minutos y preguntas. **Nada de eso se genera en este cierre.**

## Índice para redactar las ocho secciones oficiales posteriormente

| Sección oficial | Material de esta base | Aporte que sigue siendo de la estudiante |
|---|---|---|
| 1. Resumen | Problema, solución, tabla de fases y resultados main. | Redacción final de 5–8 líneas. |
| 2. Problema y usuario | S3 y límite de entrevista simulada. | Recuperar propuesta inicial; describir el contexto previo solo con evidencia. |
| 3. La IA en el ciclo de vida | Tabla de seis módulos y bitácora. | Aportar las fuentes históricas faltantes. |
| 4. Verificación | Cuatro casos con límites y commits. | Revisar suficiencia académica y seleccionar evidencia real para mostrar. |
| 5. Estado final | Arquitectura, Must, pruebas/cobertura, pipeline y pendientes. | Comprobar enlaces antes de entregar. |
| 6. Reflexión ética y legal | Tabla de decisiones y dilema del aislamiento. | Reflexión propia y decisiones pendientes de titularidad/política. |
| 7. Aprendizajes | Errores y límites verificables, sin reflexión personal inventada. | Escribir aprendizajes propios y qué haría diferente. |
| 8. Anexos | [Índice docs](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/README.md), [bitácora](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/bitacora_ia.md), [evidencias S10](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/EVIDENCIAS_S10.md). | Recuperar anexos ausentes y conservar reportes antes de caducidad. |

