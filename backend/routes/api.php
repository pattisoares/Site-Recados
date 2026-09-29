<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\RecadoController;
use App\Http\Controllers\ApiController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Rotas públicas
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Rotas protegidas (Sanctum)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    Route::apiResource('recados', RecadoController::class);

    Route::get(
        '/recados/{id}/anexo',
        [RecadoController::class, 'downloadAnexo']
    );

    Route::get(
        '/cep/{cep}',
        [ApiController::class, 'buscarCep']
    );

    Route::post('/logout', [AuthController::class, 'logout']);
});