$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$listener = Get-NetTCPConnection -LocalPort 3307 -State Listen -ErrorAction SilentlyContinue
if (!$listener) { Write-Output 'La instancia MySQL ya esta detenida.'; exit 0 }
$mysqlProcessId = $listener[0].OwningProcess
$mysqlProcess = Get-CimInstance Win32_Process -Filter "ProcessId=$mysqlProcessId" -ErrorAction SilentlyContinue
$expectedExecutable = [System.IO.Path]::GetFullPath((Join-Path $projectRoot '.tools/mysql/mysql-8.4.13-winx64/bin/mysqld.exe'))
if (!$mysqlProcess -or $mysqlProcess.ExecutablePath -ne $expectedExecutable) { throw 'El PID no corresponde a la instancia MySQL del proyecto.' }
$phpExecutable = Join-Path $projectRoot '.tools/php/php.exe'
& $phpExecutable (Join-Path $PSScriptRoot 'local-database.php') --shutdown
if ($LASTEXITCODE -ne 0) { throw 'No se pudo apagar MySQL de forma ordenada.' }
