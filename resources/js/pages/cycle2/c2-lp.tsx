import { Head } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState, lazy, Suspense } from 'react';
import type { ChangeEvent, MouseEvent as ReactMouseEvent } from 'react';
import { useAnalytics } from '@/hooks/use-analytics';

const AnalyticsWrapper = lazy(() => import('@/components/AnalyticsWrapper'));

type LightboxItem = { src: string; caption: string };
type KatCat = 'semua' | 'kain' | 'blinds' | 'lain';

const reviewShots: string[] = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => `/assets-c2/review-${n}.webp`);

export default function GordenWallpaperSoloLanding() {
  const { trackCTA, trackConversion } = useAnalytics();

  const [isNarrow, setIsNarrow] = useState<boolean>(false);
  const [reviewIdx, setReviewIdx] = useState<number>(0);
  const [katCat, setKatCat] = useState<KatCat>('semua');
  const [showAllProjects, setShowAllProjects] = useState<boolean>(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [lbList, setLbList] = useState<LightboxItem[]>([]);
  const [lbIdx, setLbIdx] = useState<number>(0);
  const [nudgeVisible, setNudgeVisible] = useState<boolean>(false);
  const [nudgeClosed, setNudgeClosed] = useState<boolean>(false);

  const showTrustBar = true;
  const showKain: boolean = katCat === 'semua' || katCat === 'kain';
  const showBlinds: boolean = katCat === 'semua' || katCat === 'blinds';
  const showPelengkap: boolean = katCat === 'semua' || katCat === 'lain';
  const showNudge: boolean = nudgeVisible && !nudgeClosed;
  const projectsLabel: string = showAllProjects
    ? 'Tampilkan lebih sedikit ↑'
    : 'Lihat Lebih Banyak Hasil Pemasangan ↓';
  const lightboxCaption: string = lbList[lbIdx]?.caption ?? '';
  const lightboxPos: string = lbList.length > 1 ? `${lbIdx + 1} / ${lbList.length}` : '';
  const reviewPrevSrc: string = reviewShots[(reviewIdx - 1 + reviewShots.length) % reviewShots.length];
  const reviewNextSrc: string = reviewShots[(reviewIdx + 1) % reviewShots.length];

  const reviewImgRef = useRef<HTMLImageElement | null>(null);
  const lightboxImgRef = useRef<HTMLImageElement | null>(null);
  const reviewTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  /* breakpoint 760px & 500px, sama seperti desain aslinya */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 760px)');
    const onMq = () => setIsNarrow(mq.matches);
    onMq();
    mq.addEventListener('change', onMq);
    return () => mq.removeEventListener('change', onMq);
  }, []);

  /* popup WhatsApp muncul setelah 10 detik */
  useEffect(() => {
    const id = setTimeout(() => setNudgeVisible(true), 10000);
    return () => clearTimeout(id);
  }, []);

  /* autoplay carousel screenshot review */
  const startReviewTimer = useCallback(() => {
    if (reviewTimer.current) clearInterval(reviewTimer.current);
    reviewTimer.current = setInterval(() => {
      setReviewIdx((i) => (i + 1) % reviewShots.length);
    }, 3500);
  }, []);

  const handleGlobalClick = useCallback((event: ReactMouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const anchor = target.closest<HTMLAnchorElement>('a[href]');

    if (anchor) {
      const destination = anchor.href;
      const text =
        anchor.getAttribute('aria-label') ||
        anchor.textContent?.trim() ||
        'Link';
      const isWhatsApp =
        anchor.hostname === 'wa.me' ||
        anchor.hostname.endsWith('.whatsapp.com');
      const location = isWhatsApp
        ? 'whatsapp_button'
        : anchor.getAttribute('href')?.startsWith('#')
          ? 'page_anchor'
          : 'outbound_link';

      trackCTA(location, text, destination);

      if (isWhatsApp) {
        trackConversion('wa_inquiry', { location });

        try {
          (
            window as typeof window & {
              fbq?: (
                action: string,
                event: string,
                data?: Record<string, string>,
              ) => void;
            }
          ).fbq?.('track', 'Search', {
            search_string: 'WhatsApp Inquiry',
          });
        } catch (e) {
          // ignore
        }
      }
    }
  }, [trackCTA, trackConversion]);

  useEffect(() => {
    startReviewTimer();
    return () => {
      if (reviewTimer.current) clearInterval(reviewTimer.current);
    };
  }, [startReviewTimer]);

  useEffect(() => {
    if (reviewImgRef.current) reviewImgRef.current.src = reviewShots[reviewIdx];
  }, [reviewIdx]);

  useEffect(() => {
    if (lightboxImgRef.current && lightbox) lightboxImgRef.current.src = lightbox;
  }, [lightbox, lbIdx]);

  const stepReview = useCallback(
    (d: number) => {
      setReviewIdx((i) => (i + d + reviewShots.length) % reviewShots.length);
      startReviewTimer();
    },
    [startReviewTimer],
  );

  const reviewPrevClick = useCallback(() => stepReview(-1), [stepReview]);
  const reviewNextClick = useCallback(() => stepReview(1), [stepReview]);

  const zoomCurrentReview = useCallback(() => {
    setLbList(reviewShots.map((src) => ({ src, caption: '' })));
    setLbIdx(reviewIdx);
    setLightbox(reviewShots[reviewIdx]);
  }, [reviewIdx]);

  const toggleProjects = useCallback(() => setShowAllProjects((v) => !v), []);

  const closeLightbox = useCallback(() => {
    setLightbox(null);
    setLbList([]);
    setLbIdx(0);
  }, []);

  const moveLightbox = useCallback(
    (d: number) => {
      if (lbList.length < 2) return;
      const next = (lbIdx + d + lbList.length) % lbList.length;
      setLbIdx(next);
      setLightbox(lbList[next].src);
    },
    [lbIdx, lbList],
  );

  const lightboxPrev = useCallback(() => moveLightbox(-1), [moveLightbox]);
  const lightboxNext = useCallback(() => moveLightbox(1), [moveLightbox]);
  const stopClick = useCallback((e: ReactMouseEvent) => e.stopPropagation(), []);

  /* zoom untuk semua elemen [data-zoom], dikelompokkan per section */
  useEffect(() => {
    const onZoomClick = (e: globalThis.MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-zoom]');
      if (!target) return;
      const scope: ParentNode = target.closest('section') ?? document;
      const nodes = Array.from(scope.querySelectorAll<HTMLElement>('[data-zoom]'));
      const list: LightboxItem[] = nodes.map((n) => {
        const cap = n.querySelector('figcaption');
        let parts: string[] = [];
        if (cap) {
          parts = Array.from(cap.querySelectorAll('span'))
            .map((x) => (x.textContent ?? '').trim())
            .filter(Boolean);
        }
        if (!parts.length) {
          const box = n.parentElement;
          parts = box
            ? Array.from(box.querySelectorAll('p'))
                .map((p) => (p.textContent ?? '').trim())
                .filter(Boolean)
            : [];
        }
        return { src: n.getAttribute('data-zoom') ?? '', caption: parts.slice(0, 2).join(', ') };
      });
      const idx = Math.max(0, nodes.indexOf(target));
      setLbList(list);
      setLbIdx(idx);
      setLightbox(list[idx]?.src ?? null);
    };
    document.addEventListener('click', onZoomClick);
    return () => document.removeEventListener('click', onZoomClick);
  }, []);

  /* Esc menutup lightbox, panah kiri/kanan navigasi */
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lightboxPrev();
      if (e.key === 'ArrowRight') lightboxNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, closeLightbox, lightboxPrev, lightboxNext]);

  const scrollKatalog = useCallback(() => {
    const bar = document.getElementById('katalog-filter');
    const el = (bar?.nextElementSibling as HTMLElement | null) ?? bar;
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 132, behavior: 'smooth' });
  }, []);

  const pickCat = useCallback(
    (cat: KatCat) => {
      setKatCat(cat);
      scrollKatalog();
    },
    [scrollKatalog],
  );

  const onPickCatSelect = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => pickCat(e.target.value as KatCat),
    [pickCat],
  );

  const closeNudge = useCallback(() => setNudgeClosed(true), []);
  const closeNudgeBtn = useCallback((e: ReactMouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setNudgeClosed(true);
  }, []);

  return (
    <>
      <Head title="Gorden Custom Solo – Survey & Pasang ke Lokasi Anda">
        <link rel="preload" href="/assets-c2/hero-gorden-flip.webp" as="image" type="image/webp" fetchPriority="high" />
        <link rel="preload" href="/assets-c2/logo.webp" as="image" type="image/webp" />
        <meta name="description" content="Gorden custom Solo & sekitarnya. Survey & pasang ke lokasi, free ongkos ukur. Hubungi owner langsung via WhatsApp." />
      </Head>
      <Suspense fallback={null}>
        <AnalyticsWrapper />
      </Suspense>
      {/* hanya untuk hal yang tidak bisa diekspresikan lewat utility class */}
      <style>{`
        @keyframes omBob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(6px); } }
        @keyframes reviewMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>

      <div onClick={handleGlobalClick} className="bg-[#FAF7F1] text-[#201D18] [font-family:Poppins,Helvetica,sans-serif] text-[17px] leading-[1.62] overflow-x-clip">
      
        <div className="sticky top-[0] z-[60] bg-[rgba(250,248,244,0.95)] backdrop-blur-[10px] [border-bottom:1px_solid_#E1D9C9]">
          <div className="max-w-[1000px] my-[0] mx-[auto] py-[10px] px-[20px] flex items-center justify-between gap-[12px]">
            <img src="/assets-c2/logo.webp" alt="Gorden Wallpaper Solo" className="h-[52px] w-[auto] block" loading="eager" decoding="sync" fetchPriority="high" width="292" height="292" />
            <a href="https://wa.me/6285860525758?text=Halo%20saya%20mau%20pesan%20Gorden%20Custom%2C%2Cbisa%20survey%20ke%20lokasi%3F" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center min-h-[46px] py-[11px] px-[18px] bg-[#25D366] text-[#fff] text-[15px] [font-weight:600] no-underline rounded-[10px] whitespace-nowrap gap-[9px] shadow-[0px_8px_20px_rgba(37,211,102,0.3)] hover:bg-[#1FBA57]"><img src="/assets-c2/whatsapp.svg" alt="" className="flex-none w-[20px] h-[20px] block [filter:brightness(0)_invert(1)]"  loading="lazy" decoding="async" />Konsultasi Gratis →</a>
          </div>
        </div>
      
        <div className="max-w-[1000px] my-[0] mx-[auto] pt-[12px] px-[clamp(14px,4vw,20px)] pb-[60px]">
      
          <section className="p-[0] h-[calc(100svh_-_79px)] min-h-[460px] flex flex-col">
            <div className="relative flex-[1_1_auto] min-h-[0] w-[100vw] ml-[calc(50%_-_50vw)] mr-[calc(50%_-_50vw)] flex flex-col justify-center gap-[14px] pt-[clamp(52px,12vw,88px)] px-[clamp(20px,calc((100vw_-_960px)_/_2_+_20px),200px)] pb-[clamp(76px,15vw,96px)] overflow-hidden bg-cover bg-center rounded-[0px]" style={{ backgroundImage: "linear-gradient(to top,rgba(20,17,13,0.92) 0%,rgba(20,17,13,0.78) 34%,rgba(20,17,13,0.34) 62%,rgba(20,17,13,0.1) 100%),url('/assets-c2/hero-gorden-flip.webp')" }}>
              <div className="relative w-[100%] max-w-[480px] mr-[auto] flex flex-col">
                <div className="self-start inline-flex flex-nowrap whitespace-nowrap items-center gap-[8px] pt-[5px] pr-[11px] pb-[5px] pl-[12px] mt-[0] mx-[0] mb-[10px] bg-[rgba(253,252,250,0.14)] [border:1px_solid_rgba(253,252,250,0.35)] backdrop-blur-[6px] rounded-[999px]">
                  <span className="text-[#FFB800] text-[12px] tracking-[1px]">★★★★★</span>
                  <span className="text-[10.5px] [font-weight:700] tracking-[0.08em] uppercase text-[#FCFAF6] whitespace-nowrap">1.000+ Pembeli</span>
                  <span className="flex">
                    <img src="/assets-c2/ava-1.webp" alt="" className="w-[19px] h-[19px] rounded-[999px] [border:1.5px_solid_rgba(253,252,250,0.8)] object-cover block"  loading="lazy" decoding="async" width="108" height="108" />
                    <img src="/assets-c2/ava-2.webp" alt="" className="w-[19px] h-[19px] ml-[-7px] rounded-[999px] [border:1.5px_solid_rgba(253,252,250,0.8)] object-cover block"  loading="lazy" decoding="async" width="108" height="108" />
                    <img src="/assets-c2/ava-3.webp" alt="" className="w-[19px] h-[19px] ml-[-7px] rounded-[999px] [border:1.5px_solid_rgba(253,252,250,0.8)] object-cover block"  loading="lazy" decoding="async" width="108" height="108" />
                  </span>
                </div>
                <h1 className="mt-[0] mx-[0] mb-[12px] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(24px,3vw,34px)] leading-[1.12] [font-weight:700] tracking-[-0.025em] text-[#FCFAF6] [text-shadow:0_2px_24px_rgba(0,0,0,0.55)] text-pretty">Gorden Custom Solo Raya, <span className="bg-[image:linear-gradient(to_top,rgba(224,169,59,0.85)_0.28em,transparent_0.28em)]">Terima Beres Ukur &amp; Pasang</span></h1>
                <p className="mt-[0] mx-[0] mb-[14px] text-[clamp(13.5px,1.3vw,15.5px)] text-[rgba(253,252,250,0.92)] [text-shadow:0_1px_16px_rgba(0,0,0,0.6)] text-pretty"><b className="text-[rgb(252,250,246)]">Takut salah ukur atau salah model?</b> Konsultasi langsung dengan owner, kami ukur dan pasang di tempat.</p>
                <div className="flex flex-wrap gap-[10px]">
                  <a href="https://wa.me/6285860525758?text=Halo%20saya%20mau%20pesan%20Gorden%20Custom%2C%2Cbisa%20survey%20ke%20lokasi%3F" target="_blank" rel="noopener noreferrer" className="flex-[1_1_210px] whitespace-nowrap flex items-center justify-center gap-[9px] min-h-[56px] py-[14px] px-[20px] bg-[#25D366] text-[#fff] text-[clamp(15px,3.9vw,17px)] [font-weight:700] tracking-[-0.01em] no-underline rounded-[12px] shadow-[0px_8px_20px_rgba(37,211,102,0.3)] hover:bg-[#1FBA57]"><img src="/assets-c2/whatsapp.svg" alt="" className="flex-none w-[20px] h-[20px] block [filter:brightness(0)_invert(1)]"  loading="lazy" decoding="async" />Konsultasi Gratis →</a>
                  <a href="#katalog" className="flex-[1_1_170px] whitespace-nowrap flex items-center justify-center min-h-[50px] py-[12px] px-[14px] bg-[rgba(252,250,246,0.1)] [border:2px_solid_#FCFAF6] text-[#FCFAF6] text-[clamp(15px,3.9vw,17px)] [font-weight:700] no-underline rounded-[12px] backdrop-blur-[4px] hover:bg-[rgba(252,250,246,0.22)]">Lihat Katalog →</a>
                </div>
                {showTrustBar ? (<>
                <div className="flex flex-wrap justify-start items-center gap-y-[4px] gap-x-[7px] mt-[12px] mx-[0] mb-[0] text-[clamp(11px,2.9vw,12.5px)] [font-weight:500] text-left text-[rgba(253,252,250,0.95)] [text-shadow:0_1px_14px_rgba(0,0,0,0.6)]">
                  <span className="flex items-center gap-[6px] whitespace-nowrap"><span className="text-[#FFB800] text-[13px] tracking-[1px]">★★★★★</span> <strong className="text-[#FCFAF6]">5,0</strong> Google Review</span>
                  <span className="text-[rgba(253,252,250,0.45)]">•</span>
                  <span className="whitespace-nowrap">Sejak 2012</span>
                  <span className="text-[rgba(253,252,250,0.45)]">•</span>
                  <span className="whitespace-nowrap">Garansi pemasangan 14 hari</span>
                </div>
                </>) : null}
              </div>
              <span aria-hidden="true" className="absolute left-[50%] [transform:translateX(-50%)] bottom-[clamp(16px,2.8vw,22px)] flex items-center justify-center w-[clamp(40px,9vw,54px)] h-[clamp(40px,9vw,54px)] bg-[rgba(253,252,250,0.16)] [border:1.5px_solid_rgba(253,252,250,0.7)] backdrop-blur-[6px] rounded-[999px] text-[#FCFAF6] [animation:omBob_1.6s_ease-in-out_infinite]">
                <span className="block text-[clamp(21px,5vw,30px)] leading-[1] [font-weight:700] mt-[-3px]">↓</span>
              </span>
            </div>
          </section>
      
          <section className="w-[100vw] ml-[calc(50%_-_50vw)] py-[clamp(40px,7vw,74px)] px-[0] bg-[#F2EDE3] [border-bottom:1px_solid_#E5DDCF]">
            <div className="max-w-[1000px] my-[0] mx-[auto] py-[0] px-[clamp(16px,4vw,20px)]">
              <p className="mt-[0] mx-[0] mb-[10px] text-[11px] [font-weight:600] tracking-[0.22em] uppercase text-[#96876C]">Tahukah kamu?</p>
              <h2 className="mt-[0] mx-[0] mb-[12px] max-w-[26ch] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(25px,5.9vw,38px)] leading-[1.14] [font-weight:700] tracking-[-0.03em] text-[#221F1A] text-pretty">Jangan pilih gorden hanya karena bagus di foto</h2>
              <p className="mt-[0] mx-[0] mb-[clamp(22px,4vw,32px)] max-w-[56ch] text-[clamp(15px,4vw,17.5px)] leading-[1.55] text-[#585045] text-pretty">Banyak yang tergiur gorden murah karena fotonya bagus, tapi warna dan ukurannya ternyata tidak cocok di rumah sendiri.</p>
      
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,290px),1fr))] gap-[clamp(12px,2.5vw,18px)] items-stretch">
                <div className="flex flex-col py-[clamp(20px,4vw,28px)] px-[clamp(18px,3.6vw,26px)] bg-[#FCFAF6] [border:1px_solid_#E5DDCF] rounded-[4px]">
                  <p className="mt-[0] mx-[0] mb-[16px] text-[clamp(16px,4.2vw,19px)] [font-weight:600] tracking-[-0.02em] text-[#877E6D]">Kalau langsung beli</p>
                  <ul className="mt-[0] mx-[0] mb-[18px] p-[0] list-none">
                  <li className="flex gap-[11px] items-baseline mt-[0] mx-[0] mb-[11px]">
                    <span className="flex-none [font-family:IBM_Plex_Mono,ui-monospace,monospace] text-[11.5px] text-[#A79B85]">01</span>
                    <span className="text-[clamp(14.5px,3.8vw,16px)] leading-[1.45] text-[#585045] text-pretty">Pilih dari foto katalog.</span>
                  </li>
                  <li className="flex gap-[11px] items-baseline mt-[0] mx-[0] mb-[11px]">
                    <span className="flex-none [font-family:IBM_Plex_Mono,ui-monospace,monospace] text-[11.5px] text-[#A79B85]">02</span>
                    <span className="text-[clamp(14.5px,3.8vw,16px)] leading-[1.45] text-[#585045] text-pretty">Tebak warna dan ukuran.</span>
                  </li>
                  <li className="flex gap-[11px] items-baseline mt-[0] mx-[0] mb-[0]">
                    <span className="flex-none [font-family:IBM_Plex_Mono,ui-monospace,monospace] text-[11.5px] text-[#A79B85]">03</span>
                    <span className="text-[clamp(14.5px,3.8vw,16px)] leading-[1.45] text-[#585045] text-pretty">Hasilnya kurang pas.</span>
                  </li>
                  </ul>
                  <p className="mt-[auto] mx-[0] mb-[0] pt-[15px] px-[0] pb-[0] [border-top:1px_solid_#EDE6DA] text-[clamp(14.5px,3.9vw,16px)] leading-[1.45] [font-weight:500] text-[#6F6757]">Hemat sekali, nyesek tiap hari.</p>
                </div>
      
                <div className="flex flex-col py-[clamp(20px,4vw,28px)] px-[clamp(18px,3.6vw,26px)] bg-[#23201B] [border:1px_solid_#23201B] rounded-[4px]">
                  <p className="mt-[0] mx-[0] mb-[16px] text-[clamp(16px,4.2vw,19px)] [font-weight:600] tracking-[-0.02em] text-[#FCFAF6]">Kalau tanya dulu ke owner</p>
                  <ul className="mt-[0] mx-[0] mb-[18px] p-[0] list-none">
                  <li className="flex gap-[11px] items-baseline mt-[0] mx-[0] mb-[11px]">
                    <span className="flex-none [font-family:IBM_Plex_Mono,ui-monospace,monospace] text-[11.5px] text-[rgba(252,250,246,0.5)]">01</span>
                    <span className="text-[clamp(14.5px,3.8vw,16px)] leading-[1.45] text-[rgba(252,250,246,0.92)] text-pretty">Cerita kebutuhan ke owner.</span>
                  </li>
                  <li className="flex gap-[11px] items-baseline mt-[0] mx-[0] mb-[11px]">
                    <span className="flex-none [font-family:IBM_Plex_Mono,ui-monospace,monospace] text-[11.5px] text-[rgba(252,250,246,0.5)]">02</span>
                    <span className="text-[clamp(14.5px,3.8vw,16px)] leading-[1.45] text-[rgba(252,250,246,0.92)] text-pretty">Kami survey dan ukur.</span>
                  </li>
                  <li className="flex gap-[11px] items-baseline mt-[0] mx-[0] mb-[0]">
                    <span className="flex-none [font-family:IBM_Plex_Mono,ui-monospace,monospace] text-[11.5px] text-[rgba(252,250,246,0.5)]">03</span>
                    <span className="text-[clamp(14.5px,3.8vw,16px)] leading-[1.45] text-[rgba(252,250,246,0.92)] text-pretty">Terpasang dan memang pas.</span>
                  </li>
                  </ul>
                  <p className="mt-[auto] mx-[0] mb-[0] pt-[15px] px-[0] pb-[0] [border-top:1px_solid_rgba(252,250,246,0.18)] text-[clamp(14.5px,3.9vw,16px)] leading-[1.45] [font-weight:500] text-[#FCFAF6]">Dipilih untuk rumah Anda, bukan untuk foto katalog.</p>
                </div>
              </div>
      
              <figure data-zoom="/assets-c2/p14-box-glossy-permata-mayang.webp"  className="mt-[clamp(12px,2.5vw,18px)] mx-[0] mb-[0] relative aspect-[16/9] rounded-[4px] overflow-hidden bg-[#EDE7DA] bg-[size:cover] bg-[position:center] cursor-zoom-in" style={{ backgroundImage: "url('/assets-c2/p14-box-glossy-permata-mayang.webp')" }}>
                <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.7)_100%)]"></div>
                <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[16px] px-[18px] pb-[15px] text-[#FCFAF6]">
                  <span className="block text-[clamp(14px,3.7vw,16px)] [font-weight:600] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Hasil yang dipilih bareng owner</span>
                  <span className="block mt-[2px] text-[12px] text-[rgba(252,250,246,0.84)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">Box custom glossy · Permata Mayang</span>
                </figcaption>
              </figure>
      
              <div className="mt-[clamp(14px,2.6vw,20px)] mx-[0] mb-[0] p-[clamp(16px,3.2vw,22px)] bg-[#FCFAF6] [border:1px_solid_#E5DDCF] rounded-[4px]">
                <p className="mt-[0] mx-[0] mb-[6px] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(16px,4.2vw,19px)] [font-weight:700] tracking-[-0.02em] text-[#221F1A]">Belum tahu budget yang dibutuhkan?</p>
                <p className="m-[0] max-w-[54ch] text-[clamp(14px,3.8vw,16px)] leading-[1.55] text-[#585045] text-pretty">Kirim foto jendela Anda. Owner akan membantu memilih model sekaligus memberikan estimasi sesuai ukuran dan budget.</p>
              </div>
      
              <div className="mt-[clamp(16px,3vw,22px)] mx-[0] mb-[0]">
                <div className="flex flex-col items-stretch gap-[10px]">
                  <a href="https://wa.me/6285860525758?text=Halo%20saya%20mau%20pesan%20Gorden%20Custom%2C%2Cbisa%20survey%20ke%20lokasi%3F" target="_blank" rel="noopener noreferrer" className="flex-[1_1_100%] whitespace-nowrap flex items-center justify-center gap-[9px] min-h-[56px] py-[14px] px-[20px] bg-[#25D366] text-[#fff] text-[clamp(15px,3.9vw,17px)] [font-weight:700] tracking-[-0.01em] no-underline rounded-[12px] shadow-[0px_8px_20px_rgba(37,211,102,0.3)] hover:bg-[#1EBE5B]"><img src="/assets-c2/whatsapp.svg" alt="" className="flex-none w-[20px] h-[20px] block [filter:brightness(0)_invert(1)]"  loading="lazy" decoding="async" />Konsultasi Gratis <span className="opacity-[0.85]">→</span></a>
                <p className="m-[0] text-center text-[clamp(12.5px,3.3vw,13.5px)] leading-[1.45] text-[#6F6757]">Chat langsung dibalas owner, gratis dan tanpa wajib memesan.</p>
                </div>
                <div className="flex flex-wrap justify-center items-center gap-y-[5px] gap-x-[10px] mt-[12px] mx-[0] mb-[0] text-[clamp(11.5px,3vw,12.5px)] [font-weight:500] text-center text-[#3C3529]">
                  <span className="flex items-center gap-[6px] whitespace-nowrap"><span className="text-[#FFB800] text-[13px] tracking-[1px]">★★★★★</span> <strong className="text-[#221F1A] [font-weight:600]">5,0</strong> Google Review</span>
                  <span className="opacity-[0.45]">•</span>
                  <span className="whitespace-nowrap">1.000+ pembeli</span>
                  <span className="opacity-[0.45]">•</span>
                  <span className="whitespace-nowrap">Garansi pemasangan 14 hari</span>
                </div>
              </div>
            </div>
          </section>
      
          <section className="w-[100vw] ml-[calc(50%_-_50vw)] py-[clamp(40px,7vw,72px)] px-[0] bg-[#FAF7F1]">
            <div className="max-w-[1000px] my-[0] mx-[auto] py-[0] px-[clamp(16px,4vw,20px)]">
              <div className="text-center mt-[0] mx-[0] mb-[clamp(18px,3.4vw,26px)]">
                <p className="mt-[0] mx-[0] mb-[10px] text-[11px] [font-weight:600] tracking-[0.22em] uppercase text-[#96876C]">Hasil pemasangan nyata</p>
                <h2 className="mt-[0] mx-[auto] mb-[8px] max-w-[24ch] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(23px,5.6vw,34px)] leading-[1.16] [font-weight:700] tracking-[-0.03em] text-[#221F1A] text-pretty">Bukan cuma bagus di katalog</h2>
                <p className="my-[0] mx-[auto] max-w-[48ch] text-[clamp(14px,3.8vw,16.5px)] leading-[1.55] text-[#585045] text-pretty">Lihat hasilnya setelah dipasang di rumah pelanggan.</p>
                <div className="flex flex-wrap justify-center items-center gap-y-[5px] gap-x-[10px] mt-[14px] mx-[0] mb-[0] text-[12.5px] text-[#4F4840]">
                  <span className="flex items-center gap-[6px] whitespace-nowrap"><span className="text-[#FFB800] tracking-[1px]">★★★★★</span><strong className="text-[#221F1A]">5,0</strong> Google Review</span>
                  <span className="opacity-[0.5]">•</span>
                  <span className="whitespace-nowrap">1.000+ pembeli</span>
                  <span className="opacity-[0.5]">•</span>
                  <span className="whitespace-nowrap">Garansi pemasangan 14 hari</span>
                </div>
              </div>
      
              {!isNarrow ? (<>
              <div className="grid grid-cols-[1.85fr_1fr] [grid-template-rows:1fr_1fr] gap-[10px] items-stretch">
                <div className="[grid-row:span_2] flex">
                <figure data-zoom="/assets-c2/p05-box-full-plafon-wonosari.webp"  className="m-[0] flex-[1_1_auto] relative aspect-[4/3] overflow-hidden rounded-[6px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center] cursor-zoom-in" style={{ backgroundImage: "url('/assets-c2/p05-box-full-plafon-wonosari.webp')" }}>
                  <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_48%,rgba(28,25,21,0.72)_100%)]"></div>
                  <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[20px] px-[20px] pb-[18px] text-[#FCFAF6]">
                    <span className="block text-[clamp(17px,2.2vw,21px)] [font-weight:600] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Ruangan Terlihat Lebih Tinggi</span>
                    <span className="block mt-[3px] text-[13px] text-[rgba(252,250,246,0.84)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">Box custom full plafon · Wonosari, Klaten</span>
                  </figcaption>
                </figure>
                </div>
                <figure data-zoom="/assets-c2/p17-kaca-besar-tawangsari.webp"  className="m-[0] relative min-h-[0] overflow-hidden rounded-[6px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center] cursor-zoom-in" style={{ backgroundImage: "url('/assets-c2/p17-kaca-besar-tawangsari.webp')" }}>
                  <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_48%,rgba(28,25,21,0.72)_100%)]"></div>
                  <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[14px] px-[14px] pb-[13px] text-[#FCFAF6]">
                    <span className="block text-[15px] [font-weight:600] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Lebih Rapi Tanpa Rel Terlihat</span>
                    <span className="block mt-[3px] text-[12px] text-[rgba(252,250,246,0.84)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">Hidden rail · Tawangsari, Sukoharjo</span>
                  </figcaption>
                </figure>
                <figure data-zoom="/assets-c2/p01-hidden-rail-klodran.webp"  className="m-[0] relative min-h-[0] overflow-hidden rounded-[6px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center] cursor-zoom-in" style={{ backgroundImage: "url('/assets-c2/p01-hidden-rail-klodran.webp')" }}>
                  <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_48%,rgba(28,25,21,0.72)_100%)]"></div>
                  <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[14px] px-[14px] pb-[13px] text-[#FCFAF6]">
                    <span className="block text-[15px] [font-weight:600] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Tidur Lebih Nyaman dan Gelap</span>
                    <span className="block mt-[3px] text-[12px] text-[rgba(252,250,246,0.84)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">Blackout 100% · Klodran, Colomadu</span>
                  </figcaption>
                </figure>
              </div>
              </>) : null}
      
              {isNarrow ? (<>
              <div className="grid gap-[8px]">
                <figure data-zoom="/assets-c2/p05-box-full-plafon-wonosari.webp"  className="m-[0] relative aspect-[4/3] overflow-hidden rounded-[6px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center] cursor-zoom-in" style={{ backgroundImage: "url('/assets-c2/p05-box-full-plafon-wonosari.webp')" }}>
                  <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_48%,rgba(28,25,21,0.72)_100%)]"></div>
                  <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[16px] px-[15px] pb-[14px] text-[#FCFAF6]">
                    <span className="block text-[clamp(16px,4.4vw,19px)] [font-weight:600] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Ruangan Terlihat Lebih Tinggi</span>
                    <span className="block mt-[3px] text-[12.5px] text-[rgba(252,250,246,0.84)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">Box custom full plafon · Wonosari, Klaten</span>
                  </figcaption>
                </figure>
                <div className="grid grid-cols-[repeat(3,1fr)] gap-[8px]">
                <figure data-zoom="/assets-c2/p17-kaca-besar-tawangsari.webp"  className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[6px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center] cursor-zoom-in" style={{ backgroundImage: "url('/assets-c2/p17-kaca-besar-tawangsari.webp')" }}>
                  <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_48%,rgba(28,25,21,0.72)_100%)]"></div>
                  <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[10px] px-[9px] pb-[9px] text-[#FCFAF6]">
                    <span className="block text-[12px] [font-weight:600] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Lebih Rapi Tanpa Rel Terlihat</span>
                  </figcaption>
                </figure>
                <figure data-zoom="/assets-c2/p01-hidden-rail-klodran.webp"  className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[6px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center] cursor-zoom-in" style={{ backgroundImage: "url('/assets-c2/p01-hidden-rail-klodran.webp')" }}>
                  <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_48%,rgba(28,25,21,0.72)_100%)]"></div>
                  <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[10px] px-[9px] pb-[9px] text-[#FCFAF6]">
                    <span className="block text-[12px] [font-weight:600] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Tidur Lebih Nyaman dan Gelap</span>
                  </figcaption>
                </figure>
                <figure data-zoom="/assets-c2/p12-villa-the-ponggok.webp"  className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[6px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center] cursor-zoom-in" style={{ backgroundImage: "url('/assets-c2/p12-villa-the-ponggok.webp')" }}>
                  <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_48%,rgba(28,25,21,0.72)_100%)]"></div>
                  <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[10px] px-[9px] pb-[9px] text-[#FCFAF6]">
                    <span className="block text-[12px] [font-weight:600] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Terasa Seperti Kamar Hotel</span>
                  </figcaption>
                </figure>
                </div>
              </div>
              </>) : null}
      
              <div className="flex justify-center mt-[clamp(18px,3.2vw,26px)] mx-[0] mb-[0]">
                <a href="https://wa.me/6285860525758?text=Halo%20saya%20mau%20pesan%20Gorden%20Custom%2C%2Cbisa%20survey%20ke%20lokasi%3F" target="_blank" rel="noopener noreferrer" className="flex-[0_1_380px] flex items-center justify-center gap-[9px] min-h-[56px] py-[14px] px-[20px] bg-[#25D366] text-[#fff] text-[clamp(15px,3.9vw,17px)] [font-weight:700] tracking-[-0.01em] no-underline rounded-[12px] shadow-[0px_8px_20px_rgba(37,211,102,0.3)] hover:bg-[#1FBA57]"><img src="/assets-c2/whatsapp.svg" alt="" className="flex-none w-[20px] h-[20px] block [filter:brightness(0)_invert(1)]"  loading="lazy" decoding="async" />Konsultasi Gratis →</a>
              </div>
            </div>
          </section>
      
          <section className="py-[clamp(46px,8vw,78px)] px-[0] [border-top:1px_solid_#EDE6DA]">
            <div className="text-center mt-[0] mx-[0] mb-[clamp(16px,3vw,22px)]">
              <p className="mt-[0] mx-[0] mb-[10px] text-[11px] [font-weight:600] tracking-[0.22em] uppercase text-[#96876C]">Lihat perubahannya</p>
              <h2 className="my-[0] mx-[auto] max-w-[28ch] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(22px,5.6vw,34px)] leading-[1.16] [font-weight:700] tracking-[-0.03em] text-[#221F1A] text-pretty">Dari ruangan biasa menjadi lebih rapi dan nyaman</h2>
            </div>
            <div className="m-[0] py-[18px] px-[16px] bg-[#F2EDE3] [border:1px_solid_#E5DDCF] rounded-[20px]">
              <div className="grid grid-cols-[1fr_1fr] gap-[clamp(10px,2.4vw,14px)]">
                <figure data-zoom="/assets-c2/before-gorden.webp" className="m-[0]">
                  <div  className="relative aspect-[3/4] rounded-[16px] [border:1px_solid_#DCD3C1] bg-[size:cover] bg-[position:center] overflow-hidden cursor-zoom-in" style={{ backgroundImage: "url('/assets-c2/before-gorden.webp')" }}>
                    <span className="absolute top-[12px] left-[12px] py-[6px] px-[14px] bg-[#FCFAF6] text-[#5d5546] text-[12px] [font-weight:700] tracking-[0.1em] uppercase rounded-[999px] shadow-[0_4px_12px_-4px_rgba(0,0,0,0.35)]">Sebelum</span>
                  </div>
                </figure>
                <figure data-zoom="/assets-c2/after-gorden.webp" className="m-[0]">
                  <div  className="relative aspect-[3/4] rounded-[16px] [border:1px_solid_#DCD3C1] bg-[size:cover] bg-[position:center] overflow-hidden cursor-zoom-in" style={{ backgroundImage: "url('/assets-c2/after-gorden.webp')" }}>
                    <span className="absolute top-[12px] left-[12px] py-[6px] px-[14px] bg-[#6E6553] text-[#fff] text-[12px] [font-weight:700] tracking-[0.1em] uppercase rounded-[999px] shadow-[0_4px_12px_-4px_rgba(0,0,0,0.35)]">Sesudah</span>
                  </div>
                </figure>
              </div>
              <p className="mt-[14px] mx-[0] mb-[0] text-center text-[clamp(13px,3.5vw,14.5px)] leading-[1.5] text-[#585045] text-pretty">Lebih rapi, lebih tinggi, dan sesuai konsep ruangan. Direkomendasikan langsung oleh owner berdasarkan kondisi ruangannya.</p>
            </div>
      
            <div className="mt-[26px] mx-[0] mb-[0]">
              <div className="flex flex-col items-stretch gap-[10px]">
                <a href="https://wa.me/6285860525758?text=Halo%20saya%20mau%20pesan%20Gorden%20Custom%2C%2Cbisa%20survey%20ke%20lokasi%3F" target="_blank" rel="noopener noreferrer" className="flex-[1_1_100%] flex items-center justify-center gap-[9px] min-h-[56px] py-[14px] px-[20px] bg-[#25D366] text-[#fff] text-[clamp(15px,3.9vw,17px)] [font-weight:700] tracking-[-0.01em] no-underline rounded-[12px] shadow-[0px_8px_20px_rgba(37,211,102,0.3)] hover:bg-[#1FBA57]"><img src="/assets-c2/whatsapp.svg" alt="" className="flex-none w-[20px] h-[20px] block [filter:brightness(0)_invert(1)]"  loading="lazy" decoding="async" />Konsultasi Gratis →</a>
                <p className="m-[0] text-center text-[clamp(12.5px,3.3vw,13.5px)] leading-[1.45] text-[#6F6757]">Chat langsung dibalas owner, gratis dan tanpa wajib memesan.</p>
                <a href="#katalog" className="self-center inline-flex items-center gap-[6px] min-h-[30px] py-[2px] px-[0] bg-transparent border-0 text-[#585045] text-[clamp(13.5px,3.5vw,15px)] [font-weight:500] [text-decoration:underline] [text-underline-offset:4px] [text-decoration-color:#C7BBA2] hover:text-[#221F1A] hover:[text-decoration-color:#6E6553]">Lihat katalog model dulu</a>
              </div>
              <div className="flex flex-wrap justify-center items-center gap-y-[5px] gap-x-[10px] mt-[12px] mx-[0] mb-[0] text-[clamp(11.5px,3vw,12.5px)] [font-weight:500] text-center text-[#3C3529]">
                <span className="text-[#FFB800] tracking-[1px]">★★★★★</span><strong className="text-[#221F1A]">5,0</strong><span>Google Review</span><span className="opacity-[0.5]">•</span><span>1.000+ pembeli</span><span className="opacity-[0.5]">•</span><span>Garansi pemasangan 14 hari</span>
              </div>
            </div>
          </section>
      
          <section id="katalog" className="py-[clamp(46px,8vw,78px)] px-[0] [border-top:1px_solid_#EDE6DA] scroll-mt-[76px]">
            <p className="mt-[0] mx-[0] mb-[10px] text-[11px] [font-weight:600] tracking-[0.22em] uppercase text-[#96876C]">Katalog model</p>
            <h2 className="mt-[0] mx-[0] mb-[8px] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(22px,5.6vw,34px)] leading-[1.16] [font-weight:600] tracking-[-0.03em]">Model yang bisa Anda pilih untuk ruangan itu</h2>
            <p className="mt-[0] mx-[0] mb-[24px] text-[#585045] max-w-[62ch]">Semua dibuat sesuai ukuran jendela Anda. Belum tahu yang cocok? Kami bantu pilihkan saat survey.</p>
            <div id="katalog-filter" className="sticky top-[68px] z-[20] mt-[0] mx-[0] mb-[18px] py-[10px] px-[0] bg-[#FCFAF6] [border-bottom:1px_solid_#ECE5D9]">
              {isNarrow ? (<>
                  <select onChange={onPickCatSelect} value={katCat} aria-label="Pilih kategori model" className="w-full min-h-[48px] py-[12px] px-[14px] rounded-[12px] [border:1.5px_solid_#CFC5B0] bg-[#FCFAF6] [font-family:Poppins,Helvetica,sans-serif] text-[15px] [font-weight:600] text-[#3a352c]">
                    <option value="semua">Semua model (13)</option>
                    <option value="kain">Gorden kain (6)</option>
                    <option value="blinds">Blinds (5)</option>
                    <option value="lain">Wallpaper &amp; pelengkap (2)</option>
                  </select>
              </>) : null}
              {!isNarrow ? (<>
                  <div className="flex flex-nowrap gap-[20px] overflow-x-auto pt-[2px] [scrollbar-width:none]">
                    <button type="button" onClick={() => pickCat('semua')} className={`min-h-[38px] py-[8px] px-[2px] border-0 border-b-2 bg-transparent [font-family:Poppins,Helvetica,sans-serif] text-[14px] [font-weight:500] cursor-pointer whitespace-nowrap flex-none ${katCat === 'semua' ? 'border-b-[#6E6553] text-[#221F1A]' : 'border-b-transparent text-[#877E6D]'}`}>Semua model <span className="opacity-[0.5] [font-weight:400]">13</span></button>
                    <button type="button" onClick={() => pickCat('kain')} className={`min-h-[38px] py-[8px] px-[2px] border-0 border-b-2 bg-transparent [font-family:Poppins,Helvetica,sans-serif] text-[14px] [font-weight:500] cursor-pointer whitespace-nowrap flex-none ${katCat === 'kain' ? 'border-b-[#6E6553] text-[#221F1A]' : 'border-b-transparent text-[#877E6D]'}`}>Gorden kain <span className="opacity-[0.5] [font-weight:400]">6</span></button>
                    <button type="button" onClick={() => pickCat('blinds')} className={`min-h-[38px] py-[8px] px-[2px] border-0 border-b-2 bg-transparent [font-family:Poppins,Helvetica,sans-serif] text-[14px] [font-weight:500] cursor-pointer whitespace-nowrap flex-none ${katCat === 'blinds' ? 'border-b-[#6E6553] text-[#221F1A]' : 'border-b-transparent text-[#877E6D]'}`}>Blinds <span className="opacity-[0.5] [font-weight:400]">5</span></button>
                    <button type="button" onClick={() => pickCat('lain')} className={`min-h-[38px] py-[8px] px-[2px] border-0 border-b-2 bg-transparent [font-family:Poppins,Helvetica,sans-serif] text-[14px] [font-weight:500] cursor-pointer whitespace-nowrap flex-none ${katCat === 'lain' ? 'border-b-[#6E6553] text-[#221F1A]' : 'border-b-transparent text-[#877E6D]'}`}>Wallpaper &amp; pelengkap <span className="opacity-[0.5] [font-weight:400]">2</span></button>
                  </div>
              </>) : null}</div>
            {showKain ? (<>
              <div className="mt-[0] mx-[0] mb-[0]">
                <h3 className="mt-[0] mx-[0] mb-[14px] [font-family:Poppins,Helvetica,sans-serif] text-[13px] [font-weight:700] tracking-[0.1em] uppercase text-[#877E6D]">Gorden kain</h3>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(min(48%,240px),1fr))] gap-y-[14px] gap-x-[8px] [align-items:start]">
                  <div className="flex flex-col">
                    <figure  className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center]" style={{ backgroundImage: "url('/assets-c2/img-gorden-sala3-1152x1536.webp')" }}>
                      <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                      <span className="absolute top-[10px] left-[10px] py-[5px] px-[10px] bg-[rgba(252,250,246,0.94)] text-[#221F1A] text-[11px] [font-weight:600] rounded-[999px] whitespace-nowrap leading-[1.2]">🔥 Best Seller</span>
                      <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[14px] px-[12px] pb-[12px] text-[#FCFAF6]">
                        <span className="block text-[clamp(14.5px,3.8vw,17px)] [font-weight:500] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Gorden Minimalis</span>
                        <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="text-[#FFB800]">★</span> 4,9 · 312 pembeli</span>
                      </figcaption>
                    </figure>
                    <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20tanya%20harga%20dan%20spesifikasi%20Gorden%20Minimalis." target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-[6px] mt-[8px] mx-[0] mb-[0] min-h-[44px] py-[9px] px-[8px] bg-[#FCFAF6] [border:1.5px_solid_#DCD3C1] text-[#221F1A] text-[12.5px] [font-weight:600] no-underline rounded-[8px] leading-[1.25] text-center hover:bg-[#F2EDE3] hover:border-[#6E6553]"><img src="/assets-c2/whatsapp.svg" alt="" className="flex-none w-[15px] h-[15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]"  loading="lazy" decoding="async" />Tanya harga &amp; spesifikasi</a>
                  </div>
                  <div className="flex flex-col">
                    <figure  className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center]" style={{ backgroundImage: "url('/assets-c2/img-gorden-custom.webp')" }}>
                      <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                      <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[14px] px-[12px] pb-[12px] text-[#FCFAF6]">
                        <span className="block text-[clamp(14.5px,3.8vw,17px)] [font-weight:500] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Gorden Custom</span>
                        <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="text-[#FFB800]">★</span> 5,0 · 186 pembeli</span>
                      </figcaption>
                    </figure>
                    <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20tanya%20harga%20dan%20spesifikasi%20Gorden%20Custom." target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-[6px] mt-[8px] mx-[0] mb-[0] min-h-[44px] py-[9px] px-[8px] bg-[#FCFAF6] [border:1.5px_solid_#DCD3C1] text-[#221F1A] text-[12.5px] [font-weight:600] no-underline rounded-[8px] leading-[1.25] text-center hover:bg-[#F2EDE3] hover:border-[#6E6553]"><img src="/assets-c2/whatsapp.svg" alt="" className="flex-none w-[15px] h-[15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]"  loading="lazy" decoding="async" />Tanya harga &amp; spesifikasi</a>
                  </div>
                  <div className="flex flex-col">
                    <figure  className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center]" style={{ backgroundImage: "url('/assets-c2/kat-vitrase.webp')" }}>
                      <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                      <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[14px] px-[12px] pb-[12px] text-[#FCFAF6]">
                        <span className="block text-[clamp(14.5px,3.8vw,17px)] [font-weight:500] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Gorden Siang &amp; Vitrase</span>
                        <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="text-[#FFB800]">★</span> 4,8 · 197 pembeli</span>
                      </figcaption>
                    </figure>
                    <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20tanya%20harga%20dan%20spesifikasi%20Gorden%20Siang%20%26%20Vitrase." target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-[6px] mt-[8px] mx-[0] mb-[0] min-h-[44px] py-[9px] px-[8px] bg-[#FCFAF6] [border:1.5px_solid_#DCD3C1] text-[#221F1A] text-[12.5px] [font-weight:600] no-underline rounded-[8px] leading-[1.25] text-center hover:bg-[#F2EDE3] hover:border-[#6E6553]"><img src="/assets-c2/whatsapp.svg" alt="" className="flex-none w-[15px] h-[15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]"  loading="lazy" decoding="async" />Tanya harga &amp; spesifikasi</a>
                  </div>
                    <div className="flex flex-col">
                    <figure  className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center]" style={{ backgroundImage: "url('/assets-c2/img-gorden-kupu-1.webp')" }}>
                      <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                      <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[14px] px-[12px] pb-[12px] text-[#FCFAF6]">
                        <span className="block text-[clamp(14.5px,3.8vw,17px)] [font-weight:500] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Gorden Kupu-Kupu</span>
                        <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="text-[#FFB800]">★</span> 4,6 · 94 pembeli</span>
                      </figcaption>
                    </figure>
                    <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20tanya%20harga%20dan%20spesifikasi%20Gorden%20Kupu-Kupu." target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-[6px] mt-[8px] mx-[0] mb-[0] min-h-[44px] py-[9px] px-[8px] bg-[#FCFAF6] [border:1.5px_solid_#DCD3C1] text-[#221F1A] text-[12.5px] [font-weight:600] no-underline rounded-[8px] leading-[1.25] text-center hover:bg-[#F2EDE3] hover:border-[#6E6553]"><img src="/assets-c2/whatsapp.svg" alt="" className="flex-none w-[15px] h-[15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]"  loading="lazy" decoding="async" />Tanya harga &amp; spesifikasi</a>
                  </div>
                    <div className="flex flex-col">
                    <figure  className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center]" style={{ backgroundImage: "url('/assets-c2/img-gorden-hotel-apartemen.webp')" }}>
                      <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                      <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[14px] px-[12px] pb-[12px] text-[#FCFAF6]">
                        <span className="block text-[clamp(14.5px,3.8vw,17px)] [font-weight:500] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Gorden Hotel &amp; Apartemen</span>
                        <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="text-[#FFB800]">★</span> 4,9 · 63 pembeli</span>
                      </figcaption>
                    </figure>
                    <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20tanya%20harga%20dan%20spesifikasi%20Gorden%20Hotel%20%26%20Apartemen." target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-[6px] mt-[8px] mx-[0] mb-[0] min-h-[44px] py-[9px] px-[8px] bg-[#FCFAF6] [border:1.5px_solid_#DCD3C1] text-[#221F1A] text-[12.5px] [font-weight:600] no-underline rounded-[8px] leading-[1.25] text-center hover:bg-[#F2EDE3] hover:border-[#6E6553]"><img src="/assets-c2/whatsapp.svg" alt="" className="flex-none w-[15px] h-[15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]"  loading="lazy" decoding="async" />Tanya harga &amp; spesifikasi</a>
                  </div>
                    <div className="flex flex-col">
                    <figure  className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center]" style={{ backgroundImage: "url('/assets-c2/img-gorden-rumah-sakit-rso-orthopedi-surakar.webp')" }}>
                      <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                      <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[14px] px-[12px] pb-[12px] text-[#FCFAF6]">
                        <span className="block text-[clamp(14.5px,3.8vw,17px)] [font-weight:500] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Tirai Area Publik</span>
                        <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="text-[#FFB800]">★</span> 4,9 · 54 pembeli</span>
                      </figcaption>
                    </figure>
                    <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20tanya%20harga%20dan%20spesifikasi%20Tirai%20Area%20Publik." target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-[6px] mt-[8px] mx-[0] mb-[0] min-h-[44px] py-[9px] px-[8px] bg-[#FCFAF6] [border:1.5px_solid_#DCD3C1] text-[#221F1A] text-[12.5px] [font-weight:600] no-underline rounded-[8px] leading-[1.25] text-center hover:bg-[#F2EDE3] hover:border-[#6E6553]"><img src="/assets-c2/whatsapp.svg" alt="" className="flex-none w-[15px] h-[15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]"  loading="lazy" decoding="async" />Tanya harga &amp; spesifikasi</a>
                  </div>
                  </div>
              </div>
            </>) : null}
            {showBlinds ? (<>
              <div className="mt-[30px] mx-[0] mb-[0]">
                <h3 className="mt-[0] mx-[0] mb-[14px] [font-family:Poppins,Helvetica,sans-serif] text-[13px] [font-weight:700] tracking-[0.1em] uppercase text-[#877E6D]">Blinds</h3>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(min(48%,240px),1fr))] gap-y-[14px] gap-x-[8px] [align-items:start]">
                  <div className="flex flex-col">
                    <figure  className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center]" style={{ backgroundImage: "url('/assets-c2/img-roller-blinds-untuk-kantor-1152x1536.webp')" }}>
                      <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                      <span className="absolute top-[10px] left-[10px] py-[5px] px-[10px] bg-[rgba(252,250,246,0.94)] text-[#221F1A] text-[11px] [font-weight:600] rounded-[999px] whitespace-nowrap leading-[1.2]">🏢 Favorit Kantor</span>
                      <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[14px] px-[12px] pb-[12px] text-[#FCFAF6]">
                        <span className="block text-[clamp(14.5px,3.8vw,17px)] [font-weight:500] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Roller Blinds</span>
                        <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="text-[#FFB800]">★</span> 4,8 · 241 pembeli</span>
                      </figcaption>
                    </figure>
                    <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20tanya%20harga%20dan%20spesifikasi%20Roller%20Blinds." target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-[6px] mt-[8px] mx-[0] mb-[0] min-h-[44px] py-[9px] px-[8px] bg-[#FCFAF6] [border:1.5px_solid_#DCD3C1] text-[#221F1A] text-[12.5px] [font-weight:600] no-underline rounded-[8px] leading-[1.25] text-center hover:bg-[#F2EDE3] hover:border-[#6E6553]"><img src="/assets-c2/whatsapp.svg" alt="" className="flex-none w-[15px] h-[15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]"  loading="lazy" decoding="async" />Tanya harga &amp; spesifikasi</a>
                  </div>
                  <div className="flex flex-col">
                    <figure  className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center]" style={{ backgroundImage: "url('/assets-c2/img-zebra-blinds.webp')" }}>
                      <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                      <span className="absolute top-[10px] left-[10px] py-[5px] px-[10px] bg-[rgba(252,250,246,0.94)] text-[#221F1A] text-[11px] [font-weight:600] rounded-[999px] whitespace-nowrap leading-[1.2]">⭐ Terlaris</span>
                      <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[14px] px-[12px] pb-[12px] text-[#FCFAF6]">
                        <span className="block text-[clamp(14.5px,3.8vw,17px)] [font-weight:500] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Zebra Blinds</span>
                        <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="text-[#FFB800]">★</span> 4,8 · 268 pembeli</span>
                      </figcaption>
                    </figure>
                    <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20tanya%20harga%20dan%20spesifikasi%20Zebra%20Blinds." target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-[6px] mt-[8px] mx-[0] mb-[0] min-h-[44px] py-[9px] px-[8px] bg-[#FCFAF6] [border:1.5px_solid_#DCD3C1] text-[#221F1A] text-[12.5px] [font-weight:600] no-underline rounded-[8px] leading-[1.25] text-center hover:bg-[#F2EDE3] hover:border-[#6E6553]"><img src="/assets-c2/whatsapp.svg" alt="" className="flex-none w-[15px] h-[15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]"  loading="lazy" decoding="async" />Tanya harga &amp; spesifikasi</a>
                  </div>
                  <div className="flex flex-col">
                    <figure  className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center]" style={{ backgroundImage: "url('/assets-c2/img-vertikal-blinds.webp')" }}>
                      <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                      <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[14px] px-[12px] pb-[12px] text-[#FCFAF6]">
                        <span className="block text-[clamp(14.5px,3.8vw,17px)] [font-weight:500] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Vertikal Blinds</span>
                        <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="text-[#FFB800]">★</span> 4,7 · 152 pembeli</span>
                      </figcaption>
                    </figure>
                    <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20tanya%20harga%20dan%20spesifikasi%20Vertikal%20Blinds." target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-[6px] mt-[8px] mx-[0] mb-[0] min-h-[44px] py-[9px] px-[8px] bg-[#FCFAF6] [border:1.5px_solid_#DCD3C1] text-[#221F1A] text-[12.5px] [font-weight:600] no-underline rounded-[8px] leading-[1.25] text-center hover:bg-[#F2EDE3] hover:border-[#6E6553]"><img src="/assets-c2/whatsapp.svg" alt="" className="flex-none w-[15px] h-[15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]"  loading="lazy" decoding="async" />Tanya harga &amp; spesifikasi</a>
                  </div>
                    <div className="flex flex-col">
                    <figure  className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center]" style={{ backgroundImage: "url('/assets-c2/img-slimline-blinds-gorden-kantor-scaled-e16.webp')" }}>
                      <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                      <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[14px] px-[12px] pb-[12px] text-[#FCFAF6]">
                        <span className="block text-[clamp(14.5px,3.8vw,17px)] [font-weight:500] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Slimline Blinds</span>
                        <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="text-[#FFB800]">★</span> 4,7 · 81 pembeli</span>
                      </figcaption>
                    </figure>
                    <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20tanya%20harga%20dan%20spesifikasi%20Slimline%20Blinds." target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-[6px] mt-[8px] mx-[0] mb-[0] min-h-[44px] py-[9px] px-[8px] bg-[#FCFAF6] [border:1.5px_solid_#DCD3C1] text-[#221F1A] text-[12.5px] [font-weight:600] no-underline rounded-[8px] leading-[1.25] text-center hover:bg-[#F2EDE3] hover:border-[#6E6553]"><img src="/assets-c2/whatsapp.svg" alt="" className="flex-none w-[15px] h-[15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]"  loading="lazy" decoding="async" />Tanya harga &amp; spesifikasi</a>
                  </div>
                    <div className="flex flex-col">
                    <figure  className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center]" style={{ backgroundImage: "url('/assets-c2/kat-outdoor.webp')" }}>
                      <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                      <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[14px] px-[12px] pb-[12px] text-[#FCFAF6]">
                        <span className="block text-[clamp(14.5px,3.8vw,17px)] [font-weight:500] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Outdoor Blinds</span>
                        <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="text-[#FFB800]">★</span> 4,8 · 72 pembeli</span>
                      </figcaption>
                    </figure>
                    <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20tanya%20harga%20dan%20spesifikasi%20Outdoor%20Blinds." target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-[6px] mt-[8px] mx-[0] mb-[0] min-h-[44px] py-[9px] px-[8px] bg-[#FCFAF6] [border:1.5px_solid_#DCD3C1] text-[#221F1A] text-[12.5px] [font-weight:600] no-underline rounded-[8px] leading-[1.25] text-center hover:bg-[#F2EDE3] hover:border-[#6E6553]"><img src="/assets-c2/whatsapp.svg" alt="" className="flex-none w-[15px] h-[15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]"  loading="lazy" decoding="async" />Tanya harga &amp; spesifikasi</a>
                  </div>
                  </div>
              </div>
            </>) : null}
            {showPelengkap ? (<>
              <div className="mt-[30px] mx-[0] mb-[0]">
                <h3 className="mt-[0] mx-[0] mb-[14px] [font-family:Poppins,Helvetica,sans-serif] text-[13px] [font-weight:700] tracking-[0.1em] uppercase text-[#877E6D]">Wallpaper &amp; pelengkap</h3>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(min(48%,240px),1fr))] gap-y-[14px] gap-x-[8px] [align-items:start]">
                  <div className="flex flex-col">
                    <figure  className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center]" style={{ backgroundImage: "url('/assets-c2/img-wallpaper-custom-motif-peta-dunia.webp')" }}>
                      <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                      <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[14px] px-[12px] pb-[12px] text-[#FCFAF6]">
                        <span className="block text-[clamp(14.5px,3.8vw,17px)] [font-weight:500] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Wallpaper Custom</span>
                        <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="text-[#FFB800]">★</span> 4,8 · 143 pembeli</span>
                      </figcaption>
                    </figure>
                    <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20tanya%20harga%20dan%20spesifikasi%20Wallpaper%20Custom." target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-[6px] mt-[8px] mx-[0] mb-[0] min-h-[44px] py-[9px] px-[8px] bg-[#FCFAF6] [border:1.5px_solid_#DCD3C1] text-[#221F1A] text-[12.5px] [font-weight:600] no-underline rounded-[8px] leading-[1.25] text-center hover:bg-[#F2EDE3] hover:border-[#6E6553]"><img src="/assets-c2/whatsapp.svg" alt="" className="flex-none w-[15px] h-[15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]"  loading="lazy" decoding="async" />Tanya harga &amp; spesifikasi</a>
                  </div>
                  <div className="flex flex-col">
                    <figure  className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center]" style={{ backgroundImage: "url('/assets-c2/img-kasa-nyamuk-magnetik-1536x1012.webp')" }}>
                      <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                      <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[14px] px-[12px] pb-[12px] text-[#FCFAF6]">
                        <span className="block text-[clamp(14.5px,3.8vw,17px)] [font-weight:500] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Perlengkapan Lainnya</span>
                        <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="text-[#FFB800]">★</span> 4,7 · 112 pembeli</span>
                      </figcaption>
                    </figure>
                    <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20tanya%20harga%20dan%20spesifikasi%20Perlengkapan%20Lainnya." target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-[6px] mt-[8px] mx-[0] mb-[0] min-h-[44px] py-[9px] px-[8px] bg-[#FCFAF6] [border:1.5px_solid_#DCD3C1] text-[#221F1A] text-[12.5px] [font-weight:600] no-underline rounded-[8px] leading-[1.25] text-center hover:bg-[#F2EDE3] hover:border-[#6E6553]"><img src="/assets-c2/whatsapp.svg" alt="" className="flex-none w-[15px] h-[15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]"  loading="lazy" decoding="async" />Tanya harga &amp; spesifikasi</a>
                  </div>
                </div>
              </div>
            </>) : null}
            <p className="mt-[26px] mx-[0] mb-[0] text-[16px] text-[#6A6252] text-center [font-weight:700]">Belum yakin yang mana? Kirim foto jendela Anda lewat WA, kami bantu pilihkan modelnya.</p>
            <div className="mt-[12px] mx-[0] mb-[0]">
              <div className="flex flex-col items-stretch gap-[10px]">
                <a href="https://wa.me/6285860525758?text=Halo%20saya%20mau%20pesan%20Gorden%20Custom%2C%2Cbisa%20survey%20ke%20lokasi%3F" target="_blank" rel="noopener noreferrer" className="flex-[1_1_100%] flex items-center justify-center gap-[9px] min-h-[56px] py-[14px] px-[20px] bg-[#25D366] text-[#fff] text-[clamp(15px,3.9vw,17px)] [font-weight:700] tracking-[-0.01em] no-underline rounded-[12px] shadow-[0px_8px_20px_rgba(37,211,102,0.3)] hover:bg-[#1FBA57]"><img src="/assets-c2/whatsapp.svg" alt="" className="flex-none w-[20px] h-[20px] block [filter:brightness(0)_invert(1)]"  loading="lazy" decoding="async" />Konsultasi Gratis →</a>
              </div>
              <div className="flex flex-wrap justify-center items-center gap-y-[5px] gap-x-[10px] mt-[12px] mx-[0] mb-[0] text-[clamp(11.5px,3vw,12.5px)] [font-weight:500] text-center text-[#3C3529]">
                <span className="text-[#FFB800] tracking-[1px]">★★★★★</span><strong className="text-[#221F1A]">5,0</strong><span>Google Review</span><span className="opacity-[0.5]">•</span><span>1.000+ pembeli</span><span className="opacity-[0.5]">•</span><span>Garansi pemasangan 14 hari</span>
              </div>
            </div>
          </section>
      
          <section id="portofolio" className="py-[clamp(46px,8vw,78px)] px-[0] [border-top:1px_solid_#EDE6DA] scroll-mt-[76px]">
            <p className="mt-[0] mx-[0] mb-[10px] text-[11px] [font-weight:600] tracking-[0.22em] uppercase text-[#96876C]">Portofolio</p>
            <h2 className="mt-[0] mx-[0] mb-[8px] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(22px,5.6vw,34px)] leading-[1.16] [font-weight:700] tracking-[-0.03em] text-[#221F1A]">Bayangkan gorden ini di ruangan Anda</h2>
            <p className="mt-[0] mx-[0] mb-[clamp(20px,3.6vw,28px)] text-[#585045] max-w-[56ch] text-[clamp(14.5px,3.9vw,16.5px)] leading-[1.55]">Dikelompokkan per kebutuhan ruangan. Tekan fotonya untuk melihat lebih besar.</p>
            
            <div className="mt-[0] mx-[0] mb-[0]">
              <div className="flex items-baseline gap-[12px] mt-[0] mx-[0] mb-[10px]">
                <h3 className="m-[0] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(15px,4vw,17px)] [font-weight:700] tracking-[-0.01em] text-[#221F1A] whitespace-nowrap">Rumah minimalis</h3>
                <span className="flex-[1_1_auto] h-[1px] bg-[#E5DDCF]"></span>
              </div>
              <div className="grid grid-cols-[repeat(2,1fr)] gap-[10px]">
                <figure data-zoom="/assets-c2/p02-smokering-gentan.webp"  className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[6px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center] cursor-zoom-in" style={{ backgroundImage: "url('/assets-c2/p02-smokering-gentan.webp')" }}>
                  <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_50%,rgba(28,25,21,0.7)_100%)]"></div>
                  <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[13px] px-[12px] pb-[12px] text-[#FCFAF6]">
                    <span className="block text-[clamp(13.5px,3.6vw,15px)] [font-weight:600] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Smokering custom, full plafon</span>
                    <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.82)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">Perumahan Gentan</span>
                  </figcaption>
                </figure>
                <figure data-zoom="/assets-c2/p06-box-glossy-solokota.webp"  className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[6px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center] cursor-zoom-in" style={{ backgroundImage: "url('/assets-c2/p06-box-glossy-solokota.webp')" }}>
                  <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_50%,rgba(28,25,21,0.7)_100%)]"></div>
                  <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[13px] px-[12px] pb-[12px] text-[#FCFAF6]">
                    <span className="block text-[clamp(13.5px,3.6vw,15px)] [font-weight:600] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Box custom bahan glossy</span>
                    <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.82)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">Solo Kota</span>
                  </figcaption>
                </figure>
              </div>
            </div>
            <div className="mt-[clamp(22px,4vw,32px)] mx-[0] mb-[0]">
              <div className="flex items-baseline gap-[12px] mt-[0] mx-[0] mb-[10px]">
                <h3 className="m-[0] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(15px,4vw,17px)] [font-weight:700] tracking-[-0.01em] text-[#221F1A] whitespace-nowrap">Kamar tidur</h3>
                <span className="flex-[1_1_auto] h-[1px] bg-[#E5DDCF]"></span>
              </div>
              <div className="grid grid-cols-[repeat(2,1fr)] gap-[10px]">
                <figure data-zoom="/assets-c2/p08-drop-ceiling-yogyakarta.webp"  className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[6px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center] cursor-zoom-in" style={{ backgroundImage: "url('/assets-c2/p08-drop-ceiling-yogyakarta.webp')" }}>
                  <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_50%,rgba(28,25,21,0.7)_100%)]"></div>
                  <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[13px] px-[12px] pb-[12px] text-[#FCFAF6]">
                    <span className="block text-[clamp(13.5px,3.6vw,15px)] [font-weight:600] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Custom drop ceiling kamar</span>
                    <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.82)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">Yogyakarta</span>
                  </figcaption>
                </figure>
                <figure data-zoom="/assets-c2/img-gorden-blackout-rumah-pribadi-dr.bayuspo.webp"  className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[6px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center] cursor-zoom-in" style={{ backgroundImage: "url('/assets-c2/img-gorden-blackout-rumah-pribadi-dr.bayuspo.webp')" }}>
                  <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_50%,rgba(28,25,21,0.7)_100%)]"></div>
                  <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[13px] px-[12px] pb-[12px] text-[#FCFAF6]">
                    <span className="block text-[clamp(13.5px,3.6vw,15px)] [font-weight:600] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Gorden blackout</span>
                    <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.82)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">Rumah pribadi dr. Bayu</span>
                  </figcaption>
                </figure>
              </div>
            </div>
            <div className="mt-[clamp(22px,4vw,32px)] mx-[0] mb-[0]">
              <div className="flex items-baseline gap-[12px] mt-[0] mx-[0] mb-[10px]">
                <h3 className="m-[0] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(15px,4vw,17px)] [font-weight:700] tracking-[-0.01em] text-[#221F1A] whitespace-nowrap">Kantor</h3>
                <span className="flex-[1_1_auto] h-[1px] bg-[#E5DDCF]"></span>
              </div>
              <div className="grid grid-cols-[repeat(2,1fr)] gap-[10px]">
                <figure data-zoom="/assets-c2/img-roller-blinds-aula-kantor-bpvp-surakarta.webp"  className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[6px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center] cursor-zoom-in" style={{ backgroundImage: "url('/assets-c2/img-roller-blinds-aula-kantor-bpvp-surakarta.webp')" }}>
                  <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_50%,rgba(28,25,21,0.7)_100%)]"></div>
                  <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[13px] px-[12px] pb-[12px] text-[#FCFAF6]">
                    <span className="block text-[clamp(13.5px,3.6vw,15px)] [font-weight:600] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Roller blinds aula</span>
                    <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.82)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">Kantor BPVP Surakarta</span>
                  </figcaption>
                </figure>
                <figure data-zoom="/assets-c2/img-gorden-vertikal-blinds-pt.delta-atsiri-p.webp"  className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[6px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center] cursor-zoom-in" style={{ backgroundImage: "url('/assets-c2/img-gorden-vertikal-blinds-pt.delta-atsiri-p.webp')" }}>
                  <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_50%,rgba(28,25,21,0.7)_100%)]"></div>
                  <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[13px] px-[12px] pb-[12px] text-[#FCFAF6]">
                    <span className="block text-[clamp(13.5px,3.6vw,15px)] [font-weight:600] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Vertical blinds</span>
                    <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.82)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">PT Delta Atsiri Prima</span>
                  </figcaption>
                </figure>
              </div>
            </div>
            <div className="mt-[clamp(22px,4vw,32px)] mx-[0] mb-[0]">
              <div className="flex items-baseline gap-[12px] mt-[0] mx-[0] mb-[10px]">
                <h3 className="m-[0] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(15px,4vw,17px)] [font-weight:700] tracking-[-0.01em] text-[#221F1A] whitespace-nowrap">Blinds</h3>
                <span className="flex-[1_1_auto] h-[1px] bg-[#E5DDCF]"></span>
              </div>
              <div className="grid grid-cols-[repeat(2,1fr)] gap-[10px]">
                <figure data-zoom="/assets-c2/img-zebra-blinds-rumah-pribadi-dr.-elok-1.webp"  className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[6px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center] cursor-zoom-in" style={{ backgroundImage: "url('/assets-c2/img-zebra-blinds-rumah-pribadi-dr.-elok-1.webp')" }}>
                  <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_50%,rgba(28,25,21,0.7)_100%)]"></div>
                  <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[13px] px-[12px] pb-[12px] text-[#FCFAF6]">
                    <span className="block text-[clamp(13.5px,3.6vw,15px)] [font-weight:600] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Zebra blinds</span>
                    <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.82)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">Rumah pribadi dr. Elok</span>
                  </figcaption>
                </figure>
                <figure data-zoom="/assets-c2/img-tirai-solar-screen-blinds-dna-cafe-solo-.webp"  className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[6px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center] cursor-zoom-in" style={{ backgroundImage: "url('/assets-c2/img-tirai-solar-screen-blinds-dna-cafe-solo-.webp')" }}>
                  <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_50%,rgba(28,25,21,0.7)_100%)]"></div>
                  <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[13px] px-[12px] pb-[12px] text-[#FCFAF6]">
                    <span className="block text-[clamp(13.5px,3.6vw,15px)] [font-weight:600] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Tirai solar screen</span>
                    <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.82)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">DNA Cafe, Solo</span>
                  </figcaption>
                </figure>
              </div>
            </div>
            {showAllProjects ? (<>
            <div className="grid grid-cols-[repeat(2,1fr)] gap-[10px] mt-[clamp(22px,4vw,32px)] mx-[0] mb-[0]">
              <figure data-zoom="/assets-c2/p10-smokering-bantul.webp"  className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center] cursor-zoom-in" style={{ backgroundImage: "url('/assets-c2/p10-smokering-bantul.webp')" }}>
                <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_55%,rgba(28,25,21,0.62)_100%)]"></div>
                <span className="absolute top-[10px] left-[10px] py-[4px] px-[10px] bg-[rgba(252,250,246,0.92)] text-[#3C3529] text-[10.5px] [font-weight:700] tracking-[0.06em] uppercase rounded-[999px]">Rumah minimalis</span>
                <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[14px] px-[13px] pb-[13px] text-[#FCFAF6]">
                  <span className="block text-[clamp(13.5px,3.6vw,15px)] [font-weight:600] tracking-[-0.01em] leading-[1.2] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Smokering custom</span>
                  <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.84)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">Bantul, DIY</span>
                </figcaption>
              </figure>
              <figure data-zoom="/assets-c2/img-gorden-premium-permata-regency-1.webp"  className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center] cursor-zoom-in" style={{ backgroundImage: "url('/assets-c2/img-gorden-premium-permata-regency-1.webp')" }}>
                <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_55%,rgba(28,25,21,0.62)_100%)]"></div>
                <span className="absolute top-[10px] left-[10px] py-[4px] px-[10px] bg-[rgba(252,250,246,0.92)] text-[#3C3529] text-[10.5px] [font-weight:700] tracking-[0.06em] uppercase rounded-[999px]">Rumah minimalis</span>
                <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[14px] px-[13px] pb-[13px] text-[#FCFAF6]">
                  <span className="block text-[clamp(13.5px,3.6vw,15px)] [font-weight:600] tracking-[-0.01em] leading-[1.2] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Gorden premium</span>
                  <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.84)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">Permata Regency</span>
                </figcaption>
              </figure>
              <figure data-zoom="/assets-c2/img-gorden-premium-rumah-pribadi-owner-resto.webp"  className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center] cursor-zoom-in" style={{ backgroundImage: "url('/assets-c2/img-gorden-premium-rumah-pribadi-owner-resto.webp')" }}>
                <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_55%,rgba(28,25,21,0.62)_100%)]"></div>
                <span className="absolute top-[10px] left-[10px] py-[4px] px-[10px] bg-[rgba(252,250,246,0.92)] text-[#3C3529] text-[10.5px] [font-weight:700] tracking-[0.06em] uppercase rounded-[999px]">Rumah minimalis</span>
                <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[14px] px-[13px] pb-[13px] text-[#FCFAF6]">
                  <span className="block text-[clamp(13.5px,3.6vw,15px)] [font-weight:600] tracking-[-0.01em] leading-[1.2] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Gorden premium</span>
                  <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.84)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">Rumah owner resto Solo</span>
                </figcaption>
              </figure>
              <figure data-zoom="/assets-c2/img-gorden-custom-box-rumah-pribadi-sukoharj.webp"  className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center] cursor-zoom-in" style={{ backgroundImage: "url('/assets-c2/img-gorden-custom-box-rumah-pribadi-sukoharj.webp')" }}>
                <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_55%,rgba(28,25,21,0.62)_100%)]"></div>
                <span className="absolute top-[10px] left-[10px] py-[4px] px-[10px] bg-[rgba(252,250,246,0.92)] text-[#3C3529] text-[10.5px] [font-weight:700] tracking-[0.06em] uppercase rounded-[999px]">Rumah minimalis</span>
                <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[14px] px-[13px] pb-[13px] text-[#FCFAF6]">
                  <span className="block text-[clamp(13.5px,3.6vw,15px)] [font-weight:600] tracking-[-0.01em] leading-[1.2] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Gorden custom box</span>
                  <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.84)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">Rumah pribadi Sukoharjo</span>
                </figcaption>
              </figure>
              <figure data-zoom="/assets-c2/img-gorden-kos-putri-ums-.webp"  className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center] cursor-zoom-in" style={{ backgroundImage: "url('/assets-c2/img-gorden-kos-putri-ums-.webp')" }}>
                <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_55%,rgba(28,25,21,0.62)_100%)]"></div>
                <span className="absolute top-[10px] left-[10px] py-[4px] px-[10px] bg-[rgba(252,250,246,0.92)] text-[#3C3529] text-[10.5px] [font-weight:700] tracking-[0.06em] uppercase rounded-[999px]">Kamar tidur</span>
                <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[14px] px-[13px] pb-[13px] text-[#FCFAF6]">
                  <span className="block text-[clamp(13.5px,3.6vw,15px)] [font-weight:600] tracking-[-0.01em] leading-[1.2] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Gorden kos putri</span>
                  <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.84)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">UMS Surakarta</span>
                </figcaption>
              </figure>
              <figure data-zoom="/assets-c2/img-gorden-apartemen-solo-.webp"  className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center] cursor-zoom-in" style={{ backgroundImage: "url('/assets-c2/img-gorden-apartemen-solo-.webp')" }}>
                <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_55%,rgba(28,25,21,0.62)_100%)]"></div>
                <span className="absolute top-[10px] left-[10px] py-[4px] px-[10px] bg-[rgba(252,250,246,0.92)] text-[#3C3529] text-[10.5px] [font-weight:700] tracking-[0.06em] uppercase rounded-[999px]">Kamar tidur</span>
                <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[14px] px-[13px] pb-[13px] text-[#FCFAF6]">
                  <span className="block text-[clamp(13.5px,3.6vw,15px)] [font-weight:600] tracking-[-0.01em] leading-[1.2] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Gorden apartemen</span>
                  <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.84)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">Solo</span>
                </figcaption>
              </figure>
              <figure data-zoom="/assets-c2/p07-klinik-belova-ums.webp"  className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center] cursor-zoom-in" style={{ backgroundImage: "url('/assets-c2/p07-klinik-belova-ums.webp')" }}>
                <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_55%,rgba(28,25,21,0.62)_100%)]"></div>
                <span className="absolute top-[10px] left-[10px] py-[4px] px-[10px] bg-[rgba(252,250,246,0.92)] text-[#3C3529] text-[10.5px] [font-weight:700] tracking-[0.06em] uppercase rounded-[999px]">Kantor</span>
                <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[14px] px-[13px] pb-[13px] text-[#FCFAF6]">
                  <span className="block text-[clamp(13.5px,3.6vw,15px)] [font-weight:600] tracking-[-0.01em] leading-[1.2] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Custom anti bakteri</span>
                  <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.84)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">Klinik Belova UMS</span>
                </figcaption>
              </figure>
              <figure data-zoom="/assets-c2/img-gorden-rumah-sakit-rso-orthopedi-surakar.webp"  className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center] cursor-zoom-in" style={{ backgroundImage: "url('/assets-c2/img-gorden-rumah-sakit-rso-orthopedi-surakar.webp')" }}>
                <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_55%,rgba(28,25,21,0.62)_100%)]"></div>
                <span className="absolute top-[10px] left-[10px] py-[4px] px-[10px] bg-[rgba(252,250,246,0.92)] text-[#3C3529] text-[10.5px] [font-weight:700] tracking-[0.06em] uppercase rounded-[999px]">Kantor</span>
                <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[14px] px-[13px] pb-[13px] text-[#FCFAF6]">
                  <span className="block text-[clamp(13.5px,3.6vw,15px)] [font-weight:600] tracking-[-0.01em] leading-[1.2] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Gorden rumah sakit</span>
                  <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.84)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">RSO Orthopedi Surakarta</span>
                </figcaption>
              </figure>
              <figure data-zoom="/assets-c2/img-wallpaper-fk-uns.webp"  className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center] cursor-zoom-in" style={{ backgroundImage: "url('/assets-c2/img-wallpaper-fk-uns.webp')" }}>
                <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_55%,rgba(28,25,21,0.62)_100%)]"></div>
                <span className="absolute top-[10px] left-[10px] py-[4px] px-[10px] bg-[rgba(252,250,246,0.92)] text-[#3C3529] text-[10.5px] [font-weight:700] tracking-[0.06em] uppercase rounded-[999px]">Kantor</span>
                <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[14px] px-[13px] pb-[13px] text-[#FCFAF6]">
                  <span className="block text-[clamp(13.5px,3.6vw,15px)] [font-weight:600] tracking-[-0.01em] leading-[1.2] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Wallpaper dinding</span>
                  <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.84)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">FK UNS</span>
                </figcaption>
              </figure>
              <figure data-zoom="/assets-c2/img-gorden-untuk-studio-foto-solo-scaled.webp"  className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center] cursor-zoom-in" style={{ backgroundImage: "url('/assets-c2/img-gorden-untuk-studio-foto-solo-scaled.webp')" }}>
                <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_55%,rgba(28,25,21,0.62)_100%)]"></div>
                <span className="absolute top-[10px] left-[10px] py-[4px] px-[10px] bg-[rgba(252,250,246,0.92)] text-[#3C3529] text-[10.5px] [font-weight:700] tracking-[0.06em] uppercase rounded-[999px]">Kantor</span>
                <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[14px] px-[13px] pb-[13px] text-[#FCFAF6]">
                  <span className="block text-[clamp(13.5px,3.6vw,15px)] [font-weight:600] tracking-[-0.01em] leading-[1.2] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Gorden studio foto</span>
                  <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.84)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">Solo</span>
                </figcaption>
              </figure>
              <figure data-zoom="/assets-c2/img-roller-blinds-blackout-kantor-blk-scaled.webp"  className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center] cursor-zoom-in" style={{ backgroundImage: "url('/assets-c2/img-roller-blinds-blackout-kantor-blk-scaled.webp')" }}>
                <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_55%,rgba(28,25,21,0.62)_100%)]"></div>
                <span className="absolute top-[10px] left-[10px] py-[4px] px-[10px] bg-[rgba(252,250,246,0.92)] text-[#3C3529] text-[10.5px] [font-weight:700] tracking-[0.06em] uppercase rounded-[999px]">Blinds</span>
                <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[14px] px-[13px] pb-[13px] text-[#FCFAF6]">
                  <span className="block text-[clamp(13.5px,3.6vw,15px)] [font-weight:600] tracking-[-0.01em] leading-[1.2] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Roller blinds blackout</span>
                  <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.84)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">Kantor BLK</span>
                </figcaption>
              </figure>
            </div>
            </>) : null}
            <div className="flex justify-center mt-[18px] mx-[0] mb-[0]">
              <button type="button" onClick={toggleProjects} className="inline-flex items-center gap-[8px] min-h-[48px] py-[13px] px-[22px] bg-[#FCFAF6] [border:1.5px_solid_#C7BBA2] rounded-[999px] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(13.5px,3.6vw,15px)] [font-weight:600] text-[#221F1A] cursor-pointer hover:bg-[#F2EDE3] hover:border-[#6E6553]">{projectsLabel}</button>
            </div>
            <p className="mt-[18px] mx-[0] mb-[0] py-[14px] px-[16px] bg-[#F2EDE3] rounded-[12px] text-[14.5px] leading-[1.55] text-[#4A4339] text-pretty text-center pt-[0px] pb-[0px]">Masih ada 1.000+ project lainnya. Minta di WA contoh yang mirip ruangan Anda<br /></p>
                  <div className="mt-[22px] mx-[0] mb-[0]">
              <div className="flex flex-col items-stretch gap-[10px]"><a href="https://wa.me/6285860525758?text=Halo%20saya%20mau%20pesan%20Gorden%20Custom%2C%2Cbisa%20survey%20ke%20lokasi%3F" target="_blank" rel="noopener noreferrer" className="flex-[1_1_100%] flex items-center justify-center gap-[9px] min-h-[56px] py-[14px] px-[20px] bg-[#25D366] text-[#fff] text-[clamp(15px,3.9vw,17px)] [font-weight:700] tracking-[-0.01em] no-underline rounded-[12px] shadow-[0px_8px_20px_rgba(37,211,102,0.3)] hover:bg-[#1FBA57]"><img src="/assets-c2/whatsapp.svg" alt="" className="flex-none w-[20px] h-[20px] block [filter:brightness(0)_invert(1)]"  loading="lazy" decoding="async" />Konsultasi Gratis →</a>
                <p className="m-[0] text-center text-[clamp(12.5px,3.3vw,13.5px)] leading-[1.45] text-[#6F6757]">Chat langsung dibalas owner, gratis dan tanpa wajib memesan.</p>
                <a href="#katalog" className="self-center inline-flex items-center gap-[6px] min-h-[30px] py-[2px] px-[0] bg-transparent border-0 text-[#585045] text-[clamp(13.5px,3.5vw,15px)] [font-weight:500] [text-decoration:underline] [text-underline-offset:4px] [text-decoration-color:#C7BBA2] hover:text-[#221F1A] hover:[text-decoration-color:#6E6553]">Lihat katalog model dulu</a></div>
              <div className="flex flex-wrap justify-center items-center gap-y-[5px] gap-x-[10px] mt-[12px] mx-[0] mb-[0] text-[clamp(11.5px,3vw,12.5px)] [font-weight:500] text-center text-[#3C3529]">
                <span className="text-[#FFB800] tracking-[1px]">★★★★★</span><strong className="text-[#221F1A]">5,0</strong><span>Google Review</span><span className="opacity-[0.5]">•</span><span>1.000+ pembeli</span><span className="opacity-[0.5]">•</span><span>Garansi pemasangan 14 hari</span>
              </div>
            </div>
          </section>
      
          <section className="py-[clamp(46px,8vw,78px)] px-[0] [border-top:1px_solid_#EDE6DA]">
            <p className="mt-[0] mx-[0] mb-[10px] text-[11px] [font-weight:600] tracking-[0.22em] uppercase text-[#96876C]">Kata pelanggan</p>
            <h2 className="mt-[0] mx-[0] mb-[8px] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(22px,5.6vw,34px)] leading-[1.16] [font-weight:600] tracking-[-0.03em] text-pretty">Yang mereka rasakan setelah gordennya terpasang</h2>
            <div className="inline-flex items-center gap-[14px] mt-[0] mx-[0] mb-[22px] py-[12px] px-[18px] bg-[#FCFAF6] [border:1px_solid_#E5DDCF] rounded-[20px]">
              <img src="/assets-c2/google-g.svg" alt="Google" className="flex-none w-[26px] h-[26px] block"  loading="lazy" decoding="async" />
              <span className="flex flex-col gap-[2px]">
                <span className="flex items-center gap-[7px]"><span className="text-[#FFB800] text-[14px] tracking-[1px]">★★★★★</span><strong className="text-[15px] text-[#221F1A]">5,0</strong></span>
                <span className="text-[13px] text-[oklch(0.5_0.03_70)]">100+ ulasan di Google Review</span>
              </span>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-[16px] items-stretch">
              <article className="flex flex-col bg-[#FCFAF6] [border:1px_solid_#E8E1D4] rounded-[20px] overflow-hidden">
                <div  className="aspect-[3/4] bg-[size:cover] bg-[position:center]" style={{ backgroundImage: "url('/assets-c2/testi-1.webp')" }}></div>
                <div className="flex-[1] flex flex-col pt-[18px] px-[20px] pb-[20px]">
                  <span className="inline-flex self-start items-center gap-[6px] mt-[0] mx-[0] mb-[12px] py-[5px] px-[11px] bg-[#F2EDE3] [border:1px_solid_#E5DDCF] rounded-[999px] text-[11.5px] [font-weight:700] tracking-[0.04em] uppercase text-[#6E6553]">Harga sebanding kualitasnya</span>
                  <div className="flex items-center gap-[12px] mt-[0] mx-[0] mb-[12px]">
                    <img src="/assets-c2/ava-1.webp" alt="Notikawati Puput" className="flex-none w-[40px] h-[40px] rounded-[999px] object-cover block"  loading="lazy" decoding="async" width="108" height="108" />
                    <span className="flex flex-col gap-[2px] min-w-[0]">
                      <span className="text-[15px] [font-weight:700] text-[#221F1A]">Notikawati Puput</span>
                      <span className="flex items-center gap-[6px]">
                        <span className="text-[#FFB800] text-[12px] tracking-[1px]">★★★★★</span>
                        <span className="text-[12px] text-[#7B7263]">7 bulan lalu</span>
                      </span>
                    </span>
                    <img src="/assets-c2/google-g.svg" alt="Google" className="flex-none ml-[auto] w-[18px] h-[18px] block"  loading="lazy" decoding="async" />
                  </div>
                  <p className="m-[0] text-[14.5px] leading-[1.6] text-[#4A4339]">Desainnya elegan, dan <b className="[font-weight:700] text-[#221F1A]">kualitas bahan serta jahitannya rapi dan premium</b>. Ruangan jadi terlihat lebih cantik dan berkelas.</p>
                </div>
              </article>
              <article className="flex flex-col bg-[#FCFAF6] [border:1px_solid_#E8E1D4] rounded-[20px] overflow-hidden">
                <div  className="aspect-[3/4] bg-[size:cover] bg-[position:center]" style={{ backgroundImage: "url('/assets-c2/testi-2.webp')" }}></div>
                <div className="flex-[1] flex flex-col pt-[18px] px-[20px] pb-[20px]">
                  <span className="inline-flex self-start items-center gap-[6px] mt-[0] mx-[0] mb-[12px] py-[5px] px-[11px] bg-[#F2EDE3] [border:1px_solid_#E5DDCF] rounded-[999px] text-[11.5px] [font-weight:700] tracking-[0.04em] uppercase text-[#6E6553]">Selesai lebih cepat dari janji</span>
                  <div className="flex items-center gap-[12px] mt-[0] mx-[0] mb-[12px]">
                    <img src="/assets-c2/ava-2.webp" alt="Ing Sun" className="flex-none w-[40px] h-[40px] rounded-[999px] object-cover block"  loading="lazy" decoding="async" width="108" height="108" />
                    <span className="flex flex-col gap-[2px] min-w-[0]">
                      <span className="text-[15px] [font-weight:700] text-[#221F1A]">Ing Sun</span>
                      <span className="flex items-center gap-[6px]">
                        <span className="text-[#FFB800] text-[12px] tracking-[1px]">★★★★★</span>
                        <span className="text-[12px] text-[#7B7263]">3 bulan lalu</span>
                      </span>
                    </span>
                    <img src="/assets-c2/google-g.svg" alt="Google" className="flex-none ml-[auto] w-[18px] h-[18px] block"  loading="lazy" decoding="async" />
                  </div>
                  <p className="m-[0] text-[14.5px] leading-[1.6] text-[#4A4339]">Produk bagus, bisa custom, dan <b className="[font-weight:700] text-[#221F1A]">orderan selesai serta dipasang lebih cepat dari yang dijanjikan</b>. Sangat recommended.</p>
                </div>
              </article>
              <article className="flex flex-col bg-[#FCFAF6] [border:1px_solid_#E8E1D4] rounded-[20px] overflow-hidden">
                <div  className="aspect-[3/4] bg-[size:cover] bg-[position:center]" style={{ backgroundImage: "url('/assets-c2/testi-3.webp')" }}></div>
                <div className="flex-[1] flex flex-col pt-[18px] px-[20px] pb-[20px]">
                  <span className="inline-flex self-start items-center gap-[6px] mt-[0] mx-[0] mb-[12px] py-[5px] px-[11px] bg-[#F2EDE3] [border:1px_solid_#E5DDCF] rounded-[999px] text-[11.5px] [font-weight:700] tracking-[0.04em] uppercase text-[#6E6553]">Warnanya cocok di ruangan</span>
                  <div className="flex items-center gap-[12px] mt-[0] mx-[0] mb-[12px]">
                    <img src="/assets-c2/ava-3.webp" alt="Chusnul Khotimah" className="flex-none w-[40px] h-[40px] rounded-[999px] object-cover block"  loading="lazy" decoding="async" width="108" height="108" />
                    <span className="flex flex-col gap-[2px] min-w-[0]">
                      <span className="text-[15px] [font-weight:700] text-[#221F1A]">Chusnul Khotimah</span>
                      <span className="flex items-center gap-[6px]">
                        <span className="text-[#FFB800] text-[12px] tracking-[1px]">★★★★★</span>
                        <span className="text-[12px] text-[#7B7263]">1 minggu lalu</span>
                      </span>
                    </span>
                    <img src="/assets-c2/google-g.svg" alt="Google" className="flex-none ml-[auto] w-[18px] h-[18px] block"  loading="lazy" decoding="async" />
                  </div>
                  <p className="m-[0] text-[14.5px] leading-[1.6] text-[#4A4339]">Pesan jauh-jauh dari Semarang, dan <b className="[font-weight:700] text-[#221F1A]">hasilnya rapi banget, warnanya cocok dengan ruangan</b>. Rumah jadi terasa baru.</p>
                </div>
              </article>
            </div>
            
      
            <div className="mt-[26px] mx-[0] mb-[0]">
              <div className="flex flex-col items-stretch gap-[10px]">
                <a href="https://wa.me/6285860525758?text=Halo%20saya%20mau%20pesan%20Gorden%20Custom%2C%2Cbisa%20survey%20ke%20lokasi%3F" target="_blank" rel="noopener noreferrer" className="flex-[1_1_100%] flex items-center justify-center gap-[9px] min-h-[56px] py-[14px] px-[20px] bg-[#25D366] text-[#fff] text-[clamp(15px,3.9vw,17px)] [font-weight:700] tracking-[-0.01em] no-underline rounded-[12px] shadow-[0px_8px_20px_rgba(37,211,102,0.3)] hover:bg-[#25D366]"><img src="/assets-c2/whatsapp.svg" alt="" className="flex-none w-[20px] h-[20px] block [filter:brightness(0)_invert(1)]"  loading="lazy" decoding="async" />Konsultasi Gratis →</a>
                <p className="m-[0] text-center text-[clamp(12.5px,3.3vw,13.5px)] leading-[1.45] text-[#6F6757]">Chat langsung dibalas owner, gratis dan tanpa wajib memesan.</p>
                <a href="#katalog" className="self-center inline-flex items-center gap-[6px] min-h-[30px] py-[2px] px-[0] bg-transparent border-0 text-[#585045] text-[clamp(13.5px,3.5vw,15px)] [font-weight:500] [text-decoration:underline] [text-underline-offset:4px] [text-decoration-color:#C7BBA2] hover:text-[#221F1A] hover:[text-decoration-color:#6E6553]">Lihat katalog model dulu</a>
              </div>
              <div className="flex flex-wrap justify-center items-center gap-y-[5px] gap-x-[10px] mt-[12px] mx-[0] mb-[0] text-[clamp(11.5px,3vw,12.5px)] [font-weight:500] text-center text-[#3C3529]">
                <span className="text-[#FFB800] tracking-[1px]">★★★★★</span><strong className="text-[#221F1A]">5,0</strong><span>Google Review</span><span className="opacity-[0.5]">•</span><span>1.000+ pembeli</span><span className="opacity-[0.5]">•</span><span>Garansi pemasangan 14 hari</span>
              </div>
            </div>
            <div className="mt-[26px] mx-[0] mb-[0] pt-[18px] px-[0] pb-[0] [border-top:1px_solid_#ECE5D9]">
              <p className="mt-[0] mx-[0] mb-[12px] text-center text-[12.5px] text-[#7B7263]">Cuplikan ulasan lain langsung dari Google</p>
              <div className="flex items-center justify-center gap-[clamp(6px,2vw,14px)]">
                <button onClick={reviewPrevClick} aria-label="Ulasan sebelumnya" className="flex-none flex items-center justify-center h-[30px] w-[30px] rounded-[999px] [border:1px_solid_#E5DDCF] bg-[#fff] shadow-[0_6px_16px_rgba(58,53,44,0.16)] text-[#3a352c] text-[15px] cursor-pointer hover:bg-[#F2EDE3]">‹</button>
                <div onClick={reviewPrevClick} className="flex-none w-[28px] h-[110px] min-[761px]:w-[80px] min-[761px]:h-[168px] rounded-[12px] [border:1px_solid_#E8E1D4] overflow-hidden cursor-pointer opacity-[0.7] bg-[#FCFAF6] bg-[size:cover] bg-[position:left_top] hover:opacity-[1]" style={{ backgroundImage: `url(${reviewPrevSrc})` }}></div>
                <div className="flex-[1_1_auto] min-w-[0] flex items-center justify-center">
                  <img alt="Ulasan pelanggan di Google" ref={reviewImgRef} onClick={zoomCurrentReview} className="cursor-zoom-in block h-[auto] w-[auto] max-h-[min(46vh,300px)] min-[761px]:max-h-[240px] max-w-[100%] rounded-[20px] [border:1px_solid_#ECE5D9] bg-[#fff] shadow-[0_20px_38px_-22px_rgba(58,53,44,0.95)]"  loading="lazy" decoding="async" />
                </div>
                <div onClick={reviewNextClick} className="flex-none w-[28px] h-[110px] min-[761px]:w-[80px] min-[761px]:h-[168px] rounded-[12px] [border:1px_solid_#E8E1D4] overflow-hidden cursor-pointer opacity-[0.7] bg-[#FCFAF6] bg-[size:cover] bg-[position:left_top] hover:opacity-[1]" style={{ backgroundImage: `url(${reviewNextSrc})` }}></div>
                <button onClick={reviewNextClick} aria-label="Ulasan selanjutnya" className="flex-none flex items-center justify-center h-[30px] w-[30px] rounded-[999px] [border:1px_solid_#E5DDCF] bg-[#fff] shadow-[0_6px_16px_rgba(58,53,44,0.16)] text-[#3a352c] text-[15px] cursor-pointer hover:bg-[#F2EDE3]">›</button>
              </div>
              <div className="flex justify-center gap-[6px] mt-[10px] mx-[0] mb-[0]">
                {reviewShots.map((_, i) => (
                    <span key={i} className={`w-[5px] h-[5px] rounded-[999px] ${i === reviewIdx ? 'bg-[#6E6553]' : 'bg-[#CFC5B0]'}`} />
                  ))}
              </div>
          </div></section>
      
          <section className="py-[clamp(46px,8vw,78px)] px-[0] [border-top:1px_solid_#EDE6DA]">
            <div className="max-w-[56ch] mt-[0] mx-[0] mb-[8px]">
              <p className="mt-[0] mx-[0] mb-[10px] text-[11px] [font-weight:600] tracking-[0.22em] uppercase text-[#96876C]">Masih ragu?</p>
              <h2 className="mt-[0] mx-[0] mb-[8px] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(22px,5.6vw,34px)] leading-[1.16] [font-weight:600] tracking-[-0.03em] text-pretty">Masih ada yang bikin ragu sebelum pesan?</h2>
              <p className="m-[0] text-[#585045]">Wajar. Hal-hal ini yang paling sering ditanyakan pelanggan sebelum akhirnya pesan.</p>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-y-[0] gap-x-[40px] mt-[18px] mx-[0] mb-[0]">
                <div className="flex gap-[16px] items-start py-[18px] px-[0] [border-top:1px_solid_#DCD3C1]">
                  <span className="flex-none [font-family:Poppins,Helvetica,sans-serif] text-[clamp(26px,6vw,34px)] leading-[1] [font-weight:700] text-[#C7BBA2] tracking-[-0.03em]">01</span>
                  <p className="mt-[2px] mx-[0] mb-[0] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(16px,4.3vw,19px)] leading-[1.4] [font-weight:500] text-[#2A2620] text-pretty">Takut ukur sendiri, eh ternyata kependekan atau kegedean?</p>
                </div>
                <div className="flex gap-[16px] items-start py-[18px] px-[0] [border-top:1px_solid_#DCD3C1]">
                  <span className="flex-none [font-family:Poppins,Helvetica,sans-serif] text-[clamp(26px,6vw,34px)] leading-[1] [font-weight:700] text-[#C7BBA2] tracking-[-0.03em]">02</span>
                  <p className="mt-[2px] mx-[0] mb-[0] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(16px,4.3vw,19px)] leading-[1.4] [font-weight:500] text-[#2A2620] text-pretty">Nggak sempat, atau nggak sanggup pasang sendiri?</p>
                </div>
                <div className="flex gap-[16px] items-start py-[18px] px-[0] [border-top:1px_solid_#DCD3C1]">
                  <span className="flex-none [font-family:Poppins,Helvetica,sans-serif] text-[clamp(26px,6vw,34px)] leading-[1] [font-weight:700] text-[#C7BBA2] tracking-[-0.03em]">03</span>
                  <p className="mt-[2px] mx-[0] mb-[0] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(16px,4.3vw,19px)] leading-[1.4] [font-weight:500] text-[#2A2620] text-pretty">Mau tanya-tanya detail tapi takut cuma dibalas template sama admin?</p>
                </div>
                <div className="flex gap-[16px] items-start py-[18px] px-[0] [border-top:1px_solid_#DCD3C1]">
                  <span className="flex-none [font-family:Poppins,Helvetica,sans-serif] text-[clamp(26px,6vw,34px)] leading-[1] [font-weight:700] text-[#C7BBA2] tracking-[-0.03em]">04</span>
                  <p className="mt-[2px] mx-[0] mb-[0] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(16px,4.3vw,19px)] leading-[1.4] [font-weight:500] text-[#2A2620] text-pretty">Sudah pilih model, tapi pas terpasang kok kurang pas sama ruangan?</p>
                </div>
                <div className="flex gap-[16px] items-start py-[18px] px-[0] [border-top:1px_solid_#DCD3C1]">
                  <span className="flex-none [font-family:Poppins,Helvetica,sans-serif] text-[clamp(26px,6vw,34px)] leading-[1] [font-weight:700] text-[#C7BBA2] tracking-[-0.03em]">05</span>
                  <p className="mt-[2px] mx-[0] mb-[0] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(16px,4.3vw,19px)] leading-[1.4] [font-weight:500] text-[#2A2620] text-pretty">Takut bayar lebih mahal, tapi barangnya ternyata biasa saja?</p>
                </div>
            </div>
            <p className="mt-[clamp(24px,4vw,32px)] mx-[0] mb-[0] py-[18px] px-[20px] bg-[#FCFAF6] [border:1px_solid_#EDE6DA] [border-left:4px_solid_#6E6553] rounded-[14px] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(15px,4vw,17px)] [font-weight:500] leading-[1.5] text-[#3C3529] text-pretty">Semua kekhawatiran itu justru jadi alasan kenapa Gorden Wallpaper Solo ada.</p>
      
            <div className="mt-[26px] mx-[0] mb-[0]">
              <div className="flex flex-col items-stretch gap-[10px]">
                <a href="https://wa.me/6285860525758?text=Halo%20saya%20mau%20pesan%20Gorden%20Custom%2C%2Cbisa%20survey%20ke%20lokasi%3F" target="_blank" rel="noopener noreferrer" className="flex-[1_1_100%] flex items-center justify-center gap-[9px] min-h-[56px] py-[14px] px-[20px] bg-[#25D366] text-[#fff] text-[clamp(15px,3.9vw,17px)] [font-weight:700] tracking-[-0.01em] no-underline rounded-[12px] shadow-[0px_8px_20px_rgba(37,211,102,0.3)] hover:bg-[#1FBA57]"><img src="/assets-c2/whatsapp.svg" alt="" className="flex-none w-[20px] h-[20px] block [filter:brightness(0)_invert(1)]"  loading="lazy" decoding="async" />Konsultasi Gratis →</a>
                <p className="m-[0] text-center text-[clamp(12.5px,3.3vw,13.5px)] leading-[1.45] text-[#6F6757]">Chat langsung dibalas owner, gratis dan tanpa wajib memesan.</p>
                <a href="#katalog" className="self-center inline-flex items-center gap-[6px] min-h-[30px] py-[2px] px-[0] bg-transparent border-0 text-[#585045] text-[clamp(13.5px,3.5vw,15px)] [font-weight:500] [text-decoration:underline] [text-underline-offset:4px] [text-decoration-color:#C7BBA2] hover:text-[#221F1A] hover:[text-decoration-color:#6E6553]">Lihat katalog model dulu</a>
              </div>
              <div className="flex flex-wrap justify-center items-center gap-y-[5px] gap-x-[10px] mt-[12px] mx-[0] mb-[0] text-[clamp(11.5px,3vw,12.5px)] [font-weight:500] text-center text-[#3C3529]">
                <span className="text-[#FFB800] tracking-[1px]">★★★★★</span><strong className="text-[#221F1A]">5,0</strong><span>Google Review</span><span className="opacity-[0.5]">•</span><span>1.000+ pembeli</span><span className="opacity-[0.5]">•</span><span>Garansi pemasangan 14 hari</span>
              </div>
            </div>
          </section>
      
          <section className="my-[40px] mx-[0] py-[clamp(24px,5vw,34px)] px-[clamp(16px,4.5vw,28px)] bg-[#F2EDE3] [border:1px_solid_#E5DDCF] rounded-[20px]">
            <p className="mt-[0] mx-[0] mb-[10px] text-[11px] [font-weight:600] tracking-[0.22em] uppercase text-[#96876C]">KENAPA PILIH GORDEN WALLPAPER SOLO?</p>
            <h2 className="mt-[0] mx-[0] mb-[8px] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(22px,5.6vw,34px)] leading-[1.16] [font-weight:600] tracking-[-0.03em] text-pretty">Kenapa hasil gorden kami beda dengan marketplace dan toko gorden lain</h2>
            <p className="mt-[0] mx-[0] mb-[22px] text-[#585045] max-w-[62ch] text-[clamp(14.5px,3.9vw,16.5px)] leading-[1.55]">Silakan dibandingkan. Bedanya paling terasa setelah gordennya terpasang.</p>
            <div className="bg-[#FCFAF6] [border:1px_solid_#E8E1D4] rounded-[12px] overflow-clip">
              <div className="sticky top-[60px] z-[15] grid grid-cols-[minmax(0,1fr)_clamp(46px,12vw,84px)_clamp(46px,12vw,84px)_clamp(52px,13vw,96px)] items-stretch gap-[6px] bg-[#f4f1ea] shadow-[0_6px_12px_-10px_rgba(58,53,44,0.7)]">
                <span className="flex items-center py-[12px] px-[14px] text-[clamp(11px,3vw,12px)] [font-weight:700] tracking-[0.08em] uppercase text-[#877E6D]">Kriteria</span>
                <span className="flex items-center justify-center py-[12px] px-[4px] text-center text-[clamp(11px,3vw,13px)] [font-weight:700] leading-[1.15] text-[#877E6D]">Market­place</span>
                <span className="flex items-center justify-center py-[12px] px-[4px] text-center text-[clamp(11px,3vw,13px)] [font-weight:700] leading-[1.15] text-[#877E6D]">Toko lain</span>
                <span className="flex items-center justify-center py-[12px] px-[4px] text-center text-[clamp(11px,3vw,13px)] [font-weight:700] leading-[1.15] text-[#FCFAF6] bg-[#6E6553]">Kami</span>
              </div>
                <div className="grid grid-cols-[minmax(0,1fr)_clamp(46px,12vw,84px)_clamp(46px,12vw,84px)_clamp(52px,13vw,96px)] items-center gap-[6px]">
                  <span className="py-[13px] px-[14px] text-[clamp(13.5px,3.6vw,15.5px)] leading-[1.35] [font-weight:500] text-[#2A2620]">Harga sepadan hasilnya</span>
                  <span className="flex justify-center py-[12px] px-[0]"><span className="w-[24px] h-[24px] flex items-center justify-center rounded-[999px] bg-[#6E6553] text-[#FCFAF6] text-[12px] [font-weight:700]">✓</span></span>
                  <span className="flex justify-center py-[12px] px-[0]"><span className="w-[24px] h-[24px] flex items-center justify-center rounded-[999px] bg-[#e6e0d3] text-[#7d7362] text-[12px] [font-weight:700]">–</span></span>
                  <span className="flex items-center justify-center py-[12px] px-[0] bg-[#F4EFE5] h-[100%]"><span className="w-[24px] h-[24px] flex items-center justify-center rounded-[999px] bg-[#6E6553] text-[#FCFAF6] text-[12px] [font-weight:700]">✓</span></span>
                </div>
                                    <div className="grid grid-cols-[minmax(0,1fr)_clamp(46px,12vw,84px)_clamp(46px,12vw,84px)_clamp(52px,13vw,96px)] items-center gap-[6px] [border-top:1px_solid_#F1ECE2]">
                  <span className="py-[13px] px-[14px] text-[clamp(13.5px,3.6vw,15.5px)] leading-[1.35] [font-weight:500] text-[#2A2620]">Pas di jendela Anda</span>
                  <span className="flex justify-center py-[12px] px-[0]"><span className="w-[24px] h-[24px] flex items-center justify-center rounded-[999px] bg-[#eee9df] text-[#A79B85] text-[12px] [font-weight:700]">✕</span></span>
                  <span className="flex justify-center py-[12px] px-[0]"><span className="w-[24px] h-[24px] flex items-center justify-center rounded-[999px] bg-[#6E6553] text-[#FCFAF6] text-[12px] [font-weight:700]">✓</span></span>
                  <span className="flex items-center justify-center py-[12px] px-[0] bg-[#F4EFE5] h-[100%]"><span className="w-[24px] h-[24px] flex items-center justify-center rounded-[999px] bg-[#6E6553] text-[#FCFAF6] text-[12px] [font-weight:700]">✓</span></span>
                </div>
                <div className="grid grid-cols-[minmax(0,1fr)_clamp(46px,12vw,84px)_clamp(46px,12vw,84px)_clamp(52px,13vw,96px)] items-center gap-[6px] [border-top:1px_solid_#F1ECE2]">
                  <span className="py-[13px] px-[14px] text-[clamp(13.5px,3.6vw,15.5px)] leading-[1.35] [font-weight:500] text-[#2A2620]">Jatuhnya rapi berkat finishing steam</span>
                  <span className="flex justify-center py-[12px] px-[0]"><span className="w-[24px] h-[24px] flex items-center justify-center rounded-[999px] bg-[#eee9df] text-[#A79B85] text-[12px] [font-weight:700]">✕</span></span>
                  <span className="flex justify-center py-[12px] px-[0]"><span className="w-[24px] h-[24px] flex items-center justify-center rounded-[999px] bg-[#e6e0d3] text-[#7d7362] text-[12px] [font-weight:700]">–</span></span>
                  <span className="flex items-center justify-center py-[12px] px-[0] bg-[#F4EFE5] h-[100%]"><span className="w-[24px] h-[24px] flex items-center justify-center rounded-[999px] bg-[#6E6553] text-[#FCFAF6] text-[12px] [font-weight:700]">✓</span></span>
                </div>
                <div className="grid grid-cols-[minmax(0,1fr)_clamp(46px,12vw,84px)_clamp(46px,12vw,84px)_clamp(52px,13vw,96px)] items-center gap-[6px] [border-top:1px_solid_#F1ECE2]">
                  <span className="py-[13px] px-[14px] text-[clamp(13.5px,3.6vw,15.5px)] leading-[1.35] [font-weight:500] text-[#2A2620]">Aman dari salah ukur</span>
                  <span className="flex justify-center py-[12px] px-[0]"><span className="w-[24px] h-[24px] flex items-center justify-center rounded-[999px] bg-[#eee9df] text-[#A79B85] text-[12px] [font-weight:700]">✕</span></span>
                  <span className="flex justify-center py-[12px] px-[0]"><span className="w-[24px] h-[24px] flex items-center justify-center rounded-[999px] bg-[#e6e0d3] text-[#7d7362] text-[12px] [font-weight:700]">–</span></span>
                  <span className="flex items-center justify-center py-[12px] px-[0] bg-[#F4EFE5] h-[100%]"><span className="w-[24px] h-[24px] flex items-center justify-center rounded-[999px] bg-[#6E6553] text-[#FCFAF6] text-[12px] [font-weight:700]">✓</span></span>
                </div>
                          <div className="grid grid-cols-[minmax(0,1fr)_clamp(46px,12vw,84px)_clamp(46px,12vw,84px)_clamp(52px,13vw,96px)] items-center gap-[6px] [border-top:1px_solid_#F1ECE2]">
                  <span className="py-[13px] px-[14px] text-[clamp(13.5px,3.6vw,15.5px)] leading-[1.35] [font-weight:500] text-[#2A2620]">Terpasang, tinggal terima beres</span>
                  <span className="flex justify-center py-[12px] px-[0]"><span className="w-[24px] h-[24px] flex items-center justify-center rounded-[999px] bg-[#eee9df] text-[#A79B85] text-[12px] [font-weight:700]">✕</span></span>
                  <span className="flex justify-center py-[12px] px-[0]"><span className="w-[24px] h-[24px] flex items-center justify-center rounded-[999px] bg-[#e6e0d3] text-[#7d7362] text-[12px] [font-weight:700]">–</span></span>
                  <span className="flex items-center justify-center py-[12px] px-[0] bg-[#F4EFE5] h-[100%]"><span className="w-[24px] h-[24px] flex items-center justify-center rounded-[999px] bg-[#6E6553] text-[#FCFAF6] text-[12px] [font-weight:700]">✓</span></span>
                </div>
                <div className="grid grid-cols-[minmax(0,1fr)_clamp(46px,12vw,84px)_clamp(46px,12vw,84px)_clamp(52px,13vw,96px)] items-center gap-[6px] [border-top:1px_solid_#F1ECE2]">
                  <span className="py-[13px] px-[14px] text-[clamp(13.5px,3.6vw,15.5px)] leading-[1.35] [font-weight:500] text-[#2A2620]">Ada garansi kalau kurang pas</span>
                  <span className="flex justify-center py-[12px] px-[0]"><span className="w-[24px] h-[24px] flex items-center justify-center rounded-[999px] bg-[#eee9df] text-[#A79B85] text-[12px] [font-weight:700]">✕</span></span>
                  <span className="flex justify-center py-[12px] px-[0]"><span className="w-[24px] h-[24px] flex items-center justify-center rounded-[999px] bg-[#e6e0d3] text-[#7d7362] text-[12px] [font-weight:700]">–</span></span>
                  <span className="flex items-center justify-center py-[12px] px-[0] bg-[#F4EFE5] h-[100%]"><span className="w-[24px] h-[24px] flex items-center justify-center rounded-[999px] bg-[#6E6553] text-[#FCFAF6] text-[12px] [font-weight:700]">✓</span></span>
                </div>
            </div>
            <p className="mt-[22px] mx-[0] mb-[0] py-[18px] px-[20px] bg-[#FCFAF6] [border-left:5px_solid_#6E6553] rounded-[12px] text-[clamp(15px,4vw,18px)] leading-[1.5] text-[#2A2620] text-pretty">Yang kami janjikan hasil akhir yang pas di jendela Anda, rapi dan siap pakai.</p>
            <div className="mt-[26px] mx-[0] mb-[0]">
              <div className="flex flex-col items-stretch gap-[10px]">
                <a href="https://wa.me/6285860525758?text=Halo%20saya%20mau%20pesan%20Gorden%20Custom%2C%2Cbisa%20survey%20ke%20lokasi%3F" target="_blank" rel="noopener noreferrer" className="flex-[1_1_100%] flex items-center justify-center gap-[9px] min-h-[56px] py-[14px] px-[20px] bg-[#25D366] text-[#fff] text-[clamp(15px,3.9vw,17px)] [font-weight:700] tracking-[-0.01em] no-underline rounded-[12px] shadow-[0px_8px_20px_rgba(37,211,102,0.3)] hover:bg-[#1FBA57]"><img src="/assets-c2/whatsapp.svg" alt="" className="flex-none w-[20px] h-[20px] block [filter:brightness(0)_invert(1)]"  loading="lazy" decoding="async" />Konsultasi Gratis →</a>
                <p className="m-[0] text-center text-[clamp(12.5px,3.3vw,13.5px)] leading-[1.45] text-[#6F6757]">Chat langsung dibalas owner, gratis dan tanpa wajib memesan.</p>
                <a href="#katalog" className="self-center inline-flex items-center gap-[6px] min-h-[30px] py-[2px] px-[0] bg-transparent border-0 text-[#585045] text-[clamp(13.5px,3.5vw,15px)] [font-weight:500] [text-decoration:underline] [text-underline-offset:4px] [text-decoration-color:#C7BBA2] hover:text-[#221F1A] hover:[text-decoration-color:#6E6553]">Lihat katalog model dulu</a>
              </div>
              <div className="flex flex-wrap justify-center items-center gap-y-[5px] gap-x-[10px] mt-[12px] mx-[0] mb-[0] text-[clamp(11.5px,3vw,12.5px)] [font-weight:500] text-center text-[#3C3529]">
                <span className="text-[#FFB800] tracking-[1px]">★★★★★</span><strong className="text-[#221F1A]">5,0</strong><span>Google Review</span><span className="opacity-[0.5]">•</span><span>1.000+ pembeli</span><span className="opacity-[0.5]">•</span><span>Garansi pemasangan 14 hari</span>
              </div>
            </div>
          </section>
      
          <section className="py-[clamp(46px,8vw,78px)] px-[0] [border-top:1px_solid_#EDE6DA]">
            <div className="flex flex-wrap items-end justify-between gap-y-[10px] gap-x-[24px] mt-[0] mx-[0] mb-[22px]">
              <div>
                <p className="mt-[0] mx-[0] mb-[10px] text-[11px] [font-weight:600] tracking-[0.22em] uppercase text-[#96876C]">Untuk siapa</p>
                <h2 className="m-[0] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(22px,5.6vw,34px)] leading-[1.16] [font-weight:600] tracking-[-0.03em]">Untuk siapa layanan ini</h2>
              </div>
              <p className="m-[0] max-w-[40ch] text-[15px] text-[#615949]">Kebutuhan tiap ruangan beda, kami bantu cari yang paling cocok.</p>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-[14px]">
 <article className="relative flex flex-col justify-end min-h-[330px] p-[20px] rounded-[4px] overflow-hidden bg-cover bg-center" style={{ backgroundImage: "linear-gradient(to top,rgba(30,25,19,0.9) 0%,rgba(30,25,19,0.62) 28%,rgba(30,25,19,0.22) 58%,rgba(30,25,19,0) 100%),url(/assets-c2/persona-rumah.webp)" }}>
                <span className="absolute top-[16px] left-[18px] [font-family:Poppins,Helvetica,sans-serif] text-[13px] [font-weight:700] tracking-[0.14em] text-[rgba(253,252,250,0.75)]">01</span>
                <h3 className="mt-[0] mx-[0] mb-[6px] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(18px,4.4vw,21px)] [font-weight:700] tracking-[-0.015em] text-[#FCFAF6]">Pemilik rumah baru</h3>
                <p className="m-[0] text-[15px] leading-[1.45] text-[rgba(253,252,250,0.85)]">Rumah baru langsung terasa rapi dan adem, ukur dan pasang urusan kami.</p>
              </article>
 <article className="relative flex flex-col justify-end min-h-[330px] p-[20px] rounded-[4px] overflow-hidden bg-cover bg-center" style={{ backgroundImage: "linear-gradient(to top,rgba(30,25,19,0.9) 0%,rgba(30,25,19,0.62) 28%,rgba(30,25,19,0.22) 58%,rgba(30,25,19,0) 100%),url(/assets-c2/persona-kantor.webp)" }}>
                <span className="absolute top-[16px] left-[18px] [font-family:Poppins,Helvetica,sans-serif] text-[13px] [font-weight:700] tracking-[0.14em] text-[rgba(253,252,250,0.75)]">02</span>
                <h3 className="mt-[0] mx-[0] mb-[6px] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(18px,4.4vw,21px)] [font-weight:700] tracking-[-0.015em] text-[#FCFAF6]">Pemilik &amp; karyawan kantor</h3>
                <p className="m-[0] text-[15px] leading-[1.45] text-[rgba(253,252,250,0.85)]">Layar tidak silau, ruang kerja lebih nyaman sesuai fungsinya.</p>
              </article>
 <article className="relative flex flex-col justify-end min-h-[330px] p-[20px] rounded-[4px] overflow-hidden bg-cover bg-center" style={{ backgroundImage: "linear-gradient(to top,rgba(30,25,19,0.9) 0%,rgba(30,25,19,0.62) 28%,rgba(30,25,19,0.22) 58%,rgba(30,25,19,0) 100%),url(/assets-c2/persona-villa.webp)" }}>
                <span className="absolute top-[16px] left-[18px] [font-family:Poppins,Helvetica,sans-serif] text-[13px] [font-weight:700] tracking-[0.14em] text-[rgba(253,252,250,0.75)]">03</span>
                <h3 className="mt-[0] mx-[0] mb-[6px] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(18px,4.4vw,21px)] [font-weight:700] tracking-[-0.015em] text-[#FCFAF6]">Pemilik villa &amp; apartemen</h3>
                <p className="m-[0] text-[15px] leading-[1.45] text-[rgba(253,252,250,0.85)]">Unit terasa seperti suite hotel, nilai sewanya ikut naik.</p>
              </article>
 <article className="relative flex flex-col justify-end min-h-[330px] p-[20px] rounded-[4px] overflow-hidden bg-cover bg-center" style={{ backgroundImage: "linear-gradient(to top,rgba(30,25,19,0.9) 0%,rgba(30,25,19,0.62) 28%,rgba(30,25,19,0.22) 58%,rgba(30,25,19,0) 100%),url(/assets-c2/persona-usaha.webp)" }}>
                <span className="absolute top-[16px] left-[18px] [font-family:Poppins,Helvetica,sans-serif] text-[13px] [font-weight:700] tracking-[0.14em] text-[rgba(253,252,250,0.75)]">04</span>
                <h3 className="mt-[0] mx-[0] mb-[6px] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(18px,4.4vw,21px)] [font-weight:700] tracking-[-0.015em] text-[#FCFAF6]">Pelaku usaha online</h3>
                <p className="m-[0] text-[15px] leading-[1.45] text-[rgba(253,252,250,0.85)]">Background live dan foto katalog jadi bersih dan konsisten.</p>
              </article>
            </div>
            <div className="mt-[26px] mx-[0] mb-[0]">
              <div className="flex flex-col items-stretch gap-[10px]">
                <a href="https://wa.me/6285860525758?text=Halo%20saya%20mau%20pesan%20Gorden%20Custom%2C%2Cbisa%20survey%20ke%20lokasi%3F" target="_blank" rel="noopener noreferrer" className="flex-[1_1_100%] flex items-center justify-center gap-[9px] min-h-[56px] py-[14px] px-[20px] bg-[#25D366] text-[#fff] text-[clamp(15px,3.9vw,17px)] [font-weight:700] tracking-[-0.01em] no-underline rounded-[12px] shadow-[0px_8px_20px_rgba(37,211,102,0.3)] hover:bg-[#1FBA57]"><img src="/assets-c2/whatsapp.svg" alt="" className="flex-none w-[20px] h-[20px] block [filter:brightness(0)_invert(1)]"  loading="lazy" decoding="async" />Konsultasi Gratis →</a>
                <p className="m-[0] text-center text-[clamp(12.5px,3.3vw,13.5px)] leading-[1.45] text-[#6F6757]">Chat langsung dibalas owner, gratis dan tanpa wajib memesan.</p>
                <a href="#katalog" className="self-center inline-flex items-center gap-[6px] min-h-[30px] py-[2px] px-[0] bg-transparent border-0 text-[#585045] text-[clamp(13.5px,3.5vw,15px)] [font-weight:500] [text-decoration:underline] [text-underline-offset:4px] [text-decoration-color:#C7BBA2] hover:text-[#221F1A] hover:[text-decoration-color:#6E6553]">Lihat katalog model dulu</a>
              </div>
              <div className="flex flex-wrap justify-center items-center gap-y-[5px] gap-x-[10px] mt-[12px] mx-[0] mb-[0] text-[clamp(11.5px,3vw,12.5px)] [font-weight:500] text-center text-[#3C3529]">
                <span className="text-[#FFB800] tracking-[1px]">★★★★★</span><strong className="text-[#221F1A]">5,0</strong><span>Google Review</span><span className="opacity-[0.5]">•</span><span>1.000+ pembeli</span><span className="opacity-[0.5]">•</span><span>Garansi pemasangan 14 hari</span>
              </div>
            </div>
          </section>
      
          <section id="proses" className="py-[clamp(46px,8vw,78px)] px-[0] [border-top:1px_solid_#EDE6DA] scroll-mt-[76px]">
            <div className="flex flex-wrap items-end justify-between gap-y-[10px] gap-x-[24px] mt-[0] mx-[0] mb-[24px]">
              <div>
                <p className="mt-[0] mx-[0] mb-[10px] text-[11px] [font-weight:600] tracking-[0.22em] uppercase text-[#96876C]">Proses kerja</p>
                <h2 className="m-[0] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(22px,5.6vw,34px)] leading-[1.16] [font-weight:600] tracking-[-0.03em]">Empat langkah, Anda tinggal duduk</h2>
              </div>
              <p className="m-[0] max-w-[38ch] text-[15px] text-[#615949]">Dikerjakan tim kami sendiri, dari chat pertama sampai gorden terpasang rapi.</p>
            </div>
            {!isNarrow ? (<>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-[16px] items-stretch">
                <div className="py-[24px] px-[22px] bg-[#FCFAF6] [border:1px_solid_#E8E1D4] rounded-[12px]">
                  <div className="p-[0]">
                    <div className="grid grid-cols-[42px_1fr] gap-[14px] [align-items:start]">
                    <span className="[font-family:Poppins,Helvetica,sans-serif] text-[21px] [font-weight:700] leading-[1.15] tracking-[-0.02em] text-[#A79B85]">01</span>
                    <div>
                      <h3 className="mt-[0] mx-[0] mb-[5px] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(17px,4.2vw,19px)] [font-weight:600] tracking-[-0.01em]">Bisa tanya sampai cocok</h3>
                      <p className="m-[0] text-[15px] leading-[1.5] text-[#615949]">Ceritakan ruangan dan kebutuhan Anda lewat WhatsApp, lalu tentukan jadwal survey yang paling cocok.</p>
                    </div>
                  </div>
                  </div>
                  <div className="pt-[20px] px-[0] pb-[0] [border-top:1px_solid_#ECE5D9] mt-[20px]">
                    <div className="grid grid-cols-[42px_1fr] gap-[14px] [align-items:start]">
                    <span className="[font-family:Poppins,Helvetica,sans-serif] text-[21px] [font-weight:700] leading-[1.15] tracking-[-0.02em] text-[#A79B85]">02</span>
                    <div>
                      <h3 className="mt-[0] mx-[0] mb-[5px] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(17px,4.2vw,19px)] [font-weight:600] tracking-[-0.01em]">Aman dari salah ukur</h3>
                      <p className="m-[0] text-[15px] leading-[1.5] text-[#615949]">Tim datang bawa katalog kain, ukur presisi, dan bantu cocokkan warnanya.</p>
                    </div>
                  </div>
                  </div>
                  <div className="pt-[20px] px-[0] pb-[0] [border-top:1px_solid_#ECE5D9] mt-[20px]">
                    <div className="grid grid-cols-[42px_1fr] gap-[14px] [align-items:start]">
                    <span className="[font-family:Poppins,Helvetica,sans-serif] text-[21px] [font-weight:700] leading-[1.15] tracking-[-0.02em] text-[#A79B85]">03</span>
                    <div>
                      <h3 className="mt-[0] mx-[0] mb-[5px] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(17px,4.2vw,19px)] [font-weight:600] tracking-[-0.01em]">Produksi sesuai ukuran</h3>
                      <p className="m-[0] text-[15px] leading-[1.5] text-[#615949]">Dijahit khusus untuk jendela Anda dengan kain blackout impor, lalu difinishing sistem steam uap.</p>
                    </div>
                  </div>
                  </div>
                  <div className="pt-[20px] px-[0] pb-[0] [border-top:1px_solid_#ECE5D9] mt-[20px]">
                    <div className="grid grid-cols-[42px_1fr] gap-[14px] [align-items:start]">
                    <span className="[font-family:Poppins,Helvetica,sans-serif] text-[21px] [font-weight:700] leading-[1.15] tracking-[-0.02em] text-[#A79B85]">04</span>
                    <div>
                      <h3 className="mt-[0] mx-[0] mb-[5px] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(17px,4.2vw,19px)] [font-weight:600] tracking-[-0.01em]">Pasang &amp; cek akhir</h3>
                      <p className="m-[0] text-[15px] leading-[1.5] text-[#615949]">Dipasang sampai rapi, lalu dicek bersama Anda. Kalau ada yang kurang pas, kami rapikan saat itu juga.</p>
                    </div>
                  </div>
                  </div>
                  <p className="mt-[22px] mx-[0] mb-[0] py-[14px] px-[16px] bg-[#F2EDE3] rounded-[10px] text-[14px] leading-[1.45] text-[#4A4339]"><strong className="text-[#221F1A]">Jadwal fleksibel.</strong> Survey dan pemasangan menyesuaikan waktu Anda, termasuk di luar jam kerja.</p>
                </div>
                <div className="flex flex-col gap-[16px] min-h-[420px]">
 <div className="flex-[1] min-h-[200px] relative flex items-end py-[14px] px-[16px] rounded-[20px] overflow-hidden bg-cover bg-center" style={{ backgroundImage: "linear-gradient(to top,rgba(30,25,19,0.8) 0%,rgba(30,25,19,0.26) 42%,rgba(30,25,19,0) 78%),url(/assets-c2/proses-ukur.webp)" }}>
                    <p className="m-[0] [font-family:Poppins,Helvetica,sans-serif] text-[13px] [font-weight:600] leading-[1.35] text-[#FCFAF6]">Survey &amp; ukur di rumah pelanggan</p>
                  </div>
 <div className="flex-[1] min-h-[200px] relative flex items-end py-[14px] px-[16px] rounded-[20px] overflow-hidden bg-cover bg-center" style={{ backgroundImage: "linear-gradient(to top,rgba(30,25,19,0.8) 0%,rgba(30,25,19,0.26) 42%,rgba(30,25,19,0) 78%),url(/assets-c2/proses-pasang.webp)" }}>
                    <p className="m-[0] [font-family:Poppins,Helvetica,sans-serif] text-[13px] [font-weight:600] leading-[1.35] text-[#FCFAF6]">Dicek bersama sebelum dinyatakan selesai</p>
                  </div>
                </div>
              </div>
            </>) : null}
            {isNarrow ? (<>
              <div className="py-[22px] px-[18px] bg-[#FCFAF6] [border:1px_solid_#E8E1D4] rounded-[12px]">
                  <div className="grid gap-[14px] p-[0]">
                    <div className="grid grid-cols-[42px_1fr] gap-[14px] [align-items:start]">
                    <span className="[font-family:Poppins,Helvetica,sans-serif] text-[21px] [font-weight:700] leading-[1.15] tracking-[-0.02em] text-[#A79B85]">01</span>
                    <div>
                      <h3 className="mt-[0] mx-[0] mb-[5px] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(17px,4.2vw,19px)] [font-weight:600] tracking-[-0.01em]">Bisa tanya sampai cocok</h3>
                      <p className="m-[0] text-[15px] leading-[1.5] text-[#615949]">Ceritakan ruangan dan kebutuhan Anda lewat WhatsApp, lalu tentukan jadwal survey yang paling cocok.</p>
                    </div>
                  </div>
                    
                  </div>
                  <div className="grid gap-[14px] pt-[20px] px-[0] pb-[0] [border-top:1px_solid_#ECE5D9] mt-[20px]">
                    <div className="grid grid-cols-[42px_1fr] gap-[14px] [align-items:start]">
                    <span className="[font-family:Poppins,Helvetica,sans-serif] text-[21px] [font-weight:700] leading-[1.15] tracking-[-0.02em] text-[#A79B85]">02</span>
                    <div>
                      <h3 className="mt-[0] mx-[0] mb-[5px] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(17px,4.2vw,19px)] [font-weight:600] tracking-[-0.01em]">Aman dari salah ukur</h3>
                      <p className="m-[0] text-[15px] leading-[1.5] text-[#615949]">Tim datang bawa katalog kain, ukur presisi, dan bantu cocokkan warnanya.</p>
                    </div>
                  </div>
 <div className="aspect-[16/10] relative flex items-end py-[14px] px-[16px] rounded-[20px] overflow-hidden bg-cover bg-center" style={{ backgroundImage: "linear-gradient(to top,rgba(30,25,19,0.8) 0%,rgba(30,25,19,0.26) 42%,rgba(30,25,19,0) 78%),url(/assets-c2/proses-ukur.webp)" }}>
                    <p className="m-[0] [font-family:Poppins,Helvetica,sans-serif] text-[13px] [font-weight:600] leading-[1.35] text-[#FCFAF6]">Survey &amp; ukur di rumah pelanggan</p>
                  </div>
                  </div>
                  <div className="grid gap-[14px] pt-[20px] px-[0] pb-[0] [border-top:1px_solid_#ECE5D9] mt-[20px]">
                    <div className="grid grid-cols-[42px_1fr] gap-[14px] [align-items:start]">
                    <span className="[font-family:Poppins,Helvetica,sans-serif] text-[21px] [font-weight:700] leading-[1.15] tracking-[-0.02em] text-[#A79B85]">03</span>
                    <div>
                      <h3 className="mt-[0] mx-[0] mb-[5px] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(17px,4.2vw,19px)] [font-weight:600] tracking-[-0.01em]">Produksi sesuai ukuran</h3>
                      <p className="m-[0] text-[15px] leading-[1.5] text-[#615949]">Dijahit khusus untuk jendela Anda dengan kain blackout impor, lalu difinishing sistem steam uap.</p>
                    </div>
                  </div>
                    
                  </div>
                  <div className="grid gap-[14px] pt-[20px] px-[0] pb-[0] [border-top:1px_solid_#ECE5D9] mt-[20px]">
                    <div className="grid grid-cols-[42px_1fr] gap-[14px] [align-items:start]">
                    <span className="[font-family:Poppins,Helvetica,sans-serif] text-[21px] [font-weight:700] leading-[1.15] tracking-[-0.02em] text-[#A79B85]">04</span>
                    <div>
                      <h3 className="mt-[0] mx-[0] mb-[5px] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(17px,4.2vw,19px)] [font-weight:600] tracking-[-0.01em]">Pasang &amp; cek akhir</h3>
                      <p className="m-[0] text-[15px] leading-[1.5] text-[#615949]">Dipasang sampai rapi, lalu dicek bersama Anda. Kalau ada yang kurang pas, kami rapikan saat itu juga.</p>
                    </div>
                  </div>
 <div className="aspect-[16/10] relative flex items-end py-[14px] px-[16px] rounded-[20px] overflow-hidden bg-cover bg-center" style={{ backgroundImage: "linear-gradient(to top,rgba(30,25,19,0.8) 0%,rgba(30,25,19,0.26) 42%,rgba(30,25,19,0) 78%),url(/assets-c2/proses-pasang.webp)" }}>
                    <p className="m-[0] [font-family:Poppins,Helvetica,sans-serif] text-[13px] [font-weight:600] leading-[1.35] text-[#FCFAF6]">Dicek bersama sebelum dinyatakan selesai</p>
                  </div>
                  </div>
                <p className="mt-[22px] mx-[0] mb-[0] py-[14px] px-[16px] bg-[#F2EDE3] rounded-[10px] text-[14px] leading-[1.45] text-[#4A4339]"><strong className="text-[#221F1A]">Jadwal fleksibel.</strong> Survey dan pemasangan menyesuaikan waktu Anda, termasuk di luar jam kerja.</p>
              </div>
            </>) : null}
            <div className="mt-[26px] mx-[0] mb-[0]">
              <div className="flex flex-col items-stretch gap-[10px]">
                <a href="https://wa.me/6285860525758?text=Halo%20saya%20mau%20pesan%20Gorden%20Custom%2C%2Cbisa%20survey%20ke%20lokasi%3F" target="_blank" rel="noopener noreferrer" className="flex-[1_1_100%] flex items-center justify-center gap-[9px] min-h-[56px] py-[14px] px-[20px] bg-[#25D366] text-[#fff] text-[clamp(15px,3.9vw,17px)] [font-weight:700] tracking-[-0.01em] no-underline rounded-[12px] shadow-[0px_8px_20px_rgba(37,211,102,0.3)] hover:bg-[#1FBA57]"><img src="/assets-c2/whatsapp.svg" alt="" className="flex-none w-[20px] h-[20px] block [filter:brightness(0)_invert(1)]"  loading="lazy" decoding="async" />Konsultasi Gratis →</a>
                <p className="m-[0] text-center text-[clamp(12.5px,3.3vw,13.5px)] leading-[1.45] text-[#6F6757]">Chat langsung dibalas owner, gratis dan tanpa wajib memesan.</p>
                <a href="#katalog" className="self-center inline-flex items-center gap-[6px] min-h-[30px] py-[2px] px-[0] bg-transparent border-0 text-[#585045] text-[clamp(13.5px,3.5vw,15px)] [font-weight:500] [text-decoration:underline] [text-underline-offset:4px] [text-decoration-color:#C7BBA2] hover:text-[#221F1A] hover:[text-decoration-color:#6E6553]">Lihat katalog model dulu</a>
              </div>
              <div className="flex flex-wrap justify-center items-center gap-y-[5px] gap-x-[10px] mt-[12px] mx-[0] mb-[0] text-[clamp(11.5px,3vw,12.5px)] [font-weight:500] text-center text-[#3C3529]">
                <span className="text-[#FFB800] tracking-[1px]">★★★★★</span><strong className="text-[#221F1A]">5,0</strong><span>Google Review</span><span className="opacity-[0.5]">•</span><span>1.000+ pembeli</span><span className="opacity-[0.5]">•</span><span>Garansi pemasangan 14 hari</span>
              </div>
            </div>
          </section>
      
          <section className="my-[clamp(30px,5vw,44px)] mx-[0] py-[clamp(24px,5vw,38px)] px-[clamp(18px,4.5vw,32px)] bg-[#FCFAF6] [border:1px_solid_#E5DDCF] rounded-[20px]">
            <div className="max-w-[640px] mt-[0] mx-[auto] mb-[clamp(20px,3.6vw,28px)] text-center">
              <p className="mt-[0] mx-[0] mb-[10px] text-[11px] [font-weight:600] tracking-[0.22em] uppercase text-[#96876C]">Jaminan</p>
              <h2 className="mt-[0] mx-[0] mb-[8px] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(23px,5.6vw,34px)] leading-[1.14] [font-weight:700] tracking-[-0.03em] text-[#221F1A] text-pretty">Garansi pemasangan 14 hari</h2>
              <p className="m-[0] text-[clamp(14.5px,3.9vw,16.5px)] leading-[1.55] text-[#585045] text-pretty">Ada yang kurang pas setelah terpasang? Kami perbaiki tanpa biaya tambahan.</p>
            </div>
            <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-[10px]">
                <div className="flex gap-[12px] items-start py-[16px] px-[16px] bg-[#FAF7F1] [border:1px_solid_#E5DDCF] rounded-[12px]">
                  <span className="flex-none w-[24px] h-[24px] mt-[1px] flex items-center justify-center rounded-[999px] bg-[#6E6553] text-[#FCFAF6] text-[12px] [font-weight:700]">✓</span>
                  <span className="min-w-[0]">
                    <span className="block text-[clamp(14.5px,3.8vw,16px)] [font-weight:600] leading-[1.3] text-[#221F1A]">Perbaikan gratis</span>
                    <span className="block mt-[3px] text-[13.5px] leading-[1.5] text-[#6F6757] text-pretty">Kurang rapi? Kami betulkan.</span>
                  </span>
                </div>
                <div className="flex gap-[12px] items-start py-[16px] px-[16px] bg-[#FAF7F1] [border:1px_solid_#E5DDCF] rounded-[12px]">
                  <span className="flex-none w-[24px] h-[24px] mt-[1px] flex items-center justify-center rounded-[999px] bg-[#6E6553] text-[#FCFAF6] text-[12px] [font-weight:700]">✓</span>
                  <span className="min-w-[0]">
                    <span className="block text-[clamp(14.5px,3.8vw,16px)] [font-weight:600] leading-[1.3] text-[#221F1A]">Survey gratis</span>
                    <span className="block mt-[3px] text-[13.5px] leading-[1.5] text-[#6F6757] text-pretty">Diukur dulu, tanpa biaya.</span>
                  </span>
                </div>
                <div className="flex gap-[12px] items-start py-[16px] px-[16px] bg-[#FAF7F1] [border:1px_solid_#E5DDCF] rounded-[12px]">
                  <span className="flex-none w-[24px] h-[24px] mt-[1px] flex items-center justify-center rounded-[999px] bg-[#6E6553] text-[#FCFAF6] text-[12px] [font-weight:700]">✓</span>
                  <span className="min-w-[0]">
                    <span className="block text-[clamp(14.5px,3.8vw,16px)] [font-weight:600] leading-[1.3] text-[#221F1A]">Harga jujur</span>
                    <span className="block mt-[3px] text-[13.5px] leading-[1.5] text-[#6F6757] text-pretty">Tanpa biaya tersembunyi.</span>
                  </span>
                </div>
                <div className="flex gap-[12px] items-start py-[16px] px-[16px] bg-[#FAF7F1] [border:1px_solid_#E5DDCF] rounded-[12px]">
                  <span className="flex-none w-[24px] h-[24px] mt-[1px] flex items-center justify-center rounded-[999px] bg-[#6E6553] text-[#FCFAF6] text-[12px] [font-weight:700]">✓</span>
                  <span className="min-w-[0]">
                    <span className="block text-[clamp(14.5px,3.8vw,16px)] [font-weight:600] leading-[1.3] text-[#221F1A]">Tim sendiri</span>
                    <span className="block mt-[3px] text-[13.5px] leading-[1.5] text-[#6F6757] text-pretty">Tidak dilempar ke vendor.</span>
                  </span>
                </div>
            </div>
            <div className="max-w-[420px] mt-[clamp(22px,4vw,30px)] mx-[auto] mb-[0]">
              <a href="https://wa.me/6285860525758?text=Halo%20saya%20mau%20pesan%20Gorden%20Custom%2C%2Cbisa%20survey%20ke%20lokasi%3F" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-[9px] min-h-[56px] py-[14px] px-[20px] bg-[#25D366] text-[#fff] text-[clamp(15px,3.9vw,17px)] [font-weight:700] tracking-[-0.01em] no-underline rounded-[12px] shadow-[0px_8px_20px_rgba(37,211,102,0.3)] hover:bg-[#1FBA57]"><img src="/assets-c2/whatsapp.svg" alt="" className="flex-none w-[20px] h-[20px] block [filter:brightness(0)_invert(1)]"  loading="lazy" decoding="async" />Konsultasi Gratis →</a>
              <p className="mt-[10px] mx-[0] mb-[0] text-center text-[clamp(12.5px,3.3vw,13.5px)] leading-[1.45] text-[#6F6757]">Chat langsung dibalas owner, gratis dan tanpa wajib memesan.</p>
              <div className="flex flex-wrap justify-center items-center gap-y-[5px] gap-x-[10px] mt-[12px] mx-[0] mb-[0] text-[clamp(11.5px,3vw,12.5px)] [font-weight:500] text-center text-[#3C3529]">
                <span className="flex items-center gap-[6px] whitespace-nowrap"><span className="text-[#FFB800] tracking-[1px]">★★★★★</span><strong className="text-[#221F1A]">5,0</strong> Google Review</span>
                <span className="opacity-[0.5]">•</span>
                <span className="whitespace-nowrap">1.000+ pembeli</span>
                <span className="opacity-[0.5]">•</span>
                <span className="whitespace-nowrap">Sejak 2012</span>
              </div>
            </div>
          </section>
      
          <section className="w-[100vw] ml-[calc(50%_-_50vw)] py-[clamp(40px,7vw,72px)] px-[0] bg-[#F2EDE3]">
            <div className="max-w-[1000px] my-[0] mx-[auto] pt-[0] px-[clamp(8px,2vw,20px)] pb-[clamp(14px,2.6vw,20px)]">
              <h2 className="m-[0] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(22px,5.6vw,34px)] leading-[1.16] [font-weight:600] tracking-[-0.03em] text-[#221F1A]">Beberapa ruangan lain yang kami kerjakan</h2>
            </div>
            <div className="max-w-[1000px] my-[0] mx-[auto] py-[0] px-[clamp(8px,2vw,20px)] grid grid-cols-[repeat(auto-fill,minmax(min(48%,240px),1fr))] gap-[8px]">
              <figure data-zoom="/assets-c2/p03-blackout-alexandria.webp"  className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center] cursor-zoom-in" style={{ backgroundImage: "url('/assets-c2/p03-blackout-alexandria.webp')" }}>
                <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.62)_100%)]"></div>
                <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[16px] px-[16px] pb-[15px] text-[#FCFAF6]">
                  <span className="block text-[clamp(15px,3.9vw,17px)] [font-weight:500] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.45)]">Blackout custom size</span>
                  <span className="block mt-[3px] text-[12.5px] text-[rgba(252,250,246,0.82)] [text-shadow:0_1px_12px_rgba(0,0,0,0.45)]">Alexandria, Colomadu</span>
                </figcaption>
              </figure>
              <figure data-zoom="/assets-c2/p16-villa-candramaya-klaten.webp"  className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center] cursor-zoom-in" style={{ backgroundImage: "url('/assets-c2/p16-villa-candramaya-klaten.webp')" }}>
                <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.62)_100%)]"></div>
                <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[16px] px-[16px] pb-[15px] text-[#FCFAF6]">
                  <span className="block text-[clamp(15px,3.9vw,17px)] [font-weight:500] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.45)]">Gorden villa</span>
                  <span className="block mt-[3px] text-[12.5px] text-[rgba(252,250,246,0.82)] [text-shadow:0_1px_12px_rgba(0,0,0,0.45)]">Candramaya, Klaten</span>
                </figcaption>
              </figure>
              <figure data-zoom="/assets-c2/p11-hidden-rail-mojolaban.webp"  className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center] cursor-zoom-in" style={{ backgroundImage: "url('/assets-c2/p11-hidden-rail-mojolaban.webp')" }}>
                <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.62)_100%)]"></div>
                <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[16px] px-[16px] pb-[15px] text-[#FCFAF6]">
                  <span className="block text-[clamp(15px,3.9vw,17px)] [font-weight:500] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.45)]">Hidden rail rumah pribadi</span>
                  <span className="block mt-[3px] text-[12.5px] text-[rgba(252,250,246,0.82)] [text-shadow:0_1px_12px_rgba(0,0,0,0.45)]">Mojolaban, Sukoharjo</span>
                </figcaption>
              </figure>
              <figure data-zoom="/assets-c2/p15-smokering-colomadu.webp"  className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center] cursor-zoom-in" style={{ backgroundImage: "url('/assets-c2/p15-smokering-colomadu.webp')" }}>
                <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.62)_100%)]"></div>
                <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[16px] px-[16px] pb-[15px] text-[#FCFAF6]">
                  <span className="block text-[clamp(15px,3.9vw,17px)] [font-weight:500] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.45)]">Smokering custom</span>
                  <span className="block mt-[3px] text-[12.5px] text-[rgba(252,250,246,0.82)] [text-shadow:0_1px_12px_rgba(0,0,0,0.45)]">Colomadu, Karanganyar</span>
                </figcaption>
              </figure>
              <figure data-zoom="/assets-c2/p04-hotel-suma-kedhaton.webp"  className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center] cursor-zoom-in" style={{ backgroundImage: "url('/assets-c2/p04-hotel-suma-kedhaton.webp')" }}>
                <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.62)_100%)]"></div>
                <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[16px] px-[16px] pb-[15px] text-[#FCFAF6]">
                  <span className="block text-[clamp(15px,3.9vw,17px)] [font-weight:500] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.45)]">Blackout kamar hotel</span>
                  <span className="block mt-[3px] text-[12.5px] text-[rgba(252,250,246,0.82)] [text-shadow:0_1px_12px_rgba(0,0,0,0.45)]">Suma Kedhaton, Surakarta</span>
                </figcaption>
              </figure>
              <figure data-zoom="/assets-c2/p13-box-singopuran.webp"  className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[size:cover] bg-[position:center] cursor-zoom-in" style={{ backgroundImage: "url('/assets-c2/p13-box-singopuran.webp')" }}>
                <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.62)_100%)]"></div>
                <figcaption className="absolute left-[0] right-[0] bottom-[0] pt-[16px] px-[16px] pb-[15px] text-[#FCFAF6]">
                  <span className="block text-[clamp(15px,3.9vw,17px)] [font-weight:500] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.45)]">Box custom</span>
                  <span className="block mt-[3px] text-[12.5px] text-[rgba(252,250,246,0.82)] [text-shadow:0_1px_12px_rgba(0,0,0,0.45)]">Singopuran, Colomadu</span>
                </figcaption>
              </figure>
      
            </div>
                <div className="max-w-[1000px] my-[0] mx-[auto] pt-[clamp(18px,3vw,26px)] px-[clamp(8px,2vw,20px)] pb-[0]">
              <div className="flex flex-col items-stretch gap-[10px]">
                <a href="https://wa.me/6285860525758?text=Halo%20saya%20mau%20pesan%20Gorden%20Custom%2C%2Cbisa%20survey%20ke%20lokasi%3F" target="_blank" rel="noopener noreferrer" className="flex-[1_1_100%] flex items-center justify-center gap-[9px] min-h-[56px] py-[14px] px-[20px] bg-[#25D366] text-[#fff] text-[clamp(15px,3.9vw,17px)] [font-weight:700] tracking-[-0.01em] no-underline rounded-[12px] shadow-[0px_8px_20px_rgba(37,211,102,0.3)] hover:bg-[#1FBA57]"><img src="/assets-c2/whatsapp.svg" alt="" className="flex-none w-[20px] h-[20px] block [filter:brightness(0)_invert(1)]"  loading="lazy" decoding="async" />Konsultasi Gratis →</a>
                <p className="m-[0] text-center text-[clamp(12.5px,3.3vw,13.5px)] leading-[1.45] text-[#6F6757]">Chat langsung dibalas owner, gratis dan tanpa wajib memesan.</p>
                <a href="#katalog" className="self-center inline-flex items-center gap-[6px] min-h-[30px] py-[2px] px-[0] bg-transparent border-0 text-[#585045] text-[clamp(13.5px,3.5vw,15px)] [font-weight:500] [text-decoration:underline] [text-underline-offset:4px] [text-decoration-color:#C7BBA2] hover:text-[#221F1A] hover:[text-decoration-color:#6E6553]">Lihat katalog model dulu</a>
              </div>
              <div className="flex flex-wrap justify-center items-center gap-y-[5px] gap-x-[10px] mt-[12px] mx-[0] mb-[0] text-[clamp(11.5px,3vw,12.5px)] [font-weight:500] text-center text-[#3C3529]">
                <span className="text-[#FFB800] tracking-[1px]">★★★★★</span><strong className="text-[#221F1A]">5,0</strong><span>Google Review</span><span className="opacity-[0.5]">•</span><span>1.000+ pembeli</span><span className="opacity-[0.5]">•</span><span>Garansi pemasangan 14 hari</span>
              </div>
            </div>
          </section>
      
          <section className="py-[clamp(46px,8vw,78px)] px-[0] [border-top:1px_solid_#EDE6DA]">
            <p className="mt-[0] mx-[0] mb-[10px] text-[11px] [font-weight:600] tracking-[0.22em] uppercase text-[#96876C]">Tanya jawab</p>
            <h2 className="mt-[0] mx-[0] mb-[8px] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(22px,5.6vw,34px)] leading-[1.16] [font-weight:600] tracking-[-0.03em]">Pertanyaan yang paling sering masuk</h2>
            <p className="mt-[0] mx-[0] mb-[22px] text-[#585045] max-w-[62ch] text-[clamp(14.5px,3.9vw,16.5px)] leading-[1.55]">Klik pertanyaannya untuk melihat jawaban.</p>
            <div className="grid gap-[10px]">
              <details className="bg-[#FCFAF6] [border:1px_solid_#E5DDCF] rounded-[20px] overflow-hidden">
                <summary className="flex items-center gap-[14px] py-[16px] px-[16px] cursor-pointer list-none text-[17px] [font-weight:600] text-[#221F1A]">
                  <span className="flex-none w-[30px] h-[30px] flex items-center justify-center rounded-[999px] bg-[#6E6553] text-[#FCFAF6] text-[14px] [font-weight:700]">1</span>
                  <span className="flex-[1]">Berapa lama proses produksinya?</span>
                  <span className="flex-none text-[22px] leading-[1] text-[#6E6553]">+</span>
                </summary>
                <div className="pt-[0] pr-[18px] pb-[18px] pl-[18px] text-[16px] text-[#4F4840]">Umumnya <strong>7-10 hari kerja setelah survey</strong>, tergantung jumlah jendela dan ketersediaan kain yang Anda pilih. Kalau Anda sedang mengejar tanggal tertentu, sampaikan di awal, nanti kami cek dulu apakah bisa kami kejar.</div>
              </details>
      
              <details className="bg-[#FCFAF6] [border:1px_solid_#E5DDCF] rounded-[20px] overflow-hidden">
                <summary className="flex items-center gap-[14px] py-[16px] px-[16px] cursor-pointer list-none text-[17px] [font-weight:600] text-[#221F1A]">
                  <span className="flex-none w-[30px] h-[30px] flex items-center justify-center rounded-[999px] bg-[#6E6553] text-[#FCFAF6] text-[14px] [font-weight:700]">2</span>
                  <span className="flex-[1]">Apakah ada diskon?</span>
                  <span className="flex-none text-[22px] leading-[1] text-[#6E6553]">+</span>
                </summary>
                <div className="pt-[0] pr-[18px] pb-[18px] pl-[18px] text-[16px] text-[#4F4840]">Ada promo tertentu tergantung periode dan jumlah jendela yang dikerjakan. Paling enak tanya langsung ke owner via WhatsApp, biar kami info promo yang benar-benar aktif sekarang, bukan yang sudah lewat.</div>
              </details>
      
              <details className="bg-[#FCFAF6] [border:1px_solid_#E5DDCF] rounded-[20px] overflow-hidden">
                <summary className="flex items-center gap-[14px] py-[16px] px-[16px] cursor-pointer list-none text-[17px] [font-weight:600] text-[#221F1A]">
                  <span className="flex-none w-[30px] h-[30px] flex items-center justify-center rounded-[999px] bg-[#6E6553] text-[#FCFAF6] text-[14px] [font-weight:700]">3</span>
                  <span className="flex-[1]">Kapan waktu pemasangannya?</span>
                  <span className="flex-none text-[22px] leading-[1] text-[#6E6553]">+</span>
                </summary>
                <div className="pt-[0] pr-[18px] pb-[18px] pl-[18px] text-[16px] text-[#4F4840]">Dijadwalkan sesuai kesepakatan setelah produksi selesai, biasanya <strong>7-10 hari kerja</strong> setelahnya. Anda pilih hari dan jamnya; kami yang menyesuaikan.</div>
              </details>
      
              <details className="bg-[#FCFAF6] [border:1px_solid_#E5DDCF] rounded-[20px] overflow-hidden">
                <summary className="flex items-center gap-[14px] py-[16px] px-[16px] cursor-pointer list-none text-[17px] [font-weight:600] text-[#221F1A]">
                  <span className="flex-none w-[30px] h-[30px] flex items-center justify-center rounded-[999px] bg-[#6E6553] text-[#FCFAF6] text-[14px] [font-weight:700]">4</span>
                  <span className="flex-[1]">Kalau setelah dipasang ada yang kurang pas?</span>
                  <span className="flex-none text-[22px] leading-[1] text-[#6E6553]">+</span>
                </summary>
                <div className="pt-[0] pr-[18px] pb-[18px] pl-[18px] text-[16px] text-[#4F4840]">Masuk garansi pemasangan 14 hari. Kabari saja, kami datang memperbaiki tanpa biaya tambahan.</div>
              </details>
      
              <details className="bg-[#FCFAF6] [border:1px_solid_#E5DDCF] rounded-[20px] overflow-hidden">
                <summary className="flex items-center gap-[14px] py-[16px] px-[16px] cursor-pointer list-none text-[17px] [font-weight:600] text-[#221F1A]">
                  <span className="flex-none w-[30px] h-[30px] flex items-center justify-center rounded-[999px] bg-[#6E6553] text-[#FCFAF6] text-[14px] [font-weight:700]">5</span>
                  <span className="flex-[1]">Apakah survey dan konsultasi dikenakan biaya?</span>
                  <span className="flex-none text-[22px] leading-[1] text-[#6E6553]">+</span>
                </summary>
                <div className="pt-[0] pr-[18px] pb-[18px] pl-[18px] text-[16px] text-[#4F4840]">Tidak. Konsultasi dan survey ke lokasi gratis untuk area Solo Raya.</div>
              </details>
      
              <details className="bg-[#FCFAF6] [border:1px_solid_#E5DDCF] rounded-[20px] overflow-hidden">
                <summary className="flex items-center gap-[14px] py-[16px] px-[16px] cursor-pointer list-none text-[17px] [font-weight:600] text-[#221F1A]">
                  <span className="flex-none w-[30px] h-[30px] flex items-center justify-center rounded-[999px] bg-[#6E6553] text-[#FCFAF6] text-[14px] [font-weight:700]">6</span>
                  <span className="flex-[1]">Bisa bantu pilih model kalau saya belum ada bayangan?</span>
                  <span className="flex-none text-[22px] leading-[1] text-[#6E6553]">+</span>
                </summary>
                <div className="pt-[0] pr-[18px] pb-[18px] pl-[18px] text-[16px] text-[#4F4840]">Justru itu tugas kami. Ceritakan fungsi ruangannya dan arah jendelanya, nanti owner yang bantu susun pilihannya, bukan Anda yang dibiarkan menebak sendiri.</div>
              </details>
            </div>
            
            <div className="mt-[26px] mx-[0] mb-[0]">
              <div className="flex flex-col items-stretch gap-[10px]">
                <a href="https://wa.me/6285860525758?text=Halo%20saya%20mau%20pesan%20Gorden%20Custom%2C%2Cbisa%20survey%20ke%20lokasi%3F" target="_blank" rel="noopener noreferrer" className="flex-[1_1_100%] flex items-center justify-center gap-[9px] min-h-[56px] py-[14px] px-[20px] bg-[#25D366] text-[#fff] text-[clamp(15px,3.9vw,17px)] [font-weight:700] tracking-[-0.01em] no-underline rounded-[12px] shadow-[0px_8px_20px_rgba(37,211,102,0.3)] hover:bg-[#1FBA57]"><img src="/assets-c2/whatsapp.svg" alt="" className="flex-none w-[20px] h-[20px] block [filter:brightness(0)_invert(1)]"  loading="lazy" decoding="async" />Konsultasi Gratis →</a>
                <p className="m-[0] text-center text-[clamp(12.5px,3.3vw,13.5px)] leading-[1.45] text-[#6F6757]">Chat langsung dibalas owner, gratis dan tanpa wajib memesan.</p>
                <a href="#katalog" className="self-center inline-flex items-center gap-[6px] min-h-[30px] py-[2px] px-[0] bg-transparent border-0 text-[#585045] text-[clamp(13.5px,3.5vw,15px)] [font-weight:500] [text-decoration:underline] [text-underline-offset:4px] [text-decoration-color:#C7BBA2] hover:text-[#221F1A] hover:[text-decoration-color:#6E6553]">Lihat katalog model dulu</a>
              </div>
              <div className="flex flex-wrap justify-center items-center gap-y-[5px] gap-x-[10px] mt-[12px] mx-[0] mb-[0] text-[clamp(11.5px,3vw,12.5px)] [font-weight:500] text-center text-[#3C3529]">
                <span className="text-[#FFB800] tracking-[1px]">★★★★★</span><strong className="text-[#221F1A]">5,0</strong><span>Google Review</span><span className="opacity-[0.5]">•</span><span>1.000+ pembeli</span><span className="opacity-[0.5]">•</span><span>Garansi pemasangan 14 hari</span>
              </div>
            </div>
          </section>
      
          <section className="mt-[44px] mx-[0] mb-[0] py-[clamp(24px,5.5vw,32px)] px-[clamp(16px,4.5vw,24px)] bg-[#6E6553] text-[#FCFAF6] rounded-[12px]">
            <p className="mt-[0] mx-[0] mb-[10px] text-[12px] [font-weight:700] tracking-[0.14em] uppercase text-[rgba(253,252,250,0.75)]">Area layanan</p>
            <h2 className="mt-[0] mx-[0] mb-[8px] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(22px,5.6vw,34px)] leading-[1.16] [font-weight:600] tracking-[-0.03em]">Survey &amp; pasang di seluruh Solo Raya</h2>
            <p className="mt-[0] mx-[0] mb-[20px] text-[rgba(253,252,250,0.85)] max-w-[62ch]">Workshop kami di Jl. Songgolangit 22, Gentan, Solo, dan tim datang ke lokasi Anda tanpa biaya survey.</p>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(46%,130px),1fr))] gap-[10px]">
              <span className="py-[14px] px-[16px] bg-[rgba(253,252,250,0.12)] [border:1px_solid_rgba(253,252,250,0.28)] rounded-[12px] text-[17px] [font-weight:600] text-center">Solo</span>
              <span className="py-[14px] px-[16px] bg-[rgba(253,252,250,0.12)] [border:1px_solid_rgba(253,252,250,0.28)] rounded-[12px] text-[17px] [font-weight:600] text-center">Sukoharjo</span>
              <span className="py-[14px] px-[16px] bg-[rgba(253,252,250,0.12)] [border:1px_solid_rgba(253,252,250,0.28)] rounded-[12px] text-[17px] [font-weight:600] text-center">Karanganyar</span>
              <span className="py-[14px] px-[16px] bg-[rgba(253,252,250,0.12)] [border:1px_solid_rgba(253,252,250,0.28)] rounded-[12px] text-[17px] [font-weight:600] text-center">Boyolali</span>
              <span className="py-[14px] px-[16px] bg-[rgba(253,252,250,0.12)] [border:1px_solid_rgba(253,252,250,0.28)] rounded-[12px] text-[17px] [font-weight:600] text-center">Klaten</span>
              <span className="py-[14px] px-[16px] bg-[rgba(253,252,250,0.12)] [border:1px_solid_rgba(253,252,250,0.28)] rounded-[12px] text-[17px] [font-weight:600] text-center">Sragen</span>
            </div>
            <p className="mt-[18px] mx-[0] mb-[0] text-[16px] text-[rgba(253,252,250,0.85)]">Di luar area tersebut? Tanyakan dulu lewat WhatsApp, biasanya masih bisa kami bantu.</p>
      
            <div className="mt-[26px] mx-[0] mb-[0]">
              <div className="flex flex-col items-stretch gap-[10px]">
                <a href="https://wa.me/6285860525758?text=Halo%20saya%20mau%20pesan%20Gorden%20Custom%2C%2Cbisa%20survey%20ke%20lokasi%3F" target="_blank" rel="noopener noreferrer" className="flex-[1_1_100%] flex items-center justify-center gap-[9px] min-h-[56px] py-[14px] px-[20px] bg-[#25D366] text-[#fff] text-[clamp(15px,3.9vw,17px)] [font-weight:700] tracking-[-0.01em] no-underline rounded-[12px] shadow-[0px_8px_20px_rgba(37,211,102,0.3)] hover:bg-[#1FBA57]"><img src="/assets-c2/whatsapp.svg" alt="" className="flex-none w-[20px] h-[20px] block [filter:brightness(0)_invert(1)]"  loading="lazy" decoding="async" />Konsultasi Gratis →</a>
                <p className="m-[0] text-center text-[clamp(12.5px,3.3vw,13.5px)] leading-[1.45] text-[rgba(252,250,246,0.78)]">Chat langsung dibalas owner, gratis dan tanpa wajib memesan.</p>
                <a href="#katalog" className="self-center inline-flex items-center gap-[6px] min-h-[30px] py-[2px] px-[0] bg-transparent border-0 text-[rgba(252,250,246,0.9)] text-[clamp(13.5px,3.5vw,15px)] [font-weight:500] [text-decoration:underline] [text-underline-offset:4px] [text-decoration-color:rgba(252,250,246,0.45)] hover:text-[#FCFAF6] hover:[text-decoration-color:#FCFAF6]">Lihat katalog model dulu</a>
              </div>
              <div className="flex flex-wrap justify-center items-center gap-y-[5px] gap-x-[10px] mt-[12px] mx-[0] mb-[0] text-[clamp(11.5px,3vw,12.5px)] [font-weight:500] text-center text-[rgba(253,252,250,0.95)]">
                <span className="text-[#FFB800] text-[12.5px] tracking-[1px]">★★★★★</span>
                <strong className="text-[#FCFAF6]">5,0</strong>
                <span>Google Review</span>
                <span className="text-[rgba(253,252,250,0.4)]">•</span>
                <span>1.000+ pembeli</span>
                <span className="text-[rgba(253,252,250,0.4)]">•</span>
                <span>Garansi pemasangan 14 hari</span>
              </div>
            </div>
          </section>
      
          
      
          <footer className="pt-[34px] px-[0] pb-[0] mt-[30px] [border-top:1px_solid_#E5DDCF] text-[15px] text-[#585045] grid gap-[6px]">
            <p className="mt-[0] mx-[0] mb-[6px] [font-family:Poppins,Helvetica,sans-serif] text-[19px] [font-weight:600] text-[oklch(0.24_0.02_60)]">Gorden Wallpaper Solo</p>
            <p className="m-[0]">Jl. Songgolangit 22, Gentan, Solo</p>
            <p className="m-[0]">WhatsApp: <a href="https://wa.me/6285860525758" target="_blank" rel="noopener noreferrer" className="[font-weight:600]">085.860.52.57.58</a></p>
            <p className="m-[0]">Jam operasional online: 24 jam, setiap hari</p>
            <p className="m-[0]">Workshop: Senin-Sabtu 09.00-17.00, Minggu dan hari libur by appointment</p>
            <p className="m-[0]"><a href="https://instagram.com/gorden.wallpapersolo" target="_blank" rel="noopener noreferrer">Instagram @gorden.wallpapersolo</a> · <a href="https://facebook.com/search/top?q=gorden%20wallpaper%20solo" target="_blank" rel="noopener noreferrer">Facebook Gorden Wallpaper Solo</a></p>
            <p className="mt-[8px] mx-[0] mb-[0] text-[13px] text-[oklch(0.58_0.03_70)]">Melayani gorden custom rumah &amp; kantor di Solo, Sukoharjo, Karanganyar, Boyolali, Klaten, dan Sragen sejak 2012.</p>
          </footer>
      
        </div>
      
        {!!lightbox ? (<>
          <div onClick={closeLightbox} className="fixed inset-0 z-[90] flex items-center justify-center p-[20px] bg-[rgba(28,25,20,0.88)] [cursor:zoom-out]">
            <div onClick={stopClick} className="flex flex-col items-center gap-[14px] max-w-[100%] max-h-[100%] cursor-default">
              <img alt="Pratinjau gambar" ref={lightboxImgRef} className="max-w-[100%] max-h-[74vh] w-[auto] h-[auto] rounded-[12px] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)]"  loading="lazy" decoding="async" />
              {lightboxCaption ? (<>
                <p className="m-[0] max-w-[42ch] text-center [font-family:Poppins,Helvetica,sans-serif] text-[15px] leading-[1.45] [font-weight:600] text-[#FCFAF6]">{lightboxCaption}</p>
              </>) : null}
              {lbList.length > 1 ? (<>
                <div className="flex items-center gap-[14px]">
                  <button type="button" onClick={lightboxPrev} aria-label="Foto sebelumnya" className="w-[44px] h-[44px] flex items-center justify-center rounded-[999px] border-0 bg-[rgba(253,252,250,0.92)] text-[#3a352c] text-[20px] cursor-pointer">‹</button>
                  <span className="text-[13px] [font-weight:600] text-[rgba(253,252,250,0.8)]">{lightboxPos}</span>
                  <button type="button" onClick={lightboxNext} aria-label="Foto selanjutnya" className="w-[44px] h-[44px] flex items-center justify-center rounded-[999px] border-0 bg-[rgba(253,252,250,0.92)] text-[#3a352c] text-[20px] cursor-pointer">›</button>
                </div>
              </>) : null}
            </div>
            <button type="button" onClick={closeLightbox} aria-label="Tutup" className="absolute top-[16px] right-[16px] w-[42px] h-[42px] flex items-center justify-center rounded-[999px] border-0 bg-[rgba(253,252,250,0.92)] text-[#3a352c] text-[20px] cursor-pointer">✕</button>
          </div>
        </>) : null}
      
        {showNudge ? (<>
          <a href="https://wa.me/6285860525758?text=Halo%20saya%20mau%20pesan%20Gorden%20Custom%2C%2Cbisa%20survey%20ke%20lokasi%3F" target="_blank" rel="noopener noreferrer" onClick={closeNudge} className="fixed right-[18px] bottom-[42px] min-[761px]:bottom-[88px] z-[59] max-w-[min(214px,calc(100vw-110px))] min-[761px]:max-w-[min(320px,calc(100vw-36px))] flex items-start gap-[10px] pt-[9px] pr-[34px] pb-[9px] pl-[10px] min-[761px]:pt-[15px] min-[761px]:pr-[16px] min-[761px]:pb-[15px] min-[761px]:pl-[16px] bg-[#FCFAF6] [border:1px_solid_#E5DDCF] rounded-[16px] shadow-[0_18px_44px_-18px_rgba(32,29,24,0.42)] no-underline cursor-pointer hover:bg-[#F7F3EA]">
            <img src="/assets-c2/owner-elang.webp" alt="" className="flex-none w-[26px] h-[26px] min-[761px]:w-[42px] min-[761px]:h-[42px] rounded-[999px] object-cover bg-[#F2EDE3] [border:1px_solid_#E5DDCF]"  loading="lazy" decoding="async" width="320" height="320" />
            <div className="min-w-[0]">
              <p className="mt-[0] mx-[0] mb-[3px] [font-family:Poppins,Helvetica,sans-serif] text-[11.5px] min-[761px]:text-[14px] [font-weight:700] leading-[1.3] text-[#221F1A]">Pak Elang - Owner Gorden Wallpaper Solo</p>
              <p className="mt-[0] mx-[0] mb-[7px] text-[11.5px] min-[761px]:text-[13.5px] leading-[1.4] text-[#585045] text-pretty"><span className="min-[761px]:hidden">Bingung pilih model? Tanya saya.</span><span className="hidden min-[761px]:inline">Masih bingung pilih model atau ukuran? Tanya langsung ke saya di WA.</span></p>
              <span className="inline-flex items-center gap-[6px] text-[11.5px] min-[761px]:text-[13.5px] [font-weight:700] text-[#1EA855]">Balas sekarang <span aria-hidden="true">→</span></span>
            </div>
            <button type="button" onClick={closeNudgeBtn} aria-label="Tutup" className="absolute top-[-10px] right-[-8px] w-[28px] h-[28px] flex items-center justify-center rounded-[999px] border-0 bg-[#221F1A] text-[#FCFAF6] text-[13px] leading-[1] cursor-pointer">✕</button>
          </a>
        </>) : null}
      
        <a href="https://wa.me/6285860525758?text=Halo%20saya%20mau%20pesan%20Gorden%20Custom%2C%2Cbisa%20survey%20ke%20lokasi%3F" target="_blank" rel="noopener noreferrer" aria-label="Konsultasi gratis via WhatsApp" className="fixed right-[18px] bottom-[18px] z-[60] flex items-center justify-center w-[58px] h-[58px] rounded-[999px] no-underline shadow-[0_14px_28px_-10px_rgba(37,211,102,0.6)] bg-[#25D366] hover:bg-[#1EBE5A] active:bg-[#19A84F]">
          <img src="/assets-c2/whatsapp.svg" alt="" className="w-[32px] h-[32px] block [filter:brightness(0)_invert(1)]"  loading="lazy" decoding="async" />
        </a>
      </div>
    </>
  );
}
