<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\Middleware\RequirePassword;
use Illuminate\Http\Request;

class CheckPasswordOrGoogle extends RequirePassword
{
    /**
     * Handle an incoming request.
     */
    public function handle($request, Closure $next, $redirectToRoute = null, $passwordTimeoutSeconds = null)
    {
        $user = $request->user();

        if ($user && $user->google_id && empty($user->password)) {
            return $next($request);
        }

        return parent::handle($request, $next, $redirectToRoute, $passwordTimeoutSeconds);
    }
}
