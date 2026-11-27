# Sistema Web de Gestión de Tareas Académicas

**Preparación técnica de semana 10 — 27/11/2026:** 87 pruebas Vitest, 327 PHPUnit (1014 aserciones), 10 Playwright y 3 Node aprobadas localmente. ESLint, TypeScript y build aprobados. Cobertura de líneas: frontend 61,12 % global; backend 74,11 % global y 98,48 % en HTTP/modelos. [Evidencias verificables](docs/EVIDENCIAS_S10.md), [alcance de cobertura](docs/COBERTURA_Y_PRUEBAS_S10.md) e [índice documental](docs/README.md).

**Cierre técnico integrado en main:** [PR #4](https://github.com/Ariass777/gestion-tareas-academicas/pull/4), merge `6b5b57aa16731d8fdd6d738bc50f2861c6684613`, después de comprobar checks y ausencia de conflictos. [Pipeline aprobado sobre main: 46018960368](https://github.com/Ariass777/gestion-tareas-academicas/actions/runs/46018960368), job `verificar` en success, mismas suites y métricas. [Resultados remotos](docs/VALIDACION_REMOTA_S10.md), [evidencia del cierre](docs/evidencias/semana10/cierre-main.json) y [workflow](.github/workflows/ci.yml). La rama original publicada se conserva. [Base de evidencias para redactar el informe](docs/BASE_INFORME_FINAL.md), [guía de despliegue local](docs/GUIA_DESPLIEGUE_LOCAL.md), [plan de operación](docs/PLAN_OPERACION_LOCAL.md) y [adenda de requisitos/diseño](docs/ADENDA_REQUISITOS_DISENO_S10.md). El alcance continúa siendo local, de un usuario y sin autenticación. La base es material preparatorio; no es el informe final ni acredita los documentos históricos que faltan.

## 1. Qué es el proyecto.

Aplicación académica individual para registrar asignaturas, organizar actividades, establecer fechas y prioridades y actualizar el progreso. Interfaz **Académica**, con verde oscuro y diseño adaptable.

La implementación parte de los DOCX de `docs/`, leídos antes del desarrollo. El diseño de semana 4 tiene precedencia: **Angular → API REST Laravel → MySQL**. Los originales se conservan intactos. Las decisiones y trazabilidad se encuentran en [docs/DECISIONES.md](docs/DECISIONES.md), y los resultados ejecutados en [docs/VALIDACION.md](docs/VALIDACION.md).

El objetivo académico es aplicar análisis de requisitos, arquitectura por capas, implementación y verificación al proyecto individual del seminario **Inteligencia Artificial Aplicada al Ciclo de Vida del Software**. La revisión del primer incremento está documentada en [informe oficial de semana 6](revision_seguridad.md) y su [informe complementario](docs/revision_seguridad.md), [bitácora de IA](docs/bitacora_ia.md) y [evidencia ejecutada](docs/evidencia_revision.json).

Funcionalidades: registrar y listar asignaturas; crear, consultar, editar y eliminar tareas con confirmación; filtrar por prioridad y estado; actualizar progreso; consultar el resumen de entregas y conservar datos en MySQL después de recargar. No se incorpora IA al producto.

### Decisiones y limitaciones conocidas

Tras presentar la propuesta y recibir autorización, se actualizaron cuatro componentes Symfony a 8.1.12 y typescript-eslint a 8.74.0, que resuelve minimatch 11.0.9. Las auditorías posteriores del 27/11/2026 dieron **cero avisos Composer y cero avisos npm en el árbol completo**; el pipeline posterior aprobó. Los cinco avisos Symfony y S-02 cuentan con corrección técnica verificada. Se conservan los resultados anteriores como antecedentes; no se convierten en auditorías limpias retrospectivas. [Alcance, referencias y evidencia](docs/SEGURIDAD_DEPENDENCIAS_S10.md).

- Título, descripción, asignatura, fecha y prioridad obligatorios; código de asignatura también obligatorio. No se agrega unicidad que los requisitos no solicitan.
- Fechas como día calendario de Colombia; al editar una tarea vencida se puede conservar la fecha, pero otra fecha debe ser hoy o posterior.
- Todos los estados permanecen consultables. La vista de pendientes muestra exactamente `Pendiente`; las actividades `En progreso` tienen resumen propio.
- La persistencia es exclusivamente MySQL. Recargar inicia consultas nuevas a la API.
- Demostración de un usuario, sin autenticación ni aislamiento entre estudiantes; se ejecuta en loopback. Una publicación multiusuario necesitaría una decisión adicional de alcance.
- Los servidores incorporados de PHP/Angular y el servidor estático de pruebas son herramientas de desarrollo. `APP_DEBUG=false` evita exponer detalles internos.
- Laravel Boost se instaló solo como dependencia de desarrollo siguiendo el `AGENTS.md` del generador. No hay chatbot, API de IA ni funciones de IA en el producto.
- Si un servicio está detenido, se muestra un error y un botón para reintentar; no se sustituyen datos fallidos por registros ficticios.
- En el entorno restringido del agente, la compilación y Chromium requirieron permisos para leer carpetas de OneDrive y ejecutar procesos locales. Esto no modifica la configuración del proyecto.

## 2. Requisitos.

Versiones registradas durante la revisión del 14/11/2026 en este equipo (no se reinstalaron para este ajuste documental):

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

## 3. Instalación.

**Estado de verificación al 27/11/2026:** se extrajo una copia nueva del código versionado y se instalaron `vendor` y `node_modules` desde los lockfiles, sin copiarlos. Aprobaron migraciones en otra base nueva, seeder sintético, build, consultas API/proxy y respaldo/restauración. Se reutilizaron los binarios ya instalados; la reinstalación completa de herramientas en otra máquina permanece pendiente. [Procedimientos y límites](docs/GUIA_DESPLIEGUE_LOCAL.md), [evidencia de operación](docs/evidencias/semana10/operacion.json). El antecedente de [VALIDACION.md](docs/VALIDACION.md) conserva su contexto de semana 5/6.

### Instalación portable desde una copia nueva en Windows

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
```

Después de instalar, iniciar los servidores según la sección 4. Ejecución. `install-tools.ps1` descarga los binarios oficiales dentro del proyecto, verifica las sumas publicadas y no cambia el PATH ni instala servicios de Windows. Necesita red y el runtime Visual C++ x64. La instancia nueva solo escucha en `127.0.0.1:3307`; no utiliza servicios o bases existentes. Durante su primera preparación, `local-database.php` genera contraseñas aleatorias, protege la cuenta root y crea el usuario de aplicación. Los secretos se guardan exclusivamente en `.runtime/mysql-admin.json`, `backend/.env` y `backend/.env.testing`, ignorados por Git. Si estos `.env` ya existen, el script los conserva.

### Usar una instalación MySQL propia

También se puede usar PHP y Composer instalados globalmente. Sustituir las rutas de `.tools` por `php` y `composer`.

Con PHP, Composer y MySQL propios ya instalados, omitir la preparación portable. Instalar las dependencias desde la raíz y luego configurar las bases y variables indicadas a continuación:

```powershell
composer install --working-dir=backend
cd frontend
npm.cmd ci
```

Crear **bases nuevas** sin afectar bases existentes:

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
# Iniciar el servidor después, como indica la sección 4.
```

El seeder agrega cuatro asignaturas y cinco tareas de ejemplo con fechas relativas al día de ejecución. Es repetible: conserva registros existentes y no los restablece. No se utiliza `migrate:fresh`, `db:wipe` ni SQLite para desarrollar o probar esta aplicación.

## 4. Ejecución.

Después de completar la instalación portable y las migraciones, iniciar los servicios con los scripts incluidos. Las dependencias y bases ya estaban preparadas en el equipo de desarrollo. Desde la raíz, en PowerShell:

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

### Alternativa con PHP y MySQL propios

Iniciar previamente el servicio de MySQL de la instalación propia y comprobar que su puerto coincida con `backend/.env`. Desde `backend/`, mantener abierta esta terminal:

```powershell
php artisan serve --host=127.0.0.1 --port=8000 --tries=1
```

En otra terminal ejecutar Angular como se indicó arriba. `start-backend.ps1` corresponde a la instancia portable en 3307; para un servicio MySQL propio utilizar este arranque manual. No volver a ejecutar migraciones ni seeders en cada inicio.

### API REST

Base de desarrollo: `http://127.0.0.1:8000/api`. El frontend utiliza `/api`, reenviado mediante `frontend/proxy.conf.json`. Si cambia el puerto de Laravel, ajustar ese proxy. Para producción, servir Angular y reenviar `/api` al backend bajo el mismo origen, o proveer `API_URL` en `frontend/src/app/config/api.config.ts` y ajustar `FRONTEND_URL` en Laravel. No se incluyen credenciales en Angular.

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

## 5. Pruebas.

Resultados locales de semana 10: **327 pruebas PHP (1014 aserciones), 87 Angular/Vitest, 10 E2E y 3 Node aprobadas**; compilación, ESLint y TypeScript aprobados. [Resumen portable](docs/evidencias/semana10/resultados.json) y [alcance, incidentes y cobertura](docs/COBERTURA_Y_PRUEBAS_S10.md). Los resultados anteriores se conservan en [evidencia_revision.json](docs/evidencia_revision.json) y [registro de semana 7](registro_pruebas.md). No se suman repeticiones como nuevas pruebas ni se confunde validación local con CI remoto.

Las pruebas de API e integración presuponen MySQL iniciado y una base nueva y desechable exclusiva para pruebas. El sufijo `_testing` no demuestra que esté vacía ni verifica independientemente la identidad física del servidor. Preparar la base de pruebas una vez desde la raíz:

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
npm.cmd run test:ci
npm.cmd run typecheck
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

### Calidad, linters y auditorías

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

## 6. Estructura.

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
README.md         Instalación, ejecución, pruebas y alcance
revision_seguridad.md  Informe oficial breve de semana 6
.tools/           Herramientas portátiles ignoradas por Git
.runtime/         Datos MySQL y secretos locales ignorados por Git
artifacts/        Resultados y capturas locales ignorados por Git
```

## 7. Uso de IA.

La IA se utiliza como apoyo al desarrollo y a la revisión académica, sin incorporarla al sistema en ejecución. Codex realizó inspección, refactorizaciones localizadas, documentación y pruebas. La segunda revisión histórica fue realizada por un agente independiente **gpt-6-astra** con contexto separado; no se presenta como una segunda herramienta utilizada durante este ajuste documental.

La estudiante revisó diffs, comunicó observaciones de documentación y analizó los límites de S-01. También reportó ejecutar `npm ls minimatch` y `npm audit --omit=dev`; la bitácora distingue esos resultados de las pruebas del agente. No se atribuyen a la estudiante verificaciones adicionales ni aprobación definitiva de S-02.

Evidencia: [informe oficial](revision_seguridad.md), [informe detallado](docs/revision_seguridad.md), [bitácora de IA](docs/bitacora_ia.md) y [resultados de ejecución](docs/evidencia_revision.json). La bitácora conserva prompts, decisiones, falsos positivos y tareas pendientes de supervisión humana.

## 8. Autor y licencia.

**Autora:** Linda Verónica Arteaga Arias. Proyecto académico individual de Ingeniería de Software para el seminario Inteligencia Artificial Aplicada al Ciclo de Vida del Software.

**Licencia global pendiente de definición.** El repositorio no contiene un archivo `LICENSE` ni una elección global documentada. `backend/composer.json` declara `MIT`; ese dato del manifiesto del backend se conserva y no se extiende aquí al proyecto completo. La autora debe confirmar la licencia de la entrega. Las dependencias mantienen sus propias licencias; no se añade ninguna licencia nueva en este ajuste.
