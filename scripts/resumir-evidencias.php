<?php

declare(strict_types=1);

/** Exporta solo métricas y rutas relativas; nunca cuerpos de errores, entorno o credenciales. */
function reportJson(string $path): ?array
{
    if (! is_file($path)) {
        return null;
    }

    return json_decode(ltrim(file_get_contents($path), "\xEF\xBB\xBF"), true, flags: JSON_THROW_ON_ERROR);
}

function reportXml(string $path): ?DOMDocument
{
    if (! is_file($path)) {
        return null;
    }
    $document = new DOMDocument;
    if (! $document->load($path, LIBXML_NONET | LIBXML_NOBLANKS)) {
        throw new RuntimeException('Reporte XML inválido');
    }

    return $document;
}

function metricAttributes(DOMElement $element, array $names): array
{
    $result = [];
    foreach ($names as $name) {
        $result[$name] = (int) $element->getAttribute($name);
    }

    return $result;
}

function coverageRatio(int $covered, int $total): array
{
    return ['covered' => $covered, 'total' => $total, 'percent' => $total ? round(100 * $covered / $total, 2) : null];
}

$root = dirname(__DIR__);
$output = $argv[1] ?? $root.'/artifacts/ci/resumen.json';
$vitest = reportJson($root.'/artifacts/ci/vitest.json');
$frontendCoverage = reportJson($root.'/frontend/coverage/frontend/coverage-summary.json');
$phpunit = reportXml($root.'/artifacts/ci/phpunit.xml');
$clover = reportXml($root.'/artifacts/ci/phpunit-clover.xml');
$playwright = reportJson($root.'/artifacts/playwright-results.json');
$rnf = reportJson($root.'/artifacts/rnf-01.json');
$summary = [
    'generated_at' => (new DateTimeImmutable('now', new DateTimeZone('America/Bogota')))->format(DateTimeInterface::ATOM),
    'github_sha' => preg_match('/^[a-f0-9]{40}$/D', getenv('GITHUB_SHA') ?: '') ? getenv('GITHUB_SHA') : null,
    'execution_context' => getenv('GITHUB_ACTIONS') === 'true' ? 'github-actions' : 'local',
    'missing_reports' => [],
];
if ($vitest === null) {
    $summary['missing_reports'][] = 'vitest';
} else {
    $summary['vitest'] = [
        'passed' => $vitest['success'] && $vitest['numTotalTests'] > 0,
        'tests' => $vitest['numTotalTests'], 'successful' => $vitest['numPassedTests'],
        'failed' => $vitest['numFailedTests'], 'pending' => $vitest['numPendingTests'],
        'files' => count($vitest['testResults']), 'start_time_ms' => $vitest['startTime'],
    ];
}
if ($frontendCoverage === null) {
    $summary['missing_reports'][] = 'frontend_coverage';
} else {
    $summary['frontend_coverage'] = ['total' => $frontendCoverage['total'], 'files' => []];
    foreach ($frontendCoverage as $name => $metrics) {
        if ($name === 'total') {
            continue;
        }
        $name = str_replace('\\', '/', $name);
        $position = strpos($name, 'frontend/src/app/');
        if ($position === false) {
            throw new RuntimeException('Ruta fuera del ámbito frontend esperado');
        }
        $summary['frontend_coverage']['files'][substr($name, $position)] = $metrics;
    }
}
if ($phpunit === null) {
    $summary['missing_reports'][] = 'phpunit';
} else {
    $suite = (new DOMXPath($phpunit))->query('/testsuites/testsuite')->item(0);
    if (! $suite instanceof DOMElement) {
        throw new RuntimeException('JUnit sin resumen de suite');
    }
    $metrics = metricAttributes($suite, ['tests', 'assertions', 'errors', 'failures', 'skipped']);
    $summary['phpunit'] = ['passed' => $metrics['tests'] > 0 && $metrics['errors'] === 0 && $metrics['failures'] === 0, ...$metrics];
}
if ($clover === null) {
    $summary['missing_reports'][] = 'backend_coverage';
} else {
    $xpath = new DOMXPath($clover);
    $summary['backend_coverage'] = ['branch_coverage_measured' => false, 'files' => []];
    $business = ['statements' => 0, 'coveredstatements' => 0, 'methods' => 0, 'coveredmethods' => 0];
    foreach ($xpath->query('/coverage/project/package/file | /coverage/project/file') as $file) {
        $name = str_replace('\\', '/', $file->getAttribute('name'));
        $position = strpos($name, 'backend/app/');
        if ($position === false) {
            throw new RuntimeException('Ruta fuera del ámbito backend esperado');
        }
        $name = substr($name, $position);
        $metrics = metricAttributes($xpath->query('./metrics', $file)->item(0), array_keys($business));
        $summary['backend_coverage']['files'][$name] = $metrics;
        if (str_starts_with($name, 'backend/app/Http/') || str_starts_with($name, 'backend/app/Models/')) {
            foreach ($business as $key => $value) {
                $business[$key] += $metrics[$key];
            }
        }
    }
    $global = metricAttributes($xpath->query('/coverage/project/metrics')->item(0), array_keys($business));
    foreach (['all_app' => $global, 'http_and_models_subset' => $business] as $scope => $metrics) {
        $summary['backend_coverage'][$scope] = [
            'lines' => coverageRatio($metrics['coveredstatements'], $metrics['statements']),
            'methods' => coverageRatio($metrics['coveredmethods'], $metrics['methods']),
        ];
    }
}
if ($playwright === null) {
    $summary['missing_reports'][] = 'playwright';
} else {
    $summary['playwright'] = [...$playwright['stats'], 'global_errors' => count($playwright['errors'])];
}
if ($rnf === null) {
    $summary['missing_reports'][] = 'rnf_01';
} else {
    $summary['rnf_01'] = array_intersect_key($rnf, array_flip(['fecha', 'navegador', 'registros', 'resolucion', 'muestras_ms', 'api_ms', 'cumple_en_esta_ejecucion']));
}
$summary['report_sha256'] = [];
foreach (['artifacts/ci/vitest.json', 'artifacts/ci/phpunit.xml', 'artifacts/ci/phpunit-clover.xml', 'frontend/coverage/frontend/coverage-summary.json', 'artifacts/playwright-results.json', 'artifacts/rnf-01.json'] as $path) {
    if (is_file($root.'/'.$path)) {
        $summary['report_sha256'][$path] = hash_file('sha256', $root.'/'.$path);
    }
}
if (! is_dir(dirname($output))) {
    mkdir(dirname($output), 0777, true);
}
file_put_contents($output, json_encode($summary, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR).PHP_EOL);
echo 'Resumen de métricas exportado; reportes ausentes: '.count($summary['missing_reports']).PHP_EOL;
