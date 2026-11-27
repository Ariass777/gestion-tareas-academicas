# Preparación técnica y evidencias — semana 10

**Cierre posterior autorizado, 27/11/2026:** [PR #4 integrado](https://github.com/Ariass777/gestion-tareas-academicas/pull/4), merge `6b5b57aa16731d8fdd6d738bc50f2861c6684613`, [main aprobado](https://github.com/Ariass777/gestion-tareas-academicas/actions/runs/46018960368). [Metadatos, revisión del diff y pasos](evidencias/semana10/cierre-main.json), [resultados reales](evidencias/semana10/resultados-main.json) y [BASE_INFORME_FINAL.md](BASE_INFORME_FINAL.md) con enlaces públicos para la redacción posterior. Este cierre no reemplaza las evidencias históricas ni el informe final pendiente.

Fecha: **27/11/2026, America/Bogota**. Autor de las comprobaciones: Codex. Revisión académica humana pendiente. Este documento es un registro técnico de preparación; no es el informe final integrador ni una presentación.

**Actividad posterior de publicación completada:** [validación remota, fallos y correcciones](VALIDACION_REMOTA_S10.md). [Pipeline aprobado después de las actualizaciones autorizadas](https://github.com/Ariass777/gestion-tareas-academicas/actions/runs/46016640148), SHA `d8a0cccbdc822e7317ed76e2a69ef570577bbe56`. [Resultados remotos](evidencias/semana10/resultados-remotos.json) y [auditorías actualizadas](evidencias/semana10/seguridad-actualizada.json). Los apartados siguientes conservan el estado de la preparación inicial anterior a esa autorización.

## Etapas y commits locales

Base: `main` en `8657ed02e508d62475967b345514ff0373d912e8`. Rama: `semana-10-entrega-final`. Se conservan DOCX, documentación histórica, pruebas, resultados esperados y código del producto.

| Etapa | Resultado | Commit |
|---|---|---|
| 1. CI | Workflow con MySQL efímero, usuario restringido, acciones fijadas por SHA y artefactos incluso ante fallos. | `e394d79b00656eff97bcf7a8f6d37878ed8cb841` |
| 2. Pruebas/cobertura | Suites reales, V8 y Xdebug; cobertura amplia y subconjuntos identificados; incidentes de entorno registrados. | `d81bad5768f5e1bd6c72c0bf712f721c9b491bf2` |
| 3. Reconciliación | [Adenda](ADENDA_REQUISITOS_DISENO_S10.md), HU-08-R1, matriz, API y modelo. | `7c4b865fff4dd6fa4ef3e664381723cd31eae0ce` |
| 4. Operación | [Guía](GUIA_DESPLIEGUE_LOCAL.md), [plan](PLAN_OPERACION_LOCAL.md), instalación en copia limpia y restauración sintética. | `06c6b4f21e46d3dc9ec3070061e57faeece25049` |
| 5. Organización | Índice, README actualizado, resúmenes portables, casos, seguridad actual y exportador de métricas. | `6a594fe7001b3d192650ad7e4b1ee59dbc2712cb` (preparaci?n inicial). |

Durante la preparación inicial no se hizo push ni integración a main. La publicación y verificación posteriores autorizadas constan en el registro enlazado arriba. Los resultados locales de esta primera etapa se ejecutaron antes de sus commits de registro y se conservan con ese contexto.

## Resultados ejecutados

| Verificación | Resultado | Evidencia distribuida |
|---|---|---|
| Vitest | **87/87**, 7 archivos, cero fallidas/pendientes. | [resultados.json](evidencias/semana10/resultados.json) |
| PHPUnit | **327/327**, **1014 aserciones**, cero errores/fallos/omitidas. | Mismo resumen, derivado del JUnit. |
| Playwright | **10/10**, 31,14 s, cero inesperadas/omitidas/inestables. | Mismo resumen, derivado del JSON de Playwright. |
| Node | **3/3**, salida 0. | [Comprobaciones](evidencias/semana10/comprobaciones.json); log local en `artifacts/semana10/node-guardias.log`. |
| ESLint / TypeScript / build | Salida 0 en los tres; inicial 310,33 kB. | Comprobaciones y [alcance de pruebas](COBERTURA_Y_PRUEBAS_S10.md). |
| actionlint | Primera propuesta rechazada; versión final aprobada, salida 0. | [Fallo real](evidencias/semana10/actionlint-fallo.txt), comprobaciones y [caso de IA](CASOS_VERIFICACION_IA.md). |
| Cobertura frontend | Líneas **61,12 %**, sentencias 63,78 %, funciones 38,39 %, ramas 70,21 %. | Resultados: total y métricas por archivo con rutas relativas. |
| Cobertura backend | Todo `app/`: **74,11 %** líneas; HTTP/modelos: **98,48 %**. Ramas PHP no medidas. | Resultados, total y subconjunto claramente separados. |
| Rendimiento local | 200 tareas: **449, 324 y 322 ms**, objetivo <1500 ms cumplido en esas muestras. | Resultados; no representa carga pública/concurrente. |
| Instalación y recuperación | Copia nueva sin dependencias previas, migraciones, API/proxy y restauración con comparación de filas. | [operacion.json](evidencias/semana10/operacion.json) |
| Aislamiento | Usuario dedicado rechazado en desarrollo; cantidades de desarrollo y `.env` originales conservados. | [aislamiento.json](evidencias/semana10/aislamiento.json). Son cantidades, no snapshot previo de todas las filas. |

El resumen conserva hashes de los reportes brutos usados. Se genera con `php scripts/resumir-evidencias.php`, que selecciona métricas y rutas relativas y **no exporta entorno, credenciales, mensajes completos ni datos de tareas**. `missing_reports` permite reconocer reportes ausentes sin tratarlos como aprobados. El workflow lo ejecuta también ante fallos cuando PHP está disponible; un fallo de una prueba sigue haciendo fallar el job.

Los reportes completos de esta sesión están en `artifacts/ci/`, `artifacts/semana10/`, `frontend/coverage/frontend/` y `frontend/playwright-report/`, ignorados. GitHub conservará los artefactos seleccionados por 14 días cuando realmente se ejecute el workflow. Los resúmenes versionados no caducan con esa retención. Logs y capturas anteriores que iban a ser reemplazados por E2E se copiaron a `artifacts/semana10/historicos/`; además se conserva un [resumen histórico portable](evidencias/historico/resumen_s6_s7.json).

## Seguridad actual y limitaciones

Las consultas **anteriores a actualizar** concluyeron: npm completo salida 1, siete paquetes dev por un advisory raíz; npm producción salida 0; Composer salida 1, cinco avisos en tres paquetes Symfony. [Resultado previo conservado](evidencias/semana10/seguridad.json). Después de presentar la propuesta y recibir autorización, se aplicaron correcciones compatibles y ambas auditorías completas dieron salida 0 y cero avisos: [resultado posterior](evidencias/semana10/seguridad-actualizada.json). La licencia global sigue pendiente. Esta distinción evita convertir los informes previos en auditorías limpias retrospectivas.

Ubuntu/GitHub Actions se validó posteriormente y está enlazado arriba. Siguen sin verificarse reinstalación completa de herramientas en otra máquina, apagado global del MySQL local, concurrencia real y operación multiusuario. Los intentos fallidos y sus correcciones se explican en pruebas y bitácora. No se cambió un esperado para obtener resultados verdes.

## Evidencias que debe recuperar o revisar la estudiante

- Propuesta inicial del módulo 1 y su registro auténtico de uso/verificación de IA.
- Transcripción completa de la entrevista del módulo 2, manteniendo su carácter simulado; no transformarla en entrevista real retrospectivamente.
- Respuestas y borradores originales de IA para los casos de requisitos y diseño. Los DOCX actuales son testimonios documentales, no la respuesta original.
- Respuesta original de IA relacionada con el defecto de fecha, si existe y se pretende atribuirle esa propuesta concreta.
- Revisión humana final, decisiones de requisitos ambiguos, política de datos/IA, reflexión ética y licencia global.

Las ausencias no se resuelven inventando un historial. El [catálogo de casos](CASOS_VERIFICACION_IA.md) diferencia los límites históricos del nuevo error CI ocurrido realmente en semana 10. [Índice de documentos por módulo](README.md).

## Publicación y primera verificación remota, después de revisión

Estos comandos se documentaron sin ejecutar durante la preparación inicial. El push autorizado y las consultas API posteriores constan en el registro remoto; no se utilizó GitHub CLI:

```powershell
git switch semana-10-entrega-final
git status --short
git log --oneline main..HEAD
git push -u origin semana-10-entrega-final
```

Abrir [GitHub Actions](https://github.com/Ariass777/gestion-tareas-academicas/actions), seleccionar «Verificacion academica», confirmar rama y SHA del push, revisar todos los pasos y descargar el artefacto `verificacion-<run_id>-<attempt>`. Registrar la URL y resultado reales en la bitácora. Un fallo debe investigarse y quedar registrado antes de repetir; no sustituirlo por una afirmación de éxito local.

Si GitHub CLI está instalado y autenticado:

```powershell
gh run list --branch semana-10-entrega-final --workflow ci.yml --limit 5
gh run watch ID_DE_EJECUCION --exit-status
gh run view ID_DE_EJECUCION
gh run download ID_DE_EJECUCION --dir artifacts/ci-remoto
```

**Pipeline remoto en verde: verificado en la actividad posterior enlazada al inicio.** No se genera aquí `informe_final.md`, PDF final ni diapositivas.
