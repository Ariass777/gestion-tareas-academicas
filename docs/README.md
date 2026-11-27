# Índice documental

Actualizado el 27/11/2026. Los originales e informes históricos conservan sus fechas; las revisiones nuevas no se atribuyen a semanas anteriores.

**Informe final aportado por la estudiante:** [PDF de seis páginas](../informe_final.pdf) y [Markdown](../informe_final.md) en la raíz. Son copias para publicación con revisión de portada/contenido y metadatos; los originales se conservan fuera de Git. [Resumen de privacidad y hashes](evidencias/semana10/privacidad-informe-final.json), [declaración de uso de ChatGPT en informe y diapositivas](bitacora_ia.md). No se incorpora un archivo de diapositivas ni se atribuye al agente la revisión de uno.

**Diferencia de corte:** el PDF todavía indica que falta la propuesta del módulo 1; el Markdown definitivo ya incorpora el anexo recuperado y publicado en `6296b64`. No son versiones académicamente idénticas: se conserva el contenido recibido de ambas y se señala la discrepancia para reconciliación por la estudiante. Ambas enlazan la ejecución aprobada `46020516693`; el pipeline posterior del commit de incorporación se verifica por separado.

**Cierre técnico:** [PR #4 integrado](https://github.com/Ariass777/gestion-tareas-academicas/pull/4), [pipeline de main aprobado](https://github.com/Ariass777/gestion-tareas-academicas/actions/runs/46018960368), [metadatos del cierre](evidencias/semana10/cierre-main.json) y [reportes de main](evidencias/semana10/resultados-main.json). [BASE_INFORME_FINAL.md](BASE_INFORME_FINAL.md) reúne las fuentes públicas, diferencias entre historia y S10, casos de verificación y pendientes para redactar el informe posteriormente.

**Validación remota terminada:** [pipeline aprobado y correcciones](VALIDACION_REMOTA_S10.md), [evidencia de jobs y SHA](evidencias/semana10/pipeline-remoto.json), [auditorías después de las actualizaciones autorizadas](evidencias/semana10/seguridad-actualizada.json). Se conserva también el estado previo en los informes de preparación.

| Módulo/fase | Fuentes históricas | Preparación de semana 10 / estado |
|---|---|---|
| 1. Fundamentos | [Banco de diez prompts y propuesta inicial, PDF de diez páginas](Arteaga_Veronica_C2_Banco_y_Propuesta.pdf): propuesta en pp. 9–10, banco en pp. 2–8. | **Recuperado por la estudiante e incorporado el 27/11/2026**, después de la auditoría inicial. Copia para publicación: nombres de portada y autor de metadatos retirados; original conservado fuera de Git. [Revisión de privacidad y hashes](evidencias/semana10/privacidad-modulo1.json). |
| 2. Requisitos | [DOCX S3](Arteaga_Veronica_S3_Requisitos.docx), entrevista descrita como simulada, ocho HU y fichas de prompts. | [Adenda S10](ADENDA_REQUISITOS_DISENO_S10.md), HU-08-R1. Falta transcripción completa y respuestas originales de IA. |
| 3. Diseño | [DOCX S4 con ADR-001](Arteaga_Veronica_S4_Diseño.docx), [decisiones](DECISIONES.md). | Adenda: matriz 66/90/79, contrato API y modelo con descripción. |
| 4. Código | [Validación inicial](VALIDACION.md), [revisión oficial S6](../revision_seguridad.md), [detalle S6](revision_seguridad.md). | [Seguridad actual](SEGURIDAD_DEPENDENCIAS_S10.md); se conserva la implementación del producto. |
| 5. Pruebas | [Plan, casos, correcciones y mutaciones S7](../registro_pruebas.md), [resumen S6](evidencia_revision.json). | [Pruebas y cobertura S10](COBERTURA_Y_PRUEBAS_S10.md), [CI](CI.md). |
| 6. Operación | README y scripts locales. | [Despliegue](GUIA_DESPLIEGUE_LOCAL.md), [operación](PLAN_OPERACION_LOCAL.md), pruebas de instalación y restauración sintética. |

[Bitácora completa disponible](bitacora_ia.md), [casos de verificación y sus límites](CASOS_VERIFICACION_IA.md), [índice de evidencias S10](EVIDENCIAS_S10.md). Los anexos originales ausentes se señalan expresamente; «completa disponible» no significa que ya exista evidencia de todas las actividades históricas.

Los resúmenes pequeños de [semana 10](evidencias/semana10/) y [antecedentes](evidencias/historico/) se distribuyen con Git. Los reportes completos, capturas locales, datos y secretos se conservan ignorados donde corresponde. El informe final aportado se enlaza al inicio; no se publican diapositivas en esta incorporación.

## Recuperación del módulo 1 — 27/11/2026

La propuesta que faltaba en la auditoría inicial ya está disponible en el PDF enlazado. Se preserva el contenido académico original; solo se retiraron los dos nombres de la portada y el campo Author mediante redacción aplicada y reescritura completa. Las páginas 2–10 conservan texto e imágenes renderizadas idénticos. Se revisaron las diez páginas, texto, metadatos, anotaciones y adjuntos, sin hallar credenciales, contactos, documentos de identidad o ejemplos con personas identificables. La ruta conserva el nombre de archivo suministrado por la estudiante; no se presenta el repositorio entero como anónimo.

El banco declara «ChatGPT (Claude / GPT-4)», denominación ambigua que no permite acreditar un modelo concreto. La propuesta prevé ChatGPT y Gemini. Las evaluaciones y ajustes son registros de la autora, no respuestas originales completas ni pruebas ejecutadas durante esta incorporación. El PDF se incorpora ahora, sin inventar un commit de semanas anteriores. Continúa pendiente recuperar las respuestas/borradores originales S3/S4 y la transcripción de la entrevista simulada.
