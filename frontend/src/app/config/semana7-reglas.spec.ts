import { FormControl } from '@angular/forms';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { fechaNoPasada, hoyColombia, textoObligatorio } from './fechas';

describe('Semana 7: unidades reales R-F y R-T', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-22T15:00:00Z'));
  });
  afterEach(() => vi.useRealTimers());

  test.each([
    ['F-01', undefined, '2026-11-21', { pasada: true }],
    ['F-02', undefined, '2026-11-22', null],
    ['F-03', undefined, '2026-11-23', null],
    ['F-04', '2026-11-20', '2026-11-20', null],
    ['F-05', '2026-11-20', '2026-11-19', { pasada: true }],
    ['F-06', '2026-11-20', '2026-11-21', { pasada: true }],
    ['F-07-hoy', '2026-11-20', '2026-11-22', null],
    ['F-07-futuro', '2026-11-20', '2026-11-23', null],
    ['F-08-hoy', '2026-11-22', '2026-11-22', null],
    ['F-08-futuro', '2026-11-23', '2026-11-23', null],
  ] as const)('%s: original=%s, entrada=%s', (_id, original, entrada, esperado) => {
    expect(fechaNoPasada(original)(new FormControl(entrada))).toEqual(esperado);
  });

  test.each([
    ['F-13-antes', '2026-11-23T04:59:59Z', '2026-11-22', null],
    ['F-13-limite', '2026-11-23T05:00:00Z', '2026-11-23', { pasada: true }],
    ['F-13-despues', '2026-11-23T05:00:01Z', '2026-11-23', { pasada: true }],
  ] as const)('%s: frontera colombiana', (_id, instante, dia, esperado) => {
    vi.setSystemTime(new Date(instante));
    expect(hoyColombia()).toBe(dia);
    expect(fechaNoPasada()(new FormControl('2026-11-22'))).toEqual(esperado);
  });

  test.each([
    ['F-15-anterior', '2026-12-31T15:00:00Z', '2026-12-30', { pasada: true }],
    ['F-15-hoy', '2026-12-31T15:00:00Z', '2026-12-31', null],
    ['F-15-siguiente', '2026-12-31T15:00:00Z', '2027-01-01', null],
    ['F-12-28', '2028-02-28T15:00:00Z', '2028-02-28', null],
    ['F-12-29', '2028-02-28T15:00:00Z', '2028-02-29', null],
    ['F-12-marzo', '2028-02-28T15:00:00Z', '2028-03-01', null],
  ] as const)('%s: vecinos de calendario válidos', (_id, instante, entrada, esperado) => {
    vi.setSystemTime(new Date(instante));
    expect(fechaNoPasada()(new FormControl(entrada))).toEqual(esperado);
  });

  const textos: Array<[string, unknown, boolean]> = [
    ['T-01-vacio', '', false], ['T-01-espacio', ' ', false],
    ['T-01-espacios', '   ', false], ['T-01-controles', '\t\r\n', false],
    ['T-02-null', null, false], ['T-02-undefined', undefined, false],
    ['T-02-cero', 0, false], ['T-02-numero', 42, false],
    ['T-02-false', false, false], ['T-02-true', true, false],
    ['T-02-array', [], false], ['T-02-objeto', {}, false],
    ['T-02-length', { length: 1 }, false],
    ['T-03-uno', 'A', true], ['T-03-dos', 'AA', true],
    ['T-03-tildes', 'Diseño y lingüística del ñandú', true],
    ['T-14-apostrofo', "Ensayo d'algoritmos", true],
    ['T-14-literal', 'Informe <b>final</b>', true],
    ['T-04', '  Informe  ', true],
  ];
  test.each(textos)('%s: contenido y tipo sin mutar el control', (_id, value, valido) => {
    const control = new FormControl<unknown>({ value, disabled: false });
    expect(control.value).toBe(value);
    expect(textoObligatorio(control)).toEqual(valido ? null : { required: true });
    expect(control.value).toBe(value);
  });

  test.each([150, 30, 200, 5000])('T-10: %i espacios siguen sin ser contenido', (longitud) => {
    expect(textoObligatorio(new FormControl(' '.repeat(longitud)))).toEqual({ required: true });
  });
});
