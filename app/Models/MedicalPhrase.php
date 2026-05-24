<?php

// ============================================================
// File: app/Models/MedicalPhrase.php
// ============================================================

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedicalPhrase extends Model
{
    protected $fillable = [
        'phrase',
        'category',
        'boost',
        'is_active',
        'notes',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'boost' => 'integer',
    ];

    // Scope: hanya yang aktif
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
