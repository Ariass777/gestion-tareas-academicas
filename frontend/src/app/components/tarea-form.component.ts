import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { Asignatura, DatosTarea, ErroresCampos, Prioridad, Tarea } from '../models/academico';
import { PRIORIDADES } from '../models/academico';
import { fechaNoPasada, hoyColombia, textoObligatorio } from '../config/fechas';
import { FieldErrorComponent } from './field-error.component';

@Component({
  selector: 'app-tarea-form',
  imports: [ReactiveFormsModule, FieldErrorComponent],
  template: ` <form [formGroup]="form" (ngSubmit)="enviar()" novalidate>
    <div class="form-stack">
      <div class="field">
        <label for="titulo">Título de la tarea <span>*</span></label
        ><input
          id="titulo"
          formControlName="titulo"
          maxlength="200"
          placeholder="Ej. Entregar informe del proyecto"
          [attr.aria-invalid]="form.controls.titulo.touched && form.controls.titulo.invalid"
        /><app-field-error
          [control]="form.controls.titulo"
          [serverErrors]="errors()['titulo']"
          requiredMessage="El título de la tarea es obligatorio"
        />
      </div>
      <div class="field">
        <label for="descripcion">Descripción <span>*</span></label
        ><textarea
          id="descripcion"
          formControlName="descripcion"
          rows="3"
          maxlength="5000"
          placeholder="¿Qué necesitas hacer?"
        ></textarea
        ><app-field-error
          [control]="form.controls.descripcion"
          [serverErrors]="errors()['descripcion']"
          requiredMessage="La descripción no puede estar vacía"
        />
      </div>
      <div class="field">
        <label for="asignatura_id">Asignatura <span>*</span></label
        ><select id="asignatura_id" formControlName="asignatura_id">
          <option [ngValue]="0" disabled>Selecciona una asignatura</option>
          @for (asignatura of asignaturas(); track asignatura.id) {
            <option [ngValue]="asignatura.id">
              {{ asignatura.nombre }} · {{ asignatura.codigo }}
            </option>
          }</select
        ><app-field-error
          [control]="form.controls.asignatura_id"
          [serverErrors]="errors()['asignatura_id']"
          requiredMessage="Selecciona una asignatura"
        />
      </div>
      <div class="form-row">
        <div class="field">
          <label for="fecha_entrega">Fecha de entrega <span>*</span></label
          ><input
            type="date"
            id="fecha_entrega"
            formControlName="fecha_entrega"
            [min]="fechaMinima()"
          /><app-field-error
            [control]="form.controls.fecha_entrega"
            [serverErrors]="errors()['fecha_entrega']"
            requiredMessage="La fecha de entrega es obligatoria"
          />
        </div>
        <div class="field">
          <label for="prioridad">Prioridad <span>*</span></label
          ><select id="prioridad" formControlName="prioridad">
            @for (prioridad of prioridades; track prioridad) {
              <option [value]="prioridad">{{ prioridad }}</option>
            }</select
          ><app-field-error
            [control]="form.controls.prioridad"
            [serverErrors]="errors()['prioridad']"
          />
        </div>
      </div>
      <p class="form-hint">
        {{
          tarea()
            ? 'El estado se actualiza desde el listado de tareas.'
            : 'Tu nueva tarea comenzará con estado Pendiente.'
        }}
      </p>
    </div>
    <div class="dialog-actions">
      <button
        type="button"
        class="btn btn-secondary"
        [disabled]="saving()"
        (click)="cancelar.emit()"
      >
        Cancelar</button
      ><button
        class="btn btn-primary"
        type="submit"
        [disabled]="saving() || asignaturas().length === 0"
      >
        {{ saving() ? 'Guardando…' : tarea() ? 'Actualizar tarea' : 'Registrar tarea' }}
      </button>
    </div>
  </form>`,
})
export class TareaFormComponent {
  readonly tarea = input<Tarea | null>(null);
  readonly resetKey = input(0);
  readonly asignaturas = input<Asignatura[]>([]);
  readonly saving = input(false);
  readonly errors = input<ErroresCampos>({});
  readonly guardar = output<DatosTarea>();
  readonly cancelar = output<void>();
  protected readonly prioridades = PRIORIDADES;
  private readonly fb = inject(FormBuilder);
  protected readonly form = this.fb.nonNullable.group({
    titulo: ['', [textoObligatorio, Validators.maxLength(200)]],
    descripcion: ['', [textoObligatorio, Validators.maxLength(5000)]],
    asignatura_id: [0, [Validators.required, Validators.min(1)]],
    fecha_entrega: ['', [Validators.required, fechaNoPasada()]],
    prioridad: ['Media' as Prioridad, Validators.required],
  });
  constructor() {
    effect(() => {
      this.resetKey();
      const tarea = this.tarea();
      this.form.controls.fecha_entrega.setValidators([
        Validators.required,
        fechaNoPasada(tarea?.fecha_entrega),
      ]);
      this.form.reset(
        tarea
          ? {
              titulo: tarea.titulo,
              descripcion: tarea.descripcion,
              asignatura_id: tarea.asignatura_id,
              fecha_entrega: tarea.fecha_entrega,
              prioridad: tarea.prioridad,
            }
          : {
              titulo: '',
              descripcion: '',
              asignatura_id: 0,
              fecha_entrega: '',
              prioridad: 'Media',
            },
      );
    });
  }
  /** Mantiene editable una entrega vencida sin proponer otra fecha pasada como minimo nuevo. */
  protected fechaMinima(): string {
    const original = this.tarea()?.fecha_entrega;
    return original && original < hoyColombia() ? original : hoyColombia();
  }
  /** Marca errores visuales y emite solo los cinco campos validos; el contenedor realiza HTTP. */
  protected enviar(): void {
    this.form.markAllAsTouched();
    this.form.controls.fecha_entrega.updateValueAndValidity();
    if (this.form.valid && !this.saving()) {
      const value = this.form.getRawValue();
      this.guardar.emit({
        ...value,
        titulo: value.titulo.trim(),
        descripcion: value.descripcion.trim(),
      });
    }
  }
}
