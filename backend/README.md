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

Semana 10: [pruebas y cobertura](../docs/COBERTURA_Y_PRUEBAS_S10.md), [configuración CI](../docs/CI.md) y [despliegue local](../docs/GUIA_DESPLIEGUE_LOCAL.md). La cobertura PHP requiere Xdebug en modo coverage; CI prepara la extensión y conserva Clover/HTML/JUnit. No basta con el sufijo de la base: usar también una instancia/usuario exclusivo de pruebas sin permisos sobre desarrollo. Los avisos Symfony se corrigieron mediante parches autorizados y auditoría posterior; [estado y límites](../docs/SEGURIDAD_DEPENDENCIAS_S10.md).
