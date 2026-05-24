<?php

// ============================================================
// File: app/Observers/VCodeCacheBuster.php
// ============================================================
// Daftarkan di AppServiceProvider::boot():
//
//   \App\Models\MedicalPhrase::observe(\App\Observers\VCodeCacheBuster::class);
//   \App\Models\WordCorrection::observe(\App\Observers\VCodeCacheBuster::class);
//   \App\Models\ClassifyRule::observe(\App\Observers\VCodeCacheBuster::class);
// ============================================================

namespace App\Observers;

use Illuminate\Support\Facades\Cache;

class VCodeCacheBuster
{
    public function saved($model): void
    {
        $this->bust();
    }

    public function deleted($model): void
    {
        $this->bust();
    }

    private function bust(): void
    {
        Cache::forget('vcode_medical_phrases');
        Cache::forget('vcode_medical_phrases_grouped');
        Cache::forget('vcode_classify_rules');
        Cache::forget('vcode_classify_rules_api');
        Cache::forget('vcode_word_corrections');
    }
}
