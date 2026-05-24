<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SttDebugLog extends Model
{
    protected $fillable = [
        'patient_id',
        'session_id',
        'time_mark',
        'type',
        'message',
    ];
}
