<?php

namespace App\Models;

use Database\Factories\AsignaturaFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Asignatura extends Model
{
    /** @use HasFactory<AsignaturaFactory> */
    use HasFactory;

    protected $fillable = ['nombre', 'codigo'];

    /** @return HasMany<Tarea, $this> */
    public function tareas(): HasMany
    {
        return $this->hasMany(Tarea::class);
    }
}
