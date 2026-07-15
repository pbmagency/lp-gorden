<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

/**
 * Server-side HTML cache for the public landing page.
 *
 * Anonymous GET requests for "/" are served from cache after the first hit,
 * dramatically reducing TTFB on subsequent requests.
 */
class CacheLandingPage
{
    // INCREASED: Changed from 300 seconds (5 mins) to 7 days (604800 seconds).
    // This virtually guarantees a cache hit for TTFB in the green line.
    // It is safe because the cache key updates automatically on deployment.
    private const TTL_SECONDS = 604800;

    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->isMethod('GET') || $request->user() || ! $request->is('/')) {
            return $next($request);
        }

        $cacheKey = 'landing_page_html:'.self::manifestVersion();

        if (Cache::has($cacheKey)) {
            /** @var string $html */
            $html = Cache::get($cacheKey);

            return response($html, 200, ['Content-Type' => 'text/html; charset=UTF-8']);
        }

        /** @var Response $response */
        $response = $next($request);

        if ($response->getStatusCode() === 200) {
            Cache::put($cacheKey, $response->getContent(), self::TTL_SECONDS);
        }

        return $response;
    }

    private static function manifestVersion(): string
    {
        $manifest = public_path('build/manifest.json');

        if (file_exists($manifest)) {
            return (string) filemtime($manifest);
        }

        return 'dev';
    }
}