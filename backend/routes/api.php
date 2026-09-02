<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RecadoController;

/*
|--------------------------------------------------------------------------
| Rotas públicas
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Rotas protegidas (Sanctum)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    Route::apiResource('recados', RecadoController::class);
    /*
    Route::get('/recados', [RecadoController::class, 'index']);
    Route::post('/recados', [RecadoController::class, 'store']);
    Route::put('/recados/{id}',    [RecadoController::class, 'update']);
    Route::delete('/recados/{id}', [RecadoController::class, 'destroy']);
    */
    
    Route::post('/logout', [AuthController::class, 'logout']);
  
});