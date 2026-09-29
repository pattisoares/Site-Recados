<?php

namespace App\Http\Controllers;

use App\Models\Recado;
use App\Http\Requests\RecadoRequest;
use App\Http\Resources\RecadoResource;

class RecadoController extends Controller
{
    // LISTAR recados do usuário logado
    public function index()
    {
        return RecadoResource::collection(
            auth()->user()->recados
        );
    }

    // CRIAR recado
    public function store(RecadoRequest $request)
    {
        $recado = auth()->user()->recados()->create([
            'titulo' => $request->titulo,
            'texto'  => $request->texto,
        ]);

        return new RecadoResource($recado);
    }

    // ATUALIZAR recado
    public function update(RecadoRequest $request, $id)
    {
        $recado = Recado::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        $recado->update($request->only('titulo', 'texto'));

        return new RecadoResource($recado);
    }

    // EXIBIR recado
    public function show($id)
    {
        $recado = Recado::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        return new RecadoResource($recado);
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
