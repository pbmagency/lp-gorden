let hydrationStarted = false;

function hydrateLanding(): void {
    if (hydrationStarted) return;
    hydrationStarted = true;
    void import('./landing-client');
}

const appRoot = document.getElementById('app');

// If the SSR service is unavailable, render immediately so the fallback can
// never leave visitors with an empty page. With SSR, desktop corrects its
// layout immediately while mobile keeps React outside the startup path.
if (!appRoot?.hasChildNodes()) {
    hydrateLanding();
} else if (window.matchMedia('(min-width: 760px)').matches) {
    hydrateLanding();
} else {
    (['pointerdown', 'keydown', 'touchstart', 'scroll'] as const).forEach(
        (eventName) => {
            window.addEventListener(eventName, hydrateLanding, {
                once: true,
                passive: eventName !== 'keydown',
            });
        },
    );
}

window.addEventListener(
    'load',
    () => {
        window.setTimeout(hydrateLanding, 8_000);
    },
    { once: true },
);
