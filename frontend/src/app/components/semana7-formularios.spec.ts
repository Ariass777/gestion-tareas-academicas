import { TestBed } from '@angular/core/testing';
import { FormGroupDirective } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { AsignaturasComponent } from '../pages/asignaturas/asignaturas.component';
import { AcademicoService } from '../services/academico.service';
import type { Tarea } from '../models/academico';
import { TareaFormComponent } from './tarea-form.component';

const asignatura = { id: 701, nombre: "Diseño del ñandú d'algoritmos", codigo: 'FIC-07' };
const datos = {
  titulo: 'Exposición de señales', descripcion: "Ensayo ficticio d'algoritmos y ñandúes.",
  fecha_entrega: '2026-11-22', prioridad: 'Alta' as const, asignatura_id: asignatura.id,
};

function controlReal(campo: string) {
  TestBed.configureTestingModule({ providers: [{ provide: AcademicoService, useValue: {
    asignaturas: () => of([]),
  } }] });
  const fixture = campo === 'nombre' || campo === 'codigo'
    ? TestBed.createComponent(AsignaturasComponent)
    : TestBed.createComponent(TareaFormComponent);
  fixture.detectChanges();
  return fixture.debugElement.query(By.directive(FormGroupDirective))
    .injector.get(FormGroupDirective).form.get(campo)!;
}

describe('Semana 7: composición de formularios reales', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-22T15:00:00Z'));
  });
  afterEach(() => {
    TestBed.resetTestingModule();
    vi.useRealTimers();
  });

  const limites: Array<[string, string, number, boolean]> = [];
  for (const [campo, vecinos] of [
    ['nombre', [[0, false], [1, true], [2, true], [149, true], [150, true], [151, false]]],
    ['codigo', [[0, false], [1, true], [2, true], [29, true], [30, true], [31, false]]],
    ['titulo', [[0, false], [1, true], [2, true], [199, true], [200, true], [201, false]]],
    ['descripcion', [[0, false], [1, true], [2, true], [4999, true], [5000, true], [5001, false]]],
  ] as const) {
    for (const [longitud, valido] of vecinos) limites.push(['T-09', campo, longitud, valido]);
  }
  test.each(limites)('%s %s longitud %i válido=%s', (_id, campo, longitud, valido) => {
    const control = controlReal(campo);
    control.setValue('A'.repeat(longitud));
    expect(control.valid).toBe(valido);
    if (longitud === 0) expect(control.hasError('required')).toBe(true);
    if (!valido && longitud > 0) expect(control.hasError('maxlength')).toBe(true);
  });

  test.each([['nombre', 150], ['codigo', 30], ['titulo', 200], ['descripcion', 5000]] as const)(
    'T-10: %s con %i espacios es obligatorio', (campo, longitud) => {
      const control = controlReal(campo);
      control.setValue(' '.repeat(longitud));
      expect(control.hasError('required')).toBe(true);
    },
  );

  test.each(['', ' ', '\t\r\n'])('T-11/T-12/T-13: texto %j impide emitir aunque se conserve O', (texto) => {
    const fixture = TestBed.createComponent(TareaFormComponent);
    fixture.componentRef.setInput('asignaturas', [asignatura]);
    const tarea: Tarea = { ...datos, id: 702, estado: 'Pendiente', asignatura,
      fecha_entrega: '2026-11-20' };
    fixture.componentRef.setInput('tarea', tarea);
    fixture.detectChanges();
    const directive = fixture.debugElement.query(By.directive(FormGroupDirective))
      .injector.get(FormGroupDirective);
    const guardar = vi.fn();
    fixture.componentInstance.guardar.subscribe(guardar);
    for (const campo of ['titulo', 'descripcion']) {
      directive.form.patchValue({ titulo: datos.titulo, descripcion: datos.descripcion, [campo]: texto });
      directive.onSubmit(new Event('submit'));
      expect(directive.form.get(campo)?.hasError('required')).toBe(true);
      expect(directive.form.get('fecha_entrega')?.valid).toBe(true);
      expect(guardar).not.toHaveBeenCalled();
    }
  });

  test('T-05: enviar recorta extremos y conserva espacios interiores', () => {
    const fixture = TestBed.createComponent(TareaFormComponent);
    fixture.componentRef.setInput('asignaturas', [asignatura]);
    fixture.detectChanges();
    const directive = fixture.debugElement.query(By.directive(FormGroupDirective))
      .injector.get(FormGroupDirective);
    directive.form.setValue({ ...datos, titulo: '  Informe  final  ', descripcion: '  Diseño del ñandú  ' });
    const guardar = vi.fn();
    fixture.componentInstance.guardar.subscribe(guardar);
    directive.onSubmit(new Event('submit'));
    expect(guardar).toHaveBeenCalledExactlyOnceWith({ ...datos,
      titulo: 'Informe  final', descripcion: 'Diseño del ñandú' });
  });

  test.each(['', null])('F-09: fecha %j obligatoria en el formulario real', (fecha) => {
    const fixture = TestBed.createComponent(TareaFormComponent);
    fixture.detectChanges();
    const form = fixture.debugElement.query(By.directive(FormGroupDirective))
      .injector.get(FormGroupDirective).form;
    form.get('fecha_entrega')!.setValue(fecha);
    expect(form.get('fecha_entrega')?.hasError('required')).toBe(true);
  });

  test('F-17: enviar después de medianoche recalcula el día', () => {
    vi.setSystemTime(new Date('2026-11-23T04:59:59Z'));
    const fixture = TestBed.createComponent(TareaFormComponent);
    fixture.componentRef.setInput('asignaturas', [asignatura]);
    fixture.detectChanges();
    const directive = fixture.debugElement.query(By.directive(FormGroupDirective))
      .injector.get(FormGroupDirective);
    directive.form.setValue(datos);
    expect(directive.form.valid).toBe(true);
    const guardar = vi.fn();
    fixture.componentInstance.guardar.subscribe(guardar);
    vi.setSystemTime(new Date('2026-11-23T05:00:00Z'));
    directive.onSubmit(new Event('submit'));
    expect(directive.form.get('fecha_entrega')?.errors).toEqual({ pasada: true });
    expect(guardar).not.toHaveBeenCalled();
  });
});
