import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './e2e',
  workers: 1,
  fullyParallel: false,
  timeout: 30000,
  expect: { timeout: 8000 },
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: '../artifacts/playwright-results.json' }],
  ],
  use: {
    baseURL: 'http://127.0.0.1:4300',
    browserName: 'chromium',
    trace: 'off',
    screenshot: 'only-on-failure',
  },
  webServer: [
    {
      command: 'node ../scripts/serve-frontend.mjs',
      // Evita que variables heredadas redirijan el CRUD de pruebas al backend de desarrollo.
      env: { PORT: '4300', BACKEND_PORT: '8001' },
      url: 'http://127.0.0.1:4300',
      reuseExistingServer: false,
      timeout: 30000,
    },
    {
      command: 'node ../scripts/serve-backend.mjs',
      url: 'http://127.0.0.1:8001/api/tareas',
      reuseExistingServer: false,
      timeout: 30000,
    },
  ],
});
