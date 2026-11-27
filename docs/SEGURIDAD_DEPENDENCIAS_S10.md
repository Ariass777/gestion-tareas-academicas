# Estado de dependencias — 27/11/2026

**Actualización posterior autorizada:** se presentaron y simularon los cambios antes de aplicarlos. La estudiante autorizó ambas actualizaciones y su nueva validación. Los cuatro componentes Symfony están en **8.1.12**, typescript-eslint en **8.74.0** y minimatch en **11.0.9**. Auditorías actuales de Composer y del árbol npm completo: **salida 0, cero avisos**. [Evidencia posterior](evidencias/semana10/seguridad-actualizada.json). Las correcciones de versiones de los cinco avisos Symfony y S-02 están comprobadas; eso no equivale a certificar toda la seguridad de la aplicación.

Consulta y verificaciones de Codex; no se atribuyen a la estudiante ejecuciones que no realizó. Los registros siguientes conservan el estado **previo** a esa autorización, con sus versiones y resultados reales. No se reescriben como si ya hubieran estado corregidos en la preparación inicial.

## Registro previo: cinco avisos Composer abiertos

`composer audit --locked --format=json` terminó con **salida 1**, cinco avisos en tres paquetes y ningún paquete abandonado. El lockfile PHP no cambió en esta preparación.

| Paquete bloqueado | Avisos encontrados | Referencia del proveedor |
|---|---|---|
| `symfony/http-kernel` v8.1.11 | CVE-2026-133743 | [Encabezados reenviados durante fragmentos](https://symfony.com/cve-2026-133743). |
| `symfony/mailer` v8.1.10 | CVE-2026-133751, CVE-2026-133755 | [require_tls](https://symfony.com/cve-2026-133751), [respuestas STARTTLS](https://symfony.com/cve-2026-133755). |
| `symfony/routing` v8.1.11 | CVE-2026-133746, CVE-2026-133754 | [Generación de URL](https://symfony.com/cve-2026-133746), [host placeholders](https://symfony.com/cve-2026-133754). |

Los avisos tienen fecha 25/11/2026, posterior al informe de semana 6. El proveedor identifica versiones corregidas de la serie 8.1 en **8.1.12**. Se requiere revisar una actualización compatible y repetir suites antes de cerrar cada aviso. No se asigna una severidad que Composer no proporcionó ni se afirma que una prueba funcional satisfactoria corrija estos paquetes.

La aplicación es API local y no implementa correo ni plantillas Twig con fragmentos. Eso limita los caminos observados, pero no prueba ausencia de explotación de todas las dependencias. Permanecen **abiertos**, sin aceptación definitiva ni declaración de producción pública segura. El pipeline preparado verifica funcionalidad y cobertura; no se anuncia como un gate de auditoría de dependencias limpia.

## Registro previo: npm y S-02

Se consultan por separado árbol completo y producción. El lockfile conserva minimatch 10.2.6 de desarrollo; S-02 no se cierra automáticamente. Los conteos actuales y los códigos de salida están en [seguridad.json](evidencias/semana10/seguridad.json). Los reportes brutos locales permanecen en `artifacts/semana10/` y no se versionan con rutas de caché del equipo. Una consulta fallida se distingue de cero avisos; se utilizó además un intento con timeout de red y sin reintentos.

La propuesta histórica de aceptación temporal de S-02 y la licencia global continúan pendientes de decisión de la estudiante. No se aplicaron `npm audit fix --force`, overrides o actualizaciones PHP automáticas.

## Aplicabilidad y corrección autorizada

| Aviso | Clasificación y condición de exposición | Evaluación en este proyecto | Corrección |
|---|---|---|---|
| CVE-2026-133743, http-kernel | Dependencia **de producción**. Involucra SubRequestHandler/fragmentos y confianza temporal en encabezados reenviados desde loopback. | No se encontraron Twig, renderizado de fragmentos ni llamadas a SubRequestHandler en el código propio. Estar en localhost no bastaría para descartarlo si se usara ese mecanismo. No se reprodujo una explotación. | http-kernel **8.1.12** y http-foundation **8.1.12**, requerido por la solución del proveedor. |
| CVE-2026-133746 / CVE-2026-133754, routing | Dependencia **de producción**. Valores no confiables llegan al generador Symfony de URL o a placeholders del host. | La API tiene rutas fijas con ids numéricos; Laravel usa Illuminate\Routing\UrlGenerator. No se encontró ese camino con parámetros no confiables hacia Symfony\Component\Routing\Generator\UrlGenerator. Eso es un análisis de aplicabilidad, no una prueba universal de ausencia de explotación. | routing **8.1.12**. |
| CVE-2026-133751 / CVE-2026-133755, mailer | Dependencia **de producción**. Intermediario activo en SMTP con STARTTLS y las condiciones de transporte descritas por el proveedor. | No hay funcionalidad de correo; la configuración de ejemplo usa log y la de pruebas array. No se observa el camino SMTP vulnerable dentro del alcance local actual. El paquete instalado antes sí estaba en el rango afectado. | mailer **8.1.12**. |
| GHSA-g3hv-75wg-m249 / CVE-2026-118764, minimatch | Dependencia **de desarrollo**, a través de typescript-eslint. Amplificación de patrones con optimizationLevel >= 2 puede agotar CPU/memoria. | No se distribuye como dependencia del producto Angular. El código inspeccionado de typescript-estree llama minimatch con `{ dot: true }`, sin habilitar ese nivel, y no recibe patrones desde la API académica. No se encontró exposición explotable actual con los patrones confiables del repositorio; el aviso de paquete seguía siendo válido. | typescript-eslint **8.74.0** requiere minimatch ^11.0.1 y resolvió **11.0.9**. Sin override de un mayor incompatible con el consumidor anterior. |

Fuentes primarias: avisos Symfony enlazados en la tabla anterior y [advisory oficial minimatch](https://github.com/advisories/GHSA-g3hv-75wg-m249). Código inspeccionado: `backend/routes/api.php`, `backend/config/mail.php`, `backend/vendor/laravel/framework/src/Illuminate/Routing/UrlGenerator.php`, `frontend/eslint.config.mjs` y `frontend/node_modules/@typescript-eslint/typescript-estree/dist/useProgramFromProjectService.js`. Las dependencias se inspeccionaron cuando correspondía a sus versiones; no se versionan vendor/node_modules.

## Compatibilidad, consecuencias y verificación

La simulación Composer resolvió **0 instalaciones, 4 actualizaciones y 0 eliminaciones**. Solo se aplicaron los cuatro parches enumerados, dentro de la serie 8.1 admitida por Laravel. `composer.json` no cambió. Las correcciones pueden rechazar parámetros de URL malformados y endurecer SMTP o el manejo de proxies; son cambios de seguridad reales, aunque el proyecto no ejercita las rutas vulnerables identificadas. No hay migraciones, cambios de datos o actualización del framework Laravel.

La simulación npm y la actualización dirigida resolvieron **12 versiones cambiadas** (typescript-eslint, diez subpaquetes @typescript-eslint y minimatch) y eliminaron dos copias duplicadas de minimatch 11.0.8. No hubo paquetes nuevos. Los rangos ya declarados admitían 8.74.0; package.json, Angular, TypeScript, Vitest y PHP no cambiaron. El mayor nuevo de minimatch lo admite la versión nueva de su consumidor; no se impuso mediante un override. El requisito Node de minimatch 11 es compatible con Node 24.19.0. La actualización del analizador podría cambiar diagnósticos de lint; ESLint y TypeScript volvieron a aprobar sin excepciones nuevas.

Pruebas locales posteriores: **327 PHPUnit / 1014 aserciones**, **87 Vitest con cobertura**, ESLint y TypeScript aprobados. Los reportes anteriores se conservaron antes de repetir. El resultado remoto posterior se enlaza en [validación remota](VALIDACION_REMOTA_S10.md); la ejecución verde de la corrección CORS anterior no se usa para atribuir validación a paquetes que aún no contenía.

Los commits separan PHP y desarrollo para permitir revertir cada grupo si aparece una regresión. Una reversión reabriría los avisos correspondientes y debe documentarse. No hubo `audit fix --force`, cambio de pruebas, desactivación de controles ni elección de licencia. La propuesta histórica de aceptación temporal de S-02 no se convirtió retrospectivamente en aprobación: posteriormente se autorizó y comprobó su corrección técnica. La revisión académica general y la licencia global continúan pendientes.
