<?php

namespace Database\Factories;

use App\Models\Asignatura;
use App\Models\Tarea;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Tarea> */
class TareaFactory extends Factory
{
    public function definition(): array
    {
        return [
            'titulo' => fake()->sentence(4), 'descripcion' => fake()->paragraph(),
            'fecha_entrega' => today()->addDays(fake()->numberBetween(0, 30))->format('Y-m-d'),
            'prioridad' => fake()->randomElement(Tarea::PRIORIDADES),
            'estado' => 'Pendiente', 'asignatura_id' => Asignatura::factory(),
        ];
    }
}
