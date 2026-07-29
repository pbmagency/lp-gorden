<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <script>
        (function() {
            const appearance = '{{ $appearance ?? 'system' }}';
            if (appearance === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDark) {
                    document.documentElement.classList.add('dark');
                }
            }
        })();
    </script>

    <style>
        html { background-color: oklch(1 0 0); }
        html.dark { background-color: oklch(0.145 0 0); }
    </style>

    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <link rel="preload" href="/logo/Primary%20Logo.webp" as="image" fetchpriority="high">

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    <x-inertia::head>
        <title>{{ config('app.name') }}</title>
    </x-inertia::head>
</head>

<body class="font-sans antialiased">
    <x-inertia::app />

    <!-- SSR Skeleton: Triggers LCP and FCP instantly before React boots -->
    <div id="ssr-skeleton" style="position: absolute; top: 0; left: 0; width: 100%; height: 100vh; background: #fff; z-index: 999999; padding-top: 6rem; padding-left: 1rem; padding-right: 1rem; box-sizing: border-box;">
        <div style="max-width: 72rem; margin: 0 auto;">
            <h1 style="font-size: 2.25rem; font-weight: 900; line-height: 1.25; color: #151515; font-family: 'Nunito', system-ui, sans-serif;">
                @if (($page['component'] ?? '') === 'test-pages/cycle6-angle/test-1')
                    Capai <span style="color: #D70808">Skor TOEFL 500+</span> Agar <span style="color: #D70808">Submission Beasiswamu Tidak Gagal</span> Hanya Karena TOEFL
                @else
                    Capai <span style="color: #D70808">TOEFL 500+ Dalam 15 Hari</span> Untuk LPDP Dan CPNS Yang <span style="color: #D70808">Sisa 3 Minggu Lagi</span>
                @endif
            </h1>
        </div>
    </div>

    <script>
        // Delete the skeleton the exact millisecond React finishes booting
        const observer = new MutationObserver((mutations, obs) => {
            const app = document.getElementById('app');
            if (app && app.children.length > 0) {
                setTimeout(() => {
                    const skeleton = document.getElementById('ssr-skeleton');
                    if (skeleton) skeleton.remove();
                }, 50);
                obs.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    </script>

    <!-- Microsoft Clarity -->
    <script>
        window.addEventListener('load', function() {
            (function(c, l, a, r, i, t, y) {
                c[a] = c[a] || function() { (c[a].q = c[a].q || []).push(arguments) };
                t = l.createElement(r); t.async = 1;
                t.src = "https://www.clarity.ms/tag/" + i;
                y = l.getElementsByTagName(r)[0];
                y.parentNode.insertBefore(t, y);
            })(window, document, "clarity", "script", "wv3d64uo3o");
        });
    </script>

    <!-- Meta Pixel -->
    <script>
        window.addEventListener('load', function() {
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '{{ config('services.meta.pixel_id', 'YOUR_PIXEL_ID') }}');
            window.__META_PAGE_VIEW_EVENT_ID = crypto.randomUUID
                ? crypto.randomUUID()
                : Date.now() + '-' + Math.random().toString(36).substring(2, 11);
            fbq('track', 'PageView', {}, { eventID: window.__META_PAGE_VIEW_EVENT_ID });
        });
    </script>
    <noscript><img height="1" width="1" style="display:none"
        src="https://www.facebook.com/tr?id={{ config('services.meta.pixel_id', 'YOUR_PIXEL_ID') }}&ev=PageView&noscript=1" /></noscript>
</body>

</html>