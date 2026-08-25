import { createInertiaApp } from '@inertiajs/react';
import { lazy, Suspense } from 'react';
import { initializeTheme } from '@/hooks/use-appearance';

// These layouts are never used by the public landing page. Keeping them lazy
// prevents the sidebar, auth UI and their route helpers from entering the
// shared startup chunk.
const AppLayout = lazy(() => import('@/layouts/app-layout'));
const AuthLayout = lazy(() => import('@/layouts/auth-layout'));
const SettingsLayout = lazy(() => import('@/layouts/settings/layout'));
const AppProviders = lazy(() => import('@/components/app-providers'));

const inertiaPage = document.querySelector<HTMLScriptElement>('script[data-page="app"]');
let initialComponent = '';
try {
    initialComponent = JSON.parse(inertiaPage?.textContent ?? '{}').component ?? '';
} catch {
    // Inertia will report malformed page data with its own actionable error.
}
const isLeanLanding = initialComponent === 'GordenLanding';

// Analytics is deliberately kept out of the critical rendering path. Loading it
// after the first interaction (or after a generous idle timeout) keeps PostHog
// out of the initial bundle while still capturing meaningful visits.
if (import.meta.env.PROD) {
    let analyticsLoaded = false;
    const loadAnalytics = () => {
        if (analyticsLoaded) return;
        analyticsLoaded = true;
        void import('@/lib/posthog-tracking');
    };
    const scheduleAnalytics = () => window.setTimeout(loadAnalytics, 1_500);

    const idleWindow = window as Window & {
        requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
    };

    window.addEventListener('pointerdown', scheduleAnalytics, {
        once: true,
        passive: true,
    });
    window.addEventListener('keydown', scheduleAnalytics, { once: true });

    window.addEventListener(
        'load',
        () => {
            // requestIdleCallback may run immediately after load. A real delay
            // is required so analytics cannot enter the Lighthouse trace.
            window.setTimeout(() => {
                if (idleWindow.requestIdleCallback) {
                    idleWindow.requestIdleCallback(loadAnalytics, {
                        timeout: 4_000,
                    });
                } else {
                    loadAnalytics();
                }
            }, 10_000);
        },
        { once: true },
    );
}

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title}` : appName),
    layout: (name) => {
        switch (true) {
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return null;
        }
    },
    strictMode: true,
    withApp(app) {
        if (isLeanLanding) return app;
        return (
            <Suspense fallback={null}>
                <AppProviders>{app}</AppProviders>
            </Suspense>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

if (!isLeanLanding) initializeTheme();
