<?php

use App\Http\Controllers\CodeBlueController;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
// Controller
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

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [CodeBlueController::class, 'index'])->name('dashboard');

    Route::get('/record/setup', [CodeBlueController::class, 'setup'])->name('record.setup');
    Route::post('/record/setup', [CodeBlueController::class, 'startSession'])->name('record.start');
    Route::get('/record/{patient}', [CodeBlueController::class, 'create'])->name('record.create');

    Route::post('/record/store-draft', [CodeBlueController::class, 'storeDraft'])->name('record.store-draft');
    Route::get('/record/summary/{codeBlueSession}', [CodeBlueController::class, 'summary'])->name('record.summary');

    Route::get('/draft/{codeBlueSession}', [CodeBlueController::class, 'edit'])->name('draft.edit');
    Route::put('/draft/{codeBlueSession}', [CodeBlueController::class, 'update'])->name('draft.update');
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
