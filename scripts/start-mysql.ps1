$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$mysqlRoot = [System.IO.Path]::GetFullPath((Join-Path $projectRoot '.tools/mysql/mysql-8.4.13-winx64'))
$runtimeRoot = Join-Path $projectRoot '.runtime'
$dataRoot = Join-Path $runtimeRoot 'mysql-data'
$mysqlDaemon = [System.IO.Path]::GetFullPath((Join-Path $mysqlRoot 'bin/mysqld.exe'))
if (!(Test-Path -LiteralPath $mysqlDaemon)) { throw 'Falta MySQL portable. Consulte README.md o utilice su servidor MySQL existente.' }
New-Item -ItemType Directory -Path $runtimeRoot -Force | Out-Null
if (!(Test-Path -LiteralPath $dataRoot)) {
    & $mysqlDaemon --no-defaults --initialize-insecure "--basedir=$mysqlRoot" "--datadir=$dataRoot" --console
    if ($LASTEXITCODE -ne 0) { throw 'No se pudo inicializar la instancia nueva de MySQL.' }
}
$mysqlPort = 3307
$listener = Get-NetTCPConnection -LocalPort $mysqlPort -State Listen -ErrorAction SilentlyContinue
if ($listener) {
    $runningProcess = Get-CimInstance Win32_Process -Filter "ProcessId=$($listener[0].OwningProcess)"
    if ($runningProcess.ExecutablePath -ne $mysqlDaemon) { throw 'El puerto 3307 está ocupado por otro proceso.' }
    Write-Output 'La instancia local del proyecto ya está iniciada en 127.0.0.1:3307.'
    exit 0
}
# Start-Process necesita comillas en los argumentos con rutas que contienen espacios.
$daemonArgs = @('--no-defaults', ('--basedir="' + $mysqlRoot + '"'), ('--datadir="' + $dataRoot + '"'), '--bind-address=127.0.0.1', '--port=3307', '--mysqlx=0', ('--log-error="' + (Join-Path $runtimeRoot 'mysql-error.log') + '"'))
$mysqlProcess = Start-Process -FilePath $mysqlDaemon -ArgumentList $daemonArgs -WindowStyle Hidden -PassThru
for ($attempt = 0; $attempt -lt 40; $attempt++) {
    $listener = Get-NetTCPConnection -LocalPort $mysqlPort -State Listen -ErrorAction SilentlyContinue
    if ($listener) {
        $listener[0].OwningProcess | Set-Content (Join-Path $runtimeRoot 'mysql.pid')
        Write-Output "MySQL iniciado (PID $($listener[0].OwningProcess)), puerto 3307. Datos: .runtime/mysql-data."
        exit 0
    }
    Start-Sleep -Milliseconds 500
}
throw 'MySQL no abrio el puerto 3307. Revise .runtime/mysql-error.log.'
