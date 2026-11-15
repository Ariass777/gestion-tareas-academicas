<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAsignaturaRequest;
use App\Http\Resources\AsignaturaResource;
use App\Models\Asignatura;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AsignaturaController extends Controller
{
    /** Devuelve las asignaturas ordenadas por nombre e id bajo la propiedad JSON data. */
    public function index(): AnonymousResourceCollection
    {
        return AsignaturaResource::collection(Asignatura::query()->orderBy('nombre')->orderBy('id')->get());
    }

    /** Guarda exclusivamente nombre y codigo validados; responde 201 con el id persistido. */
    public function store(StoreAsignaturaRequest $request): JsonResponse
    {
        return (new AsignaturaResource(Asignatura::create($request->validated())))->response()->setStatusCode(201);
    }
}
