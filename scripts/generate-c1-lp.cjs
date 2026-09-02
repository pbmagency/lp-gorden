const fs = require('node:fs');
const path = require('node:path');

const source = String.raw`C:\Users\moham\Downloads\Landing page single-scroll siap (5)\Landing page single-scroll siap (4)\index.html`;
const destination = path.resolve('resources/js/pages/cycle1/c1-lp.tsx');
const html = fs.readFileSync(source, 'utf8');
const match = html.match(/<x-dc>([\s\S]*?)<\/x-dc>/);

if (!match) throw new Error('The source landing page does not contain <x-dc>.');

let markup = match[1]
    .replace(/<helmet>[\s\S]*?<\/helmet>/, '')
    .replace(/<template id="__bundler_thumbnail">[\s\S]*?<\/template>/, '')
    .replaceAll('src="assets/', 'src="/assets/')
    .replaceAll('data-zoom="assets/', 'data-zoom="/assets/')
    .replaceAll("url('assets/", "url('/assets/")
    .trim();

const component = `import { Head } from '@inertiajs/react';
import {
    type ChangeEvent,
    type MouseEvent,
    useEffect,
    useMemo,
    useState,
} from 'react';

const SOURCE_MARKUP = ${JSON.stringify(markup)};
const REVIEWS = Array.from({ length: 8 }, (_, index) =>
    \`/assets/review-\${index + 1}.png\`,
);

type Category = 'semua' | 'kain' | 'blinds' | 'lain';
type LightboxItem = { src: string; caption: string };

function conditionMarkup(markup: string, conditions: Record<string, boolean>) {
    let result = markup.replace(
        /<sc-if\\s+value="{{\\s*([^}]+?)\\s*}}"[^>]*>/g,
        (_match, name: string) =>
            \`<div data-condition="\${name.trim()}" style="display:\${conditions[name.trim()] ? 'contents' : 'none'}">\`,
    );
    result = result.replaceAll('</sc-if>', '</div>');
    result = result.replace(
        /<sc-for[^>]*>[\\s\\S]*?<\\/sc-for>/g,
        REVIEWS.map(
            (_, index) =>
                \`<span data-review-dot="\${index}" style="width:7px;height:7px;border-radius:999px;background:#CFC5B0"></span>\`,
        ).join(''),
    );
    return result;
}

export default function CycleOneLandingPage() {
    const [narrow, setNarrow] = useState(false);
    const [tiny, setTiny] = useState(false);
    const [category, setCategory] = useState<Category>('semua');
    const [reviewIndex, setReviewIndex] = useState(0);
    const [lightbox, setLightbox] = useState<LightboxItem[] | null>(null);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    useEffect(() => {
        const narrowQuery = window.matchMedia('(max-width: 760px)');
        const tinyQuery = window.matchMedia('(max-width: 500px)');
        const sync = () => {
            setNarrow(narrowQuery.matches);
            setTiny(tinyQuery.matches);
        };
        sync();
        narrowQuery.addEventListener('change', sync);
        tinyQuery.addEventListener('change', sync);
        return () => {
            narrowQuery.removeEventListener('change', sync);
            tinyQuery.removeEventListener('change', sync);
        };
    }, []);

    useEffect(() => {
        const timer = window.setInterval(
            () => setReviewIndex((index) => (index + 1) % REVIEWS.length),
            3500,
        );
        return () => window.clearInterval(timer);
    }, []);

    useEffect(() => {
        const previous = {
            margin: document.body.style.margin,
            background: document.body.style.background,
            fontFamily: document.body.style.fontFamily,
        };
        document.body.style.margin = '0';
        document.body.style.background = '#FAF7F1';
        document.body.style.fontFamily = 'Poppins, Helvetica, sans-serif';
        return () => {
            Object.assign(document.body.style, previous);
        };
    }, []);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setLightbox(null);
            if (!lightbox?.length) return;
            if (event.key === 'ArrowLeft') {
                setLightboxIndex((index) =>
                    (index - 1 + lightbox.length) % lightbox.length,
                );
            }
            if (event.key === 'ArrowRight') {
                setLightboxIndex((index) => (index + 1) % lightbox.length);
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [lightbox]);

    const renderedMarkup = useMemo(() => {
        const previousReview =
            REVIEWS[(reviewIndex - 1 + REVIEWS.length) % REVIEWS.length];
        const nextReview = REVIEWS[(reviewIndex + 1) % REVIEWS.length];
        const currentLightbox = lightbox?.[lightboxIndex];
        const heroOverlay = narrow
            ? 'linear-gradient(to top, rgba(20,17,13,0.92) 0%, rgba(20,17,13,0.78) 34%, rgba(20,17,13,0.34) 62%, rgba(20,17,13,0.1) 100%)'
            : 'linear-gradient(to right, rgba(20,17,13,0.9) 0%, rgba(20,17,13,0.74) 34%, rgba(20,17,13,0.34) 62%, rgba(20,17,13,0.12) 100%), linear-gradient(to top, rgba(20,17,13,0.55) 0%, rgba(20,17,13,0.1) 45%, rgba(20,17,13,0.05) 100%)';
        const values: Record<string, string> = {
            heroOverlay,
            heroPos: tiny ? '70% 46%' : narrow ? '68% 34%' : '62% center',
            heroSize: tiny ? 'auto 200%' : narrow ? 'auto 150%' : 'cover',
            katCat: category,
            reviewCenterH: narrow ? 'min(68vh, 460px)' : '330px',
            reviewSideW: narrow ? '36px' : '110px',
            reviewSideH: narrow ? '150px' : '230px',
            reviewPrev: previousReview,
            reviewNext: nextReview,
            lightboxCaption: currentLightbox?.caption ?? '',
            lightboxPos: lightbox?.length
                ? \`\${lightboxIndex + 1} / \${lightbox.length}\`
                : '',
            tabAllFg: category === 'semua' ? '#221F1A' : '#877E6D',
            tabKainFg: category === 'kain' ? '#221F1A' : '#877E6D',
            tabBlindsFg: category === 'blinds' ? '#221F1A' : '#877E6D',
            tabLainFg: category === 'lain' ? '#221F1A' : '#877E6D',
            tabAllLine: category === 'semua' ? '#6E6553' : 'transparent',
            tabKainLine: category === 'kain' ? '#6E6553' : 'transparent',
            tabBlindsLine: category === 'blinds' ? '#6E6553' : 'transparent',
            tabLainLine: category === 'lain' ? '#6E6553' : 'transparent',
        };
        const conditions = {
            showTrustBar: true,
            prosesNarrow: narrow,
            prosesWide: !narrow,
            showKain: category === 'semua' || category === 'kain',
            showBlinds: category === 'semua' || category === 'blinds',
            showPelengkap: category === 'semua' || category === 'lain',
            lightboxOpen: Boolean(lightbox),
            lightboxCaption: Boolean(currentLightbox?.caption),
            lightboxHasNav: Boolean(lightbox && lightbox.length > 1),
        };
        let result = conditionMarkup(SOURCE_MARKUP, conditions);
        result = result
            .replace(/onClick="{{\\s*([^}]+?)\\s*}}"/g, 'data-action="$1"')
            .replace(/onChange="{{\\s*([^}]+?)\\s*}}"/g, 'data-action="$1"')
            .replace(/ref="{{\\s*[^}]+?\\s*}}"/g, '')
            .replace(/value="{{\\s*katCat\\s*}}"/g, \`value="\${category}"\`);
        for (const [key, value] of Object.entries(values)) {
            result = result.replaceAll(\`{{ \${key} }}\`, value);
        }
        result = result.replaceAll('{{ d.color }}', '#CFC5B0');
        if (currentLightbox) {
            result = result.replace(
                'alt="Pratinjau gambar"',
                \`alt="Pratinjau gambar" src="\${currentLightbox.src}"\`,
            );
        }
        result = result.replace(
            'alt="Ulasan pelanggan di Google"',
            \`alt="Ulasan pelanggan di Google" src="\${REVIEWS[reviewIndex]}"\`,
        );
        result = result.replace(
            \`data-review-dot="\${reviewIndex}" style="width:7px;height:7px;border-radius:999px;background:#CFC5B0"\`,
            \`data-review-dot="\${reviewIndex}" style="width:7px;height:7px;border-radius:999px;background:#6E6553"\`,
        );
        return result;
    }, [category, lightbox, lightboxIndex, narrow, reviewIndex, tiny]);

    const scrollKatalog = () => {
        window.setTimeout(() => {
            const bar = document.getElementById('katalog-filter');
            const target = bar?.nextElementSibling ?? bar;
            if (!target) return;
            const y = target.getBoundingClientRect().top + window.scrollY - 132;
            window.scrollTo({ top: y, behavior: 'smooth' });
        });
    };

    const stepReview = (delta: number) =>
        setReviewIndex(
            (index) => (index + delta + REVIEWS.length) % REVIEWS.length,
        );

    const handleClick = (event: MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement;
        const actionElement = target.closest<HTMLElement>('[data-action]');
        const action = actionElement?.dataset.action;
        if (action === 'stopClick') return;
        if (action === 'closeLightbox') {
            setLightbox(null);
            return;
        }
        if (action === 'reviewPrevClick') stepReview(-1);
        if (action === 'reviewNextClick') stepReview(1);
        if (action === 'zoomCurrentReview') {
            setLightbox(REVIEWS.map((src) => ({ src, caption: '' })));
            setLightboxIndex(reviewIndex);
        }
        if (action === 'lightboxPrev' && lightbox?.length) {
            event.stopPropagation();
            setLightboxIndex(
                (index) => (index - 1 + lightbox.length) % lightbox.length,
            );
        }
        if (action === 'lightboxNext' && lightbox?.length) {
            event.stopPropagation();
            setLightboxIndex((index) => (index + 1) % lightbox.length);
        }
        const categories: Record<string, Category> = {
            pickAll: 'semua',
            pickKain: 'kain',
            pickBlinds: 'blinds',
            pickLain: 'lain',
        };
        if (action && categories[action]) {
            setCategory(categories[action]);
            scrollKatalog();
        }
        const zoomTarget = target.closest<HTMLElement>('[data-zoom]');
        if (!zoomTarget || action) return;
        const scope = zoomTarget.closest('section') ?? document;
        const nodes = Array.from(scope.querySelectorAll<HTMLElement>('[data-zoom]'));
        const items = nodes.map((node) => ({
            src: node.dataset.zoom ?? '',
            caption: Array.from(node.querySelectorAll('figcaption span, p'))
                .map((part) => part.textContent?.trim() ?? '')
                .filter(Boolean)
                .slice(0, 2)
                .join(', '),
        }));
        setLightbox(items);
        setLightboxIndex(Math.max(0, nodes.indexOf(zoomTarget)));
    };

    const handleChange = (event: ChangeEvent<HTMLDivElement>) => {
        const select = event.target as unknown as HTMLSelectElement;
        if (select.dataset.action !== 'pickCat') return;
        setCategory(select.value as Category);
        scrollKatalog();
    };

    return (
        <>
            <Head>
                <title>Gorden Custom Solo Raya | Gorden Wallpaper Solo</title>
                <meta
                    name="description"
                    content="Gorden custom Solo Raya, terima beres ukur dan pasang. Konsultasi langsung dengan owner, survey gratis, dan garansi pemasangan 14 hari."
                />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400&display=swap"
                    rel="stylesheet"
                />
                <style>{\`*{box-sizing:border-box}a{color:#6E6553}a:hover{color:#4A4339}[style-hover*="#1FBA57"]:hover{background:#1FBA57!important}[style-hover*="#1EBE5A"]:hover{background:#1EBE5A!important}[style-hover*="#25D366"]:hover{background:#25D366!important}[style-hover*="#F2EDE3"]:hover{background:#F2EDE3!important}[style-hover*="border-color: #6E6553"]:hover{border-color:#6E6553!important}[style-hover*="rgba(252,250,246,0.22)"]:hover{background:rgba(252,250,246,.22)!important}[style-hover*="opacity: 1"]:hover{opacity:1!important}[style-active*="#19A84F"]:active{background:#19A84F!important}@keyframes omBob{0%,100%{transform:translateY(0)}50%{transform:translateY(6px)}}@keyframes reviewMarquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}\`}</style>
            </Head>
            <div
                onClick={handleClick}
                onChange={handleChange}
                dangerouslySetInnerHTML={{ __html: renderedMarkup }}
            />
        </>
    );
}
`;

fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.writeFileSync(destination, component, 'utf8');
console.log(`Generated ${destination} from ${source}`);
