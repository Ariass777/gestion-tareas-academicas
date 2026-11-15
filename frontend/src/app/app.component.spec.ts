import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app.component';
describe('Navegación de Académica', () => {
  it('presenta las tres secciones principales', async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement as HTMLElement;
    const labels = Array.from(element.querySelectorAll('nav a')).map((a) => a.textContent?.trim());
    expect(labels).toEqual(['Inicio', 'Mis tareas', 'Asignaturas']);
  });
});
