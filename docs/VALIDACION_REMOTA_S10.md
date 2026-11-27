# Verificación remota de semana 10

## Cierre posterior: integración y aprobación en main — 27/11/2026

La estudiante autorizó posteriormente integrar el PR existente. Se comprobaron árbol limpio, rama publicada en `5933802faea0d1e12a8c3779ebe6836634a93ccd`, los nueve commits, checks de push `46017740292` y PR `46017747159` aprobados y ausencia de conflictos. Se inspeccionaron los 32 archivos del diff respecto a `8657ed02e508d62475967b345514ff0373d912e8`: sin archivos privados, coincidencias con secretos locales conocidos, patrones de tokens/claves o rutas personales en resúmenes. Sin cambios de negocio, rutas, migraciones, pruebas existentes o DOCX. La inspección es acotada al diff; no certifica todo el historial.

Se integró el [PR #4](https://github.com/Ariass777/gestion-tareas-academicas/pull/4) mediante merge con comprobación del SHA esperado, conservando los nueve commits: **`6b5b57aa16731d8fdd6d738bc50f2861c6684613`**. La rama original se conserva. **[Pipeline sobre main 46018960368](https://github.com/Ariass777/gestion-tareas-academicas/actions/runs/46018960368): success**; job único `verificar`, id `140573290983`, todos los pasos success.

Resultados: Vitest **87/87**, PHPUnit **327/327 y 1014 aserciones**, Node **3/3**, Playwright **10/10** (11,51 s), ESLint, TypeScript y build aprobados. Frontend 61,12 % de líneas/70,21 % ramas; backend 74,11 % global y 98,48 % HTTP/modelos. RNF del runner 207/148/153 ms para 200 tareas; no es una medición de concurrencia. No faltan reportes. ZIP del artefacto `15207531609`: SHA-256 `6811b7706c47368ea9c0ab43d1710f519e0663bd06040b7d2788270c605a9b04`, coincidente con GitHub.

Fuentes durables: [cierre-main.json](evidencias/semana10/cierre-main.json), [resultados-main.json](evidencias/semana10/resultados-main.json) y [base académica](BASE_INFORME_FINAL.md). Logs y reportes completos descargados en `artifacts/cierre-s10/` (ignorados); artefactos remotos con retención de 14 días. Esta evidencia pertenece al merge indicado; la publicación posterior del cierre documental dispara otra ejecución que se comprueba aparte, sin una referencia circular al propio commit.

Se confirmó el caso CORS como propuesta de integración incompleta de Codex durante S10; no se acreditó quién originó la línea 4300 del ejemplo histórico. No hubo más actualizaciones de dependencias, cambios funcionales, elección de licencia ni generación de informe final/PDF/diapositivas. Los apartados posteriores conservan el antecedente de publicación previo al merge.

Fecha: **27/11/2026, America/Bogota**. Actividad ejecutada por Codex con autorización de publicar la rama y corregir fallos, sin integrar main. La estudiante autorizó posteriormente las dos actualizaciones de seguridad, después de revisar la propuesta y las simulaciones. No se atribuyen a la estudiante las ejecuciones del agente.

## Ejecución aprobada con las dependencias corregidas

- **URL:** [GitHub Actions 46016640148](https://github.com/Ariass777/gestion-tareas-academicas/actions/runs/46016640148).
- **SHA:** `d8a0cccbdc822e7317ed76e2a69ef570577bbe56`.
- **Evento/rama:** push a `semana-10-entrega-final`.
- **Job único:** [verificar, 140565335485](https://github.com/Ariass777/gestion-tareas-academicas/actions/runs/46016640148/job/140565335485), **success**.
- **Artefacto descargado:** `verificacion-46016640148-1`, id `15206138593`; su digest SHA-256 coincide con el ZIP descargado. La expiración figura en el resumen portable.

| Paso | Estado real | Resultado comprobado |
|---|---|---|
| Preparación de herramientas y dependencias | success | Node 24.19.0, PHP 8.5.13/Xdebug 3.5.3; lockfiles instalados en Ubuntu 24.04. El log confirma Symfony 8.1.12. |
| Entorno y migraciones | success | MySQL efímero 8.4, usuario limitado a `academica_ci_testing`, sin secretos de producción. |
| ESLint | success | Sin desactivar reglas o permitir advertencias nuevas. |
| TypeScript aplicación/pruebas | success | Ambos proyectos con noEmit. |
| Vitest con V8 | success | **87/87**, siete archivos; cero fallidas/pendientes. |
| PHPUnit con Xdebug | success | **327/327, 1014 aserciones**, cero fallos/errores/omitidas. |
| Guardias Node | success | **3/3**, cero fallos; corroborado en el log del job. |
| Build Angular | success | Build de producción, controles de tipado y presupuesto conservados. |
| Chromium y fixtures | success | Instalación de la versión Playwright bloqueada; 200 tareas sintéticas solo en la base efímera. |
| Playwright | success | **10/10**, 11,97 s; cero inesperadas, inestables, omitidas y errores globales. |
| Exportador y artefactos | success | Resumen github-actions con el SHA correcto y `missing_reports: []`; subida aprobada. |

Cobertura: frontend **195/319 líneas (61,12 %)** y **132/188 ramas (70,21 %)**; backend **83/112 líneas (74,11 %)** para todo `app/`; subconjunto HTTP/modelos **65/66 (98,48 %)**. Ramas PHP no medidas. [Métricas remotas por archivo](evidencias/semana10/resultados-remotos.json), [estado de jobs/steps y artefacto](evidencias/semana10/pipeline-remoto.json). Los reportes locales anteriores permanecen separados.

RNF-01 en este runner: **175, 125 y 127 ms**, API 21/20/21 ms para 200 tareas, sin cobertura PHP activa en el servidor E2E. Son tres muestras de ese entorno, no una comparación controlada con el equipo local ni una prueba de concurrencia.

## Dos fallos anteriores recuperados y causa real

| Ejecución | SHA | Fallo |
|---|---|---|
| [46012886635](https://github.com/Ariass777/gestion-tareas-academicas/actions/runs/46012886635) | `6a594fe7001b3d192650ad7e4b1ee59dbc2712cb` | PHPUnit: 327 casos, 1011 aserciones y un fallo CORS. |
| [46012965021](https://github.com/Ariass777/gestion-tareas-academicas/actions/runs/46012965021) | Mismo SHA. | Mismo fallo, reproducido en el segundo log. |

La configuración inicial copiaba `.env.testing.example`, cuyo FRONTEND_URL era 4300, mientras `AcademicApiTest::test_cors_permite_el_frontend_y_rechaza_otro_origen` comprueba 4200 conforme al origen de desarrollo. La configuración local anterior usaba 4200 y no había revelado esa diferencia de instalación. El error fue **Header [Access-Control-Allow-Origin] not present on response**.

La reproducción local con 4300 falló; la misma prueba con 4200 aprobó (1 caso, 6 aserciones). Se alineó el ejemplo a 4200 y se fijó explícitamente la variable en CI. No se amplió la lista de orígenes, modificaron esperados o deshabilitaron pruebas. El frontend E2E usa 4300 mediante proxy del mismo origen hacia `/api`, sin necesitar una excepción CORS adicional.

Corrección: `f5363225f5ece9c8787f067b14ab3d9ac14aea70`. Primera ejecución verde antes de actualizar paquetes: [46015394370](https://github.com/Ariass777/gestion-tareas-academicas/actions/runs/46015394370), con el mismo conteo de pruebas. Esa ejecución no se reutiliza como evidencia de los paquetes posteriores.

Los pasos Node/build/E2E de las dos ejecuciones fallidas quedaron omitidos después del fallo PHPUnit; los reportes sí se conservaron mediante always(). [Resumen de ambos fallos](evidencias/semana10/ci-fallos.json). Logs y ZIP originales quedan ignorados en `artifacts/publicacion-s10/`, sin copiar logs completos que puedan contener configuración efímera.

## Actualizaciones de seguridad propuestas, autorizadas y verificadas

| Commit | Cambio delimitado | Comprobación posterior |
|---|---|---|
| `d1d387d` | Cuatro componentes Symfony a 8.1.12, sin cambios de composer.json. | Composer audit salida 0, cero avisos/abandonados; PHPUnit local 327/327 y 1014 aserciones. |
| `d8a0ccc` | typescript-eslint 8.74.0 y su cadena compatible; minimatch 11.0.9, sin overrides ni cambios de package.json. | npm audit completo salida 0, cero avisos; ESLint, TypeScript y Vitest local 87/87 aprobados. |

La propuesta se verificó con dry-run antes de aplicar cambios. El grafo real cambió exactamente cuatro paquetes PHP y doce versiones npm; se eliminaron dos copias duplicadas de minimatch, sin paquetes nuevos. El pipeline aprobado al inicio del documento contiene **ambos** commits. [Aplicabilidad, consecuencias y fuentes del proveedor](SEGURIDAD_DEPENDENCIAS_S10.md), [evidencia de auditorías](evidencias/semana10/seguridad-actualizada.json).

Los cinco avisos Symfony y S-02 tienen corrección técnica de versiones y auditorías comprobadas. No se declara ausencia universal de vulnerabilidades, preparación pública o aceptación humana retrospectiva. La licencia global sigue pendiente; no se ha elegido una.

## Conservación y límites

Se preservaron los cinco commits de preparación y main en `8657ed0`. La rama ya estaba publicada al comenzar la actividad; el primer push del agente respondió Everything up-to-date. Los pushes posteriores sí publicaron las correcciones y activaron nuevas ejecuciones. No se creó ni fusionó un PR durante esta actividad; el workflow también se ejecutó por el PR que ya existía.

`.runtime/publicacion-s10/github.ps1` se revisó y se mantuvo fuera de Git: lee la credencial Git en memoria para las consultas necesarias y no la registra en los reportes. Los resúmenes versionados seleccionan campos y rutas relativas. El archivo auxiliar de salida de git log que estaba abierto se copió y se excluyó únicamente mediante `.git/info/exclude`, sin borrarlo ni matar procesos ajenos.

Los pasos y resultados anteriores están verificados; los documentos históricos ausentes, la revisión académica, la reflexión ética y la licencia conservan sus pendientes. No se generó informe final ni presentación. La publicación posterior de esta documentación puede producir otra ejecución; el enlace inicial identifica inequívocamente el commit funcional y de dependencias que se comprobó, sin fabricar una referencia circular al propio commit documental.
