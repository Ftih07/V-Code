<?php

// ============================================================
// File: app/Models/WordCorrection.php
// ============================================================

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WordCorrection extends Model
{
    protected $fillable = [
        'wrong_text',
        'correct_text',
        'match_mode',
        'is_active',
        'hit_count',
        'notes',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'hit_count' => 'integer',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
