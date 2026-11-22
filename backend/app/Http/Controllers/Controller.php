<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Routing\Controller as BaseController;

abstract class Controller extends BaseController
{
    use AuthorizesRequests;
}

$validated = $request->validate([
    'titulo' => 'required|string|max:255',
    'texto' => 'required|string',
]);