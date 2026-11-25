<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CriarAdmin extends Command
{
    protected $signature = 'admin:criar';

    protected $description = 'Cria um usuário administrador';

    public function handle(): int
    {
        $name = $this->ask('Nome do administrador');
        $email = $this->ask('E-mail do administrador');

        if (User::where('email', $email)->exists()) {
            $this->error('Este e-mail já está cadastrado.');
            return self::FAILURE;
        }

        $password = $this->secret('Digite a senha');
        $confirmation = $this->secret('Confirme a senha');

        if ($password !== $confirmation) {
            $this->error('As senhas não coincidem.');
            return self::FAILURE;
        }

        if (strlen($password) < 8) {
            $this->error('A senha deve ter pelo menos 8 caracteres.');
            return self::FAILURE;
        }

        $admin = new User();
        $admin->name = $name;
        $admin->email = $email;
        $admin->password = Hash::make($password);
        $admin->role = 'admin';
        $admin->save();

        $this->info('Administrador criado com sucesso!');

        return self::SUCCESS;
    }
}
