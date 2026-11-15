import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { Asignatura, ErroresCampos } from '../../models/academico';
import { AcademicoService } from '../../services/academico.service';
import {
  erroresCampos,
  mensajeError,
  NotificacionesService,
} from '../../services/notificaciones.service';
import { textoObligatorio } from '../../config/fechas';
import { IconComponent } from '../../components/icon.component';
import { FieldErrorComponent } from '../../components/field-error.component';
@Component({
  selector: 'app-asignaturas',
  imports: [ReactiveFormsModule, IconComponent, FieldErrorComponent],
  templateUrl: './asignaturas.component.html',
})
export class AsignaturasComponent {
  private readonly api = inject(AcademicoService);
  private readonly avisos = inject(NotificacionesService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly asignaturas = signal<Asignatura[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly error = signal('');
  protected readonly errors = signal<ErroresCampos>({});
  protected readonly form = inject(FormBuilder).nonNullable.group({
    nombre: ['', [textoObligatorio, Validators.maxLength(150)]],
    codigo: ['', [textoObligatorio, Validators.maxLength(30)]],
  });
  constructor() {
    this.cargar();
  }
  /** Consulta MySQL por API y habilita reintento si la carga falla. */
  protected cargar(): void {
    this.loading.set(true);
    this.error.set('');
    this.api
      .asignaturas()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (r) => this.asignaturas.set(r),
        error: (e) => this.error.set(mensajeError(e)),
      });
  }
  /** Valida y normaliza el formulario; agrega la respuesta persistida sin guardar copias locales. */
  protected guardar(): void {
    this.errors.set({});
    this.form.markAllAsTouched();
    if (this.form.invalid || this.saving()) return;
    this.saving.set(true);
    const value = this.form.getRawValue();
    this.api
      .crearAsignatura({ nombre: value.nombre.trim(), codigo: value.codigo.trim() })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.saving.set(false)),
      )
      .subscribe({
        next: (r) => {
          this.asignaturas.update((items) =>
            [...items, r].sort((a, b) => a.nombre.localeCompare(b.nombre)),
          );
          this.form.reset();
          this.avisos.mostrar('Asignatura registrada correctamente');
        },
        error: (e) => {
          this.errors.set(erroresCampos(e));
          this.avisos.mostrar(mensajeError(e), 'error');
        },
      });
  }
}
