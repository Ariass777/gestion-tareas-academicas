# Plan de operación local

Fecha: **27/11/2026, America/Bogota**. Responsable operativo previsto: la estudiante que mantiene su demostración. Esto no afirma una revisión o aprobación humana ya realizada. Alcance de un usuario, equipo local, sin autenticación ni SLA de producción pública.

## Rutina de operación

| Momento | Acción | Evidencia esperada |
|---|---|---|
| Antes de demostrar | Comprobar commit, herramientas, MySQL, `migrate:status` y disponibilidad de puertos. | Versiones, migraciones Ran y salida correcta de `start-backend.ps1 -CheckOnly`. |
| Al iniciar | Arrancar API/Angular; consultar `/up`, asignaturas y tareas directamente y por proxy. | HTTP 200 y JSON esperado, no solo página HTML. |
| Durante la sesión | Revisar errores de interfaz, consola de servidores, `backend/storage/logs/laravel.log` y `.runtime/mysql-error.log`. | Sin errores nuevos sin explicar; no mostrar logs privados en diapositivas. |
| Antes de actualizar | Respaldar, anotar commit/configuración y verificar restauración en otra base. | Respaldo privado y ensayo documentado. |
| Al terminar | Detener HTTP; apagar MySQL de forma ordenada si no hay otras sesiones. | Procesos cerrados y datos conservados. |

## Copias de seguridad

Hacer una copia antes de cambios de esquema/configuración y al terminar sesiones con datos que se quieran conservar. Mantener la más reciente y la anterior hasta comprobar la restauración y terminar la revisión; revisar la necesidad de conservarlas al cerrar el proyecto. Los respaldos con información personal deben tener finalidad, acceso y eliminación definidos, y no deben entrar en Git ni en proveedores de IA.

Ejemplo PowerShell usando las herramientas portables. Crear antes un archivo privado `.runtime/backup-client.cnf` protegido por permisos del sistema operativo con `[client]`, host, port, user, password y `default-character-set=utf8mb4`. No imprimirlo ni poner la contraseña en argumentos de procesos. Usar una cuenta autorizada solo para la base pertinente. Los nombres siguientes son ejemplos sintéticos:

```powershell
$dumpExe = (Resolve-Path .tools/mysql/mysql-8.4.13-winx64/bin/mysqldump.exe).Path
$clientConfig = (Resolve-Path .runtime/backup-client.cnf).Path
$backupFile = Join-Path (Resolve-Path .runtime).Path 'demo-sintetica.sql'
& $dumpExe "--defaults-extra-file=$clientConfig" --single-transaction --skip-lock-tables --no-tablespaces --set-gtid-purged=OFF --column-statistics=0 "--result-file=$backupFile" base_demo_autorizada
if ($LASTEXITCODE -ne 0) { throw 'Respaldo fallido: conservar el estado y revisar el log' }
Get-FileHash -LiteralPath $backupFile -Algorithm SHA256
```

`--result-file` evita que PowerShell cambie la codificación del SQL. El dump no usa `--databases`: no incluye CREATE DATABASE/USE para forzar accidentalmente el nombre original durante la restauración. El hash comprueba integridad del archivo, no recuperabilidad: esta se verifica restaurándolo. Respaldo y configuración privada permanecen en `.runtime`, ignorado por Git. Para este modelo sin vistas/rutinas/triggers no se exportan objetos adicionales; si el esquema cambia, revisar el procedimiento.

## Restauración en destino nuevo

1. Crear una **base nueva y vacía**, con un nombre explícito, y un usuario con permisos solo sobre el destino necesario. Usar la misma familia MySQL, charset y collation. Conservar intacta la base original.
2. Comprobar servidor, base seleccionada y ausencia de tablas antes de importar; detener cualquier aplicación que use el destino. Elegir un respaldo propio y conocido, no SQL de origen desconocido.
3. Importar sin pasar contraseñas por línea de comandos:

```powershell
$mysqlExe = (Resolve-Path .tools/mysql/mysql-8.4.13-winx64/bin/mysql.exe).Path
$restore = Start-Process -FilePath $mysqlExe -ArgumentList @("--defaults-extra-file=`"$clientConfig`"", '--database=base_nueva_restauracion') -RedirectStandardInput $backupFile -RedirectStandardOutput .runtime/restore-output.log -RedirectStandardError .runtime/restore-error.log -WindowStyle Hidden -Wait -PassThru
if ($restore.ExitCode -ne 0) { throw 'Importacion fallida: no cambiar la aplicacion al destino' }
```

4. Comparar migraciones, cantidades y valores de registros sintéticos; realizar consultas API y una recarga. Registrar resultados. No basta con que el comando termine en 0.
5. Solo después de validar, cambiar el `.env` local al destino elegido, iniciar servicios y comprobar funcionalidad. Conservar la configuración anterior para revertir. No publicar dumps ni `.env`.

La preparación S10 ensaya exportación/restauración con datos sintéticos en bases nuevas y compara filas completas mediante huellas. Los nombres aleatorios y secretos de ejecución se conservan exclusivamente en archivos ignorados. No se restaura sobre la base de desarrollo.

## Monitoreo e incidentes

| Síntoma | Diagnóstico seguro | Respuesta |
|---|---|---|
| Angular responde pero `/api` devuelve 502/ECONNREFUSED | Consultar API 8000 directamente; comprobar la terminal Laravel y MySQL. | Iniciar backend y mantenerlo abierto. El proxy espera 8000; no cambiarlo a puertos aleatorios. |
| `/up` funciona y API devuelve 500 | Revisar conexión/migraciones y logs locales sin exponer secretos. | Corregir configuración o arrancar MySQL; conservar datos. No ejecutar seeders/borrados para ocultar el fallo. |
| 422 en un formulario | Leer errores de campo y contrastar contrato de la adenda. | Corregir entrada; conservar la tarea sin confirmar un guardado fallido. |
| Puerto ocupado | Identificar proceso y copia que lo utiliza. | Detener solo el proceso propio autorizado o elegir una configuración explícita para una copia aislada. |
| Guardia de pruebas rechaza configuración | Revisar APP_ENV, `.env.testing`, DB_URL, sufijo y caché; verificar usuario/instancia. | Cancelar pruebas hasta tener un destino nuevo y exclusivo; no debilitar la guardia. |
| Sospecha de pérdida/corrupción | Detener escrituras, conservar logs y respaldo. | Restaurar en una base nueva, comparar y decidir reversión. No sobrescribir la única copia. |
| Exposición de un secreto | Detener compartición y registrar alcance sin repetir el secreto. | Rotar credencial, revisar acceso e historial; escalar a la estudiante. No declarar incidente resuelto solo por añadir `.gitignore`. |

Registrar fecha, comando, síntoma, efecto, corrección y comprobación posterior. Si un error compromete datos, detener la demostración y priorizar su preservación. Revisar que los logs no incluyan datos personales antes de compartirlos. Mantener `APP_DEBUG=false`; si se configura logging diario, establecer retención local y permisos apropiados en vez de acumular logs indefinidamente.

## Mantenimiento y reversión

Antes de cada entrega: revisar estado Git, lockfiles, suites y auditorías total/de producción; verificar respaldo y enlaces. Actualizar dependencias en una rama y con pruebas, sin `audit fix --force` como solución automática. S-02 permanece abierto: no se cierra por tener un pipeline verde. La licencia global sigue pendiente de elección de la autora.

Reversión: conservar el commit/copia anterior y su configuración privada; detener HTTP nuevo y arrancar la copia anterior solo si el esquema es compatible. Si requiere recuperar datos, restaurar en otra base y cambiar configuración tras validarla. No se prescribe `migrate:rollback`, `reset --hard`, borrado de datos ni reescritura de historial. Un respaldo nuevo de los datos actuales puede ser necesario antes de revertir para conservar cambios legítimos posteriores.

## Estado de validación y límites

La instalación de dependencias en copia limpia, migraciones desde cero, consultas directas/proxy, respaldo/restauración y parada de los servidores propios se registran en [evidencias S10](EVIDENCIAS_S10.md), distinguiendo éxitos, intentos fallidos y procedimientos no ejecutados. El apagado global de MySQL, una máquina distinta, un incidente real, el tratamiento de datos personales reales y un despliegue público **no se declaran verificados**. Tampoco se acredita concurrencia real, alta disponibilidad, aislamiento multiusuario ni compatibilidad Firefox/Safari.
