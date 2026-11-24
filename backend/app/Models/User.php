<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]


class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    // Verifica se o usuário é administrador
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

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

