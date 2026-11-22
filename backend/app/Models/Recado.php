
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recado extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'titulo',
        'texto',
        'anexo',
        'nome_anexo',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

