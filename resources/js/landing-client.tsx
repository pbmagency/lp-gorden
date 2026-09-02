import { createInertiaApp } from '@inertiajs/react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import type { ComponentType } from 'react';
void createInertiaApp({
    resolve: (name) => {
        const pages = {
            GordenLanding: () => import('@/pages/GordenLanding'),
            'cycle1/c1-lp': () => import('@/pages/cycle1/c1-lp'),
        };
        const resolvePage = pages[name as keyof typeof pages];
        if (!resolvePage)
            throw new Error(`Unexpected landing component: ${name}`);
        return resolvePage().then((module) => module.default as ComponentType);
    },
    setup({ el, App, props }) {
        if (el.hasChildNodes()) {
            hydrateRoot(el, <App {...props} />);
            return;
        }

        createRoot(el).render(<App {...props} />);
    },
});
