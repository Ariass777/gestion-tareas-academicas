<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TareaResource extends JsonResource
{
    /**
     * Serializa una fecha calendario YYYY-MM-DD y la relacion previamente cargada.
     *
     * @return array<string, mixed> Contrato consumido por los modelos TypeScript.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id, 'titulo' => $this->titulo, 'descripcion' => $this->descripcion,
            'fecha_entrega' => $this->fecha_entrega->format('Y-m-d'), 'prioridad' => $this->prioridad,
            'estado' => $this->estado, 'asignatura_id' => $this->asignatura_id,
            'asignatura' => new AsignaturaResource($this->whenLoaded('asignatura')),
        ];
    }
}
