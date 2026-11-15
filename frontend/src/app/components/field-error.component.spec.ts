import { TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { FieldErrorComponent } from './field-error.component';

describe('Mensajes reactivos de validación', () => {
  it('muestra el error al marcar un control y lo retira al corregirlo', async () => {
    await TestBed.configureTestingModule({ imports: [FieldErrorComponent] }).compileComponents();
    const fixture = TestBed.createComponent(FieldErrorComponent);
    const control = new FormControl('', Validators.required);
    fixture.componentRef.setInput('control', control);
    fixture.componentRef.setInput('requiredMessage', 'La descripción no puede estar vacía');
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).not.toContain('La descripción');
    control.markAsTouched();
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'La descripción no puede estar vacía',
    );
    control.setValue('Informe corregido');
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).querySelector('[role="alert"]')).toBeNull();
  });
});
