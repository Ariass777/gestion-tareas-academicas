import type { ElementRef } from '@angular/core';
import { Component, computed, DestroyRef, effect, inject, signal, viewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type {
  Asignatura,
  DatosTarea,
  ErroresCampos,
  Estado,
  Prioridad,
  Tarea,
} from '../../models/academico';
import { ESTADOS, PRIORIDADES } from '../../models/academico';
import { AcademicoService } from '../../services/academico.service';
import {
  erroresCampos,
  mensajeError,
  NotificacionesService,
} from '../../services/notificaciones.service';
import { IconComponent } from '../../components/icon.component';
import { TareaFormComponent } from '../../components/tarea-form.component';
import { hoyColombia } from '../../config/fechas';

@Component({
  selector: 'app-tareas',
  imports: [DatePipe, RouterLink, IconComponent, TareaFormComponent],
  templateUrl: './tareas.component.html',
})
export class TareasComponent {
  private readonly api = inject(AcademicoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly avisos = inject(NotificacionesService);
  protected readonly editor = viewChild.required<ElementRef<HTMLDialogElement>>('editor');
  protected readonly confirmacion =
    viewChild.required<ElementRef<HTMLDialogElement>>('confirmacion');
  protected readonly tareas = signal<Tarea[]>([]);
  protected readonly asignaturas = signal<Asignatura[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly busyId = signal<number | null>(null);
  protected readonly error = signal('');
  protected readonly errors = signal<ErroresCampos>({});
  protected readonly prioridad = signal<Prioridad | undefined>(undefined);
  protected readonly estado = signal<Estado | undefined>(undefined);
  protected readonly editando = signal<Tarea | null>(null);
  protected readonly eliminando = signal<Tarea | null>(null);
  protected readonly revision = signal(0);
  protected readonly resetKey = signal(0);
  protected readonly prioridades = PRIORIDADES;
  protected readonly estados = ESTADOS;
  protected readonly titulo = computed(() =>
    this.estado() === 'Pendiente'
      ? 'Tareas pendientes'
      : this.estado() === 'En progreso'
        ? 'Tareas en progreso'
        : this.estado() === 'Completada'
          ? 'Tareas completadas'
          : 'Mis tareas',
  );
  protected readonly vacio = computed(() =>
    this.prioridad()
      ? 'No hay tareas en esta categoría'
      : this.estado() === 'Pendiente'
        ? 'No hay tareas pendientes registradas'
        : 'No hay tareas registradas en esta vista',
  );
  private abrirAlCargar = this.route.snapshot.queryParamMap.has('nueva');
  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const estado = params.get('estado');
      this.estado.set(ESTADOS.find((e) => e === estado));
    });
    effect((onCleanup) => {
      this.revision();
      const prioridad = this.prioridad();
      const estado = this.estado();
      this.loading.set(true);
      this.error.set('');
      const subscription = forkJoin({
        tareas: this.api.tareas(prioridad, estado),
        asignaturas: this.api.asignaturas(),
      }).subscribe({
        next: (r) => {
          this.tareas.set(r.tareas);
          this.asignaturas.set(r.asignaturas);
          this.loading.set(false);
          if (this.abrirAlCargar) {
            this.abrirAlCargar = false;
            if (r.asignaturas.length) this.abrirEditor();
          }
        },
        error: (e) => {
          this.error.set(mensajeError(e));
          this.loading.set(false);
        },
      });
      onCleanup(() => subscription.unsubscribe());
    });
  }
  /** Sincroniza el selector con la URL para conservar enlaces directos desde el resumen. */
  protected filtrarEstado(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { estado: value || null },
      replaceUrl: true,
    });
  }
  protected reintentar(): void {
    this.revision.update((n) => n + 1);
  }
  /** Compara dias ISO en Colombia; las actividades completadas no se marcan como vencidas. */
  protected vencida(tarea: Tarea): boolean {
    return tarea.estado !== 'Completada' && tarea.fecha_entrega < hoyColombia();
  }
  /** Carga la tarea actual o reinicia el formulario para un registro nuevo. */
  protected abrirEditor(tarea: Tarea | null = null): void {
    this.editando.set(tarea);
    this.errors.set({});
    this.resetKey.update((n) => n + 1);
    this.editor().nativeElement.showModal();
  }
  protected cerrarEditor(): void {
    if (!this.saving()) this.editor().nativeElement.close();
  }
  /** Persiste el formulario y conserva el dialogo abierto ante errores 422 recuperables. */
  protected guardar(datos: DatosTarea): void {
    if (this.saving()) return;
    this.saving.set(true);
    this.errors.set({});
    const tarea = this.editando();
    const request = tarea ? this.api.editarTarea(tarea.id, datos) : this.api.crearTarea(datos);
    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.saving.set(false);
        this.editor().nativeElement.close();
        this.avisos.mostrar(
          tarea ? 'Tarea actualizada correctamente' : 'Tarea registrada correctamente',
        );
        this.revision.update((n) => n + 1);
      },
      error: (e) => {
        this.saving.set(false);
        this.errors.set(erroresCampos(e));
        this.avisos.mostrar(mensajeError(e), 'error');
      },
    });
  }
  /**
   * Espera la confirmacion de MySQL antes de reflejar el cambio y aplicar el filtro activo.
   * @param tarea Recurso listado, cuyo id identifica la solicitud PATCH.
   * @param estado Uno de los tres estados aprobados; no permite completar dos veces.
   */
  protected cambiarEstado(tarea: Tarea, estado: Estado): void {
    if (this.busyId() !== null) return;
    if (tarea.estado === 'Completada' && estado === 'Completada') {
      this.avisos.mostrar('La tarea ya fue completada', 'error');
      return;
    }
    this.busyId.set(tarea.id);
    this.api
      .cambiarEstado(tarea.id, estado)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (r) => {
          this.busyId.set(null);
          this.tareas.update((items) =>
            items
              .map((t) => (t.id === r.id ? r : t))
              .filter((t) => !this.estado() || t.estado === this.estado()),
          );
          this.avisos.mostrar('Estado actualizado correctamente');
        },
        error: (e) => {
          this.busyId.set(null);
          this.avisos.mostrar(mensajeError(e), 'error');
          this.revision.update((n) => n + 1);
        },
      });
  }
  /** Restaura la seleccion hasta recibir respuesta, evitando un cambio visual sin persistencia. */
  protected seleccionarEstado(tarea: Tarea, event: Event): void {
    const select = event.target as HTMLSelectElement;
    const estado = ESTADOS.find((e) => e === select.value);
    select.value = tarea.estado;
    if (estado && estado !== tarea.estado) this.cambiarEstado(tarea, estado);
  }
  /** Abre una confirmacion sin realizar todavia ninguna solicitud DELETE. */
  protected pedirEliminacion(tarea: Tarea): void {
    this.eliminando.set(tarea);
    this.confirmacion().nativeElement.showModal();
  }
  /** Cierra el dialogo sin modificar el recurso; bloquea el cierre mientras hay una solicitud. */
  protected cancelarEliminacion(): void {
    if (this.busyId() !== null) return;
    this.confirmacion().nativeElement.close();
    this.eliminando.set(null);
  }
  /** Elimina solo el id confirmado y lo retira de la vista tras recibir HTTP 204. */
  protected eliminar(): void {
    const tarea = this.eliminando();
    if (!tarea || this.busyId() !== null) return;
    this.busyId.set(tarea.id);
    this.api
      .eliminarTarea(tarea.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.busyId.set(null);
          this.confirmacion().nativeElement.close();
          this.eliminando.set(null);
          this.tareas.update((items) => items.filter((t) => t.id !== tarea.id));
          this.avisos.mostrar('Tarea eliminada correctamente');
        },
        error: (e) => {
          this.busyId.set(null);
          this.avisos.mostrar(mensajeError(e), 'error');
        },
      });
  }
}
