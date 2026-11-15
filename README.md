# Sistema Web de Gestión de Tareas Académicas

Aplicación académica individual para registrar asignaturas, organizar actividades, establecer fechas y prioridades y actualizar el progreso. Interfaz **Académica**, con verde oscuro y diseño adaptable.

La implementación parte de los DOCX de `docs/`, leídos antes del desarrollo. El diseño de semana 4 tiene precedencia: **Angular → API REST Laravel → MySQL**. Los originales se conservan intactos. Las decisiones y trazabilidad se encuentran en [docs/DECISIONES.md](docs/DECISIONES.md), y los resultados ejecutados en [docs/VALIDACION.md](docs/VALIDACION.md).

El objetivo académico es aplicar análisis de requisitos, arquitectura por capas, implementación y verificación al proyecto individual del seminario **Inteligencia Artificial Aplicada al Ciclo de Vida del Software**. La revisión del primer incremento está documentada en [revisión de seguridad](docs/revision_seguridad.md), [bitácora de IA](docs/bitacora_ia.md) y [evidencia ejecutada](docs/evidencia_revision.json).

Funcionalidades: registrar y listar asignaturas; crear, consultar, editar y eliminar tareas con confirmación; filtrar por prioridad y estado; actualizar progreso; consultar el resumen de entregas y conservar datos en MySQL después de recargar. No se incorpora IA al producto.

## Tecnologías y requisitos

Versiones verificadas en este equipo:

| Herramienta | Versión |
| --- | --- |
| Node.js / npm | 24.19.0 / 11.17.0 |
| Angular / Angular CLI | 22.2.6 / 22.2.7 |
| TypeScript | 6.0.x, modo estricto |
| PHP | 8.5.12 NTS x64 |
| Composer | 2.11.2 |
| Laravel | 13.42.0 |
| MySQL Community | 8.4.13 LTS |

Windows x64 con Visual C++ Redistributable 2015–2022, Node.js compatible con Angular 22 y acceso a npm/Composer para reinstalar dependencias. PHP necesita `pdo_mysql`, `mbstring`, `openssl`, `curl`, `fileinfo`, `zip`, `intl`, DOM, XML y las extensiones base de Laravel. No se requiere Angular CLI global. Las versiones exactas se fijan en `frontend/package-lock.json` y `backend/composer.lock`.

Compatibilidad consultada en la [documentación de Angular](https://angular.dev/reference/versions) y los [requisitos de Laravel 13](https://laravel.com/framework/docs/13.x/deployment). Descargas oficiales: [PHP](https://www.php.net/downloads.php?os=windows), [Composer](https://getcomposer.org/download/) y [MySQL 8.4](https://dev.mysql.com/downloads/mysql/8.4.html?os=3).

## Estructura

```text
frontend/src/app/
  components/     Iconos, errores de campo y formulario compartido
  pages/          Inicio, asignaturas y tareas
  services/       HttpClient y mensajes de interfaz
  models/         Interfaces y tipos de dominio
  config/         URL de API, fechas y validadores
  app.routes.ts   Navegación con carga diferida
frontend/e2e/     Pruebas de navegador e integración
backend/app/
  Models/         Entidades y relaciones Eloquent
  Http/Controllers/Api/
  Http/Requests/  Validación del servidor
  Http/Resources/ Respuestas JSON
  Console/Commands/ Preparación segura de datos de pruebas
backend/database/ Migraciones, factories y seeder
backend/tests/    Pruebas de API sobre MySQL
scripts/          Herramientas y arranque local
docs/             Fuentes originales y documentación de implementación
.tools/           Herramientas portátiles ignoradas por Git
.runtime/         Datos MySQL y secretos locales ignorados por Git
artifacts/        Resultados y capturas locales ignorados por Git
```

## Ejecutar en este espacio de trabajo

Las dependencias, herramientas portátiles, bases y datos de demostración ya se prepararon en este equipo. Desde la raíz, en PowerShell:

```powershell
# Terminal 1: iniciar MySQL, comprobar Laravel y mantener la API en el puerto 8000
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\start-backend.ps1
```

En otra terminal:

```powershell
# Desde la raíz
cd frontend
npm.cmd start
```

Abrir **http://127.0.0.1:4200**. `npm.cmd` evita restricciones de ejecución de `npm.ps1` en Windows. Para detener los servidores de desarrollo, usar `Ctrl+C` en sus terminales. MySQL se apaga de forma ordenada con:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\stop-mysql.ps1
```

Los datos permanecen en `.runtime/mysql-data` después de cerrar el navegador o apagar MySQL. No borrar esta carpeta si se desean conservar. Las bases de desarrollo y pruebas son independientes.

### Si Angular muestra ECONNREFUSED 127.0.0.1:8000

Angular y Laravel son procesos independientes: `npm.cmd start` inicia solamente Angular. El proxy de `frontend/proxy.conf.json` reenvía `/api` al puerto **8000**; si Laravel está detenido, devuelve 502 y Vite registra ECONNREFUSED. MySQL usa el puerto **3307**, no el 8000.

Al abrir el proyecto, ejecutar `start-backend.ps1` en la primera terminal y mantenerla abierta; ejecutar Angular en la segunda. El script usa PHP portable (no necesita `php` en el PATH), inicia o reconoce MySQL y consulta el estado de las migraciones antes de iniciar Laravel. No ejecuta migraciones, seeders ni borrados. Si el puerto 8000 está ocupado, falla sin cambiar automáticamente de puerto.

Para comprobar únicamente MySQL y las dependencias, sin iniciar otra API:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\start-backend.ps1 -CheckOnly
```

Con ambos servidores iniciados, estas consultas deben devolver HTTP 200 y JSON con una propiedad `data`:

```powershell
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8000/api/tareas
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8000/api/asignaturas
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:4200/api/tareas
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:4200/api/asignaturas
```

No hace falta volver a instalar dependencias ni ejecutar seeders cada vez que se abre el proyecto. Si se modifica el archivo del proxy, reiniciar Angular para que lea la configuración nueva.

## Instalación desde una copia nueva en Windows

No copiar `vendor`, `node_modules`, `.tools`, `.runtime` ni archivos `.env` al repositorio. Con Node.js instalado, ejecutar desde la raíz:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\install-tools.ps1
.\.tools\php\php.exe .\.tools\composer.phar install --working-dir=backend
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\start-mysql.ps1
.\.tools\php\php.exe .\scripts\local-database.php
.\.tools\php\php.exe .\backend\artisan migrate --no-interaction
.\.tools\php\php.exe .\backend\artisan db:seed --no-interaction
cd frontend
npm.cmd ci
npm.cmd start
```

En otra terminal iniciar el backend con el comando anterior. `install-tools.ps1` descarga los binarios oficiales dentro del proyecto, verifica las sumas publicadas y no cambia el PATH ni instala servicios de Windows. Necesita red y el runtime Visual C++ x64. La instancia nueva solo escucha en `127.0.0.1:3307`; no utiliza servicios o bases existentes. Durante su primera preparación, `local-database.php` genera contraseñas aleatorias, protege la cuenta root y crea el usuario de aplicación. Los secretos se guardan exclusivamente en `.runtime/mysql-admin.json`, `backend/.env` y `backend/.env.testing`, ignorados por Git. Si estos `.env` ya existen, el script los conserva.

## Usar una instalación MySQL propia

También se puede usar PHP y Composer instalados globalmente. Sustituir las rutas de `.tools` por `php` y `composer`. Crear **bases nuevas** sin afectar bases existentes:

```sql
CREATE DATABASE gestion_tareas_academicas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE gestion_tareas_academicas_testing CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- Crear un usuario con una contraseña propia; nunca versionarla.
-- Otorgar permisos sobre estas dos bases exclusivamente.
```

Copiar `backend/.env.example` a `backend/.env` y completar:

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=gestion_tareas_academicas
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contrasena_local
APP_TIMEZONE=America/Bogota
FRONTEND_URL=http://127.0.0.1:4200
```

No configurar `DB_URL`. Copiar `backend/.env.testing.example` a `backend/.env.testing` y establecer las mismas credenciales, con `DB_DATABASE=gestion_tareas_academicas_testing` y `APP_ENV=testing`. Usar una base dedicada y vacía para pruebas. Desde `backend/`:

```powershell
php artisan key:generate
php artisan key:generate --env=testing
php artisan migrate --no-interaction
php artisan db:seed --no-interaction
php artisan migrate --env=testing --no-interaction
php artisan serve --host=127.0.0.1 --port=8000
```

El seeder agrega cuatro asignaturas y cinco tareas de ejemplo con fechas relativas al día de ejecución. Es repetible: conserva registros existentes y no los restablece. No se utiliza `migrate:fresh`, `db:wipe` ni SQLite para desarrollar o probar esta aplicación.

## API REST

Base de desarrollo: `http://127.0.0.1:8000/api`. El frontend utiliza `/api`, reenviado mediante `frontend/proxy.conf.json`. Si cambia el puerto de Laravel, ajustar ese proxy. Para producción, servir Angular y reenviar `/api` al backend bajo el mismo origen, o proveer `API_URL` en `src/app/config/api.config.ts` y ajustar `FRONTEND_URL` en Laravel. No se incluyen credenciales en Angular.

| Método | Endpoint | Resultado |
| --- | --- | --- |
| GET | `/api/asignaturas` | Asignaturas ordenadas por nombre |
| POST | `/api/asignaturas` | Crear asignatura |
| GET | `/api/tareas` | Tareas con asignatura, por fecha ascendente e id |
| GET | `/api/tareas?prioridad=Alta` | Filtrar por Alta, Media o Baja |
| GET | `/api/tareas?estado=Pendiente` | Filtrar por estado; combinable con prioridad |
| POST | `/api/tareas` | Crear tarea en estado Pendiente |
| PUT | `/api/tareas/{id}` | Editar los cinco campos del formulario |
| PATCH | `/api/tareas/{id}/estado` | Cambiar estado |
| DELETE | `/api/tareas/{id}` | Eliminar tarea |

POST de asignatura: `{"nombre":"Redes","codigo":"RED-06"}`.

POST/PUT de tarea:

```json
{
  "titulo": "Exposición",
  "descripcion": "Preparar una presentación sobre protocolos de red.",
  "fecha_entrega": "2030-12-15",
  "prioridad": "Alta",
  "asignatura_id": 1
}
```

Usar una asignatura existente y fecha actual o futura. PUT recibe el formulario completo y conserva el estado; PATCH recibe `{"estado":"Completada"}`. Respuestas con cuerpo: `{"data": ...}`. Errores: `{"message":"...","errors":{"campo":["mensaje"]}}`; `errors` se incluye para validaciones. Códigos: 200 consultas/actualizaciones, 201 creaciones, 204 eliminación sin cuerpo, 404 recurso inexistente, 422 validación y 500 error inesperado sin datos internos.

CORS permite el origen configurado y `localhost:4200`, con los métodos y encabezados necesarios. La clave foránea evita tareas huérfanas y restringe eliminar asignaturas con tareas. Completar otra vez una tarea completada se rechaza con 422, y el botón de completar se deshabilita en la interfaz. Las reglas de estado se ejecutan con transacción y bloqueo de fila.

## Pruebas

Todos estos comandos presuponen MySQL iniciado. Preparar la base de pruebas una vez desde la raíz:

```powershell
.\.tools\php\php.exe .\backend\artisan migrate --env=testing --no-interaction
```

API con PHPUnit, desde `backend/`:

```powershell
..\.tools\php\php.exe artisan test --compact
```

Las pruebas usan transacciones sobre MySQL y revierten sus datos. Se niegan a ejecutar si la base no termina en `_testing`, si la conexión no es MySQL o si existe un `DB_URL` que pueda redirigirla.

El servidor de Playwright aplica la misma guardia antes de escuchar y durante el arranque de cada solicitud. También exige `backend/.env.testing` y rechaza configuración cacheada para evitar que una prueba use accidentalmente la base de desarrollo. Esta comprobación no ejecuta SQL:

```powershell
# Desde backend
..\.tools\php\php.exe artisan academic:check-test-database --env=testing --no-interaction
```

Frontend, desde `frontend/`:

```powershell
npm.cmd test -- --watch=false
npm.cmd run build
```

Navegador e integración, preparar los datos desde la raíz y después ejecutar desde `frontend/`:

```powershell
# Raíz: solo crea/reemplaza fixtures identificados con [E2E] en la base de pruebas
.\.tools\php\php.exe .\backend\artisan academic:prepare-e2e --env=testing --no-interaction
cd frontend
npx.cmd playwright install chromium
npm.cmd run build
npm.cmd run e2e
npm.cmd run e2e:report
```

Playwright inicia y detiene sus servidores en 4300 (bundle de producción) y 8001 (Laravel en entorno testing). No usar esos puertos durante las pruebas. Si PHP no está en `.tools`, usar la variable `PHP_BINARY` con su ruta. MySQL debe estar iniciado previamente.

La suite comprueba registro, validaciones, edición, cambios de estado, filtros HTTP, confirmación/cancelación de eliminación, persistencia tras recarga y ausencia de desbordamiento horizontal en 375/1920 px. Solo la prueba explícita de estados vacíos y recuperación simula respuestas; las operaciones CRUD y RNF-01 usan API y MySQL reales. Los reportes están en `frontend/playwright-report/` y `artifacts/`. Para repetir la suite completa, volver a ejecutar `academic:prepare-e2e`; este comando se niega a tocar una base con tareas ajenas a los fixtures E2E.

RNF-01 mide tres navegaciones hasta mostrar las 200 filas y alcanzar el siguiente frame, incluyendo carga Angular, solicitudes HTTP y MySQL. Un MutationObserver registra el tiempo dentro del navegador, sin sumar el tiempo que Playwright tarda en comprobar las filas. El servidor PHP de pruebas habilita OPcache; el trazado de Playwright está desactivado para no distorsionar la medición. `artifacts/rnf-01.json` registra muestras y tiempos de API. Una medición local solo describe el equipo y la ejecución observados.

## Calidad, linters y auditorías

Desde `frontend/`, con las dependencias instaladas mediante `npm.cmd ci`:

```powershell
npm.cmd run lint
npm.cmd test -- --watch=false
npm.cmd run build
npm.cmd audit
npm.cmd audit --omit=dev
```

ESLint revisa TypeScript con información de tipos y plantillas Angular, incluidas las inline. `--max-warnings=0` hace fallar el comando si quedan advertencias. Las excepciones verificadas del linter se explican en el informe. Los scripts y E2E se comprueban por separado, no se presentan como cubiertos por ese comando.

Desde `backend/`:

```powershell
..\.tools\php\php.exe vendor/bin/pint --test --format=json
..\.tools\php\php.exe artisan test --compact
..\.tools\php\php.exe ..\.tools\composer.phar audit --locked
..\.tools\php\php.exe ..\.tools\composer.phar audit --locked --no-dev
```

Desde la raíz, comprobar que el servidor E2E rechace configuraciones inseguras sin abrir HTTP ni escribir en MySQL:

```powershell
node --test scripts/serve-backend.test.mjs
```

Para revisar sin tocar bases existentes, crear una base **nueva y dedicada**, terminar su nombre en `_testing`, otorgar acceso al usuario local y establecer `$env:DB_DATABASE='nombre_nuevo_testing'` en las terminales de pruebas. Aplicar las migraciones y preparar fixtures solo en esa base nueva. No utilizar bases `_testing` con datos personales: la suite comprueba eliminación de los registros que crea y el comando de fixtures reemplaza sus datos reservados.

## Decisiones y límites

La auditoría de producción ejecutada no reportó vulnerabilidades conocidas. La cadena de herramientas del linter tiene un aviso moderado transitivo de minimatch, documentado como riesgo residual de desarrollo en el informe. No se debe interpretar el resultado de producción como una auditoría total sin avisos.

- Título, descripción, asignatura, fecha y prioridad obligatorios; código de asignatura también obligatorio. No se agrega unicidad que los requisitos no solicitan.
- Fechas como día calendario de Colombia; al editar una tarea vencida se puede conservar la fecha, pero otra fecha debe ser hoy o posterior.
- Todos los estados permanecen consultables. La vista de pendientes muestra exactamente `Pendiente`; las actividades `En progreso` tienen resumen propio.
- La persistencia es exclusivamente MySQL. Recargar inicia consultas nuevas a la API.
- Demostración de un usuario, sin autenticación ni aislamiento entre estudiantes; se ejecuta en loopback. Una publicación multiusuario necesitaría una decisión adicional de alcance.
- Los servidores incorporados de PHP/Angular y el servidor estático de pruebas son herramientas de desarrollo. `APP_DEBUG=false` evita exponer detalles internos.
- Laravel Boost se instaló solo como dependencia de desarrollo siguiendo el `AGENTS.md` del generador. No hay chatbot, API de IA ni funciones de IA en el producto.
- Si un servicio está detenido, se muestra un error y un botón para reintentar; no se sustituyen datos fallidos por registros ficticios.
- En el entorno restringido del agente, la compilación y Chromium requirieron permisos para leer carpetas de OneDrive y ejecutar procesos locales. Esto no modifica la configuración del proyecto.
