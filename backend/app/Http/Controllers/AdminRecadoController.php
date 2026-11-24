<?php

namespace App\Http\Controllers;

use App\Models\Recado;
use Illuminate\Http\Request;

class AdminRecadoController extends Controller
{
    public function index()
    {
        $recados = Recado::with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($recados);
    }
}