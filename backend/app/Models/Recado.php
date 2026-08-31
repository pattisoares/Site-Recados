<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Recado extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'titulo',
        'texto',
    ];

    // relacionamento: cada recado pertence a um usuário
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
