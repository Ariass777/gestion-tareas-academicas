# Estado de dependencias — 27/11/2026

Consulta local de Codex; no es una prueba de explotación ni una aceptación humana de riesgos. Los resultados del 14/11 en los informes históricos se conservan como antecedentes y no describen la base de avisos actual.

## Composer: cinco avisos abiertos

`composer audit --locked --format=json` terminó con **salida 1**, cinco avisos en tres paquetes y ningún paquete abandonado. El lockfile PHP no cambió en esta preparación.

| Paquete bloqueado | Avisos encontrados | Referencia del proveedor |
|---|---|---|
| `symfony/http-kernel` v8.1.11 | CVE-2026-133743 | [Encabezados reenviados durante fragmentos](https://symfony.com/cve-2026-133743). |
| `symfony/mailer` v8.1.10 | CVE-2026-133751, CVE-2026-133755 | [require_tls](https://symfony.com/cve-2026-133751), [respuestas STARTTLS](https://symfony.com/cve-2026-133755). |
| `symfony/routing` v8.1.11 | CVE-2026-133746, CVE-2026-133754 | [Generación de URL](https://symfony.com/cve-2026-133746), [host placeholders](https://symfony.com/cve-2026-133754). |

Los avisos tienen fecha 25/11/2026, posterior al informe de semana 6. El proveedor identifica versiones corregidas de la serie 8.1 en **8.1.12**. Se requiere revisar una actualización compatible y repetir suites antes de cerrar cada aviso. No se asigna una severidad que Composer no proporcionó ni se afirma que una prueba funcional satisfactoria corrija estos paquetes.

La aplicación es API local y no implementa correo ni plantillas Twig con fragmentos. Eso limita los caminos observados, pero no prueba ausencia de explotación de todas las dependencias. Permanecen **abiertos**, sin aceptación definitiva ni declaración de producción pública segura. El pipeline preparado verifica funcionalidad y cobertura; no se anuncia como un gate de auditoría de dependencias limpia.

## npm y S-02

Se consultan por separado árbol completo y producción. El lockfile conserva minimatch 10.2.6 de desarrollo; S-02 no se cierra automáticamente. Los conteos actuales y los códigos de salida están en [seguridad.json](evidencias/semana10/seguridad.json). Los reportes brutos locales permanecen en `artifacts/semana10/` y no se versionan con rutas de caché del equipo. Una consulta fallida se distingue de cero avisos; se utilizó además un intento con timeout de red y sin reintentos.

La propuesta histórica de aceptación temporal de S-02 y la licencia global continúan pendientes de decisión de la estudiante. No se aplicaron `npm audit fix --force`, overrides o actualizaciones PHP automáticas.
