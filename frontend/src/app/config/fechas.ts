import type { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Devuelve el dia calendario colombiano en ISO, independiente del huso horario del navegador. */
export function hoyColombia(): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? '';
  return `${part('year')}-${part('month')}-${part('day')}`;
}
/** Rechaza texto vacio o compuesto por espacios sin alterar lo escrito en el formulario. */
export const textoObligatorio: ValidatorFn = (control: AbstractControl): ValidationErrors | null =>
  typeof control.value === 'string' && control.value.trim().length > 0 ? null : { required: true };
/**
 * Valida contra hoy en Colombia y permite conservar una fecha vencida durante la edición.
 * @param fechaOriginal Fecha ISO persistida, omitida en formularios de registro.
 * @returns Validador con error pasada o null; Validators.required comprueba ausencia.
 */
export function fechaNoPasada(fechaOriginal?: string): ValidatorFn {
  return (control) =>
    control.value && control.value !== fechaOriginal && String(control.value) < hoyColombia()
      ? { pasada: true }
      : null;
}
