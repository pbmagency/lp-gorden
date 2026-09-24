import type posthog from 'posthog-js';

// c3-lp delays React hydration on mobile. Track the funnel independently so
// visits and early WhatsApp clicks still reach the same A/B dashboard as c2-lp.
type EventType =
    | 'visit'
    | 'scroll'
    | 'engagement'
    | 'section_view'
    | 'cta_click'
    | 'conversion';

const landingSourceKey = 'landing_source';
const referralSourceKey = 'referral_source';
const landingSource =
    sessionStorage.getItem(landingSourceKey) || location.pathname;
sessionStorage.setItem(landingSourceKey, landingSource);

if (!sessionStorage.getItem(referralSourceKey)) {
    const referrer =
        document.referrer &&
        new URL(document.referrer).hostname !== location.hostname
            ? document.referrer
            : '';
    sessionStorage.setItem(
        referralSourceKey,
        new URLSearchParams(location.search).get('ref') || referrer || 'direct',
    );
}

const query = new URLSearchParams(location.search);
const csrfToken =
    document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
        ?.content || '';
const cookie = (name: string) => {
    const value = document.cookie
        .split('; ')
        .find((part) => part.startsWith(`${name}=`));

    return value ? decodeURIComponent(value.slice(name.length + 1)) : null;
};

function track(
    eventType: EventType,
    eventData: Record<string, unknown> = {},
): Promise<boolean> {
    return fetch('/analytics/track', {
        method: 'POST',
        credentials: 'same-origin',
        keepalive: true,
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify({
            event_type: eventType,
            event_data: {
                page: location.pathname,
                timestamp: new Date().toISOString(),
                landing_source: landingSource,
                ...eventData,
            },
            referral_source:
                sessionStorage.getItem(referralSourceKey) || 'direct',
            utm_source: query.get('utm_source'),
            utm_medium: query.get('utm_medium'),
            utm_campaign: query.get('utm_campaign'),
            utm_content: query.get('utm_content'),
            utm_term: query.get('utm_term'),
        }),
    })
        .then((response) => response.ok)
        .catch(() => false);
}

const visitKey = `analytics_visit_tracked:${landingSource}`;

if (sessionStorage.getItem(visitKey) !== 'tracked') {
    const metaEventId = (
        window as Window & { __META_PAGE_VIEW_EVENT_ID?: string }
    ).__META_PAGE_VIEW_EVENT_ID;
    void track('visit', {
        event_id: metaEventId || crypto.randomUUID(),
        _fbp: cookie('_fbp'),
        _fbc: cookie('_fbc'),
    }).then((success) => {
        if (success) {
            sessionStorage.setItem(visitKey, 'tracked');
        }
    });
}

// PostHog remains outside the initial render bundle. It loads when a visitor
// shows intent or engagement, and the triggering event is captured directly.
let posthogPromise: Promise<typeof posthog> | undefined;
function capturePosthog(
    event: 'intent' | 'engaged',
    properties?: Record<string, string>,
) {
    posthogPromise ??= import('@/lib/posthog').then(({ default: posthog }) => {
        posthog.register({
            client_id: import.meta.env.VITE_POSTHOG_CLIENT_ID,
            client_type:
                import.meta.env.VITE_POSTHOG_CLIENT_TYPE || 'ctwa_leads',
        });

        return posthog;
    });
    void posthogPromise
        .then((posthog) => posthog.capture(event, properties))
        .catch(() => {});
}

let engaged = false;
function markEngaged() {
    if (engaged) {
        return;
    }

    engaged = true;
    capturePosthog('engaged');
}

document.addEventListener(
    'click',
    (event) => {
        if (
            !(event.target instanceof Element) ||
            event.target.closest('button')
        ) {
            return;
        }

        const anchor =
            event.target.closest<HTMLAnchorElement>('.c3-page a[href]');

        if (!anchor) {
            return;
        }

        // Read the label from the clicked DOM element. The nudge has supporting
        // copy inside its link, so its visible CTA span is marked separately.
        const labelElement = anchor.querySelector<HTMLElement>(
            '[data-c3-cta-label]',
        );
        const label = (
            labelElement?.textContent ||
            anchor.textContent ||
            anchor.getAttribute('aria-label') ||
            ''
        )
            .replace(/\s+/g, ' ')
            .trim();
        const isWhatsApp =
            anchor.hostname === 'wa.me' ||
            anchor.hostname.endsWith('.whatsapp.com');
        const zone =
            anchor.dataset.ctaZone ||
            anchor.closest('section')?.id ||
            (anchor.closest('.sticky') ? 'header' : 'floating');
        const ctaLocation = isWhatsApp
            ? zone
            : anchor.hash
              ? 'page_anchor'
              : zone;

        void track('cta_click', {
            location: ctaLocation,
            cta_zone: zone,
            cta_name: label,
            text: label,
            destination: anchor.href,
        });
        capturePosthog('intent', {
            cta_zone: zone,
            cta_name: label,
            cta_label: label,
        });

        if (isWhatsApp) {
            void track('conversion', {
                type: 'wa_inquiry',
                location: ctaLocation,
            });
            (window as Window & { fbq?: (...args: unknown[]) => void }).fbq?.(
                'track',
                'Search',
                {
                    search_string: 'WhatsApp Inquiry',
                },
            );
        }
    },
    { capture: true },
);

const scrollDepths = new Set<number>();
let lastScroll = 0;
window.addEventListener(
    'scroll',
    () => {
        const now = Date.now();

        if (now - lastScroll < 200) {
            return;
        }

        lastScroll = now;
        const scrollHeight =
            document.documentElement.scrollHeight - innerHeight;

        if (scrollHeight <= 0) {
            return;
        }

        const depth = Math.round((scrollY / scrollHeight) * 100);

        for (const milestone of [25, 50, 75, 90]) {
            if (depth < milestone || scrollDepths.has(milestone)) {
                continue;
            }

            scrollDepths.add(milestone);
            void track('scroll', { depth: milestone });
        }

        if (depth > 25) {
            markEngaged();
        }
    },
    { passive: true },
);

let visibleSeconds = 0;
window.setInterval(() => {
    if (document.hidden) {
        return;
    }

    visibleSeconds += 1;

    if (visibleSeconds === 15) {
        void track('engagement', {
            type: 'dwell_ping',
            duration: 15000,
            is_initial: true,
        });
        markEngaged();
    } else if (visibleSeconds > 15 && (visibleSeconds - 15) % 30 === 0) {
        void track('engagement', {
            type: 'dwell_ping',
            duration: 30000,
            is_initial: false,
        });
    }
}, 1000);

function observeSections() {
    if (!('IntersectionObserver' in window)) {
        return;
    }

    const sections = document.querySelectorAll<HTMLElement>(
        '.c3-page section[id]',
    );

    if (!sections.length) {
        // The client render fallback can insert the page after this module runs.
        const root = document.getElementById('app');

        if (!root) {
            return;
        }

        const pending = new MutationObserver(() => {
            if (!root.querySelector('.c3-page section[id]')) {
                return;
            }

            pending.disconnect();
            observeSections();
        });
        pending.observe(root, { childList: true, subtree: true });

        return;
    }

    const timers = new Map<string, number>();
    const observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                const id = entry.target.id;
                const key = `section_seen_v2_${landingSource}:${id}`;

                if (sessionStorage.getItem(key)) {
                    continue;
                }

                if (!entry.isIntersecting) {
                    window.clearTimeout(timers.get(id));
                    timers.delete(id);
                    continue;
                }

                if (timers.has(id)) {
                    continue;
                }

                timers.set(
                    id,
                    window.setTimeout(() => {
                        timers.delete(id);

                        if (sessionStorage.getItem(key)) {
                            return;
                        }

                        void track('section_view', { section: id }).then(
                            (success) => {
                                if (success) {
                                    sessionStorage.setItem(key, 'seen');
                                }
                            },
                        );
                    }, 500),
                );
            }
        },
        { threshold: 0.2 },
    );
    sections.forEach((section) => observer.observe(section));
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeSections, {
        once: true,
    });
} else {
    observeSections();
}
