<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
        $exceptions->respond(function (Response $response) {
            if (! request()->is('api/*') || $response->getStatusCode() < 400) {
                return $response;
            }
            $status = $response->getStatusCode();
            $body = json_decode($response->getContent(), true) ?? [];
            $errors = $body['errors'] ?? [];
            $message = match ($status) {
                404 => 'El recurso solicitado no existe',
                422 => count($errors) ? (array_values($errors)[0][0] ?? 'Revisa los datos ingresados') : 'Revisa los datos ingresados',
                405 => 'Método HTTP no permitido',
                429 => 'Demasiadas solicitudes. Intenta de nuevo en un momento',
                default => $status >= 500 ? 'No se pudo procesar la solicitud. Intenta de nuevo' : 'No se pudo realizar la solicitud',
            };

            return response()->json($errors ? ['message' => $message, 'errors' => $errors] : ['message' => $message], $status, $response->headers->all());
        });
    })->create();
