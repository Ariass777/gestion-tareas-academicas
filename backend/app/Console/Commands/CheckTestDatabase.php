<?php

namespace App\Console\Commands;

use App\Support\TestDatabaseSafety;
use Illuminate\Console\Command;
use LogicException;

class CheckTestDatabase extends Command
{
    protected $signature = 'academic:check-test-database';

    protected $description = 'Verifica sin escrituras que el destino MySQL sea exclusivo de pruebas';

    /**
     * Comprueba la configuracion efectiva; no revela credenciales ni modifica MySQL.
     *
     * @return int Codigo de salida cero si el servidor E2E puede iniciarse.
     */
    public function handle(): int
    {
        try {
            TestDatabaseSafety::assertSafe($this->laravel);
        } catch (LogicException $exception) {
            $this->error($exception->getMessage());

            return self::FAILURE;
        }

        $this->info('Destino MySQL de pruebas verificado sin modificar datos.');

        return self::SUCCESS;
    }
}
