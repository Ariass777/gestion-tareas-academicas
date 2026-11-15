import { FormControl } from '@angular/forms';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { fechaNoPasada, hoyColombia, textoObligatorio } from './fechas';
describe('Reglas de formulario y día calendario colombiano', () => {
  afterEach(() => vi.useRealTimers());
  it('rechaza texto vacío o compuesto únicamente por espacios', () => {
    expect(textoObligatorio(new FormControl('   '))).toEqual({ required: true });
    expect(textoObligatorio(new FormControl('Informe'))).toBeNull();
  });
  it('utiliza Colombia incluso cuando UTC ya cambió de día', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-15T03:00:00Z'));
    expect(hoyColombia()).toBe('2026-11-14');
    expect(fechaNoPasada()(new FormControl('2026-11-13'))).toEqual({ pasada: true });
    expect(fechaNoPasada()(new FormControl('2026-11-14'))).toBeNull();
  });
  it('permite conservar una fecha vencida al editar, pero no otra fecha pasada', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-14T15:00:00Z'));
    const validator = fechaNoPasada('2026-11-10');
    expect(validator(new FormControl('2026-11-10'))).toBeNull();
    expect(validator(new FormControl('2026-11-11'))).toEqual({ pasada: true });
    expect(validator(new FormControl('2026-11-16'))).toBeNull();
  });
});
