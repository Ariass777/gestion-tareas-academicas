<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ListTareasRequest;
use App\Http\Requests\SaveTareaRequest;
use App\Http\Requests\UpdateEstadoRequest;
use App\Http\Resources\TareaResource;
use App\Models\Tarea;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class TareaController extends Controller
{
    /**
     * Lista por fecha e id, con filtros validados y asignaturas precargadas para evitar N+1.
     *
     * @return AnonymousResourceCollection Respuesta JSON 200 con la coleccion en data.
     */
    public function index(ListTareasRequest $request): AnonymousResourceCollection
    {
        $filters = $request->validated();
        $query = Tarea::query()->with('asignatura');
        foreach (['prioridad', 'estado'] as $field) {
            if (isset($filters[$field])) {
                $query->where($field, $filters[$field]);
            }
        }

        return TareaResource::collection($query->orderBy('fecha_entrega')->orderBy('id')->get());
    }

    /** Persiste datos ya validados y devuelve la tarea en estado Pendiente con HTTP 201. */
    public function store(SaveTareaRequest $request): JsonResponse
    {
        $tarea = Tarea::create($request->validated())->refresh()->load('asignatura');

        return (new TareaResource($tarea))->response()->setStatusCode(201);
    }

    /** Actualiza el formulario completo sin permitir asignacion masiva del estado. */
    public function update(SaveTareaRequest $request, Tarea $tarea): TareaResource
    {
        $tarea->update($request->validated());

        return new TareaResource($tarea->refresh()->load('asignatura'));
    }

    /**
     * Serializa cambios concurrentes del estado mediante transaccion y bloqueo de fila.
     *
     * @throws ValidationException Si se intenta completar de nuevo una tarea completada.
     */
    public function estado(UpdateEstadoRequest $request, Tarea $tarea): TareaResource
    {
        $updated = DB::transaction(function () use ($request, $tarea): Tarea {
            $locked = Tarea::query()->lockForUpdate()->findOrFail($tarea->id);
            $estado = $request->validated('estado');
            if ($locked->estado === 'Completada' && $estado === 'Completada') {
                throw ValidationException::withMessages(['estado' => 'La tarea ya fue completada']);
            }
            $locked->estado = $estado;
            $locked->save();

            return $locked->load('asignatura');
        });

        return new TareaResource($updated);
    }

    /** Elimina el recurso enlazado por Laravel y responde 204 sin cuerpo. */
    public function destroy(Tarea $tarea): Response
    {
        $tarea->delete();

        return response()->noContent();
    }
}
