<?php

namespace App\Providers;

use App\Support\TestDatabaseSafety;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Rechaza solicitudes del servidor E2E si su destino de datos deja de ser seguro.
     */
    public function boot(): void
    {
        if (getenv('ACADEMICA_E2E') === '1') {
            TestDatabaseSafety::assertSafe($this->app);
        }
    }
}
