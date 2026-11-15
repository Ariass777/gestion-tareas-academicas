import { HttpErrorResponse } from '@angular/common/http';
import { describe, expect, it } from 'vitest';
import { erroresCampos, mensajeError } from './notificaciones.service';

describe('Respuestas HTTP sin confiar en tipos del servidor', () => {
  it('extrae exclusivamente listas de mensajes de texto de una validación 422', () => {
    const error = new HttpErrorResponse({
      status: 422,
      error: {
        errors: {
          titulo: ['El título es obligatorio'],
          descripcion: 42,
          estado: [null],
          prioridad: 'Alta',
        },
      },
    });
    expect(erroresCampos(error)).toEqual({ titulo: ['El título es obligatorio'] });
  });

  it('tolera cuerpos nulos, HTML y estructuras inesperadas sin propagar errores', () => {
    for (const body of [null, '<html>Error</html>', 42, { errors: [] }, { errors: null }]) {
      expect(erroresCampos(new HttpErrorResponse({ status: 422, error: body }))).toEqual({});
    }
    expect(erroresCampos(new Error('otro error'))).toEqual({});
  });

  it('presenta solo mensajes de texto y conserva el aviso de conexión recuperable', () => {
    expect(
      mensajeError(new HttpErrorResponse({ status: 422, error: { message: 'Revisa los datos' } })),
    ).toBe('Revisa los datos');
    expect(
      mensajeError(
        new HttpErrorResponse({ status: 422, error: { message: { detail: 'interno' } } }),
      ),
    ).toBe('No se pudo realizar la operación. Intenta de nuevo.');
    expect(mensajeError(new HttpErrorResponse({ status: 0 }))).toContain(
      'No se pudo conectar con el servidor',
    );
  });
});
