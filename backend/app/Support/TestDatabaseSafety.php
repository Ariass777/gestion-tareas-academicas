<?php

namespace App\Support;

use Illuminate\Foundation\Application;
use LogicException;

/** Comprueba el destino de pruebas antes de permitir solicitudes o fixtures. */
final class TestDatabaseSafety
{
    /**
     * Rechaza configuraciones que puedan redirigir pruebas a datos de desarrollo.
     *
     * No abre conexiones ni modifica tablas. Exige un .env.testing explicito;
     * una variable DB_DATABASE heredada solo se acepta si termina en _testing.
     *
     * @throws LogicException Si la configuracion cacheada, entorno o conexion no son seguros.
     */
    public static function assertSafe(Application $app): void
    {
        if ($app->configurationIsCached()) {
            throw new LogicException('Las pruebas requieren configuracion sin cache. Revise la cache antes de continuar.');
        }

        if (! is_file($app->environmentPath().'/.env.testing')) {
            throw new LogicException('Falta .env.testing. Se rechaza el uso implicito de .env para pruebas.');
        }

        $config = $app->make('config');
        $database = $config->get('database.connections.mysql.database');

        if (! $app->environment('testing')
            || $config->get('database.default') !== 'mysql'
            || $config->get('database.connections.mysql.url')
            || ! is_string($database)
            || ! preg_match('/^[a-zA-Z0-9_]+_testing$/D', $database)) {
            throw new LogicException('Las pruebas requieren entorno testing, MySQL, DB_URL vacio y una base terminada en _testing.');
        }
    }
}
