<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\StoreController;
use Illuminate\Support\Facades\Route;

// Rotas públicas
Route::post('/login', [AuthController::class, 'login']);

// Rotas protegidas por autenticação
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Stores
    Route::get('/stores', [StoreController::class, 'index']);
    Route::get('/stores/{store}', [StoreController::class, 'show']);

    // Packages
    Route::get('/packages', [PackageController::class, 'index']);
    Route::post('/packages', [PackageController::class, 'store']);
    Route::get('/packages/{package}', [PackageController::class, 'show']);
    Route::post('/packages/{package}/collect', [PackageController::class, 'collect']);
    Route::patch('/packages/{package}/return', [PackageController::class, 'markAsReturned']);
    Route::delete('/packages/{package}', [PackageController::class, 'destroy']);
});