<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ApiController extends Controller
{
    public function buscarCep($cep)
    {
        $response = Http::timeout(5)
            ->get("https://viacep.com.br/ws/{$cep}/json/");

        if ($response->failed()) {
            Log::error('Falha ao consultar ViaCEP');

            return response()->json([
                'message' => 'Serviço indisponível'
            ], 502);
        }

        return response()->json(
            $response->json()
        );
    }
}