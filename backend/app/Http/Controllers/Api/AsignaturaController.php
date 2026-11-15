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
    public function index(): AnonymousResourceCollection
    {
        return AsignaturaResource::collection(Asignatura::query()->orderBy('nombre')->orderBy('id')->get());
    }

    public function store(StoreAsignaturaRequest $request): JsonResponse
    {
        return (new AsignaturaResource(Asignatura::create($request->validated())))->response()->setStatusCode(201);
    }
}
