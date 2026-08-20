<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>

<head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-7DZSEDBHZY"></script>
    <script>
      

            (function(c, l, a, r, i, t, y) {
                c[a] = c[a] || function() { (c[a].q = c[a].q || []).push(arguments) };
                t = l.createElement(r); t.async = 1;
                t.src = "https://www.clarity.ms/tag/" + i;
                y = l.getElementsByTagName(r)[0];
                y.parentNode.insertBefore(t, y);
            })(window, document, "clarity", "script", "wv3d64uo3o");

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
            fbq('track', 'ViewContent', {}, { eventID: window.__META_PAGE_VIEW_EVENT_ID });

                (function(w,d){
                    if(w.__plerdyCode)return;
                    w.__plerdyCode=1;
                    w._protocol=w.location.protocol==="https:"?"https://":"http://";
                    w._site_hash_code="e5ad2bad413372216eb0cbf6646f35c3";
                    w._suid=79951;
                    var s=d.createElement("script");
                    s.async=true;
                    s.referrerPolicy="strict-origin-when-cross-origin";
                    s.src="https://a.plerdy.com/public/js/click/main.js";
                    d.head.appendChild(s);
                })(window,document);
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
