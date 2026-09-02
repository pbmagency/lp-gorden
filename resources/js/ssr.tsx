import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import type { ComponentType } from 'react';
import ReactDOMServer from 'react-dom/server';
import AppProviders from '@/components/app-providers';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'Gorden';

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => (title ? `${title}` : appName),
        layout: (name) => {
            switch (true) {
                case name === 'welcome':
                case name === 'landing':
                case name === 'GordenLanding':
                case name === 'cycle1/c1-lp':
                case name === 'checkout':
                case name.startsWith('payment/'):
                case name.startsWith('admin/'):
                    return null;
                case name.startsWith('auth/'):
                    return AuthLayout;
                case name.startsWith('settings/'):
                    return [AppLayout, SettingsLayout];
                default:
                    return AppLayout;
            }
        },
        resolve: (name) => {
            const pages = import.meta.glob('./pages/**/*.tsx', { eager: true });

            return pages[`./pages/${name}.tsx`] as { default: ComponentType };
        },
        setup({ App, props }) {
            if (
                page.component === 'GordenLanding' ||
                page.component === 'cycle1/c1-lp'
            ) {
                return <App {...props} />;
            }

            return (
                <AppProviders>
                    <App {...props} />
                </AppProviders>
            );
        },
    }),
);
