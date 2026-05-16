<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;

    protected $fillable = [
        'rm_number',
        'name',
        'ward_location',
    ];

    public function sessions()
    {
        return $this->hasMany(CodeBlueSession::class);
    }
}
