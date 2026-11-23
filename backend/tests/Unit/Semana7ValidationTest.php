<?php

namespace Tests\Unit;

use App\Http\Requests\SaveTareaRequest;
use App\Http\Requests\StoreAsignaturaRequest;
use App\Http\Requests\UpdateEstadoRequest;
use App\Models\Tarea;
use Carbon\Carbon;
use Illuminate\Routing\Route;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use PHPUnit\Framework\Attributes\DataProviderExternal;
use Tests\Semana7Data;
use Tests\TestCase;

/** Validación con framework, sin consultas ni persistencia MySQL. */
class Semana7ValidationTest extends TestCase
{
    /** @param array<string, mixed> $datos
     * @return array<string, mixed>
     */
    private function entradaJson(array $datos): array
    {
        return json_decode(json_encode($datos, JSON_THROW_ON_ERROR), true, flags: JSON_THROW_ON_ERROR);
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();
        parent::tearDown();
    }

    #[DataProviderExternal(Semana7Data::class, 'fechas')]
    public function test_r_f_fecha(string $reloj, ?string $original, array $datos, bool $valido): void
    {
        Carbon::setTestNow(Carbon::parse($reloj)->setTimezone('America/Bogota'));
        $datos = $this->entradaJson($datos);
        $request = SaveTareaRequest::create('/api/tareas', $original === null ? 'POST' : 'PUT', $datos);
        if ($original !== null) {
            $route = new Route(['PUT'], 'api/tareas/{tarea}', fn () => null);
            $route->bind($request);
            $route->setParameter('tarea', Tarea::factory()->make(['fecha_entrega' => $original, 'asignatura_id' => 701]));
            $request->setRouteResolver(fn () => $route);
        }
        $validator = Validator::make($datos, ['fecha_entrega' => $request->rules()['fecha_entrega']], $request->messages());
        $this->assertSame($valido, $validator->passes());
        $this->assertSame(! $valido, $validator->errors()->has('fecha_entrega'));
    }

    #[DataProviderExternal(Semana7Data::class, 'textos')]
    public function test_r_t_texto(string $campo, array $datos, bool $valido): void
    {
        $datos = $this->entradaJson($datos);
        $request = in_array($campo, ['nombre', 'codigo'], true) ? new StoreAsignaturaRequest : new SaveTareaRequest;
        $validator = Validator::make($datos, [$campo => $request->rules()[$campo]], $request->messages());
        $this->assertSame($valido, $validator->passes());
        $this->assertSame(! $valido, $validator->errors()->has($campo));
    }

    #[DataProviderExternal(Semana7Data::class, 'estados')]
    public function test_r_e_catalogo_y_excepcion_exacta(array $datos, bool $valido): void
    {
        $datos = $this->entradaJson($datos);
        $request = new UpdateEstadoRequest;
        $validator = Validator::make($datos, $request->rules(), $request->messages());
        if ($valido) {
            $this->assertSame($datos, $validator->validate());

            return;
        }
        try {
            $validator->validate();
            $this->fail('Se esperaba ValidationException para estado inválido');
        } catch (ValidationException $exception) {
            $this->assertSame(ValidationException::class, $exception::class);
            $this->assertArrayHasKey('estado', $exception->errors());
        }
    }
}
