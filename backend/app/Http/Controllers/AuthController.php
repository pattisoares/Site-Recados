<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // =========================
    // REGISTER
    // =========================
    public function register(Request $request)
    {
        $request->validate(
            [
                'name' => 'required',
                'email' => 'required|email|unique:users',
                'password' => 'required|min:6|confirmed',
            ],
            [
                'name.required' => 'Informe seu nome.',

                'email.required' => 'Informe um e-mail.',
                'email.email' => 'Informe um e-mail válido.',
                'email.unique' => 'Este e-mail já está cadastrado.',

                'password.required' => 'Informe uma senha.',
                'password.min' => 'A senha deve ter pelo menos 6 caracteres.',
                'password.confirmed' => 'As senhas não coincidem.',
            ]
        );

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ], 201);
    }

    // =========================
    // LOGIN
    // =========================
    public function login(Request $request)
{
    $request->validate(
        [
            'email' => 'required|email',
            'password' => 'required',
        ],
        [
            'email.required' => 'Informe um e-mail.',
            'email.email' => 'Informe um e-mail válido.',
            'password.required' => 'Informe uma senha.',
        ]
    );

    if (!Auth::attempt($request->only('email', 'password'))) {
        return response()->json([
            'message' => 'E-mail ou senha incorretos.'
        ], 401);
    }

    $user = $request->user();

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'user' => $user,
        'token' => $token
    ]);
}
    // =========================
    // LOGOUT
    // =========================
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout realizado.'
        ]);
    }
}