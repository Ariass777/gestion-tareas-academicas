import { test, expect, APIRequestContext, Page } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const hoy = () => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value;
  return `${get('year')}-${get('month')}-${get('day')}`;
};
const filas = (page: Page) => page.getByRole('listitem');
async function crearTarea(request: APIRequestContext, cambios: Record<string, unknown> = {}) {
  const materias = await request.get('/api/asignaturas');
  expect(materias.ok()).toBeTruthy();
  const asignatura = (await materias.json()).data[0] as { id: number };
  const response = await request.post('/api/tareas', {
    data: {
      titulo: '[E2E] Tarea de integración ' + Date.now(),
      descripcion: 'Descripción de la actividad para integración con MySQL',
      fecha_entrega: hoy(),
      prioridad: 'Alta',
      asignatura_id: asignatura.id,
      ...cambios,
    },
  });
  expect(response.status()).toBe(201);
  return (await response.json()).data as { id: number; titulo: string };
}

test('RNF-01: muestra 200 tareas reales de MySQL por HTTP', async ({ page, request }) => {
  const response = await request.get('/api/tareas');
  expect((await response.json()).data).toHaveLength(200);
  await page.setViewportSize({ width: 1920, height: 1080 });
  const muestras: number[] = [];
  const apiMs: number[] = [];
  await page.addInitScript(() => {
    const observer = new MutationObserver(() => {
      if (document.querySelectorAll('.task-row').length === 200) {
        observer.disconnect();
        requestAnimationFrame(() => {
          (window as Window & { tareasVisiblesMs?: number }).tareasVisiblesMs = performance.now();
        });
      }
    });
    observer.observe(document, { childList: true, subtree: true });
  });
  for (let i = 0; i < 3; i++) {
    const responsePromise = page.waitForResponse(
      (r) => r.url().includes('/api/tareas') && r.request().method() === 'GET',
    );
    await page.goto('/tareas');
    await responsePromise;
    await expect(filas(page)).toHaveCount(200);
    await page.waitForFunction(
      () => (window as Window & { tareasVisiblesMs?: number }).tareasVisiblesMs !== undefined,
    );
    const duration = await page.evaluate(
      () => (window as Window & { tareasVisiblesMs: number }).tareasVisiblesMs,
    );
    const resourceDuration = await page.evaluate(
      () =>
        performance
          .getEntriesByType('resource')
          .filter((r) => r.name.includes('/api/tareas'))
          .at(-1)?.duration ?? 0,
    );
    muestras.push(Math.round(duration));
    apiMs.push(Math.round(resourceDuration));
  }
  await mkdir('../artifacts', { recursive: true });
  const result = {
    fecha: new Date().toISOString(),
    navegador: 'Chromium',
    registros: 200,
    resolucion: '1920x1080',
    medicion:
      'NavigationStart hasta 200 filas observadas en DOM y siguiente frame; bundle de producción, API HTTP Laravel con OPcache y MySQL 8.4 local; sin trazado de Playwright',
    muestras_ms: muestras,
    api_ms: apiMs,
    cumple_en_esta_ejecucion: muestras.every((ms) => ms < 1500),
  };
  await writeFile('../artifacts/rnf-01.json', JSON.stringify(result, null, 2));
  console.log('RNF-01 ' + JSON.stringify(result));
  for (const duration of muestras) expect(duration).toBeLessThan(1500);
});

test('RNF-02: inicio, tareas y formularios se adaptan a 375 y 1920 px', async ({ page }) => {
  for (const width of [375, 1920]) {
    await page.setViewportSize({ width, height: width === 375 ? 812 : 1080 });
    await page.goto('/');
    await expect(page.getByTestId('pendientes')).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    ).toBeTruthy();
    await page.screenshot({ path: `../artifacts/inicio-${width}.png`, fullPage: true });
    await page.getByRole('link', { name: 'Mis tareas', exact: true }).click();
    await expect(filas(page)).toHaveCount(200);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    ).toBeTruthy();
    await page.screenshot({ path: `../artifacts/tareas-${width}.png` });
    await page.getByRole('button', { name: 'Nueva tarea', exact: true }).click();
    await expect(page.getByRole('dialog', { name: 'Nueva tarea' })).toBeVisible();
    expect(
      await page
        .getByRole('dialog', { name: 'Nueva tarea' })
        .evaluate((el) => el.scrollWidth <= el.clientWidth),
    ).toBeTruthy();
    await page.getByRole('button', { name: 'Cancelar', exact: true }).first().click();
    await page.getByRole('link', { name: 'Asignaturas', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Mis asignaturas', exact: true })).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    ).toBeTruthy();
  }
});

test('HU-01: nombre vacío y registro de asignatura persistente tras recarga', async ({ page }) => {
  await page.goto('/asignaturas');
  await page.getByRole('button', { name: 'Guardar asignatura' }).click();
  await expect(
    page.getByText('El nombre de la asignatura es obligatorio', { exact: true }),
  ).toBeVisible();
  const nombre = 'Materia E2E ' + Date.now();
  await page.getByLabel('Nombre de la asignatura').fill(nombre);
  await page.getByLabel('Código académico').fill('E2E-NUEVA');
  await page.getByRole('button', { name: 'Guardar asignatura' }).click();
  await expect(page.getByRole('heading', { name: nombre })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: nombre })).toBeVisible();
});

test('HU-02, HU-07 y HU-08: crear, editar y persistir una tarea tras recargar', async ({
  page,
  request,
}) => {
  await page.goto('/tareas');
  await expect(filas(page)).toHaveCount(200);
  await page.getByRole('button', { name: 'Nueva tarea', exact: true }).click();
  const modal = page.getByRole('dialog', { name: 'Nueva tarea' });
  await modal.getByRole('button', { name: 'Registrar tarea' }).click();
  await expect(modal.getByText('El título de la tarea es obligatorio')).toBeVisible();
  await expect(modal.getByText('La descripción no puede estar vacía')).toBeVisible();
  const titulo = '[E2E] Informe desde formulario ' + Date.now();
  await modal.getByLabel('Título de la tarea').fill(titulo);
  await modal.getByLabel('Descripción').fill('Revisar los criterios de aceptación.');
  await modal.getByLabel('Asignatura').selectOption({ index: 1 });
  await modal.getByLabel('Fecha de entrega').fill('2020-01-01');
  await modal.getByLabel('Prioridad').selectOption('Alta');
  await modal.getByRole('button', { name: 'Registrar tarea' }).click();
  await expect(modal.getByText('La fecha de entrega no puede ser anterior a hoy')).toBeVisible();
  await modal.getByLabel('Fecha de entrega').fill(hoy());
  await modal.getByRole('button', { name: 'Registrar tarea' }).click();
  await expect(modal).not.toBeVisible();
  let fila = filas(page).filter({ has: page.getByRole('heading', { name: titulo, exact: true }) });
  await expect(fila).toBeVisible();
  const id = await fila.getAttribute('data-task-id');
  await page.reload();
  fila = page.locator(`[data-task-id="${id}"]`);
  await expect(fila.getByRole('heading', { name: titulo, exact: true })).toBeVisible();
  await fila.getByRole('button', { name: 'Editar ' + titulo, exact: true }).click();
  const editar = page.getByRole('dialog', { name: 'Editar tarea' });
  await expect(editar.getByLabel('Título de la tarea')).toHaveValue(titulo);
  await editar.getByLabel('Descripción').fill('');
  await editar.getByRole('button', { name: 'Actualizar tarea' }).click();
  await expect(editar.getByText('La descripción no puede estar vacía')).toBeVisible();
  await editar.getByLabel('Descripción').fill('Descripción editada y guardada en MySQL.');
  await editar.getByLabel('Título de la tarea').fill(titulo + ' editado');
  await editar.getByRole('button', { name: 'Actualizar tarea' }).click();
  await expect(editar).not.toBeVisible();
  await page.reload();
  await expect(
    page
      .locator(`[data-task-id="${id}"]`)
      .getByRole('heading', { name: titulo + ' editado', exact: true }),
  ).toBeVisible();
  expect((await request.delete('/api/tareas/' + id)).status()).toBe(204);
});

test('HU-03 y HU-05: orden, filtro por prioridad y pendientes desde la API', async ({ page }) => {
  await page.goto('/tareas?estado=En%20progreso');
  await expect(page.getByLabel('Filtrar por estado')).toHaveValue('En progreso');
  await page.goto('/tareas');
  const responsePromise = page.waitForResponse((r) => r.url().includes('prioridad=Alta'));
  await page.getByRole('button', { name: 'Alta', exact: true }).click();
  const response = await responsePromise;
  const data = (await response.json()).data as { prioridad: string; fecha_entrega: string }[];
  expect(data.length).toBeGreaterThan(0);
  expect(data.every((t) => t.prioridad === 'Alta')).toBeTruthy();
  expect(data.map((t) => t.fecha_entrega)).toEqual(data.map((t) => t.fecha_entrega).sort());
  await expect(filas(page)).toHaveCount(data.length);
  await page.getByLabel('Filtrar por estado').selectOption('Pendiente');
  await expect(page.getByRole('heading', { name: 'Tareas pendientes' })).toBeVisible();
  await expect(filas(page).first()).toBeVisible();
  await expect(filas(page).first().getByRole('combobox')).toHaveValue('Pendiente');
});

test('HU-04: cambio inmediato y persistencia de estado, completar deshabilitado', async ({
  page,
  request,
}) => {
  const tarea = await crearTarea(request);
  await page.goto('/tareas');
  let fila = page.locator(`[data-task-id="${tarea.id}"]`);
  await fila.getByRole('combobox').selectOption('En progreso');
  await expect(fila.getByRole('combobox')).toHaveValue('En progreso');
  await fila.getByRole('button', { name: 'Completar ' + tarea.titulo, exact: true }).click();
  await expect(fila.getByRole('combobox')).toHaveValue('Completada');
  await expect(fila.getByRole('button', { name: 'La tarea ya fue completada' })).toBeDisabled();
  await expect(fila.getByText('La tarea ya fue completada', { exact: true })).toBeVisible();
  await page.reload();
  fila = page.locator(`[data-task-id="${tarea.id}"]`);
  await expect(fila.getByRole('combobox')).toHaveValue('Completada');
  expect((await request.delete('/api/tareas/' + tarea.id)).status()).toBe(204);
});

test('HU-06: cancelar conserva la tarea, confirmar la elimina de MySQL', async ({
  page,
  request,
}) => {
  const tarea = await crearTarea(request);
  await page.goto('/tareas');
  const fila = page.locator(`[data-task-id="${tarea.id}"]`);
  await fila.getByRole('button', { name: 'Eliminar ' + tarea.titulo, exact: true }).click();
  const modal = page.getByRole('dialog', { name: '¿Eliminar esta tarea?' });
  await expect(modal).toBeVisible();
  await modal.getByRole('button', { name: 'Cancelar', exact: true }).click();
  await expect(fila).toBeVisible();
  await page.reload();
  await expect(fila).toBeVisible();
  await fila.getByRole('button', { name: 'Eliminar ' + tarea.titulo, exact: true }).click();
  await modal.getByRole('button', { name: 'Sí, eliminar', exact: true }).click();
  await expect(fila).toHaveCount(0);
  await page.reload();
  await expect(fila).toHaveCount(0);
  const response = await request.get('/api/tareas');
  expect((await response.json()).data.some((t: { id: number }) => t.id === tarea.id)).toBeFalsy();
});

test('muestra estados vacíos y recuperación de errores de conexión', async ({ page }) => {
  // Solo esta prueba de presentación simula respuestas; CRUD y rendimiento usan MySQL real.
  await page.route('**/api/tareas*', (route) => route.fulfill({ json: { data: [] } }));
  await page.goto('/tareas?estado=Pendiente');
  await expect(
    page.getByText('No hay tareas pendientes registradas', { exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Baja', exact: true }).click();
  await expect(page.getByText('No hay tareas en esta categoría', { exact: true })).toBeVisible();
  await page.unroute('**/api/tareas*');
  await page.route('**/api/tareas*', (route) => route.abort());
  await page.reload();
  await expect(page.getByText(/No se pudo conectar con el servidor/)).toBeVisible();
  await page.unroute('**/api/tareas*');
  await page.getByRole('button', { name: 'Reintentar', exact: true }).click();
  await expect(filas(page).first()).toBeVisible();
});
