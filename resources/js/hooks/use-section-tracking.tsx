import { useEffect, useRef } from 'react';
import { useAnalytics } from '@/hooks/use-analytics';

const SECTION_SEEN_PREFIX = 'section_seen_';

/**
 * Minimum continuous visibility duration (ms) required to count a section as "seen".
 * 500ms filters fast-scrolls while capturing genuine pauses.
 */
const DWELL_MS = 500;

/**
 * Automatically track all <section> elements that have an `id` attribute.
 *
 * No predefined list needed — the hook scans the DOM on mount and observes
 * every matching element. New sections added to the page are picked up
 * automatically without updating any config.
 *
 * Strategy:
 *  - querySelectorAll('section[id]') discovers sections dynamically.
 *  - IntersectionObserver with threshold:0.2 detects entry/exit for sections
 *    of any height (tall sections can never achieve 50% simultaneous visibility).
 *  - A 500ms dwell timer is started on entry and cancelled on exit, so
 *    fast-scrolls do NOT trigger an event — only genuine pauses count.
 *  - Each section fires exactly once per session (deduplicated via sessionStorage).
 */
export function useSectionTracking() {
    const { trackSectionView } = useAnalytics();
    const observerRef = useRef<IntersectionObserver | null>(null);
    // Map of sectionId → pending dwell timer
    const dwellTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(
        new Map(),
    );

    useEffect(() => {
        if (
            typeof window === 'undefined' ||
            !('IntersectionObserver' in window)
        ) {
            return;
        }

        // Clean up previous observer and any pending timers
        observerRef.current?.disconnect();
        dwellTimers.current.forEach(clearTimeout);
        dwellTimers.current.clear();

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const sectionId = entry.target.id;
                    if (!sectionId) return;

                    const storageKey = `${SECTION_SEEN_PREFIX}${sectionId}`;

                    if (entry.isIntersecting) {
                        // Section entered viewport — start dwell timer if not already seen
                        if (
                            !sessionStorage.getItem(storageKey) &&
                            !dwellTimers.current.has(sectionId)
                        ) {
                            const timer = setTimeout(() => {
                                dwellTimers.current.delete(sectionId);

                                // Guard: don't double-fire if somehow already tracked
                                if (sessionStorage.getItem(storageKey)) return;

                                sessionStorage.setItem(storageKey, '1');
                                trackSectionView(sectionId);

                                // Stop observing — no need to watch anymore
                                observer.unobserve(entry.target);
                            }, DWELL_MS);

                            dwellTimers.current.set(sectionId, timer);
                        }
                    } else {
                        // Section left viewport — cancel pending timer (fast-scroll → no event)
                        const timer = dwellTimers.current.get(sectionId);
                        if (timer !== undefined) {
                            clearTimeout(timer);
                            dwellTimers.current.delete(sectionId);
                        }
                    }
                });
            },
            {
                // threshold: 0.2 — fires when 20% of the section enters the viewport.
                // Data quality is maintained by the DWELL_MS timer above.
                threshold: 0.2,
            },
        );

        observerRef.current = observer;

        // Auto-discover all <section id="..."> elements (rAF ensures DOM is fully painted)
        requestAnimationFrame(() => {
            const sections =
                document.querySelectorAll<HTMLElement>('section[id]');
            sections.forEach((el) => {
                const storageKey = `${SECTION_SEEN_PREFIX}${el.id}`;
                if (!sessionStorage.getItem(storageKey)) {
                    observer.observe(el);
                }
            });
        });

        return () => {
            observer.disconnect();
            // Cancel all pending dwell timers on unmount
            dwellTimers.current.forEach(clearTimeout);
            dwellTimers.current.clear();
        };
    }, [trackSectionView]); // no sectionIds dependency — DOM is the source of truth
}
