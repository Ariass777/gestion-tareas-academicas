<?php

namespace Tests\Feature;

use App\Models\Asignatura;
use App\Models\Tarea;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use PHPUnit\Framework\Attributes\DataProviderExternal;
use Tests\Semana7Data;
use Tests\TestCase;

class Semana7ApiTest extends TestCase
{
    use DatabaseTransactions;

    protected function setUp(): void
    {
        parent::setUp();
        Carbon::setTestNow(Carbon::parse('2026-11-22T15:00:00Z')->setTimezone('America/Bogota'));
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();
        parent::tearDown();
    }

    private function asignatura(): Asignatura
    {
        return Asignatura::factory()->create(['nombre' => "Diseño del ñandú d'álgebra", 'codigo' => 'FIC-07']);
    }

    /** @return array<string, mixed> */
    private function payload(): array
    {
        return ['titulo' => 'Exposición ficticia de señales', 'descripcion' => "Ensayo d'algoritmos y ñandúes.",
            'fecha_entrega' => '2026-11-22', 'prioridad' => 'Alta', 'asignatura_id' => $this->asignatura()->id];
    }

    /** @param array<string, mixed> $datos */
    private function tarea(array $datos = []): Tarea
    {
        return Tarea::factory()->create(array_replace($this->payload(), ['estado' => 'Pendiente'], $datos));
    }

    /** @return array<string, array<int, array<string, mixed>>> */
    private function snapshot(): array
    {
        $snapshot = [];
        foreach (['asignaturas', 'tareas'] as $tabla) {
            $snapshot[$tabla] = DB::table($tabla)->orderBy('id')->get()->map(fn ($fila): array => (array) $fila)->all();
        }

        return $snapshot;
    }

    #[DataProviderExternal(Semana7Data::class, 'fechas')]
    public function test_r_f_http_sin_cambios_al_rechazar(string $reloj, ?string $original, array $datos, bool $valido): void
    {
        Carbon::setTestNow(Carbon::parse($reloj)->setTimezone('America/Bogota'));
        $payload = $this->payload();
        unset($payload['fecha_entrega']);
        $payload = array_replace($payload, $datos);
        $tarea = $original === null ? null : $this->tarea(['fecha_entrega' => $original]);
        $antes = $this->snapshot();
        $response = $tarea === null ? $this->postJson('/api/tareas', $payload)
            : $this->putJson("/api/tareas/{$tarea->id}", $payload);
        if (! $valido) {
            $response->assertUnprocessable()->assertJsonValidationErrors('fecha_entrega');
            $this->assertSame($antes, $this->snapshot());

            return;
        }
        $response->assertStatus($tarea === null ? 201 : 200)->assertJsonPath('data.fecha_entrega', $datos['fecha_entrega']);
        $this->assertDatabaseHas('tareas', ['id' => $response->json('data.id'), 'fecha_entrega' => $datos['fecha_entrega']]);
    }

    #[DataProviderExternal(Semana7Data::class, 'textosHttp')]
    public function test_r_t_http_sin_cambios_al_rechazar(string $metodo, string $campo, array $datos, bool $valido): void
    {
        $esAsignatura = in_array($campo, ['nombre', 'codigo'], true);
        $payload = $esAsignatura ? ['nombre' => 'Geometría del ñandú', 'codigo' => 'FIC-08'] : $this->payload();
        unset($payload[$campo]);
        $payload = array_replace($payload, $datos);
        $tarea = $metodo === 'PUT' ? $this->tarea() : null;
        $url = $esAsignatura ? '/api/asignaturas' : ($tarea === null ? '/api/tareas' : "/api/tareas/{$tarea->id}");
        $antes = $this->snapshot();
        $response = $metodo === 'PUT' ? $this->putJson($url, $payload) : $this->postJson($url, $payload);
        if (! $valido) {
            $response->assertUnprocessable()->assertJsonValidationErrors($campo);
            $this->assertSame($antes, $this->snapshot());

            return;
        }
        $response->assertStatus($metodo === 'PUT' ? 200 : 201)->assertJsonPath("data.$campo", $datos[$campo]);
        $this->assertDatabaseHas($esAsignatura ? 'asignaturas' : 'tareas', ['id' => $response->json('data.id'), $campo => $datos[$campo]]);
    }

    #[DataProviderExternal(Semana7Data::class, 'transiciones')]
    public function test_r_e_nueve_pares(string $origen, string $destino, int $status): void
    {
        $tarea = $this->tarea(['estado' => $origen]);
        $antes = $this->snapshot();
        $response = $this->patchJson("/api/tareas/{$tarea->id}/estado", ['estado' => $destino])->assertStatus($status);
        if ($status === 422) {
            $response->assertJsonValidationErrors('estado')->assertJsonPath('message', 'La tarea ya fue completada');
            $this->assertSame($antes, $this->snapshot());
        } else {
            $response->assertJsonPath('data.estado', $destino);
        }
        $this->assertSame($status === 422 ? $origen : $destino, $tarea->fresh()->estado);
    }

    #[DataProviderExternal(Semana7Data::class, 'estadosInvalidos')]
    public function test_r_e_destino_http(array $datos): void
    {
        $tarea = $this->tarea();
        $antes = $this->snapshot();
        $response = $this->patchJson("/api/tareas/{$tarea->id}/estado", $datos);
        $response->assertUnprocessable()->assertJsonValidationErrors('estado');
        $this->assertSame($antes, $this->snapshot());
    }

    #[DataProviderExternal(Semana7Data::class, 'prioridades')]
    public function test_prioridad_sintetica_http(array $datos, bool $valido): void
    {
        $payload = $this->payload();
        unset($payload['prioridad']);
        $antes = $this->snapshot();
        $response = $this->postJson('/api/tareas', array_replace($payload, $datos));
        if ($valido) {
            $response->assertCreated()->assertJsonPath('data.prioridad', $datos['prioridad'])->assertJsonPath('data.estado', 'Pendiente');
            $this->assertDatabaseHas('tareas', ['id' => $response->json('data.id'), 'prioridad' => $datos['prioridad'], 'estado' => 'Pendiente']);
        } else {
            $response->assertUnprocessable()->assertJsonValidationErrors('prioridad');
            $this->assertSame($antes, $this->snapshot());
        }
    }

    public function test_e_09_excepcion_exacta_del_controlador_y_rollback(): void
    {
        $tarea = $this->tarea(['estado' => 'Completada']);
        $antes = $this->snapshot();
        $this->withoutExceptionHandling();
        try {
            $this->patchJson("/api/tareas/{$tarea->id}/estado", ['estado' => 'Completada']);
            $this->fail('Se esperaba ValidationException');
        } catch (ValidationException $exception) {
            $this->assertSame(ValidationException::class, $exception::class);
            $this->assertSame(['estado' => ['La tarea ya fue completada']], $exception->errors());
            $this->assertSame($antes, $this->snapshot());
        }
    }

    public function test_e_12_recurso_ausente_http_y_excepcion_exacta(): void
    {
        $ausente = $this->tarea();
        $id = $ausente->id;
        $ausente->delete();
        $antes = $this->snapshot();
        $this->patchJson("/api/tareas/$id/estado", ['estado' => 'Completada'])->assertNotFound();
        $this->assertSame($antes, $this->snapshot());
        $this->withoutExceptionHandling();
        try {
            $this->patchJson("/api/tareas/$id/estado", ['estado' => 'Completada']);
            $this->fail('Se esperaba ModelNotFoundException');
        } catch (ModelNotFoundException $exception) {
            $this->assertSame(ModelNotFoundException::class, $exception::class);
            $this->assertSame($antes, $this->snapshot());
        }
    }

    public function test_e_14_estado_no_se_modifica_por_formulario(): void
    {
        $payload = $this->payload();
        $tarea = $this->tarea(['estado' => 'En progreso']);
        $antes = $this->snapshot();
        $payload['estado'] = 'Completada';
        $this->postJson('/api/tareas', $payload)->assertUnprocessable()->assertJsonValidationErrors('estado');
        $this->assertSame($antes, $this->snapshot());
        $this->putJson("/api/tareas/{$tarea->id}", $payload)->assertUnprocessable()->assertJsonValidationErrors('estado');
        $this->assertSame($antes, $this->snapshot());
    }

    public function test_e_15_editar_conserva_estado(): void
    {
        $payload = $this->payload();
        foreach (['En progreso', 'Completada'] as $estado) {
            $tarea = $this->tarea(['estado' => $estado]);
            $this->putJson("/api/tareas/{$tarea->id}", $payload)->assertOk()->assertJsonPath('data.estado', $estado);
            $this->assertSame($estado, $tarea->fresh()->estado);
        }
    }

    public function test_t_05_normaliza_extremos_sin_perder_espacios_interiores(): void
    {
        $response = $this->postJson('/api/asignaturas', ['nombre' => "  Diseño  del ñandú d'álgebra  ", 'codigo' => '  FIC-09  ']);
        $response->assertCreated()->assertJsonPath('data.nombre', "Diseño  del ñandú d'álgebra")->assertJsonPath('data.codigo', 'FIC-09');
        $this->assertDatabaseHas('asignaturas', ['id' => $response->json('data.id'), 'nombre' => "Diseño  del ñandú d'álgebra", 'codigo' => 'FIC-09']);
        $payload = array_replace($this->payload(), ['titulo' => '  Informe  final  ', 'descripcion' => "  Ensayo d'álgebra  "]);
        $response = $this->postJson('/api/tareas', $payload)->assertCreated()
            ->assertJsonPath('data.titulo', 'Informe  final')->assertJsonPath('data.descripcion', "Ensayo d'álgebra");
        $this->assertDatabaseHas('tareas', ['id' => $response->json('data.id'), 'titulo' => 'Informe  final', 'descripcion' => "Ensayo d'álgebra"]);
    }

    public function test_t_12_t_13_errores_multiples_y_edicion_vencida(): void
    {
        $tarea = $this->tarea(['fecha_entrega' => '2026-11-20']);
        $payload = array_replace($this->payload(), ['titulo' => '', 'descripcion' => '', 'fecha_entrega' => '2026-11-20']);
        $antes = $this->snapshot();
        $this->putJson("/api/tareas/{$tarea->id}", $payload)->assertUnprocessable()->assertJsonValidationErrors(['titulo', 'descripcion']);
        $this->assertSame($antes, $this->snapshot());
        $payload['titulo'] = 'Ensayo ficticio';
        $payload['descripcion'] = '   ';
        $this->putJson("/api/tareas/{$tarea->id}", $payload)->assertUnprocessable()
            ->assertJsonValidationErrors('descripcion')->assertJsonPath('message', 'La descripción no puede estar vacía');
        $this->assertSame($antes, $this->snapshot());
    }

    public function test_mensajes_explicitos_de_fecha_y_nombre(): void
    {
        $antes = $this->snapshot();
        $this->postJson('/api/asignaturas', ['nombre' => '', 'codigo' => 'FIC-10'])->assertUnprocessable()
            ->assertJsonPath('message', 'El nombre de la asignatura es obligatorio');
        $this->assertSame($antes, $this->snapshot());
        $payload = array_replace($this->payload(), ['fecha_entrega' => '2026-11-21']);
        $antes = $this->snapshot();
        $this->postJson('/api/tareas', $payload)->assertUnprocessable()
            ->assertJsonPath('message', 'La fecha de entrega no puede ser anterior a hoy');
        $this->assertSame($antes, $this->snapshot());
    }
}
