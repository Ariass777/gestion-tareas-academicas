<?php

namespace Tests;

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use RuntimeException;

abstract class TestCase extends BaseTestCase
{
    public function createApplication(): Application
    {
        $app = parent::createApplication();
        if (! $app->environment('testing') || config('database.default') !== 'mysql' || config('database.connections.mysql.url')
            || ! str_ends_with((string) config('database.connections.mysql.database'), '_testing')) {
            throw new RuntimeException('Las pruebas solo pueden usar una base MySQL cuyo nombre termine en _testing.');
        }

        return $app;
    }
}
