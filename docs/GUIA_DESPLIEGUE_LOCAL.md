# Guía de despliegue local

Preparada el **27/11/2026, America/Bogota**. Alcance: demostración académica local de **un usuario, sin autenticación**. Los servidores de desarrollo y las credenciales de ejemplo no habilitan un despliegue público seguro.

## Entorno

Windows x64, Visual C++ Redistributable compatible, Node **24.19.0** y npm compatible; PHP **8.5** con `pdo_mysql`, mbstring, intl, curl, fileinfo, zip, DOM y XML; Composer 2; MySQL **8.4**. Versiones locales verificadas y lockfiles: [pruebas S10](COBERTURA_Y_PRUEBAS_S10.md). Angular admite Node `^24.15.0` en la serie 24. Se necesitan red para instalar y puertos locales libres: 4200/8000 y MySQL 3307 para el modo portable; E2E usa 4300/8001. No publicar esos puertos en Internet ni habilitar acceso de otros estudiantes.

## Copia limpia e instalación

Después de que la rama revisada se publique, clonar en una carpeta nueva y seleccionar el commit aprobado. Antes de publicar, la copia local de revisión puede obtenerse con `git archive` del commit: no incluye dependencias ni secretos. No copiar `vendor`, `node_modules`, `.env`, `.runtime` ni bases anteriores.

```powershell
git clone https://github.com/Ariass777/gestion-tareas-academicas.git
cd gestion-tareas-academicas
# Seleccionar la rama/commit revisado cuando esté publicado.
git switch semana-10-entrega-final
powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/install-tools.ps1
.\.tools\php\php.exe .\.tools\composer.phar install --working-dir=backend --no-interaction --prefer-dist
npm.cmd --prefix frontend ci --no-fund --no-audit
```

`install-tools.ps1` descarga las herramientas en `.tools`; no cambia PATH ni instala servicios globales. La instalación del código y dependencias se contrastó en una copia nueva con herramientas ya instaladas. La reinstalación de todos los binarios en una segunda máquina sigue sin comprobarse. No interpretar el antecedente del instalador con herramientas existentes como una instalación completa desde cero.

## MySQL y variables

Ruta portable, solo en una copia con puertos libres:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/start-mysql.ps1
.\.tools\php\php.exe scripts/local-database.php
```

El script crea bases de desarrollo/pruebas si no existen, genera secretos aleatorios y conserva `.env` preexistentes. Datos en `.runtime/mysql-data`; secretos en `.runtime/mysql-admin.json` y `.env` ignorados por Git. No borrar el directorio de datos. Si el puerto pertenece a otra instalación, investigar y elegir otra instancia/configuración; no reutilizarla a ciegas.

Alternativa con herramientas existentes: crear **una base nueva** y un usuario exclusivo mediante una cuenta administradora, otorgando solo permisos sobre esa base. Para las pruebas, usar otra base nueva cuyo nombre termine en `_testing` y otro usuario sin permisos sobre desarrollo. No utilizar bases preexistentes por el simple hecho de tener ese sufijo. La cuenta de ejecución no necesita privilegios globales; las migraciones requieren permisos de esquema adicionales a los del CRUD.

Copiar `backend/.env.example` a `backend/.env` únicamente si no existe y ajustar, sin publicar los valores reales:

```dotenv
APP_ENV=local
APP_DEBUG=false
APP_URL=http://127.0.0.1:8000
APP_TIMEZONE=America/Bogota
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3307
DB_DATABASE=base_nueva_demo
DB_USERNAME=usuario_exclusivo_demo
DB_PASSWORD=REEMPLAZAR_POR_SECRETO_LOCAL
FRONTEND_URL=http://127.0.0.1:4200
```

No configurar `DB_URL`. Generar APP_KEY con `php artisan key:generate` desde `backend` si no lo hizo el preparador portable. Para pruebas, copiar `.env.testing.example` a `.env.testing`, establecer `APP_ENV=testing`, base dedicada y credenciales exclusivas. Nunca ejecutar `key:generate` sobre una configuración existente sin evaluar sus datos cifrados. No usar `config:cache` para pruebas: la guardia lo rechaza. Proteger archivos privados con permisos del sistema operativo; `.gitignore` no los cifra.

## Migraciones y datos sintéticos

Con la configuración apuntando a la **base nueva correcta**, desde la raíz:

```powershell
.\.tools\php\php.exe backend/artisan migrate --no-interaction
.\.tools\php\php.exe backend/artisan db:seed --no-interaction
.\.tools\php\php.exe backend/artisan migrate:status --no-interaction
```

El seeder crea cuatro asignaturas y cinco tareas sintéticas con fechas relativas y conserva registros ya existentes. Para una actualización de una base con datos, respaldar antes de migrar. No usar `migrate:fresh`, `db:wipe`, eliminación del directorio MySQL ni restaurar encima de una base sin comprobar su destino.

## Arranque, comprobaciones y apagado

En dos terminales desde la raíz:

```powershell
# Terminal 1: reconoce/inicia MySQL, consulta migraciones y mantiene Laravel.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/start-backend.ps1
```

```powershell
# Terminal 2
npm.cmd --prefix frontend start
```

Abrir `http://127.0.0.1:4200`. Comprobar HTTP 200, JSON con `data` y los valores sintéticos esperados en una base recién sembrada:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/up
Invoke-RestMethod http://127.0.0.1:8000/api/asignaturas
Invoke-RestMethod http://127.0.0.1:8000/api/tareas
Invoke-RestMethod http://127.0.0.1:4200/api/tareas
```

`/up` prueba arranque del framework; por sí solo no prueba MySQL. Las consultas de recursos y el CRUD completan esa comprobación. Registrar una tarea sintética, editarla, cambiar su estado, recargar y confirmar que persiste; probar cancelación y confirmación de eliminación únicamente de esa tarea. Las pruebas E2E ya automatizan estas operaciones sobre una base de pruebas. No ejecutar fixtures E2E contra datos que se quieran conservar.

Detener Angular/Laravel con Ctrl+C. MySQL, cuando ninguna otra sesión lo necesite:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/stop-mysql.ps1
```

El script comprueba el proceso y solicita SHUTDOWN con credenciales locales. Evitar terminar MySQL a la fuerza. El arranque/apagado de servidores HTTP se comprobó en una copia aislada; el apagado global MySQL no se ejecutó durante la preparación para preservar otras sesiones. Estado detallado: [operación](PLAN_OPERACION_LOCAL.md).

## Build y verificación técnica

```powershell
npm.cmd --prefix frontend run lint
npm.cmd --prefix frontend run typecheck
npm.cmd --prefix frontend run build
npm.cmd --prefix frontend run test:ci
```

La cobertura frontend está incluida en `test:ci`. PHPUnit requiere MySQL dedicado y, para cobertura, Xdebug activado solo durante esa ejecución. Las instrucciones de pruebas y seguridad se mantienen en el README y [CI](CI.md). E2E requiere Chromium de la versión Playwright bloqueada, preparar 200 fixtures y compilar antes de ejecutar.

## Actualización y reversión

Anotar commit actual, preservar configuración privada y hacer un respaldo verificable. Preparar el nuevo commit en **otra carpeta**, instalar desde lockfiles y probarlo primero en base dedicada. Detener servidores HTTP, cambiar a la copia revisada y comprobar `/up`, API y CRUD sintético. Conservar la copia anterior.

Si falla: detener la nueva copia, volver a iniciar la anterior con su configuración y comprobar compatibilidad del esquema. Si hace falta recuperar datos, restaurar el respaldo en **otra base nueva**, verificarlo y cambiar la configuración local a esa base. No asumir que volver al código anterior revierte las migraciones. Procedimiento de respaldo/restauración: [plan de operación](PLAN_OPERACION_LOCAL.md). Esta entrega no introduce migraciones ni cambios al esquema de negocio.
