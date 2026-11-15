import { Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/inicio/inicio.component').then((m) => m.InicioComponent),
    title: 'Inicio · Académica',
  },
  {
    path: 'asignaturas',
    loadComponent: () =>
      import('./pages/asignaturas/asignaturas.component').then((m) => m.AsignaturasComponent),
    title: 'Asignaturas · Académica',
  },
  {
    path: 'tareas',
    loadComponent: () => import('./pages/tareas/tareas.component').then((m) => m.TareasComponent),
    title: 'Mis tareas · Académica',
  },
  { path: '**', redirectTo: '' },
];
