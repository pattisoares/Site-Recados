<?php

namespace App\Http\Controllers;

use App\Models\Recado;
use App\Http\Requests\RecadoRequest;
use App\Http\Resources\RecadoResource;
use App\Http\Requests\AnexoRequest;
use Illuminate\Support\Facades\Storage;

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
        $caminhoAnexo = null;
        $nomeAnexo = null;

        if ($request->hasFile('anexo')) {
            $arquivo = $request->file('anexo');

            $caminhoAnexo = $arquivo->store('recados', 'public');
            $nomeAnexo = $arquivo->getClientOriginalName();
        }

        $recado = auth()->user()->recados()->create([
            'titulo'     => $request->titulo,
            'texto'      => $request->texto,
            'anexo'      => $caminhoAnexo,
            'nome_anexo' => $nomeAnexo,
        ]);

$validated['user_id'] = Auth::id();

        return new RecadoResource($recado);
    }

    // EXIBIR recado
    public function show($id)
    {
        $recado = Recado::findOrFail($id);

        $this->authorize('view', $recado);

        return new RecadoResource($recado);
    }

    // ATUALIZAR recado
    public function update(RecadoRequest $request, $id)
    {
        $recado = Recado::where('user_id', Auth::id())->findOrFail($id);

        $recado = Recado::findOrFail($id);

        $this->authorize('update', $recado);

        $dados = $request->only('titulo', 'texto');

        if ($request->hasFile('anexo')) {
            if ($recado->anexo) {
                Storage::disk('public')->delete($recado->anexo);
            }

            $arquivo = $request->file('anexo');

            $dados['anexo'] = $arquivo->store('recados', 'public');
            $dados['nome_anexo'] = $arquivo->getClientOriginalName();
        }

        $recado->update($dados);

        return new RecadoResource($recado);
    }

    // DELETAR recado
    public function destroy($id)
    {
        $recado = Recado::findOrFail($id);

        $this->authorize('delete', $recado);

        $recado->delete();

        return response()->json([
            'message' => 'Recado deletado com sucesso',
        ], 200);
    }

    // UPLOAD DO ANEXO
    public function uploadAnexo(AnexoRequest $request, $id)
    {
        $recado = Recado::findOrFail($id);

        $this->authorize('update', $recado);

        if ($recado->anexo) {
            Storage::disk('public')->delete($recado->anexo);
        }

        $arquivo = $request->file('anexo');

        $caminhoAnexo = $arquivo->store('recados', 'public');
        $nomeAnexo = $arquivo->getClientOriginalName();

        $recado->update([
            'anexo'      => $caminhoAnexo,
            'nome_anexo' => $nomeAnexo,
        ]);

        return new RecadoResource($recado);
    }

    // DOWNLOAD DO ANEXO
    public function downloadAnexo($id)
    {
        $recado = Recado::findOrFail($id);

        $this->authorize('view', $recado);

        if (!$recado->anexo) {
            return response()->json([
                'message' => 'Este recado não possui anexo.'
            ], 404);
        }

        return Storage::disk('public')->response($recado->anexo);
    }
}
