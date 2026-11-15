import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Asignatura, Tarea } from '../../models/academico';
import { AcademicoService } from '../../services/academico.service';
import { mensajeError } from '../../services/notificaciones.service';
import { IconComponent } from '../../components/icon.component';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, DatePipe, IconComponent],
  templateUrl: './inicio.component.html',
})
export class InicioComponent {
  private readonly api = inject(AcademicoService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly tareas = signal<Tarea[]>([]);
  protected readonly asignaturas = signal<Asignatura[]>([]);
  protected readonly pendientes = computed(
    () => this.tareas().filter((t) => t.estado === 'Pendiente').length,
  );
  protected readonly progreso = computed(
    () => this.tareas().filter((t) => t.estado === 'En progreso').length,
  );
  protected readonly completadas = computed(
    () => this.tareas().filter((t) => t.estado === 'Completada').length,
  );
  protected readonly porcentaje = computed(() =>
    this.tareas().length ? Math.round((this.completadas() / this.tareas().length) * 100) : 0,
  );
  protected readonly proximas = computed(() =>
    this.tareas()
      .filter((t) => t.estado !== 'Completada')
      .slice(0, 5),
  );
  constructor() {
    this.cargar();
  }
  protected cargar(): void {
    this.loading.set(true);
    this.error.set('');
    forkJoin({ tareas: this.api.tareas(), asignaturas: this.api.asignaturas() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (r) => {
          this.tareas.set(r.tareas);
          this.asignaturas.set(r.asignaturas);
          this.loading.set(false);
        },
        error: (e) => {
          this.error.set(mensajeError(e));
          this.loading.set(false);
        },
      });
  }
}
