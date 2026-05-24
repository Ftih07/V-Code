<?php

// ============================================================
// File: app/Models/ClassifyRule.php
// ============================================================

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClassifyRule extends Model
{
    protected $fillable = [
        'keyword',
        'match_mode',
        'category',
        'target_field',
        'priority',
        'is_active',
        'notes',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'priority' => 'integer',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('priority');
    }
}
