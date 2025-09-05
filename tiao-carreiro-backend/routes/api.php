<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MusicController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/musics/top5', [MusicController::class, 'top5']);
Route::get('/musics', [MusicController::class, 'index']);
Route::post('/musics', [MusicController::class, 'store']);

// Authentication
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Admin - Songs
    Route::get('/admin/musics/pending', [MusicController::class, 'pending']);
    Route::patch('/admin/musics/{music}/approve', [MusicController::class, 'approve']);
    Route::patch('/admin/musics/{music}/reject', [MusicController::class, 'reject']);
    
    // Full CRUD for admin
    Route::get('/admin/musics/{music}', [MusicController::class, 'show']);
    Route::put('/admin/musics/{music}', [MusicController::class, 'update']);
    Route::delete('/admin/musics/{music}', [MusicController::class, 'destroy']);
});
