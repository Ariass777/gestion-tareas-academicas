<?php

namespace Database\Seeders;

use App\Models\Asignatura;
use App\Models\Tarea;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $materias = [
            ['Ingeniería de Software', 'IS-06', 'Diseñar la arquitectura del proyecto', 'Documentar los contenedores C4 y las decisiones de arquitectura.', 'Alta', 'En progreso', 2],
            ['Bases de Datos', 'BD-06', 'Taller de consultas SQL', 'Resolver las consultas y explicar los índices utilizados.', 'Alta', 'Pendiente', 3],
            ['Redes de Computadores', 'RED-06', 'Preparar exposición de redes', 'Preparar la presentación sobre protocolos y topologías de red.', 'Media', 'Pendiente', 5],
            ['Gestión de Proyectos', 'GP-06', 'Entregar cronograma académico', 'Organizar actividades, estimaciones y fechas de entrega del proyecto.', 'Baja', 'Pendiente', 7],
            ['Ingeniería de Software', 'IS-06', 'Revisar historias de usuario', 'Verificar los criterios de aceptación y la trazabilidad del sistema.', 'Media', 'Completada', 1],
        ];
        foreach ($materias as [$nombre, $codigo, $titulo, $descripcion, $prioridad, $estado, $dias]) {
            $asignatura = Asignatura::firstOrCreate(['codigo' => $codigo, 'nombre' => $nombre]);
            $tarea = Tarea::firstOrNew(['asignatura_id' => $asignatura->id, 'titulo' => $titulo]);
            if (! $tarea->exists) {
                $tarea->fill(['descripcion' => $descripcion, 'fecha_entrega' => today()->addDays($dias), 'prioridad' => $prioridad]);
                $tarea->estado = $estado;
                $tarea->save();
            }
        }
    }
}
