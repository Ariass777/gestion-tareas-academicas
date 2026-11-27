# Frontend Angular

Interfaz de Académica con Angular standalone, TypeScript estricto, formularios reactivos y HttpClient.

La instalación completa, MySQL, la API y los resultados están en [README principal](../README.md) y [validación](../docs/VALIDACION.md).

Desde esta carpeta:

```powershell
npm.cmd ci
npm.cmd start
npm.cmd test -- --watch=false
npm.cmd run test:ci
npm.cmd run typecheck
npm.cmd run build
```

El arranque usa el proxy configurado en `proxy.conf.json` para comunicarse con Laravel en 8000. Abrir http://127.0.0.1:4200. MySQL y Laravel deben estar iniciados previamente.

Las pruebas de navegador requieren preparar la base MySQL de pruebas siguiendo el README principal:

```powershell
npm.cmd run e2e
```
