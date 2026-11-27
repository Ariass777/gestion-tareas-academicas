# Casos de verificación de propuestas de IA

Consolidación del **27/11/2026**. Distingue testimonios documentados de reproducciones con reportes. No reconstruye conversaciones, respuestas, commits o revisiones humanas ausentes.

## Requisitos: funciones fuera de alcance

- **Propuesta:** notificaciones push y sincronización con Google Calendar, atribuidas a ChatGPT/Gemini por la autora del documento.
- **Error:** no estaban respaldadas por la descripción del proyecto.
- **Detección registrada:** contraste con alcance y revisión de escenarios de HU; apartado 7 y ficha de prompt 2 del [DOCX S3](Arteaga_Veronica_S3_Requisitos.docx).
- **Corrección registrada:** eliminación de funciones y escenarios ajenos, manteniendo asignaturas/tareas.
- **Commit asociado al estado corregido:** [a4d34de6ded5c48f19eb09bc50c2f3b30525e38a](https://github.com/Ariass777/gestion-tareas-academicas/commit/a4d34de6ded5c48f19eb09bc50c2f3b30525e38a), primera incorporación del documento.
- **Límite:** no hay respuesta original o diff previo independiente. Este commit prueba la versión archivada, no una corrección aislada recuperada del historial. La estudiante debe recuperar la conversación/borrador si existe.

## Diseño: rutas inconsistentes y servicios innecesarios

- **Propuesta:** el [DOCX S4](Arteaga_Veronica_S4_Diseño.docx), apartado 7, registra propuestas de IA con sistemas externos innecesarios, rutas poco consistentes y atributos sin respaldo.
- **Error y detección registrados:** contraste con HU, alcance y convenciones HTTP/JSON.
- **Corrección registrada:** eliminar servicios externos, normalizar `/api`, usar PATCH para estado y mantener el modelo mínimo. El ADR recoge la decisión final.
- **Commit asociado:** `a4d34de`, primera versión archivada de S4. No existe un commit separado que muestre el borrador incorrecto.
- **Límite:** los ejemplos concretos anteriores a esa normalización no están conservados. No se inventan endpoints literales para completar el caso. La matriz aritmética incorrecta y ejemplos incompletos sí se verificaron en S10 y se corrigen en la adenda; **su origen en IA no está acreditado**.

## Pruebas: preparación del framework incorrecta

- **Propuesta real de Codex:** pruebas con Route sin enlazar y `stdClass` enviado directamente al validador.
- **Error:** no reproducían el contexto de solicitud y transporte JSON de Laravel; produjeron `Route is not bound`, errores de `mb_strlen` y conversión.
- **Detección ejecutada:** JUnit inicial: **117 casos, 44 errores**, 73 aprobados, cero fallos de aserción. Después de corregir: **117/117, 231 aserciones**.
- **Corrección:** enlazar la ruta solo para edición y transformar la entrada mediante JSON asociativo. No cambiaron producción ni esperados.
- **Commit:** [a63504a519bd6ad1d59f143a78aeb6e4b4098220](https://github.com/Ariass777/gestion-tareas-academicas/commit/a63504a519bd6ad1d59f143a78aeb6e4b4098220), [código corregido](../backend/tests/Unit/Semana7ValidationTest.php), [registro §2.3](../registro_pruebas.md#23-correcciones-y-descartes-reales).
- **Evidencia portable:** [resumen histórico](evidencias/historico/resumen_s6_s7.json), derivado de los JUnit conservados localmente. Los fuentes fallidos intermedios no tuvieron un commit propio; los reportes originales se conservan en `artifacts/semana7/`.

## Operación/CI: contexto de GitHub Actions inválido

Caso nuevo ocurrido el **27/11/2026**, durante esta preparación, no en semanas anteriores.

- **Propuesta real de Codex:** definir `DB_PORT: ${{ job.services.mysql.ports[3306] }}` dentro de `jobs.verificar.env`.
- **Error:** ese nivel no admite el contexto `job` y el acceso a la propiedad de puerto requiere una cadena.
- **Detección ejecutada:** actionlint 1.7.12 terminó con **salida 1** y dos diagnósticos. [Salida inicial conservada](evidencias/semana10/actionlint-fallo.txt).
- **Corrección:** un paso de ejecución escribe el puerto del servicio efímero en `GITHUB_ENV` usando `job.services.mysql.ports['3306']`. actionlint corregido terminó con **salida 0**.
- **Commit:** `e394d79b00656eff97bcf7a8f6d37878ed8cb841`, primer commit de CI de esta rama; [workflow corregido](../.github/workflows/ci.yml). El commit podrá enlazarse remotamente después del push autorizado.
- **Límite:** actionlint valida estáticamente; no demuestra una ejecución remota verde. El borrador incorrecto no se publicó como commit para fabricar un historial de error.

## Código: regresión de fecha como evidencia complementaria

El cambio entre `a4d34de` y [80c19176ee72278735979c60ed05c1d2cb0c305f](https://github.com/Ariass777/gestion-tareas-academicas/commit/80c19176ee72278735979c60ed05c1d2cb0c305f) demuestra la corrección de una fecha presentada un día antes en Tokio. Se añadió instante UTC explícito y una regresión Playwright; el [resumen S6](evidencia_revision.json) registra fallo antes y aprobación después. El defecto/diff se verifican; falta recuperar la respuesta inicial de IA que originó la expresión para atribuirle exactamente esa propuesta.

Las tres mutaciones S7 fueron errores introducidos deliberadamente para evaluar pruebas. No se presentan como tres errores espontáneos de IA ni como tres fases distintas. Los casos declarativos de requisitos/diseño no tienen la misma fuerza que los reportes ejecutados de pruebas/CI. La decisión de suficiencia académica queda para la revisión de la estudiante/docente.
