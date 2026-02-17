
<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

/**
 * We wrap these routes in the 'web' middleware group.
 * In Laravel, the 'web' group provides session state, CSRF protection, and cookie encryption.
 */
Route::middleware(['web'])->group(function () {
    // Connection Check
    Route::get('/ping', [AuthController::class, 'ping']);

     // Manual Provisioning (Developer Tool)
    Route::post('/seed-system', [AuthController::class, 'seedAdmin']);
    // Public Auth Routes
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/request-otp', [AuthController::class, 'requestOtp']);
    Route::post('/login-otp', [AuthController::class, 'loginWithOtp']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
    Route::post('/register', [AuthController::class, 'register']);

    /**
     * Named route for password reset link generation.
     */
    Route::get('/reset-password/{token}', function (Request $request, $token) {
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
        return redirect($frontendUrl . '/reset-password?token=' . $token . '&email=' . $request->email);
    })->name('password.reset');

    // Protected Routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/user', [AuthController::class, 'user']);
        Route::post('/logout', [AuthController::class, 'logout']);

        // Superadmin specific
        Route::get('/system-logs', [AuthController::class, 'systemLogs']);
    });
});
