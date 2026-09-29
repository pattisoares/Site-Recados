<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RecadoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        if ($this->isMethod('post')) {
            return [
                'titulo' => 'required|string|max:100',
                'texto'  => 'required|string',
            ];
        }

        return [
            'titulo' => 'sometimes|string|max:100',
            'texto'  => 'sometimes|string',
        ];
    }
}