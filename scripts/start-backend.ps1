param([switch]$CheckOnly)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$phpExecutable = Join-Path $projectRoot '.tools/php/php.exe'
$backendRoot = Join-Path $projectRoot 'backend'
$artisan = Join-Path $backendRoot 'artisan'

if (!(Test-Path -LiteralPath $phpExecutable)) {
    throw 'Falta PHP portable. Ejecute scripts/install-tools.ps1 siguiendo el README.'
}
if (!(Test-Path -LiteralPath (Join-Path $backendRoot 'vendor/autoload.php'))) {
    throw 'Faltan dependencias Laravel. Ejecute: .\.tools\php\php.exe .\.tools\composer.phar install --working-dir=backend'
}
if (!(Test-Path -LiteralPath (Join-Path $backendRoot '.env'))) {
    throw 'Falta backend/.env. Configure la conexion MySQL siguiendo el README, sin sobrescribir credenciales existentes.'
}

# El script de MySQL reconoce la instancia existente y conserva su directorio de datos.
& powershell.exe -NoProfile -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot 'start-mysql.ps1')
if ($LASTEXITCODE -ne 0) { throw 'No se pudo iniciar o comprobar MySQL. Laravel no se iniciara.' }

Push-Location $backendRoot
try {
    # Solo consulta el estado; no crea, modifica ni elimina tablas o registros.
    & $phpExecutable $artisan migrate:status --no-interaction
    if ($LASTEXITCODE -ne 0) { throw 'No se pudo consultar MySQL y sus migraciones. Revise backend/.env y el servicio MySQL.' }
    if ($CheckOnly) { Write-Output 'MySQL y Laravel disponibles. No se inicio otro servidor HTTP.'; return }

    Write-Output 'Laravel: http://127.0.0.1:8000. Mantenga esta terminal abierta y use otra para Angular.'
    # No pasar silenciosamente al puerto 8001: el proxy de Angular apunta al 8000.
    & $phpExecutable $artisan serve --host=127.0.0.1 --port=8000 --tries=1 --no-reload
    if ($LASTEXITCODE -ne 0) { throw 'Laravel no pudo mantenerse en el puerto 8000. Compruebe si otro servidor ya lo utiliza.' }
}
finally {
    Pop-Location
}
