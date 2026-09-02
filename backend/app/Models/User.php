<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Recado;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Campos que podem ser preenchidos
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * Relacionamento:
     * Um usuário pode ter vários recados
     */
    public function recados()
    {
        return $this->hasMany(Recado::class);
    }

    /**
     * Campos escondidos no JSON
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Casts (opcional, mas recomendado no Laravel)
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}