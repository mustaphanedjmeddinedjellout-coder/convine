<?php

use App\Http\Controllers\Admin\CustomerController as AdminCustomerController;
use App\Http\Controllers\Admin\WeddingController as AdminWeddingController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\InvitationController;
use App\Http\Controllers\WeddingController;
use Illuminate\Support\Facades\Route;

// CSRF and authentication routes need the session, so run them under the
// `web` middleware group which boots the session store for the request.
Route::middleware('web')->group(function () {
    Route::get('/csrf', fn () => response()->json(['token' => csrf_token()]));

    Route::get('/invite/{token}', [InvitationController::class, 'show']);
    Route::post('/invite/{token}/rsvp', [InvitationController::class, 'rsvp']);

    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::middleware('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);

        Route::middleware('admin')->prefix('admin')->group(function () {
            Route::get('/weddings', [AdminWeddingController::class, 'index']);
            Route::post('/customers', [AdminCustomerController::class, 'store']);
        });

        Route::get('/wedding', [WeddingController::class, 'show']);
        Route::patch('/wedding', [WeddingController::class, 'update']);
        Route::put('/wedding/guests', [GuestController::class, 'sync']);
    });
});
