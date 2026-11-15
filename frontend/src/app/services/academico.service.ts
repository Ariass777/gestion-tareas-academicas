import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import type { Observable } from 'rxjs';
import { API_URL } from '../config/api.config';
import type {
  ApiResponse,
  Asignatura,
  DatosTarea,
  Estado,
  NuevaAsignatura,
  Prioridad,
  Tarea,
} from '../models/academico';

/**
 * Contrato HTTP de la aplicación. Los datos se leen de MySQL a través de Laravel.
 * Los observables son fríos y propagan HttpErrorResponse; no mantienen una copia persistente.
 */
@Injectable({ providedIn: 'root' })
export class AcademicoService {
  private readonly http = inject(HttpClient);
  private readonly url = inject(API_URL);

  /** @returns Asignaturas ordenadas por nombre en una consulta nueva a la API. */
  asignaturas(): Observable<Asignatura[]> {
    return this.http
      .get<ApiResponse<Asignatura[]>>(`${this.url}/asignaturas`)
      .pipe(map((r) => r.data));
  }

  /**
   * Registra nombre y código; Laravel valida los límites y campos obligatorios.
   * @returns La asignatura persistida con su identificador (HTTP 201).
   */
  crearAsignatura(datos: NuevaAsignatura): Observable<Asignatura> {
    return this.http
      .post<ApiResponse<Asignatura>>(`${this.url}/asignaturas`, datos)
      .pipe(map((r) => r.data));
  }

  /**
   * Consulta tareas con su asignatura y orden de entrega establecido por la API.
   * @param prioridad Prioridad opcional; omitirla equivale a todas.
   * @param estado Estado opcional, combinable con prioridad.
   */
  tareas(prioridad?: Prioridad, estado?: Estado): Observable<Tarea[]> {
    let params = new HttpParams();
    if (prioridad) params = params.set('prioridad', prioridad);
    if (estado) params = params.set('estado', estado);
    return this.http
      .get<ApiResponse<Tarea[]>>(`${this.url}/tareas`, { params })
      .pipe(map((r) => r.data));
  }

  /** Crea en estado Pendiente; errores de fecha, campos o relación se emiten como HTTP 422. */
  crearTarea(datos: DatosTarea): Observable<Tarea> {
    return this.http.post<ApiResponse<Tarea>>(`${this.url}/tareas`, datos).pipe(map((r) => r.data));
  }

  /**
   * Envía el formulario completo y conserva el estado actual.
   * @param id Identificador persistido; la API devuelve 404 si ya no existe.
   */
  editarTarea(id: number, datos: DatosTarea): Observable<Tarea> {
    return this.http
      .put<ApiResponse<Tarea>>(`${this.url}/tareas/${id}`, datos)
      .pipe(map((r) => r.data));
  }

  /** Solicita una transición validada; completar dos veces se rechaza con HTTP 422. */
  cambiarEstado(id: number, estado: Estado): Observable<Tarea> {
    return this.http
      .patch<ApiResponse<Tarea>>(`${this.url}/tareas/${id}/estado`, { estado })
      .pipe(map((r) => r.data));
  }

  /** Elimina por id tras la confirmación en la interfaz; HTTP 204 no contiene cuerpo. */
  eliminarTarea(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/tareas/${id}`);
  }
}
