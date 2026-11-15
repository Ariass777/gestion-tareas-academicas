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

    public function store(SaveTareaRequest $request): JsonResponse
    {
        $tarea = Tarea::create($request->validated())->refresh()->load('asignatura');

        return (new TareaResource($tarea))->response()->setStatusCode(201);
    }

    public function update(SaveTareaRequest $request, Tarea $tarea): TareaResource
    {
        $tarea->update($request->validated());

        return new TareaResource($tarea->refresh()->load('asignatura'));
    }

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

    public function destroy(Tarea $tarea): Response
    {
        $tarea->delete();

        return response()->noContent();
    }
}
