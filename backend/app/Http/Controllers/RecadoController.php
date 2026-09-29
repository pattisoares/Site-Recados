<?php

namespace App\Http\Controllers;

use App\Models\Recado;
use App\Http\Requests\RecadoRequest;

class RecadoController extends Controller
{
    // LISTAR recados do usuário logado
    public function index()
    {
        return auth()->user()->recados;
    }

    // CRIAR recado
    public function store(RecadoRequest $request)
    {
        return auth()->user()->recados()->create([
            'titulo' => $request->titulo,
            'texto'  => $request->texto,
        ]);
    }

    // ATUALIZAR recado
    public function update(RecadoRequest $request, $id)
    {
        $recado = Recado::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        $recado->update($request->only('titulo', 'texto'));

        return response()->json($recado);
    }

    // EXIBIR recado
    public function show($id)
    {
        return Recado::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();
    }

    // DELETAR recado
    public function destroy($id)
    {
        $recado = Recado::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        $recado->delete();

        return response()->json([
            'message' => 'Recado deletado com sucesso',
        ], 200);
    }
}
