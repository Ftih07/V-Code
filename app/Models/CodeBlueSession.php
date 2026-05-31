<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CodeBlueSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'patient_id', 'leader_name', 'recorder_name', 'team_members', 'incident_type',
        'start_time', 'end_time', 'duration_seconds', 'status', 'additional_notes',
        'assessment_condition', 'ttv_time', 'ttv_td', 'ttv_nadi', 'ttv_rr', 'ttv_spo2', 'ttv_gcs',
        'evaluation_result', 'evaluation_plan', 'audio_path',
    ];

    protected $casts = [
        'team_members' => 'array',
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
