<?php

namespace App\Console\Commands;

use App\Models\Asignatura;
use App\Models\Tarea;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class PrepareE2e extends Command
{
    protected $signature = 'academic:prepare-e2e';

    protected $description = 'Prepara 200 tareas exclusivamente en una base MySQL de pruebas';

    public function handle(): int
    {
        if (! app()->environment('testing') || config('database.default') !== 'mysql' || config('database.connections.mysql.url')
            || ! str_ends_with((string) config('database.connections.mysql.database'), '_testing')) {
            $this->error('Se requiere APP_ENV=testing y una base MySQL terminada en _testing.');

            return self::FAILURE;
        }
        if (Tarea::where('titulo', 'not like', '[E2E]%')->exists()) {
            $this->error('La base de pruebas contiene tareas ajenas a E2E. Se conserva intacta; use otra base vacía.');

            return self::FAILURE;
        }
        DB::transaction(function (): void {
            Tarea::where('titulo', 'like', '[E2E]%')->delete();
            $asignatura = Asignatura::firstOrCreate(['codigo' => 'E2E-06', 'nombre' => 'Ingeniería de Software E2E']);
            $rows = [];
            for ($i = 1; $i <= 200; $i++) {
                $rows[] = [
                    'titulo' => sprintf('[E2E] Actividad académica %03d', $i),
                    'descripcion' => 'Analizar los requisitos y documentar las decisiones del proyecto académico.',
                    'fecha_entrega' => today()->addDays($i % 20)->format('Y-m-d'),
                    'prioridad' => Tarea::PRIORIDADES[$i % 3],
                    'estado' => Tarea::ESTADOS[$i % 3],
                    'asignatura_id' => $asignatura->id,
                    'created_at' => now(), 'updated_at' => now(),
                ];
            }
            Tarea::insert($rows);
        });
        $this->info('200 tareas preparadas en MySQL de pruebas. La base de desarrollo no se modifica.');

        return self::SUCCESS;
    }
}
