import { createInertiaApp } from '@inertiajs/react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import GordenLanding from '@/pages/GordenLanding';

void createInertiaApp({
    resolve: (name) => {
        if (name !== 'GordenLanding') {
            throw new Error(`Unexpected landing component: ${name}`);
        }

        return GordenLanding;
    },
    setup({ el, App, props }) {
        if (el.hasChildNodes()) {
            hydrateRoot(el, <App {...props} />);
            return;
        }

        createRoot(el).render(<App {...props} />);
    },
});
