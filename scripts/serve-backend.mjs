import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const portablePhp = path.join(root, '.tools/php/php.exe');
const php = process.env.PHP_BINARY || (existsSync(portablePhp) ? portablePhp : 'php');
const testEnvironment = { ...process.env, APP_ENV: 'testing', ACADEMICA_E2E: '1' };
// La API no debe aceptar solicitudes si la configuracion apunta a datos de desarrollo.
const check = spawnSync(php, ['artisan', 'academic:check-test-database', '--env=testing', '--no-interaction'], {
  cwd: path.join(root, 'backend'),
  env: testEnvironment,
  stdio: 'inherit',
  windowsHide: true,
});
if (check.error || check.status !== 0) {
  process.stderr.write('Servidor E2E cancelado: no se verifico una base MySQL exclusiva de pruebas.\n');
  process.exit(1);
}
const server = spawn(php, ['-d', 'opcache.enable_cli=1', '-S', '127.0.0.1:8001', '-t', '.', path.join(root, 'backend/vendor/laravel/framework/src/Illuminate/Foundation/resources/server.php')], {
  cwd: path.join(root, 'backend/public'),
  env: testEnvironment,
  stdio: 'inherit',
  windowsHide: true,
});
server.on('error', error => { process.stderr.write(error.message + '\n'); process.exit(1); });
server.on('exit', code => process.exit(code ?? 0));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.kill());
