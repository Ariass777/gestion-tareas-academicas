import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import type { ErroresCampos } from '../models/academico';

/** Reconoce objetos JSON sin confiar en el tipo any de HttpErrorResponse.error. */
function esObjeto(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Extrae mensajes 422 con forma campo -> string[]; descarta entradas malformadas.
 * @param error Fallo HTTP u otro error recibido por un suscriptor.
 * @returns Errores utilizables por el formulario, o un objeto vacío.
 */
export function erroresCampos(error: unknown): ErroresCampos {
  if (!(error instanceof HttpErrorResponse) || error.status !== 422) return {};
  const body: unknown = error.error;
  if (!esObjeto(body) || !esObjeto(body['errors'])) return {};
  return Object.fromEntries(
    Object.entries(body['errors']).filter(
      (entry): entry is [string, string[]] =>
        Array.isArray(entry[1]) &&
        entry[1].every((message: unknown) => typeof message === 'string'),
    ),
  );
}

/**
 * Convierte fallos HTTP en texto seguro para interpolación; no presenta cuerpos HTML.
 * @returns Mensaje del servidor si es texto válido, o un aviso general recuperable.
 */
export function mensajeError(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0 || error.status >= 500)
      return 'No se pudo conectar con el servidor. Comprueba que el backend y MySQL estén iniciados e intenta de nuevo.';
    const body: unknown = error.error;
    if (esObjeto(body) && typeof body['message'] === 'string' && body['message'].trim())
      return body['message'];
  }
  return 'No se pudo realizar la operación. Intenta de nuevo.';
}

@Injectable({ providedIn: 'root' })
export class NotificacionesService {
  readonly mensaje = signal('');
  readonly tipo = signal<'success' | 'error'>('success');
  private timer?: ReturnType<typeof setTimeout>;

  /**
   * Reemplaza el aviso vigente y su temporizador para evitar cierres de avisos nuevos.
   * @param mensaje Texto que Angular mostrará mediante interpolación.
   * @param tipo Determina estilo y duración: éxito 6 s, error 12 s.
   */
  mostrar(mensaje: string, tipo: 'success' | 'error' = 'success'): void {
    clearTimeout(this.timer);
    this.tipo.set(tipo);
    this.mensaje.set(mensaje);
    this.timer = setTimeout(() => this.mensaje.set(''), tipo === 'error' ? 12000 : 6000);
  }
}
