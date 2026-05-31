<?php

use App\Http\Controllers\CodeBlueController;
use App\Models\Faq;
use App\Models\Feature;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;

// Route bawaan Breeze (sudah diperbaiki, tidak ada lagi duplicate)
Route::get('/', function () {
    return Inertia::render('welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,

        // Lempar data dinamis ke React
        'faqs' => Faq::where('is_active', true)->get()->map(fn ($faq) => [
            'q' => $faq->question,
            'a' => $faq->answer,
        ]),
        'features' => Feature::orderBy('order')->get()->map(fn ($feat) => [
            'title' => $feat->title,
            'desc' => $feat->desc,
            'color' => $feat->color,
            'icon' => $feat->icon_svg, // Raw SVG string
        ]),
        // Kamu juga bisa melakukan hal yang sama untuk 'steps'
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // ─── ENDPOINT API STT & DEBUG LOG ───
    Route::post('/api/transcribe', [CodeBlueController::class, 'transcribe'])->name('api.transcribe');
    // Endpoint untuk menyimpan log debug dari proses STT di frontend (misal: waktu pengiriman audio, hasil transkripsi sementara, error, dll)
    Route::post('/api/code-blue/debug-log', [CodeBlueController::class, 'storeDebugLog'])->name('api.debug-log');
    // View untuk melihat log debug untuk bantuan debugging
    Route::get('/api/code-blue/debug-log/{sessionId}', [CodeBlueController::class, 'getDebugLogs'])->name('api.get-debug-log');

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

Route::get('/test-403', function () {
    abort(503);
});

require __DIR__.'/settings.php';
