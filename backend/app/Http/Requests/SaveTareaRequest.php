<?php

namespace App\Http\Requests;

use App\Models\Tarea;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SaveTareaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $tarea = $this->route('tarea');
        $conservaFecha = $tarea instanceof Tarea && $this->input('fecha_entrega') === $tarea->fecha_entrega->format('Y-m-d');

        return [
            'titulo' => ['required', 'string', 'max:200'],
            'descripcion' => ['required', 'string', 'max:5000'],
            'asignatura_id' => ['required', 'integer', Rule::exists('asignaturas', 'id')],
            'fecha_entrega' => array_filter(['required', 'date_format:Y-m-d', $conservaFecha ? null : 'after_or_equal:today']),
            'prioridad' => ['required', Rule::in(Tarea::PRIORIDADES)],
            'estado' => ['prohibited'],
        ];
    }

    public function messages(): array
    {
        return [
            'titulo.required' => 'El título de la tarea es obligatorio',
            'descripcion.required' => 'La descripción no puede estar vacía',
            'asignatura_id.required' => 'Selecciona una asignatura',
            'asignatura_id.exists' => 'La asignatura seleccionada no existe',
            'fecha_entrega.required' => 'La fecha de entrega es obligatoria',
            'fecha_entrega.date_format' => 'La fecha de entrega debe tener formato AAAA-MM-DD',
            'fecha_entrega.after_or_equal' => 'La fecha de entrega no puede ser anterior a hoy',
            'prioridad.required' => 'Selecciona una prioridad',
            'prioridad.in' => 'La prioridad debe ser Alta, Media o Baja',
            'estado.prohibited' => 'Utiliza la acción de actualizar estado',
        ];
    }
}
