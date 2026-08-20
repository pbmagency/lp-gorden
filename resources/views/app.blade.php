<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    @unless(request()->is('/'))
        <script>
            (function () {
                const appearance = '{{ $appearance ?? 'system' }}';
                if (appearance === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.add('dark');
                }
            })();
        </script>
        <style>
            html { background-color: oklch(1 0 0); }
            html.dark { background-color: oklch(0.145 0 0); }
        </style>
    @else
        <style>
            html, body { background-color: oklch(0.97 0.015 85) !important; }
        </style>
    @endunless

    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    @unless(request()->is('/'))
        <meta name="csrf-token" content="{{ csrf_token() }}">
    @endunless

    @if(request()->is('/'))
        <link rel="preload" href="/assets/hero-gorden.webp" as="image" type="image/webp" fetchpriority="high">
    @endif

    @viteReactRefresh
    @if(request()->is('/'))
        @vite('resources/js/landing-loader.ts')
    @else
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @endif
    <x-inertia::head>
        <title>{{ config('app.name') }}</title>
    </x-inertia::head>
</head>

<body @class(['antialiased', 'font-sans' => ! request()->is('/')]) @if(request()->is('/')) style="background-color: oklch(0.97 0.015 85) !important;" @endif>
    <x-inertia::app />

    {{-- Marketing scripts stay outside the startup path. They load after the
         visitor interacts or after a generous post-load idle window. --}}
    <script>
        (function () {
            let loaded = false;

            function loadMarketingScripts() {
                if (loaded) return;
                loaded = true;

                window.dataLayer = window.dataLayer || [];
                window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
                window.gtag('js', new Date());
                window.gtag('config', 'G-7DZSEDBHZY');

                const ga = document.createElement('script');
                ga.async = true;
                ga.src = 'https://www.googletagmanager.com/gtag/js?id=G-7DZSEDBHZY';
                document.head.appendChild(ga);

                (function (c, l, a, r, i, t, y) {
                    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
                    t = l.createElement(r);
                    t.async = true;
                    t.src = 'https://www.clarity.ms/tag/' + i;
                    y = l.getElementsByTagName(r)[0];
                    y.parentNode.insertBefore(t, y);
                })(window, document, 'clarity', 'script', 'wv3d64uo3o');

                (function (f, b, e, v, n, t, s) {
                    if (f.fbq) return;
                    n = f.fbq = function () {
                        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
                    };
                    if (!f._fbq) f._fbq = n;
                    n.push = n;
                    n.loaded = true;
                    n.version = '2.0';
                    n.queue = [];
                    t = b.createElement(e);
                    t.async = true;
                    t.src = v;
                    s = b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t, s);
                })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

                fbq('init', '{{ config('services.meta.pixel_id', 'YOUR_PIXEL_ID') }}');
                const eventId = crypto.randomUUID
                    ? crypto.randomUUID()
                    : Date.now() + '-' + Math.random().toString(36).substring(2, 11);
                fbq('track', 'PageView', {}, { eventID: eventId });
                fbq('track', 'ViewContent', {}, { eventID: eventId });

                (function (w, d) {
                    if (w.__plerdyCode) return;
                    w.__plerdyCode = 1;
                    w._protocol = w.location.protocol === 'https:' ? 'https://' : 'http://';
                    w._site_hash_code = 'e5ad2bad413372216eb0cbf6646f35c3';
                    w._suid = 79951;
                    const script = d.createElement('script');
                    script.async = true;
                    script.referrerPolicy = 'strict-origin-when-cross-origin';
                    script.src = 'https://a.plerdy.com/public/js/click/main.js';
                    d.head.appendChild(script);
                })(window, document);
            }

            function scheduleMarketingScripts() {
                window.setTimeout(loadMarketingScripts, 1500);
            }

            ['pointerdown', 'keydown'].forEach(function (eventName) {
                window.addEventListener(eventName, scheduleMarketingScripts, {
                    once: true,
                    passive: eventName !== 'keydown'
                });
            });

            window.addEventListener('load', function () {
                window.setTimeout(function () {
                    if ('requestIdleCallback' in window) {
                        window.requestIdleCallback(loadMarketingScripts, { timeout: 4000 });
                    } else {
                        loadMarketingScripts();
                    }
                }, 10000);
            }, { once: true });
        })();
    </script>
</body>

</html>
