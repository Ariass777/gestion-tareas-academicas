<?php

namespace App\Http\Requests;

use App\Models\Tarea;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ListTareasRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return ['prioridad' => ['sometimes', 'required', Rule::in(Tarea::PRIORIDADES)], 'estado' => ['sometimes', 'required', Rule::in(Tarea::ESTADOS)]];
    }

    public function messages(): array
    {
        return ['prioridad.in' => 'La prioridad debe ser Alta, Media o Baja', 'estado.in' => 'El estado debe ser Pendiente, En progreso o Completada'];
    }
}
