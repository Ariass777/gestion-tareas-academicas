<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAsignaturaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return ['nombre' => ['required', 'string', 'max:150'], 'codigo' => ['required', 'string', 'max:30']];
    }

    public function messages(): array
    {
        return ['nombre.required' => 'El nombre de la asignatura es obligatorio', 'codigo.required' => 'El código de la asignatura es obligatorio'];
    }
}
