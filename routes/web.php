<?php

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use Laravel\Socialite\Facades\Socialite;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::get('/auth/google/redirect', function () {
    return Socialite::driver('google')->redirect();
})->name('google.login');

Route::get('/auth/google/callback', function () {
    $googleUser = Socialite::driver('google')->user();

    // 1. Cari atau buat user berdasarkan email
    $user = User::where('email', $googleUser->email)->first();

    if ($user) {
        $user->update(['google_id' => $googleUser->id]);
    } else {
        $user = User::create([
            'name' => $googleUser->name,
            'email' => $googleUser->email,
            'google_id' => $googleUser->id,
            'email_verified_at' => now(), // Otomatis verified jika via Google
        ]);
    }

    // 2. CEK 2FA: Apakah user ini mengaktifkan 2FA?
    if ($user->two_factor_secret) {
        // Simpan sesi sementara untuk Fortify
        session()->put([
            'login.id' => $user->id,
            'login.remember' => true, // Ingat sesi setelah OTP sukses
        ]);

        // Lempar ke halaman input OTP bawaan Fortify
        return redirect()->route('two-factor.login');
    }

    // 3. JIKA TANPA 2FA: Langsung login dan paksa fitur "Remember Me" aktif
    Auth::login($user, true);

    return redirect()->intended('/dashboard');
});

require __DIR__.'/settings.php';
