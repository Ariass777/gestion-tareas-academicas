// Servidor estático local para verificar el bundle de producción y su API real.
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../frontend/dist/frontend/browser');
const port = Number(process.env.PORT || 4300);
const backendPort = Number(process.env.BACKEND_PORT || 8001);
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
const server = http.createServer(async (req, res) => {
  if (req.url?.startsWith('/api/')) {
    const upstream = http.request({ hostname: '127.0.0.1', port: backendPort, path: req.url, method: req.method, headers: { ...req.headers, host: '127.0.0.1:' + backendPort } }, response => {
      res.writeHead(response.statusCode || 502, response.headers);
      response.pipe(res);
    });
    upstream.on('error', () => { res.writeHead(502, { 'content-type': 'application/json' }); res.end(JSON.stringify({ message: 'Backend no disponible' })); });
    req.pipe(upstream);
    return;
  }
  try {
    const url = new URL(req.url || '/', 'http://127.0.0.1');
    let target = path.resolve(root, '.' + decodeURIComponent(url.pathname));
    if (target !== root && !target.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
    try { if (!(await stat(target)).isFile()) target = path.join(root, 'index.html'); } catch { target = path.join(root, 'index.html'); }
    const bytes = await readFile(target);
    res.writeHead(200, { 'content-type': mime[path.extname(target)] || 'application/octet-stream', 'cache-control': 'no-cache' });
    res.end(bytes);
  } catch { res.writeHead(500); res.end('No se encuentra el frontend compilado. Ejecute npm run build.'); }
});
server.listen(port, '127.0.0.1', () => process.stdout.write('Frontend: http://127.0.0.1:' + port + '\n'));
