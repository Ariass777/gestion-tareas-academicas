<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TareaResource extends JsonResource
{
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
