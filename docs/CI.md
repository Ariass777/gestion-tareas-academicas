# Integración continua — semana 10

Fecha de preparación: 27/11/2026, America/Bogota. Alcance: demostración local de un usuario.

El workflow [ci.yml](../.github/workflows/ci.yml) se activa por push a `main` o `semana-10-entrega-final`, pull request a `main` y ejecución manual. Usa Ubuntu 24.04, Node 24.19.0 (Angular exige Node 24.15 o posterior en esa serie), PHP 8.5, Composer 2 y MySQL 8.4. `npm ci` y `composer install` respetan los lockfiles. Las acciones están fijadas por SHA consultado en sus repositorios oficiales.

## Aislamiento de datos

Cada job crea un servicio MySQL nuevo y desechable, con puerto de host asignado por GitHub. El usuario `academica_ci` solo recibe permisos sobre `academica_ci_testing` mediante la inicialización de la imagen oficial. La contraseña publicada es ficticia y solo sirve dentro de ese contenedor; no se consultan secretos de GitHub ni credenciales locales. La contraseña root es aleatoria y la aplicación no la utiliza.

La conexión efectiva se fija a loopback y al puerto de ese servicio. `.env.testing` se crea desde el ejemplo en el runner nuevo; las guardias existentes rechazan entorno incorrecto, DB_URL, ausencia del archivo, caché y nombres sin `_testing`. No se ejecutan `migrate:fresh`, `db:wipe` ni comandos contra bases de desarrollo. El contenedor se elimina al terminar el job. El sufijo por sí solo no demuestra aislamiento: aquí también lo aportan la instancia efímera y los permisos del usuario.

## Comprobaciones y artefactos

Se ejecutan ESLint, TypeScript de aplicación y pruebas, Vitest con cobertura V8, PHPUnit con Xdebug, las tres pruebas Node de rechazo, compilación Angular y Playwright/Chromium con API y MySQL reales. Se preparan 200 fixtures E2E después de PHPUnit. Un fallo conserva su código de salida y hace fallar el job. La cobertura incluye archivos no ejecutados y se conserva junto a los reportes JSON/JUnit; ámbito y métricas locales en [pruebas de semana 10](COBERTURA_Y_PRUEBAS_S10.md).

El paso de subida usa `always()` y una lista explícita de reportes, incluso si una prueba falla. Retención: 14 días. No sube `.env`, bases, contraseñas, `vendor` ni `node_modules`. Si la instalación impide crear un reporte, su ausencia no se presenta como prueba aprobada. Los logs de pasos permanecen además en GitHub Actions. Los reportes pueden incluir rutas de archivos del runner y datos sintéticos.

Antes de subirlos, `scripts/resumir-evidencias.php` exporta además un resumen de métricas con rutas relativas; omite mensajes completos y no lee credenciales. Se ejecuta con `always()` si la preparación PHP aprobó. Informa `missing_reports` cuando falta algún reporte. La salud de MySQL se comprueba por TCP, para no confundir el servidor temporal de inicialización por socket con la instancia final.

## Estado verificable

La configuración y sus comprobaciones locales se registrarán en la evidencia de semana 10. **La ejecución remota queda pendiente hasta el push autorizado por la estudiante.** No existe todavía una URL de ejecución verde para esta rama. La auditoría previa confirmó cero workflows y cero ejecuciones en GitHub antes de estos cambios.

Fuentes: [Angular y cobertura](https://angular.dev/guide/testing/code-coverage), [setup-node](https://github.com/actions/setup-node), [setup-php](https://github.com/shivammathur/setup-php), [upload-artifact](https://github.com/actions/upload-artifact).
