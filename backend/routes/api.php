<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\RecadoController;
use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminRecadoController;

// Rotas públicas
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rotas protegidas pelo Sanctum
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });

    Route::apiResource('recados', RecadoController::class);

    Route::get(
        '/recados/{id}/anexo',
        [RecadoController::class, 'downloadAnexo']
    );

    Route::post(
        '/recados/{id}/anexo',
        [RecadoController::class, 'uploadAnexo']
    );

    Route::get(
        '/cep/{cep}',
        [ApiController::class, 'buscarCep']
    );

    Route::middleware('admin')->get(
    '/admin/recados',
    [AdminRecadoController::class, 'index']
    );
    
    Route::post('/logout', [AuthController::class, 'logout']);
});
