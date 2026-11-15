# Decisiones de implementación

Fuentes principales, consultadas antes de implementar:

- `Arteaga_Veronica_S3_Requisitos.docx`, versión 1.0, 24/10/2026.
- `Arteaga_Veronica_S4_Diseño.docx`, versión 1.0, 31/10/2026. Tiene precedencia arquitectónica.

Los documentos originales no se modifican. Se extrajo `word/document.xml` mediante ZIP y XML, incluidos párrafos de tablas.

SHA-256 original:

| Documento | SHA-256 |
| --- | --- |
| Semana 3 | `0EF75C469FDC3F9F877C35E042AA45E971204F9325615849B0268C530FBC8582` |
| Semana 4 | `B582F45CFC068119A72AB8FD17A8A5943FB1EA1D4AF2D0A305A7A829832626A9` |

## Arquitectura y alcance

Angular standalone con formularios reactivos y HttpClient → HTTP/JSON → Laravel API REST y Eloquent → MySQL. MySQL es la única fuente de verdad; no se usa localStorage. Demostración académica de un usuario sin autenticación, calendarios, IA, pagos o notificaciones push. El servidor de desarrollo escucha únicamente en loopback.

## Ambigüedades resueltas

- Título y descripción son obligatorios. El diseño permite «título o descripción», pero HU-07 exige rechazar una descripción vacía y el formulario necesita identificar la actividad por su título.
- Código de asignatura obligatorio, máximo 30 caracteres, sin exigir unicidad que los documentos no solicitan. Nombre máximo 150, título máximo 200 y descripción máximo 5000 caracteres.
- Una tarea nueva comienza en `Pendiente`. Estados válidos: `Pendiente`, `En progreso`, `Completada`. Se permite reabrir una tarea; intentar completar otra vez una ya completada devuelve 422 y el mensaje requerido. El control de concurrencia se realiza dentro de una transacción con bloqueo de la fila.
- La fecha se interpreta como día calendario de Colombia (`America/Bogota`). Al crear debe ser hoy o posterior. Al editar se puede conservar una fecha vencida; si se cambia por otra fecha, esta debe ser hoy o posterior.
- GET `/api/tareas` devuelve todas las tareas por fecha ascendente e id como desempate. El filtro opcional `estado` permite consultar pendientes y actividades en progreso. La interfaz ofrece todas las tareas y pendientes por separado; «Pendientes» significa estado `Pendiente` y «En progreso» tiene su propio resumen.
- Las claves foráneas restringen eliminar asignaturas con tareas. No se agrega un endpoint de eliminación de asignaturas, que está fuera del alcance.
- Respuestas exitosas con cuerpo: `{ "data": ... }`; errores: `{ "message": "...", "errors": {...} }`, con `errors` para validaciones. DELETE devuelve 204 sin cuerpo.
- El rendimiento se mide desde una navegación de navegador hasta que se muestran 200 filas obtenidas por HTTP desde MySQL. La medición se identifica como local y no constituye una garantía para otros equipos.
- Pruebas y rendimiento usan una base MySQL separada, cuyo nombre debe terminar en `_testing`. No se realizan borrados ni migraciones destructivas en bases existentes de la estudiante.

## Trazabilidad prevista

| Requisito | Implementación | Verificación |
| --- | --- | --- |
| HU-01 | Registro y lista de asignaturas | API MySQL y formulario |
| HU-02 | Registro de tareas, fecha y prioridad | API MySQL y formulario |
| HU-03 | Orden por fecha, vista de pendientes | API y navegador |
| HU-04 | Actualización de estado | API, concurrencia y navegador |
| HU-05 | Filtro de prioridad en API e interfaz | API y navegador |
| HU-06 | Confirmación y eliminación | API y diálogo de navegador |
| HU-07 | Edición con validación | API y formulario |
| HU-08 | Consulta HTTP tras recarga | Navegador y MySQL |
| RNF-01 | 200 tareas desde API y MySQL | Medición de navegador |
| RNF-02 | CSS adaptable | Navegador a 375 y 1920 px |
| RNF-03 | TypeScript estricto | Compilación Angular |
