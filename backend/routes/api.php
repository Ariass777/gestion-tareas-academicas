<?php

use App\Http\Controllers\Api\AsignaturaController;
use App\Http\Controllers\Api\TareaController;
use Illuminate\Support\Facades\Route;

Route::get('asignaturas', [AsignaturaController::class, 'index'])->name('asignaturas.index');
Route::post('asignaturas', [AsignaturaController::class, 'store'])->name('asignaturas.store');
Route::get('tareas', [TareaController::class, 'index'])->name('tareas.index');
Route::post('tareas', [TareaController::class, 'store'])->name('tareas.store');
Route::put('tareas/{tarea}', [TareaController::class, 'update'])->whereNumber('tarea')->name('tareas.update');
Route::patch('tareas/{tarea}/estado', [TareaController::class, 'estado'])->whereNumber('tarea')->name('tareas.estado');
Route::delete('tareas/{tarea}', [TareaController::class, 'destroy'])->whereNumber('tarea')->name('tareas.destroy');
