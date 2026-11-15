import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const portablePhp = path.join(root, '.tools/php/php.exe');
const php = process.env.PHP_BINARY || (existsSync(portablePhp) ? portablePhp : 'php');
const server = spawn(php, ['-d', 'opcache.enable_cli=1', '-S', '127.0.0.1:8001', '-t', '.', path.join(root, 'backend/vendor/laravel/framework/src/Illuminate/Foundation/resources/server.php')], {
  cwd: path.join(root, 'backend/public'),
  env: { ...process.env, APP_ENV: 'testing' },
  stdio: 'inherit',
  windowsHide: true,
});
server.on('error', error => { process.stderr.write(error.message + '\n'); process.exit(1); });
server.on('exit', code => process.exit(code ?? 0));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.kill());
