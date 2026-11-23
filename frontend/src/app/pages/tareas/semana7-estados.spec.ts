import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of, Subject } from 'rxjs';
import { afterEach, expect, test, vi } from 'vitest';
import type { Estado, Tarea } from '../../models/academico';
import { AcademicoService } from '../../services/academico.service';
import { NotificacionesService } from '../../services/notificaciones.service';
import { TareasComponent } from './tareas.component';

afterEach(() => TestBed.resetTestingModule());

function preparar(estado: Estado) {
  const asignatura = { id: 701, nombre: "Diseño del ñandú d'álgebra", codigo: 'FIC-07' };
  const tarea: Tarea = { id: 702, titulo: 'Ensayo ficticio', descripcion: 'Revisar señales.',
    fecha_entrega: '2026-11-22', prioridad: 'Alta', estado, asignatura_id: 701, asignatura };
  const respuesta = new Subject<Tarea>();
  const api = { tareas: vi.fn(() => of([tarea])), asignaturas: () => of([asignatura]),
    cambiarEstado: vi.fn(() => respuesta.asObservable()) };
  const avisos = { mostrar: vi.fn() };
  const params = convertToParamMap({});
  TestBed.configureTestingModule({ providers: [provideRouter([]),
    { provide: ActivatedRoute, useValue: { queryParamMap: of(params), snapshot: { queryParamMap: params } } },
    { provide: AcademicoService, useValue: api },
    { provide: NotificacionesService, useValue: avisos },
  ] });
  const fixture = TestBed.createComponent(TareasComponent);
  fixture.detectChanges();
  const element = fixture.nativeElement as HTMLElement;
  return { fixture, element, api, avisos, respuesta };
}

test('E-16: completada deshabilita la acción y muestra el mensaje HU-04', () => {
  const { element, api } = preparar('Completada');
  const boton = element.querySelector<HTMLButtonElement>('.complete-button')!;
  expect(boton.disabled).toBe(true);
  expect(boton.getAttribute('aria-label')).toBe('La tarea ya fue completada');
  expect(element.querySelector('.completed-note')?.textContent).toBe('La tarea ya fue completada');
  boton.click();
  expect(api.cambiarEstado).not.toHaveBeenCalled();
});

test('E-18: error HTTP conserva el estado y permite reintentar sin confirmar un cambio ficticio', () => {
  const { fixture, element, api, avisos, respuesta } = preparar('Pendiente');
  element.querySelector<HTMLButtonElement>('.complete-button')!.click();
  fixture.detectChanges();
  expect(api.cambiarEstado).toHaveBeenCalledExactlyOnceWith(702, 'Completada');
  expect(element.querySelector<HTMLSelectElement>('.task-state select')!.value).toBe('Pendiente');
  respuesta.error(new HttpErrorResponse({ status: 422, error: { message: 'Revisa los datos' } }));
  fixture.detectChanges();
  expect(element.querySelector<HTMLSelectElement>('.task-state select')!.value).toBe('Pendiente');
  expect(element.querySelector<HTMLButtonElement>('.complete-button')!.disabled).toBe(false);
  expect(avisos.mostrar).toHaveBeenCalledExactlyOnceWith('Revisa los datos', 'error');
  expect(api.tareas.mock.calls.length).toBeGreaterThan(1);
});
