<?php

namespace Database\Factories;

use App\Models\Asignatura;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Asignatura> */
class AsignaturaFactory extends Factory
{
    public function definition(): array
    {
        return ['nombre' => fake()->sentence(3), 'codigo' => fake()->bothify('ASG-###')];
    }
}
