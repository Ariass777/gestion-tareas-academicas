import { Component, effect, input, signal } from '@angular/core';
import type { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-field-error',
  template:
    '@if (serverErrors()?.length) { <span class="field-error" role="alert">{{ serverErrors()?.[0] }}</span> } @else if (invalid()) { <span class="field-error" role="alert">{{ control().hasError("pasada") ? "La fecha de entrega no puede ser anterior a hoy" : control().hasError("maxlength") ? "El texto supera la longitud permitida" : requiredMessage() }}</span> }',
})
export class FieldErrorComponent {
  readonly control = input.required<AbstractControl>();
  readonly serverErrors = input<string[]>();
  readonly requiredMessage = input('Este campo es obligatorio');
  private readonly revision = signal(0);
  constructor() {
    effect((onCleanup) => {
      const subscription = this.control().events.subscribe(() =>
        this.revision.update((n) => n + 1),
      );
      onCleanup(() => subscription.unsubscribe());
    });
  }
  protected invalid(): boolean {
    this.revision();
    return this.control().invalid && this.control().touched;
  }
}
