<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // CADASTRO
    public function register(Request $request)
    {
        $request->validate(
            [
                'name' => 'required|string',
                'email' => 'required|email|unique:users',
                'password' => 'required|min:8|confirmed',
            ],
            [
                'name.required' => 'Informe seu nome.',
                'email.required' => 'Informe um e-mail.',
                'email.email' => 'Informe um e-mail válido.',
                'email.unique' => 'Este e-mail já está cadastrado.',
                'password.required' => 'Informe uma senha.',
                'password.min' => 'A senha deve ter pelo menos 8 caracteres.',
                'password.confirmed' => 'As senhas não coincidem.',
            ]
        );

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'Cadastro realizado com sucesso.',
            'user' => $user,
        ], 201);
    }

    // LOGIN
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::guard('web')->attempt(
            $request->only('email', 'password')
        )) {
            return response()->json([
                'message' => 'E-mail ou senha incorretos.',
            ], 401);
        }

        $request->session()->regenerate();

        return response()->json([
            'message' => 'Login realizado com sucesso.',
            'user' => Auth::guard('web')->user(),
        ]);
    }

    // LOGOUT
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logout realizado com sucesso.',
        ]);
    }
}
