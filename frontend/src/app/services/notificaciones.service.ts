import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { ErroresCampos } from '../models/academico';

export function erroresCampos(error: unknown): ErroresCampos {
  if (
    error instanceof HttpErrorResponse &&
    error.status === 422 &&
    error.error &&
    typeof error.error === 'object'
  ) {
    return (error.error as { errors?: ErroresCampos }).errors ?? {};
  }
  return {};
}
export function mensajeError(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0 || error.status >= 500)
      return 'No se pudo conectar con el servidor. Comprueba que el backend y MySQL estén iniciados e intenta de nuevo.';
    if (error.error && typeof error.error === 'object' && 'message' in error.error)
      return String(error.error.message);
  }
  return 'No se pudo realizar la operación. Intenta de nuevo.';
}
@Injectable({ providedIn: 'root' })
export class NotificacionesService {
  readonly mensaje = signal('');
  readonly tipo = signal<'success' | 'error'>('success');
  private timer?: ReturnType<typeof setTimeout>;
  mostrar(mensaje: string, tipo: 'success' | 'error' = 'success'): void {
    clearTimeout(this.timer);
    this.tipo.set(tipo);
    this.mensaje.set(mensaje);
    this.timer = setTimeout(() => this.mensaje.set(''), tipo === 'error' ? 12000 : 6000);
  }
}
