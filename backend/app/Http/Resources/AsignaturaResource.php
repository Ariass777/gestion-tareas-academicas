<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AsignaturaResource extends JsonResource
{
    /** @return array{id: int, nombre: string, codigo: string} Campos publicos de una asignatura. */
    public function toArray(Request $request): array
    {
        return ['id' => $this->id, 'nombre' => $this->nombre, 'codigo' => $this->codigo];
    }
}
