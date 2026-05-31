<?php

namespace App\Providers;

use App\Models\ClassifyRule;
use App\Models\MedicalPhrase;
use App\Models\WordCorrection;
use App\Observers\VCodeCacheBuster;
use Carbon\CarbonImmutable;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->registerObservers();

        // Panggil konfigurasi email kustom di sini
        $this->configureEmailVerification();
    }

    /**
     * Configure custom email verification message (No Button/Action).
     */
    protected function configureEmailVerification(): void
    {
        VerifyEmail::toMailUsing(function (object $notifiable, string $url) {
            return (new MailMessage)
                ->subject('Pendaftaran V-Code - Menunggu Persetujuan Admin')
                ->greeting('Halo, '.$notifiable->name.'!')
                ->line('Terima kasih telah mendaftar di V-Code (Sistem Dokumentasi Code Blue).')
                ->line('Demi menjaga keamanan data EMR, akun Anda saat ini sedang ditinjau oleh Administrator kami.')
                ->line('Anda belum bisa mengakses sistem hingga akun Anda disetujui. Silakan tunggu informasi lebih lanjut dari kami.')
                // Tidak ada ->action() di sini, otomatis tombol dan link panjang di bawahnya hilang
                ->salutation('Salam Hangat, Tim V-Code');
        });
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }

    /**
     * Register model observers.
     */
    protected function registerObservers(): void
    {
        MedicalPhrase::observe(VCodeCacheBuster::class);
        WordCorrection::observe(VCodeCacheBuster::class);
        ClassifyRule::observe(VCodeCacheBuster::class);
    }
}
