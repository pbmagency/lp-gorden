import React, { useState, useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';

const lazyBackground = (value: string): React.CSSProperties => ({ '--landing-bg': value }) as React.CSSProperties;

export default function GordenLanding() {
    const [showAllProjects, setShowAllProjects] = useState(false);
    // SSR uses the mobile layout as its stable baseline because mobile is the
    // dominant landing-page/Lighthouse viewport. Desktop corrects after mount.
    const [narrow, setNarrow] = useState(true);
    const showTrustBar = true;

    const [reviewIdx, setReviewIdx] = useState(0);
    const reviewShots = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => `/assets/review-${n}.webp`);

    const [lightbox, setLightbox] = useState<string | null>(null);
    const [lbList, setLbList] = useState<{ src: string; caption: string }[]>([]);
    const [lbIdx, setLbIdx] = useState(0);

    const [katCat, setKatCat] = useState('semua');
    const [expKain, setExpKain] = useState(false);
    const [expBlinds, setExpBlinds] = useState(false);
    const [renderDeferredContent, setRenderDeferredContent] = useState(false);

    const lightboxImgRef = useRef<HTMLImageElement>(null);
    const reviewsSectionRef = useRef<HTMLParagraphElement>(null);
    const deferredContentSentinelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mql = window.matchMedia('(max-width: 760px)');
        const onChange = (e: MediaQueryListEvent) => setNarrow(e.matches);
        setNarrow(mql.matches);
        mql.addEventListener('change', onChange);
        return () => mql.removeEventListener('change', onChange);
    }, []);

    useEffect(() => {
        const backgrounds = document.querySelectorAll<HTMLElement>('[style*="--landing-bg"]');
        if (!('IntersectionObserver' in window)) {
            backgrounds.forEach((element) => element.classList.add('lazy-bg-ready'));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    (entry.target as HTMLElement).classList.add('lazy-bg-ready');
                    observer.unobserve(entry.target);
                });
            },
            { rootMargin: '700px 0px' },
        );

        backgrounds.forEach((element) => {
            if (!element.classList.contains('lazy-bg-ready')) observer.observe(element);
        });
        return () => observer.disconnect();
    }, [showAllProjects, expKain, expBlinds, narrow]);

    useEffect(() => {
        const section = reviewsSectionRef.current;
        if (!section || !('IntersectionObserver' in window)) return;

        let timer: ReturnType<typeof setInterval> | undefined;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !timer) {
                    timer = setInterval(() => {
                        setReviewIdx((i) => (i + 1) % reviewShots.length);
                    }, 5000);
                } else if (!entry.isIntersecting && timer) {
                    clearInterval(timer);
                    timer = undefined;
                }
            },
            { rootMargin: '200px 0px' },
        );
        observer.observe(section);

        return () => {
            observer.disconnect();
            if (timer) clearInterval(timer);
        };
    }, [reviewShots.length, renderDeferredContent]);

    useEffect(() => {
        const sentinel = deferredContentSentinelRef.current;
        if (!sentinel || renderDeferredContent) return;
        if (!('IntersectionObserver' in window)) {
            setRenderDeferredContent(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                setRenderDeferredContent(true);
                observer.disconnect();
            },
            { rootMargin: '1200px 0px' },
        );
        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [renderDeferredContent]);

    useEffect(() => {
        const csrfToken = document.querySelector("meta[name='csrf-token']")?.getAttribute('content') || '';

        const track = (data: any) => {
            fetch('/analytics/track', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify(data),
            }).catch(() => {});
        };

        // Do not let first-party analytics compete with the hero/LCP request.
        const visitTimer = window.setTimeout(() => track({ event_type: 'visit', url: window.location.href }), 12000);

        const timers = [setTimeout(() => track({ event_type: 'engagement', duration: 15 }), 15000), setTimeout(() => track({ event_type: 'engagement', duration: 45 }), 45000), setTimeout(() => track({ event_type: 'engagement', duration: 75 }), 75000)];

        const scrollMarks = [0.25, 0.5, 0.75, 0.9];
        const scrolled = new Set();
        const onScroll = () => {
            const h = document.documentElement;
            const pct = h.scrollTop / (h.scrollHeight - h.clientHeight);
            scrollMarks.forEach((m) => {
                if (pct >= m && !scrolled.has(m)) {
                    scrolled.add(m);
                    track({ event_type: 'scroll', depth: m * 100 });
                }
            });
        };
        window.addEventListener('scroll', onScroll, { passive: true });

        const onClick = (e: MouseEvent) => {
            const a = (e.target as HTMLElement).closest('a');
            if (a && a.href.includes('wa.me')) {
                track({ event_type: 'cta_click', url: a.href });
                // Fire Meta Pixel event for WhatsApp lead
                if (typeof window !== 'undefined' && (window as any).fbq) {
                    (window as any).fbq('track', 'Lead');
                }
            }
        };
        document.addEventListener('click', onClick);

        return () => {
            timers.forEach(clearTimeout);
            clearTimeout(visitTimer);
            window.removeEventListener('scroll', onScroll);
            document.removeEventListener('click', onClick);
        };
    }, []);

    const openLightbox = (e: React.MouseEvent<HTMLElement>) => {
        const target = (e.target as HTMLElement).closest('[data-zoom]');
        if (!target) return;
        const scope = target.closest('section') || document;
        const nodes = Array.from(scope.querySelectorAll('[data-zoom]'));
        const list = nodes.map((n) => {
            const box = n.parentElement;
            const ps = box
                ? Array.from(box.querySelectorAll('p'))
                      .map((p) => p.textContent?.trim())
                      .filter(Boolean)
                : [];
            return {
                src: n.getAttribute('data-zoom') || '',
                caption: ps.slice(0, 2).join(', '),
            };
        });
        const idx = Math.max(0, nodes.indexOf(target as Element));
        setLbList(list);
        setLbIdx(idx);
        setLightbox(list[idx].src);
    };

    const closeLightbox = () => {
        setLightbox(null);
        setLbList([]);
        setLbIdx(0);
    };

    const lightboxPrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        const n = lbList.length;
        if (!n) return;
        const i = (lbIdx - 1 + n) % n;
        setLbIdx(i);
        setLightbox(lbList[i].src);
    };

    const lightboxNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        const n = lbList.length;
        if (!n) return;
        const i = (lbIdx + 1) % n;
        setLbIdx(i);
        setLightbox(lbList[i].src);
    };

    const zoomCurrentReview = () => {
        const list = reviewShots.map((src) => ({ src, caption: '' }));
        setLbList(list);
        setLbIdx(reviewIdx);
        setLightbox(reviewShots[reviewIdx]);
    };

    const stepReview = (d: number) => {
        const n = reviewShots.length;
        setReviewIdx((prev) => (prev + d + n) % n);
    };

    const pickCat = (cat: string) => {
        setKatCat(cat);
        const el = document.getElementById('katalog-filter');
        if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY - 132;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const revealDeferredAnchor = (event: React.MouseEvent<HTMLElement>) => {
        const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
        const hash = anchor?.getAttribute('href');
        if (!hash || hash === '#' || document.getElementById(hash.slice(1))) return;

        event.preventDefault();
        setRenderDeferredContent(true);
        window.setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 0);
    };

    const reviewPrev = reviewShots[(reviewIdx + reviewShots.length - 1) % reviewShots.length];
    const reviewNext = reviewShots[(reviewIdx + 1) % reviewShots.length];

    const showKain = katCat === 'semua' || katCat === 'kain';
    const showBlinds = katCat === 'semua' || katCat === 'blinds';
    const showPelengkap = katCat === 'semua' || katCat === 'lain';

    const showKainRest = katCat === 'kain' || expKain;
    const showBlindsRest = katCat === 'blinds' || expBlinds;

    // Strip dark mode & admin styles immediately
    useEffect(() => {
        const html = document.documentElement;
        const hadDark = html.classList.contains('dark');
        html.classList.remove('dark');
        // Force light background immediately
        html.style.backgroundColor = 'oklch(0.97 0.015 85)';
        document.body.style.backgroundColor = 'oklch(0.97 0.015 85)';
        return () => {
            if (hadDark) html.classList.add('dark');
            html.style.backgroundColor = '';
            document.body.style.backgroundColor = '';
        };
    }, []);

    const tab = (k: string) => (katCat === k ? { background: '#817661', color: '#fdfcfa' } : { background: '#fdfcfa', color: '#6f6656' });

    return (
        <>
            <Head>
                <style>{`
  * { box-sizing: border-box; }
  body { margin: 0; background: oklch(0.97 0.015 85); font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; -webkit-font-smoothing: antialiased; }
  a { color: #6a6151; }
  a:hover { color: #4f4a3d; }
  .landing-content > section:not(:first-child),
  .landing-content > footer {
    content-visibility: auto;
    contain-intrinsic-size: auto 720px;
  }
  [style*="--landing-bg"] { background-image: none; }
  [style*="--landing-bg"].lazy-bg-ready { background-image: var(--landing-bg); }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { scroll-behavior: auto !important; animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }
  }
  @keyframes omBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(6px); } }
  @keyframes reviewMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
`}</style>
            </Head>

            <div
                style={{
                    background: 'oklch(0.97 0.015 85)',
                    color: 'oklch(0.24 0.02 60)',
                    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                    fontSize: '17px',
                    lineHeight: '1.62',
                    overflowX: 'clip',
                }}
            >
                <div
                    style={{
                        position: 'sticky',
                        top: '0',
                        zIndex: '60',
                        background: 'rgba(250,248,244,0.95)',
                        backdropFilter: 'blur(10px)',
                        borderBottom: '1px solid oklch(0.89 0.02 80)',
                    }}
                >
                    <div
                        style={{
                            maxWidth: '1000px',
                            margin: '0 auto',
                            padding: '10px 20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '12px',
                        }}
                    >
                        <img
                            src="/assets/logo-64.webp"
                            alt="Gorden Wallpaper Solo"
                            width="64"
                            height="64"
                            decoding="async"
                            style={{
                                height: '52px',
                                width: '52px',
                                objectFit: 'contain',
                                display: 'block',
                            }}
                        />
                        <a
                            href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20konsultasi%20gorden.%20Boleh%20dibantu%3F"
                            target="_blank"
                            rel="noopener"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minHeight: '46px',
                                padding: '11px 18px',
                                background: '#FF6B35',
                                color: '#fff',
                                fontSize: '15px',
                                fontWeight: '600',
                                textDecoration: 'none',
                                borderRadius: '10px',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            <img
                                src="/assets/whatsapp.svg"
                                alt=""
                                style={{
                                    flex: 'none',
                                    width: '18px',
                                    height: '18px',
                                    marginRight: '8px',
                                    display: 'block',
                                }}
                            />
                            Konsultasi Gratis →
                        </a>
                    </div>
                </div>

                <main
                    className="landing-content"
                    onClickCapture={revealDeferredAnchor}
                    style={{
                        maxWidth: '1000px',
                        margin: '0 auto',
                        padding: '12px 20px 60px',
                    }}
                >
                    <section
                        style={{
                            padding: '0',
                            height: 'calc(100svh - 79px)',
                            minHeight: '460px',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <div
                            style={{
                                position: 'relative',
                                flex: '1 1 auto',
                                minHeight: '0',
                                width: '100vw',
                                marginLeft: 'calc(50% - 50vw)',
                                marginRight: 'calc(50% - 50vw)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                gap: '14px',
                                padding: '24px clamp(20px, calc((100vw - 960px) / 2 + 20px), 200px) clamp(22px, 7vw, 104px)',
                                overflow: 'hidden',
                                backgroundColor: '#302920',
                                borderRadius: '0px',
                            }}
                        >
                            <img
                                src="/assets/hero-gorden.webp"
                                alt="Gorden custom yang telah terpasang di rumah pelanggan"
                                width="528"
                                height="704"
                                loading="eager"
                                fetchPriority="high"
                                decoding="sync"
                                style={{
                                    position: 'absolute',
                                    inset: '0',
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    objectPosition: 'center 40%',
                                    display: 'block',
                                }}
                            />
                            <div
                                aria-hidden="true"
                                style={{
                                    position: 'absolute',
                                    inset: '0',
                                    background: 'linear-gradient(to top, rgba(30,25,19,0.94) 0%, rgba(30,25,19,0.74) 48%, rgba(30,25,19,0.3) 100%)',
                                }}
                            />
                            <div
                                style={{
                                    position: 'relative',
                                    width: '100%',
                                    maxWidth: '640px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <div
                                    style={{
                                        alignSelf: 'flex-start',
                                        display: 'inline-flex',
                                        flexWrap: 'nowrap',
                                        whiteSpace: 'nowrap',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: '7px 13px 7px 15px',
                                        margin: '0 0 12px',
                                        background: 'rgba(253,252,250,0.14)',
                                        border: '1px solid rgba(253,252,250,0.35)',
                                        backdropFilter: 'blur(6px)',
                                        borderRadius: '999px',
                                    }}
                                >
                                    <span
                                        style={{
                                            color: '#E0A93B',
                                            fontSize: '14px',
                                            letterSpacing: '1px',
                                        }}
                                    >
                                        ★★★★★
                                    </span>
                                    <span
                                        style={{
                                            fontSize: '12px',
                                            fontWeight: '700',
                                            letterSpacing: '0.08em',
                                            textTransform: 'uppercase',
                                            color: '#fdfcfa',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        1.000+ Pembeli
                                    </span>
                                    <span style={{ display: 'flex' }}>
                                        <img
                                            src="/assets/ava-1.webp"
                                            alt=""
                                            width="22"
                                            height="22"
                                            decoding="async"
                                            style={{
                                                width: '22px',
                                                height: '22px',
                                                borderRadius: '999px',
                                                border: '2px solid rgba(253,252,250,0.8)',
                                                objectFit: 'cover',
                                                display: 'block',
                                            }}
                                        />
                                        <img
                                            src="/assets/ava-2.webp"
                                            alt=""
                                            width="22"
                                            height="22"
                                            decoding="async"
                                            style={{
                                                width: '22px',
                                                height: '22px',
                                                marginLeft: '-8px',
                                                borderRadius: '999px',
                                                border: '2px solid rgba(253,252,250,0.8)',
                                                objectFit: 'cover',
                                                display: 'block',
                                            }}
                                        />
                                        <img
                                            src="/assets/ava-3.webp"
                                            alt=""
                                            width="22"
                                            height="22"
                                            decoding="async"
                                            style={{
                                                width: '22px',
                                                height: '22px',
                                                marginLeft: '-8px',
                                                borderRadius: '999px',
                                                border: '2px solid rgba(253,252,250,0.8)',
                                                objectFit: 'cover',
                                                display: 'block',
                                            }}
                                        />
                                    </span>
                                </div>
                                <h1
                                    style={{
                                        margin: '0 0 12px',
                                        fontFamily: 'Poppins, Helvetica, sans-serif',
                                        fontSize: 'clamp(26px, 3.6vw, 40px)',
                                        lineHeight: '1.1',
                                        fontWeight: '700',
                                        letterSpacing: '-0.025em',
                                        color: '#fdfcfa',
                                        textWrap: 'pretty',
                                    }}
                                >
                                    Gorden Custom Solo Raya,{' '}
                                    <span
                                        style={{
                                            background: 'linear-gradient(to top, rgba(224, 169, 59, 0.85) 0.28em, transparent 0.28em)',
                                        }}
                                    >
                                        Terima Beres Ukur &amp; Pasang
                                    </span>
                                </h1>
                                <p
                                    style={{
                                        margin: '0 0 16px',
                                        fontSize: 'clamp(14px, 1.5vw, 17px)',
                                        color: 'rgba(253,252,250,0.9)',
                                        textWrap: 'pretty',
                                    }}
                                >
                                    <b style={{ color: '#fdfcfa' }}>Takut salah ukur atau salah model?</b> Konsultasi langsung dengan owner, kami ukur dan pasang di tempat.
                                </p>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '10px',
                                    }}
                                >
                                    <a
                                        href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20konsultasi%20gorden.%20Boleh%20dibantu%3F"
                                        target="_blank"
                                        rel="noopener"
                                        style={{
                                            flex: '1 1 260px',
                                            whiteSpace: 'nowrap',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            minHeight: '56px',
                                            padding: '14px 20px',
                                            background: '#FF6B35',
                                            color: '#fff',
                                            fontSize: 'clamp(15px, 3.9vw, 17px)',
                                            fontWeight: '700',
                                            textDecoration: 'none',
                                            borderRadius: '12px',
                                            boxShadow: '0 10px 24px -10px rgba(0,0,0,0.55)',
                                        }}
                                    >
                                        <img
                                            src="/assets/whatsapp.svg"
                                            alt=""
                                            style={{
                                                flex: 'none',
                                                width: '20px',
                                                height: '20px',
                                                marginRight: '9px',
                                                display: 'block',
                                            }}
                                        />
                                        Konsultasi Gratis →
                                    </a>
                                    <a
                                        href="#portofolio"
                                        style={{
                                            flex: '1 1 200px',
                                            whiteSpace: 'nowrap',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            minHeight: '56px',
                                            padding: '14px 18px',
                                            background: 'rgba(253,252,250,0.12)',
                                            border: '2px solid #FF6B35',
                                            color: '#fdfcfa',
                                            fontSize: 'clamp(15px, 3.9vw, 17px)',
                                            fontWeight: '700',
                                            textDecoration: 'none',
                                            borderRadius: '12px',
                                            backdropFilter: 'blur(4px)',
                                        }}
                                    >
                                        Lihat Portofolio →
                                    </a>
                                </div>
                                {showTrustBar && (
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            alignItems: 'center',
                                            gap: '4px 10px',
                                            margin: '14px 0 0',
                                            fontSize: '13px',
                                            color: 'rgba(253,252,250,0.88)',
                                        }}
                                    >
                                        <span
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    color: '#E0A93B',
                                                    fontSize: '14px',
                                                    letterSpacing: '1px',
                                                }}
                                            >
                                                ★★★★★
                                            </span>{' '}
                                            <strong style={{ color: '#fdfcfa' }}>5,0</strong> Google Review
                                        </span>
                                        <span
                                            style={{
                                                color: 'rgba(253,252,250,0.45)',
                                            }}
                                        >
                                            •
                                        </span>
                                        <span style={{ whiteSpace: 'nowrap' }}>Sejak 2012</span>
                                        <span
                                            style={{
                                                color: 'rgba(253,252,250,0.45)',
                                            }}
                                        >
                                            •
                                        </span>
                                        <span style={{ whiteSpace: 'nowrap' }}>Garansi pasang 14 hari</span>
                                    </div>
                                )}
                            </div>
                            <span
                                aria-hidden="true"
                                style={{
                                    position: 'relative',
                                    alignSelf: 'center',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '54px',
                                    height: '54px',
                                    background: 'rgba(253,252,250,0.2)',
                                    border: '2px solid rgba(253,252,250,0.8)',
                                    backdropFilter: 'blur(6px)',
                                    borderRadius: '999px',
                                    color: '#fdfcfa',
                                    animation: 'omBob 1.6s ease-in-out infinite',
                                }}
                            >
                                <span
                                    style={{
                                        display: 'block',
                                        fontSize: '30px',
                                        lineHeight: '1',
                                        fontWeight: '700',
                                        marginTop: '-4px',
                                    }}
                                >
                                    ↓
                                </span>
                            </span>
                        </div>
                    </section>

                    <section
                        style={{
                            padding: '44px 0',
                            borderTop: '1px solid oklch(0.9 0.02 80)',
                        }}
                    >
                        <div style={{ maxWidth: '56ch', margin: '0 0 8px' }}>
                            <p
                                style={{
                                    margin: '0 0 10px',
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    letterSpacing: '0.14em',
                                    textTransform: 'uppercase',
                                    color: '#817661',
                                }}
                            >
                                Sebelum memutuskan
                            </p>
                            <h2
                                style={{
                                    margin: '0 0 8px',
                                    fontFamily: 'Poppins, Helvetica, sans-serif',
                                    fontSize: 'clamp(23px, 5.2vw, 30px)',
                                    lineHeight: '1.2',
                                    fontWeight: '700',
                                    letterSpacing: '-0.02em',
                                    textWrap: 'pretty',
                                }}
                            >
                                Sering kepikiran hal ini sebelum pasang gorden?
                            </h2>
                            <p
                                style={{
                                    margin: '0',
                                    color: 'oklch(0.42 0.02 60)',
                                }}
                            >
                                Wajar, hampir semua pelanggan menanyakan hal yang sama di chat pertama.
                            </p>
                        </div>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
                                gap: '0 40px',
                                margin: '18px 0 0',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '16px',
                                    alignItems: 'flex-start',
                                    padding: '18px 0',
                                    borderTop: '1px solid oklch(0.88 0.02 82)',
                                }}
                            >
                                <span
                                    style={{
                                        flex: 'none',
                                        fontFamily: 'Poppins, Helvetica, sans-serif',
                                        fontSize: 'clamp(26px, 6vw, 34px)',
                                        lineHeight: '1',
                                        fontWeight: '700',
                                        color: '#cfc4ae',
                                        letterSpacing: '-0.03em',
                                    }}
                                >
                                    01
                                </span>
                                <p
                                    style={{
                                        margin: '2px 0 0',
                                        fontFamily: 'Poppins, Helvetica, sans-serif',
                                        fontSize: 'clamp(16px, 4.3vw, 19px)',
                                        lineHeight: '1.4',
                                        fontWeight: '500',
                                        color: 'oklch(0.3 0.02 60)',
                                        textWrap: 'pretty',
                                    }}
                                >
                                    Takut ukur sendiri, eh ternyata kependekan atau kegedean?
                                </p>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '16px',
                                    alignItems: 'flex-start',
                                    padding: '18px 0',
                                    borderTop: '1px solid oklch(0.88 0.02 82)',
                                }}
                            >
                                <span
                                    style={{
                                        flex: 'none',
                                        fontFamily: 'Poppins, Helvetica, sans-serif',
                                        fontSize: 'clamp(26px, 6vw, 34px)',
                                        lineHeight: '1',
                                        fontWeight: '700',
                                        color: '#cfc4ae',
                                        letterSpacing: '-0.03em',
                                    }}
                                >
                                    02
                                </span>
                                <p
                                    style={{
                                        margin: '2px 0 0',
                                        fontFamily: 'Poppins, Helvetica, sans-serif',
                                        fontSize: 'clamp(16px, 4.3vw, 19px)',
                                        lineHeight: '1.4',
                                        fontWeight: '500',
                                        color: 'oklch(0.3 0.02 60)',
                                        textWrap: 'pretty',
                                    }}
                                >
                                    Nggak sempat, atau nggak sanggup pasang sendiri?
                                </p>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '16px',
                                    alignItems: 'flex-start',
                                    padding: '18px 0',
                                    borderTop: '1px solid oklch(0.88 0.02 82)',
                                }}
                            >
                                <span
                                    style={{
                                        flex: 'none',
                                        fontFamily: 'Poppins, Helvetica, sans-serif',
                                        fontSize: 'clamp(26px, 6vw, 34px)',
                                        lineHeight: '1',
                                        fontWeight: '700',
                                        color: '#cfc4ae',
                                        letterSpacing: '-0.03em',
                                    }}
                                >
                                    03
                                </span>
                                <p
                                    style={{
                                        margin: '2px 0 0',
                                        fontFamily: 'Poppins, Helvetica, sans-serif',
                                        fontSize: 'clamp(16px, 4.3vw, 19px)',
                                        lineHeight: '1.4',
                                        fontWeight: '500',
                                        color: 'oklch(0.3 0.02 60)',
                                        textWrap: 'pretty',
                                    }}
                                >
                                    Mau tanya-tanya detail tapi takut cuma dibalas template sama admin?
                                </p>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '16px',
                                    alignItems: 'flex-start',
                                    padding: '18px 0',
                                    borderTop: '1px solid oklch(0.88 0.02 82)',
                                }}
                            >
                                <span
                                    style={{
                                        flex: 'none',
                                        fontFamily: 'Poppins, Helvetica, sans-serif',
                                        fontSize: 'clamp(26px, 6vw, 34px)',
                                        lineHeight: '1',
                                        fontWeight: '700',
                                        color: '#cfc4ae',
                                        letterSpacing: '-0.03em',
                                    }}
                                >
                                    04
                                </span>
                                <p
                                    style={{
                                        margin: '2px 0 0',
                                        fontFamily: 'Poppins, Helvetica, sans-serif',
                                        fontSize: 'clamp(16px, 4.3vw, 19px)',
                                        lineHeight: '1.4',
                                        fontWeight: '500',
                                        color: 'oklch(0.3 0.02 60)',
                                        textWrap: 'pretty',
                                    }}
                                >
                                    Sudah pilih model, tapi pas terpasang kok kurang pas sama ruangan?
                                </p>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '16px',
                                    alignItems: 'flex-start',
                                    padding: '18px 0',
                                    borderTop: '1px solid oklch(0.88 0.02 82)',
                                }}
                            >
                                <span
                                    style={{
                                        flex: 'none',
                                        fontFamily: 'Poppins, Helvetica, sans-serif',
                                        fontSize: 'clamp(26px, 6vw, 34px)',
                                        lineHeight: '1',
                                        fontWeight: '700',
                                        color: '#cfc4ae',
                                        letterSpacing: '-0.03em',
                                    }}
                                >
                                    05
                                </span>
                                <p
                                    style={{
                                        margin: '2px 0 0',
                                        fontFamily: 'Poppins, Helvetica, sans-serif',
                                        fontSize: 'clamp(16px, 4.3vw, 19px)',
                                        lineHeight: '1.4',
                                        fontWeight: '500',
                                        color: 'oklch(0.3 0.02 60)',
                                        textWrap: 'pretty',
                                    }}
                                >
                                    Takut bayar lebih mahal, tapi barangnya ternyata biasa saja?
                                </p>
                            </div>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                gap: '14px',
                                alignItems: 'center',
                                margin: '24px 0 0',
                                padding: '20px 22px',
                                background: '#817661',
                                color: '#fdfcfa',
                                borderRadius: '16px',
                            }}
                        >
                            <span
                                style={{
                                    flex: 'none',
                                    width: '38px',
                                    height: '38px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '999px',
                                    background: 'rgba(253,252,250,0.16)',
                                    fontSize: '18px',
                                }}
                            >
                                ↓
                            </span>
                            <p
                                style={{
                                    margin: '0',
                                    fontFamily: 'Poppins, Helvetica, sans-serif',
                                    fontSize: 'clamp(16px, 4.2vw, 19px)',
                                    fontWeight: '600',
                                    lineHeight: '1.4',
                                }}
                            >
                                Semua kekhawatiran itu justru jadi alasan kenapa Gorden Wallpaper Solo ada.
                            </p>
                        </div>

                        <div style={{ margin: '26px 0 0' }}>
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '12px',
                                }}
                            >
                                <a
                                    href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20konsultasi%20gorden.%20Boleh%20dibantu%3F"
                                    target="_blank"
                                    rel="noopener"
                                    style={{
                                        flex: '1 1 260px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minHeight: '56px',
                                        padding: '14px 18px',
                                        background: '#FF6B35',
                                        color: '#fff',
                                        fontSize: 'clamp(15px, 3.9vw, 17px)',
                                        fontWeight: '700',
                                        textDecoration: 'none',
                                        borderRadius: '12px',
                                    }}
                                >
                                    <img
                                        src="/assets/whatsapp.svg"
                                        alt=""
                                        style={{
                                            flex: 'none',
                                            width: '20px',
                                            height: '20px',
                                            marginRight: '9px',
                                            display: 'block',
                                        }}
                                    />
                                    Konsultasi Gratis →
                                </a>
                                <a
                                    href="#portofolio"
                                    style={{
                                        flex: '1 1 220px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minHeight: '56px',
                                        padding: '14px 18px',
                                        background: 'rgba(253,252,250,0.12)',
                                        border: '2px solid #FF6B35',
                                        color: '#241D17',
                                        fontSize: 'clamp(15px, 3.9vw, 17px)',
                                        fontWeight: '700',
                                        textDecoration: 'none',
                                        borderRadius: '12px',
                                        backdropFilter: 'blur(4px)',
                                    }}
                                >
                                    Lihat Portofolio →
                                </a>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    alignItems: 'center',
                                    gap: '5px 10px',
                                    margin: '12px 0 0',
                                    fontSize: '12.5px',
                                    color: 'oklch(0.4 0.02 60)',
                                }}
                            >
                                <span
                                    style={{
                                        color: '#E0A93B',
                                        fontSize: '12.5px',
                                        letterSpacing: '1px',
                                    }}
                                >
                                    ★★★★★
                                </span>
                                <strong style={{ color: 'oklch(0.28 0.02 60)' }}>5,0</strong>
                                <span>Google Review</span>
                                <span style={{ color: 'oklch(0.78 0.02 80)' }}>•</span>
                                <span>1.000+ pembeli</span>
                                <span style={{ color: 'oklch(0.78 0.02 80)' }}>•</span>
                                <span>Ada garansi kalau kurang pas</span>
                            </div>
                        </div>
                    </section>

                    <section
                        style={{
                            margin: '40px 0',
                            padding: 'clamp(24px, 5vw, 34px) clamp(16px, 4.5vw, 28px)',
                            background: '#f6f3ec',
                            border: '1px solid oklch(0.9 0.02 80)',
                            borderRadius: '20px',
                        }}
                    >
                        <p
                            style={{
                                margin: '0 0 10px',
                                fontSize: '12px',
                                fontWeight: '700',
                                letterSpacing: '0.14em',
                                textTransform: 'uppercase',
                                color: '#817661',
                            }}
                        >
                            KENAPA PILIH GORDEN WALLPAPER SOLO?
                        </p>
                        <h2
                            style={{
                                margin: '0 0 8px',
                                fontFamily: 'Poppins, Helvetica, sans-serif',
                                fontSize: 'clamp(23px, 5.2vw, 30px)',
                                lineHeight: '1.2',
                                fontWeight: '700',
                                letterSpacing: '-0.02em',
                                textWrap: 'pretty',
                            }}
                        >
                            Kenapa hasil gorden kami beda dengan marketplace dan toko gorden lain
                        </h2>
                        <p
                            style={{
                                margin: '0 0 22px',
                                color: 'oklch(0.42 0.02 60)',
                                maxWidth: '68ch',
                            }}
                        >
                            Silakan dibandingkan. Bedanya paling terasa setelah gordennya terpasang.
                        </p>
                        <div
                            style={{
                                background: '#fdfcfa',
                                border: '1px solid oklch(0.91 0.015 82)',
                                borderRadius: '18px',
                                overflow: 'clip',
                            }}
                        >
                            <div
                                style={{
                                    position: 'sticky',
                                    top: '60px',
                                    zIndex: '15',
                                    display: 'grid',
                                    gridTemplateColumns: 'minmax(0, 1fr) clamp(46px, 12vw, 84px) clamp(46px, 12vw, 84px) clamp(52px, 13vw, 96px)',
                                    alignItems: 'stretch',
                                    gap: '6px',
                                    background: '#f4f1ea',
                                    boxShadow: '0 6px 12px -10px rgba(58,53,44,0.7)',
                                }}
                            >
                                <span
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '12px 14px',
                                        fontSize: 'clamp(11px, 3vw, 12px)',
                                        fontWeight: '700',
                                        letterSpacing: '0.08em',
                                        textTransform: 'uppercase',
                                        color: '#8f8674',
                                    }}
                                >
                                    Kriteria
                                </span>
                                <span
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '12px 4px',
                                        textAlign: 'center',
                                        fontSize: 'clamp(11px, 3vw, 13px)',
                                        fontWeight: '700',
                                        lineHeight: '1.15',
                                        color: '#8f8674',
                                    }}
                                >
                                    Marketplace
                                </span>
                                <span
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '12px 4px',
                                        textAlign: 'center',
                                        fontSize: 'clamp(11px, 3vw, 13px)',
                                        fontWeight: '700',
                                        lineHeight: '1.15',
                                        color: '#8f8674',
                                    }}
                                >
                                    Toko lain
                                </span>
                                <span
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '12px 4px',
                                        textAlign: 'center',
                                        fontSize: 'clamp(11px, 3vw, 13px)',
                                        fontWeight: '700',
                                        lineHeight: '1.15',
                                        color: '#fdfcfa',
                                        background: '#817661',
                                    }}
                                >
                                    Kami
                                </span>
                            </div>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'minmax(0, 1fr) clamp(46px, 12vw, 84px) clamp(46px, 12vw, 84px) clamp(52px, 13vw, 96px)',
                                    alignItems: 'center',
                                    gap: '6px',
                                }}
                            >
                                <span
                                    style={{
                                        padding: '13px 14px',
                                        fontSize: 'clamp(13.5px, 3.6vw, 15.5px)',
                                        lineHeight: '1.35',
                                        fontWeight: '500',
                                        color: 'oklch(0.3 0.02 60)',
                                    }}
                                >
                                    Harga sepadan hasilnya
                                </span>
                                <span
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        padding: '12px 0',
                                    }}
                                >
                                    <span
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '999px',
                                            background: '#817661',
                                            color: '#fdfcfa',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                        }}
                                    >
                                        ✓
                                    </span>
                                </span>
                                <span
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        padding: '12px 0',
                                    }}
                                >
                                    <span
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '999px',
                                            background: '#e6e0d3',
                                            color: '#7d7362',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                        }}
                                    >
                                        –
                                    </span>
                                </span>
                                <span
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '12px 0',
                                        background: '#f7f4ed',
                                        height: '100%',
                                    }}
                                >
                                    <span
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '999px',
                                            background: '#817661',
                                            color: '#fdfcfa',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                        }}
                                    >
                                        ✓
                                    </span>
                                </span>
                            </div>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'minmax(0, 1fr) clamp(46px, 12vw, 84px) clamp(46px, 12vw, 84px) clamp(52px, 13vw, 96px)',
                                    alignItems: 'center',
                                    gap: '6px',
                                    borderTop: '1px solid oklch(0.94 0.012 82)',
                                }}
                            >
                                <span
                                    style={{
                                        padding: '13px 14px',
                                        fontSize: 'clamp(13.5px, 3.6vw, 15.5px)',
                                        lineHeight: '1.35',
                                        fontWeight: '500',
                                        color: 'oklch(0.3 0.02 60)',
                                    }}
                                >
                                    Jelas sejak awal, tanpa biaya tambahan
                                </span>
                                <span
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        padding: '12px 0',
                                    }}
                                >
                                    <span
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '999px',
                                            background: '#817661',
                                            color: '#fdfcfa',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                        }}
                                    >
                                        ✓
                                    </span>
                                </span>
                                <span
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        padding: '12px 0',
                                    }}
                                >
                                    <span
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '999px',
                                            background: '#e6e0d3',
                                            color: '#7d7362',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                        }}
                                    >
                                        –
                                    </span>
                                </span>
                                <span
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '12px 0',
                                        background: '#f7f4ed',
                                        height: '100%',
                                    }}
                                >
                                    <span
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '999px',
                                            background: '#817661',
                                            color: '#fdfcfa',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                        }}
                                    >
                                        ✓
                                    </span>
                                </span>
                            </div>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'minmax(0, 1fr) clamp(46px, 12vw, 84px) clamp(46px, 12vw, 84px) clamp(52px, 13vw, 96px)',
                                    alignItems: 'center',
                                    gap: '6px',
                                    borderTop: '1px solid oklch(0.94 0.012 82)',
                                }}
                            >
                                <span
                                    style={{
                                        padding: '13px 14px',
                                        fontSize: 'clamp(13.5px, 3.6vw, 15.5px)',
                                        lineHeight: '1.35',
                                        fontWeight: '500',
                                        color: 'oklch(0.3 0.02 60)',
                                    }}
                                >
                                    Ruangan benar-benar gelap
                                </span>
                                <span
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        padding: '12px 0',
                                    }}
                                >
                                    <span
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '999px',
                                            background: '#e6e0d3',
                                            color: '#7d7362',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                        }}
                                    >
                                        –
                                    </span>
                                </span>
                                <span
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        padding: '12px 0',
                                    }}
                                >
                                    <span
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '999px',
                                            background: '#817661',
                                            color: '#fdfcfa',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                        }}
                                    >
                                        ✓
                                    </span>
                                </span>
                                <span
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '12px 0',
                                        background: '#f7f4ed',
                                        height: '100%',
                                    }}
                                >
                                    <span
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '999px',
                                            background: '#817661',
                                            color: '#fdfcfa',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                        }}
                                    >
                                        ✓
                                    </span>
                                </span>
                            </div>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'minmax(0, 1fr) clamp(46px, 12vw, 84px) clamp(46px, 12vw, 84px) clamp(52px, 13vw, 96px)',
                                    alignItems: 'center',
                                    gap: '6px',
                                    borderTop: '1px solid oklch(0.94 0.012 82)',
                                }}
                            >
                                <span
                                    style={{
                                        padding: '13px 14px',
                                        fontSize: 'clamp(13.5px, 3.6vw, 15.5px)',
                                        lineHeight: '1.35',
                                        fontWeight: '500',
                                        color: 'oklch(0.3 0.02 60)',
                                    }}
                                >
                                    Pas di jendela Anda
                                </span>
                                <span
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        padding: '12px 0',
                                    }}
                                >
                                    <span
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '999px',
                                            background: '#eee9df',
                                            color: '#b3a892',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                        }}
                                    >
                                        ✕
                                    </span>
                                </span>
                                <span
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        padding: '12px 0',
                                    }}
                                >
                                    <span
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '999px',
                                            background: '#817661',
                                            color: '#fdfcfa',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                        }}
                                    >
                                        ✓
                                    </span>
                                </span>
                                <span
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '12px 0',
                                        background: '#f7f4ed',
                                        height: '100%',
                                    }}
                                >
                                    <span
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '999px',
                                            background: '#817661',
                                            color: '#fdfcfa',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                        }}
                                    >
                                        ✓
                                    </span>
                                </span>
                            </div>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'minmax(0, 1fr) clamp(46px, 12vw, 84px) clamp(46px, 12vw, 84px) clamp(52px, 13vw, 96px)',
                                    alignItems: 'center',
                                    gap: '6px',
                                    borderTop: '1px solid oklch(0.94 0.012 82)',
                                }}
                            >
                                <span
                                    style={{
                                        padding: '13px 14px',
                                        fontSize: 'clamp(13.5px, 3.6vw, 15.5px)',
                                        lineHeight: '1.35',
                                        fontWeight: '500',
                                        color: 'oklch(0.3 0.02 60)',
                                    }}
                                >
                                    Jatuhnya rapi berkat finishing steam
                                </span>
                                <span
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        padding: '12px 0',
                                    }}
                                >
                                    <span
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '999px',
                                            background: '#eee9df',
                                            color: '#b3a892',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                        }}
                                    >
                                        ✕
                                    </span>
                                </span>
                                <span
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        padding: '12px 0',
                                    }}
                                >
                                    <span
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '999px',
                                            background: '#e6e0d3',
                                            color: '#7d7362',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                        }}
                                    >
                                        –
                                    </span>
                                </span>
                                <span
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '12px 0',
                                        background: '#f7f4ed',
                                        height: '100%',
                                    }}
                                >
                                    <span
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '999px',
                                            background: '#817661',
                                            color: '#fdfcfa',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                        }}
                                    >
                                        ✓
                                    </span>
                                </span>
                            </div>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'minmax(0, 1fr) clamp(46px, 12vw, 84px) clamp(46px, 12vw, 84px) clamp(52px, 13vw, 96px)',
                                    alignItems: 'center',
                                    gap: '6px',
                                    borderTop: '1px solid oklch(0.94 0.012 82)',
                                }}
                            >
                                <span
                                    style={{
                                        padding: '13px 14px',
                                        fontSize: 'clamp(13.5px, 3.6vw, 15.5px)',
                                        lineHeight: '1.35',
                                        fontWeight: '500',
                                        color: 'oklch(0.3 0.02 60)',
                                    }}
                                >
                                    Aman dari salah ukur
                                </span>
                                <span
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        padding: '12px 0',
                                    }}
                                >
                                    <span
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '999px',
                                            background: '#eee9df',
                                            color: '#b3a892',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                        }}
                                    >
                                        ✕
                                    </span>
                                </span>
                                <span
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        padding: '12px 0',
                                    }}
                                >
                                    <span
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '999px',
                                            background: '#e6e0d3',
                                            color: '#7d7362',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                        }}
                                    >
                                        –
                                    </span>
                                </span>
                                <span
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '12px 0',
                                        background: '#f7f4ed',
                                        height: '100%',
                                    }}
                                >
                                    <span
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '999px',
                                            background: '#817661',
                                            color: '#fdfcfa',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                        }}
                                    >
                                        ✓
                                    </span>
                                </span>
                            </div>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'minmax(0, 1fr) clamp(46px, 12vw, 84px) clamp(46px, 12vw, 84px) clamp(52px, 13vw, 96px)',
                                    alignItems: 'center',
                                    gap: '6px',
                                    borderTop: '1px solid oklch(0.94 0.012 82)',
                                }}
                            >
                                <span
                                    style={{
                                        padding: '13px 14px',
                                        fontSize: 'clamp(13.5px, 3.6vw, 15.5px)',
                                        lineHeight: '1.35',
                                        fontWeight: '500',
                                        color: 'oklch(0.3 0.02 60)',
                                    }}
                                >
                                    Bisa tanya sampai cocok
                                </span>
                                <span
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        padding: '12px 0',
                                    }}
                                >
                                    <span
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '999px',
                                            background: '#eee9df',
                                            color: '#b3a892',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                        }}
                                    >
                                        ✕
                                    </span>
                                </span>
                                <span
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        padding: '12px 0',
                                    }}
                                >
                                    <span
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '999px',
                                            background: '#817661',
                                            color: '#fdfcfa',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                        }}
                                    >
                                        ✓
                                    </span>
                                </span>
                                <span
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '12px 0',
                                        background: '#f7f4ed',
                                        height: '100%',
                                    }}
                                >
                                    <span
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '999px',
                                            background: '#817661',
                                            color: '#fdfcfa',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                        }}
                                    >
                                        ✓
                                    </span>
                                </span>
                            </div>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'minmax(0, 1fr) clamp(46px, 12vw, 84px) clamp(46px, 12vw, 84px) clamp(52px, 13vw, 96px)',
                                    alignItems: 'center',
                                    gap: '6px',
                                    borderTop: '1px solid oklch(0.94 0.012 82)',
                                }}
                            >
                                <span
                                    style={{
                                        padding: '13px 14px',
                                        fontSize: 'clamp(13.5px, 3.6vw, 15.5px)',
                                        lineHeight: '1.35',
                                        fontWeight: '500',
                                        color: 'oklch(0.3 0.02 60)',
                                    }}
                                >
                                    Terpasang, tinggal terima beres
                                </span>
                                <span
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        padding: '12px 0',
                                    }}
                                >
                                    <span
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '999px',
                                            background: '#eee9df',
                                            color: '#b3a892',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                        }}
                                    >
                                        ✕
                                    </span>
                                </span>
                                <span
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        padding: '12px 0',
                                    }}
                                >
                                    <span
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '999px',
                                            background: '#e6e0d3',
                                            color: '#7d7362',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                        }}
                                    >
                                        –
                                    </span>
                                </span>
                                <span
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '12px 0',
                                        background: '#f7f4ed',
                                        height: '100%',
                                    }}
                                >
                                    <span
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '999px',
                                            background: '#817661',
                                            color: '#fdfcfa',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                        }}
                                    >
                                        ✓
                                    </span>
                                </span>
                            </div>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'minmax(0, 1fr) clamp(46px, 12vw, 84px) clamp(46px, 12vw, 84px) clamp(52px, 13vw, 96px)',
                                    alignItems: 'center',
                                    gap: '6px',
                                    borderTop: '1px solid oklch(0.94 0.012 82)',
                                }}
                            >
                                <span
                                    style={{
                                        padding: '13px 14px',
                                        fontSize: 'clamp(13.5px, 3.6vw, 15.5px)',
                                        lineHeight: '1.35',
                                        fontWeight: '500',
                                        color: 'oklch(0.3 0.02 60)',
                                    }}
                                >
                                    Ada garansi kalau kurang pas
                                </span>
                                <span
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        padding: '12px 0',
                                    }}
                                >
                                    <span
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '999px',
                                            background: '#eee9df',
                                            color: '#b3a892',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                        }}
                                    >
                                        ✕
                                    </span>
                                </span>
                                <span
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        padding: '12px 0',
                                    }}
                                >
                                    <span
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '999px',
                                            background: '#e6e0d3',
                                            color: '#7d7362',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                        }}
                                    >
                                        –
                                    </span>
                                </span>
                                <span
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '12px 0',
                                        background: '#f7f4ed',
                                        height: '100%',
                                    }}
                                >
                                    <span
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '999px',
                                            background: '#817661',
                                            color: '#fdfcfa',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                        }}
                                    >
                                        ✓
                                    </span>
                                </span>
                            </div>
                        </div>
                        <p
                            style={{
                                margin: '22px 0 0',
                                padding: '18px 20px',
                                background: '#fdfcfa',
                                borderLeft: '5px solid #817661',
                                borderRadius: '12px',
                                fontSize: 'clamp(15px, 4vw, 18px)',
                                lineHeight: '1.5',
                                color: 'oklch(0.3 0.02 60)',
                                textWrap: 'pretty',
                            }}
                        >
                            Yang kami janjikan hasil akhir yang pas di jendela Anda, rapi dan siap pakai.
                        </p>
                        <div style={{ margin: '26px 0 0' }}>
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '12px',
                                }}
                            >
                                <a
                                    href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20konsultasi%20gorden.%20Boleh%20dibantu%3F"
                                    target="_blank"
                                    rel="noopener"
                                    style={{
                                        flex: '1 1 260px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minHeight: '56px',
                                        padding: '14px 18px',
                                        background: '#FF6B35',
                                        color: '#fff',
                                        fontSize: 'clamp(15px, 3.9vw, 17px)',
                                        fontWeight: '700',
                                        textDecoration: 'none',
                                        borderRadius: '12px',
                                    }}
                                >
                                    <img
                                        src="/assets/whatsapp.svg"
                                        alt=""
                                        style={{
                                            flex: 'none',
                                            width: '20px',
                                            height: '20px',
                                            marginRight: '9px',
                                            display: 'block',
                                        }}
                                    />
                                    Konsultasi Gratis →
                                </a>
                                <a
                                    href="#katalog"
                                    style={{
                                        flex: '1 1 220px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minHeight: '56px',
                                        padding: '14px 18px',
                                        background: '#fdfcfa',
                                        border: '2px solid #FF6B35',
                                        color: '#C24E1E',
                                        fontSize: 'clamp(15px, 3.9vw, 17px)',
                                        fontWeight: '700',
                                        textDecoration: 'none',
                                        borderRadius: '12px',
                                    }}
                                >
                                    Lihat Model Gorden →
                                </a>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    alignItems: 'center',
                                    gap: '5px 10px',
                                    margin: '12px 0 0',
                                    fontSize: '12.5px',
                                    color: 'oklch(0.4 0.02 60)',
                                }}
                            >
                                <span
                                    style={{
                                        color: '#E0A93B',
                                        fontSize: '12.5px',
                                        letterSpacing: '1px',
                                    }}
                                >
                                    ★★★★★
                                </span>
                                <strong style={{ color: 'oklch(0.28 0.02 60)' }}>5,0</strong>
                                <span>Google Review</span>
                                <span style={{ color: 'oklch(0.78 0.02 80)' }}>•</span>
                                <span>1.000+ pembeli</span>
                                <span style={{ color: 'oklch(0.78 0.02 80)' }}>•</span>
                                <span>Ada garansi kalau kurang pas</span>
                            </div>
                        </div>
                    </section>

                    <section
                        style={{
                            padding: '44px 0',
                            borderTop: '1px solid oklch(0.9 0.02 80)',
                        }}
                    >
                        <p
                            style={{
                                margin: '0 0 10px',
                                fontSize: '12px',
                                fontWeight: '700',
                                letterSpacing: '0.14em',
                                textTransform: 'uppercase',
                                color: '#817661',
                            }}
                        >
                            Hasil akhirnya
                        </p>
                        <h2
                            style={{
                                margin: '0 0 8px',
                                fontFamily: 'Poppins, Helvetica, sans-serif',
                                fontSize: 'clamp(23px, 5.2vw, 30px)',
                                lineHeight: '1.2',
                                fontWeight: '700',
                                letterSpacing: '-0.02em',
                                textWrap: 'pretty',
                            }}
                        >
                            Beginilah hasil pemasangan kami
                        </h2>
                        <p
                            style={{
                                margin: '0 0 20px',
                                color: 'oklch(0.42 0.02 60)',
                                maxWidth: '68ch',
                            }}
                        >
                            Ruangan yang sama, hanya beda gordennya. Sepengaruh itu kain dan ukuran yang tepat.
                        </p>
                        <div
                            style={{
                                margin: '0',
                                padding: '18px 16px',
                                background: '#f6f3ec',
                                border: '1px solid oklch(0.9 0.02 80)',
                                borderRadius: '16px',
                            }}
                        >
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
                                    gap: '14px',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <div
                                        style={{
                                            position: 'relative',
                                            border: '1px solid oklch(0.88 0.02 80)',
                                            borderBottom: 'none',
                                            borderRadius: '14px',
                                            aspectRatio: '3 / 4',
                                            ...lazyBackground("url('/assets/before-gorden.webp')"),
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <span
                                            style={{
                                                position: 'absolute',
                                                top: '12px',
                                                left: '12px',
                                                padding: '6px 14px',
                                                background: '#fdfcfa',
                                                color: '#5d5546',
                                                fontSize: '12px',
                                                fontWeight: '700',
                                                letterSpacing: '0.1em',
                                                textTransform: 'uppercase',
                                                borderRadius: '999px',
                                                boxShadow: '0 4px 12px -4px rgba(0,0,0,0.35)',
                                            }}
                                        >
                                            Before
                                        </span>
                                    </div>
                                </div>

                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <div
                                        style={{
                                            position: 'relative',
                                            border: '1px solid oklch(0.88 0.02 80)',
                                            borderBottom: 'none',
                                            borderRadius: '14px',
                                            aspectRatio: '3 / 4',
                                            ...lazyBackground("url('/assets/after-gorden.webp')"),
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <span
                                            style={{
                                                position: 'absolute',
                                                top: '12px',
                                                left: '12px',
                                                padding: '6px 14px',
                                                color: '#fff',
                                                fontSize: '12px',
                                                fontWeight: '700',
                                                letterSpacing: '0.1em',
                                                textTransform: 'uppercase',
                                                borderRadius: '999px',
                                                boxShadow: '0 4px 12px -4px rgba(0,0,0,0.35)',
                                                backgroundColor: '#817661',
                                            }}
                                        >
                                            After
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p
                                style={{
                                    margin: '12px 0 0',
                                    fontSize: '13px',
                                    color: 'oklch(0.5 0.03 70)',
                                }}
                            >
                                Project nyata: rumah di Perumahan Colomadu, Karanganyar, gorden smokering custom ukuran.
                            </p>
                        </div>

                        <div style={{ margin: '26px 0 0' }}>
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '12px',
                                }}
                            >
                                <a
                                    href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20konsultasi%20gorden.%20Boleh%20dibantu%3F"
                                    target="_blank"
                                    rel="noopener"
                                    style={{
                                        flex: '1 1 260px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minHeight: '56px',
                                        padding: '14px 18px',
                                        background: '#FF6B35',
                                        color: '#fff',
                                        fontSize: 'clamp(15px, 3.9vw, 17px)',
                                        fontWeight: '700',
                                        textDecoration: 'none',
                                        borderRadius: '12px',
                                    }}
                                >
                                    <img
                                        src="/assets/whatsapp.svg"
                                        alt=""
                                        style={{
                                            flex: 'none',
                                            width: '20px',
                                            height: '20px',
                                            marginRight: '9px',
                                            display: 'block',
                                        }}
                                    />
                                    Konsultasi Gratis →
                                </a>
                                <a
                                    href="#portofolio"
                                    style={{
                                        flex: '1 1 220px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minHeight: '56px',
                                        padding: '14px 18px',
                                        background: 'rgba(253,252,250,0.12)',
                                        border: '2px solid #FF6B35',
                                        color: '#241D17',
                                        fontSize: 'clamp(15px, 3.9vw, 17px)',
                                        fontWeight: '700',
                                        textDecoration: 'none',
                                        borderRadius: '12px',
                                        backdropFilter: 'blur(4px)',
                                    }}
                                >
                                    Lihat Portofolio →
                                </a>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    alignItems: 'center',
                                    gap: '5px 10px',
                                    margin: '12px 0 0',
                                    fontSize: '12.5px',
                                    color: 'oklch(0.4 0.02 60)',
                                }}
                            >
                                <span
                                    style={{
                                        color: '#E0A93B',
                                        fontSize: '12.5px',
                                        letterSpacing: '1px',
                                    }}
                                >
                                    ★★★★★
                                </span>
                                <strong style={{ color: 'oklch(0.28 0.02 60)' }}>5,0</strong>
                                <span>Google Review</span>
                                <span style={{ color: 'oklch(0.78 0.02 80)' }}>•</span>
                                <span>1.000+ pembeli</span>
                                <span style={{ color: 'oklch(0.78 0.02 80)' }}>•</span>
                                <span>Ada garansi kalau kurang pas</span>
                            </div>
                        </div>
                    </section>

                    <section
                        style={{
                            padding: '44px 0',
                            borderTop: '1px solid oklch(0.9 0.02 80)',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                alignItems: 'flex-end',
                                justifyContent: 'space-between',
                                gap: '10px 24px',
                                margin: '0 0 22px',
                            }}
                        >
                            <div>
                                <p
                                    style={{
                                        margin: '0 0 10px',
                                        fontSize: '12px',
                                        fontWeight: '700',
                                        letterSpacing: '0.14em',
                                        textTransform: 'uppercase',
                                        color: '#817661',
                                    }}
                                >
                                    Untuk siapa
                                </p>
                                <h2
                                    style={{
                                        margin: '0',
                                        fontFamily: 'Poppins, Helvetica, sans-serif',
                                        fontSize: 'clamp(23px, 5.2vw, 30px)',
                                        lineHeight: '1.2',
                                        fontWeight: '700',
                                        letterSpacing: '-0.02em',
                                    }}
                                >
                                    Untuk siapa layanan ini
                                </h2>
                            </div>
                            <p
                                style={{
                                    margin: '0',
                                    maxWidth: '40ch',
                                    fontSize: '15px',
                                    color: 'oklch(0.45 0.02 60)',
                                }}
                            >
                                Kebutuhan tiap ruangan beda, kami bantu cari yang paling cocok.
                            </p>
                        </div>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
                                gap: '14px',
                            }}
                        >
                            <article
                                style={{
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    minHeight: '300px',
                                    padding: '20px',
                                    borderRadius: '18px',
                                    overflow: 'hidden',
                                    ...lazyBackground("linear-gradient(to top, rgba(30,25,19,0.9) 0%, rgba(30,25,19,0.62) 28%, rgba(30,25,19,0.22) 58%, rgba(30,25,19,0) 100%), url('/assets/persona-rumah.webp')"),
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            >
                                <span
                                    style={{
                                        position: 'absolute',
                                        top: '16px',
                                        left: '18px',
                                        fontFamily: 'Poppins, Helvetica, sans-serif',
                                        fontSize: '13px',
                                        fontWeight: '700',
                                        letterSpacing: '0.14em',
                                        color: 'rgba(253,252,250,0.75)',
                                    }}
                                >
                                    01
                                </span>
                                <h3
                                    style={{
                                        margin: '0 0 6px',
                                        fontFamily: 'Poppins, Helvetica, sans-serif',
                                        fontSize: 'clamp(18px, 4.4vw, 21px)',
                                        fontWeight: '700',
                                        letterSpacing: '-0.015em',
                                        color: '#fdfcfa',
                                    }}
                                >
                                    Pemilik rumah baru
                                </h3>
                                <p
                                    style={{
                                        margin: '0',
                                        fontSize: '15px',
                                        lineHeight: '1.45',
                                        color: 'rgba(253,252,250,0.85)',
                                    }}
                                >
                                    Rumah baru langsung terasa rapi dan adem, ukur dan pasang urusan kami.
                                </p>
                            </article>
                            <article
                                style={{
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    minHeight: '300px',
                                    padding: '20px',
                                    borderRadius: '18px',
                                    overflow: 'hidden',
                                    ...lazyBackground("linear-gradient(to top, rgba(30,25,19,0.9) 0%, rgba(30,25,19,0.62) 28%, rgba(30,25,19,0.22) 58%, rgba(30,25,19,0) 100%), url('/assets/persona-kantor.webp')"),
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            >
                                <span
                                    style={{
                                        position: 'absolute',
                                        top: '16px',
                                        left: '18px',
                                        fontFamily: 'Poppins, Helvetica, sans-serif',
                                        fontSize: '13px',
                                        fontWeight: '700',
                                        letterSpacing: '0.14em',
                                        color: 'rgba(253,252,250,0.75)',
                                    }}
                                >
                                    02
                                </span>
                                <h3
                                    style={{
                                        margin: '0 0 6px',
                                        fontFamily: 'Poppins, Helvetica, sans-serif',
                                        fontSize: 'clamp(18px, 4.4vw, 21px)',
                                        fontWeight: '700',
                                        letterSpacing: '-0.015em',
                                        color: '#fdfcfa',
                                    }}
                                >
                                    Pemilik &amp; karyawan kantor
                                </h3>
                                <p
                                    style={{
                                        margin: '0',
                                        fontSize: '15px',
                                        lineHeight: '1.45',
                                        color: 'rgba(253,252,250,0.85)',
                                    }}
                                >
                                    Layar tidak silau, ruang kerja lebih nyaman sesuai fungsinya.
                                </p>
                            </article>
                            <article
                                style={{
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    minHeight: '300px',
                                    padding: '20px',
                                    borderRadius: '18px',
                                    overflow: 'hidden',
                                    ...lazyBackground("linear-gradient(to top, rgba(30,25,19,0.9) 0%, rgba(30,25,19,0.62) 28%, rgba(30,25,19,0.22) 58%, rgba(30,25,19,0) 100%), url('/assets/persona-villa.webp')"),
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            >
                                <span
                                    style={{
                                        position: 'absolute',
                                        top: '16px',
                                        left: '18px',
                                        fontFamily: 'Poppins, Helvetica, sans-serif',
                                        fontSize: '13px',
                                        fontWeight: '700',
                                        letterSpacing: '0.14em',
                                        color: 'rgba(253,252,250,0.75)',
                                    }}
                                >
                                    03
                                </span>
                                <h3
                                    style={{
                                        margin: '0 0 6px',
                                        fontFamily: 'Poppins, Helvetica, sans-serif',
                                        fontSize: 'clamp(18px, 4.4vw, 21px)',
                                        fontWeight: '700',
                                        letterSpacing: '-0.015em',
                                        color: '#fdfcfa',
                                    }}
                                >
                                    Pemilik villa &amp; apartemen
                                </h3>
                                <p
                                    style={{
                                        margin: '0',
                                        fontSize: '15px',
                                        lineHeight: '1.45',
                                        color: 'rgba(253,252,250,0.85)',
                                    }}
                                >
                                    Unit terasa seperti suite hotel, nilai sewanya ikut naik.
                                </p>
                            </article>
                            <article
                                style={{
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    minHeight: '300px',
                                    padding: '20px',
                                    borderRadius: '18px',
                                    overflow: 'hidden',
                                    ...lazyBackground("linear-gradient(to top, rgba(30,25,19,0.9) 0%, rgba(30,25,19,0.62) 28%, rgba(30,25,19,0.22) 58%, rgba(30,25,19,0) 100%), url('/assets/persona-usaha.webp')"),
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            >
                                <span
                                    style={{
                                        position: 'absolute',
                                        top: '16px',
                                        left: '18px',
                                        fontFamily: 'Poppins, Helvetica, sans-serif',
                                        fontSize: '13px',
                                        fontWeight: '700',
                                        letterSpacing: '0.14em',
                                        color: 'rgba(253,252,250,0.75)',
                                    }}
                                >
                                    04
                                </span>
                                <h3
                                    style={{
                                        margin: '0 0 6px',
                                        fontFamily: 'Poppins, Helvetica, sans-serif',
                                        fontSize: 'clamp(18px, 4.4vw, 21px)',
                                        fontWeight: '700',
                                        letterSpacing: '-0.015em',
                                        color: '#fdfcfa',
                                    }}
                                >
                                    Pelaku usaha online
                                </h3>
                                <p
                                    style={{
                                        margin: '0',
                                        fontSize: '15px',
                                        lineHeight: '1.45',
                                        color: 'rgba(253,252,250,0.85)',
                                    }}
                                >
                                    Background live dan foto katalog jadi bersih dan konsisten.
                                </p>
                            </article>
                        </div>
                        <div style={{ margin: '26px 0 0' }}>
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '12px',
                                }}
                            >
                                <a
                                    href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20konsultasi%20gorden.%20Boleh%20dibantu%3F"
                                    target="_blank"
                                    rel="noopener"
                                    style={{
                                        flex: '1 1 260px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minHeight: '56px',
                                        padding: '14px 18px',
                                        background: '#FF6B35',
                                        color: '#fff',
                                        fontSize: 'clamp(15px, 3.9vw, 17px)',
                                        fontWeight: '700',
                                        textDecoration: 'none',
                                        borderRadius: '12px',
                                    }}
                                >
                                    <img
                                        src="/assets/whatsapp.svg"
                                        alt=""
                                        style={{
                                            flex: 'none',
                                            width: '20px',
                                            height: '20px',
                                            marginRight: '9px',
                                            display: 'block',
                                        }}
                                    />
                                    Konsultasi Gratis →
                                </a>
                                <a
                                    href="#portofolio"
                                    style={{
                                        flex: '1 1 220px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minHeight: '56px',
                                        padding: '14px 18px',
                                        background: 'rgba(253,252,250,0.12)',
                                        border: '2px solid #FF6B35',
                                        color: '#241D17',
                                        fontSize: 'clamp(15px, 3.9vw, 17px)',
                                        fontWeight: '700',
                                        textDecoration: 'none',
                                        borderRadius: '12px',
                                        backdropFilter: 'blur(4px)',
                                    }}
                                >
                                    Lihat Portofolio →
                                </a>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    alignItems: 'center',
                                    gap: '5px 10px',
                                    margin: '12px 0 0',
                                    fontSize: '12.5px',
                                    color: 'oklch(0.4 0.02 60)',
                                }}
                            >
                                <span
                                    style={{
                                        color: '#E0A93B',
                                        fontSize: '12.5px',
                                        letterSpacing: '1px',
                                    }}
                                >
                                    ★★★★★
                                </span>
                                <strong style={{ color: 'oklch(0.28 0.02 60)' }}>5,0</strong>
                                <span>Google Review</span>
                                <span style={{ color: 'oklch(0.78 0.02 80)' }}>•</span>
                                <span>1.000+ pembeli</span>
                                <span style={{ color: 'oklch(0.78 0.02 80)' }}>•</span>
                                <span>Ada garansi kalau kurang pas</span>
                            </div>
                        </div>
                    </section>

                    <section
                        id="portofolio"
                        onClick={openLightbox}
                        style={{
                            padding: '44px 0',
                            borderTop: '1px solid oklch(0.9 0.02 80)',
                            scrollMarginTop: '76px',
                        }}
                    >
                        <p
                            style={{
                                margin: '0 0 10px',
                                fontSize: '12px',
                                fontWeight: '700',
                                letterSpacing: '0.14em',
                                textTransform: 'uppercase',
                                color: '#817661',
                            }}
                        >
                            Portofolio
                        </p>
                        <h2
                            style={{
                                margin: '0 0 8px',
                                fontFamily: 'Poppins, Helvetica, sans-serif',
                                fontSize: 'clamp(23px, 5.2vw, 30px)',
                                lineHeight: '1.2',
                                fontWeight: '700',
                                letterSpacing: '-0.02em',
                            }}
                        >
                            Sudah dipercaya rumah, kantor, kampus, dan rumah sakit
                        </h2>
                        <p
                            style={{
                                margin: '0 0 22px',
                                color: 'oklch(0.42 0.02 60)',
                                maxWidth: '68ch',
                            }}
                        >
                            Rumah, kantor, kampus, rumah sakit, sampai apartemen, semuanya dikerjakan tim kami sendiri.
                        </p>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(min(46%, 200px), 1fr))',
                                gap: '16px 14px',
                            }}
                        >
                            <div>
                                <div
                                    data-zoom="/assets/img-gorden-premium-rumah-pribadi-permata-bot.webp"
                                    style={{
                                        borderRadius: '12px',
                                        border: '1px solid oklch(0.88 0.02 80)',
                                        aspectRatio: '1 / 1',
                                        ...lazyBackground("url('/assets/img-gorden-premium-rumah-pribadi-permata-bot.webp')"),
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        cursor: 'zoom-in',
                                    }}
                                ></div>
                                <p
                                    style={{
                                        margin: '8px 0 0',
                                        fontSize: '15px',
                                        fontWeight: '700',
                                        color: 'oklch(0.28 0.02 60)',
                                    }}
                                >
                                    Gorden Premium
                                </p>
                                <p
                                    style={{
                                        margin: '1px 0 0',
                                        fontSize: '14px',
                                        color: 'oklch(0.48 0.02 60)',
                                    }}
                                >
                                    Permata Botanical, Solo
                                </p>
                            </div>

                            <div>
                                <div
                                    data-zoom="/assets/img-gorden-rumah-sakit-rso-orthopedi-surakar.webp"
                                    style={{
                                        borderRadius: '12px',
                                        border: '1px solid oklch(0.88 0.02 80)',
                                        aspectRatio: '1 / 1',
                                        ...lazyBackground("url('/assets/img-gorden-rumah-sakit-rso-orthopedi-surakar.webp')"),
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        cursor: 'zoom-in',
                                    }}
                                ></div>
                                <p
                                    style={{
                                        margin: '8px 0 0',
                                        fontSize: '15px',
                                        fontWeight: '700',
                                        color: 'oklch(0.28 0.02 60)',
                                    }}
                                >
                                    Gorden Rumah Sakit
                                </p>
                                <p
                                    style={{
                                        margin: '1px 0 0',
                                        fontSize: '14px',
                                        color: 'oklch(0.48 0.02 60)',
                                    }}
                                >
                                    RSO Orthopedi Surakarta
                                </p>
                            </div>

                            <div>
                                <div
                                    data-zoom="/assets/img-tirai-solar-screen-blinds-dna-cafe-solo-.webp"
                                    style={{
                                        borderRadius: '12px',
                                        border: '1px solid oklch(0.88 0.02 80)',
                                        aspectRatio: '1 / 1',
                                        ...lazyBackground("url('/assets/img-tirai-solar-screen-blinds-dna-cafe-solo-.webp')"),
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        cursor: 'zoom-in',
                                    }}
                                ></div>
                                <p
                                    style={{
                                        margin: '8px 0 0',
                                        fontSize: '15px',
                                        fontWeight: '700',
                                        color: 'oklch(0.28 0.02 60)',
                                    }}
                                >
                                    Tirai Solar Screen Blinds
                                </p>
                                <p
                                    style={{
                                        margin: '1px 0 0',
                                        fontSize: '14px',
                                        color: 'oklch(0.48 0.02 60)',
                                    }}
                                >
                                    DNA Cafe, Solo
                                </p>
                            </div>

                            <div>
                                <div
                                    data-zoom="/assets/img-roller-blinds-aula-kantor-bpvp-surakarta.webp"
                                    style={{
                                        borderRadius: '12px',
                                        border: '1px solid oklch(0.88 0.02 80)',
                                        aspectRatio: '1 / 1',
                                        ...lazyBackground("url('/assets/img-roller-blinds-aula-kantor-bpvp-surakarta.webp')"),
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        cursor: 'zoom-in',
                                    }}
                                ></div>
                                <p
                                    style={{
                                        margin: '8px 0 0',
                                        fontSize: '15px',
                                        fontWeight: '700',
                                        color: 'oklch(0.28 0.02 60)',
                                    }}
                                >
                                    Roller Blinds
                                </p>
                                <p
                                    style={{
                                        margin: '1px 0 0',
                                        fontSize: '14px',
                                        color: 'oklch(0.48 0.02 60)',
                                    }}
                                >
                                    Aula Kantor BPVP Surakarta
                                </p>
                            </div>
                        </div>
                        {showAllProjects && (
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(46%, 200px), 1fr))',
                                    gap: '16px 14px',
                                    margin: '16px 0 0',
                                }}
                            >
                                <div>
                                    <div
                                        data-zoom="/assets/img-gorden-dan-wallpaper-aula-tk-kanita-tiar.webp"
                                        style={{
                                            borderRadius: '12px',
                                            border: '1px solid oklch(0.88 0.02 80)',
                                            aspectRatio: '1 / 1',
                                            ...lazyBackground("url('/assets/img-gorden-dan-wallpaper-aula-tk-kanita-tiar.webp')"),
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            cursor: 'zoom-in',
                                        }}
                                    ></div>
                                    <p
                                        style={{
                                            margin: '8px 0 0',
                                            fontSize: '15px',
                                            fontWeight: '700',
                                            color: 'oklch(0.28 0.02 60)',
                                        }}
                                    >
                                        Gorden Blackout &amp; Wallpaper
                                    </p>
                                    <p
                                        style={{
                                            margin: '1px 0 0',
                                            fontSize: '14px',
                                            color: 'oklch(0.48 0.02 60)',
                                        }}
                                    >
                                        Aula TK Kanita Tiara, Sukoharjo
                                    </p>
                                </div>

                                <div>
                                    <div
                                        data-zoom="/assets/img-gorden-premium-permata-regency-1.webp"
                                        style={{
                                            borderRadius: '12px',
                                            border: '1px solid oklch(0.88 0.02 80)',
                                            aspectRatio: '1 / 1',
                                            ...lazyBackground("url('/assets/img-gorden-premium-permata-regency-1.webp')"),
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            cursor: 'zoom-in',
                                        }}
                                    ></div>
                                    <p
                                        style={{
                                            margin: '8px 0 0',
                                            fontSize: '15px',
                                            fontWeight: '700',
                                            color: 'oklch(0.28 0.02 60)',
                                        }}
                                    >
                                        Gorden Premium
                                    </p>
                                    <p
                                        style={{
                                            margin: '1px 0 0',
                                            fontSize: '14px',
                                            color: 'oklch(0.48 0.02 60)',
                                        }}
                                    >
                                        Permata Regency, Solo
                                    </p>
                                </div>

                                <div>
                                    <div
                                        data-zoom="/assets/img-wallpaper-fk-uns.webp"
                                        style={{
                                            borderRadius: '12px',
                                            border: '1px solid oklch(0.88 0.02 80)',
                                            aspectRatio: '1 / 1',
                                            ...lazyBackground("url('/assets/img-wallpaper-fk-uns.webp')"),
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            cursor: 'zoom-in',
                                        }}
                                    ></div>
                                    <p
                                        style={{
                                            margin: '8px 0 0',
                                            fontSize: '15px',
                                            fontWeight: '700',
                                            color: 'oklch(0.28 0.02 60)',
                                        }}
                                    >
                                        Wallpaper Custom
                                    </p>
                                    <p
                                        style={{
                                            margin: '1px 0 0',
                                            fontSize: '14px',
                                            color: 'oklch(0.48 0.02 60)',
                                        }}
                                    >
                                        FK UNS, Solo
                                    </p>
                                </div>

                                <div>
                                    <div
                                        data-zoom="/assets/img-gorden-blackout-rumah-pribadi-dr.bayuspo.webp"
                                        style={{
                                            borderRadius: '12px',
                                            border: '1px solid oklch(0.88 0.02 80)',
                                            aspectRatio: '1 / 1',
                                            ...lazyBackground("url('/assets/img-gorden-blackout-rumah-pribadi-dr.bayuspo.webp')"),
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            cursor: 'zoom-in',
                                        }}
                                    ></div>
                                    <p
                                        style={{
                                            margin: '8px 0 0',
                                            fontSize: '15px',
                                            fontWeight: '700',
                                            color: 'oklch(0.28 0.02 60)',
                                        }}
                                    >
                                        Gorden Blackout
                                    </p>
                                    <p
                                        style={{
                                            margin: '1px 0 0',
                                            fontSize: '14px',
                                            color: 'oklch(0.48 0.02 60)',
                                        }}
                                    >
                                        Rumah pribadi dr. Bayu, Sp.OT
                                    </p>
                                </div>

                                <div>
                                    <div
                                        data-zoom="/assets/img-roller-eksterior-blind-rumah-pribadi-per.webp"
                                        style={{
                                            borderRadius: '12px',
                                            border: '1px solid oklch(0.88 0.02 80)',
                                            aspectRatio: '1 / 1',
                                            ...lazyBackground("url('/assets/img-roller-eksterior-blind-rumah-pribadi-per.webp')"),
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            cursor: 'zoom-in',
                                        }}
                                    ></div>
                                    <p
                                        style={{
                                            margin: '8px 0 0',
                                            fontSize: '15px',
                                            fontWeight: '700',
                                            color: 'oklch(0.28 0.02 60)',
                                        }}
                                    >
                                        Roller Eksterior Blinds
                                    </p>
                                    <p
                                        style={{
                                            margin: '1px 0 0',
                                            fontSize: '14px',
                                            color: 'oklch(0.48 0.02 60)',
                                        }}
                                    >
                                        Rumah pribadi, Perum Gentan Citra
                                    </p>
                                </div>

                                <div>
                                    <div
                                        data-zoom="/assets/img-gorden-apartemen-solo-.webp"
                                        style={{
                                            borderRadius: '12px',
                                            border: '1px solid oklch(0.88 0.02 80)',
                                            aspectRatio: '1 / 1',
                                            ...lazyBackground("url('/assets/img-gorden-apartemen-solo-.webp')"),
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            cursor: 'zoom-in',
                                        }}
                                    ></div>
                                    <p
                                        style={{
                                            margin: '8px 0 0',
                                            fontSize: '15px',
                                            fontWeight: '700',
                                            color: 'oklch(0.28 0.02 60)',
                                        }}
                                    >
                                        Gorden Apartemen
                                    </p>
                                    <p
                                        style={{
                                            margin: '1px 0 0',
                                            fontSize: '14px',
                                            color: 'oklch(0.48 0.02 60)',
                                        }}
                                    >
                                        Apartemen di Solo
                                    </p>
                                </div>

                                <div>
                                    <div
                                        data-zoom="/assets/img-zebra-blinds-rumah-pribadi-dr.-elok-1.webp"
                                        style={{
                                            borderRadius: '12px',
                                            border: '1px solid oklch(0.88 0.02 80)',
                                            aspectRatio: '1 / 1',
                                            ...lazyBackground("url('/assets/img-zebra-blinds-rumah-pribadi-dr.-elok-1.webp')"),
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            cursor: 'zoom-in',
                                        }}
                                    ></div>
                                    <p
                                        style={{
                                            margin: '8px 0 0',
                                            fontSize: '15px',
                                            fontWeight: '700',
                                            color: 'oklch(0.28 0.02 60)',
                                        }}
                                    >
                                        Zebra Blinds
                                    </p>
                                    <p
                                        style={{
                                            margin: '1px 0 0',
                                            fontSize: '14px',
                                            color: 'oklch(0.48 0.02 60)',
                                        }}
                                    >
                                        Rumah pribadi dr. Elok
                                    </p>
                                </div>

                                <div>
                                    <div
                                        data-zoom="/assets/img-gorden-custom-box-rumah-pribadi-sukoharj.webp"
                                        style={{
                                            borderRadius: '12px',
                                            border: '1px solid oklch(0.88 0.02 80)',
                                            aspectRatio: '1 / 1',
                                            ...lazyBackground("url('/assets/img-gorden-custom-box-rumah-pribadi-sukoharj.webp')"),
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            cursor: 'zoom-in',
                                        }}
                                    ></div>
                                    <p
                                        style={{
                                            margin: '8px 0 0',
                                            fontSize: '15px',
                                            fontWeight: '700',
                                            color: 'oklch(0.28 0.02 60)',
                                        }}
                                    >
                                        Gorden Custom Box
                                    </p>
                                    <p
                                        style={{
                                            margin: '1px 0 0',
                                            fontSize: '14px',
                                            color: 'oklch(0.48 0.02 60)',
                                        }}
                                    >
                                        Rumah pribadi, Sukoharjo
                                    </p>
                                </div>

                                <div>
                                    <div
                                        data-zoom="/assets/img-gorden-jendela-siku-rumah-pribadi-perum-.webp"
                                        style={{
                                            borderRadius: '12px',
                                            border: '1px solid oklch(0.88 0.02 80)',
                                            aspectRatio: '1 / 1',
                                            ...lazyBackground("url('/assets/img-gorden-jendela-siku-rumah-pribadi-perum-.webp')"),
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            cursor: 'zoom-in',
                                        }}
                                    ></div>
                                    <p
                                        style={{
                                            margin: '8px 0 0',
                                            fontSize: '15px',
                                            fontWeight: '700',
                                            color: 'oklch(0.28 0.02 60)',
                                        }}
                                    >
                                        Gorden Jendela Siku
                                    </p>
                                    <p
                                        style={{
                                            margin: '1px 0 0',
                                            fontSize: '14px',
                                            color: 'oklch(0.48 0.02 60)',
                                        }}
                                    >
                                        Rumah pribadi, Perum Safira Waru
                                    </p>
                                </div>

                                <div>
                                    <div
                                        data-zoom="/assets/img-gorden-kos-putri-ums-.webp"
                                        style={{
                                            borderRadius: '12px',
                                            border: '1px solid oklch(0.88 0.02 80)',
                                            aspectRatio: '1 / 1',
                                            ...lazyBackground("url('/assets/img-gorden-kos-putri-ums-.webp')"),
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            cursor: 'zoom-in',
                                        }}
                                    ></div>
                                    <p
                                        style={{
                                            margin: '8px 0 0',
                                            fontSize: '15px',
                                            fontWeight: '700',
                                            color: 'oklch(0.28 0.02 60)',
                                        }}
                                    >
                                        Gorden Kos Putri
                                    </p>
                                    <p
                                        style={{
                                            margin: '1px 0 0',
                                            fontSize: '14px',
                                            color: 'oklch(0.48 0.02 60)',
                                        }}
                                    >
                                        Kos Putri UMS, Sukoharjo
                                    </p>
                                </div>

                                <div>
                                    <div
                                        data-zoom="/assets/img-gorden-premium-rumah-pribadi-owner-resto.webp"
                                        style={{
                                            borderRadius: '12px',
                                            border: '1px solid oklch(0.88 0.02 80)',
                                            aspectRatio: '1 / 1',
                                            ...lazyBackground("url('/assets/img-gorden-premium-rumah-pribadi-owner-resto.webp')"),
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            cursor: 'zoom-in',
                                        }}
                                    ></div>
                                    <p
                                        style={{
                                            margin: '8px 0 0',
                                            fontSize: '15px',
                                            fontWeight: '700',
                                            color: 'oklch(0.28 0.02 60)',
                                        }}
                                    >
                                        Gorden Premium
                                    </p>
                                    <p
                                        style={{
                                            margin: '1px 0 0',
                                            fontSize: '14px',
                                            color: 'oklch(0.48 0.02 60)',
                                        }}
                                    >
                                        Rumah pribadi owner resto Solo
                                    </p>
                                </div>

                                <div>
                                    <div
                                        data-zoom="/assets/img-gorden-untuk-studio-foto-solo-scaled.webp"
                                        style={{
                                            borderRadius: '12px',
                                            border: '1px solid oklch(0.88 0.02 80)',
                                            aspectRatio: '1 / 1',
                                            ...lazyBackground("url('/assets/img-gorden-untuk-studio-foto-solo-scaled.webp')"),
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            cursor: 'zoom-in',
                                        }}
                                    ></div>
                                    <p
                                        style={{
                                            margin: '8px 0 0',
                                            fontSize: '15px',
                                            fontWeight: '700',
                                            color: 'oklch(0.28 0.02 60)',
                                        }}
                                    >
                                        Gorden Studio Foto
                                    </p>
                                    <p
                                        style={{
                                            margin: '1px 0 0',
                                            fontSize: '14px',
                                            color: 'oklch(0.48 0.02 60)',
                                        }}
                                    >
                                        Studio foto di Solo
                                    </p>
                                </div>

                                <div>
                                    <div
                                        data-zoom="/assets/img-gorden-vertikal-blinds-pt.delta-atsiri-p.webp"
                                        style={{
                                            borderRadius: '12px',
                                            border: '1px solid oklch(0.88 0.02 80)',
                                            aspectRatio: '1 / 1',
                                            ...lazyBackground("url('/assets/img-gorden-vertikal-blinds-pt.delta-atsiri-p.webp')"),
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            cursor: 'zoom-in',
                                        }}
                                    ></div>
                                    <p
                                        style={{
                                            margin: '8px 0 0',
                                            fontSize: '15px',
                                            fontWeight: '700',
                                            color: 'oklch(0.28 0.02 60)',
                                        }}
                                    >
                                        Vertikal Blinds
                                    </p>
                                    <p
                                        style={{
                                            margin: '1px 0 0',
                                            fontSize: '14px',
                                            color: 'oklch(0.48 0.02 60)',
                                        }}
                                    >
                                        PT. Delta Atsiri Prima
                                    </p>
                                </div>

                                <div>
                                    <div
                                        data-zoom="/assets/img-outdoor-blinds-rumah-pribadi-ibu-indah-s.webp"
                                        style={{
                                            borderRadius: '12px',
                                            border: '1px solid oklch(0.88 0.02 80)',
                                            aspectRatio: '1 / 1',
                                            ...lazyBackground("url('/assets/img-outdoor-blinds-rumah-pribadi-ibu-indah-s.webp')"),
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            cursor: 'zoom-in',
                                        }}
                                    ></div>
                                    <p
                                        style={{
                                            margin: '8px 0 0',
                                            fontSize: '15px',
                                            fontWeight: '700',
                                            color: 'oklch(0.28 0.02 60)',
                                        }}
                                    >
                                        Outdoor Blinds
                                    </p>
                                    <p
                                        style={{
                                            margin: '1px 0 0',
                                            fontSize: '14px',
                                            color: 'oklch(0.48 0.02 60)',
                                        }}
                                    >
                                        Rumah pribadi Ibu Indah
                                    </p>
                                </div>

                                <div>
                                    <div
                                        data-zoom="/assets/img-roller-blinds-apartemen-.webp"
                                        style={{
                                            borderRadius: '12px',
                                            border: '1px solid oklch(0.88 0.02 80)',
                                            aspectRatio: '1 / 1',
                                            ...lazyBackground("url('/assets/img-roller-blinds-apartemen-.webp')"),
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            cursor: 'zoom-in',
                                        }}
                                    ></div>
                                    <p
                                        style={{
                                            margin: '8px 0 0',
                                            fontSize: '15px',
                                            fontWeight: '700',
                                            color: 'oklch(0.28 0.02 60)',
                                        }}
                                    >
                                        Roller Blinds
                                    </p>
                                    <p
                                        style={{
                                            margin: '1px 0 0',
                                            fontSize: '14px',
                                            color: 'oklch(0.48 0.02 60)',
                                        }}
                                    >
                                        Apartemen di Solo
                                    </p>
                                </div>

                                <div>
                                    <div
                                        data-zoom="/assets/img-roller-blinds-blackout-kantor-blk-scaled.webp"
                                        style={{
                                            borderRadius: '12px',
                                            border: '1px solid oklch(0.88 0.02 80)',
                                            aspectRatio: '1 / 1',
                                            ...lazyBackground("url('/assets/img-roller-blinds-blackout-kantor-blk-scaled.webp')"),
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            cursor: 'zoom-in',
                                        }}
                                    ></div>
                                    <p
                                        style={{
                                            margin: '8px 0 0',
                                            fontSize: '15px',
                                            fontWeight: '700',
                                            color: 'oklch(0.28 0.02 60)',
                                        }}
                                    >
                                        Roller Blinds Blackout
                                    </p>
                                    <p
                                        style={{
                                            margin: '1px 0 0',
                                            fontSize: '14px',
                                            color: 'oklch(0.48 0.02 60)',
                                        }}
                                    >
                                        Kantor BLK
                                    </p>
                                </div>

                                <div>
                                    <div
                                        data-zoom="/assets/img-roller-blinds-pt-rainbow-asia-surabaya.webp"
                                        style={{
                                            borderRadius: '12px',
                                            border: '1px solid oklch(0.88 0.02 80)',
                                            aspectRatio: '1 / 1',
                                            ...lazyBackground("url('/assets/img-roller-blinds-pt-rainbow-asia-surabaya.webp')"),
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            cursor: 'zoom-in',
                                        }}
                                    ></div>
                                    <p
                                        style={{
                                            margin: '8px 0 0',
                                            fontSize: '15px',
                                            fontWeight: '700',
                                            color: 'oklch(0.28 0.02 60)',
                                        }}
                                    >
                                        Roller Blinds
                                    </p>
                                    <p
                                        style={{
                                            margin: '1px 0 0',
                                            fontSize: '14px',
                                            color: 'oklch(0.48 0.02 60)',
                                        }}
                                    >
                                        PT Rainbow Asia, Surabaya
                                    </p>
                                </div>

                                <div>
                                    <div
                                        data-zoom="/assets/img-roller-blinds-untuk-kafetaria-pabrik-pt..webp"
                                        style={{
                                            borderRadius: '12px',
                                            border: '1px solid oklch(0.88 0.02 80)',
                                            aspectRatio: '1 / 1',
                                            ...lazyBackground("url('/assets/img-roller-blinds-untuk-kafetaria-pabrik-pt..webp')"),
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            cursor: 'zoom-in',
                                        }}
                                    ></div>
                                    <p
                                        style={{
                                            margin: '8px 0 0',
                                            fontSize: '15px',
                                            fontWeight: '700',
                                            color: 'oklch(0.28 0.02 60)',
                                        }}
                                    >
                                        Roller Blinds
                                    </p>
                                    <p
                                        style={{
                                            margin: '1px 0 0',
                                            fontSize: '14px',
                                            color: 'oklch(0.48 0.02 60)',
                                        }}
                                    >
                                        Kafetaria pabrik PT. Herba
                                    </p>
                                </div>
                            </div>
                        )}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                margin: '26px 0 0',
                            }}
                        >
                            <span
                                style={{
                                    flex: '1 1 12px',
                                    minWidth: '12px',
                                    height: '1px',
                                    background: 'oklch(0.89 0.02 80)',
                                }}
                            ></span>
                            <button
                                type="button"
                                onClick={() => setShowAllProjects((s) => !s)}
                                style={{
                                    flex: '0 1 auto',
                                    maxWidth: '100%',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    minHeight: '46px',
                                    padding: '12px 18px',
                                    background: '#fdfcfa',
                                    border: '1.5px solid #817661',
                                    color: '#5d5546',
                                    fontFamily: 'Poppins, Helvetica, sans-serif',
                                    fontSize: 'clamp(13px, 3.4vw, 15px)',
                                    fontWeight: '600',
                                    borderRadius: '999px',
                                    cursor: 'pointer',
                                    lineHeight: '1.2',
                                }}
                            >
                                <span>{showAllProjects ? 'Tampilkan lebih sedikit' : 'Lihat 18 project lainnya'}</span>
                                <span
                                    style={{
                                        fontSize: '13px',
                                        lineHeight: '1',
                                    }}
                                >
                                    ▾
                                </span>
                            </button>
                            <span
                                style={{
                                    flex: '1 1 12px',
                                    minWidth: '12px',
                                    height: '1px',
                                    background: 'oklch(0.89 0.02 80)',
                                }}
                            ></span>
                        </div>
                        <p
                            style={{
                                margin: '18px 0 0',
                                padding: '14px 16px',
                                background: '#f6f3ec',
                                borderRadius: '12px',
                                fontSize: '14.5px',
                                lineHeight: '1.55',
                                color: 'oklch(0.38 0.02 60)',
                                textWrap: 'pretty',
                                textAlign: 'center',
                                paddingTop: '0px',
                                paddingBottom: '0px',
                            }}
                        >
                            Masih ada 1.000+ project lainnya. Minta di WA contoh yang mirip ruangan Anda
                            <br />
                        </p>
                        <div style={{ margin: '22px 0 0' }}>
                            <div style={{ display: 'flex' }}>
                                <a
                                    href="https://wa.me/6285860525758?text=Halo%2C%20saya%20habis%20lihat%20portofolionya.%20Saya%20mau%20konsultasi%20lebih%20lanjut."
                                    target="_blank"
                                    rel="noopener"
                                    style={{
                                        flex: '1 1 100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minHeight: '58px',
                                        padding: '15px 22px',
                                        background: '#FF6B35',
                                        color: '#fff',
                                        fontSize: 'clamp(15px, 3.9vw, 17px)',
                                        fontWeight: '700',
                                        textDecoration: 'none',
                                        borderRadius: '12px',
                                    }}
                                >
                                    <img
                                        src="/assets/whatsapp.svg"
                                        alt=""
                                        style={{
                                            flex: 'none',
                                            width: '20px',
                                            height: '20px',
                                            marginRight: '9px',
                                            display: 'block',
                                        }}
                                    />
                                    Konsultasi Gratis →
                                </a>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    alignItems: 'center',
                                    gap: '5px 10px',
                                    margin: '12px 0 0',
                                    fontSize: '12.5px',
                                    color: 'oklch(0.4 0.02 60)',
                                }}
                            >
                                <span
                                    style={{
                                        color: '#E0A93B',
                                        fontSize: '12.5px',
                                        letterSpacing: '1px',
                                    }}
                                >
                                    ★★★★★
                                </span>
                                <strong style={{ color: 'oklch(0.28 0.02 60)' }}>5,0</strong>
                                <span>Google Review</span>
                                <span style={{ color: 'oklch(0.78 0.02 80)' }}>•</span>
                                <span>1.000+ pembeli</span>
                                <span style={{ color: 'oklch(0.78 0.02 80)' }}>•</span>
                                <span>Ada garansi kalau kurang pas</span>
                            </div>
                        </div>
                    </section>

                    <section
                        style={{
                            padding: '44px 0',
                            borderTop: '1px solid oklch(0.9 0.02 80)',
                        }}
                    >
                        <p
                            ref={reviewsSectionRef}
                            style={{
                                margin: '0 0 10px',
                                fontSize: '12px',
                                fontWeight: '700',
                                letterSpacing: '0.14em',
                                textTransform: 'uppercase',
                                color: '#817661',
                            }}
                        >
                            Kata pelanggan
                        </p>
                        <h2
                            style={{
                                margin: '0 0 8px',
                                fontFamily: 'Poppins, Helvetica, sans-serif',
                                fontSize: 'clamp(23px, 5.2vw, 30px)',
                                lineHeight: '1.2',
                                fontWeight: '700',
                                letterSpacing: '-0.02em',
                                textWrap: 'pretty',
                            }}
                        >
                            Yang mereka rasakan setelah gordennya terpasang
                        </h2>
                        <div
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '14px',
                                margin: '0 0 22px',
                                padding: '12px 18px',
                                background: '#fdfcfa',
                                border: '1px solid oklch(0.9 0.02 80)',
                                borderRadius: '14px',
                            }}
                        >
                            <img
                                src="/assets/google-g.svg"
                                alt="Google"
                                style={{
                                    flex: 'none',
                                    width: '26px',
                                    height: '26px',
                                    display: 'block',
                                }}
                            />
                            <span
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '2px',
                                }}
                            >
                                <span
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '7px',
                                    }}
                                >
                                    <span
                                        style={{
                                            color: '#E0A93B',
                                            fontSize: '14px',
                                            letterSpacing: '1px',
                                        }}
                                    >
                                        ★★★★★
                                    </span>
                                    <strong
                                        style={{
                                            fontSize: '15px',
                                            color: 'oklch(0.26 0.02 60)',
                                        }}
                                    >
                                        5,0
                                    </strong>
                                </span>
                                <span
                                    style={{
                                        fontSize: '13px',
                                        color: 'oklch(0.5 0.03 70)',
                                    }}
                                >
                                    100+ ulasan di Google Review
                                </span>
                            </span>
                        </div>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
                                gap: '16px',
                                alignItems: 'stretch',
                            }}
                        >
                            <article
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    background: '#fdfcfa',
                                    border: '1px solid oklch(0.91 0.015 82)',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                }}
                            >
                                <div
                                    style={{
                                        aspectRatio: '4 / 3',
                                        ...lazyBackground("url('/assets/testi-1.webp')"),
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                ></div>
                                <div
                                    style={{
                                        flex: '1',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        padding: '18px 20px 20px',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            margin: '0 0 12px',
                                        }}
                                    >
                                        <img
                                            src="/assets/ava-1.webp"
                                            alt="Notikawati Puput"
                                            style={{
                                                flex: 'none',
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '999px',
                                                objectFit: 'cover',
                                                display: 'block',
                                            }}
                                        />
                                        <span
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '2px',
                                                minWidth: '0',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: '15px',
                                                    fontWeight: '700',
                                                    color: 'oklch(0.26 0.02 60)',
                                                }}
                                            >
                                                Notikawati Puput
                                            </span>
                                            <span
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        color: '#E0A93B',
                                                        fontSize: '12px',
                                                        letterSpacing: '1px',
                                                    }}
                                                >
                                                    ★★★★★
                                                </span>
                                                <span
                                                    style={{
                                                        fontSize: '12px',
                                                        color: 'oklch(0.55 0.03 70)',
                                                    }}
                                                >
                                                    7 bulan lalu
                                                </span>
                                            </span>
                                        </span>
                                        <img
                                            src="/assets/google-g.svg"
                                            alt="Google"
                                            style={{
                                                flex: 'none',
                                                marginLeft: 'auto',
                                                width: '18px',
                                                height: '18px',
                                                display: 'block',
                                            }}
                                        />
                                    </div>
                                    <p
                                        style={{
                                            margin: '0',
                                            fontSize: '15px',
                                            lineHeight: '1.6',
                                            color: 'oklch(0.38 0.02 60)',
                                        }}
                                    >
                                        <b
                                            style={{
                                                fontWeight: '700',
                                                color: 'oklch(0.26 0.02 60)',
                                            }}
                                        >
                                            Sangat puas sekali dengan gorden yang dibuat!
                                        </b>{' '}
                                        Desainnya sangat elegan dengan warna coklat yang hangat dan mewah, benar-benar{' '}
                                        <b
                                            style={{
                                                fontWeight: '700',
                                                color: 'oklch(0.26 0.02 60)',
                                            }}
                                        >
                                            membuat ruangan rumah jadi terlihat lebih cantik dan berkelas
                                        </b>
                                        .{' '}
                                        <b
                                            style={{
                                                fontWeight: '700',
                                                color: 'oklch(0.26 0.02 60)',
                                            }}
                                        >
                                            Kualitas bahan dan jahitannya juga rapi serta premium
                                        </b>
                                        .<br />
                                        <br />
                                        Terima kasih banyak karena{' '}
                                        <b
                                            style={{
                                                fontWeight: '700',
                                                color: 'oklch(0.26 0.02 60)',
                                            }}
                                        >
                                            gorden sudah berhasil terpasang sebelum deadline yang kami tentukan
                                        </b>
                                        . Semua tamu yang datang langsung memuji keindahan gordennya!
                                    </p>
                                </div>
                            </article>
                            <article
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    background: '#fdfcfa',
                                    border: '1px solid oklch(0.91 0.015 82)',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                }}
                            >
                                <div
                                    style={{
                                        aspectRatio: '4 / 3',
                                        ...lazyBackground("url('/assets/testi-2.webp')"),
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                ></div>
                                <div
                                    style={{
                                        flex: '1',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        padding: '18px 20px 20px',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            margin: '0 0 12px',
                                        }}
                                    >
                                        <img
                                            src="/assets/ava-2.webp"
                                            alt="Ing Sun"
                                            style={{
                                                flex: 'none',
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '999px',
                                                objectFit: 'cover',
                                                display: 'block',
                                            }}
                                        />
                                        <span
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '2px',
                                                minWidth: '0',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: '15px',
                                                    fontWeight: '700',
                                                    color: 'oklch(0.26 0.02 60)',
                                                }}
                                            >
                                                Ing Sun
                                            </span>
                                            <span
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        color: '#E0A93B',
                                                        fontSize: '12px',
                                                        letterSpacing: '1px',
                                                    }}
                                                >
                                                    ★★★★★
                                                </span>
                                                <span
                                                    style={{
                                                        fontSize: '12px',
                                                        color: 'oklch(0.55 0.03 70)',
                                                    }}
                                                >
                                                    3 bulan lalu
                                                </span>
                                            </span>
                                        </span>
                                        <img
                                            src="/assets/google-g.svg"
                                            alt="Google"
                                            style={{
                                                flex: 'none',
                                                marginLeft: 'auto',
                                                width: '18px',
                                                height: '18px',
                                                display: 'block',
                                            }}
                                        />
                                    </div>
                                    <p
                                        style={{
                                            margin: '0',
                                            fontSize: '15px',
                                            lineHeight: '1.6',
                                            color: 'oklch(0.38 0.02 60)',
                                        }}
                                    >
                                        Produk bagus,{' '}
                                        <b
                                            style={{
                                                fontWeight: '700',
                                                color: 'oklch(0.26 0.02 60)',
                                            }}
                                        >
                                            harga sesuai dengan kualitas yang diberikan
                                        </b>
                                        . Bisa custom dan orderan selesai dan{' '}
                                        <b
                                            style={{
                                                fontWeight: '700',
                                                color: 'oklch(0.26 0.02 60)',
                                            }}
                                        >
                                            di pasang lebih cepat dari yang di janjikan
                                        </b>
                                        . Sangat recomended untuk order lagi.
                                    </p>
                                </div>
                            </article>
                            <article
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    background: '#fdfcfa',
                                    border: '1px solid oklch(0.91 0.015 82)',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                }}
                            >
                                <div
                                    style={{
                                        aspectRatio: '4 / 3',
                                        ...lazyBackground("url('/assets/testi-3.webp')"),
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                ></div>
                                <div
                                    style={{
                                        flex: '1',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        padding: '18px 20px 20px',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            margin: '0 0 12px',
                                        }}
                                    >
                                        <img
                                            src="/assets/ava-3.webp"
                                            alt="Chusnul Khotimah"
                                            style={{
                                                flex: 'none',
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '999px',
                                                objectFit: 'cover',
                                                display: 'block',
                                            }}
                                        />
                                        <span
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '2px',
                                                minWidth: '0',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: '15px',
                                                    fontWeight: '700',
                                                    color: 'oklch(0.26 0.02 60)',
                                                }}
                                            >
                                                Chusnul Khotimah
                                            </span>
                                            <span
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        color: '#E0A93B',
                                                        fontSize: '12px',
                                                        letterSpacing: '1px',
                                                    }}
                                                >
                                                    ★★★★★
                                                </span>
                                                <span
                                                    style={{
                                                        fontSize: '12px',
                                                        color: 'oklch(0.55 0.03 70)',
                                                    }}
                                                >
                                                    1 minggu lalu
                                                </span>
                                            </span>
                                        </span>
                                        <img
                                            src="/assets/google-g.svg"
                                            alt="Google"
                                            style={{
                                                flex: 'none',
                                                marginLeft: 'auto',
                                                width: '18px',
                                                height: '18px',
                                                display: 'block',
                                            }}
                                        />
                                    </div>
                                    <p
                                        style={{
                                            margin: '0',
                                            fontSize: '15px',
                                            lineHeight: '1.6',
                                            color: 'oklch(0.38 0.02 60)',
                                        }}
                                    >
                                        Alhamdulillah, akhirnya gorden pesanan datang dan terpasang.{' '}
                                        <b
                                            style={{
                                                fontWeight: '700',
                                                color: 'oklch(0.26 0.02 60)',
                                            }}
                                        >
                                            Rumah jadi terasa baru dan makin betah di rumah!
                                        </b>{' '}
                                        Senang banget lihat{' '}
                                        <b
                                            style={{
                                                fontWeight: '700',
                                                color: 'oklch(0.26 0.02 60)',
                                            }}
                                        >
                                            gordennya pas dan warnanya cocok dengan ruangan
                                        </b>
                                        .{' '}
                                        <b
                                            style={{
                                                fontWeight: '700',
                                                color: 'oklch(0.26 0.02 60)',
                                            }}
                                        >
                                            Hasilnya rapi banget!
                                        </b>{' '}
                                        Hati jadi adem lihat jendela rumah sudah cantik berbalut zebra blindnya.{' '}
                                        <b
                                            style={{
                                                fontWeight: '700',
                                                color: 'oklch(0.26 0.02 60)',
                                            }}
                                        >
                                            Gak salah pilih jauh jauh dari Semarang pesannya di Solo
                                        </b>
                                        .{' '}
                                        <b
                                            style={{
                                                fontWeight: '700',
                                                color: 'oklch(0.26 0.02 60)',
                                            }}
                                        >
                                            Ramah lagi owner dan pekerjanya
                                        </b>
                                        . Terimakasih.
                                    </p>
                                </div>
                            </article>
                        </div>

                        <div
                            style={{
                                margin: '20px 0 0',
                                padding: '18px 0 0',
                                borderTop: '1px solid oklch(0.92 0.015 82)',
                            }}
                        >
                            <p
                                style={{
                                    margin: '0 0 14px',
                                    fontSize: '14px',
                                    color: 'oklch(0.45 0.02 60)',
                                }}
                            >
                                Cuplikan ulasan lain langsung dari Google:
                            </p>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 'clamp(6px, 2vw, 14px)',
                                }}
                            >
                                <button
                                    onClick={() => stepReview(-1)}
                                    aria-label="Ulasan sebelumnya"
                                    style={{
                                        flex: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '38px',
                                        width: '38px',
                                        borderRadius: '999px',
                                        border: '1px solid oklch(0.9 0.02 80)',
                                        background: '#fff',
                                        boxShadow: '0 6px 16px rgba(58,53,44,0.16)',
                                        color: '#3a352c',
                                        fontSize: '18px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    ‹
                                </button>
                                <div
                                    onClick={() => stepReview(-1)}
                                    style={{
                                        flex: 'none',
                                        width: narrow ? '40px' : '110px',
                                        height: narrow ? '170px' : '230px',
                                        borderRadius: '12px',
                                        border: '1px solid oklch(0.91 0.015 82)',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        opacity: '0.7',
                                        backgroundColor: '#fdfcfa',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'left top',
                                        ...lazyBackground(`url(${reviewPrev})`),
                                    }}
                                ></div>
                                <div
                                    style={{
                                        flex: '1 1 auto',
                                        minWidth: '0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <img
                                        src={reviewShots[reviewIdx]}
                                        alt="Ulasan pelanggan di Google"
                                        width="556"
                                        height="204"
                                        loading="lazy"
                                        decoding="async"
                                        onClick={zoomCurrentReview}
                                        style={{
                                            cursor: 'zoom-in',
                                            display: 'block',
                                            height: 'auto',
                                            width: 'auto',
                                            maxHeight: narrow ? '260px' : '330px',
                                            maxWidth: '100%',
                                            borderRadius: '14px',
                                            border: '1px solid oklch(0.92 0.015 82)',
                                            background: '#fff',
                                            boxShadow: '0 20px 38px -22px rgba(58,53,44,0.95)',
                                        }}
                                    />
                                </div>
                                <div
                                    onClick={() => stepReview(1)}
                                    style={{
                                        flex: 'none',
                                        width: narrow ? '40px' : '110px',
                                        height: narrow ? '170px' : '230px',
                                        borderRadius: '12px',
                                        border: '1px solid oklch(0.91 0.015 82)',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        opacity: '0.7',
                                        backgroundColor: '#fdfcfa',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'left top',
                                        ...lazyBackground(`url(${reviewNext})`),
                                    }}
                                ></div>
                                <button
                                    onClick={() => stepReview(1)}
                                    aria-label="Ulasan selanjutnya"
                                    style={{
                                        flex: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '38px',
                                        width: '38px',
                                        borderRadius: '999px',
                                        border: '1px solid oklch(0.9 0.02 80)',
                                        background: '#fff',
                                        boxShadow: '0 6px 16px rgba(58,53,44,0.16)',
                                        color: '#3a352c',
                                        fontSize: '18px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    ›
                                </button>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    margin: '10px 0 0',
                                }}
                            >
                                {reviewShots.map((src, i) => (
                                    <span
                                        key={i}
                                        style={{
                                            width: '7px',
                                            height: '7px',
                                            borderRadius: '999px',
                                            background: i === reviewIdx ? '#817661' : '#d8cfbd',
                                        }}
                                    ></span>
                                ))}
                            </div>
                        </div>
                        <div style={{ margin: '26px 0 0' }}>
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '12px',
                                }}
                            >
                                <a
                                    href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20konsultasi%20gorden.%20Boleh%20dibantu%3F"
                                    target="_blank"
                                    rel="noopener"
                                    style={{
                                        flex: '1 1 260px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minHeight: '56px',
                                        padding: '14px 18px',
                                        background: '#FF6B35',
                                        color: '#fff',
                                        fontSize: 'clamp(15px, 3.9vw, 17px)',
                                        fontWeight: '700',
                                        textDecoration: 'none',
                                        borderRadius: '12px',
                                        backgroundColor: '#FF6B35',
                                    }}
                                >
                                    <img
                                        src="/assets/whatsapp.svg"
                                        alt=""
                                        style={{
                                            flex: 'none',
                                            width: '20px',
                                            height: '20px',
                                            marginRight: '9px',
                                            display: 'block',
                                        }}
                                    />
                                    Konsultasi Gratis →
                                </a>
                                <a
                                    href="#portofolio"
                                    style={{
                                        flex: '1 1 220px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minHeight: '56px',
                                        padding: '14px 18px',
                                        background: 'rgba(253,252,250,0.12)',
                                        border: '2px solid #FF6B35',
                                        color: '#241D17',
                                        fontSize: 'clamp(15px, 3.9vw, 17px)',
                                        fontWeight: '700',
                                        textDecoration: 'none',
                                        borderRadius: '12px',
                                        backdropFilter: 'blur(4px)',
                                    }}
                                >
                                    Lihat Portofolio →
                                </a>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    alignItems: 'center',
                                    gap: '5px 10px',
                                    margin: '12px 0 0',
                                    fontSize: '12.5px',
                                    color: 'oklch(0.4 0.02 60)',
                                }}
                            >
                                <span
                                    style={{
                                        color: '#E0A93B',
                                        fontSize: '12.5px',
                                        letterSpacing: '1px',
                                    }}
                                >
                                    ★★★★★
                                </span>
                                <strong style={{ color: 'oklch(0.28 0.02 60)' }}>5,0</strong>
                                <span>Google Review</span>
                                <span style={{ color: 'oklch(0.78 0.02 80)' }}>•</span>
                                <span>1.000+ pembeli</span>
                                <span style={{ color: 'oklch(0.78 0.02 80)' }}>•</span>
                                <span>Ada garansi kalau kurang pas</span>
                            </div>
                        </div>
                    </section>

                    <div ref={deferredContentSentinelRef} aria-hidden="true" style={{ height: '1px' }} />
                    {renderDeferredContent && (
                        <>
                            <section
                                id="katalog"
                                style={{
                                    padding: '44px 0',
                                    borderTop: '1px solid oklch(0.9 0.02 80)',
                                    scrollMarginTop: '76px',
                                }}
                            >
                                <p
                                    style={{
                                        margin: '0 0 10px',
                                        fontSize: '12px',
                                        fontWeight: '700',
                                        letterSpacing: '0.14em',
                                        textTransform: 'uppercase',
                                        color: '#817661',
                                    }}
                                >
                                    Katalog model
                                </p>
                                <h2
                                    style={{
                                        margin: '0 0 8px',
                                        fontFamily: 'Poppins, Helvetica, sans-serif',
                                        fontSize: 'clamp(23px, 5.2vw, 30px)',
                                        lineHeight: '1.2',
                                        fontWeight: '700',
                                        letterSpacing: '-0.02em',
                                    }}
                                >
                                    Model gorden yang kami kerjakan
                                </h2>
                                <p
                                    style={{
                                        margin: '0 0 24px',
                                        color: 'oklch(0.42 0.02 60)',
                                        maxWidth: '62ch',
                                    }}
                                >
                                    Semua dibuat custom sesuai ukuran jendela Anda. Belum tahu yang cocok? Kami bantu saat survey.
                                </p>
                                <div
                                    id="katalog-filter"
                                    style={{
                                        position: 'sticky',
                                        top: '68px',
                                        zIndex: '20',
                                        margin: '0 0 18px',
                                        padding: '10px 0',
                                        background: '#fdfcfa',
                                        borderBottom: '1px solid oklch(0.92 0.015 82)',
                                    }}
                                >
                                    {narrow && (
                                        <select
                                            onChange={(e) => {
                                                setKatCat(e.target.value);
                                                setTimeout(() => {
                                                    const el = document.getElementById('katalog-filter')?.nextElementSibling;
                                                    if (el)
                                                        window.scrollTo({
                                                            top: el.getBoundingClientRect().top + window.scrollY - 132,
                                                            behavior: 'smooth',
                                                        });
                                                }, 100);
                                            }}
                                            value="{{ katCat }}"
                                            aria-label="Pilih kategori model"
                                            style={{
                                                width: '100%',
                                                minHeight: '48px',
                                                padding: '12px 14px',
                                                borderRadius: '12px',
                                                border: '1.5px solid #d8cfbd',
                                                background: '#fdfcfa',
                                                fontFamily: 'Poppins, Helvetica, sans-serif',
                                                fontSize: '15px',
                                                fontWeight: '600',
                                                color: '#3a352c',
                                            }}
                                        >
                                            <option value="semua">Semua model (13)</option>
                                            <option value="kain">Gorden kain (6)</option>
                                            <option value="blinds">Blinds (5)</option>
                                            <option value="lain">Wallpaper &amp; pelengkap (2)</option>
                                        </select>
                                    )}
                                    {!narrow && (
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexWrap: 'nowrap',
                                                gap: '8px',
                                                overflowX: 'auto',
                                                padding: '2px',
                                                scrollbarWidth: 'none',
                                            }}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => pickCat('semua')}
                                                style={{
                                                    minHeight: '40px',
                                                    padding: '9px 16px',
                                                    borderRadius: '999px',
                                                    border: '1.5px solid #d8cfbd',
                                                    ...tab('semua'),
                                                    fontFamily: 'Poppins, Helvetica, sans-serif',
                                                    fontSize: '14px',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    whiteSpace: 'nowrap',
                                                    flex: 'none',
                                                }}
                                            >
                                                Semua model{' '}
                                                <span
                                                    style={{
                                                        opacity: '0.6',
                                                        fontWeight: '500',
                                                    }}
                                                >
                                                    13
                                                </span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => pickCat('kain')}
                                                style={{
                                                    minHeight: '40px',
                                                    padding: '9px 16px',
                                                    borderRadius: '999px',
                                                    border: '1.5px solid #d8cfbd',
                                                    ...tab('kain'),
                                                    fontFamily: 'Poppins, Helvetica, sans-serif',
                                                    fontSize: '14px',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    whiteSpace: 'nowrap',
                                                    flex: 'none',
                                                }}
                                            >
                                                Gorden kain{' '}
                                                <span
                                                    style={{
                                                        opacity: '0.6',
                                                        fontWeight: '500',
                                                    }}
                                                >
                                                    6
                                                </span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => pickCat('blinds')}
                                                style={{
                                                    minHeight: '40px',
                                                    padding: '9px 16px',
                                                    borderRadius: '999px',
                                                    border: '1.5px solid #d8cfbd',
                                                    ...tab('blinds'),
                                                    fontFamily: 'Poppins, Helvetica, sans-serif',
                                                    fontSize: '14px',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    whiteSpace: 'nowrap',
                                                    flex: 'none',
                                                }}
                                            >
                                                Blinds{' '}
                                                <span
                                                    style={{
                                                        opacity: '0.6',
                                                        fontWeight: '500',
                                                    }}
                                                >
                                                    5
                                                </span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => pickCat('lain')}
                                                style={{
                                                    minHeight: '40px',
                                                    padding: '9px 16px',
                                                    borderRadius: '999px',
                                                    border: '1.5px solid #d8cfbd',
                                                    ...tab('lain'),
                                                    fontFamily: 'Poppins, Helvetica, sans-serif',
                                                    fontSize: '14px',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    whiteSpace: 'nowrap',
                                                    flex: 'none',
                                                }}
                                            >
                                                Wallpaper &amp; pelengkap{' '}
                                                <span
                                                    style={{
                                                        opacity: '0.6',
                                                        fontWeight: '500',
                                                    }}
                                                >
                                                    2
                                                </span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {showKain && (
                                    <div style={{ margin: '0 0 0' }}>
                                        <h3
                                            style={{
                                                margin: '0 0 14px',
                                                fontFamily: 'Poppins, Helvetica, sans-serif',
                                                fontSize: '13px',
                                                fontWeight: '700',
                                                letterSpacing: '0.1em',
                                                textTransform: 'uppercase',
                                                color: '#8f8674',
                                            }}
                                        >
                                            Gorden kain
                                        </h3>
                                        <div
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 255px), 1fr))',
                                                gap: '16px',
                                            }}
                                        >
                                            <article
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    background: '#fdfcfa',
                                                    border: '1px solid oklch(0.91 0.015 82)',
                                                    borderRadius: '16px',
                                                    overflow: 'hidden',
                                                    boxShadow: '0 10px 24px -22px rgba(58,53,44,0.9)',
                                                    transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        position: 'relative',
                                                        aspectRatio: '4 / 3',
                                                        ...lazyBackground("url('/assets/img-gorden-sala3-1152x1536.webp')"),
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            position: 'absolute',
                                                            top: '12px',
                                                            left: '12px',
                                                            padding: '5px 11px',
                                                            background: '#817661',
                                                            color: '#fdfcfa',
                                                            fontSize: '10px',
                                                            fontWeight: '700',
                                                            letterSpacing: '0.1em',
                                                            textTransform: 'uppercase',
                                                            borderRadius: '6px',
                                                        }}
                                                    >
                                                        Best Seller
                                                    </span>
                                                </div>
                                                <div
                                                    style={{
                                                        flex: '1',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        padding: '15px 16px 16px',
                                                    }}
                                                >
                                                    <h3
                                                        style={{
                                                            margin: '0 0 6px',
                                                            fontFamily: 'Poppins, Helvetica, sans-serif',
                                                            fontSize: '17px',
                                                            fontWeight: '600',
                                                            letterSpacing: '-0.01em',
                                                            lineHeight: '1.25',
                                                        }}
                                                    >
                                                        Gorden Minimalis
                                                    </h3>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '7px',
                                                            margin: '0 0 8px',
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                color: '#E0A93B',
                                                                fontSize: '12px',
                                                                letterSpacing: '0.5px',
                                                            }}
                                                        >
                                                            ★★★★★
                                                        </span>
                                                        <span
                                                            style={{
                                                                fontSize: '12px',
                                                                fontWeight: '700',
                                                                color: 'oklch(0.32 0.02 60)',
                                                            }}
                                                        >
                                                            4,9
                                                        </span>
                                                        <span
                                                            style={{
                                                                fontSize: '12px',
                                                                color: 'oklch(0.55 0.03 70)',
                                                            }}
                                                        >
                                                            312 pembeli
                                                        </span>
                                                    </div>
                                                    <p
                                                        style={{
                                                            margin: '0 0 14px',
                                                            fontSize: '14px',
                                                            lineHeight: '1.45',
                                                            color: 'oklch(0.45 0.02 60)',
                                                        }}
                                                    >
                                                        Bersih dan tidak ramai, pas untuk rumah minimalis.
                                                    </p>
                                                    <a
                                                        href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20tanya%20harga%20dan%20spesifikasi%20Gorden%20Minimalis."
                                                        target="_blank"
                                                        rel="noopener"
                                                        style={{
                                                            marginTop: 'auto',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            gap: '7px',
                                                            minHeight: '40px',
                                                            padding: '8px 12px',
                                                            background: '#FF6B35',
                                                            color: '#fff',
                                                            fontSize: '14px',
                                                            fontWeight: '700',
                                                            textDecoration: 'none',
                                                            borderRadius: '9px',
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        <img
                                                            src="/assets/whatsapp.svg"
                                                            alt=""
                                                            style={{
                                                                flex: 'none',
                                                                width: '17px',
                                                                height: '17px',
                                                                display: 'block',
                                                            }}
                                                        />
                                                        <span
                                                            style={{
                                                                whiteSpace: 'nowrap',
                                                            }}
                                                        >
                                                            Tanya harga &amp; spesifikasi
                                                        </span>
                                                    </a>
                                                </div>
                                            </article>
                                            <article
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    background: '#fdfcfa',
                                                    border: '1px solid oklch(0.91 0.015 82)',
                                                    borderRadius: '16px',
                                                    overflow: 'hidden',
                                                    boxShadow: '0 10px 24px -22px rgba(58,53,44,0.9)',
                                                    transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        position: 'relative',
                                                        aspectRatio: '4 / 3',
                                                        ...lazyBackground("url('/assets/img-gorden-custom.webp')"),
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                    }}
                                                ></div>
                                                <div
                                                    style={{
                                                        flex: '1',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        padding: '15px 16px 16px',
                                                    }}
                                                >
                                                    <h3
                                                        style={{
                                                            margin: '0 0 6px',
                                                            fontFamily: 'Poppins, Helvetica, sans-serif',
                                                            fontSize: '17px',
                                                            fontWeight: '600',
                                                            letterSpacing: '-0.01em',
                                                            lineHeight: '1.25',
                                                        }}
                                                    >
                                                        Gorden Custom
                                                    </h3>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '7px',
                                                            margin: '0 0 8px',
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                color: '#E0A93B',
                                                                fontSize: '12px',
                                                                letterSpacing: '0.5px',
                                                            }}
                                                        >
                                                            ★★★★★
                                                        </span>
                                                        <span
                                                            style={{
                                                                fontSize: '12px',
                                                                fontWeight: '700',
                                                                color: 'oklch(0.32 0.02 60)',
                                                            }}
                                                        >
                                                            4,9
                                                        </span>
                                                        <span
                                                            style={{
                                                                fontSize: '12px',
                                                                color: 'oklch(0.55 0.03 70)',
                                                            }}
                                                        >
                                                            158 pembeli
                                                        </span>
                                                    </div>
                                                    <p
                                                        style={{
                                                            margin: '0 0 14px',
                                                            fontSize: '14px',
                                                            lineHeight: '1.45',
                                                            color: 'oklch(0.45 0.02 60)',
                                                        }}
                                                    >
                                                        Model, bahan, dan ukuran menyesuaikan ruangan Anda.
                                                    </p>
                                                    <a
                                                        href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20tanya%20harga%20dan%20spesifikasi%20Gorden%20Custom."
                                                        target="_blank"
                                                        rel="noopener"
                                                        style={{
                                                            marginTop: 'auto',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            gap: '7px',
                                                            minHeight: '40px',
                                                            padding: '8px 12px',
                                                            background: '#FF6B35',
                                                            color: '#fff',
                                                            fontSize: '14px',
                                                            fontWeight: '700',
                                                            textDecoration: 'none',
                                                            borderRadius: '9px',
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        <img
                                                            src="/assets/whatsapp.svg"
                                                            alt=""
                                                            style={{
                                                                flex: 'none',
                                                                width: '17px',
                                                                height: '17px',
                                                                display: 'block',
                                                            }}
                                                        />
                                                        <span
                                                            style={{
                                                                whiteSpace: 'nowrap',
                                                            }}
                                                        >
                                                            Tanya harga &amp; spesifikasi
                                                        </span>
                                                    </a>
                                                </div>
                                            </article>
                                            <article
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    background: '#fdfcfa',
                                                    border: '1px solid oklch(0.91 0.015 82)',
                                                    borderRadius: '16px',
                                                    overflow: 'hidden',
                                                    boxShadow: '0 10px 24px -22px rgba(58,53,44,0.9)',
                                                    transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        position: 'relative',
                                                        aspectRatio: '4 / 3',
                                                        ...lazyBackground("url('/assets/img-gorden-siang-dan-vitrase.webp')"),
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                    }}
                                                ></div>
                                                <div
                                                    style={{
                                                        flex: '1',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        padding: '15px 16px 16px',
                                                    }}
                                                >
                                                    <h3
                                                        style={{
                                                            margin: '0 0 6px',
                                                            fontFamily: 'Poppins, Helvetica, sans-serif',
                                                            fontSize: '17px',
                                                            fontWeight: '600',
                                                            letterSpacing: '-0.01em',
                                                            lineHeight: '1.25',
                                                        }}
                                                    >
                                                        Gorden Siang &amp; Vitrase
                                                    </h3>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '7px',
                                                            margin: '0 0 8px',
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                color: '#E0A93B',
                                                                fontSize: '12px',
                                                                letterSpacing: '0.5px',
                                                            }}
                                                        >
                                                            ★★★★★
                                                        </span>
                                                        <span
                                                            style={{
                                                                fontSize: '12px',
                                                                fontWeight: '700',
                                                                color: 'oklch(0.32 0.02 60)',
                                                            }}
                                                        >
                                                            4,8
                                                        </span>
                                                        <span
                                                            style={{
                                                                fontSize: '12px',
                                                                color: 'oklch(0.55 0.03 70)',
                                                            }}
                                                        >
                                                            132 pembeli
                                                        </span>
                                                    </div>
                                                    <p
                                                        style={{
                                                            margin: '0 0 14px',
                                                            fontSize: '14px',
                                                            lineHeight: '1.45',
                                                            color: 'oklch(0.45 0.02 60)',
                                                        }}
                                                    >
                                                        Tirai tembus pandang, hampir wajib untuk kamar tidur.
                                                    </p>
                                                    <a
                                                        href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20tanya%20harga%20dan%20spesifikasi%20Gorden%20Siang%20%26%20Vitrase."
                                                        target="_blank"
                                                        rel="noopener"
                                                        style={{
                                                            marginTop: 'auto',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            gap: '7px',
                                                            minHeight: '40px',
                                                            padding: '8px 12px',
                                                            background: '#FF6B35',
                                                            color: '#fff',
                                                            fontSize: '14px',
                                                            fontWeight: '700',
                                                            textDecoration: 'none',
                                                            borderRadius: '9px',
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        <img
                                                            src="/assets/whatsapp.svg"
                                                            alt=""
                                                            style={{
                                                                flex: 'none',
                                                                width: '17px',
                                                                height: '17px',
                                                                display: 'block',
                                                            }}
                                                        />
                                                        <span
                                                            style={{
                                                                whiteSpace: 'nowrap',
                                                            }}
                                                        >
                                                            Tanya harga &amp; spesifikasi
                                                        </span>
                                                    </a>
                                                </div>
                                            </article>
                                        </div>
                                        {showKainRest && (
                                            <div
                                                style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 255px), 1fr))',
                                                    gap: '16px',
                                                }}
                                            >
                                                <article
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        background: '#fdfcfa',
                                                        border: '1px solid oklch(0.91 0.015 82)',
                                                        borderRadius: '16px',
                                                        overflow: 'hidden',
                                                        boxShadow: '0 10px 24px -22px rgba(58,53,44,0.9)',
                                                        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            position: 'relative',
                                                            aspectRatio: '4 / 3',
                                                            ...lazyBackground("url('/assets/img-gorden-kupu-1.webp')"),
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center',
                                                        }}
                                                    ></div>
                                                    <div
                                                        style={{
                                                            flex: '1',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            padding: '15px 16px 16px',
                                                        }}
                                                    >
                                                        <h3
                                                            style={{
                                                                margin: '0 0 6px',
                                                                fontFamily: 'Poppins, Helvetica, sans-serif',
                                                                fontSize: '17px',
                                                                fontWeight: '600',
                                                                letterSpacing: '-0.01em',
                                                                lineHeight: '1.25',
                                                            }}
                                                        >
                                                            Gorden Kupu-Kupu
                                                        </h3>
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '7px',
                                                                margin: '0 0 8px',
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    color: '#E0A93B',
                                                                    fontSize: '12px',
                                                                    letterSpacing: '0.5px',
                                                                }}
                                                            >
                                                                ★★★★★
                                                            </span>
                                                            <span
                                                                style={{
                                                                    fontSize: '12px',
                                                                    fontWeight: '700',
                                                                    color: 'oklch(0.32 0.02 60)',
                                                                }}
                                                            >
                                                                4,7
                                                            </span>
                                                            <span
                                                                style={{
                                                                    fontSize: '12px',
                                                                    color: 'oklch(0.55 0.03 70)',
                                                                }}
                                                            >
                                                                74 pembeli
                                                            </span>
                                                        </div>
                                                        <p
                                                            style={{
                                                                margin: '0 0 14px',
                                                                fontSize: '14px',
                                                                lineHeight: '1.45',
                                                                color: 'oklch(0.45 0.02 60)',
                                                            }}
                                                        >
                                                            Gorden pita nempel jendela, simpel untuk rumah minimalis.
                                                        </p>
                                                        <a
                                                            href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20tanya%20harga%20dan%20spesifikasi%20Gorden%20Kupu-Kupu."
                                                            target="_blank"
                                                            rel="noopener"
                                                            style={{
                                                                marginTop: 'auto',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                gap: '7px',
                                                                minHeight: '40px',
                                                                padding: '8px 12px',
                                                                background: '#FF6B35',
                                                                color: '#fff',
                                                                fontSize: '14px',
                                                                fontWeight: '700',
                                                                textDecoration: 'none',
                                                                borderRadius: '9px',
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            <img
                                                                src="/assets/whatsapp.svg"
                                                                alt=""
                                                                style={{
                                                                    flex: 'none',
                                                                    width: '17px',
                                                                    height: '17px',
                                                                    display: 'block',
                                                                }}
                                                            />
                                                            <span
                                                                style={{
                                                                    whiteSpace: 'nowrap',
                                                                }}
                                                            >
                                                                Tanya harga &amp; spesifikasi
                                                            </span>
                                                        </a>
                                                    </div>
                                                </article>
                                                <article
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        background: '#fdfcfa',
                                                        border: '1px solid oklch(0.91 0.015 82)',
                                                        borderRadius: '16px',
                                                        overflow: 'hidden',
                                                        boxShadow: '0 10px 24px -22px rgba(58,53,44,0.9)',
                                                        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            position: 'relative',
                                                            aspectRatio: '4 / 3',
                                                            ...lazyBackground("url('/assets/img-gorden-hotel-apartemen.webp')"),
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center',
                                                        }}
                                                    ></div>
                                                    <div
                                                        style={{
                                                            flex: '1',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            padding: '15px 16px 16px',
                                                        }}
                                                    >
                                                        <h3
                                                            style={{
                                                                margin: '0 0 6px',
                                                                fontFamily: 'Poppins, Helvetica, sans-serif',
                                                                fontSize: '17px',
                                                                fontWeight: '600',
                                                                letterSpacing: '-0.01em',
                                                                lineHeight: '1.25',
                                                            }}
                                                        >
                                                            Gorden Hotel &amp; Apartemen
                                                        </h3>
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '7px',
                                                                margin: '0 0 8px',
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    color: '#E0A93B',
                                                                    fontSize: '12px',
                                                                    letterSpacing: '0.5px',
                                                                }}
                                                            >
                                                                ★★★★★
                                                            </span>
                                                            <span
                                                                style={{
                                                                    fontSize: '12px',
                                                                    fontWeight: '700',
                                                                    color: 'oklch(0.32 0.02 60)',
                                                                }}
                                                            >
                                                                4,9
                                                            </span>
                                                            <span
                                                                style={{
                                                                    fontSize: '12px',
                                                                    color: 'oklch(0.55 0.03 70)',
                                                                }}
                                                            >
                                                                96 pembeli
                                                            </span>
                                                        </div>
                                                        <p
                                                            style={{
                                                                margin: '0 0 14px',
                                                                fontSize: '14px',
                                                                lineHeight: '1.45',
                                                                color: 'oklch(0.45 0.02 60)',
                                                            }}
                                                        >
                                                            Bahan dan model kelas hotel untuk unit sewa.
                                                        </p>
                                                        <a
                                                            href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20tanya%20harga%20dan%20spesifikasi%20Gorden%20Hotel%20%26%20Apartemen."
                                                            target="_blank"
                                                            rel="noopener"
                                                            style={{
                                                                marginTop: 'auto',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                gap: '7px',
                                                                minHeight: '40px',
                                                                padding: '8px 12px',
                                                                background: '#FF6B35',
                                                                color: '#fff',
                                                                fontSize: '14px',
                                                                fontWeight: '700',
                                                                textDecoration: 'none',
                                                                borderRadius: '9px',
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            <img
                                                                src="/assets/whatsapp.svg"
                                                                alt=""
                                                                style={{
                                                                    flex: 'none',
                                                                    width: '17px',
                                                                    height: '17px',
                                                                    display: 'block',
                                                                }}
                                                            />
                                                            <span
                                                                style={{
                                                                    whiteSpace: 'nowrap',
                                                                }}
                                                            >
                                                                Tanya harga &amp; spesifikasi
                                                            </span>
                                                        </a>
                                                    </div>
                                                </article>
                                                <article
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        background: '#fdfcfa',
                                                        border: '1px solid oklch(0.91 0.015 82)',
                                                        borderRadius: '16px',
                                                        overflow: 'hidden',
                                                        boxShadow: '0 10px 24px -22px rgba(58,53,44,0.9)',
                                                        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            position: 'relative',
                                                            aspectRatio: '4 / 3',
                                                            ...lazyBackground("url('/assets/img-gorden-rumah-sakit-rso-orthopedi-surakar.webp')"),
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center',
                                                        }}
                                                    ></div>
                                                    <div
                                                        style={{
                                                            flex: '1',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            padding: '15px 16px 16px',
                                                        }}
                                                    >
                                                        <h3
                                                            style={{
                                                                margin: '0 0 6px',
                                                                fontFamily: 'Poppins, Helvetica, sans-serif',
                                                                fontSize: '17px',
                                                                fontWeight: '600',
                                                                letterSpacing: '-0.01em',
                                                                lineHeight: '1.25',
                                                            }}
                                                        >
                                                            Tirai Area Publik
                                                        </h3>
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '7px',
                                                                margin: '0 0 8px',
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    color: '#E0A93B',
                                                                    fontSize: '12px',
                                                                    letterSpacing: '0.5px',
                                                                }}
                                                            >
                                                                ★★★★★
                                                            </span>
                                                            <span
                                                                style={{
                                                                    fontSize: '12px',
                                                                    fontWeight: '700',
                                                                    color: 'oklch(0.32 0.02 60)',
                                                                }}
                                                            >
                                                                4,9
                                                            </span>
                                                            <span
                                                                style={{
                                                                    fontSize: '12px',
                                                                    color: 'oklch(0.55 0.03 70)',
                                                                }}
                                                            >
                                                                54 pembeli
                                                            </span>
                                                        </div>
                                                        <p
                                                            style={{
                                                                margin: '0 0 14px',
                                                                fontSize: '14px',
                                                                lineHeight: '1.45',
                                                                color: 'oklch(0.45 0.02 60)',
                                                            }}
                                                        >
                                                            Untuk rumah sakit, sekolah, dan ruang publik.
                                                        </p>
                                                        <a
                                                            href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20tanya%20harga%20dan%20spesifikasi%20Tirai%20Area%20Publik."
                                                            target="_blank"
                                                            rel="noopener"
                                                            style={{
                                                                marginTop: 'auto',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                gap: '7px',
                                                                minHeight: '40px',
                                                                padding: '8px 12px',
                                                                background: '#FF6B35',
                                                                color: '#fff',
                                                                fontSize: '14px',
                                                                fontWeight: '700',
                                                                textDecoration: 'none',
                                                                borderRadius: '9px',
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            <img
                                                                src="/assets/whatsapp.svg"
                                                                alt=""
                                                                style={{
                                                                    flex: 'none',
                                                                    width: '17px',
                                                                    height: '17px',
                                                                    display: 'block',
                                                                }}
                                                            />
                                                            <span
                                                                style={{
                                                                    whiteSpace: 'nowrap',
                                                                }}
                                                            >
                                                                Tanya harga &amp; spesifikasi
                                                            </span>
                                                        </a>
                                                    </div>
                                                </article>
                                            </div>
                                        )}
                                        {katCat === 'semua' && !expKain && (
                                            <button
                                                type="button"
                                                onClick={() => setExpKain(true)}
                                                style={{
                                                    width: '100%',
                                                    margin: '12px 0 0',
                                                    minHeight: '46px',
                                                    padding: '12px 16px',
                                                    background: '#fdfcfa',
                                                    border: '1.5px solid #d8cfbd',
                                                    borderRadius: '12px',
                                                    fontFamily: 'Poppins, Helvetica, sans-serif',
                                                    fontSize: '14px',
                                                    fontWeight: '600',
                                                    color: '#6f6656',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                Lihat semua Gorden kain (6) →
                                            </button>
                                        )}
                                    </div>
                                )}
                                {showBlinds && (
                                    <div style={{ margin: '30px 0 0' }}>
                                        <h3
                                            style={{
                                                margin: '0 0 14px',
                                                fontFamily: 'Poppins, Helvetica, sans-serif',
                                                fontSize: '13px',
                                                fontWeight: '700',
                                                letterSpacing: '0.1em',
                                                textTransform: 'uppercase',
                                                color: '#8f8674',
                                            }}
                                        >
                                            Blinds
                                        </h3>
                                        <div
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 255px), 1fr))',
                                                gap: '16px',
                                            }}
                                        >
                                            <article
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    background: '#fdfcfa',
                                                    border: '1px solid oklch(0.91 0.015 82)',
                                                    borderRadius: '16px',
                                                    overflow: 'hidden',
                                                    boxShadow: '0 10px 24px -22px rgba(58,53,44,0.9)',
                                                    transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        position: 'relative',
                                                        aspectRatio: '4 / 3',
                                                        ...lazyBackground("url('/assets/img-roller-blinds-untuk-kantor-1152x1536.webp')"),
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            position: 'absolute',
                                                            top: '12px',
                                                            left: '12px',
                                                            padding: '5px 11px',
                                                            background: '#817661',
                                                            color: '#fdfcfa',
                                                            fontSize: '10px',
                                                            fontWeight: '700',
                                                            letterSpacing: '0.1em',
                                                            textTransform: 'uppercase',
                                                            borderRadius: '6px',
                                                        }}
                                                    >
                                                        Favorit Kantor
                                                    </span>
                                                </div>
                                                <div
                                                    style={{
                                                        flex: '1',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        padding: '15px 16px 16px',
                                                    }}
                                                >
                                                    <h3
                                                        style={{
                                                            margin: '0 0 6px',
                                                            fontFamily: 'Poppins, Helvetica, sans-serif',
                                                            fontSize: '17px',
                                                            fontWeight: '600',
                                                            letterSpacing: '-0.01em',
                                                            lineHeight: '1.25',
                                                        }}
                                                    >
                                                        Roller Blinds
                                                    </h3>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '7px',
                                                            margin: '0 0 8px',
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                color: '#E0A93B',
                                                                fontSize: '12px',
                                                                letterSpacing: '0.5px',
                                                            }}
                                                        >
                                                            ★★★★★
                                                        </span>
                                                        <span
                                                            style={{
                                                                fontSize: '12px',
                                                                fontWeight: '700',
                                                                color: 'oklch(0.32 0.02 60)',
                                                            }}
                                                        >
                                                            4,8
                                                        </span>
                                                        <span
                                                            style={{
                                                                fontSize: '12px',
                                                                color: 'oklch(0.55 0.03 70)',
                                                            }}
                                                        >
                                                            247 pembeli
                                                        </span>
                                                    </div>
                                                    <p
                                                        style={{
                                                            margin: '0 0 14px',
                                                            fontSize: '14px',
                                                            lineHeight: '1.45',
                                                            color: 'oklch(0.45 0.02 60)',
                                                        }}
                                                    >
                                                        Ditarik naik-turun, hemat tempat, rapi untuk kantor.
                                                    </p>
                                                    <a
                                                        href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20tanya%20harga%20dan%20spesifikasi%20Roller%20Blinds."
                                                        target="_blank"
                                                        rel="noopener"
                                                        style={{
                                                            marginTop: 'auto',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            gap: '7px',
                                                            minHeight: '40px',
                                                            padding: '8px 12px',
                                                            background: '#FF6B35',
                                                            color: '#fff',
                                                            fontSize: '14px',
                                                            fontWeight: '700',
                                                            textDecoration: 'none',
                                                            borderRadius: '9px',
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        <img
                                                            src="/assets/whatsapp.svg"
                                                            alt=""
                                                            style={{
                                                                flex: 'none',
                                                                width: '17px',
                                                                height: '17px',
                                                                display: 'block',
                                                            }}
                                                        />
                                                        <span
                                                            style={{
                                                                whiteSpace: 'nowrap',
                                                            }}
                                                        >
                                                            Tanya harga &amp; spesifikasi
                                                        </span>
                                                    </a>
                                                </div>
                                            </article>
                                            <article
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    background: '#fdfcfa',
                                                    border: '1px solid oklch(0.91 0.015 82)',
                                                    borderRadius: '16px',
                                                    overflow: 'hidden',
                                                    boxShadow: '0 10px 24px -22px rgba(58,53,44,0.9)',
                                                    transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        position: 'relative',
                                                        aspectRatio: '4 / 3',
                                                        ...lazyBackground("url('/assets/img-zebra-blinds.webp')"),
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            position: 'absolute',
                                                            top: '12px',
                                                            left: '12px',
                                                            padding: '5px 11px',
                                                            background: '#817661',
                                                            color: '#fdfcfa',
                                                            fontSize: '10px',
                                                            fontWeight: '700',
                                                            letterSpacing: '0.1em',
                                                            textTransform: 'uppercase',
                                                            borderRadius: '6px',
                                                        }}
                                                    >
                                                        Sedang Naik
                                                    </span>
                                                </div>
                                                <div
                                                    style={{
                                                        flex: '1',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        padding: '15px 16px 16px',
                                                    }}
                                                >
                                                    <h3
                                                        style={{
                                                            margin: '0 0 6px',
                                                            fontFamily: 'Poppins, Helvetica, sans-serif',
                                                            fontSize: '17px',
                                                            fontWeight: '600',
                                                            letterSpacing: '-0.01em',
                                                            lineHeight: '1.25',
                                                        }}
                                                    >
                                                        Zebra Blinds
                                                    </h3>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '7px',
                                                            margin: '0 0 8px',
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                color: '#E0A93B',
                                                                fontSize: '12px',
                                                                letterSpacing: '0.5px',
                                                            }}
                                                        >
                                                            ★★★★★
                                                        </span>
                                                        <span
                                                            style={{
                                                                fontSize: '12px',
                                                                fontWeight: '700',
                                                                color: 'oklch(0.32 0.02 60)',
                                                            }}
                                                        >
                                                            4,9
                                                        </span>
                                                        <span
                                                            style={{
                                                                fontSize: '12px',
                                                                color: 'oklch(0.55 0.03 70)',
                                                            }}
                                                        >
                                                            186 pembeli
                                                        </span>
                                                    </div>
                                                    <p
                                                        style={{
                                                            margin: '0 0 14px',
                                                            fontSize: '14px',
                                                            lineHeight: '1.45',
                                                            color: 'oklch(0.45 0.02 60)',
                                                        }}
                                                    >
                                                        Gorden dan vitrase jadi satu, terang-gelap tinggal digeser.
                                                    </p>
                                                    <a
                                                        href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20tanya%20harga%20dan%20spesifikasi%20Zebra%20Blinds."
                                                        target="_blank"
                                                        rel="noopener"
                                                        style={{
                                                            marginTop: 'auto',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            gap: '7px',
                                                            minHeight: '40px',
                                                            padding: '8px 12px',
                                                            background: '#FF6B35',
                                                            color: '#fff',
                                                            fontSize: '14px',
                                                            fontWeight: '700',
                                                            textDecoration: 'none',
                                                            borderRadius: '9px',
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        <img
                                                            src="/assets/whatsapp.svg"
                                                            alt=""
                                                            style={{
                                                                flex: 'none',
                                                                width: '17px',
                                                                height: '17px',
                                                                display: 'block',
                                                            }}
                                                        />
                                                        <span
                                                            style={{
                                                                whiteSpace: 'nowrap',
                                                            }}
                                                        >
                                                            Tanya harga &amp; spesifikasi
                                                        </span>
                                                    </a>
                                                </div>
                                            </article>
                                            <article
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    background: '#fdfcfa',
                                                    border: '1px solid oklch(0.91 0.015 82)',
                                                    borderRadius: '16px',
                                                    overflow: 'hidden',
                                                    boxShadow: '0 10px 24px -22px rgba(58,53,44,0.9)',
                                                    transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        position: 'relative',
                                                        aspectRatio: '4 / 3',
                                                        ...lazyBackground("url('/assets/img-vertikal-blinds.webp')"),
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                    }}
                                                ></div>
                                                <div
                                                    style={{
                                                        flex: '1',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        padding: '15px 16px 16px',
                                                    }}
                                                >
                                                    <h3
                                                        style={{
                                                            margin: '0 0 6px',
                                                            fontFamily: 'Poppins, Helvetica, sans-serif',
                                                            fontSize: '17px',
                                                            fontWeight: '600',
                                                            letterSpacing: '-0.01em',
                                                            lineHeight: '1.25',
                                                        }}
                                                    >
                                                        Vertikal Blinds
                                                    </h3>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '7px',
                                                            margin: '0 0 8px',
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                color: '#E0A93B',
                                                                fontSize: '12px',
                                                                letterSpacing: '0.5px',
                                                            }}
                                                        >
                                                            ★★★★★
                                                        </span>
                                                        <span
                                                            style={{
                                                                fontSize: '12px',
                                                                fontWeight: '700',
                                                                color: 'oklch(0.32 0.02 60)',
                                                            }}
                                                        >
                                                            4,7
                                                        </span>
                                                        <span
                                                            style={{
                                                                fontSize: '12px',
                                                                color: 'oklch(0.55 0.03 70)',
                                                            }}
                                                        >
                                                            143 pembeli
                                                        </span>
                                                    </div>
                                                    <p
                                                        style={{
                                                            margin: '0 0 14px',
                                                            fontSize: '14px',
                                                            lineHeight: '1.45',
                                                            color: 'oklch(0.45 0.02 60)',
                                                        }}
                                                    >
                                                        Kesan formal, arah cahaya bisa diatur supaya layar tidak silau.
                                                    </p>
                                                    <a
                                                        href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20tanya%20harga%20dan%20spesifikasi%20Vertikal%20Blinds."
                                                        target="_blank"
                                                        rel="noopener"
                                                        style={{
                                                            marginTop: 'auto',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            gap: '7px',
                                                            minHeight: '40px',
                                                            padding: '8px 12px',
                                                            background: '#FF6B35',
                                                            color: '#fff',
                                                            fontSize: '14px',
                                                            fontWeight: '700',
                                                            textDecoration: 'none',
                                                            borderRadius: '9px',
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        <img
                                                            src="/assets/whatsapp.svg"
                                                            alt=""
                                                            style={{
                                                                flex: 'none',
                                                                width: '17px',
                                                                height: '17px',
                                                                display: 'block',
                                                            }}
                                                        />
                                                        <span
                                                            style={{
                                                                whiteSpace: 'nowrap',
                                                            }}
                                                        >
                                                            Tanya harga &amp; spesifikasi
                                                        </span>
                                                    </a>
                                                </div>
                                            </article>
                                        </div>
                                        {showBlindsRest && (
                                            <div
                                                style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 255px), 1fr))',
                                                    gap: '16px',
                                                }}
                                            >
                                                <article
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        background: '#fdfcfa',
                                                        border: '1px solid oklch(0.91 0.015 82)',
                                                        borderRadius: '16px',
                                                        overflow: 'hidden',
                                                        boxShadow: '0 10px 24px -22px rgba(58,53,44,0.9)',
                                                        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            position: 'relative',
                                                            aspectRatio: '4 / 3',
                                                            ...lazyBackground("url('/assets/img-slimline-blinds-gorden-kantor-scaled-e16.webp')"),
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center',
                                                        }}
                                                    ></div>
                                                    <div
                                                        style={{
                                                            flex: '1',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            padding: '15px 16px 16px',
                                                        }}
                                                    >
                                                        <h3
                                                            style={{
                                                                margin: '0 0 6px',
                                                                fontFamily: 'Poppins, Helvetica, sans-serif',
                                                                fontSize: '17px',
                                                                fontWeight: '600',
                                                                letterSpacing: '-0.01em',
                                                                lineHeight: '1.25',
                                                            }}
                                                        >
                                                            Slimline Blinds
                                                        </h3>
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '7px',
                                                                margin: '0 0 8px',
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    color: '#E0A93B',
                                                                    fontSize: '12px',
                                                                    letterSpacing: '0.5px',
                                                                }}
                                                            >
                                                                ★★★★★
                                                            </span>
                                                            <span
                                                                style={{
                                                                    fontSize: '12px',
                                                                    fontWeight: '700',
                                                                    color: 'oklch(0.32 0.02 60)',
                                                                }}
                                                            >
                                                                4,6
                                                            </span>
                                                            <span
                                                                style={{
                                                                    fontSize: '12px',
                                                                    color: 'oklch(0.55 0.03 70)',
                                                                }}
                                                            >
                                                                88 pembeli
                                                            </span>
                                                        </div>
                                                        <p
                                                            style={{
                                                                margin: '0 0 14px',
                                                                fontSize: '14px',
                                                                lineHeight: '1.45',
                                                                color: 'oklch(0.45 0.02 60)',
                                                            }}
                                                        >
                                                            Slat aluminium, ringan dan mudah dibersihkan.
                                                        </p>
                                                        <a
                                                            href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20tanya%20harga%20dan%20spesifikasi%20Slimline%20Blinds."
                                                            target="_blank"
                                                            rel="noopener"
                                                            style={{
                                                                marginTop: 'auto',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                gap: '7px',
                                                                minHeight: '40px',
                                                                padding: '8px 12px',
                                                                background: '#FF6B35',
                                                                color: '#fff',
                                                                fontSize: '14px',
                                                                fontWeight: '700',
                                                                textDecoration: 'none',
                                                                borderRadius: '9px',
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            <img
                                                                src="/assets/whatsapp.svg"
                                                                alt=""
                                                                style={{
                                                                    flex: 'none',
                                                                    width: '17px',
                                                                    height: '17px',
                                                                    display: 'block',
                                                                }}
                                                            />
                                                            <span
                                                                style={{
                                                                    whiteSpace: 'nowrap',
                                                                }}
                                                            >
                                                                Tanya harga &amp; spesifikasi
                                                            </span>
                                                        </a>
                                                    </div>
                                                </article>
                                                <article
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        background: '#fdfcfa',
                                                        border: '1px solid oklch(0.91 0.015 82)',
                                                        borderRadius: '16px',
                                                        overflow: 'hidden',
                                                        boxShadow: '0 10px 24px -22px rgba(58,53,44,0.9)',
                                                        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            position: 'relative',
                                                            aspectRatio: '4 / 3',
                                                            ...lazyBackground("url('/assets/img-outdoor-blinds.webp')"),
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center',
                                                        }}
                                                    ></div>
                                                    <div
                                                        style={{
                                                            flex: '1',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            padding: '15px 16px 16px',
                                                        }}
                                                    >
                                                        <h3
                                                            style={{
                                                                margin: '0 0 6px',
                                                                fontFamily: 'Poppins, Helvetica, sans-serif',
                                                                fontSize: '17px',
                                                                fontWeight: '600',
                                                                letterSpacing: '-0.01em',
                                                                lineHeight: '1.25',
                                                            }}
                                                        >
                                                            Outdoor Blinds
                                                        </h3>
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '7px',
                                                                margin: '0 0 8px',
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    color: '#E0A93B',
                                                                    fontSize: '12px',
                                                                    letterSpacing: '0.5px',
                                                                }}
                                                            >
                                                                ★★★★★
                                                            </span>
                                                            <span
                                                                style={{
                                                                    fontSize: '12px',
                                                                    fontWeight: '700',
                                                                    color: 'oklch(0.32 0.02 60)',
                                                                }}
                                                            >
                                                                4,8
                                                            </span>
                                                            <span
                                                                style={{
                                                                    fontSize: '12px',
                                                                    color: 'oklch(0.55 0.03 70)',
                                                                }}
                                                            >
                                                                61 pembeli
                                                            </span>
                                                        </div>
                                                        <p
                                                            style={{
                                                                margin: '0 0 14px',
                                                                fontSize: '14px',
                                                                lineHeight: '1.45',
                                                                color: 'oklch(0.45 0.02 60)',
                                                            }}
                                                        >
                                                            Menahan panas dan silau dari luar, tahan angin.
                                                        </p>
                                                        <a
                                                            href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20tanya%20harga%20dan%20spesifikasi%20Outdoor%20Blinds."
                                                            target="_blank"
                                                            rel="noopener"
                                                            style={{
                                                                marginTop: 'auto',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                gap: '7px',
                                                                minHeight: '40px',
                                                                padding: '8px 12px',
                                                                background: '#FF6B35',
                                                                color: '#fff',
                                                                fontSize: '14px',
                                                                fontWeight: '700',
                                                                textDecoration: 'none',
                                                                borderRadius: '9px',
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            <img
                                                                src="/assets/whatsapp.svg"
                                                                alt=""
                                                                style={{
                                                                    flex: 'none',
                                                                    width: '17px',
                                                                    height: '17px',
                                                                    display: 'block',
                                                                }}
                                                            />
                                                            <span
                                                                style={{
                                                                    whiteSpace: 'nowrap',
                                                                }}
                                                            >
                                                                Tanya harga &amp; spesifikasi
                                                            </span>
                                                        </a>
                                                    </div>
                                                </article>
                                            </div>
                                        )}
                                        {katCat === 'semua' && !expBlinds && (
                                            <button
                                                type="button"
                                                onClick={() => setExpBlinds(true)}
                                                style={{
                                                    width: '100%',
                                                    margin: '12px 0 0',
                                                    minHeight: '46px',
                                                    padding: '12px 16px',
                                                    background: '#fdfcfa',
                                                    border: '1.5px solid #d8cfbd',
                                                    borderRadius: '12px',
                                                    fontFamily: 'Poppins, Helvetica, sans-serif',
                                                    fontSize: '14px',
                                                    fontWeight: '600',
                                                    color: '#6f6656',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                Lihat semua Blinds (5) →
                                            </button>
                                        )}
                                    </div>
                                )}
                                {showPelengkap && (
                                    <div style={{ margin: '30px 0 0' }}>
                                        <h3
                                            style={{
                                                margin: '0 0 14px',
                                                fontFamily: 'Poppins, Helvetica, sans-serif',
                                                fontSize: '13px',
                                                fontWeight: '700',
                                                letterSpacing: '0.1em',
                                                textTransform: 'uppercase',
                                                color: '#8f8674',
                                            }}
                                        >
                                            Wallpaper &amp; pelengkap
                                        </h3>
                                        <div
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 255px), 1fr))',
                                                gap: '16px',
                                            }}
                                        >
                                            <article
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    background: '#fdfcfa',
                                                    border: '1px solid oklch(0.91 0.015 82)',
                                                    borderRadius: '16px',
                                                    overflow: 'hidden',
                                                    boxShadow: '0 10px 24px -22px rgba(58,53,44,0.9)',
                                                    transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        position: 'relative',
                                                        aspectRatio: '4 / 3',
                                                        ...lazyBackground("url('/assets/img-wallpaper-custom-motif-peta-dunia.webp')"),
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                    }}
                                                ></div>
                                                <div
                                                    style={{
                                                        flex: '1',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        padding: '15px 16px 16px',
                                                    }}
                                                >
                                                    <h3
                                                        style={{
                                                            margin: '0 0 6px',
                                                            fontFamily: 'Poppins, Helvetica, sans-serif',
                                                            fontSize: '17px',
                                                            fontWeight: '600',
                                                            letterSpacing: '-0.01em',
                                                            lineHeight: '1.25',
                                                        }}
                                                    >
                                                        Wallpaper Custom
                                                    </h3>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '7px',
                                                            margin: '0 0 8px',
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                color: '#E0A93B',
                                                                fontSize: '12px',
                                                                letterSpacing: '0.5px',
                                                            }}
                                                        >
                                                            ★★★★★
                                                        </span>
                                                        <span
                                                            style={{
                                                                fontSize: '12px',
                                                                fontWeight: '700',
                                                                color: 'oklch(0.32 0.02 60)',
                                                            }}
                                                        >
                                                            4,8
                                                        </span>
                                                        <span
                                                            style={{
                                                                fontSize: '12px',
                                                                color: 'oklch(0.55 0.03 70)',
                                                            }}
                                                        >
                                                            118 pembeli
                                                        </span>
                                                    </div>
                                                    <p
                                                        style={{
                                                            margin: '0 0 14px',
                                                            fontSize: '14px',
                                                            lineHeight: '1.45',
                                                            color: 'oklch(0.45 0.02 60)',
                                                        }}
                                                    >
                                                        Satu dinding saja bisa mengubah karakter ruangan.
                                                    </p>
                                                    <a
                                                        href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20tanya%20harga%20dan%20spesifikasi%20Wallpaper%20Custom."
                                                        target="_blank"
                                                        rel="noopener"
                                                        style={{
                                                            marginTop: 'auto',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            gap: '7px',
                                                            minHeight: '40px',
                                                            padding: '8px 12px',
                                                            background: '#FF6B35',
                                                            color: '#fff',
                                                            fontSize: '14px',
                                                            fontWeight: '700',
                                                            textDecoration: 'none',
                                                            borderRadius: '9px',
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        <img
                                                            src="/assets/whatsapp.svg"
                                                            alt=""
                                                            style={{
                                                                flex: 'none',
                                                                width: '17px',
                                                                height: '17px',
                                                                display: 'block',
                                                            }}
                                                        />
                                                        <span
                                                            style={{
                                                                whiteSpace: 'nowrap',
                                                            }}
                                                        >
                                                            Tanya harga &amp; spesifikasi
                                                        </span>
                                                    </a>
                                                </div>
                                            </article>
                                            <article
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    background: '#fdfcfa',
                                                    border: '1px solid oklch(0.91 0.015 82)',
                                                    borderRadius: '16px',
                                                    overflow: 'hidden',
                                                    boxShadow: '0 10px 24px -22px rgba(58,53,44,0.9)',
                                                    transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        position: 'relative',
                                                        aspectRatio: '4 / 3',
                                                        ...lazyBackground("url('/assets/img-kasa-nyamuk-magnetik-1536x1012.webp')"),
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                    }}
                                                ></div>
                                                <div
                                                    style={{
                                                        flex: '1',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        padding: '15px 16px 16px',
                                                    }}
                                                >
                                                    <h3
                                                        style={{
                                                            margin: '0 0 6px',
                                                            fontFamily: 'Poppins, Helvetica, sans-serif',
                                                            fontSize: '17px',
                                                            fontWeight: '600',
                                                            letterSpacing: '-0.01em',
                                                            lineHeight: '1.25',
                                                        }}
                                                    >
                                                        Perlengkapan Lainnya
                                                    </h3>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '7px',
                                                            margin: '0 0 8px',
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                color: '#E0A93B',
                                                                fontSize: '12px',
                                                                letterSpacing: '0.5px',
                                                            }}
                                                        >
                                                            ★★★★★
                                                        </span>
                                                        <span
                                                            style={{
                                                                fontSize: '12px',
                                                                fontWeight: '700',
                                                                color: 'oklch(0.32 0.02 60)',
                                                            }}
                                                        >
                                                            4,7
                                                        </span>
                                                        <span
                                                            style={{
                                                                fontSize: '12px',
                                                                color: 'oklch(0.55 0.03 70)',
                                                            }}
                                                        >
                                                            69 pembeli
                                                        </span>
                                                    </div>
                                                    <p
                                                        style={{
                                                            margin: '0 0 14px',
                                                            fontSize: '14px',
                                                            lineHeight: '1.45',
                                                            color: 'oklch(0.45 0.02 60)',
                                                        }}
                                                    >
                                                        Kasa nyamuk, rail rolet, dan perlengkapan gorden lain.
                                                    </p>
                                                    <a
                                                        href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20tanya%20harga%20dan%20spesifikasi%20Perlengkapan%20Lainnya."
                                                        target="_blank"
                                                        rel="noopener"
                                                        style={{
                                                            marginTop: 'auto',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            gap: '7px',
                                                            minHeight: '40px',
                                                            padding: '8px 12px',
                                                            background: '#FF6B35',
                                                            color: '#fff',
                                                            fontSize: '14px',
                                                            fontWeight: '700',
                                                            textDecoration: 'none',
                                                            borderRadius: '9px',
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        <img
                                                            src="/assets/whatsapp.svg"
                                                            alt=""
                                                            style={{
                                                                flex: 'none',
                                                                width: '17px',
                                                                height: '17px',
                                                                display: 'block',
                                                            }}
                                                        />
                                                        <span
                                                            style={{
                                                                whiteSpace: 'nowrap',
                                                            }}
                                                        >
                                                            Tanya harga &amp; spesifikasi
                                                        </span>
                                                    </a>
                                                </div>
                                            </article>
                                        </div>
                                    </div>
                                )}
                                <p
                                    style={{
                                        margin: '26px 0 0',
                                        fontSize: '16px',
                                        color: 'oklch(0.48 0.02 60)',
                                        textAlign: 'center',
                                        fontWeight: '700',
                                    }}
                                >
                                    Belum yakin yang mana? Kirim foto jendela Anda lewat WA, kami bantu pilihkan modelnya.
                                </p>
                                <div style={{ margin: '12px 0 0' }}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '12px',
                                        }}
                                    >
                                        <a
                                            href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20tanya%20model%20gorden%20yang%20cocok%20untuk%20ruangan%20saya."
                                            target="_blank"
                                            rel="noopener"
                                            style={{
                                                flex: '1 1 260px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minHeight: '56px',
                                                padding: '14px 18px',
                                                background: '#FF6B35',
                                                color: '#fff',
                                                fontSize: 'clamp(15px, 3.9vw, 17px)',
                                                fontWeight: '700',
                                                textDecoration: 'none',
                                                borderRadius: '12px',
                                            }}
                                        >
                                            <img
                                                src="/assets/whatsapp.svg"
                                                alt=""
                                                style={{
                                                    flex: 'none',
                                                    width: '20px',
                                                    height: '20px',
                                                    marginRight: '9px',
                                                    display: 'block',
                                                }}
                                            />
                                            Konsultasi Gratis →
                                        </a>
                                        <a
                                            href="#portofolio"
                                            style={{
                                                flex: '1 1 220px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minHeight: '56px',
                                                padding: '14px 18px',
                                                background: 'rgba(253,252,250,0.12)',
                                                border: '2px solid #FF6B35',
                                                color: '#241D17',
                                                fontSize: 'clamp(15px, 3.9vw, 17px)',
                                                fontWeight: '700',
                                                textDecoration: 'none',
                                                borderRadius: '12px',
                                                backdropFilter: 'blur(4px)',
                                            }}
                                        >
                                            Lihat Portofolio →
                                        </a>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            alignItems: 'center',
                                            gap: '5px 10px',
                                            margin: '12px 0 0',
                                            fontSize: '12.5px',
                                            color: 'oklch(0.4 0.02 60)',
                                        }}
                                    >
                                        <span
                                            style={{
                                                color: '#E0A93B',
                                                fontSize: '12.5px',
                                                letterSpacing: '1px',
                                            }}
                                        >
                                            ★★★★★
                                        </span>
                                        <strong style={{ color: 'oklch(0.28 0.02 60)' }}>5,0</strong>
                                        <span>Google Review</span>
                                        <span style={{ color: 'oklch(0.78 0.02 80)' }}>•</span>
                                        <span>1.000+ pembeli</span>
                                        <span style={{ color: 'oklch(0.78 0.02 80)' }}>•</span>
                                        <span>Ada garansi kalau kurang pas</span>
                                    </div>
                                </div>
                            </section>

                            <section
                                id="proses"
                                style={{
                                    padding: '44px 0',
                                    borderTop: '1px solid oklch(0.9 0.02 80)',
                                    scrollMarginTop: '76px',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        alignItems: 'flex-end',
                                        justifyContent: 'space-between',
                                        gap: '10px 24px',
                                        margin: '0 0 24px',
                                    }}
                                >
                                    <div>
                                        <p
                                            style={{
                                                margin: '0 0 10px',
                                                fontSize: '12px',
                                                fontWeight: '700',
                                                letterSpacing: '0.14em',
                                                textTransform: 'uppercase',
                                                color: '#817661',
                                            }}
                                        >
                                            Proses kerja
                                        </p>
                                        <h2
                                            style={{
                                                margin: '0',
                                                fontFamily: 'Poppins, Helvetica, sans-serif',
                                                fontSize: 'clamp(23px, 5.2vw, 30px)',
                                                lineHeight: '1.2',
                                                fontWeight: '700',
                                                letterSpacing: '-0.02em',
                                            }}
                                        >
                                            Empat langkah, Anda tinggal duduk
                                        </h2>
                                    </div>
                                    <p
                                        style={{
                                            margin: '0',
                                            maxWidth: '38ch',
                                            fontSize: '15px',
                                            color: 'oklch(0.45 0.02 60)',
                                        }}
                                    >
                                        Dikerjakan tim kami sendiri, dari chat pertama sampai gorden terpasang rapi.
                                    </p>
                                </div>
                                {!narrow && (
                                    <div
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
                                            gap: '16px',
                                            alignItems: 'stretch',
                                        }}
                                    >
                                        <div
                                            style={{
                                                padding: '24px 22px',
                                                background: '#fdfcfa',
                                                border: '1px solid oklch(0.91 0.015 82)',
                                                borderRadius: '18px',
                                            }}
                                        >
                                            <div style={{ padding: '0' }}>
                                                <div
                                                    style={{
                                                        display: 'grid',
                                                        gridTemplateColumns: '42px 1fr',
                                                        gap: '14px',
                                                        alignItems: 'start',
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            fontFamily: 'Poppins, Helvetica, sans-serif',
                                                            fontSize: '21px',
                                                            fontWeight: '700',
                                                            lineHeight: '1.15',
                                                            letterSpacing: '-0.02em',
                                                            color: '#b3a892',
                                                        }}
                                                    >
                                                        01
                                                    </span>
                                                    <div>
                                                        <h3
                                                            style={{
                                                                margin: '0 0 5px',
                                                                fontFamily: 'Poppins, Helvetica, sans-serif',
                                                                fontSize: 'clamp(17px, 4.2vw, 19px)',
                                                                fontWeight: '600',
                                                                letterSpacing: '-0.01em',
                                                            }}
                                                        >
                                                            Bisa tanya sampai cocok
                                                        </h3>
                                                        <p
                                                            style={{
                                                                margin: '0',
                                                                fontSize: '15px',
                                                                lineHeight: '1.5',
                                                                color: 'oklch(0.45 0.02 60)',
                                                            }}
                                                        >
                                                            Ceritakan ruangan dan kebutuhan Anda lewat WhatsApp, lalu tentukan jadwal survey yang paling cocok.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    padding: '20px 0 0',
                                                    borderTop: '1px solid oklch(0.92 0.015 82)',
                                                    marginTop: '20px',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: 'grid',
                                                        gridTemplateColumns: '42px 1fr',
                                                        gap: '14px',
                                                        alignItems: 'start',
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            fontFamily: 'Poppins, Helvetica, sans-serif',
                                                            fontSize: '21px',
                                                            fontWeight: '700',
                                                            lineHeight: '1.15',
                                                            letterSpacing: '-0.02em',
                                                            color: '#b3a892',
                                                        }}
                                                    >
                                                        02
                                                    </span>
                                                    <div>
                                                        <h3
                                                            style={{
                                                                margin: '0 0 5px',
                                                                fontFamily: 'Poppins, Helvetica, sans-serif',
                                                                fontSize: 'clamp(17px, 4.2vw, 19px)',
                                                                fontWeight: '600',
                                                                letterSpacing: '-0.01em',
                                                            }}
                                                        >
                                                            Aman dari salah ukur
                                                        </h3>
                                                        <p
                                                            style={{
                                                                margin: '0',
                                                                fontSize: '15px',
                                                                lineHeight: '1.5',
                                                                color: 'oklch(0.45 0.02 60)',
                                                            }}
                                                        >
                                                            Tim datang bawa katalog kain, ukur presisi, dan bantu cocokkan warnanya.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    padding: '20px 0 0',
                                                    borderTop: '1px solid oklch(0.92 0.015 82)',
                                                    marginTop: '20px',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: 'grid',
                                                        gridTemplateColumns: '42px 1fr',
                                                        gap: '14px',
                                                        alignItems: 'start',
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            fontFamily: 'Poppins, Helvetica, sans-serif',
                                                            fontSize: '21px',
                                                            fontWeight: '700',
                                                            lineHeight: '1.15',
                                                            letterSpacing: '-0.02em',
                                                            color: '#b3a892',
                                                        }}
                                                    >
                                                        03
                                                    </span>
                                                    <div>
                                                        <h3
                                                            style={{
                                                                margin: '0 0 5px',
                                                                fontFamily: 'Poppins, Helvetica, sans-serif',
                                                                fontSize: 'clamp(17px, 4.2vw, 19px)',
                                                                fontWeight: '600',
                                                                letterSpacing: '-0.01em',
                                                            }}
                                                        >
                                                            Produksi sesuai ukuran
                                                        </h3>
                                                        <p
                                                            style={{
                                                                margin: '0',
                                                                fontSize: '15px',
                                                                lineHeight: '1.5',
                                                                color: 'oklch(0.45 0.02 60)',
                                                            }}
                                                        >
                                                            Dijahit khusus untuk jendela Anda dengan kain blackout impor, lalu difinishing sistem steam uap.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    padding: '20px 0 0',
                                                    borderTop: '1px solid oklch(0.92 0.015 82)',
                                                    marginTop: '20px',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: 'grid',
                                                        gridTemplateColumns: '42px 1fr',
                                                        gap: '14px',
                                                        alignItems: 'start',
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            fontFamily: 'Poppins, Helvetica, sans-serif',
                                                            fontSize: '21px',
                                                            fontWeight: '700',
                                                            lineHeight: '1.15',
                                                            letterSpacing: '-0.02em',
                                                            color: '#b3a892',
                                                        }}
                                                    >
                                                        04
                                                    </span>
                                                    <div>
                                                        <h3
                                                            style={{
                                                                margin: '0 0 5px',
                                                                fontFamily: 'Poppins, Helvetica, sans-serif',
                                                                fontSize: 'clamp(17px, 4.2vw, 19px)',
                                                                fontWeight: '600',
                                                                letterSpacing: '-0.01em',
                                                            }}
                                                        >
                                                            Pasang &amp; cek akhir
                                                        </h3>
                                                        <p
                                                            style={{
                                                                margin: '0',
                                                                fontSize: '15px',
                                                                lineHeight: '1.5',
                                                                color: 'oklch(0.45 0.02 60)',
                                                            }}
                                                        >
                                                            Dipasang sampai rapi, lalu dicek bersama Anda. Kalau ada yang kurang pas, kami rapikan saat itu juga.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <p
                                                style={{
                                                    margin: '22px 0 0',
                                                    padding: '14px 16px',
                                                    background: '#f6f3ec',
                                                    borderRadius: '10px',
                                                    fontSize: '14px',
                                                    lineHeight: '1.45',
                                                    color: 'oklch(0.38 0.02 60)',
                                                }}
                                            >
                                                <strong
                                                    style={{
                                                        color: 'oklch(0.26 0.02 60)',
                                                    }}
                                                >
                                                    Jadwal fleksibel.
                                                </strong>{' '}
                                                Survey dan pemasangan menyesuaikan waktu Anda, termasuk di luar jam kerja.
                                            </p>
                                        </div>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '16px',
                                                minHeight: '420px',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    flex: '1',
                                                    minHeight: '200px',
                                                    position: 'relative',
                                                    display: 'flex',
                                                    alignItems: 'flex-end',
                                                    padding: '14px 16px',
                                                    borderRadius: '14px',
                                                    overflow: 'hidden',
                                                    ...lazyBackground("linear-gradient(to top, rgba(30,25,19,0.8) 0%, rgba(30,25,19,0.26) 42%, rgba(30,25,19,0) 78%), url('/assets/proses-ukur.webp')"),
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                }}
                                            >
                                                <p
                                                    style={{
                                                        margin: '0',
                                                        fontFamily: 'Poppins, Helvetica, sans-serif',
                                                        fontSize: '13px',
                                                        fontWeight: '600',
                                                        lineHeight: '1.35',
                                                        color: '#fdfcfa',
                                                    }}
                                                >
                                                    Survey &amp; ukur di rumah pelanggan
                                                </p>
                                            </div>
                                            <div
                                                style={{
                                                    flex: '1',
                                                    minHeight: '200px',
                                                    position: 'relative',
                                                    display: 'flex',
                                                    alignItems: 'flex-end',
                                                    padding: '14px 16px',
                                                    borderRadius: '14px',
                                                    overflow: 'hidden',
                                                    ...lazyBackground("linear-gradient(to top, rgba(30,25,19,0.8) 0%, rgba(30,25,19,0.26) 42%, rgba(30,25,19,0) 78%), url('/assets/proses-pasang-1280.webp')"),
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                }}
                                            >
                                                <p
                                                    style={{
                                                        margin: '0',
                                                        fontFamily: 'Poppins, Helvetica, sans-serif',
                                                        fontSize: '13px',
                                                        fontWeight: '600',
                                                        lineHeight: '1.35',
                                                        color: '#fdfcfa',
                                                    }}
                                                >
                                                    Dicek bersama sebelum dinyatakan selesai
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {narrow && (
                                    <div
                                        style={{
                                            padding: '22px 18px',
                                            background: '#fdfcfa',
                                            border: '1px solid oklch(0.91 0.015 82)',
                                            borderRadius: '18px',
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'grid',
                                                gap: '14px',
                                                padding: '0',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: '42px 1fr',
                                                    gap: '14px',
                                                    alignItems: 'start',
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontFamily: 'Poppins, Helvetica, sans-serif',
                                                        fontSize: '21px',
                                                        fontWeight: '700',
                                                        lineHeight: '1.15',
                                                        letterSpacing: '-0.02em',
                                                        color: '#b3a892',
                                                    }}
                                                >
                                                    01
                                                </span>
                                                <div>
                                                    <h3
                                                        style={{
                                                            margin: '0 0 5px',
                                                            fontFamily: 'Poppins, Helvetica, sans-serif',
                                                            fontSize: 'clamp(17px, 4.2vw, 19px)',
                                                            fontWeight: '600',
                                                            letterSpacing: '-0.01em',
                                                        }}
                                                    >
                                                        Bisa tanya sampai cocok
                                                    </h3>
                                                    <p
                                                        style={{
                                                            margin: '0',
                                                            fontSize: '15px',
                                                            lineHeight: '1.5',
                                                            color: 'oklch(0.45 0.02 60)',
                                                        }}
                                                    >
                                                        Ceritakan ruangan dan kebutuhan Anda lewat WhatsApp, lalu tentukan jadwal survey yang paling cocok.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                display: 'grid',
                                                gap: '14px',
                                                padding: '20px 0 0',
                                                borderTop: '1px solid oklch(0.92 0.015 82)',
                                                marginTop: '20px',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: '42px 1fr',
                                                    gap: '14px',
                                                    alignItems: 'start',
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontFamily: 'Poppins, Helvetica, sans-serif',
                                                        fontSize: '21px',
                                                        fontWeight: '700',
                                                        lineHeight: '1.15',
                                                        letterSpacing: '-0.02em',
                                                        color: '#b3a892',
                                                    }}
                                                >
                                                    02
                                                </span>
                                                <div>
                                                    <h3
                                                        style={{
                                                            margin: '0 0 5px',
                                                            fontFamily: 'Poppins, Helvetica, sans-serif',
                                                            fontSize: 'clamp(17px, 4.2vw, 19px)',
                                                            fontWeight: '600',
                                                            letterSpacing: '-0.01em',
                                                        }}
                                                    >
                                                        Aman dari salah ukur
                                                    </h3>
                                                    <p
                                                        style={{
                                                            margin: '0',
                                                            fontSize: '15px',
                                                            lineHeight: '1.5',
                                                            color: 'oklch(0.45 0.02 60)',
                                                        }}
                                                    >
                                                        Tim datang bawa katalog kain, ukur presisi, dan bantu cocokkan warnanya.
                                                    </p>
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    aspectRatio: '16 / 10',
                                                    position: 'relative',
                                                    display: 'flex',
                                                    alignItems: 'flex-end',
                                                    padding: '14px 16px',
                                                    borderRadius: '14px',
                                                    overflow: 'hidden',
                                                    ...lazyBackground("linear-gradient(to top, rgba(30,25,19,0.8) 0%, rgba(30,25,19,0.26) 42%, rgba(30,25,19,0) 78%), url('/assets/proses-ukur.webp')"),
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                }}
                                            >
                                                <p
                                                    style={{
                                                        margin: '0',
                                                        fontFamily: 'Poppins, Helvetica, sans-serif',
                                                        fontSize: '13px',
                                                        fontWeight: '600',
                                                        lineHeight: '1.35',
                                                        color: '#fdfcfa',
                                                    }}
                                                >
                                                    Survey &amp; ukur di rumah pelanggan
                                                </p>
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                display: 'grid',
                                                gap: '14px',
                                                padding: '20px 0 0',
                                                borderTop: '1px solid oklch(0.92 0.015 82)',
                                                marginTop: '20px',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: '42px 1fr',
                                                    gap: '14px',
                                                    alignItems: 'start',
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontFamily: 'Poppins, Helvetica, sans-serif',
                                                        fontSize: '21px',
                                                        fontWeight: '700',
                                                        lineHeight: '1.15',
                                                        letterSpacing: '-0.02em',
                                                        color: '#b3a892',
                                                    }}
                                                >
                                                    03
                                                </span>
                                                <div>
                                                    <h3
                                                        style={{
                                                            margin: '0 0 5px',
                                                            fontFamily: 'Poppins, Helvetica, sans-serif',
                                                            fontSize: 'clamp(17px, 4.2vw, 19px)',
                                                            fontWeight: '600',
                                                            letterSpacing: '-0.01em',
                                                        }}
                                                    >
                                                        Produksi sesuai ukuran
                                                    </h3>
                                                    <p
                                                        style={{
                                                            margin: '0',
                                                            fontSize: '15px',
                                                            lineHeight: '1.5',
                                                            color: 'oklch(0.45 0.02 60)',
                                                        }}
                                                    >
                                                        Dijahit khusus untuk jendela Anda dengan kain blackout impor, lalu difinishing sistem steam uap.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                display: 'grid',
                                                gap: '14px',
                                                padding: '20px 0 0',
                                                borderTop: '1px solid oklch(0.92 0.015 82)',
                                                marginTop: '20px',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: '42px 1fr',
                                                    gap: '14px',
                                                    alignItems: 'start',
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontFamily: 'Poppins, Helvetica, sans-serif',
                                                        fontSize: '21px',
                                                        fontWeight: '700',
                                                        lineHeight: '1.15',
                                                        letterSpacing: '-0.02em',
                                                        color: '#b3a892',
                                                    }}
                                                >
                                                    04
                                                </span>
                                                <div>
                                                    <h3
                                                        style={{
                                                            margin: '0 0 5px',
                                                            fontFamily: 'Poppins, Helvetica, sans-serif',
                                                            fontSize: 'clamp(17px, 4.2vw, 19px)',
                                                            fontWeight: '600',
                                                            letterSpacing: '-0.01em',
                                                        }}
                                                    >
                                                        Pasang &amp; cek akhir
                                                    </h3>
                                                    <p
                                                        style={{
                                                            margin: '0',
                                                            fontSize: '15px',
                                                            lineHeight: '1.5',
                                                            color: 'oklch(0.45 0.02 60)',
                                                        }}
                                                    >
                                                        Dipasang sampai rapi, lalu dicek bersama Anda. Kalau ada yang kurang pas, kami rapikan saat itu juga.
                                                    </p>
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    aspectRatio: '16 / 10',
                                                    position: 'relative',
                                                    display: 'flex',
                                                    alignItems: 'flex-end',
                                                    padding: '14px 16px',
                                                    borderRadius: '14px',
                                                    overflow: 'hidden',
                                                    ...lazyBackground("linear-gradient(to top, rgba(30,25,19,0.8) 0%, rgba(30,25,19,0.26) 42%, rgba(30,25,19,0) 78%), url('/assets/proses-pasang-1280.webp')"),
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                }}
                                            >
                                                <p
                                                    style={{
                                                        margin: '0',
                                                        fontFamily: 'Poppins, Helvetica, sans-serif',
                                                        fontSize: '13px',
                                                        fontWeight: '600',
                                                        lineHeight: '1.35',
                                                        color: '#fdfcfa',
                                                    }}
                                                >
                                                    Dicek bersama sebelum dinyatakan selesai
                                                </p>
                                            </div>
                                        </div>
                                        <p
                                            style={{
                                                margin: '22px 0 0',
                                                padding: '14px 16px',
                                                background: '#f6f3ec',
                                                borderRadius: '10px',
                                                fontSize: '14px',
                                                lineHeight: '1.45',
                                                color: 'oklch(0.38 0.02 60)',
                                            }}
                                        >
                                            <strong style={{ color: 'oklch(0.26 0.02 60)' }}>Jadwal fleksibel.</strong> Survey dan pemasangan menyesuaikan waktu Anda, termasuk di luar jam kerja.
                                        </p>
                                    </div>
                                )}
                                <div style={{ margin: '26px 0 0' }}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '12px',
                                        }}
                                    >
                                        <a
                                            href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20konsultasi%20gorden.%20Boleh%20dibantu%3F"
                                            target="_blank"
                                            rel="noopener"
                                            style={{
                                                flex: '1 1 260px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minHeight: '56px',
                                                padding: '14px 18px',
                                                background: '#FF6B35',
                                                color: '#fff',
                                                fontSize: 'clamp(15px, 3.9vw, 17px)',
                                                fontWeight: '700',
                                                textDecoration: 'none',
                                                borderRadius: '12px',
                                            }}
                                        >
                                            <img
                                                src="/assets/whatsapp.svg"
                                                alt=""
                                                style={{
                                                    flex: 'none',
                                                    width: '20px',
                                                    height: '20px',
                                                    marginRight: '9px',
                                                    display: 'block',
                                                }}
                                            />
                                            Konsultasi Gratis →
                                        </a>
                                        <a
                                            href="#portofolio"
                                            style={{
                                                flex: '1 1 220px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minHeight: '56px',
                                                padding: '14px 18px',
                                                background: '#fdfcfa',
                                                border: '2px solid #FF6B35',
                                                color: '#C24E1E',
                                                fontSize: 'clamp(15px, 3.9vw, 17px)',
                                                fontWeight: '700',
                                                textDecoration: 'none',
                                                borderRadius: '12px',
                                            }}
                                        >
                                            Lihat Portofolio →
                                        </a>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            alignItems: 'center',
                                            gap: '5px 10px',
                                            margin: '12px 0 0',
                                            fontSize: '12.5px',
                                            color: 'oklch(0.4 0.02 60)',
                                        }}
                                    >
                                        <span
                                            style={{
                                                color: '#E0A93B',
                                                fontSize: '12.5px',
                                                letterSpacing: '1px',
                                            }}
                                        >
                                            ★★★★★
                                        </span>
                                        <strong style={{ color: 'oklch(0.28 0.02 60)' }}>5,0</strong>
                                        <span>Google Review</span>
                                        <span style={{ color: 'oklch(0.78 0.02 80)' }}>•</span>
                                        <span>1.000+ pembeli</span>
                                        <span style={{ color: 'oklch(0.78 0.02 80)' }}>•</span>
                                        <span>Ada garansi kalau kurang pas</span>
                                    </div>
                                </div>
                            </section>

                            <section
                                style={{
                                    margin: '44px 0',
                                    padding: 'clamp(22px, 5vw, 30px) clamp(16px, 4.5vw, 24px)',
                                    background: '#fdfcfa',
                                    border: '1px solid oklch(0.88 0.02 80)',
                                    borderLeft: '6px solid #817661',
                                    borderRadius: '18px',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
                                        gap: '24px',
                                        alignItems: 'center',
                                    }}
                                >
                                    <div>
                                        <p
                                            style={{
                                                margin: '0 0 10px',
                                                fontSize: '12px',
                                                fontWeight: '700',
                                                letterSpacing: '0.14em',
                                                textTransform: 'uppercase',
                                                color: '#817661',
                                            }}
                                        >
                                            Jaminan
                                        </p>
                                        <h2
                                            style={{
                                                margin: '0 0 8px',
                                                fontFamily: 'Poppins, Helvetica, sans-serif',
                                                fontSize: 'clamp(23px, 5.2vw, 30px)',
                                                lineHeight: '1.2',
                                                fontWeight: '700',
                                                letterSpacing: '-0.02em',
                                                textWrap: 'pretty',
                                            }}
                                        >
                                            Ada garansi kalau kurang pas
                                        </h2>
                                        <p
                                            style={{
                                                margin: '0',
                                                fontSize: '17px',
                                                color: '#4d4636',
                                            }}
                                        >
                                            Ada yang kurang pas dalam 14 hari? Kami perbaiki tanpa biaya tambahan.
                                        </p>
                                    </div>
                                    <div style={{ display: 'grid', gap: '10px' }}>
                                        <span
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                fontSize: '16px',
                                                fontWeight: '600',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    flex: 'none',
                                                    width: '24px',
                                                    height: '24px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: '999px',
                                                    background: '#817661',
                                                    color: '#fdfcfa',
                                                    fontSize: '12px',
                                                }}
                                            >
                                                ✓
                                            </span>{' '}
                                            Perbaikan tanpa biaya tambahan
                                        </span>
                                        <span
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                fontSize: '16px',
                                                fontWeight: '600',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    flex: 'none',
                                                    width: '24px',
                                                    height: '24px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: '999px',
                                                    background: '#817661',
                                                    color: '#fdfcfa',
                                                    fontSize: '12px',
                                                }}
                                            >
                                                ✓
                                            </span>{' '}
                                            Konsultasi &amp; survey gratis
                                        </span>
                                        <span
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                fontSize: '16px',
                                                fontWeight: '600',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    flex: 'none',
                                                    width: '24px',
                                                    height: '24px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: '999px',
                                                    background: '#817661',
                                                    color: '#fdfcfa',
                                                    fontSize: '12px',
                                                }}
                                            >
                                                ✓
                                            </span>{' '}
                                            Harga jujur, tanpa biaya tersembunyi
                                        </span>
                                        <span
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                fontSize: '16px',
                                                fontWeight: '600',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    flex: 'none',
                                                    width: '24px',
                                                    height: '24px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: '999px',
                                                    background: '#817661',
                                                    color: '#fdfcfa',
                                                    fontSize: '12px',
                                                }}
                                            >
                                                ✓
                                            </span>{' '}
                                            Dikerjakan tim sendiri, bukan dilempar vendor
                                        </span>
                                    </div>
                                </div>

                                <div style={{ margin: '26px 0 0' }}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '12px',
                                        }}
                                    >
                                        <a
                                            href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20konsultasi%20gorden.%20Boleh%20dibantu%3F"
                                            target="_blank"
                                            rel="noopener"
                                            style={{
                                                flex: '1 1 260px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minHeight: '56px',
                                                padding: '14px 18px',
                                                background: '#FF6B35',
                                                color: '#fff',
                                                fontSize: 'clamp(15px, 3.9vw, 17px)',
                                                fontWeight: '700',
                                                textDecoration: 'none',
                                                borderRadius: '12px',
                                            }}
                                        >
                                            <img
                                                src="/assets/whatsapp.svg"
                                                alt=""
                                                style={{
                                                    flex: 'none',
                                                    width: '20px',
                                                    height: '20px',
                                                    marginRight: '9px',
                                                    display: 'block',
                                                }}
                                            />
                                            Konsultasi Gratis →
                                        </a>
                                        <a
                                            href="#portofolio"
                                            style={{
                                                flex: '1 1 220px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minHeight: '56px',
                                                padding: '14px 18px',
                                                background: 'rgba(253,252,250,0.12)',
                                                border: '2px solid #FF6B35',
                                                color: '#241D17',
                                                fontSize: 'clamp(15px, 3.9vw, 17px)',
                                                fontWeight: '700',
                                                textDecoration: 'none',
                                                borderRadius: '12px',
                                                backdropFilter: 'blur(4px)',
                                            }}
                                        >
                                            Lihat Portofolio →
                                        </a>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            alignItems: 'center',
                                            gap: '5px 10px',
                                            margin: '12px 0 0',
                                            fontSize: '12.5px',
                                            color: 'oklch(0.4 0.02 60)',
                                        }}
                                    >
                                        <span
                                            style={{
                                                color: '#E0A93B',
                                                fontSize: '12.5px',
                                                letterSpacing: '1px',
                                            }}
                                        >
                                            ★★★★★
                                        </span>
                                        <strong style={{ color: 'oklch(0.28 0.02 60)' }}>5,0</strong>
                                        <span>Google Review</span>
                                        <span style={{ color: 'oklch(0.78 0.02 80)' }}>•</span>
                                        <span>1.000+ pembeli</span>
                                        <span style={{ color: 'oklch(0.78 0.02 80)' }}>•</span>
                                        <span>Ada garansi kalau kurang pas</span>
                                    </div>
                                </div>
                            </section>

                            <section
                                style={{
                                    padding: '44px 0',
                                    borderTop: '1px solid oklch(0.9 0.02 80)',
                                }}
                            >
                                <p
                                    style={{
                                        margin: '0 0 10px',
                                        fontSize: '12px',
                                        fontWeight: '700',
                                        letterSpacing: '0.14em',
                                        textTransform: 'uppercase',
                                        color: '#817661',
                                    }}
                                >
                                    Tanya jawab
                                </p>
                                <h2
                                    style={{
                                        margin: '0 0 8px',
                                        fontFamily: 'Poppins, Helvetica, sans-serif',
                                        fontSize: 'clamp(23px, 5.2vw, 30px)',
                                        lineHeight: '1.2',
                                        fontWeight: '700',
                                        letterSpacing: '-0.02em',
                                    }}
                                >
                                    Pertanyaan yang paling sering masuk
                                </h2>
                                <p
                                    style={{
                                        margin: '0 0 22px',
                                        color: 'oklch(0.42 0.02 60)',
                                        maxWidth: '68ch',
                                    }}
                                >
                                    Klik pertanyaannya untuk melihat jawaban.
                                </p>
                                <div style={{ display: 'grid', gap: '10px' }}>
                                    <details
                                        style={{
                                            background: '#fdfcfa',
                                            border: '1px solid oklch(0.9 0.02 80)',
                                            borderRadius: '14px',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <summary
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '14px',
                                                padding: '16px 16px',
                                                cursor: 'pointer',
                                                listStyle: 'none',
                                                fontSize: '17px',
                                                fontWeight: '600',
                                                color: 'oklch(0.26 0.02 60)',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    flex: 'none',
                                                    width: '30px',
                                                    height: '30px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: '999px',
                                                    background: '#817661',
                                                    color: '#fdfcfa',
                                                    fontSize: '14px',
                                                    fontWeight: '700',
                                                }}
                                            >
                                                1
                                            </span>
                                            <span style={{ flex: '1' }}>Berapa lama proses produksinya?</span>
                                            <span
                                                style={{
                                                    flex: 'none',
                                                    fontSize: '22px',
                                                    lineHeight: '1',
                                                    color: '#817661',
                                                }}
                                            >
                                                +
                                            </span>
                                        </summary>
                                        <div
                                            style={{
                                                padding: '0 18px 18px 18px',
                                                fontSize: '16px',
                                                color: 'oklch(0.4 0.02 60)',
                                            }}
                                        >
                                            Umumnya <strong>7-10 hari kerja setelah survey</strong>, tergantung jumlah jendela dan ketersediaan kain yang Anda pilih. Kalau Anda sedang mengejar tanggal tertentu, sampaikan di awal, nanti kami cek dulu apakah bisa kami kejar.
                                        </div>
                                    </details>

                                    <details
                                        style={{
                                            background: '#fdfcfa',
                                            border: '1px solid oklch(0.9 0.02 80)',
                                            borderRadius: '14px',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <summary
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '14px',
                                                padding: '16px 16px',
                                                cursor: 'pointer',
                                                listStyle: 'none',
                                                fontSize: '17px',
                                                fontWeight: '600',
                                                color: 'oklch(0.26 0.02 60)',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    flex: 'none',
                                                    width: '30px',
                                                    height: '30px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: '999px',
                                                    background: '#817661',
                                                    color: '#fdfcfa',
                                                    fontSize: '14px',
                                                    fontWeight: '700',
                                                }}
                                            >
                                                2
                                            </span>
                                            <span style={{ flex: '1' }}>Apakah ada diskon?</span>
                                            <span
                                                style={{
                                                    flex: 'none',
                                                    fontSize: '22px',
                                                    lineHeight: '1',
                                                    color: '#817661',
                                                }}
                                            >
                                                +
                                            </span>
                                        </summary>
                                        <div
                                            style={{
                                                padding: '0 18px 18px 18px',
                                                fontSize: '16px',
                                                color: 'oklch(0.4 0.02 60)',
                                            }}
                                        >
                                            Ada promo tertentu tergantung periode dan jumlah jendela yang dikerjakan. Paling enak tanya langsung ke owner via WhatsApp, biar kami info promo yang benar-benar aktif sekarang, bukan yang sudah lewat.
                                        </div>
                                    </details>

                                    <details
                                        style={{
                                            background: '#fdfcfa',
                                            border: '1px solid oklch(0.9 0.02 80)',
                                            borderRadius: '14px',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <summary
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '14px',
                                                padding: '16px 16px',
                                                cursor: 'pointer',
                                                listStyle: 'none',
                                                fontSize: '17px',
                                                fontWeight: '600',
                                                color: 'oklch(0.26 0.02 60)',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    flex: 'none',
                                                    width: '30px',
                                                    height: '30px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: '999px',
                                                    background: '#817661',
                                                    color: '#fdfcfa',
                                                    fontSize: '14px',
                                                    fontWeight: '700',
                                                }}
                                            >
                                                3
                                            </span>
                                            <span style={{ flex: '1' }}>Kapan waktu pemasangannya?</span>
                                            <span
                                                style={{
                                                    flex: 'none',
                                                    fontSize: '22px',
                                                    lineHeight: '1',
                                                    color: '#817661',
                                                }}
                                            >
                                                +
                                            </span>
                                        </summary>
                                        <div
                                            style={{
                                                padding: '0 18px 18px 18px',
                                                fontSize: '16px',
                                                color: 'oklch(0.4 0.02 60)',
                                            }}
                                        >
                                            Dijadwalkan sesuai kesepakatan setelah produksi selesai, biasanya <strong>7-10 hari kerja</strong> setelahnya. Anda pilih hari dan jamnya; kami yang menyesuaikan.
                                        </div>
                                    </details>

                                    <details
                                        style={{
                                            background: '#fdfcfa',
                                            border: '1px solid oklch(0.9 0.02 80)',
                                            borderRadius: '14px',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <summary
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '14px',
                                                padding: '16px 16px',
                                                cursor: 'pointer',
                                                listStyle: 'none',
                                                fontSize: '17px',
                                                fontWeight: '600',
                                                color: 'oklch(0.26 0.02 60)',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    flex: 'none',
                                                    width: '30px',
                                                    height: '30px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: '999px',
                                                    background: '#817661',
                                                    color: '#fdfcfa',
                                                    fontSize: '14px',
                                                    fontWeight: '700',
                                                }}
                                            >
                                                4
                                            </span>
                                            <span style={{ flex: '1' }}>Kalau setelah dipasang ada yang kurang pas?</span>
                                            <span
                                                style={{
                                                    flex: 'none',
                                                    fontSize: '22px',
                                                    lineHeight: '1',
                                                    color: '#817661',
                                                }}
                                            >
                                                +
                                            </span>
                                        </summary>
                                        <div
                                            style={{
                                                padding: '0 18px 18px 18px',
                                                fontSize: '16px',
                                                color: 'oklch(0.4 0.02 60)',
                                            }}
                                        >
                                            Masuk garansi pemasangan 14 hari. Kabari saja, kami datang memperbaiki tanpa biaya tambahan.
                                        </div>
                                    </details>

                                    <details
                                        style={{
                                            background: '#fdfcfa',
                                            border: '1px solid oklch(0.9 0.02 80)',
                                            borderRadius: '14px',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <summary
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '14px',
                                                padding: '16px 16px',
                                                cursor: 'pointer',
                                                listStyle: 'none',
                                                fontSize: '17px',
                                                fontWeight: '600',
                                                color: 'oklch(0.26 0.02 60)',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    flex: 'none',
                                                    width: '30px',
                                                    height: '30px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: '999px',
                                                    background: '#817661',
                                                    color: '#fdfcfa',
                                                    fontSize: '14px',
                                                    fontWeight: '700',
                                                }}
                                            >
                                                5
                                            </span>
                                            <span style={{ flex: '1' }}>Apakah survey dan konsultasi dikenakan biaya?</span>
                                            <span
                                                style={{
                                                    flex: 'none',
                                                    fontSize: '22px',
                                                    lineHeight: '1',
                                                    color: '#817661',
                                                }}
                                            >
                                                +
                                            </span>
                                        </summary>
                                        <div
                                            style={{
                                                padding: '0 18px 18px 18px',
                                                fontSize: '16px',
                                                color: 'oklch(0.4 0.02 60)',
                                            }}
                                        >
                                            Tidak. Konsultasi dan survey ke lokasi gratis untuk area Solo Raya.
                                        </div>
                                    </details>

                                    <details
                                        style={{
                                            background: '#fdfcfa',
                                            border: '1px solid oklch(0.9 0.02 80)',
                                            borderRadius: '14px',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <summary
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '14px',
                                                padding: '16px 16px',
                                                cursor: 'pointer',
                                                listStyle: 'none',
                                                fontSize: '17px',
                                                fontWeight: '600',
                                                color: 'oklch(0.26 0.02 60)',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    flex: 'none',
                                                    width: '30px',
                                                    height: '30px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: '999px',
                                                    background: '#817661',
                                                    color: '#fdfcfa',
                                                    fontSize: '14px',
                                                    fontWeight: '700',
                                                }}
                                            >
                                                6
                                            </span>
                                            <span style={{ flex: '1' }}>Bisa bantu pilih model kalau saya belum ada bayangan?</span>
                                            <span
                                                style={{
                                                    flex: 'none',
                                                    fontSize: '22px',
                                                    lineHeight: '1',
                                                    color: '#817661',
                                                }}
                                            >
                                                +
                                            </span>
                                        </summary>
                                        <div
                                            style={{
                                                padding: '0 18px 18px 18px',
                                                fontSize: '16px',
                                                color: 'oklch(0.4 0.02 60)',
                                            }}
                                        >
                                            Justru itu tugas kami. Ceritakan fungsi ruangannya dan arah jendelanya, nanti owner yang bantu susun pilihannya, bukan Anda yang dibiarkan menebak sendiri.
                                        </div>
                                    </details>
                                </div>

                                <div style={{ margin: '26px 0 0' }}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '12px',
                                        }}
                                    >
                                        <a
                                            href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20konsultasi%20gorden.%20Boleh%20dibantu%3F"
                                            target="_blank"
                                            rel="noopener"
                                            style={{
                                                flex: '1 1 260px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minHeight: '56px',
                                                padding: '14px 18px',
                                                background: '#FF6B35',
                                                color: '#fff',
                                                fontSize: 'clamp(15px, 3.9vw, 17px)',
                                                fontWeight: '700',
                                                textDecoration: 'none',
                                                borderRadius: '12px',
                                            }}
                                        >
                                            <img
                                                src="/assets/whatsapp.svg"
                                                alt=""
                                                style={{
                                                    flex: 'none',
                                                    width: '20px',
                                                    height: '20px',
                                                    marginRight: '9px',
                                                    display: 'block',
                                                }}
                                            />
                                            Konsultasi Gratis →
                                        </a>
                                        <a
                                            href="#portofolio"
                                            style={{
                                                flex: '1 1 220px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minHeight: '56px',
                                                padding: '14px 18px',
                                                background: 'rgba(253,252,250,0.12)',
                                                border: '2px solid #FF6B35',
                                                color: '#241D17',
                                                fontSize: 'clamp(15px, 3.9vw, 17px)',
                                                fontWeight: '700',
                                                textDecoration: 'none',
                                                borderRadius: '12px',
                                                backdropFilter: 'blur(4px)',
                                            }}
                                        >
                                            Lihat Portofolio →
                                        </a>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            alignItems: 'center',
                                            gap: '5px 10px',
                                            margin: '12px 0 0',
                                            fontSize: '12.5px',
                                            color: 'oklch(0.4 0.02 60)',
                                        }}
                                    >
                                        <span
                                            style={{
                                                color: '#E0A93B',
                                                fontSize: '12.5px',
                                                letterSpacing: '1px',
                                            }}
                                        >
                                            ★★★★★
                                        </span>
                                        <strong style={{ color: 'oklch(0.28 0.02 60)' }}>5,0</strong>
                                        <span>Google Review</span>
                                        <span style={{ color: 'oklch(0.78 0.02 80)' }}>•</span>
                                        <span>1.000+ pembeli</span>
                                        <span style={{ color: 'oklch(0.78 0.02 80)' }}>•</span>
                                        <span>Ada garansi kalau kurang pas</span>
                                    </div>
                                </div>
                            </section>

                            <section
                                style={{
                                    margin: '44px 0 0',
                                    padding: 'clamp(24px, 5.5vw, 32px) clamp(16px, 4.5vw, 24px)',
                                    background: '#817661',
                                    color: '#fdfcfa',
                                    borderRadius: '18px',
                                }}
                            >
                                <p
                                    style={{
                                        margin: '0 0 10px',
                                        fontSize: '12px',
                                        fontWeight: '700',
                                        letterSpacing: '0.14em',
                                        textTransform: 'uppercase',
                                        color: 'rgba(253,252,250,0.75)',
                                    }}
                                >
                                    Area layanan
                                </p>
                                <h2
                                    style={{
                                        margin: '0 0 8px',
                                        fontFamily: 'Poppins, Helvetica, sans-serif',
                                        fontSize: 'clamp(23px, 5.2vw, 30px)',
                                        lineHeight: '1.2',
                                        fontWeight: '700',
                                        letterSpacing: '-0.02em',
                                    }}
                                >
                                    Survey &amp; pasang di seluruh Solo Raya
                                </h2>
                                <p
                                    style={{
                                        margin: '0 0 20px',
                                        color: 'rgba(253,252,250,0.85)',
                                        maxWidth: '62ch',
                                    }}
                                >
                                    Workshop kami di Jl. Songgolangit 22, Gentan, Solo, dan tim datang ke lokasi Anda tanpa biaya survey.
                                </p>
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(46%, 130px), 1fr))',
                                        gap: '10px',
                                    }}
                                >
                                    <span
                                        style={{
                                            padding: '14px 16px',
                                            background: 'rgba(253,252,250,0.12)',
                                            border: '1px solid rgba(253,252,250,0.28)',
                                            borderRadius: '12px',
                                            fontSize: '17px',
                                            fontWeight: '600',
                                            textAlign: 'center',
                                        }}
                                    >
                                        Solo
                                    </span>
                                    <span
                                        style={{
                                            padding: '14px 16px',
                                            background: 'rgba(253,252,250,0.12)',
                                            border: '1px solid rgba(253,252,250,0.28)',
                                            borderRadius: '12px',
                                            fontSize: '17px',
                                            fontWeight: '600',
                                            textAlign: 'center',
                                        }}
                                    >
                                        Sukoharjo
                                    </span>
                                    <span
                                        style={{
                                            padding: '14px 16px',
                                            background: 'rgba(253,252,250,0.12)',
                                            border: '1px solid rgba(253,252,250,0.28)',
                                            borderRadius: '12px',
                                            fontSize: '17px',
                                            fontWeight: '600',
                                            textAlign: 'center',
                                        }}
                                    >
                                        Karanganyar
                                    </span>
                                    <span
                                        style={{
                                            padding: '14px 16px',
                                            background: 'rgba(253,252,250,0.12)',
                                            border: '1px solid rgba(253,252,250,0.28)',
                                            borderRadius: '12px',
                                            fontSize: '17px',
                                            fontWeight: '600',
                                            textAlign: 'center',
                                        }}
                                    >
                                        Boyolali
                                    </span>
                                    <span
                                        style={{
                                            padding: '14px 16px',
                                            background: 'rgba(253,252,250,0.12)',
                                            border: '1px solid rgba(253,252,250,0.28)',
                                            borderRadius: '12px',
                                            fontSize: '17px',
                                            fontWeight: '600',
                                            textAlign: 'center',
                                        }}
                                    >
                                        Klaten
                                    </span>
                                    <span
                                        style={{
                                            padding: '14px 16px',
                                            background: 'rgba(253,252,250,0.12)',
                                            border: '1px solid rgba(253,252,250,0.28)',
                                            borderRadius: '12px',
                                            fontSize: '17px',
                                            fontWeight: '600',
                                            textAlign: 'center',
                                        }}
                                    >
                                        Sragen
                                    </span>
                                </div>
                                <p
                                    style={{
                                        margin: '18px 0 0',
                                        fontSize: '16px',
                                        color: 'rgba(253,252,250,0.85)',
                                    }}
                                >
                                    Di luar area tersebut? Tanyakan dulu lewat WhatsApp, biasanya masih bisa kami bantu.
                                </p>

                                <div style={{ margin: '26px 0 0' }}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '12px',
                                        }}
                                    >
                                        <a
                                            href="https://wa.me/6285860525758?text=Halo%2C%20saya%20di%20Solo%20Raya.%20Apakah%20bisa%20survey%20ke%20lokasi%20saya%3F"
                                            target="_blank"
                                            rel="noopener"
                                            style={{
                                                flex: '1 1 260px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minHeight: '56px',
                                                padding: '14px 18px',
                                                background: '#FF6B35',
                                                color: '#fff',
                                                fontSize: 'clamp(15px, 3.9vw, 17px)',
                                                fontWeight: '700',
                                                textDecoration: 'none',
                                                borderRadius: '12px',
                                            }}
                                        >
                                            <img
                                                src="/assets/whatsapp.svg"
                                                alt=""
                                                style={{
                                                    flex: 'none',
                                                    width: '20px',
                                                    height: '20px',
                                                    marginRight: '9px',
                                                    display: 'block',
                                                }}
                                            />
                                            Konsultasi Gratis →
                                        </a>
                                        <a
                                            href="#portofolio"
                                            style={{
                                                flex: '1 1 220px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minHeight: '56px',
                                                padding: '14px 18px',
                                                background: 'transparent',
                                                border: '2px solid rgba(253,252,250,0.55)',
                                                color: '#fdfcfa',
                                                fontSize: 'clamp(15px, 3.9vw, 17px)',
                                                fontWeight: '700',
                                                textDecoration: 'none',
                                                borderRadius: '12px',
                                                borderColor: '#FF6B35',
                                            }}
                                        >
                                            Lihat Portofolio →
                                        </a>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            alignItems: 'center',
                                            gap: '5px 10px',
                                            margin: '12px 0 0',
                                            fontSize: '12.5px',
                                            color: 'rgba(253,252,250,0.85)',
                                        }}
                                    >
                                        <span
                                            style={{
                                                color: '#E0A93B',
                                                fontSize: '12.5px',
                                                letterSpacing: '1px',
                                            }}
                                        >
                                            ★★★★★
                                        </span>
                                        <strong style={{ color: '#fdfcfa' }}>5,0</strong>
                                        <span>Google Review</span>
                                        <span style={{ color: 'rgba(253,252,250,0.4)' }}>•</span>
                                        <span>1.000+ pembeli</span>
                                        <span style={{ color: 'rgba(253,252,250,0.4)' }}>•</span>
                                        <span>Ada garansi kalau kurang pas</span>
                                    </div>
                                </div>
                            </section>

                            <footer
                                style={{
                                    padding: '34px 0 0',
                                    marginTop: '30px',
                                    borderTop: '1px solid oklch(0.9 0.02 80)',
                                    fontSize: '15px',
                                    color: 'oklch(0.42 0.02 60)',
                                    display: 'grid',
                                    gap: '6px',
                                }}
                            >
                                <p
                                    style={{
                                        margin: '0 0 6px',
                                        fontFamily: 'Poppins, Helvetica, sans-serif',
                                        fontSize: '19px',
                                        fontWeight: '600',
                                        color: 'oklch(0.24 0.02 60)',
                                    }}
                                >
                                    Gorden Wallpaper Solo
                                </p>
                                <p style={{ margin: '0' }}>Jl. Songgolangit 22, Gentan, Solo</p>
                                <p style={{ margin: '0' }}>
                                    WhatsApp:{' '}
                                    <a href="https://wa.me/6285860525758" target="_blank" rel="noopener" style={{ fontWeight: '600' }}>
                                        085.860.52.57.58
                                    </a>
                                </p>
                                <p style={{ margin: '0' }}>Jam operasional online: 24 jam, setiap hari</p>
                                <p style={{ margin: '0' }}>Workshop: Senin-Sabtu 09.00-17.00, Minggu dan hari libur by appointment</p>
                                <p style={{ margin: '0' }}>
                                    <a href="https://instagram.com/gorden.wallpapersolo" target="_blank" rel="noopener">
                                        Instagram @gorden.wallpapersolo
                                    </a>{' '}
                                    ·{' '}
                                    <a href="https://facebook.com/search/top?q=gorden%20wallpaper%20solo" target="_blank" rel="noopener">
                                        Facebook Gorden Wallpaper Solo
                                    </a>
                                </p>
                                <p
                                    style={{
                                        margin: '8px 0 0',
                                        fontSize: '13px',
                                        color: 'oklch(0.58 0.03 70)',
                                    }}
                                >
                                    Melayani gorden custom rumah &amp; kantor di Solo, Sukoharjo, Karanganyar, Boyolali, Klaten, dan Sragen sejak 2012.
                                </p>
                            </footer>
                        </>
                    )}
                </main>

                {!!lightbox && (
                    <div
                        onClick={closeLightbox}
                        style={{
                            position: 'fixed',
                            inset: '0',
                            zIndex: '90',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '20px',
                            background: 'rgba(28,25,20,0.88)',
                            cursor: 'zoom-out',
                        }}
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '14px',
                                maxWidth: '100%',
                                maxHeight: '100%',
                                cursor: 'default',
                            }}
                        >
                            <img
                                src={lightbox}
                                alt="Pratinjau gambar"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '74vh',
                                    width: 'auto',
                                    height: 'auto',
                                    borderRadius: '12px',
                                    boxShadow: '0 30px 60px -20px rgba(0,0,0,0.7)',
                                }}
                            />
                            {(lbList[lbIdx]?.caption || '') && (
                                <p
                                    style={{
                                        margin: '0',
                                        maxWidth: '42ch',
                                        textAlign: 'center',
                                        fontFamily: 'Poppins, Helvetica, sans-serif',
                                        fontSize: '15px',
                                        lineHeight: '1.45',
                                        fontWeight: '600',
                                        color: '#fdfcfa',
                                    }}
                                >
                                    {lbList[lbIdx]?.caption || ''}
                                </p>
                            )}
                            {lbList.length > 1 && (
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '14px',
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={lightboxPrev}
                                        aria-label="Foto sebelumnya"
                                        style={{
                                            width: '44px',
                                            height: '44px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '999px',
                                            border: 'none',
                                            background: 'rgba(253,252,250,0.92)',
                                            color: '#3a352c',
                                            fontSize: '20px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        ‹
                                    </button>
                                    <span
                                        style={{
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            color: 'rgba(253,252,250,0.8)',
                                        }}
                                    >
                                        {lbIdx + 1 + ' / ' + lbList.length}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={lightboxNext}
                                        aria-label="Foto selanjutnya"
                                        style={{
                                            width: '44px',
                                            height: '44px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '999px',
                                            border: 'none',
                                            background: 'rgba(253,252,250,0.92)',
                                            color: '#3a352c',
                                            fontSize: '20px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        ›
                                    </button>
                                </div>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={closeLightbox}
                            aria-label="Tutup"
                            style={{
                                position: 'absolute',
                                top: '16px',
                                right: '16px',
                                width: '42px',
                                height: '42px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '999px',
                                border: 'none',
                                background: 'rgba(253,252,250,0.92)',
                                color: '#3a352c',
                                fontSize: '20px',
                                cursor: 'pointer',
                            }}
                        >
                            ✕
                        </button>
                    </div>
                )}

                <a
                    href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20konsultasi%20gorden.%20Boleh%20dibantu%3F"
                    target="_blank"
                    rel="noopener"
                    aria-label="Konsultasi gratis via WhatsApp"
                    style={{
                        position: 'fixed',
                        right: '18px',
                        bottom: '18px',
                        zIndex: '60',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '999px',
                        textDecoration: 'none',
                        boxShadow: '0 14px 28px -10px rgba(37,211,102,0.6)',
                    }}
                >
                    <img
                        src="/assets/whatsapp.svg"
                        alt=""
                        style={{
                            width: '58px',
                            height: '58px',
                            display: 'block',
                        }}
                    />
                </a>
            </div>
        </>
    );
}

GordenLanding.layout = (page: React.ReactNode) => page;
