<?php

namespace Tests;

use App\Support\TestDatabaseSafety;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    public function createApplication(): Application
    {
        $app = parent::createApplication();
        TestDatabaseSafety::assertSafe($app);

        return $app;
    }
}
