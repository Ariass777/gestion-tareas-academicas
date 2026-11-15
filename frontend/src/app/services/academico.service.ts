import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { API_URL } from '../config/api.config';
import {
  ApiResponse,
  Asignatura,
  DatosTarea,
  Estado,
  NuevaAsignatura,
  Prioridad,
  Tarea,
} from '../models/academico';

@Injectable({ providedIn: 'root' })
export class AcademicoService {
  private readonly http = inject(HttpClient);
  private readonly url = inject(API_URL);
  asignaturas() {
    return this.http
      .get<ApiResponse<Asignatura[]>>(`${this.url}/asignaturas`)
      .pipe(map((r) => r.data));
  }
  crearAsignatura(datos: NuevaAsignatura) {
    return this.http
      .post<ApiResponse<Asignatura>>(`${this.url}/asignaturas`, datos)
      .pipe(map((r) => r.data));
  }
  tareas(prioridad?: Prioridad, estado?: Estado) {
    let params = new HttpParams();
    if (prioridad) params = params.set('prioridad', prioridad);
    if (estado) params = params.set('estado', estado);
    return this.http
      .get<ApiResponse<Tarea[]>>(`${this.url}/tareas`, { params })
      .pipe(map((r) => r.data));
  }
  crearTarea(datos: DatosTarea) {
    return this.http.post<ApiResponse<Tarea>>(`${this.url}/tareas`, datos).pipe(map((r) => r.data));
  }
  editarTarea(id: number, datos: DatosTarea) {
    return this.http
      .put<ApiResponse<Tarea>>(`${this.url}/tareas/${id}`, datos)
      .pipe(map((r) => r.data));
  }
  cambiarEstado(id: number, estado: Estado) {
    return this.http
      .patch<ApiResponse<Tarea>>(`${this.url}/tareas/${id}/estado`, { estado })
      .pipe(map((r) => r.data));
  }
  eliminarTarea(id: number) {
    return this.http.delete<void>(`${this.url}/tareas/${id}`);
  }
}
