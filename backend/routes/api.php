<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BoardController;
use App\Http\Controllers\Api\ColumnController;
use App\Http\Controllers\Api\TaskController;

Route::prefix('api')->group(function () {
    // Auth routes
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        // Auth routes
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        // Board routes
        Route::get('/boards', [BoardController::class, 'index']);
        Route::post('/boards', [BoardController::class, 'store']);
        Route::get('/boards/{board}', [BoardController::class, 'show']);
        Route::put('/boards/{board}', [BoardController::class, 'update']);
        Route::delete('/boards/{board}', [BoardController::class, 'destroy']);
        Route::post('/boards/{board}/invite', [BoardController::class, 'invite']);

        // Column routes
        Route::post('/boards/{board}/columns', [ColumnController::class, 'store']);
        Route::put('/boards/{board}/columns/{column}', [ColumnController::class, 'update']);
        Route::delete('/boards/{board}/columns/{column}', [ColumnController::class, 'destroy']);

        // Task routes
        Route::get('/boards/{board}/tasks', [TaskController::class, 'index']);
        Route::post('/boards/{board}/tasks', [TaskController::class, 'store']);
        Route::put('/boards/{board}/tasks/{task}', [TaskController::class, 'update']);
        Route::delete('/boards/{board}/tasks/{task}', [TaskController::class, 'destroy']);
        Route::post('/boards/{board}/tasks/{task}/assign', [TaskController::class, 'assign']);
        Route::post('/boards/{board}/tasks/reorder', [TaskController::class, 'reorder']);
    });
});
