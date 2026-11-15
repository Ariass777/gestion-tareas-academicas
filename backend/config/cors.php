<?php

return [
    'paths' => ['api/*'],
    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    'allowed_origins' => array_values(array_unique(array_filter([
        env('FRONTEND_URL', 'http://127.0.0.1:4200'),
        'http://localhost:4200',
    ]))),
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['Content-Type', 'Accept'],
    'exposed_headers' => [],
    'max_age' => 600,
    'supports_credentials' => false,
];
