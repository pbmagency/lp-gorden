<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>

<head>
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-MMM4GGBQ');</script>
    <!-- End Google Tag Manager -->

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

    @php
        $faviconV = [
            'ico' => file_exists(public_path('favicon.ico')) ? filemtime(public_path('favicon.ico')) : time(),
            'svg' => file_exists(public_path('favicon.svg')) ? filemtime(public_path('favicon.svg')) : time(),
            '192' => file_exists(public_path('favicon-192.png')) ? filemtime(public_path('favicon-192.png')) : time(),
            'png' => file_exists(public_path('favicon.png')) ? filemtime(public_path('favicon.png')) : time(),
            'apple' => file_exists(public_path('apple-touch-icon.png')) ? filemtime(public_path('apple-touch-icon.png')) : time(),
        ];
    @endphp
    <link rel="icon" href="/favicon.ico?v={{ $faviconV['ico'] }}" sizes="any">
    <link rel="icon" href="/favicon.svg?v={{ $faviconV['svg'] }}" type="image/svg+xml">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-192.png?v={{ $faviconV['192'] }}">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png?v={{ $faviconV['png'] }}">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v={{ $faviconV['apple'] }}">
    <link rel="manifest" href="/site.webmanifest">
    @unless(request()->is('/'))
        <meta name="csrf-token" content="{{ csrf_token() }}">
    @endunless

    @if(request()->is('/'))
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=poppins:400,500,600,700&display=swap" rel="stylesheet">
        <link rel="preload" href="/assets/hero-gorden.webp" as="image" type="image/webp" fetchpriority="high">
    @endif

    @viteReactRefresh
    @if(request()->is('/'))
        @vite('resources/js/landing-loader.ts')
    @else
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @endif
<x-inertia::head>
    <title>
        @if(request()->is('/'))
            Gorden Custom Solo Raya, Terima Beres Ukur &amp; Pasang
        @else
            {{ config('app.name') }}
        @endif
    </title>
</x-inertia::head>
</head>

<body @class(['antialiased', 'font-sans' => ! request()->is('/')]) @if(request()->is('/')) style="background-color: oklch(0.97 0.015 85) !important;" @endif>
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MMM4GGBQ"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
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

                (function(c, l, a, r, i, t, y) {
                c[a] = c[a] || function() { (c[a].q = c[a].q || []).push(arguments) };
                t = l.createElement(r); t.async = 1;
                t.src = "https://www.clarity.ms/tag/" + i;
                y = l.getElementsByTagName(r)[0];
                y.parentNode.insertBefore(t, y);
            })(window, document, "clarity", "script", "y5mfs5rh07");

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
