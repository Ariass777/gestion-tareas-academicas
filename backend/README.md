# Backend Laravel

API REST de asignaturas y tareas sobre MySQL con Eloquent, Form Requests y JSON Resources. Arquitectura, instalación, variables de entorno y contratos HTTP: [README principal](../README.md).

Con las herramientas portátiles ya instaladas, desde esta carpeta:

```powershell
..\.tools\php\php.exe artisan migrate --no-interaction
..\.tools\php\php.exe artisan db:seed --no-interaction
..\.tools\php\php.exe artisan serve --host=127.0.0.1 --port=8000
```

Pruebas sobre una base independiente cuyo nombre termine en `_testing`:

```powershell
..\.tools\php\php.exe artisan migrate --env=testing --no-interaction
..\.tools\php\php.exe artisan test --compact
```

MySQL debe estar iniciado. Nunca copiar credenciales reales al repositorio. No se utiliza SQLite ni localStorage. Los datos de demostración se conservan al repetir el seeder.
