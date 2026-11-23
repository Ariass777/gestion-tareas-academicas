# Registro de pruebas — Semana 7

Fecha: 22/11/2026, America/Bogota. Proyecto: Sistema Web de Gestión de Tareas Académicas.

**Estado: fase final, tres mutaciones manuales detectadas y restauradas.** La sección 1 conserva el diseño; las secciones 2 y 4 registran la fase 2 y la sección 3 documenta las modificaciones temporales autorizadas, sus fallos observados, restauración y verificación final. No queda ninguna mutación en producción. La revisión personal de la estudiante y la confirmación del cliente no se presumen por el resultado de las suites.

**Interpretaciones provisionales indicadas para esta revisión académica:** A-01 exige nombre, código, título y descripción; A-02 propone transiciones entre estados diferentes; A-03 propone autoasignación en Pendiente/En progreso y rechaza Completada → Completada. A-04/A-05 permiten límites ASCII y textos sintéticos con tildes, ñ y apóstrofos, sin fijar esperados para Unicode ambiguo o máximos con recorte. Son propuestas académicas autorizadas para estas pruebas, no requisitos originales confirmados por el cliente. Los demás vacíos continúan pendientes.

## 1. Tabla de casos por función

### 1.1. Fuentes e inspección

Se leyeron los párrafos y tablas de los DOCX originales mediante su XML, sin modificarlos.

| Fuente | Apartados utilizados | Trazabilidad |
| --- | --- | --- |
| [Requisitos de Semana 3](docs/Arteaga_Veronica_S3_Requisitos.docx), v1.0, 24/10/2026 | §4, HU-01, HU-02, HU-04, HU-07 | Nombre obligatorio; fecha no pasada; completar una tarea pendiente; impedir completar de nuevo; descripción obligatoria al editar. |
| [Diseño de Semana 4](docs/Arteaga_Veronica_S4_Diseño.docx), v1.0, 31/10/2026 | §1, §4 ADR-001, §5 y §6 | Angular → Laravel → MySQL; estados permitidos; validación en API y respuestas HTTP. |
| [Decisiones de implementación](docs/DECISIONES.md) | «Arquitectura y alcance» y «Ambigüedades resueltas» | Ambos textos de tarea obligatorios, máximos, fecha colombiana, conservación de fecha vencida, reapertura y 422 al completar dos veces. Son decisiones documentadas anteriores, no nuevas aprobaciones humanas de estas tablas. |
| [README](README.md) | Decisiones, API y pruebas | PUT de formulario completo conserva estado; PATCH cambia estado; requisitos y comandos de las suites existentes. |

Precedencia: Semana 4 sustituye la persistencia local de Semana 3 por MySQL. Se usan los criterios de aceptación originales y las aclaraciones de `DECISIONES.md`, identificando sus diferencias en §1.8. El código sirve para localizar responsabilidades y riesgos; no determina por sí solo qué resultado sería correcto.

Los SHA-256 de los DOCX coinciden con `docs/DECISIONES.md`: S3 `0EF75C469FDC3F9F877C35E042AA45E971204F9325615849B0268C530FBC8582`; S4 `B582F45CFC068119A72AB8FD17A8A5943FB1EA1D4AF2D0A305A7A829832626A9`.

**Git, antecedente de fase 1:** al comenzar, `main`, commit `6646a0a`, árbol limpio. No existía `semana-7-pruebas` entre las ramas locales ni referencias remotas disponibles. Se creó desde ese commit y se seleccionó para esta entrega. En esa primera fase no se hizo fetch, commit ni publicación.

Inventario histórico de fase 1 por lectura estática, anterior a las ejecuciones de fase 2:

| Herramienta instalada | Archivos y configuración | Pruebas existentes inspeccionadas |
| --- | --- | --- |
| Vitest 5.1.0 / Angular 22.2.6 | `frontend/angular.json`: `@angular/build:unit-test`; `frontend/package.json`: `ng test`. `frontend/src/app/config/fechas.spec.ts` (3), `app.component.spec.ts` (1), `components/field-error.component.spec.ts` (1), `services/notificaciones.service.spec.ts` (3). | 8 declaraciones: texto blanco/válido, día colombiano, ayer/hoy, edición vencida, navegación y mensajes/errores HTTP. No cubren todas las particiones ni máximos. |
| PHPUnit 12.5.44 / Laravel 13.42.0 | `backend/phpunit.xml`; `backend/tests/Feature/AcademicApiTest.php` (21 métodos), `TestDatabaseSafetyTest.php` (7); `backend/tests/TestCase.php`. `backend/tests/Unit/` está vacía. | 28 métodos: API/MySQL, fechas, texto, estados, integridad y guardias. Cubren completar dos veces y reabrir a Pendiente; falta matriz exhaustiva y todos los límites. Son Feature, no 28 unidades puras. |
| Playwright 1.56.0 | `frontend/e2e/academica.spec.ts` (10 declaraciones), `frontend/playwright.config.ts`. | Formularios, persistencia, estados, filtros, eliminación, rendimiento, adaptación, HTML como texto y fecha en Tokio. Solo el caso explícito de vacíos/error simula respuestas. Chromium, puertos 4300/8001, un worker; fixtures previos de 200 tareas. |
| Node test runner | `scripts/serve-backend.test.mjs` | 3 combinaciones de configuración insegura del servidor E2E. Se conserva. |
| pytest | No se localizaron pruebas Python/configuración pytest en el proyecto inspeccionado, excluyendo dependencias. | No se verificó instalación funcional de Python/pytest. El alias `python.exe` de Windows no la demuestra. |

Versiones consultadas en paquetes instalados y `composer show --direct`. Los conteos son inventario, no resultados actuales. Los informes históricos de `docs/` no se presentan como ejecuciones de esta fase.

### 1.2. Tres reglas y sus unidades reales

| ID | Función o regla seleccionada | Ubicaciones y métodos reales | Dependencias y aislamiento |
| --- | --- | --- | --- |
| R-F | Fecha válida y no pasada, con excepción al conservar la original | `frontend/src/app/config/fechas.ts`: `fechaNoPasada(fechaOriginal?)`, `hoyColombia()`. `frontend/src/app/components/tarea-form.component.ts`: `form`, constructor, `fechaMinima()`, `enviar()`. `backend/app/Http/Requests/SaveTareaRequest.php`: `rules()`, `messages()`. | Helper invocable directamente con `FormControl`, sin DOM/HTTP/BD; depende de reloj e `Intl.DateTimeFormat` de Colombia. El formulario agrega `Validators.required`. Laravel agrega formato/calendario y depende de solicitud, reloj/zona y tarea enlazada a ruta con cast de fecha. La solicitud completa incluye `exists` de asignatura y necesita BD. |
| R-T | Textos obligatorios y límites de cada campo | `frontend/src/app/config/fechas.ts`: `textoObligatorio`. `components/tarea-form.component.ts`: `form`, `enviar()`. `pages/asignaturas/asignaturas.component.ts`: `form`, `guardar()`. `backend/app/Http/Requests/SaveTareaRequest.php`, `StoreAsignaturaRequest.php`: `rules()`, `messages()`. | Helper directamente unitario: tipo/contenido con `trim()`, sin máximo ni mutación del control. Máximos en `Validators.maxLength` y Laravel. Envío Angular recorta; API usa middleware global `TrimStrings` y `ConvertEmptyStringsToNull`, comprobado en el framework instalado y sin exclusiones en `backend/bootstrap/app.php`. Invocar solo `rules()` no ejecuta middleware. |
| R-E | Validación y transición de estados | `backend/app/Http/Requests/UpdateEstadoRequest.php`: `rules()`, `messages()`. `backend/app/Http/Controllers/Api/TareaController.php`: `estado()`, con `store()`/`update()` para creación/edición. `backend/app/Models/Tarea.php`: `ESTADOS`. `frontend/src/app/pages/tareas/tareas.component.ts`: `cambiarEstado()`, `seleccionarEstado()`, y su plantilla. `services/academico.service.ts`: `cambiarEstado()`. | Catálogo validable con fábrica Laravel sin BD. La transición no está extraída como función pura: usa `DB::transaction`, Eloquent, `lockForUpdate()->findOrFail()`, guardado y recurso JSON. Una unidad con dobles verifica interacciones; PHPUnit Feature/MySQL verifica persistencia. El componente con dobles de HTTP/ruta/notificaciones no demuestra bloqueo real. |

Dependencias comunes: `backend/routes/api.php` (rutas/enlace de modelo), `backend/bootstrap/app.php` (errores JSON), `backend/config/app.php` (`APP_TIMEZONE`, predeterminada Colombia), modelos/recursos y migraciones. `backend/database/migrations/2026_11_14_164138_create_tareas_table.php` fija el enum de estados y `Pendiente` por defecto. No hay actualmente una función pura PHP independiente de transición.

### 1.3. Convenciones de los casos

- Base: `H = 2026-11-22`, reloj fijo `2026-11-22T15:00:00Z` (10:00 Colombia), salvo indicación. `O = 2026-11-20` es original vencida. Los esperados se fijan desde requisitos/calendario; no se calculan llamando a la función que se prueba.
- Salvo indicación, los otros campos son válidos y asignatura/tarea existen en BD exclusiva de pruebas. Obtener IDs de fixtures; no presuponer `id=1`. Cada caso cambia un factor, excepto combinaciones explícitas.
- «Aceptar» significa que la regla estudiada no impide la operación. API: POST válido 201; PUT/PATCH válido 200; validación inválida 422 con `errors[campo]`, sin crear ni cambiar registros. Las pruebas futuras comprobarán también ausencia de efectos.
- Angular devuelve `null` o errores como `{ required: true }`/`{ pasada: true }`, no excepciones por datos inválidos. Laravel FormRequest inválido produce `Illuminate\Validation\ValidationException` al resolver la solicitud, renderizada como 422. Una fábrica de validación con `fails()` devuelve booleano/errores; no lanza automáticamente esa excepción.
- `TareaController::estado()` lanza explícitamente `ValidationException` por doble finalización. Recurso inexistente: `Illuminate\Database\Eloquent\ModelNotFoundException` en resolución/consulta y 404 en API, no error 422 de contenido.
- Exigir mensajes literales donde los DOCX los establecen; para otros errores comprobar campo/categoría y no inventar un texto obligatorio dependiente del idioma del framework.
- Capas propuestas: **U** unidad Angular directa; **C** componente/formulario Angular; **V** validación Laravel aislada de persistencia; **I** API/MySQL. V ejecuta reglas reales obtenidas de producción, no una copia escrita en el test.

### 1.4. R-F — Validación de fechas

**Regla completa.** HU-02 exige fecha y rechaza pasado. Semana 4 modela un día calendario. `DECISIONES.md` precisa Colombia y la excepción de HU-07: en alta aceptar hoy/futuro; al editar permitir conservar exactamente la fecha persistida, incluso vencida; cualquier fecha distinta debe ser hoy/futura. La API recibe un día existente en formato `AAAA-MM-DD`. Ausencia, tipo incorrecto, fecha imposible o formato incorrecto se rechazan antes de comparar. Se propone formato canónico con cuatro dígitos de año; los extremos de almacenamiento requieren A-06.

Mensaje HU-02 para pasada no exceptuada: `La fecha de entrega no puede ser anterior a hoy`.

**Particiones de equivalencia**

| Partición | Representante/contexto | Esperado completo |
| --- | --- | --- |
| F-P1 válida | Hoy `2026-11-22` o futuro `2026-11-23`; alta/nueva fecha | Aceptar. |
| F-P2 inválida | `2026-11-21`; alta o edición con original distinta | Rechazar por pasada. |
| F-P3 válida excepcional | Editar O=`2026-11-20` conservando O | Aceptar fecha vencida original. |
| F-P4 inválida | Campo omitido, null, cadena vacía | Rechazar obligatoriedad. |
| F-P5 inválida | `22/11/2026`, `2026-11-2`, fecha con hora, `abc` | Rechazar formato. |
| F-P6 inválida | `2026-02-29`, `2026-11-31`, mes 00/13, día 00 | Rechazar calendario/formato. |
| F-P7 inválida | Número, booleano, lista, objeto | Rechazar tipo/formato; sin coerción a fecha. |
| F-P8 por aclarar | Año fuera de rango MySQL, espacios exteriores | A-06/A-04: no automatizar aceptación todavía. |

**Valores límite y vecinos**

| Frontera | Vecino inferior | Límite | Vecino superior | Esperado |
| --- | --- | --- | --- | --- |
| Hoy, alta/nueva fecha | `2026-11-21` | `2026-11-22` | `2026-11-23` | Rechazar / aceptar / aceptar. |
| Igualdad con O vencida | `2026-11-19` | `2026-11-20` | `2026-11-21` | Rechazar / aceptar / rechazar, editando con H base. Excepción puntual, no rango O…H. |
| Medianoche Colombia | `2026-11-23T04:59:59Z` | `2026-11-23T05:00:00Z` | `2026-11-23T05:00:01Z` | Para entrega nueva del 22: aceptar / rechazar / rechazar. H cambia de 22 a 23. |
| Fin de año, H=2026-12-31 | `2026-12-30` | `2026-12-31` | `2027-01-01` | Rechazar / aceptar / aceptar. |
| Febrero bisiesto, H=2028-02-28 | `2028-02-28` | `2028-02-29` | `2028-03-01` | Los tres días existen y son aceptables. Contrastar 29/02 no bisiesto. |

No hay máximo de días futuros documentado; no inventarlo ni confundir «hoy» con el rango de almacenamiento.

**Casos diseñados**

| ID | Entradas y precondiciones | Resultado esperado | Capa |
| --- | --- | --- | --- |
| F-01 | Alta, fecha H−1=`2026-11-21` | `{ pasada: true }`; API 422 y mensaje HU-02. | U, V, I |
| F-02 | Alta, H=`2026-11-22` | `null`; API 201. | U, V, I |
| F-03 | Alta, H+1=`2026-11-23` | `null`; API 201. | U, V, I |
| F-04 | Editar, original O vencida, entrada O | `null`; 200; conserva O. | U, V, I |
| F-05 | Editar O, entrada O−1=`2026-11-19` | `{ pasada: true }`; 422; conserva O en BD. | U, V, I |
| F-06 | Editar O, entrada O+1=`2026-11-21` | Igual rechazo: acercar una fecha vencida a hoy no basta. | U, V, I |
| F-07 | Editar O, entrada H y H+1, separadamente | `null`; 200, nueva fecha persistida. | U, V, I |
| F-08 | Original hoy/futura, conservarla; casos separados | `null`; 200. | U, V, I |
| F-09 | Alta/edición: omitir, null, vacío, por separado | Rechazo obligatorio/422. En formulario exigir `Validators.required`; ese error no corresponde al helper `fechaNoPasada` aislado. | C, V, I |
| F-10 | `22/11/2026`, `2026-11-2`, `2026-11-22T10:00:00-05:00`, `abc` | 422 en fecha; sin persistir. Fuera del contrato ISO válido del comparador aislado. | V, I |
| F-11 | `2026-11-31`, `2026-00-22`, `2026-13-22`, `2026-11-00` | 422; no normalizar a otro día. | V, I |
| F-12 | H=2028-02-28; 28/02, 29/02, 01/03 de 2028; complementar H=2027-02-28 y `2027-02-29` | Tres aceptadas en 2028; 422 por fecha inexistente en 2027. | V, I; U solo fechas válidas |
| F-13 | Tres instantes de medianoche de la tabla; entrega del 22 | H esperado 22/23/23; aceptar/rechazar/rechazar. | U, V, I |
| F-14 | Instante `2026-11-23T04:59:59Z`; navegador UTC/Tokio/Colombia | `hoyColombia()`=`2026-11-22` en todos; entrega del 22 aceptada. | U; navegador complementario |
| F-15 | H=2026-12-31; fechas 30/12, 31/12, 01/01/2027 | Rechazar/aceptar/aceptar. | U, V |
| F-16 | JSON fecha=42, true, [], {}, por separado | 422 en fecha; sin error interno 500 ni mutación. | V, I |
| F-17 | Formulario abierto antes de medianoche; enviar después una fecha nueva del día anterior | Recalcular H y rechazar, aunque fuera válida al abrir. | C |

**Tabla de decisión completa de la combinación temporal**

Puerta previa: si no hay fecha presente, de tipo/formato/calendario válido, rechazar antes de comparar. Después: E=edición; S=conserva original (solo posible en edición); P=fecha anterior a H. Se enumeran las ocho combinaciones booleanas, incluidas las imposibles.

| Columna | E | S | P | Acción esperada | Caso |
| --- | --- | --- | --- | --- | --- |
| D1 | No | No | No | Aceptar. | F-02/F-03 |
| D2 | No | No | Sí | Rechazar por pasada. | F-01 |
| D3 | No | Sí | No | Imposible: en alta no hay original. | No crear datos artificiales. |
| D4 | No | Sí | Sí | Imposible por la misma razón. | No crear datos artificiales. |
| D5 | Sí | No | No | Aceptar nueva fecha. | F-07 |
| D6 | Sí | No | Sí | Rechazar por pasada. | F-05/F-06 |
| D7 | Sí | Sí | No | Aceptar original hoy/futura. | F-08 |
| D8 | Sí | Sí | Sí | Aceptar original vencida. | F-04 |

**Simplificación**, conservando la puerta previa. «—»=irrelevante; N/E=no evaluada.

| Regla | Fecha válida/presente | P | S | E | Acción |
| --- | --- | --- | --- | --- | --- |
| DS1 | No | N/E | N/E | — | Rechazar obligatoriedad/tipo/formato/calendario. |
| DS2 | Sí | No | — | — | Aceptar. |
| DS3 | Sí | Sí | No | — | Rechazar por pasada. |
| DS4 | Sí | Sí | Sí | Sí | Aceptar conservación de original vencida. |

S implica E. Las seis combinaciones factibles quedan cubiertas sin contradicción. Aceptar esta regla no omite validar los demás campos.

### 1.5. R-T — Textos obligatorios

**Regla completa.** HU-01 rechaza nombre en blanco; HU-07 rechaza descripción vacía al editar. Las decisiones documentadas exigen nombre, código, título y descripción no vacíos en sus operaciones respectivas. Un texto debe contener al menos un carácter de contenido tras eliminar blancos exteriores; ausencia, null, vacío, solo blancos o tipo distinto de cadena son inválidos. Conservar acentos, signos y espacios interiores; no inventar unicidad ni una expresión regular de caracteres permitidos. El recorte al guardar está documentado/implementado; el criterio de longitud antes/después del recorte requiere A-04.

| Campo | Mínimo de contenido | Máximo M documentado | Operación |
| --- | --- | --- | --- |
| nombre | 1 carácter no blanco | 150 | POST asignatura |
| codigo | 1 carácter no blanco | 30 | POST asignatura |
| titulo | 1 carácter no blanco | 200 | POST/PUT tarea |
| descripcion | 1 carácter no blanco | 5000 | POST/PUT tarea |

Mensajes exigidos por HU-01/HU-07: `El nombre de la asignatura es obligatorio` y `La descripción no puede estar vacía`. No atribuir a los DOCX mensajes literales de máximos, título o código que no especifican.

**Particiones de equivalencia**

| Partición | Representantes | Esperado del helper | Esperado completo |
| --- | --- | --- | --- |
| T-P1 válida | `A`, `Ingeniería de Software`, `IS-06` | `null` | Aceptar si longitud ≤ M. |
| T-P2 válida con espacios externos | `"  Informe  "` | `null`, sin alterar el control | Aceptar y guardar `Informe`, sin acercarse a máximos en este caso. |
| T-P3 inválida por ausencia | Omitido, null, vacío | `{ required: true }` para valores invocados; omisión se prueba en API | Rechazar/422. |
| T-P4 inválida por blanco | `" "`, `"   "`, `"\t\r\n"` | `{ required: true }` | Rechazar/422. |
| T-P5 inválida por tipo | 0, 42, false, true, [], {}, `{"length":1}` | `{ required: true }` | Rechazar/422; no convertir a texto. |
| T-P6 inválida por exceso | M+1 repeticiones de `A` | `null`: el helper no comprueba máximos | Rechazar con maxLength/max. |
| T-P7 válida literal | `Informe <b>final</b>`, apóstrofes y acentos, dentro de M | `null` | Admitir como texto; la presentación segura pertenece a pruebas XSS existentes. |
| T-P8 por aclarar | Solo NBSP U+00A0, ancho cero U+200B, emojis cerca de M | A-05 | Acordar política Unicode antes de fijar resultado. |

**Valores límite y vecinos**

Usar repeticiones ASCII de `A`, sin espacios exteriores, para medir inequívocamente hasta resolver A-04/A-05.

| Campo | Límite inferior y vecinos | Vecinos del máximo | Esperado completo |
| --- | --- | --- | --- |
| nombre | Longitudes 0, 1, 2 | 149, 150, 151 | 0 rechazar; 1/2 y 149/150 aceptar; 151 rechazar. |
| codigo | 0, 1, 2 | 29, 30, 31 | 0 rechazar; 1/2 y 29/30 aceptar; 31 rechazar. |
| titulo | 0, 1, 2 | 199, 200, 201 | 0 rechazar; 1/2 y 199/200 aceptar; 201 rechazar. |
| descripcion | 0, 1, 2 | 4999, 5000, 5001 | 0 rechazar; 1/2 y 4999/5000 aceptar; 5001 rechazar. |

Longitud negativa no es una entrada realizable. M espacios siguen siendo inválidos por falta de contenido aunque no excedan el máximo.

**Casos diseñados**

| ID | Entradas y precondiciones | Resultado esperado | Capa |
| --- | --- | --- | --- |
| T-01 | Helper con vacío, un espacio, varios espacios, `"\t\r\n"`, por separado | `{ required: true }`, sin excepción. | U |
| T-02 | Helper con null, undefined, 0, 42, false, true, [], {}, `{"length":1}`, por separado | `{ required: true }`, sin excepción. Preservar el valor bruto al preparar el control de prueba. | U |
| T-03 | `A`, `AA`, `Ingeniería`, `IS-06`, por separado | `null`. | U |
| T-04 | Validar control con `"  Informe  "` y leerlo después | `null`; el control mantiene los espacios exteriores. Validar no normaliza. | U |
| T-05 | Enviar `"  Informe  "` y `"Informe  final"`, por separado | Guardar `Informe` y `Informe  final`; conservar espacios interiores. | C, I |
| T-06 | Omitir cada texto obligatorio, separadamente; otros campos válidos | 422 en ese campo; ningún registro nuevo/cambio parcial. POST asignatura y POST/PUT tarea según campo. | I |
| T-07 | Cada campo con null, vacío, blancos ASCII, por separado | Rechazar obligatoriedad/422; mensajes HU-01/HU-07 para nombre/descripción. | C para cadenas; I |
| T-08 | Cada campo con 42, false, [], {}, por separado | 422 en ese campo; sin conversión ni guardado. | V, I |
| T-09 | Cada campo con longitudes 0, 1, 2, M−1, M, M+1 de su tabla | Resultado de la tabla. Ejecutar composición real de validadores del formulario y reglas reales de API; no exigir máximos al helper aislado. | C, V, I |
| T-10 | Cada campo con M espacios ASCII | Rechazo por contenido vacío. | U, C, I |
| T-11 | Tarea: título válido/descripción vacía; después título vacío/descripción válida | Rechazar el campo vacío en ambos casos, según decisiones existentes; conflicto A-01. Repetir en alta y edición. | C, I |
| T-12 | Tarea: título y descripción vacíos simultáneamente | 422 con ambos en `errors`; no depender del primer campo de `message`. | I |
| T-13 | Editar descripción con espacios conservando O vencida | 422 por descripción; la excepción de fecha no permite guardar datos inválidos ni modificar parcialmente. | C, I |
| T-14 | Texto con apóstrofes, acentos o etiquetas literales, dentro de M | Aceptar como texto, sin truncamiento silencioso. | U, I |
| T-15 | M letras más espacios externos que producen longitud bruta > M | Expectativa suspendida hasta A-04; posible diferencia frontend/backend. | C, I tras aclaración |
| T-16 | NBSP/ancho cero y emojis cerca de M | Expectativa suspendida hasta A-05. | U, C, I tras aclaración |

### 1.6. R-E — Estados de tareas

**Regla completa.** HU-04 permite Pendiente → Completada e impide completar nuevamente una tarea completada, con `La tarea ya fue completada`; la interfaz deshabilita la acción. Semana 4 y `DECISIONES.md` fijan el catálogo `Pendiente`, `En progreso`, `Completada` y permiten reabrir. Las nuevas tareas comienzan en Pendiente. PUT modifica los cinco campos del formulario conservando estado; PATCH de estado exige un destino válido. Los rechazos no cambian el registro. No todos los pares ni las autoasignaciones están expresos en requisitos; se propone su interpretación para revisión, sin afirmar aprobación humana.

**Particiones de equivalencia y fronteras del dominio**

| Partición | Entrada/contexto | Resultado esperado |
| --- | --- | --- |
| E-P1 válida explícita | Pendiente → Completada | 200, actualizar. |
| E-P2 válida documentada | Completada → Pendiente | 200, reabrir. |
| E-P3 válida propuesta | Otros cambios entre valores distintos del catálogo | 200; interpretación A-02 pendiente. |
| E-P4 inválida explícita | Completada → Completada | ValidationException/422 y mensaje HU-04; conservar estado. |
| E-P5 por aclarar | Pendiente → Pendiente, En progreso → En progreso | Propuesta 200 sin cambio del valor; A-03. |
| E-P6 inválida | Otro, pendiente, En Progreso, 1, true, [], {} | 422 en estado; sin persistencia. |
| E-P7 inválida | Omitido, null, vacío, solo espacios | 422 por obligatoriedad. |
| E-P8 recurso ausente | Tarea inexistente y destino válido | 404; no crear tarea. |

Los estados son un conjunto nominal, sin orden numérico: no hay «estado −1», «Completada +1» ni vecinos aritméticos. Sus fronteras son pertenencia al catálogo, presencia/tipo, igualdad origen/destino y existencia del recurso. Probar los tres miembros y representantes externos; no inventar valores límite numéricos.

**Matriz exhaustiva de los nueve pares del catálogo**

| ID | Origen | Destino | Resultado esperado propuesto | Base |
| --- | --- | --- | --- | --- |
| E-01 | Pendiente | Pendiente | 200, Pendiente sin cambio. | A-03 pendiente. |
| E-02 | Pendiente | En progreso | 200, En progreso. | Progreso/catálogo; A-02. |
| E-03 | Pendiente | Completada | 200, Completada. | HU-04 escenario 1. |
| E-04 | En progreso | Pendiente | 200, Pendiente. | Interpretación de cambios; A-02. |
| E-05 | En progreso | En progreso | 200, En progreso sin cambio. | A-03 pendiente. |
| E-06 | En progreso | Completada | 200, Completada. | Progreso/catálogo; A-02. |
| E-07 | Completada | Pendiente | 200, Pendiente. | Reapertura en DECISIONES. |
| E-08 | Completada | En progreso | 200, En progreso. | Interpretación de reapertura; A-02. |
| E-09 | Completada | Completada | 422, mensaje HU-04; estado intacto. | HU-04 escenario 2/DECISIONES. |

La matriz cubre todos los pares tras comprobar tarea existente y destino válido. No se deriva copiando los condicionales del controlador. Los datos externos al catálogo se cubren aparte.

**Casos adicionales diseñados**

| ID | Entradas y precondiciones | Resultado esperado | Capa |
| --- | --- | --- | --- |
| E-10 | PATCH estado omitido, null, vacío, espacios, por separado; tarea existente | 422 en estado; registro intacto. | V, I |
| E-11 | PATCH estado Otro, pendiente, En Progreso, 1, true, [], {}, por separado | 422; sin mutación ni 500. | V, I |
| E-12 | PATCH identificador inexistente, destino Completada válido | 404; no crea recursos. | I |
| E-13 | POST tarea válido sin estado | 201, Pendiente persistido. | I |
| E-14 | POST y PUT formulario con estado explícito no vacío Completada | 422 en estado; usar PATCH; sin creación/cambio. Valores vacíos requieren A-08. | I |
| E-15 | PUT válido sobre tarea En progreso y sobre Completada, sin campo estado | 200; estado original conservado en cada caso. | I |
| E-16 | Tarea completada en listado | Botón completar deshabilitado y mensaje HU-04 visible; API directa sigue rechazando doble finalización. | C, Playwright, I |
| E-17 | Dos finalizaciones concurrentes de una tarea Pendiente, sin reapertura intermedia | Una 200 y otra 422, sin fijar cuál gana; final Completada. Conexiones/procesos independientes y coordinación real. | I de concurrencia |
| E-18 | Falla PATCH; componente tenía Pendiente | No mostrar Completada como cambio confirmado; mostrar error y permitir nueva consulta. | C con doble HTTP |

E-01…E-09 se comprobarán por API/MySQL; probar solo el catálogo no demuestra transición. E-17 no se demuestra con peticiones secuenciales ni con una sola conexión dentro de la transacción exterior de `DatabaseTransactions`.

### 1.7. Riesgos de inspección, sin resultados de ejecución

- `fechaNoPasada` compara cadenas y no valida formato/calendario. Su contrato de entrada ISO válida permite unidades directas; la regla completa necesita otras capas. F-10/F-11 no deben presentarse como cobertura conseguida por probar solo ese comparador.
- El helper de texto no comprueba máximos; ejecutar composición del formulario y reglas API para cubrirlos.
- El frontend comprueba máximos antes del recorte al enviar; Laravel recorta antes de validar. Posible divergencia en máximos con espacios externos (A-04), no un fallo reproducido en esta fase.
- JavaScript y PHP pueden medir distinto los caracteres Unicode (A-05).
- Validar un array de reglas con datos brutos no ejecuta el middleware HTTP de normalización.
- Los mocks de BD no demuestran bloqueo real; las pruebas secuenciales y la inspección no certifican concurrencia.

### 1.8. Ambigüedades para revisión de la estudiante

| ID | Diferencia o vacío | Propuesta/efecto en siguiente fase |
| --- | --- | --- |
| A-01 | S4 §5 dice título **o** descripción; HU-07 exige descripción. El ejemplo de API S4 la omite. DECISIONES exige ambos. | Adoptar ambos obligatorios en alta/edición conforme a la aclaración existente. Revisar reconciliación; no modificar DOCX ni declarar suficiente el ejemplo. Afecta T-11. |
| A-02 | Solo se detalla Pendiente → Completada; catálogo/reapertura no enumeran todos los pares. | Proponer cambios entre estados distintos; confirmar especialmente En progreso → Pendiente y Completada → En progreso. |
| A-03 | Autoasignación Pendiente/En progreso sin respuesta definida; doble finalización sí está prohibida. | Proponer 200 sin cambio del valor para las primeras; 422 para doble finalización. No inventar requisitos sobre timestamps. |
| A-04 | Longitud antes/después de recorte; normalización de fecha/estado con espacios externos sin definición explícita. | Límites base sin espacios; suspender T-15 y formatos con espacios. Propuesta de textos: medir contenido recortado, pendiente; no cambiar producción ahora. |
| A-05 | «Carácter» y «blanco» no especifican UTF-16, puntos de código, grafemas, NBSP o ancho cero. | ASCII en límites y acentos comunes en aceptación; acordar Unicode antes de T-16. No calcular esperado usando `.length` de producción. |
| A-06 | Sin horizonte máximo ni rango de años explícito. Formato canónico y rango MySQL son distintos. | No inventar días máximos. Acordar rango y rechazo 422 antes de casos extremos de año; un 500 SQL no es validación correcta. |
| A-07 | HU-02 rechaza pasado; HU-07 no especifica edición de vencidas. | Usar excepción puntual ya documentada en DECISIONES, con H colombiano; no habilita cualquier pasado ni depende del estado. |
| A-08 | Estado va por PATCH, pero `prohibited` de Laravel puede tratar valores vacíos como ausencia. | E-14 usa valor no vacío. Acordar rechazo de cualquier presencia, incluso null/vacío/[], antes de exigirlo. |
| A-09 | Se exige pytest/`tests`, pero las reglas son TS/PHP y falta criterio docente de adaptación. | Proponer orquestación transparente. No declarar aceptación docente a partir de esta inspección. |
| A-10 | Se proporcionaron cuatro secciones de plantilla, sin copia oficial localizada en el repositorio inspeccionado. | Respetar los cuatro apartados indicados; no inventar campos oficiales adicionales. |

La sustitución de localStorage por MySQL ya está explícita en ADR-001 de S4; no reintroducir persistencia local para probar la versión anterior de HU-08.

### 1.9. Propuesta técnica de herramientas

**Propuesta histórica de fase 1.** La fase 2 implementa las pruebas nativas descritas abajo; los resultados se registran en §4.3. Playwright se conserva y el wrapper pytest continúa como propuesta sin implementar. No se reescriben reglas en Python.

| Nivel | Trabajo futuro propuesto | Alcance y limitaciones |
| --- | --- | --- |
| Vitest, unidades | Ampliar `frontend/src/app/config/fechas.spec.ts`, importando los tres helpers reales. Fijar reloj con `vi.useFakeTimers()`/`vi.setSystemTime()` y restaurarlo después de cada caso. | Prueba retornos conocidos sin servidor. No demuestra middleware/BD ni conexión correcta del formulario. |
| Vitest, componentes | TestBed sobre `TareaFormComponent` y formulario de asignaturas, con dobles de dependencias externas. | Prueba composición real, máximos, no emisión al fallar y recorte al enviar. No construir un formulario alternativo en el test que duplique la configuración dejando el real sin probar. |
| PHPUnit, validación sin BD | Agregar pruebas en `backend/tests/Unit/` usando reglas obtenidas de `StoreAsignaturaRequest`, `UpdateEstadoRequest` y el subconjunto fecha/textos de `SaveTareaRequest`. Resolver ruta con una tarea en memoria y usar fábrica real Laravel. | Prueba de componente con framework, no función PHP pura. Excluir expresamente el `exists` de asignatura en esos casos y no afirmar cobertura de FK. Obtener reglas no equivale a ejecutarlas; el middleware tampoco corre implícitamente. |
| PHPUnit, integración | Ampliar Feature o agregar archivos equivalentes; mantener anteriores. Reloj controlado/restaurado y MySQL dedicado. | Comprueba solicitudes, middleware, enlace de modelo, errores, persistencia y ausencia de efectos. E-17 necesita conexiones independientes, fixtures confirmados y limpieza específica; no basta `DatabaseTransactions`. |
| Playwright | Conservar los diez casos; agregar únicamente recorridos necesarios tras aprobación. | E2E e integración, no unidades. No repetir todos los límites por navegador. Mantener requisitos de bundle/fixtures. |
| pytest si es obligatorio | Crear después de aprobación `tests/` en raíz con orquestadores, por ejemplo `test_reglas_frontend.py` y `test_reglas_backend.py`, que lancen runners nativos reales. | pytest mide orquestación; no convierte TS/PHP en unidades Python. No importar TS/PHP como módulos Python ni duplicar sus reglas para obtener un verde. |

La [documentación oficial de Vitest sobre fechas](https://vitest.dev/guide/mocking/dates) respalda el control/restauración del reloj. La [documentación de pytest sobre invocación](https://docs.pytest.org/en/stable/how-to/usage.html) describe el descubrimiento de pruebas Python. La [documentación de subprocess](https://docs.python.org/3/library/subprocess.html) permite lanzar comandos, capturar salidas y establecer directorio, timeout y control de códigos de salida. Su combinación como orquestador es una propuesta de adaptación para este proyecto, no garantía de aceptación académica.

Comandos propuestos en fase 1. Las ejecuciones reales de Vitest/PHPUnit en fase 2 se detallan en §4.3; Playwright, Node y pytest continúan sin ejecutarse en esta fase:

| Directorio | Comando | Alcance |
| --- | --- | --- |
| `frontend/` | `npm.cmd test -- --watch=false` | Angular/Vitest existente y ampliaciones aprobadas. |
| `backend/` | `..\.tools\php\php.exe vendor/bin/phpunit` | Suites nativas con bootstrap/configuración del proyecto. |
| `frontend/` | `npm.cmd run e2e` | Playwright, después de preparar bundle y fixtures. |
| Raíz | `node --test scripts/serve-backend.test.mjs` | Guardia Node existente. |
| Raíz, futuro | `python -m pytest tests -v` | Requiere verificar Python, instalar pytest en entorno de pruebas y crear orquestadores aprobados. |

Diseño del wrapper: resolver rutas desde raíz, ejecutar una vez por suite y sin watch, guardar stdout/stderr/código de salida, fijar timeout y fallar si falta runner, falla el proceso, vence timeout o no se selecciona ningún caso. Conservar reportes nativos para comprobar casos realmente recolectados/ejecutados; buscar la palabra «passed» no basta. En Windows se propone invocar CLI JavaScript local mediante `node.exe` y ruta verificada, y PHPUnit mediante PHP real, evitando dificultades de lanzar `.cmd` con subprocess. No interpolar datos de usuario en comandos.

Los nuevos nombres de prueba incluirán IDs F-xx/T-xx/E-xx: requisito → ID → prueba parametrizada → runner → resultado. Un caso pytest que lanza 50 pruebas nativas no se reportará como 50 unidades Python; conservar ambos conteos. La cobertura, si se requiere después, se medirá en TS/PHP con herramientas nativas; cobertura Python del wrapper no mide reglas de producción. No se declara porcentaje de cobertura ahora.

No ocultar suites obligatorias con skips para conseguir aprobación. Si falta infraestructura, registrar «no ejecutada por entorno» y la causa real. Mantener Playwright separado de las unidades salvo requisito expreso de orquestarlo.

Para pruebas I/Playwright, conservar `App\Support\TestDatabaseSafety::assertSafe()`: MySQL, entorno `testing`, `.env.testing` explícito, `DB_URL` vacío, nombre terminado en `_testing` y rechazo de caché de configuración. Verificar destino dedicado: el sufijo no demuestra que la base esté vacía. No usar datos de desarrollo ni migraciones destructivas. Concurrencia y fixtures E2E necesitan preparación/limpieza propia en bases de pruebas.

## 2. Pruebas de IA corregidas o descartadas

Revisión realizada por **Codex**, 22/11/2026, sobre las interpretaciones provisionales recibidas. No se atribuye a la estudiante una revisión de archivos, ejecución o aprobación de resultados que no haya comunicado. Los booleanos y códigos esperados están fijados en las tablas/proveedores; las pruebas no llaman a producción para calcular su propio oráculo.

### 2.1. Archivos generados y alcance

| Archivo | Responsabilidad |
| --- | --- |
| `frontend/src/app/config/semana7-reglas.spec.ts` | `test.each()` sobre `fechaNoPasada`, `hoyColombia` y `textoObligatorio`; reloj fijo/restaurado, contenido y tipos, sin copiar validadores. |
| `frontend/src/app/components/semana7-formularios.spec.ts` | Formularios de producción obtenidos por `FormGroupDirective` en TestBed: límites reales, obligatoriedad, no emisión, recorte y cambio de día al enviar. No accede a métodos protegidos ni construye formularios alternativos. |
| `frontend/src/app/pages/tareas/semana7-estados.spec.ts` | Componente real: finalización deshabilitada y respuesta HTTP fallida. Subject simula respuesta pendiente/error, sin sustituir reglas de estados. |
| `backend/tests/Semana7Data.php` | Proveedores sintéticos compartidos con nombres F/T/E; oráculos tabulados. Datos de prioridad P-01/P-02 complementan las precondiciones de creación. |
| `backend/tests/Unit/Semana7ValidationTest.php` | Ejecuta reglas obtenidas de FormRequest con Validator real. Aísla campo relevante y excluye FK. Usa framework; no se presenta como función PHP pura ni como prueba de middleware. |
| `backend/tests/Feature/Semana7ApiTest.php` | Solicitudes reales, persistencia MySQL, matriz de estados, errores, excepciones de clase exacta y snapshots de registros ante rechazo. Usa `DatabaseTransactions`. |

Todos los archivos de prueba anteriores se conservan. Playwright y Node no se sustituyen por pytest ni se presentan como ejecutados en esta fase. La propuesta de wrapper Python de §1.9 sigue sin implementar: el alcance solicitado para esta fase es Vitest/PHPUnit.

### 2.2. Evaluación de casos por el agente

Esta tabla conserva la revisión de fase 2. «Detectaría» describe la hipótesis evaluada entonces por inspección. La evidencia de las tres mutaciones realmente introducidas después está en la sección 3; no demuestra todas las hipótesis de esta tabla. U/V/I prueban responsabilidades distintas; repetir un dato entre capas es intencional cuando comprueba validación local, middleware o persistencia. «Conservar» es decisión técnica del agente, no aprobación personal de la estudiante.

| Caso | Fuente del esperado | Error que detectaría | Decisión y aporte |
| --- | --- | --- | --- |
| F-01 | HU-02, H fijo | Permitir ayer | Conservar U/V/I; I comprueba ausencia de escritura. |
| F-02 | HU-02, hoy permitido | Comparar con > en vez de ≥ | Conservar; frontera exacta. |
| F-03 | HU-02 | Rechazar futuro | Conservar; vecino superior. |
| F-04 | DECISIONES, excepción O | Revalidar contra hoy una original vencida | Conservar; rama excepcional. |
| F-05 | Excepción solo por igualdad | Permitir cualquier fecha anterior | Conservar; vecino inferior de O. |
| F-06 | Misma excepción | Permitir rango O…H | Conservar; vecino superior de O aún vencido. |
| F-07 | HU-02/HU-07 y DECISIONES | Rechazar nueva fecha hoy/futura al editar | Conservar dos parámetros; ruta PUT. |
| F-08 | Conservación de original | Rechazar igualdad hoy/futuro | Conservar; completa D7. |
| F-09 | Obligatoriedad documentada | Guardar omisión/null/vacío | Conservar en composición y API; no exigir este error al comparador aislado. |
| F-10 | Contrato canónico API | Aceptar formatos o timestamp | Conservar V/I; no convertirlo en test de comparación de cadenas. |
| F-11 | Día de calendario real | Normalizar fecha imposible | Conservar V/I. |
| F-12 | Calendario gregoriano | Rechazar 29/02 válido o aceptar no bisiesto | Conservar; unidad temporal solo con fechas existentes, V/I con imposibles. |
| F-13 | Día calendario colombiano | Usar UTC o desplazar frontera | Conservar tres instantes; esperado 22/23/23 fijo. |
| F-14 | Independencia de zona del navegador | Usar zona del dispositivo | Pendiente de ejecución específica multizona; no atribuirla a las pruebas de medianoche ni al E2E histórico de presentación. |
| F-15 | HU-02/calendario | Comparar días ignorando mes/año | Conservar; cambio de año. |
| F-16 | Contrato de tipo de fecha | Aceptar tipos o responder 500 | Conservar V/I, sin coerción. |
| F-17 | Regla contra hoy al guardar | Mantener una validación obsoleta | Conservar; abre antes y envía después de medianoche. |
| T-01 | Texto no blanco | Aceptar vacío/blancos | Conservar U, incluidos controles ASCII. |
| T-02 | Texto debe ser cadena | Coerción o error de tipo | Conservar U; verificar valor original antes/después, incluido undefined. |
| T-03 | Mínimo 1 y texto académico | Rechazar texto válido | Conservar U; vecinos inferiores y tildes. |
| T-04 | Helper sin mutación | Recortar el control al validar | Conservar; inspecciona valor, no solo resultado. |
| T-05 | Normalización de envío/API | Perder espacios interiores o no recortar extremos | Conservar C/I con esperados literales; lejos de máximos ambiguos. |
| T-06 | Campos obligatorios, A-01 provisional | Aceptar clave ausente | Conservar V/I; distinta de cadena vacía. |
| T-07 | Obligatoriedad/A-01 | Admitir null o blancos | Conservar C/V/I; I incluye middleware. |
| T-08 | Texto de tipo cadena | Guardar número/array/objeto | Conservar V/I; corregir transporte JSON del harness según §2.3. |
| T-09 | Máximos de DECISIONES y ASCII autorizado | Error de una posición o desconectar máximo del formulario | Conservar 0/1/2/M−1/M/M+1 en formularios reales y Laravel. |
| T-10 | Obligatorio aunque no exceda M | Confundir tamaño con contenido | Conservar caso de M espacios por campo en U/C/V/I; se añadió tras detectar que blancos cortos no cubrían este dato exacto. |
| T-11 | A-01 provisional | Exigir uno de título/descripcion en vez de ambos | Conservar C/I por campos, sin declarar confirmado el texto del cliente. |
| T-12 | Ambos obligatorios | Reportar/validar solo el primer vacío | Conservar caso combinado de API con ambos errores. |
| T-13 | Obligatoriedad independiente de excepción O | Guardar descripción vacía al conservar vencida | Conservar C/I y snapshot. |
| T-14 | Texto permitido sin lista restrictiva | Perder tildes, ñ o apóstrofo | Conservar datos sintéticos; helper admite etiqueta literal; pruebas anteriores de SQL se mantienen. |
| T-15 | A-04 sin resolver | Divergencia de longitud y recorte | Pendiente; no fijar esperado para obtener un verde. |
| T-16 | A-05 sin resolver | Diferencia Unicode entre capas | Pendiente; sin emoji/NBSP/ancho cero en límites exactos. |
| E-01 | A-03 provisional | Rechazar autoasignación Pendiente | Conservar en matriz, valor persistido. |
| E-02 | A-02 provisional | Impedir empezar progreso | Conservar en matriz. |
| E-03 | HU-04 escenario 1 | No completar | Conservar; regresión existente más caso independiente. |
| E-04 | A-02 provisional | Impedir regreso a Pendiente | Conservar; par antes no aislado. |
| E-05 | A-03 provisional | Rechazar autoasignación En progreso | Conservar; valor, sin inventar contrato de timestamps. |
| E-06 | A-02 provisional | Impedir completar desde progreso | Conservar; par explícito. |
| E-07 | Reapertura documentada | Tratar Completada como terminal | Conservar; refuerzo integrado. |
| E-08 | A-02 provisional | Impedir reapertura a progreso | Conservar; par antes no aislado. |
| E-09 | HU-04 escenario 2 | Completar de nuevo o lanzar clase equivocada | Conservar HTTP/snapshot y prueba de excepción exacta; responsabilidades diferentes. |
| E-10 | Estado obligatorio | Admitir ausencia/null/vacío | Conservar V/I. |
| E-11 | Catálogo S4 | Admitir externos/cambios de mayúsculas/tipo | Conservar V/I; error, no escritura. |
| E-12 | Recurso existente requerido | Crear implícitamente o devolver 422 | Conservar 404 y clase exacta, ID obtenido de fixture borrada propia. |
| E-13 | Estado inicial documentado | Crear tarea fuera de Pendiente | Conservar mediante P-01 prioridades válidas; no crear otro test idéntico. |
| E-14 | Estado por PATCH | Cambiar estado vía POST/PUT | Conservar valores no vacíos; A-08 vacío pendiente. |
| E-15 | PUT conserva estado | Restablecer Pendiente al editar | Conservar con dos estados originales. |
| E-16 | HU-04 interfaz | Habilitar doble finalización | Conservar componente; E2E previo permanece sin nueva ejecución. |
| E-17 | Serialización documentada | Dos finalizaciones concurrentes aceptadas | Pendiente de arnés con conexiones independientes; no sustituir por dos llamadas secuenciales ni declarar concurrencia probada. |
| E-18 | Confirmar solo respuesta persistida | Confirmar visualmente un cambio fallido | Conservar Subject pendiente/error y comprobación de reconsulta. |
| P-01/P-02 | Catálogo de prioridades y obligatoriedad en DECISIONES | Admitir prioridad ajena o impedir válida | Conservar complemento de fixtures; no se presenta como cuarta regla seleccionada. |

### 2.3. Correcciones y descartes reales

| Propuesta/ejecución inicial | Decisión del agente | Motivo y efecto |
| --- | --- | --- |
| Esqueletos Artisan `test_example` | Descartados al escribir casos reales | No aportaban validación de R-F/R-T/R-E. No se contabilizaron como pruebas de negocio ejecutadas. |
| Contexto de ruta manual sin enlazar | Corregido tras `Route is not bound.` | Enlazar Route antes de asignar tarea y solo proveerla para edición. El problema estaba en el harness; no cambió ningún oráculo ni producción. |
| stdClass pasado directamente al validador PHP | Corregido tras errores de conversión/mb_strlen | Reproducir decodificación JSON asociativa como la solicitud HTTP de Laravel. El contrato sigue siendo rechazo; no se convirtió el esperado en aceptación/500. |
| Máximos probados solo con helper o con formulario duplicado | Descartada esa estrategia durante diseño de implementación | El helper no tiene máximo. Se usa el FormGroupDirective de los componentes reales y reglas reales de solicitudes. |
| Esperados calculados con hoyColombia o catálogo de producción | Descartada esa estrategia durante diseño | Relojes, cadenas de fecha, estados y códigos esperados están fijados en los datos de prueba. |
| Nombres de métodos PHP iniciales | Corregidos automáticamente por Pint a snake_case | Convención PHPUnit; no afecta contenido ni esperados. |
| Tres destinos válidos repetidos en prueba HTTP de catálogo | Descartados de esa parametrización en la revisión final | Los nueve pares ya comprueban esos mismos destinos desde Pendiente con igual persistencia. Se conserva el catálogo completo en validación aislada y los destinos inválidos por HTTP. No se eliminó ninguna prueba anterior. |
| T-10 sin parámetro explícito de M espacios en la primera generación | Corregido durante revisión | Añadidos cuatro tamaños en helper/formularios y los cuatro campos en proveedores PHP, incluidos POST/PUT de tareas. No cambiaron esperados. |

Las correcciones anteriores corresponden al agente. No se atribuye una validación personal posterior a la estudiante.

## 3. Romper el código a propósito

Actividad autorizada por el prompt «SEMANA 7 — FASE FINAL: PRUEBAS DE MUTACIÓN Y ENTREGA». Ejecutada por **Codex el 22/11/2026, America/Bogota**, sin atribuir a la estudiante ejecuciones o revisión personal no comunicadas.

### 3.1. Preparación y resultado de las mutaciones

Se verificó `semana-7-pruebas` y se conservó el estado inicial: la bitácora modificada y los seis archivos nuevos de pruebas más este registro aún sin versionar. No se ejecutaron reset, clean, restore de Git, cambios de `.env` ni SQL sobre desarrollo. Se guardaron copias binarias exactas de los dos archivos de producción y un manifiesto SHA-256 de producción, pruebas y configuraciones privadas antes de mutar. Las copias y logs están exclusivamente en `artifacts/semana7/mutaciones-final/`, ignorado por Git.

Cada ejecución usó una sola mutación. Un bloque `try/finally` restauró los bytes originales inmediatamente después del runner; verificó que nadie hubiera editado el archivo concurrentemente antes de sobrescribirlo. Solo después de restaurar y aprobar las pruebas relacionadas se inició la siguiente mutación. No se cambiaron pruebas ni resultados esperados; no fue necesario agregar casos porque las tres mutaciones produjeron fallos de aserción.

| ID | Mutación introducida | Prueba que falló | Resultado observado | Restauración | Estado |
| -- | -------------------- | ---------------- | ------------------- | ------------ | ------ |
| M-01 | `frontend/src/app/config/fechas.ts:25`, `fechaNoPasada()`: `< hoyColombia()` → `<= hoyColombia()` | `semana7-reglas.spec.ts`, **F-02**, entrega `2026-11-22` con H fijo del mismo día. | Esperado `null`; observado `{ pasada: true }`. Selección F-01/F-02/F-03: **1 fallida, 2 aprobadas**, salida 1. | Copia binaria original; hash idéntico. Misma selección: **3/3 aprobadas**, salida 0. | Detectada y restaurada. |
| M-02 | `frontend/src/app/config/fechas.ts:17`, `textoObligatorio()`: `control.value.trim().length > 0` → `control.value.length > 0` | **T-01-espacio**, **T-01-espacios**, **T-01-controles** y **T-10** con 150, 30, 200 y 5000 espacios. | Esperado `{ required: true }`; observado `null` en los siete casos. Selección: **7 fallidas, 1 aprobada**, salida 1; vacío siguió rechazándose. | Copia binaria original; hash idéntico. Misma selección: **8/8 aprobadas**, salida 0. | Detectada y restaurada. |
| M-03 | `backend/app/Http/Controllers/Api/TareaController.php:63`, `estado()`: anteponer `false &&` a la condición de doble finalización, desactivando temporalmente el rechazo. | `AcademicApiTest::test_actualiza_estado_y_rechaza_completar_dos_veces`; `Semana7ApiTest::test_r_e_nueve_pares`, dataset **E-09 HU-04**; `Semana7ApiTest::test_e_09_excepcion_exacta_del_controlador_y_rollback`. | Las dos pruebas HTTP esperaban **422** y recibieron **200**. La tercera esperaba **ValidationException** y no se lanzó. Selección: **3 fallidas, 8 aprobadas**, 30 aserciones, salida 1. | Restauración inmediata desde copia binaria; hash idéntico. Misma selección: **11/11 aprobadas**, 40 aserciones, salida 0. | Detectada y restaurada. |

M-03 utilizó únicamente `gestion_semana7_20261122_d6465605_testing`, con `APP_ENV=testing`, MySQL y `DB_URL` vacío, sin cambiar `.env.testing`. Se ejecutó `academic:check-test-database` antes de mutar y se conservaron las comprobaciones de `TestDatabaseSafety` en el arranque de cada prueba. Las operaciones se realizaron dentro de las transacciones de las pruebas existentes.

La selección de Vitest excluyó por filtro otros 39 casos en M-01 y 34 en M-02. No son fallos ni casos ejecutados; los **3 y 8** indicados arriba corresponden solo a las pruebas seleccionadas. La verificación completa final no usa estos filtros.

### 3.2. Cambios exactos y comandos

M-01, línea 25, una comparación:

```diff
-    control.value && control.value !== fechaOriginal && String(control.value) < hoyColombia()
+    control.value && control.value !== fechaOriginal && String(control.value) <= hoyColombia()
```

Desde `frontend/`, con el mutante y, después de restaurar, con el original:

```powershell
npm.cmd test -- --watch=false --include=src/app/config/semana7-reglas.spec.ts '--filter=F-0[123]:' --reporters=default --reporters=json --output-file=../artifacts/semana7/mutaciones-final/M1-mutante.json
npm.cmd test -- --watch=false --include=src/app/config/semana7-reglas.spec.ts '--filter=F-0[123]:' --reporters=default --reporters=json --output-file=../artifacts/semana7/mutaciones-final/M1-restaurada.json
```

M-02, línea 17, retirar únicamente el recorte previo a contar caracteres:

```diff
-  typeof control.value === 'string' && control.value.trim().length > 0 ? null : { required: true };
+  typeof control.value === 'string' && control.value.length > 0 ? null : { required: true };
```

Desde `frontend/`:

```powershell
npm.cmd test -- --watch=false --include=src/app/config/semana7-reglas.spec.ts '--filter=T-[01][01]' --reporters=default --reporters=json --output-file=../artifacts/semana7/mutaciones-final/M2-mutante.json
npm.cmd test -- --watch=false --include=src/app/config/semana7-reglas.spec.ts '--filter=T-[01][01]' --reporters=default --reporters=json --output-file=../artifacts/semana7/mutaciones-final/M2-restaurada.json
```

**Incidencia de invocación registrada:** el primer intento de M-02 usó `--filter=T-01|T-10`; `npm.cmd` interpretó `|` como tubería de Windows y terminó con código 255 indicando que T-10 no era un comando. No se utilizó ese intento como evidencia de detección ni de restauración aprobada. El archivo quedó restaurado; se conservaron sus logs con prefijo `M2-invocacion-inicial-` y se repitió con `T-[01][01]`, que en ese archivo selecciona exactamente T-01/T-10. Se corrigió el comando, no las aserciones ni la lógica original.

M-03, línea 63, desactivar únicamente la guarda de doble finalización:

```diff
-            if ($locked->estado === 'Completada' && $estado === 'Completada') {
+            if (false && $locked->estado === 'Completada' && $estado === 'Completada') {
```

Desde `backend/`, con las variables de pruebas de §4.3:

```powershell
..\.tools\php\php.exe artisan academic:check-test-database --env=testing --no-interaction
..\.tools\php\php.exe vendor/bin/phpunit --filter 'test_r_e_nueve_pares|test_e_09|test_actualiza_estado_y_rechaza_completar_dos_veces' --log-junit ../artifacts/semana7/mutaciones-final/M3-mutante.xml
..\.tools\php\php.exe vendor/bin/phpunit --filter 'test_r_e_nueve_pares|test_e_09|test_actualiza_estado_y_rechaza_completar_dos_veces' --log-junit ../artifacts/semana7/mutaciones-final/M3-restaurada.xml
```

Se capturaron stdout/stderr y el código de salida de cada runner. Los diffs temporales `M1.diff`, `M2.diff`, `M3.diff`, los reportes JSON/JUnit y los archivos `M1/M2/M3-resultado.json` permiten contrastar mutante frente a restauración. Son evidencia local ignorada, no código de producción incluido en el commit.

### 3.3. Restauración comprobada

| Archivo de producción | SHA-256 original y restaurado |
| --- | --- |
| `frontend/src/app/config/fechas.ts` | `4CA0DC0DB36B0155473AA4FF9A1EFBCEE12D72ECC3966E0262D61187F5029F21` |
| `backend/app/Http/Controllers/Api/TareaController.php` | `536F16EDE4A8ED36C255A9CC8B438D0E64F68E5B685EA2FE1BE0A6227D8E1378` |

Los hashes coinciden con las copias previas, y `git diff` sobre producción quedó vacío tras retirar las tres mutaciones. Se detectaron **3 de 3 mutantes manuales seleccionados**. Este resultado no es una medición exhaustiva de todos los mutantes posibles ni demuestra los casos pendientes de concurrencia/multizona.

### 3.4. Verificación final tras retirar los tres mutantes

Se volvieron a ejecutar las suites completas y ambos linters, sin mutaciones activas y sin cambiar los esperados. Estos resultados son de la **fase final**, no una reutilización de los reportes de fase 2.

| Directorio | Comando ejecutado | Resultado observado |
| --- | --- | --- |
| `frontend/` | `npm.cmd test -- --watch=false --reporters=default --reporters=json --output-file=../artifacts/semana7/mutaciones-final/vitest-final.json` | Salida 0; **87/87 aprobadas**, 0 fallidas, 0 omitidas; 7 archivos. |
| `backend/` | `..\.tools\php\php.exe artisan academic:check-test-database --env=testing --no-interaction` | Salida 0; mismo destino MySQL exclusivo validado antes de la suite completa. |
| `backend/` | `..\.tools\php\php.exe vendor/bin/phpunit --log-junit ../artifacts/semana7/mutaciones-final/phpunit-final.xml` | Salida 0; **327/327 aprobadas**, **1014 aserciones**, 0 fallos, errores u omitidas. |
| `frontend/` | `npm.cmd run lint` | Salida 0, sin advertencias ni errores; `mutaciones-final/eslint-final.log`. |
| `backend/` | `..\.tools\php\php.exe vendor/bin/pint --dirty --format agent` | Salida 0; `passed`; `mutaciones-final/pint-final.log`. |
| Raíz | `.\.tools\php\php.exe artifacts\semana7\estado_base.php` | Salida 0 con guardia activa; misma base `_testing`, **0 asignaturas y 0 tareas** al finalizar. No hubo limpieza destructiva. |
| Raíz | `git diff --exit-code -- frontend/src/app/config/fechas.ts backend/app backend/config backend/routes backend/database backend/bootstrap scripts` y comparación SHA-256 | Diff vacío; **93 entradas del manifiesto idénticas** tras Pint, incluidas producción, pruebas anteriores/nuevas y ambos `.env`. Ninguna prueba original fue alterada. |
| Raíz | `git diff --check` y `git check-ignore` sobre copias, diffs y `.env` | Sin errores de espacios; respaldos/temporales y configuración privada siguen ignorados. Se prepara únicamente la lista explícita de seis archivos de pruebas y dos documentos de Semana 7. |

Los reportes finales JSON/JUnit confirman los conteos sin filtros. Los archivos de producción quedan exactamente iguales a los originales; los tres cambios de la sección 3.2 aparecen solo como evidencia documental. Los secretos, copias originales, logs y diffs temporales no forman parte de los archivos seleccionados para el commit local. No se ejecutó push ni merge ni se reescribió historial.

## 4. Datos de prueba

### 4.1. Fixtures realmente utilizados

| Dato | Valores y construcción |
| --- | --- |
| Asignaturas ficticias | `Diseño del ñandú d'álgebra`, `Geometría del ñandú`; códigos `FIC-07`…`FIC-10`. Factories existentes con todos los atributos académicos sobrescritos; sin información de personas reales. |
| Tareas ficticias | `Exposición ficticia de señales`, `Ensayo d'algoritmos y ñandúes.`, `Ensayo ficticio`; datos literales, sin fuentes personales. |
| Fechas/relojes | H fijo 22/11/2026; O 20/11; vecinos 19/20/21 y 21/22/23; frontera UTC 04:59:59/05:00:00/05:00:01 del 23; fin de año; febrero de 2027/2028. Relojes restaurados al terminar cada prueba. |
| Textos de límite | Repeticiones ASCII de A, longitudes 0/1/2 y 149/150/151, 29/30/31, 199/200/201, 4999/5000/5001. No Unicode ambiguo cerca del máximo. |
| Textos vacíos/tipos | Omitido, null, cadena vacía, blancos y controles ASCII, número/booleano/array/objeto JSON. Undefined solo en helper TS, preservado mediante estado explícito del FormControl. |
| Normalización | `  Informe  final  ` → `Informe  final`; tildes, ñ y apóstrofos conservados. No se prueba tamaño bruto que cruce M solo por espacios externos. |
| Estados | Pendiente, En progreso, Completada; nueve pares fijos. Inválidos: Otro, pendiente, En Progreso, 1, true, arrays/objetos y ausencia. |
| Prioridades | Alta, Media, Baja; inválidas Urgente, alta, vacío, null, array, 1 y omisión. |
| IDs | API: obtenidos de factories; recurso ausente a partir de fixture propia eliminada. Componentes sin BD: IDs sintéticos 701/702. |

### 4.2. MySQL y protecciones conservadas

Se creó una base nueva: `gestion_semana7_20261122_d6465605_testing`, MySQL portable del proyecto en `127.0.0.1:3307`. El sufijo aleatorio se generó durante esta fase y `CREATE DATABASE` sin `IF NOT EXISTS` garantizó que no se reutilizara una base existente. Se concedieron permisos al usuario local ya configurado únicamente para la nueva base. Los secretos se leyeron desde el archivo local ignorado, sin imprimirlos ni incluirlos en pruebas/documentación.

Se migró únicamente la base nueva, sin seeders y sin operaciones destructivas. `backend/.env` y `.env.testing` se conservaron; `DB_DATABASE` se sustituyó solo en los procesos de pruebas. Se mantuvieron `DB_URL` vacío, `APP_ENV=testing`, MySQL y las guardias de `Tests\TestCase`/`TestDatabaseSafety`. Las pruebas Feature usan transacciones revertidas; cada rechazo nuevo compara los registros de ambas tablas antes/después, no solo el código HTTP. Los snapshots no afirman conservar contadores AUTO_INCREMENT ni prueban concurrencia.

El script de arranque informó que no detectaba el puerto; el log de MySQL indicó `ready for connections` y PDO pudo crear la base; migraciones y solicitudes reales se ejecutaron contra ella. No se arregló el script de producción durante esta fase. La preparación y los reportes locales están en `artifacts/semana7/`, ignorado por Git; las pruebas y este registro sí forman parte de la entrega.

Consulta posterior a la última suite, ejecutada con la guardia activa: `SELECT DATABASE()` confirmó `gestion_semana7_20261122_d6465605_testing`; conteos finales **0 asignaturas y 0 tareas**. No hubo que borrar registros para alcanzar ese estado. Se conserva la base con su esquema de pruebas; no se borró la base ni se detuvo la instancia compartida de MySQL.

### 4.3. Comandos y ejecuciones comprobadas

Responsable: Codex. Fecha de ejecución: 22/11/2026 en Colombia. Los relojes simulados dentro de los tests no son fechas de ejecución. Antes de cada comando PHP de pruebas se estableció en su proceso:

```powershell
$env:DB_DATABASE = 'gestion_semana7_20261122_d6465605_testing'
$env:DB_URL = ''
$env:APP_ENV = 'testing'
```

El nombre se leyó de `artifacts/semana7/base.txt`; aquí se muestra su valor real. No se cambiaron archivos `.env`. Los comandos siguientes se ejecutaron con redirección a logs en `artifacts/semana7/`; los argumentos de reportes se muestran explícitamente.

| Paso/directorio | Comando ejecutado | Resultado comprobado |
| --- | --- | --- |
| Preparación, raíz | `powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts\start-mysql.ps1` | Salida 1: no detectó puerto. MySQL sí quedó disponible según log/PDO. No se contó como prueba aprobada. |
| Base nueva, raíz | `.\.tools\php\php.exe artifacts\semana7\preparar_base.php` | Salida 0; creó solo la base aleatoria identificada en §4.2 y su permiso local. Script de preparación local ignorado por Git. |
| Guardia, raíz | `.\.tools\php\php.exe backend\artisan academic:check-test-database --env=testing --no-interaction` | Salida 0; destino validado sin SQL de modificación. |
| Esquema, raíz | `.\.tools\php\php.exe backend\artisan migrate --env=testing --no-interaction` | Salida 0; tabla de migraciones y dos migraciones, solo sobre la base nueva. |
| Vitest nuevas, frontend | `npm.cmd test -- --watch=false --include=src/app/config/semana7-reglas.spec.ts --include=src/app/components/semana7-formularios.spec.ts --reporters=default --reporters=json --output-file=../artifacts/semana7/vitest-nuevas-inicial.json` | Salida 1 al compilar por lectura denegada de OneDrive/resolución de dependencias. **0 pruebas ejecutadas**; no es un fallo de aserción. Log `vitest-nuevas-inicial.log`. |
| Repetición con permisos de lectura adecuados, frontend | Mismo comando anterior, con `--output-file=../artifacts/semana7/vitest-nuevas.json` | Salida 0; 69/69 aprobadas, 0 fallidas. |
| Validación inicial, backend | `..\.tools\php\php.exe vendor/bin/phpunit tests/Unit/Semana7ValidationTest.php --log-junit ../artifacts/semana7/phpunit-validacion-inicial.xml` | Salida 2; 117 ejecutadas, 73 aprobadas, **44 errores del harness**, 0 fallos de aserción, 143 aserciones. Route sin enlazar y tipos PHP sin decodificación JSON, corregidos en §2.3. |
| Validación corregida, backend | Mismo comando, con `--log-junit ../artifacts/semana7/phpunit-validacion.xml` | Salida 0; 117/117, 231 aserciones. No cambiaron esperados. |
| API nuevas iniciales, backend | `..\.tools\php\php.exe vendor/bin/phpunit tests/Feature/Semana7ApiTest.php --log-junit ../artifacts/semana7/phpunit-api-inicial.xml` | Salida 0; 175/175, 665 aserciones. |
| Primera completa Vitest, frontend | `npm.cmd test -- --watch=false --reporters=default --reporters=json --output-file=../artifacts/semana7/vitest-completa.json` | Salida 0; 79/79, incluidos 8 casos anteriores. Antes de completar T-10 explícito. |
| Primera completa PHPUnit, backend | `..\.tools\php\php.exe vendor/bin/phpunit --log-junit ../artifacts/semana7/phpunit-completa.xml` | Salida 0; 320/320, 991 aserciones, incluidos 28 anteriores. Antes de añadir T-10 y quitar tres parámetros redundantes. |
| Formato PHP final, backend | `..\.tools\php\php.exe vendor/bin/pint --dirty --format agent` | Salida 0, `passed`. Los intentos previos de Pint solo corrigieron convenciones de los nuevos archivos PHP. Log final `pint-final.log`. |
| **Vitest final completa**, frontend | `npm.cmd test -- --watch=false --reporters=default --reporters=json --output-file=../artifacts/semana7/vitest-final.json` | **Salida 0; 87/87 aprobadas, 0 fallidas, 0 omitidas, 7 archivos**. |
| **PHPUnit final completa**, backend | `..\.tools\php\php.exe vendor/bin/phpunit --log-junit ../artifacts/semana7/phpunit-final.xml` | **Salida 0; 327/327 aprobadas, 0 fallos, 0 errores, 0 omitidas; 1014 aserciones**. |
| ESLint inicial y final, frontend | `npm.cmd run lint` | Ambas salidas 0; sin advertencias/errores. Log final `eslint-final.log`. |
| Estado final BD, raíz | `.\.tools\php\php.exe artifacts\semana7\estado_base.php` | Salida 0; guardia activa, base identificada y 0 registros en ambas tablas; `estado-base-final.json`. |

Las redirecciones se acompañaron de captura de `$LASTEXITCODE` y devolución del mismo código al proceso; un log creado no se interpretó como aprobación. Los reportes iniciales se conservaron con nombres diferentes de los finales. No sumar repeticiones como si fueran casos únicos adicionales.

**Desglose final por archivo/clase**, obtenido de JSON/JUnit:

| Suite | Nuevas | Anteriores | Total aprobado | Aserciones PHP |
| --- | --- | --- | --- | --- |
| Vitest `semana7-reglas.spec.ts` | 42 | 0 | 42 | No aplica |
| Vitest `semana7-formularios.spec.ts` | 35 | 0 | 35 | No aplica |
| Vitest `semana7-estados.spec.ts` | 2 | 0 | 2 | No aplica |
| Vitest cuatro archivos anteriores | 0 | 8 | 8 | No aplica |
| PHPUnit `Semana7ValidationTest` | 121 | 0 | 121 | 239 |
| PHPUnit `Semana7ApiTest` | 178 | 0 | 178 | 680 |
| PHPUnit `AcademicApiTest` | 0 | 21 | 21 | 85 |
| PHPUnit `TestDatabaseSafetyTest` | 0 | 7 | 7 | 10 |

Resultado: **79 pruebas nuevas Vitest y 299 nuevas PHPUnit**, con todas las anteriores conservadas y aprobadas. Las pruebas V tienen arranque de Laravel, pero no ejercitan persistencia; las I ejecutan API/MySQL. No convertir el conteo de casos parametrizados en un porcentaje de cobertura ni afirmar cobertura total del sistema.

### 4.4. Esperados frente a observados y pendientes

| Grupo ejecutado | Esperado fijo del diseño/propuesta | Observado en pruebas finales |
| --- | --- | --- |
| F-01…F-08 | Ayer rechazado; hoy/futuro admitidos; excepción solo para original idéntica | Helpers retornaron errores/null previstos; API respondió 201/200/422 según cada parámetro; fechas válidas persistidas y snapshots iguales ante rechazo. |
| F-09…F-12, F-16 | Obligatoriedad, formato, calendario y tipos; bisiestos válidos aceptados | Coincidencia con cada parámetro. Formulario obligatorio; API/Validator rechazaron inválidos sin escrituras. |
| F-13, F-15, F-17 | Frontera Colombia, cambio de año y revalidación al enviar | Retornos esperados y formulario sin emisión tras medianoche. |
| T-01…T-04 | Tipo/contenido y helper sin mutación | Coincidencia; incluso undefined y objetos en FormControl no provocaron excepción. |
| T-05…T-14 | Recorte, obligatorios, ASCII en límites, M espacios inválidos y textos sintéticos válidos | Coincidencia en capas implementadas. Máximos reales detectados, rechazos HTTP sin cambios; tildes, ñ/apóstrofos y espacios interiores conservados. |
| E-01…E-09 | Matriz fija de propuestas académicas/HU-04 | Ocho pares con 200 y destino persistido; Completada → Completada con 422, mensaje previsto y snapshot intacto. No confirma por sí mismo las propuestas como requisitos del cliente. |
| E-10…E-15 | Destino inválido 422, ausente 404, creación Pendiente, estado separado de PUT/POST | Coincidencia; clases exactas ValidationException/ModelNotFoundException y efectos persistidos comprobados donde corresponde. |
| E-16/E-18 | Botón deshabilitado; no confirmar cambio ante error | Componente real mostró mensaje/deshabilitación; mantuvo Pendiente durante solicitud y tras error, habilitó reintento y volvió a consultar. HTTP simulado explícitamente en esta capa. |
| P-01/P-02 | Catálogo de prioridades y rechazo externo | Alta/Media/Baja persistidas, creación Pendiente; entradas inválidas 422 sin cambios. |

**Pendientes explícitos:** F-14 (ejecución específica multizona), E-17 (concurrencia real con conexiones independientes), T-15/T-16 y extremos de A-06/valores vacíos de A-08. No se añadieron skips/xfails para estos diseños: no están incluidos entre los casos ejecutados ni se consideran aprobados. E2E Playwright, Node, pytest, cobertura y rendimiento no se ejecutaron en esta fase.

Los resultados de fase 2 por parámetro están en `vitest-final.json` y `phpunit-final.xml`; el resumen tabulado anterior permite revisar lo comprobado aunque no se disponga de los artefactos locales ignorados. Las decisiones humanas continúan pendientes; la actividad posterior de mutación y restauración se documenta en la sección 3. En fase 2 no se corrigió lógica de producción para aprobar ninguna prueba; las correcciones se limitaron al código de pruebas y su preparación.
