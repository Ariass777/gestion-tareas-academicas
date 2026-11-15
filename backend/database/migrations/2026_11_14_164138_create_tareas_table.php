<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tareas', function (Blueprint $table) {
            $table->id();
            $table->string('titulo', 200);
            $table->text('descripcion');
            $table->date('fecha_entrega')->index();
            $table->enum('prioridad', ['Alta', 'Media', 'Baja']);
            $table->enum('estado', ['Pendiente', 'En progreso', 'Completada'])->default('Pendiente');
            $table->foreignId('asignatura_id')->constrained('asignaturas')->restrictOnDelete();
            $table->index(['prioridad', 'fecha_entrega']);
            $table->index(['estado', 'fecha_entrega']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tareas');
    }
};
