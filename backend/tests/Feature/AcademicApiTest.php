<?php

namespace Tests\Feature;

use App\Models\Asignatura;
use App\Models\Tarea;
use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class AcademicApiTest extends TestCase
{
    use DatabaseTransactions;

    public function test_errores_inesperados_no_revelan_detalles_internos(): void
    {
        config(['app.debug' => true]);
        Route::get('api/prueba-error', function (): never {
            throw new \RuntimeException('Informacion interna que no debe exponerse');
        });
        $this->getJson('/api/prueba-error')->assertStatus(500)
            ->assertExactJson(['message' => 'No se pudo procesar la solicitud. Intenta de nuevo']);
    }

    public function test_preparacion_e2e_rechaza_entorno_de_desarrollo(): void
    {
        $this->app->detectEnvironment(fn (): string => 'local');
        $this->artisan('academic:prepare-e2e')->assertFailed();
    }

    private function payload(array $changes = []): array
    {
        return array_replace([
            'titulo' => 'Exposición de redes', 'descripcion' => 'Explicar las topologías de red.',
            'fecha_entrega' => today()->addDay()->format('Y-m-d'), 'prioridad' => 'Alta',
            'asignatura_id' => Asignatura::factory()->create()->id,
        ], $changes);
    }

    public function test_registra_y_lista_asignaturas_en_mysql(): void
    {
        $this->assertSame('mysql', DB::connection()->getDriverName());
        $this->postJson('/api/asignaturas', ['nombre' => 'Ingeniería de Software', 'codigo' => 'IS-06'])
            ->assertCreated()->assertJsonPath('data.nombre', 'Ingeniería de Software');
        $this->getJson('/api/asignaturas')->assertOk()->assertJsonFragment(['codigo' => 'IS-06']);
        $this->assertDatabaseHas('asignaturas', ['codigo' => 'IS-06']);
    }

    public function test_rechaza_nombre_vacio_y_espacios(): void
    {
        $this->postJson('/api/asignaturas', ['nombre' => '  ', 'codigo' => 'IS-06'])
            ->assertUnprocessable()->assertJsonPath('message', 'El nombre de la asignatura es obligatorio')->assertJsonValidationErrors('nombre');
    }

    public function test_crea_tarea_y_la_relacion_se_serializa(): void
    {
        $payload = $this->payload();
        $response = $this->postJson('/api/tareas', $payload)->assertCreated()
            ->assertJsonPath('data.estado', 'Pendiente')->assertJsonPath('data.asignatura.id', $payload['asignatura_id']);
        $this->assertDatabaseHas('tareas', ['id' => $response->json('data.id'), 'titulo' => $payload['titulo']]);
    }

    public function test_rechaza_fecha_pasada_y_acepta_hoy_en_colombia(): void
    {
        $this->travelTo(Carbon::parse('2026-11-14 23:30:00', 'America/Bogota'));
        $this->postJson('/api/tareas', $this->payload(['fecha_entrega' => '2026-11-13']))
            ->assertUnprocessable()->assertJsonPath('message', 'La fecha de entrega no puede ser anterior a hoy');
        $this->postJson('/api/tareas', $this->payload(['fecha_entrega' => '2026-11-14']))->assertCreated();
        $this->travelBack();
    }

    public function test_lista_ordenada_por_fecha_e_identificador(): void
    {
        $materia = Asignatura::factory()->create();
        $later = Tarea::factory()->create(['asignatura_id' => $materia->id, 'fecha_entrega' => today()->addDays(9)]);
        $first = Tarea::factory()->create(['asignatura_id' => $materia->id, 'fecha_entrega' => today()]);
        $ids = $this->getJson('/api/tareas')->assertOk()->json('data');
        $ids = array_column($ids, 'id');
        $this->assertLessThan(array_search($later->id, $ids), array_search($first->id, $ids));
    }

    public function test_actualiza_estado_y_rechaza_completar_dos_veces(): void
    {
        $tarea = Tarea::factory()->create();
        $this->patchJson("/api/tareas/{$tarea->id}/estado", ['estado' => 'En progreso'])->assertOk()->assertJsonPath('data.estado', 'En progreso');
        $this->patchJson("/api/tareas/{$tarea->id}/estado", ['estado' => 'Completada'])->assertOk();
        $this->patchJson("/api/tareas/{$tarea->id}/estado", ['estado' => 'Completada'])
            ->assertUnprocessable()->assertJsonPath('message', 'La tarea ya fue completada');
        $this->assertSame('Completada', $tarea->fresh()->estado);
        $this->patchJson("/api/tareas/{$tarea->id}/estado", ['estado' => 'Pendiente'])->assertOk();
    }

    public function test_filtra_prioridad_y_estado(): void
    {
        Tarea::factory()->create(['prioridad' => 'Alta']);
        Tarea::factory()->create(['prioridad' => 'Baja', 'estado' => 'Completada']);
        $data = $this->getJson('/api/tareas?prioridad=Alta&estado=Pendiente')->assertOk()->json('data');
        $this->assertNotEmpty($data);
        foreach ($data as $item) {
            $this->assertSame('Alta', $item['prioridad']);
            $this->assertSame('Pendiente', $item['estado']);
        }
    }

    public function test_edita_los_campos_sin_cambiar_estado(): void
    {
        $tarea = Tarea::factory()->create(['estado' => 'En progreso']);
        $this->putJson("/api/tareas/{$tarea->id}", $this->payload(['titulo' => 'Actividad actualizada']))
            ->assertOk()->assertJsonPath('data.titulo', 'Actividad actualizada')->assertJsonPath('data.estado', 'En progreso');
        $this->assertDatabaseHas('tareas', ['id' => $tarea->id, 'titulo' => 'Actividad actualizada']);
    }

    public function test_edicion_rechaza_descripcion_vacia(): void
    {
        $tarea = Tarea::factory()->create();
        $this->putJson("/api/tareas/{$tarea->id}", $this->payload(['descripcion' => ' ']))
            ->assertUnprocessable()->assertJsonPath('message', 'La descripción no puede estar vacía');
    }

    public function test_puede_editar_tarea_vencida_conservando_fecha(): void
    {
        $tarea = Tarea::factory()->create(['fecha_entrega' => today()->subDays(3)]);
        $payload = $this->payload(['fecha_entrega' => $tarea->fecha_entrega->format('Y-m-d')]);
        $this->putJson("/api/tareas/{$tarea->id}", $payload)->assertOk();
        $this->putJson("/api/tareas/{$tarea->id}", array_replace($payload, ['fecha_entrega' => today()->subDay()->format('Y-m-d')]))->assertUnprocessable();
    }

    public function test_elimina_y_devuelve_204(): void
    {
        $tarea = Tarea::factory()->create();
        $this->deleteJson("/api/tareas/{$tarea->id}")->assertNoContent();
        $this->assertDatabaseMissing('tareas', ['id' => $tarea->id]);
        $this->deleteJson("/api/tareas/{$tarea->id}")->assertNotFound();
    }

    public function test_valida_relacion_prioridad_estado_y_campos_obligatorios(): void
    {
        $this->postJson('/api/tareas', $this->payload(['asignatura_id' => 999999999]))->assertUnprocessable()->assertJsonValidationErrors('asignatura_id');
        $this->postJson('/api/tareas', $this->payload(['prioridad' => 'Urgente']))->assertUnprocessable();
        $this->postJson('/api/tareas', [])->assertUnprocessable()->assertJsonValidationErrors(['titulo', 'descripcion', 'fecha_entrega', 'asignatura_id', 'prioridad']);
        $tarea = Tarea::factory()->create();
        $this->patchJson("/api/tareas/{$tarea->id}/estado", ['estado' => 'Otro'])->assertUnprocessable();
        $this->getJson('/api/tareas?prioridad=Urgente')->assertUnprocessable();
        $this->getJson('/api/tareas?estado=Otro')->assertUnprocessable();
    }

    public function test_clave_foranea_rechaza_tareas_huerfanas(): void
    {
        $this->expectException(QueryException::class);
        DB::table('tareas')->insert([
            'titulo' => 'Huérfana', 'descripcion' => 'No debe guardarse', 'fecha_entrega' => today()->format('Y-m-d'),
            'prioridad' => 'Media', 'estado' => 'Pendiente', 'asignatura_id' => 999999999,
        ]);
    }

    public function test_no_se_puede_eliminar_asignatura_con_tareas(): void
    {
        $tarea = Tarea::factory()->create();
        $this->expectException(QueryException::class);
        $tarea->asignatura->delete();
    }

    public function test_recurso_inexistente_devuelve_json_404(): void
    {
        $this->putJson('/api/tareas/999999999', $this->payload())->assertNotFound()->assertJsonPath('message', 'El recurso solicitado no existe');
        $this->patchJson('/api/tareas/999999999/estado', ['estado' => 'Completada'])->assertNotFound();
        $this->get('/api/ruta-inexistente')->assertNotFound()->assertHeader('Content-Type', 'application/json');
    }

    public function test_cors_permite_el_frontend_y_rechaza_otro_origen(): void
    {
        $this->withHeaders(['Origin' => 'http://127.0.0.1:4200', 'Access-Control-Request-Method' => 'POST', 'Access-Control-Request-Headers' => 'content-type'])
            ->options('/api/tareas')->assertNoContent()->assertHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:4200');
        $response = $this->withHeaders(['Origin' => 'https://externo.example'])->getJson('/api/tareas')->assertOk();
        $this->assertNotSame('https://externo.example', $response->headers->get('Access-Control-Allow-Origin'));
    }
}
