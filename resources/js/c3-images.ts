// CSS background images are otherwise fetched even for sections far below the fold.
// The page is server rendered, so this tiny observer can run before React hydrates.
const loadImage = (element: HTMLElement) => {
    const path = element.dataset.c3Bg;

    if (path) {
        element.style.setProperty('--c3-bg', `url("${path}")`);
    }
};

function observeImages() {
    const deferredImages =
        document.querySelectorAll<HTMLElement>('[data-c3-bg]');

    if (!deferredImages.length) {
        // The client-only fallback inserts the page after this module runs.
        const appRoot = document.getElementById('app');

        if (!appRoot) {
            return;
        }

        const mutationObserver = new MutationObserver(() => {
            if (!appRoot.querySelector('[data-c3-bg]')) {
                return;
            }

            mutationObserver.disconnect();
            observeImages();
        });
        mutationObserver.observe(appRoot, { childList: true, subtree: true });

        return;
    }

    if (!('IntersectionObserver' in window)) {
        deferredImages.forEach(loadImage);

        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) {
                    continue;
                }

                loadImage(entry.target as HTMLElement);
                observer.unobserve(entry.target);
            }
        },
        { rootMargin: '400px 0px' },
    );
    deferredImages.forEach((element) => observer.observe(element));
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeImages, {
        once: true,
    });
} else {
    observeImages();
}
