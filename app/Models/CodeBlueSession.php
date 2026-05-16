<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CodeBlueSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'patient_id',
        'start_time',
        'end_time',
        'duration_seconds',
        'final_transcription',
        'status',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function logs()
    {
        return $this->hasMany(SessionLog::class, 'session_id');
    }
}
