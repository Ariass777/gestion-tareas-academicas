<?php

namespace Tests;

/** Datos sintéticos y oráculos fijos del registro; no contiene validadores. */
final class Semana7Data
{
    /** @return iterable<string, array{string, ?string, array<string, mixed>, bool}> */
    public static function fechas(): iterable
    {
        $h = '2026-11-22T15:00:00Z';
        foreach ([
            'F-01 ayer' => [null, '2026-11-21', false],
            'F-02 hoy' => [null, '2026-11-22', true],
            'F-03 futuro' => [null, '2026-11-23', true],
            'F-04 conservar vencida' => ['2026-11-20', '2026-11-20', true],
            'F-05 original menos uno' => ['2026-11-20', '2026-11-19', false],
            'F-06 original mas uno' => ['2026-11-20', '2026-11-21', false],
            'F-07 editar hoy' => ['2026-11-20', '2026-11-22', true],
            'F-07 editar futuro' => ['2026-11-20', '2026-11-23', true],
            'F-08 conservar hoy' => ['2026-11-22', '2026-11-22', true],
            'F-08 conservar futuro' => ['2026-11-23', '2026-11-23', true],
        ] as $nombre => [$original, $dato, $valido]) {
            yield $nombre => [$h, $original, ['fecha_entrega' => $dato], $valido];
        }
        foreach (['omitida' => [], 'null' => ['fecha_entrega' => null], 'vacia' => ['fecha_entrega' => '']] as $nombre => $dato) {
            yield "F-09 $nombre alta" => [$h, null, $dato, false];
            yield "F-09 $nombre edicion" => [$h, '2026-11-20', $dato, false];
        }
        foreach (['22/11/2026', '2026-11-2', '2026-11-22T10:00:00-05:00', 'abc'] as $i => $dato) {
            yield "F-10 formato $i" => [$h, null, ['fecha_entrega' => $dato], false];
        }
        foreach (['2026-11-31', '2026-00-22', '2026-13-22', '2026-11-00', '2026-02-29'] as $i => $dato) {
            yield "F-11 calendario $i" => [$h, null, ['fecha_entrega' => $dato], false];
        }
        foreach (['2028-02-28', '2028-02-29', '2028-03-01'] as $dato) {
            yield "F-12 bisiesto $dato" => ['2028-02-28T15:00:00Z', null, ['fecha_entrega' => $dato], true];
        }
        yield 'F-12 no bisiesto' => ['2027-02-28T15:00:00Z', null, ['fecha_entrega' => '2027-02-29'], false];
        yield 'F-13 antes' => ['2026-11-23T04:59:59Z', null, ['fecha_entrega' => '2026-11-22'], true];
        yield 'F-13 limite' => ['2026-11-23T05:00:00Z', null, ['fecha_entrega' => '2026-11-22'], false];
        yield 'F-13 despues' => ['2026-11-23T05:00:01Z', null, ['fecha_entrega' => '2026-11-22'], false];
        foreach ([['2026-12-30', false], ['2026-12-31', true], ['2027-01-01', true]] as [$dato, $valido]) {
            yield "F-15 $dato" => ['2026-12-31T15:00:00Z', null, ['fecha_entrega' => $dato], $valido];
        }
        foreach ([42, true, [], (object) []] as $i => $dato) {
            yield "F-16 tipo $i" => [$h, null, ['fecha_entrega' => $dato], false];
        }
    }

    /** @return iterable<string, array{string, array<string, mixed>, bool}> */
    public static function textos(): iterable
    {
        $campos = [
            'nombre' => [[0, false], [1, true], [2, true], [149, true], [150, true], [151, false]],
            'codigo' => [[0, false], [1, true], [2, true], [29, true], [30, true], [31, false]],
            'titulo' => [[0, false], [1, true], [2, true], [199, true], [200, true], [201, false]],
            'descripcion' => [[0, false], [1, true], [2, true], [4999, true], [5000, true], [5001, false]],
        ];
        foreach ($campos as $campo => $vecinos) {
            foreach ($vecinos as [$longitud, $valido]) {
                yield "T-09 $campo longitud $longitud" => [$campo, [$campo => str_repeat('A', $longitud)], $valido];
            }
            $maximo = ['nombre' => 150, 'codigo' => 30, 'titulo' => 200, 'descripcion' => 5000][$campo];
            yield "T-10 $campo espacios en M" => [$campo, [$campo => str_repeat(' ', $maximo)], false];
            yield "T-06 $campo omitido" => [$campo, [], false];
            foreach ([null, ' ', '   ', "\t\r\n", 42, false, [], (object) []] as $i => $dato) {
                yield "T-07-T-08 $campo invalido $i" => [$campo, [$campo => $dato], false];
            }
            yield "T-14 $campo tildes y apostrofo" => [$campo, [$campo => "Diseño del ñandú d'álgebra"], true];
        }
    }

    /** @return iterable<string, array{string, string, array<string, mixed>, bool}> */
    public static function textosHttp(): iterable
    {
        foreach (self::textos() as $nombre => [$campo, $datos, $valido]) {
            foreach (in_array($campo, ['titulo', 'descripcion'], true) ? ['POST', 'PUT'] : ['POST'] as $metodo) {
                yield "$nombre $metodo" => [$metodo, $campo, $datos, $valido];
            }
        }
    }

    /** @return iterable<string, array{array<string, mixed>, bool}> */
    public static function estados(): iterable
    {
        foreach (['Pendiente', 'En progreso', 'Completada'] as $estado) {
            yield "R-E catalogo $estado" => [['estado' => $estado], true];
        }
        yield 'E-10 omitido' => [[], false];
        foreach ([null, '', '   '] as $i => $dato) {
            yield "E-10 obligatorio $i" => [['estado' => $dato], false];
        }
        foreach (['Otro', 'pendiente', 'En Progreso', 1, true, [], (object) []] as $i => $dato) {
            yield "E-11 invalido $i" => [['estado' => $dato], false];
        }
    }

    /** @return iterable<string, array{array<string, mixed>}> */
    public static function estadosInvalidos(): iterable
    {
        foreach (self::estados() as $nombre => [$datos, $valido]) {
            if (! $valido) {
                yield $nombre => [$datos];
            }
        }
    }

    /** @return iterable<string, array{string, string, int}> */
    public static function transiciones(): iterable
    {
        yield 'E-01 propuesta academica' => ['Pendiente', 'Pendiente', 200];
        yield 'E-02 propuesta academica' => ['Pendiente', 'En progreso', 200];
        yield 'E-03 HU-04' => ['Pendiente', 'Completada', 200];
        yield 'E-04 propuesta academica' => ['En progreso', 'Pendiente', 200];
        yield 'E-05 propuesta academica' => ['En progreso', 'En progreso', 200];
        yield 'E-06 propuesta academica' => ['En progreso', 'Completada', 200];
        yield 'E-07 reapertura documentada' => ['Completada', 'Pendiente', 200];
        yield 'E-08 propuesta academica' => ['Completada', 'En progreso', 200];
        yield 'E-09 HU-04' => ['Completada', 'Completada', 422];
    }

    /** @return iterable<string, array{array<string, mixed>, bool}> */
    public static function prioridades(): iterable
    {
        foreach (['Alta', 'Media', 'Baja'] as $prioridad) {
            yield "P-01 $prioridad" => [['prioridad' => $prioridad], true];
        }
        yield 'P-02 omitida' => [[], false];
        foreach (['Urgente', 'alta', '', null, [], 1] as $i => $dato) {
            yield "P-02 invalida $i" => [['prioridad' => $dato], false];
        }
    }
}
