<?php

namespace App\Policies;

use App\Models\Recado;
use App\Models\User;

class RecadoPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Recado $recado): bool
    {
        return $user->id === $recado->user_id
            || $user->isAdmin();
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Recado $recado): bool
    {
        return $user->id === $recado->user_id;
    }

    public function delete(User $user, Recado $recado): bool
    {
        return $user->id === $recado->user_id;
    }

    public function restore(User $user, Recado $recado): bool
    {
        return false;
    }

    public function forceDelete(User $user, Recado $recado): bool
    {
        return false;
    }
}