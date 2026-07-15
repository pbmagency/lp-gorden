import { createInertiaApp } from '@inertiajs/react';
import { lazy, Suspense } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';

const AppLayout = lazy(() => import('@/layouts/app-layout'));
const AuthLayout = lazy(() => import('@/layouts/auth-layout'));
const SettingsLayout = lazy(() => import('@/layouts/settings/layout'));

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
        return (
            <Suspense fallback={null}>
                <TooltipProvider delayDuration={0}>
                    {app}
                    <Toaster />
                </TooltipProvider>
            </Suspense>
        );
    },
    progress: { color: '#4B5563' },
});
initializeTheme();