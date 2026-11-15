$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$toolsRoot = Join-Path $projectRoot '.tools'
New-Item -ItemType Directory -Path $toolsRoot -Force | Out-Null

function Download-VerifiedFile {
    param([string]$Url, [string]$Target, [string]$Algorithm, [string]$ExpectedHash)
    if (Test-Path -LiteralPath $Target) {
        if ((Get-FileHash -LiteralPath $Target -Algorithm $Algorithm).Hash.ToLowerInvariant() -eq $ExpectedHash) { return }
        throw "El archivo existente tiene una suma incorrecta: $Target. Reviselo antes de continuar."
    }
    & curl.exe -fL --connect-timeout 20 --max-time 600 -o $Target $Url
    if ($LASTEXITCODE -ne 0) { throw "No se pudo descargar $Url" }
    if ((Get-FileHash -LiteralPath $Target -Algorithm $Algorithm).Hash.ToLowerInvariant() -ne $ExpectedHash) { throw "Suma incorrecta: $Target" }
}

$phpRoot = Join-Path $toolsRoot 'php'
if (!(Test-Path (Join-Path $phpRoot 'php.exe'))) {
    $phpZip = Join-Path $toolsRoot 'php.zip'
    Download-VerifiedFile 'https://downloads.php.net/~windows/releases/archives/php-8.5.12-1-nts-Win32-vs17-x64.zip' $phpZip 'SHA256' '2a36a2edcb7a5b9252f638fd5e4cf84d7f6e066092654220dc0b63e5cf4e9723'
    Expand-Archive -LiteralPath $phpZip -DestinationPath $phpRoot
}
$caPath = Join-Path $toolsRoot 'cacert.pem'
if (!(Test-Path $caPath)) {
    & curl.exe -fL --connect-timeout 20 --max-time 60 -o $caPath 'https://curl.se/ca/cacert.pem'
    if ($LASTEXITCODE -ne 0) { throw 'No se pudo descargar el archivo de certificados CA.' }
}
$phpIni = Join-Path $phpRoot 'php.ini'
if (!(Test-Path $phpIni)) {
    $phpDirectory = $phpRoot.Replace('\', '/')
    $caFile = $caPath.Replace('\', '/')
    @(( 'extension_dir="' + $phpDirectory + '/ext"' ), 'extension=curl', 'extension=fileinfo', 'extension=mbstring', 'extension=openssl', 'extension=pdo_mysql', 'extension=zip', 'extension=intl', 'date.timezone=America/Bogota', 'memory_limit=512M', ( 'curl.cainfo="' + $caFile + '"' ), ( 'openssl.cafile="' + $caFile + '"' )) | Set-Content -LiteralPath $phpIni -Encoding ascii
}
$phpExecutable = Join-Path $phpRoot 'php.exe'
$composer = Join-Path $toolsRoot 'composer.phar'
if (!(Test-Path $composer)) {
    $installer = Join-Path $toolsRoot 'composer-setup.php'
    $signature = Join-Path $toolsRoot 'composer.sig'
    & curl.exe -fL --connect-timeout 20 --max-time 60 -o $signature 'https://composer.github.io/installer.sig'
    if ($LASTEXITCODE -ne 0) { throw 'No se pudo descargar la firma de Composer.' }
    Download-VerifiedFile 'https://getcomposer.org/installer' $installer 'SHA384' (Get-Content $signature -Raw).Trim()
    & $phpExecutable $installer "--install-dir=$toolsRoot" --filename=composer.phar
    if ($LASTEXITCODE -ne 0) { throw 'No se pudo instalar Composer.' }
}
$mysqlRoot = Join-Path $toolsRoot 'mysql/mysql-8.4.13-winx64'
if (!(Test-Path (Join-Path $mysqlRoot 'bin/mysqld.exe'))) {
    $mysqlZip = Join-Path $toolsRoot 'mysql.zip'
    Download-VerifiedFile 'https://cdn.mysql.com/Downloads/MySQL-8.4/mysql-8.4.13-winx64.zip' $mysqlZip 'MD5' '7b94489d5524dea9b27097068bea25a8'
    Expand-Archive -LiteralPath $mysqlZip -DestinationPath (Join-Path $toolsRoot 'mysql')
}
& $phpExecutable --version
& $phpExecutable $composer --version
Write-Output 'Herramientas portatiles disponibles en .tools. No se cambio el PATH ni se instalaron servicios globales.'
