<?php

use App\Http\Controllers\CodeBlueController;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
// Controller
use Illuminate\Support\Facades\Route;
use Laravel\Socialite\Facades\Socialite;

// HACK DEMO MVP: Auto-Login & Bypass Welcome Screen
Route::get('/', function () {
    // 1. Cari user ID 1, atau bikin otomatis kalau database masih kosong
    $demoUser = User::firstOrCreate(
        ['email' => 'demo@vcode.com'], // Patokan pencarian
        [
            'name' => 'Dokumentator Demo',
            'password' => bcrypt('password123'),
            'email_verified_at' => now(),
        ]
    );

    // 2. Paksa sistem untuk login menggunakan user tersebut
    Auth::login($demoUser);

    // 3. Langsung lempar ke dalam aplikasi
    return redirect()->route('dashboard');
})->name('home');

// ─── ENDPOINT API STT & DEBUG LOG ───
Route::post('/api/transcribe', [CodeBlueController::class, 'transcribe'])->name('api.transcribe');
// Endpoint untuk menyimpan log debug dari proses STT di frontend (misal: waktu pengiriman audio, hasil transkripsi sementara, error, dll)
Route::post('/api/code-blue/debug-log', [CodeBlueController::class, 'storeDebugLog'])->name('api.debug-log');
// View untuk melihat log debug untuk bantuan debugging
Route::get('/api/code-blue/debug-log/{sessionId}', [CodeBlueController::class, 'getDebugLogs'])->name('api.get-debug-log');

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [CodeBlueController::class, 'index'])->name('dashboard');
    Route::get('/riwayat', [CodeBlueController::class, 'history'])->name('riwayat');

    Route::get('/record/setup', [CodeBlueController::class, 'setup'])->name('record.setup');
    Route::post('/record/setup', [CodeBlueController::class, 'startSession'])->name('record.start');

    // ↓ ROUTE BARU — harus di atas /record/{patient} supaya tidak
    //   bertabrakan dengan wildcard parameter {patient}
    Route::get('/record/classify-rules', [CodeBlueController::class, 'classifyRules'])
        ->name('record.classify-rules');

    Route::get('/record/{patient}', [CodeBlueController::class, 'create'])->name('record.create');

    Route::post('/record/store-draft', [CodeBlueController::class, 'storeDraft'])->name('record.store-draft');
    Route::get('/record/summary/{codeBlueSession}', [CodeBlueController::class, 'summary'])->name('record.summary');

    Route::get('/draft/{codeBlueSession}', [CodeBlueController::class, 'edit'])->name('draft.edit');
    Route::put('/draft/{codeBlueSession}', [CodeBlueController::class, 'update'])->name('draft.update');

    // Debug log endpoints (sudah ada sebelumnya, pastikan tetap ada)
    Route::post('/api/code-blue/debug-log', [CodeBlueController::class, 'storeDebugLog']);
    Route::get('/api/code-blue/debug-logs/{sessionId}', [CodeBlueController::class, 'getDebugLogs']);
});

Route::get('/auth/google/redirect', function () {
    return Socialite::driver('google')->redirect();
})->name('google.login');

Route::get('/auth/google/callback', function () {
    $googleUser = Socialite::driver('google')->user();

    $user = User::where('email', $googleUser->email)->first();

    if ($user) {
        $user->update(['google_id' => $googleUser->id]);
    } else {
        $user = User::create([
            'name' => $googleUser->name,
            'email' => $googleUser->email,
            'google_id' => $googleUser->id,
            'email_verified_at' => now(),
        ]);
    }

    if ($user->two_factor_secret) {
        session()->put([
            'login.id' => $user->id,
            'login.remember' => true,
        ]);

        return redirect()->route('two-factor.login');
    }

    Auth::login($user, true);

    return redirect()->intended('/dashboard');
});

require __DIR__.'/settings.php';
