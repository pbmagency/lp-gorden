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
        $isLandingPage = $request->is('/') || $request->is('c1-lp');
        if (
            ! $request->isMethod('GET')
            || ! $isLandingPage
            || $request->query->count() > 0
            || $request->header('X-Inertia')
        ) {
            return $next($request);
        }

        $routeSlug = $request->is('/') ? 'home' : 'c1-lp';
        $cacheKey = 'landing_page_html_v3:'.$routeSlug.':'.self::contentVersion();
        $cache = Cache::store('file');
        $html = $cache->get($cacheKey);

        if (is_string($html)) {
            return response(
                $html,
                200,
                [
                    'Content-Type' => 'text/html; charset=UTF-8',
                    'Cache-Control' => 'public, max-age=300, stale-while-revalidate=86400',
                    'X-Landing-Cache' => 'HIT',
                ],
            );
        }

        /** @var Response $response */
        $response = $next($request);

        if ($response->getStatusCode() === 200) {
            $cache->put($cacheKey, $response->getContent(), self::TTL_SECONDS);
            $response->headers->set('X-Landing-Cache', 'MISS');
        }

        return $response;
    }

    private static function contentVersion(): string
    {
        $manifest = public_path('build/manifest.json');
        $template = resource_path('views/app.blade.php');

        $versions = [
            file_exists($manifest) ? filemtime($manifest) : 'dev',
            file_exists($template) ? filemtime($template) : 'no-template',
        ];

        return sha1(implode('|', $versions));
    }
}
