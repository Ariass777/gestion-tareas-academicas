<?php

// Solo configura la instancia portable aislada; nunca usa un servidor externo.
declare(strict_types=1);

$root = dirname(__DIR__);
$credentialsFile = $root.'/.runtime/mysql-admin.json';
$shutdown = in_array('--shutdown', $argv, true);
$credentials = is_file($credentialsFile)
    ? json_decode(file_get_contents($credentialsFile), true, flags: JSON_THROW_ON_ERROR)
    : ['root_password' => '', 'app_password' => bin2hex(random_bytes(24))];
$connection = null;
for ($attempt = 0; $attempt < 30; $attempt++) {
    try {
        $connection = new PDO('mysql:host=127.0.0.1;port=3307;charset=utf8mb4', 'root', $credentials['root_password'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
        break;
    } catch (PDOException $e) {
        if ($attempt === 29) { throw $e; }
        usleep(500000);
    }
}
if ($shutdown) {
    $connection->exec('SHUTDOWN');
    echo "Apagado ordenado solicitado.\n";
    exit;
}
if ($credentials['root_password'] === '') {
    $credentials['root_password'] = bin2hex(random_bytes(24));
    // Se conserva el secreto antes de modificar el usuario para permitir reintentar.
    file_put_contents($credentialsFile, json_encode($credentials, JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR));
    $connection->exec("ALTER USER 'root'@'localhost' IDENTIFIED BY ".$connection->quote($credentials['root_password']));
}
foreach (['gestion_tareas_academicas', 'gestion_tareas_academicas_testing'] as $database) {
    $connection->exec("CREATE DATABASE IF NOT EXISTS `$database` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
}
$connection->exec("CREATE USER IF NOT EXISTS 'academica'@'localhost' IDENTIFIED BY ".$connection->quote($credentials['app_password']));
$connection->exec("GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, REFERENCES ON gestion_tareas_academicas.* TO 'academica'@'localhost'");
$connection->exec("GRANT ALL PRIVILEGES ON gestion_tareas_academicas_testing.* TO 'academica'@'localhost'");
$template = file_get_contents($root.'/backend/.env.example');
foreach (['.env' => 'gestion_tareas_academicas', '.env.testing' => 'gestion_tareas_academicas_testing'] as $file => $database) {
    $target = $root.'/backend/'.$file;
    if (is_file($target)) { echo "$file existente: no se sobrescribe.\n"; continue; }
    $content = preg_replace('/^DB_DATABASE=.*$/m', 'DB_DATABASE='.$database, $template);
    $content = preg_replace('/^DB_PASSWORD=.*$/m', 'DB_PASSWORD='.$credentials['app_password'], $content);
    $content = preg_replace('/^APP_KEY=.*$/m', 'APP_KEY=base64:'.base64_encode(random_bytes(32)), $content);
    if ($file === '.env.testing') {
        $content = preg_replace('/^APP_ENV=.*$/m', 'APP_ENV=testing', $content);
    }
    file_put_contents($target, $content);
}
echo "Bases de desarrollo y pruebas disponibles en MySQL 127.0.0.1:3307. Secretos guardados en archivos ignorados.\n";
