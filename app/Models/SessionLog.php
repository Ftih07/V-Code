<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SessionLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_id',
        'time_mark',
        'action_text',
    ];

    public function session()
    {
        return $this->belongsTo(CodeBlueSession::class, 'session_id');
    }
}
