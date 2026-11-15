<?php

namespace Tests\Feature;

use App\Support\TestDatabaseSafety;
use Illuminate\Foundation\Application;
use LogicException;
use Mockery;
use Tests\TestCase;

class TestDatabaseSafetyTest extends TestCase
{
    public function test_acepta_una_base_mysql_de_pruebas_explicita(): void
    {
        TestDatabaseSafety::assertSafe($this->app);
        $this->assertTrue(true);
    }

    public function test_rechaza_una_base_de_desarrollo_heredada(): void
    {
        config(['database.connections.mysql.database' => 'gestion_tareas_academicas']);
        $this->expectException(LogicException::class);
        TestDatabaseSafety::assertSafe($this->app);
    }

    public function test_rechaza_redireccion_por_db_url(): void
    {
        config(['database.connections.mysql.url' => 'mysql://localhost/otra_base']);
        $this->expectException(LogicException::class);
        TestDatabaseSafety::assertSafe($this->app);
    }

    public function test_rechaza_una_conexion_distinta_de_mysql(): void
    {
        config(['database.default' => 'sqlite']);
        $this->expectException(LogicException::class);
        TestDatabaseSafety::assertSafe($this->app);
    }

    public function test_rechaza_un_entorno_de_desarrollo(): void
    {
        $this->app->detectEnvironment(fn (): string => 'local');
        $this->expectException(LogicException::class);
        TestDatabaseSafety::assertSafe($this->app);
    }

    public function test_rechaza_configuracion_cacheada_antes_de_conectar(): void
    {
        $application = Mockery::mock(Application::class)->makePartial();
        $application->shouldReceive('configurationIsCached')->once()->andReturn(true);
        $this->expectException(LogicException::class);
        TestDatabaseSafety::assertSafe($application);
    }

    public function test_rechaza_fallback_si_falta_env_testing(): void
    {
        $application = Mockery::mock(Application::class)->makePartial();
        $application->shouldReceive('configurationIsCached')->once()->andReturn(false);
        $application->shouldReceive('environmentPath')->once()->andReturn(__DIR__.'/ruta-inexistente');
        $this->expectException(LogicException::class);
        TestDatabaseSafety::assertSafe($application);
    }
}
