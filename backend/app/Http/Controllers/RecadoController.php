<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Recado;

class RecadoController extends Controller
{
    // LISTAR recados do usuário logado
    public function index()
    {
        return auth()->user()->recados;
    }

    // CRIAR recado
    public function store(Request $request)
    {
        $request->validate([
            'titulo' => 'required|string|max:100',
            'texto'  => 'required|string',
        ]);

        return auth()->user()->recados()->create([
            'titulo' => $request->titulo,
            'texto' => $request->texto,
        ]);
    }

    // ATUALIZAR recado
public function update(Request $request, $id)
{
    $request->validate([
        'titulo' => 'sometimes|string|max:100',
        'texto'  => 'sometimes|string',
    ]);

    $recado = Recado::where('id', $id)
        ->where('user_id', auth()->id())
        ->firstOrFail();

    $recado->update($request->only('titulo', 'texto'));

    return response()->json($recado);
}

    // DELETAR recado
    public function destroy($id)
    {
        $recado = Recado::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        $recado->delete();

        return response()->json([
            'message' => 'Recado deletado com sucesso'
        ], 204);
    }
}