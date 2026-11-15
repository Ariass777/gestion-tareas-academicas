<?php

namespace App\Models;

use Database\Factories\TareaFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tarea extends Model
{
    /** @use HasFactory<TareaFactory> */
    use HasFactory;

    public const PRIORIDADES = ['Alta', 'Media', 'Baja'];

    public const ESTADOS = ['Pendiente', 'En progreso', 'Completada'];

    protected $fillable = ['titulo', 'descripcion', 'fecha_entrega', 'prioridad', 'asignatura_id'];

    protected function casts(): array
    {
        return ['fecha_entrega' => 'date:Y-m-d'];
    }

    /**
     * Relacion respaldada por una FK que impide tareas huerfanas.
     *
     * @return BelongsTo<Asignatura, $this>
     */
    public function asignatura(): BelongsTo
    {
        return $this->belongsTo(Asignatura::class);
    }
}
