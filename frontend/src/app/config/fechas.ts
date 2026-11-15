import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

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
export const textoObligatorio: ValidatorFn = (control: AbstractControl): ValidationErrors | null =>
  typeof control.value === 'string' && control.value.trim().length > 0 ? null : { required: true };
export function fechaNoPasada(fechaOriginal?: string): ValidatorFn {
  return (control) =>
    control.value && control.value !== fechaOriginal && String(control.value) < hoyColombia()
      ? { pasada: true }
      : null;
}
