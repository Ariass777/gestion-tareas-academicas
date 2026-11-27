# Informe final del proyecto integrador

**Proyecto:** Sistema Web de Gestión de Tareas Académicas — Académica  
**Estudiante:** [Estudiante anonimizado]  
**Repositorio:** [gestion-tareas-academicas](https://github.com/Ariass777/gestion-tareas-academicas)  
**Fecha:** 27 de noviembre de 2026  Docente: [Docente anonimizado]  
Asignatura: Seminario de Ingeniería de Software  
Institución: Fundación Escuela Tecnológica Jesús Oviedo Pérez (FET) — Neiva, Huila

## 1. Resumen

El proyecto nace de la necesidad de organizar las actividades académicas y evitar olvidar entregas. Desarrollé un sistema web para registrar asignaturas, gestionar tareas, consultar fechas y prioridades y actualizar su progreso. La inteligencia artificial sirvió de apoyo en las seis fases, desde los fundamentos y la evaluación de prompts hasta la operación. Las propuestas se contrastaron con el alcance, el código y las pruebas automatizadas. El sistema integrado obtuvo 424 pruebas y tres guardas aprobadas en GitHub Actions. Los resultados muestran que la IA facilita el desarrollo, pero sus propuestas necesitan verificación. [Base de evidencias][base] · [Pipeline definitivo][ci].

## 2. Problema y usuario

Elegí este proyecto porque, como estudiante, me vi en la necesidad de contar con una herramienta para organizar mis trabajos: en ocasiones olvido las actividades que me dejan. El usuario objetivo es un estudiante que necesita consultar en un mismo lugar sus asignaturas, tareas pendientes, fechas de entrega, prioridades y avances.

La solución busca reducir la dispersión de información y facilitar la consulta de obligaciones académicas. No pretende reemplazar el criterio del estudiante ni decidir por él qué actividad es más importante. La prioridad se establece manualmente. Tampoco se ha medido una reducción real de olvidos después de utilizar el sistema, por lo que este beneficio se plantea como objetivo y no como resultado de un estudio de usuarios.

El alcance incluye el registro de asignaturas, creación y edición de tareas, consulta ordenada, filtros, cambios de estado y eliminación. La aplicación es una demostración local de un solo usuario. No incluye autenticación, notificaciones automáticas ni sincronización con calendarios externos.

La propuesta original del módulo 1 (anexo A, pp. 9–10) identifica el problema, las funcionalidades y las tecnologías Angular, Laravel y MySQL; prevé ChatGPT y Gemini como apoyo, sin IA integrada al producto. La documentación de requisitos contiene una entrevista simulada y escenarios de aceptación, pero no se dispone de su transcripción completa. No se presenta como entrevista de campo. [Requisitos y fuentes por módulo][indice] · [Adenda de requisitos][adenda].

## 3. La IA en el ciclo de vida

La IA se utilizó como herramienta de asistencia durante el desarrollo, no como componente de la aplicación. El producto puede ejecutarse sin conectarse a un modelo de inteligencia artificial. La siguiente tabla diferencia las actividades acreditadas de aquellas cuya evidencia no está disponible.

| Módulo y fase | Qué hice con IA | Herramienta | Evidencia | Cómo verifiqué |
|---|---|---|---|---|
| 1. Fundamentos | Banco de diez prompts, ajustes y propuesta del proyecto. | ChatGPT; Gemini previsto en la propuesta. | [Anexo A, pp. 2–10][anexoA] | Evaluación de respuestas de 1 a 5 y revisión de restricciones. |
| 2. Requisitos | Historias, escenarios, requisitos no funcionales y trazabilidad. | ChatGPT y Gemini | [Documentos S3][indice] | Contraste con el alcance; revisión registrada en el documento. |
| 3. Diseño | Comparación de alternativas, C4, modelo de datos y API. | ChatGPT y Gemini | [Diseño y adenda][adenda] | Revisión frente a historias y contrato HTTP. |
| 4. Código | Implementación y revisión técnica. | Codex; revisión independiente registrada en S6 | [Bitácora][bit] | Linter, compilación, revisión de código y regresiones. |
| 5. Pruebas | Plan, casos parametrizados, mutaciones y cobertura. | Codex | [Registro S7][pruebas] | Ejecuciones, comparación de fallos y correcciones. |
| 6. Operación | CI, aislamiento, despliegue, respaldo y revisión de dependencias. | Codex | [Validación remota][remoto] | actionlint, pruebas remotas, instalación y restauración. |

En requisitos y diseño se conservan fichas de prompts, aunque no todas las respuestas originales. En código y pruebas existen archivos y commits que permiten rastrear cambios. Las actividades de operación y cierre corresponden al 27 de noviembre y no se atribuyen a semanas anteriores. La preparación de este informe también contó con ChatGPT para organizar y redactar la información; este uso debe incorporarse a la bitácora al publicar el documento.

## 4. Verificación: lo que la IA hizo mal y cómo lo encontraste

### Caso 1: funcionalidades fuera del alcance

**Fase:** requisitos. **Propuesta:** los registros de S3 atribuyen a ChatGPT y Gemini sugerencias de notificaciones push y sincronización con Google Calendar. **Error:** esas funciones no estaban respaldadas por las necesidades definidas y ampliaban el alcance. **Detección:** contraste con las historias y la descripción del proyecto, registrado en las fichas de prompts. **Corrección:** retirar las funciones y escenarios ajenos. El [commit a4d34de][c1] contiene el documento corregido, pero no un cambio aislado entre la propuesta y su corrección. No se conserva la respuesta original completa. [Catálogo de casos][casos].

### Caso 2: rutas y servicios innecesarios

**Fase:** diseño. **Propuesta:** el documento S4 registra rutas inconsistentes, servicios externos y atributos sin respaldo. **Error:** el diseño no era coherente con las historias y el modelo mínimo. **Detección:** revisión del alcance y de las convenciones HTTP/JSON. **Corrección:** eliminar servicios externos, organizar rutas bajo `/api` y separar el cambio de estado mediante PATCH. El [commit a4d34de][c1] archiva el diseño corregido; no se conserva el borrador anterior. La adenda de semana 10 corrige otras discrepancias sin atribuirlas automáticamente a IA. [Adenda][adenda] · [Casos][casos].

### Caso 3: preparación incorrecta de pruebas Laravel

**Fase:** pruebas. **Propuesta:** Codex preparó pruebas con una ruta sin enlazar y objetos stdClass que no reproducían la entrada JSON asociativa. **Error:** el entorno de prueba no representaba correctamente el comportamiento del framework. **Detección:** la primera ejecución de 117 casos produjo 44 errores y 73 aprobaciones, sin fallos de aserción. **Corrección:** enlazar la ruta y reproducir la decodificación asociativa. Los 117 casos aprobaron posteriormente con 231 aserciones, sin modificar la lógica de producción ni los resultados esperados.

[Commit a63504a][c3] · [Registro de pruebas, apartado 2.3][pruebas]. Los reportes originales se conservaron localmente; el repositorio contiene el registro y resúmenes. El borrador fallido no tuvo commit independiente.

### Caso 4: integración incompleta de CORS

**Fase:** operación. **Propuesta:** Codex configuró GitHub Actions usando el ejemplo de entorno sin reconciliar el origen permitido con el contrato probado. **Error:** el ejemplo tenía FRONTEND_URL=4300 y la prueba esperaba 4200. El entorno local ocultó la diferencia. **Detección:** dos ejecuciones remotas fallaron por ausencia del encabezado Access-Control-Allow-Origin. La reproducción local confirmó el fallo con 4300 y la aprobación con 4200. **Corrección:** alinear el ejemplo y fijar explícitamente el origen en el workflow, sin ampliar los orígenes permitidos ni modificar las pruebas.

[Push fallido][fail1] · [PR fallido][fail2] · [Commit f536322][c4] · [Pipeline aprobado][ci]. Este caso acredita una omisión en la integración propuesta por Codex; no acredita que la línea histórica 4300 hubiera sido creada originalmente por IA.

Los casos de pruebas y operación ofrecen una cadena de verificación más sólida que los dos históricos. Los casos de requisitos y diseño conservan evidencia documental, pero no la totalidad de sus fuentes originales. Las mutaciones deliberadas de pruebas no se contabilizan como nuevos errores espontáneos de IA.

## 5. Estado final del sistema

### Arquitectura y funcionalidades

La solución tiene tres capas: Angular y TypeScript para la interfaz y los formularios; Laravel y PHP para la API REST, validación y reglas; MySQL para la persistencia. Las solicitudes HTTP intercambian JSON. Una asignatura puede tener varias tareas y la base utiliza claves foráneas. El ADR-001 está incluido en el documento de diseño S4. La adenda mantiene los originales y explica el cambio de localStorage a MySQL y el contrato de la API. [Diseño y ADR][indice] · [Adenda][adenda] · [Código integrado][repo].

| Historia Must | Estado y verificación |
|---|---|
| HU-01: registrar asignaturas | Implementada; validación y listado. |
| HU-02: registrar tareas | Implementada; campos requeridos, fechas y prioridades. |
| HU-03: consultar pendientes | Implementada; filtros y orden por fecha e identificador. |
| HU-04: actualizar progreso | Implementada; transición y rechazo de doble finalización. |

También se implementaron edición, eliminación confirmada y filtros de prioridad. HU-08-R1 documenta la persistencia MySQL después de recargar; el criterio histórico de caché local corrupta fue sustituido, no aprobado como si se hubiera ejecutado. [Pruebas API][api] · [Pruebas de navegador][e2e].

### Pruebas y cobertura

El pipeline definitivo de main, ejecución 46020516693, corresponde al SHA a43a91d7a704dde830e414a51a959876a3691c65. El job verificar aprobó todos los pasos, según el cierre técnico reportado. [Pipeline][ci].

| Comprobación | Resultado |
|---|---|
| PHPUnit | 327/327; 1014 aserciones |
| Vitest | 87/87 |
| Playwright | 10/10 |
| Guardas Node | 3/3 |
| ESLint, TypeScript y build | Aprobados |
| Total | 424 pruebas y 3 guardas |

| Alcance medido | Cobertura de líneas |
|---|---:|
| Frontend completo | 61,12 % |
| Regla de fechas frontend | 100 % |
| Backend completo app/ | 74,11 % |
| Subconjunto HTTP y modelos | 98,48 % |

Las ramas del frontend alcanzaron 70,21 %. Las ramas PHP no fueron medidas. La cobertura de un subconjunto no representa la cobertura global; tampoco garantiza ausencia de defectos. PHPUnit incluye casos que requieren el framework y pruebas Feature, no exclusivamente pruebas unitarias. [Cobertura y exclusiones][cob] · [Validación remota][remoto].

### Operación, seguridad y pendientes

Se verificó una instalación limpia del código con herramientas ya disponibles, migraciones, datos sintéticos, compilación y consultas. El respaldo y restauración en otra base conservaron cuatro asignaturas, cinco tareas y dos migraciones. El plan contempla incidentes, mantenimiento y reversión. [Guía][guia] · [Plan][plan].

Tras una propuesta de actualización y autorización, se aplicaron parches de Symfony 8.1.12 y typescript-eslint 8.74.0, que incorpora minimatch 11.0.9. Las auditorías posteriores reportaron cero avisos de Composer y npm. No constituye una garantía de seguridad completa. [Seguridad][seg].

Quedan pendientes pruebas específicas de concurrencia, casos extremos de fechas y Unicode, reinicio completo de MySQL e instalación de todas las herramientas en otra máquina. No hay autenticación ni despliegue público; el alcance es local. No se define una licencia global ni se dispone de toda la evidencia histórica de requisitos y diseño.

## 6. Reflexión ética y legal

| Principio | Decisión en mi proyecto | Evidencia |
|---|---|---|
| Datos personales (Ley 1581 de 2012) | Datos sintéticos para pruebas; sin cuentas ni perfiles. Secretos y respaldos fuera de Git. Los textos libres podrían contener información personal; falta política integral de tratamiento y conservación. | [Plan][plan] |
| Sesgo | Prioridad elegida por el usuario, fechas de Colombia y pruebas con caracteres del español. No se realizó un estudio formal de equidad. | [Pruebas][pruebas] |
| Transparencia | Declaración de asistencia IA en el proceso; conservación de errores y límites. El producto no utiliza IA durante su ejecución. | [Bitácora][bit] |
| Responsabilidad | Cambios de dependencias autorizados, pruebas antes de integrar y revisión de resultados. La responsabilidad de la entrega permanece en la estudiante. | [PR #4][pr] |
| Propiedad intelectual y política de uso | Conservación de documentos originales y declaración de asistencia IA. Licencia global y revisión integral de licencias pendientes. | [Adenda][adenda] |

El dilema técnico y ético más relevante fue cómo comprobar operaciones de creación, modificación y eliminación sin poner en riesgo información académica. Se optó por bases de datos descartables, credenciales restringidas, transacciones y datos sintéticos. El pipeline utiliza una instancia MySQL efímera. Las guardas comprueban condiciones de configuración, pero un sufijo de nombre de base por sí solo no garantiza que esté vacía. Por ello se verificaron también permisos de acceso y aislamiento. No era necesario provocar una pérdida de datos para demostrar el riesgo. [Plan de operación][plan] · [Base de evidencias][base].

Estas medidas se relacionan con los principios de finalidad, transparencia y seguridad de la [Ley 1581 de 2012, artículo 4](https://normograma.mintic.gov.co/mintic/compilacion/docs/ley_1581_2012.htm), pero no certifican cumplimiento integral. La identidad académica figura en documentos originales; los ejemplos y capturas deben evitar datos reales de terceros.

## 7. Aprendizajes

Durante el seminario aprendí a estructurar mejor un prompt, a comprender cómo funciona la interacción con la inteligencia artificial y a comunicarle de manera más clara lo que necesito. Antes asociaba su uso principalmente con pedirle que redactara un texto. Ahora entiendo que también puede apoyar actividades como la definición de requisitos, el diseño, la programación, las pruebas y la documentación de un proyecto de software. El banco original registra cuatro valoraciones de 5/5, cinco de 4/5 y una de 3/5. La reflexión identifica cinco elementos útiles: rol, contexto, tarea, formato y restricciones. Estas valoraciones corresponden a ejercicios de fundamentos, no a pruebas del gestor académico (anexo A, pp. 2–8).

Los errores registrados durante el proyecto muestran que una respuesta convincente no necesariamente es correcta: una propuesta puede ampliar el alcance, una prueba puede estar mal preparada y una configuración puede funcionar localmente pero fallar en otro entorno. Esta es una conclusión respaldada por las evidencias, no el recuerdo de un momento personal específico de exceso de confianza que no haya identificado.

Si comenzara nuevamente, dedicaría más tiempo a organizar la documentación desde el principio y a definir requisitos más claros. Esto facilitaría explicar a la IA qué quiero construir, qué restricciones debe respetar y cómo se comprobará que el resultado cumple lo solicitado. También permitiría conservar una trazabilidad más clara de las decisiones y sus cambios.

## 8. Anexos

- [Repositorio final][repo] y [PR #4 integrado][pr].
- [Bitácora de uso de IA][bit] e [índice documental por módulo][indice].
- Módulo 1 (anexo A): Banco de 10 prompts evaluados y propuesta de proyecto final (PDF recuperado; pp. 2–8: banco y reflexión; pp. 9–10: propuesta). Publicado en versión anonimizada (commit 6296b64). [Consultar PDF en GitHub][anexoA].
- Módulos 2 y 3: [documentos originales en el índice][indice] y [adenda][adenda].
- Módulo 4: [revisión de seguridad](https://github.com/Ariass777/gestion-tareas-academicas/blob/main/revision_seguridad.md).
- Módulo 5: [registro de pruebas][pruebas] y [cobertura][cob].
- Módulo 6: [guía de despliegue][guia], [plan de operación][plan] y [validación remota][remoto].
- [Catálogo de casos de verificación][casos] y [base de evidencias][base].
- [Pipeline definitivo de main][ci].

[repo]: https://github.com/Ariass777/gestion-tareas-academicas
[base]: https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/BASE_INFORME_FINAL.md
[indice]: https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/README.md
[bit]: https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/bitacora_ia.md
[adenda]: https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/ADENDA_REQUISITOS_DISENO_S10.md
[pruebas]: https://github.com/Ariass777/gestion-tareas-academicas/blob/main/registro_pruebas.md
[casos]: https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/CASOS_VERIFICACION_IA.md
[remoto]: https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/VALIDACION_REMOTA_S10.md
[cob]: https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/COBERTURA_Y_PRUEBAS_S10.md
[guia]: https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/GUIA_DESPLIEGUE_LOCAL.md
[plan]: https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/PLAN_OPERACION_LOCAL.md
[seg]: https://github.com/Ariass777/gestion-tareas-academicas/blob/main/docs/SEGURIDAD_DEPENDENCIAS_S10.md
[ci]: https://github.com/Ariass777/gestion-tareas-academicas/actions/runs/46020516693
[pr]: https://github.com/Ariass777/gestion-tareas-academicas/pull/4
[c1]: https://github.com/Ariass777/gestion-tareas-academicas/commit/a4d34de6ded5c48f19eb09bc50c2f3b30525e38a
[c3]: https://github.com/Ariass777/gestion-tareas-academicas/commit/a63504a519bd6ad1d59f143a78aeb6e4b4098220
[c4]: https://github.com/Ariass777/gestion-tareas-academicas/commit/f5363225f5ece9c8787f067b14ab3d9ac14aea70
[fail1]: https://github.com/Ariass777/gestion-tareas-academicas/actions/runs/46012886635
[fail2]: https://github.com/Ariass777/gestion-tareas-academicas/actions/runs/46012965021
[api]: https://github.com/Ariass777/gestion-tareas-academicas/blob/main/backend/tests/Feature/AcademicApiTest.php
[e2e]: https://github.com/Ariass777/gestion-tareas-academicas/blob/main/frontend/e2e/academica.spec.ts

[anexoA]: https://github.com/Ariass777/gestion-tareas-academicas/blob/6296b644b73ddc570aec3ebb9e33568e02b4da2c/docs/Arteaga_Veronica_C2_Banco_y_Propuesta.pdf
