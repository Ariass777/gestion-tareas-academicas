<?php

namespace App\Http\Requests;

use App\Models\Tarea;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEstadoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, array<mixed>> Estado obligatorio dentro de los tres valores aprobados. */
    public function rules(): array
    {
        return ['estado' => ['required', Rule::in(Tarea::ESTADOS)]];
    }

    /** @return array<string, string> Mensajes que orientan al usuario sobre estados validos. */
    public function messages(): array
    {
        return ['estado.required' => 'Selecciona un estado', 'estado.in' => 'El estado debe ser Pendiente, En progreso o Completada'];
    }
}
