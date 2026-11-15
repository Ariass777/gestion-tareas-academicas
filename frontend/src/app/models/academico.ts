export const PRIORIDADES = ['Alta', 'Media', 'Baja'] as const;
export const ESTADOS = ['Pendiente', 'En progreso', 'Completada'] as const;
export type Prioridad = (typeof PRIORIDADES)[number];
export type Estado = (typeof ESTADOS)[number];
export interface Asignatura {
  id: number;
  nombre: string;
  codigo: string;
}
export interface NuevaAsignatura {
  nombre: string;
  codigo: string;
}
export interface DatosTarea {
  titulo: string;
  descripcion: string;
  fecha_entrega: string;
  prioridad: Prioridad;
  asignatura_id: number;
}
export interface Tarea extends DatosTarea {
  id: number;
  estado: Estado;
  asignatura: Asignatura;
}
export interface ApiResponse<T> {
  data: T;
}
export type ErroresCampos = Record<string, string[]>;
