import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
for (const [name, overrides] of [
  ['base de desarrollo heredada', { DB_DATABASE: 'gestion_tareas_academicas', DB_URL: '' }],
  ['redireccion DB_URL heredada', { DB_DATABASE: 'gestion_segura_testing', DB_URL: 'mysql://localhost/otra_base' }],
  ['identificador de base invalido', { DB_DATABASE: 'base no valida_testing', DB_URL: '' }],
]) {
  test('E2E rechaza ' + name + ' antes de abrir HTTP', () => {
    const result = spawnSync(process.execPath, ['scripts/serve-backend.mjs'], {
      cwd: root,
      env: { ...process.env, ...overrides },
      encoding: 'utf8',
      timeout: 15000,
      windowsHide: true,
    });
    assert.equal(result.error, undefined);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Servidor E2E cancelado/);
    assert.doesNotMatch(result.stderr, /Development Server.*started/);
  });
}
