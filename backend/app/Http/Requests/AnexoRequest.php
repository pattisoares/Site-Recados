<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AnexoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'anexo' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ];
    }
}