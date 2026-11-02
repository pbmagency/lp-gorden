import { Head } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';

type LightboxItem = { src: string; caption: string };

const reviewShots: string[] = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => `/assets-lp2/review-${n}.webp`);
const reviewSlides: string[] = [...reviewShots, ...reviewShots, ...reviewShots];
const N = reviewShots.length;

export default function GordenWallpaperSoloLanding() {
  const [isNarrow, setIsNarrow] = useState<boolean>(false);
  const [katMore, setKatMore] = useState<boolean>(false);
  const [nudge, setNudge] = useState<boolean>(false);
  const [nudgeClosed, setNudgeClosed] = useState<boolean>(false);
  const [reviewPos, setReviewPos] = useState<number>(N);
  const [reviewNoAnim, setReviewNoAnim] = useState<boolean>(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [lbList, setLbList] = useState<LightboxItem[]>([]);
  const [lbIdx, setLbIdx] = useState<number>(0);

  const reviewIdx = ((reviewPos % N) + N) % N;
  const lightboxCaption = lbList[lbIdx]?.caption ?? '';
  const lightboxPos = lbList.length > 1 ? `${lbIdx + 1} / ${lbList.length}` : '';

  const reviewTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const normTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const posRef = useRef<number>(N);

  /* breakpoint 760px (dipakai hanya untuk perhitungan geser carousel) */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 760px)');
    const onMq = () => setIsNarrow(mq.matches);
    onMq();
    mq.addEventListener('change', onMq);
    return () => mq.removeEventListener('change', onMq);
  }, []);

  /* popup WA muncul saat pertengahan section katalog */
  useEffect(() => {
    if (nudge) return;
    const onScroll = () => {
      const k = document.getElementById('katalog');
      if (!k) return;
      const r = k.getBoundingClientRect();
      if (r.top + r.height / 2 <= window.innerHeight * 0.6) setNudge(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [nudge]);

  /* carousel ulasan: geser halus + loop tanpa lompat ke awal */
  const advanceReview = useCallback((d: number) => {
    const pos = posRef.current + d;
    posRef.current = pos;
    setReviewNoAnim(false);
    setReviewPos(pos);
    if (normTimer.current) clearTimeout(normTimer.current);
    normTimer.current = setTimeout(() => {
      const p = posRef.current;
      if (p < N || p >= 2 * N) {
        const np = N + (((p % N) + N) % N);
        posRef.current = np;
        setReviewNoAnim(true);
        setReviewPos(np);
        setTimeout(() => setReviewNoAnim(false), 40);
      }
    }, 760);
  }, []);

  const startTimer = useCallback(() => {
    if (reviewTimer.current) clearInterval(reviewTimer.current);
    reviewTimer.current = setInterval(() => advanceReview(1), 3500);
  }, [advanceReview]);

  useEffect(() => {
    startTimer();
    return () => {
      if (reviewTimer.current) clearInterval(reviewTimer.current);
      if (normTimer.current) clearTimeout(normTimer.current);
    };
  }, [startTimer]);

  const stepReview = useCallback((d: number) => {
    advanceReview(d);
    startTimer();
  }, [advanceReview, startTimer]);

  const reviewPrevClick = useCallback(() => stepReview(-1), [stepReview]);
  const reviewNextClick = useCallback(() => stepReview(1), [stepReview]);

  const onSlideClick = useCallback((i: number) => {
    if (i === reviewPos) {
      setLbList(reviewShots.map((src) => ({ src, caption: '' })));
      setLbIdx(reviewIdx);
      setLightbox(reviewShots[reviewIdx]);
    } else {
      stepReview(i - reviewPos);
    }
  }, [reviewPos, reviewIdx, stepReview]);

  /* lightbox untuk semua elemen [data-zoom] */
  useEffect(() => {
    const onZoomClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-zoom]');
      if (!target) return;
      const scope: ParentNode = target.closest('section') ?? document;
      const nodes = Array.from(scope.querySelectorAll<HTMLElement>('[data-zoom]'));
      const list: LightboxItem[] = nodes.map((n) => {
        const cap = n.querySelector('figcaption');
        let parts: string[] = [];
        if (cap) parts = Array.from(cap.querySelectorAll('span')).map((x) => (x.textContent ?? '').trim()).filter(Boolean);
        if (!parts.length) {
          const box = n.parentElement;
          parts = box ? Array.from(box.querySelectorAll('p')).map((p) => (p.textContent ?? '').trim()).filter(Boolean) : [];
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

  const closeLightbox = useCallback(() => {
    setLightbox(null);
    setLbList([]);
    setLbIdx(0);
  }, []);

  const moveLightbox = useCallback((d: number) => {
    if (!lbList.length) return;
    const i = (lbIdx + d + lbList.length) % lbList.length;
    setLbIdx(i);
    setLightbox(lbList[i].src);
  }, [lbIdx, lbList]);

  const lightboxPrev = useCallback((e?: ReactMouseEvent) => { e?.stopPropagation(); moveLightbox(-1); }, [moveLightbox]);
  const lightboxNext = useCallback((e?: ReactMouseEvent) => { e?.stopPropagation(); moveLightbox(1); }, [moveLightbox]);
  const stopClick = useCallback((e: ReactMouseEvent) => e.stopPropagation(), []);

  /* keyboard: Esc tutup, panah kiri/kanan navigasi */
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') moveLightbox(-1);
      if (e.key === 'ArrowRight') moveLightbox(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, closeLightbox, moveLightbox]);

  const toggleKatMore = useCallback(() => setKatMore((v) => !v), []);
  const closeNudge = useCallback(() => setNudgeClosed(true), []);
  const closeNudgeBtn = useCallback((e: ReactMouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setNudgeClosed(true);
  }, []);

  return (
    <>
      <Head title="Gorden Custom Solo – Survey Gratis & Garansi 14 Hari" />
      <style>{`@keyframes omBob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(6px); } }
@keyframes reviewMarquee { from { transform: translateX(0); } to { transform: translateX(calc(-50% - 7px)); } }`}</style>
      <div className="[font-family:Poppins,Helvetica,sans-serif] antialiased bg-[#FAF7F1]">

        <div className="bg-[#FAF7F1] text-[#201D18] [font-family:Poppins,Helvetica,sans-serif] text-[17px] leading-[1.62] overflow-x-clip">

          <div className="sticky top-[0] z-[60] bg-[rgba(250,248,244,0.95)] backdrop-blur-[10px] [border-bottom:1px_solid_#E1D9C9]">
            <div className="bg-[#23201B] text-[#FCFAF6]">
              <p className="max-w-[1000px] my-[0] mx-[auto] py-[7px] px-[10px] flex flex-nowrap whitespace-nowrap justify-center items-center gap-[6px] text-[clamp(10.5px,2.9vw,13px)] [font-weight:500] leading-[1.3] text-center"><span><strong className="[font-weight:700] text-[#E8BE6A]">Survey GRATIS</strong> ke lokasi</span><span aria-hidden="true" className="opacity-[0.45]">•</span><span><strong className="[font-weight:700] text-[#E8BE6A]">Garansi 14 hari</strong> pemasangan</span></p>
            </div>
            <div className="max-w-[1000px] my-[0] mx-[auto] py-[10px] px-[20px] flex items-center justify-between gap-[12px]">
              <img src="/assets-lp2/logo.webp" alt="Gorden Wallpaper Solo" className="h-[52px] w-[auto] block" />
              <a href="https://wa.me/6285860525758?text=Halo%20saya%20mau%20pesan%20Gorden%20Custom%2C%2Cbisa%20survey%20ke%20lokasi%3F" target="_blank" rel="noopener" className="flex items-center justify-center min-h-[46px] py-[11px] px-[18px] bg-[#25D366] text-[#fff] text-[15px] [font-weight:600] no-underline rounded-[10px] whitespace-nowrap gap-[9px] shadow-[0px_8px_20px_rgba(37,211,102,0.3)] hover:bg-[#1FBA57]"><img src="/assets-lp2/whatsapp.svg" alt="" className="flex-none w-[20px] h-[20px] block [filter:brightness(0)_invert(1)]" />Konsultasi Gratis →</a>
            </div>
          </div>

          <div className="max-w-[1000px] my-[0] mx-[auto] [padding:12px_clamp(14px,4vw,20px)_60px]">

            <section className="relative p-[0] min-h-[max(560px,calc(100svh-70px))] flex flex-col justify-end min-[761px]:justify-center">
              <div className="absolute top-[0] bottom-[0] left-[calc(50%_-_50vw)] w-[100vw] overflow-hidden bg-[#1C1915]">
                <div className="contents max-[760px]:hidden">
                  <div className="absolute inset-0 grid grid-cols-[repeat(4,minmax(0,1fr))] gap-[8px] p-[8px] min-[761px]:gap-[12px] min-[761px]:p-[12px]">
                    <div className="flex flex-col gap-[8px] min-[761px]:gap-[12px] min-h-[0]">
                      <div data-zoom="/assets-lp2/p17-kaca-besar-tawangsari.webp" className="flex-[1.25_1_0] min-h-[0] rounded-[12px] bg-[#2A2620] bg-[image:url(/assets-lp2/p17-kaca-besar-tawangsari.webp)] bg-[size:cover] bg-[position:center] cursor-zoom-in"></div>
                      <div data-zoom="/assets-lp2/katalog-wooden-blinds.webp" className="flex-[1_1_0] min-h-[0] rounded-[12px] bg-[#2A2620] bg-[image:url(/assets-lp2/katalog-wooden-blinds.webp)] bg-[size:cover] bg-[position:center] cursor-zoom-in"></div>
                    </div>
                    <div className="flex flex-col gap-[8px] min-[761px]:gap-[12px] min-h-[0]">
                      <div data-zoom="/assets-lp2/katalog-roller-blinds.webp" className="flex-[1_1_0] min-h-[0] rounded-[12px] bg-[#2A2620] bg-[image:url(/assets-lp2/katalog-roller-blinds.webp)] bg-[size:cover] bg-[position:center_35%] cursor-zoom-in"></div>
                      <div data-zoom="/assets-lp2/p05-box-full-plafon-wonosari.webp" className="flex-[1.5_1_0] min-h-[0] rounded-[12px] bg-[#2A2620] bg-[image:url(/assets-lp2/p05-box-full-plafon-wonosari.webp)] bg-[size:cover] bg-[position:center] cursor-zoom-in"></div>
                    </div>
                    <div className="flex flex-col gap-[8px] min-[761px]:gap-[12px] min-h-[0]">
                      <div data-zoom="/assets-lp2/katalog-vertical-blinds.webp" className="flex-[1.6_1_0] min-h-[0] rounded-[12px] bg-[#2A2620] bg-[image:url(/assets-lp2/katalog-vertical-blinds.webp)] bg-[size:cover] bg-[position:center_30%] cursor-zoom-in"></div>
                      <div data-zoom="/assets-lp2/p14-box-glossy-permata-mayang.webp" className="flex-[1_1_0] min-h-[0] rounded-[12px] bg-[#2A2620] bg-[image:url(/assets-lp2/p14-box-glossy-permata-mayang.webp)] bg-[size:cover] bg-[position:center] cursor-zoom-in"></div>
                    </div>
                    <div className="flex flex-col gap-[8px] min-[761px]:gap-[12px] min-h-[0]">
                      <div data-zoom="/assets-lp2/p12-villa-the-ponggok.webp" className="flex-[1_1_0] min-h-[0] rounded-[12px] bg-[#2A2620] bg-[image:url(/assets-lp2/p12-villa-the-ponggok.webp)] bg-[size:cover] bg-[position:center] cursor-zoom-in"></div>
                      <div data-zoom="/assets-lp2/img-zebra-blinds.webp" className="flex-[1.4_1_0] min-h-[0] rounded-[12px] bg-[#2A2620] bg-[image:url(/assets-lp2/img-zebra-blinds.webp)] bg-[size:cover] bg-[position:center] cursor-zoom-in"></div>
                      <div data-zoom="/assets-lp2/p03-blackout-alexandria.webp" className="flex-[1_1_0] min-h-[0] rounded-[12px] bg-[#2A2620] bg-[image:url(/assets-lp2/p03-blackout-alexandria.webp)] bg-[size:cover] bg-[position:center] cursor-zoom-in"></div>
                    </div>
                  </div>
                  </div>
                <div className="hidden max-[760px]:contents">
                  <div className="absolute inset-0 grid grid-cols-[repeat(3,minmax(0,1fr))] gap-[6px] p-[6px] items-start">
                    <div className="flex flex-col gap-[6px] mt-[0px]">
                      <div data-zoom="/assets-lp2/p17-kaca-besar-tawangsari.webp" className="aspect-[3/4] flex-none rounded-[10px] bg-[#2A2620] bg-[image:url(/assets-lp2/p17-kaca-besar-tawangsari.webp)] bg-[size:cover] bg-[position:center] cursor-zoom-in"></div>
                      <div data-zoom="/assets-lp2/katalog-wooden-blinds.webp" className="aspect-[3/4] flex-none rounded-[10px] bg-[#2A2620] bg-[image:url(/assets-lp2/katalog-wooden-blinds.webp)] bg-[size:cover] bg-[position:center] cursor-zoom-in"></div>
                      <div data-zoom="/assets-lp2/p03-blackout-alexandria.webp" className="aspect-[3/4] flex-none rounded-[10px] bg-[#2A2620] bg-[image:url(/assets-lp2/p03-blackout-alexandria.webp)] bg-[size:cover] bg-[position:center] cursor-zoom-in"></div>
                      <div data-zoom="/assets-lp2/p12-villa-the-ponggok.webp" className="aspect-[3/4] flex-none rounded-[10px] bg-[#2A2620] bg-[image:url(/assets-lp2/p12-villa-the-ponggok.webp)] bg-[size:cover] bg-[position:center] cursor-zoom-in"></div>
                    </div>
                    <div className="flex flex-col gap-[6px] mt-[-42px]">
                      <div data-zoom="/assets-lp2/katalog-vertical-blinds.webp" className="aspect-[3/4] flex-none rounded-[10px] bg-[#2A2620] bg-[image:url(/assets-lp2/katalog-vertical-blinds.webp)] bg-[size:cover] bg-[position:center_30%] cursor-zoom-in"></div>
                      <div data-zoom="/assets-lp2/img-zebra-blinds.webp" className="aspect-[3/4] flex-none rounded-[10px] bg-[#2A2620] bg-[image:url(/assets-lp2/img-zebra-blinds.webp)] bg-[size:cover] bg-[position:center] cursor-zoom-in"></div>
                      <div data-zoom="/assets-lp2/p05-box-full-plafon-wonosari.webp" className="aspect-[3/4] flex-none rounded-[10px] bg-[#2A2620] bg-[image:url(/assets-lp2/p05-box-full-plafon-wonosari.webp)] bg-[size:cover] bg-[position:center] cursor-zoom-in"></div>
                      <div data-zoom="/assets-lp2/katalog-roller-blinds.webp" className="aspect-[3/4] flex-none rounded-[10px] bg-[#2A2620] bg-[image:url(/assets-lp2/katalog-roller-blinds.webp)] bg-[size:cover] bg-[position:center_35%] cursor-zoom-in"></div>
                    </div>
                    <div className="flex flex-col gap-[6px] mt-[-14px]">
                      <div data-zoom="/assets-lp2/p14-box-glossy-permata-mayang.webp" className="aspect-[3/4] flex-none rounded-[10px] bg-[#2A2620] bg-[image:url(/assets-lp2/p14-box-glossy-permata-mayang.webp)] bg-[size:cover] bg-[position:center] cursor-zoom-in"></div>
                      <div data-zoom="/assets-lp2/katalog-roller-blinds.webp" className="aspect-[3/4] flex-none rounded-[10px] bg-[#2A2620] bg-[image:url(/assets-lp2/katalog-roller-blinds.webp)] bg-[size:cover] bg-[position:center_35%] cursor-zoom-in"></div>
                      <div data-zoom="/assets-lp2/p17-kaca-besar-tawangsari.webp" className="aspect-[3/4] flex-none rounded-[10px] bg-[#2A2620] bg-[image:url(/assets-lp2/p17-kaca-besar-tawangsari.webp)] bg-[size:cover] bg-[position:center] cursor-zoom-in"></div>
                      <div data-zoom="/assets-lp2/katalog-wooden-blinds.webp" className="aspect-[3/4] flex-none rounded-[10px] bg-[#2A2620] bg-[image:url(/assets-lp2/katalog-wooden-blinds.webp)] bg-[size:cover] bg-[position:center] cursor-zoom-in"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 pointer-events-none bg-[image:linear-gradient(to_top,rgba(20,17,13,0.94)_0%,rgba(20,17,13,0.84)_42%,rgba(20,17,13,0.5)_72%,rgba(20,17,13,0.3)_100%)] min-[761px]:bg-[image:linear-gradient(to_right,rgba(20,17,13,0.94)_0%,rgba(20,17,13,0.86)_30%,rgba(20,17,13,0.5)_52%,rgba(20,17,13,0.14)_72%,rgba(20,17,13,0.06)_100%)]"></div>
              </div>
              <div className="relative z-[2] flex flex-col [padding:clamp(40px,7vw,64px)_0_clamp(78px,10vw,92px)]">
                <div className="relative z-[2] flex flex-col min-w-[0] max-w-[560px]">
                  <div className="self-start inline-flex flex-nowrap whitespace-nowrap items-center gap-[8px] [padding:5px_11px_5px_12px] [margin:0_0_clamp(14px,2vw,20px)] bg-[rgba(253,252,250,0.14)] [border:1px_solid_rgba(253,252,250,0.35)] backdrop-blur-[6px] rounded-[999px]">
                    <span className="text-[#FFB800] text-[12px] tracking-[1px]">★★★★★</span>
                    <span className="text-[10.5px] [font-weight:700] tracking-[0.08em] uppercase text-[#FCFAF6] whitespace-nowrap">1.000+ Pembeli</span>
                    <span className="flex">
                      <img src="/assets-lp2/ava-1.webp" alt="" className="w-[19px] h-[19px] rounded-[999px] [border:1.5px_solid_#FCFAF6] object-cover block" />
                      <img src="/assets-lp2/ava-2.webp" alt="" className="w-[19px] h-[19px] ml-[-7px] rounded-[999px] [border:1.5px_solid_#FCFAF6] object-cover block" />
                      <img src="/assets-lp2/ava-3.webp" alt="" className="w-[19px] h-[19px] ml-[-7px] rounded-[999px] [border:1.5px_solid_#FCFAF6] object-cover block" />
                    </span>
                  </div>
                  <h1 className="[margin:0_0_clamp(12px,1.8vw,18px)] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(26px,3.4vw,42px)] leading-[1.16] [font-weight:700] tracking-[-0.025em] text-[#FCFAF6] [text-shadow:0_2px_24px_rgba(0,0,0,0.5)] text-pretty">Takut Salah Ukur atau <span className="bg-[image:linear-gradient(to_top,rgba(224,169,59,0.85)_0.28em,transparent_0.28em)]">Salah Pilih Model Gorden &amp; Tirai?</span></h1>
                  <p className="[margin:0_0_clamp(20px,2.6vw,30px)] max-w-[46ch] text-[clamp(13.5px,1.3vw,16px)] leading-[1.6] text-[rgba(253,252,250,0.92)] [text-shadow:0_1px_16px_rgba(0,0,0,0.55)] text-pretty"><b className="text-[#FCFAF6]">Konsultasi langsung dengan owner.</b> Kami ukur ke rumah Anda, jahit sesuai ukuran, dan pasang sampai rapi.</p>
                  <div className="flex flex-wrap gap-[10px]">
                    <a href="https://wa.me/6285860525758?text=Halo%20saya%20mau%20pesan%20Gorden%20Custom%2C%2Cbisa%20survey%20ke%20lokasi%3F" target="_blank" rel="noopener" className="flex-[0_1_auto] whitespace-nowrap text-center leading-[1.25] flex items-center justify-center gap-[9px] min-h-[clamp(42px,10.5vw,50px)] py-[9px] px-[16px] bg-[#25D366] text-[#fff] text-[clamp(13px,3.4vw,15.5px)] [font-weight:700] tracking-[-0.01em] no-underline rounded-[12px] shadow-[0px_8px_20px_rgba(37,211,102,0.3)] hover:bg-[#1FBA57]"><img src="/assets-lp2/whatsapp.svg" alt="" className="flex-none w-[18px] h-[18px] block [filter:brightness(0)_invert(1)]" />Kirim Foto Jendela, Dapat Saran Model</a>
                    <a href="#katalog" className="flex-[0_1_auto] whitespace-nowrap flex items-center justify-center min-h-[clamp(40px,10vw,50px)] py-[8px] px-[18px] bg-[rgba(252,250,246,0.1)] [border:1.5px_solid_#FCFAF6] text-[#FCFAF6] text-[clamp(13.5px,3.5vw,16px)] [font-weight:700] no-underline rounded-[12px] backdrop-blur-[4px] hover:bg-[rgba(252,250,246,0.22)]">Lihat Model ↓</a>
                  </div>
                  <>
                  <div className="flex flex-wrap justify-start items-center gap-y-[4px] gap-x-[7px] [margin:clamp(14px,2vw,20px)_0_0] text-[clamp(11px,2.9vw,12.5px)] [font-weight:500] text-[rgba(253,252,250,0.92)] [text-shadow:0_1px_14px_rgba(0,0,0,0.55)]">
                    <span className="flex items-center gap-[6px] whitespace-nowrap">Rating <span className="text-[#FFB800] tracking-[1px]">★</span><strong className="text-[#FCFAF6]">5,0</strong> di Google</span>
                    <span className="text-[rgba(253,252,250,0.45)]">•</span>
                    <span className="whitespace-nowrap">Sejak 2012</span>
                  </div>
                  </>
                </div>
              </div>
              <span aria-hidden="true" className="absolute z-[2] left-[50%] [transform:translateX(-50%)] bottom-[clamp(14px,2.4vw,20px)] flex items-center justify-center w-[clamp(40px,9vw,50px)] h-[clamp(40px,9vw,50px)] bg-[rgba(253,252,250,0.16)] [border:1.5px_solid_rgba(253,252,250,0.7)] backdrop-blur-[6px] rounded-[999px] text-[#FCFAF6] [animation:omBob_1.6s_ease-in-out_infinite]">
                <span className="block text-[clamp(20px,4.6vw,26px)] leading-[1] [font-weight:700] mt-[-3px]">↓</span>
              </span>
            </section>

            <section className="[padding:clamp(40px,7vw,64px)_0_0]">
              <p className="[margin:0_0_10px] text-[11px] [font-weight:600] tracking-[0.22em] uppercase text-[#96876C]">Masalah yang sering terjadi</p>
              <h2 className="[margin:0_0_clamp(18px,3.4vw,24px)] max-w-[24ch] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(22px,5.6vw,34px)] leading-[1.16] [font-weight:700] tracking-[-0.03em] text-[#221F1A] text-pretty">Bagus di foto katalog, zonk saat dipasang di rumah.</h2>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-[10px] items-stretch">
                  <div className="flex flex-col p-[clamp(18px,4vw,24px)] bg-[#FCFAF6] [border:1px_solid_#E5DDCF] rounded-[12px]">
                    <p className="[margin:0_0_14px] text-[clamp(15.5px,4vw,18px)] [font-weight:600] tracking-[-0.02em] text-[#877E6D]">Langsung beli</p>
                    <ul className="[margin:0_0_14px] p-[0] list-none"><li className="flex gap-[10px] items-baseline [margin:0_0_9px]"><span className="flex-none [font-family:IBM_Plex_Mono,ui-monospace,monospace] text-[11.5px] text-[#A79B85]">01</span><span className="text-[clamp(14px,3.7vw,15.5px)] leading-[1.45] text-[#585045]">Pilih model dari foto.</span></li><li className="flex gap-[10px] items-baseline [margin:0_0_9px]"><span className="flex-none [font-family:IBM_Plex_Mono,ui-monospace,monospace] text-[11.5px] text-[#A79B85]">02</span><span className="text-[clamp(14px,3.7vw,15.5px)] leading-[1.45] text-[#585045]">Tebak sendiri ukurannya.</span></li><li className="flex gap-[10px] items-baseline [margin:0_0_0]"><span className="flex-none [font-family:IBM_Plex_Mono,ui-monospace,monospace] text-[11.5px] text-[#A79B85]">03</span><span className="text-[clamp(14px,3.7vw,15.5px)] leading-[1.45] text-[#585045]">Terpasang, tapi kurang pas.</span></li></ul>
                    <p className="[margin:auto_0_0] [padding:12px_0_0] [border-top:1px_solid_#EDE6DA] text-[clamp(14px,3.7vw,15.5px)] [font-weight:600] text-[#6F6757]">Murah sekali, nyesal tiap hari.</p>
                  </div>
                  <div className="flex flex-col p-[clamp(18px,4vw,24px)] bg-[#23201B] [border:1px_solid_#23201B] rounded-[12px]">
                    <p className="[margin:0_0_14px] text-[clamp(15.5px,4vw,18px)] [font-weight:600] tracking-[-0.02em] text-[#FCFAF6]">Konsultasi dulu dengan owner</p>
                    <ul className="[margin:0_0_14px] p-[0] list-none"><li className="flex gap-[10px] items-baseline [margin:0_0_9px]"><span className="flex-none [font-family:IBM_Plex_Mono,ui-monospace,monospace] text-[11.5px] text-[rgba(252,250,246,0.55)]">01</span><span className="text-[clamp(14px,3.7vw,15.5px)] leading-[1.45] text-[rgba(252,250,246,0.92)]">Cerita kebutuhan ke owner.</span></li><li className="flex gap-[10px] items-baseline [margin:0_0_9px]"><span className="flex-none [font-family:IBM_Plex_Mono,ui-monospace,monospace] text-[11.5px] text-[rgba(252,250,246,0.55)]">02</span><span className="text-[clamp(14px,3.7vw,15.5px)] leading-[1.45] text-[rgba(252,250,246,0.92)]">Kami survey &amp; ukur gratis.</span></li><li className="flex gap-[10px] items-baseline [margin:0_0_0]"><span className="flex-none [font-family:IBM_Plex_Mono,ui-monospace,monospace] text-[11.5px] text-[rgba(252,250,246,0.55)]">03</span><span className="text-[clamp(14px,3.7vw,15.5px)] leading-[1.45] text-[rgba(252,250,246,0.92)]">Terpasang, dan memang pas.</span></li></ul>
                    <p className="[margin:auto_0_0] [padding:12px_0_0] [border-top:1px_solid_rgba(252,250,246,0.18)] text-[clamp(14px,3.7vw,15.5px)] [font-weight:600] text-[#FCFAF6]">Dipilih untuk rumah Anda.</p>
                  </div>
              </div>
            </section>

            <section id="katalog" className="py-[clamp(46px,8vw,78px)] px-[0] [border-top:1px_solid_#EDE6DA] scroll-mt-[76px]">
              <p className="[margin:0_0_10px] text-[11px] [font-weight:600] tracking-[0.22em] uppercase text-[#96876C]">Katalog model</p>
              <h2 className="[margin:0_0_8px] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(22px,5.6vw,34px)] leading-[1.16] [font-weight:700] tracking-[-0.03em]">Model yang bisa Anda pilih untuk ruangan itu</h2>
              <p className="[margin:0_0_clamp(18px,3.4vw,24px)] text-[clamp(14px,3.8vw,17px)] leading-[1.5] text-[#585045] max-w-[52ch] text-pretty">Semua dibuat sesuai ukuran jendela Anda. Belum tahu yang cocok? Kami bantu pilihkan saat survey.</p>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(min(48%,240px),1fr))] gap-y-[18px] gap-x-[8px] items-stretch">
                    <div className="flex flex-col">
                      <figure className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[image:url(/assets-lp2/img-gorden-sala3-1152x1536-m.webp)] bg-[size:cover] bg-[position:center]">
                        <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                        <span className="absolute top-[10px] left-[10px] py-[5px] px-[10px] bg-[rgba(252,250,246,0.94)] text-[#221F1A] text-[11px] [font-weight:600] rounded-[999px] whitespace-nowrap leading-[1.2]">🔥 Best Seller</span>
                        <figcaption className="absolute left-[0] right-[0] bottom-[0] [padding:14px_12px_12px] text-[#FCFAF6]">
                          <span className="block text-[clamp(14.5px,3.8vw,17px)] [font-weight:500] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Gorden Minimalis</span>
                          <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="text-[#FFB800]">★</span> 4,9 · 312 pembeli</span>
                        </figcaption>
                      </figure>
                      <p className="flex-[1_1_auto] [margin:8px_2px_0] text-[clamp(12px,3.2vw,13.5px)] leading-[1.4] text-[#585045] text-pretty">Cocok untuk ruang tamu dan keluarga, simpel dan rapi.</p>
                      <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20tertarik%20Gorden%20Minimalis.%20Boleh%20minta%20info%20harga%20dan%20spesifikasinya%3F" target="_blank" rel="noopener" className="flex items-center justify-center gap-[6px] [margin:10px_0_0] min-h-[48px] py-[7px] px-[8px] bg-[#FCFAF6] [border:1.5px_solid_#DCD3C1] text-[#221F1A] text-[clamp(11.5px,3.1vw,13px)] [font-weight:600] no-underline rounded-[8px] leading-[1.25] text-center hover:bg-[#F2EDE3] hover:border-[#6E6553]"><img src="/assets-lp2/whatsapp.svg" alt="" className="flex-none w-[15px] h-[15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]" />Tanya Gorden Minimalis via WA</a>
                    </div>
                    <div className="flex flex-col">
                      <figure className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[image:url(/assets-lp2/katalog-roller-blinds-m.webp)] bg-[size:cover] bg-[position:center]">
                        <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                        <span className="absolute top-[10px] left-[10px] py-[5px] px-[10px] bg-[rgba(252,250,246,0.94)] text-[#221F1A] text-[11px] [font-weight:600] rounded-[999px] whitespace-nowrap leading-[1.2]">🏢 Favorit Kantor</span>
                        <figcaption className="absolute left-[0] right-[0] bottom-[0] [padding:14px_12px_12px] text-[#FCFAF6]">
                          <span className="block text-[clamp(14.5px,3.8vw,17px)] [font-weight:500] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Roller Blinds</span>
                          <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="text-[#FFB800]">★</span> 4,8 · 241 pembeli</span>
                        </figcaption>
                      </figure>
                      <p className="flex-[1_1_auto] [margin:8px_2px_0] text-[clamp(12px,3.2vw,13.5px)] leading-[1.4] text-[#585045] text-pretty">Cocok untuk kantor dan ruang kerja, praktis dan rapi.</p>
                      <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20tertarik%20Roller%20Blinds.%20Boleh%20minta%20info%20harga%20dan%20spesifikasinya%3F" target="_blank" rel="noopener" className="flex items-center justify-center gap-[6px] [margin:10px_0_0] min-h-[48px] py-[7px] px-[8px] bg-[#FCFAF6] [border:1.5px_solid_#DCD3C1] text-[#221F1A] text-[clamp(11.5px,3.1vw,13px)] [font-weight:600] no-underline rounded-[8px] leading-[1.25] text-center hover:bg-[#F2EDE3] hover:border-[#6E6553]"><img src="/assets-lp2/whatsapp.svg" alt="" className="flex-none w-[15px] h-[15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]" />Tanya Roller Blinds via WA</a>
                    </div>
                    <div className="flex flex-col">
                      <figure className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[image:url(/assets-lp2/p03-blackout-alexandria-m.webp)] bg-[size:cover] bg-[position:center]">
                        <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                        <span className="absolute top-[10px] left-[10px] py-[5px] px-[10px] bg-[rgba(252,250,246,0.94)] text-[#221F1A] text-[11px] [font-weight:600] rounded-[999px] whitespace-nowrap leading-[1.2]">🌙 Paling Dicari</span>
                        <figcaption className="absolute left-[0] right-[0] bottom-[0] [padding:14px_12px_12px] text-[#FCFAF6]">
                          <span className="block text-[clamp(14.5px,3.8vw,17px)] [font-weight:500] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Gorden Blackout</span>
                          <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="text-[#FFB800]">★</span> 4,9 · 205 pembeli</span>
                        </figcaption>
                      </figure>
                      <p className="flex-[1_1_auto] [margin:8px_2px_0] text-[clamp(12px,3.2vw,13.5px)] leading-[1.4] text-[#585045] text-pretty">Cocok untuk kamar tidur, gelap total dan adem.</p>
                      <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20tertarik%20Gorden%20Blackout.%20Boleh%20minta%20info%20harga%20dan%20spesifikasinya%3F" target="_blank" rel="noopener" className="flex items-center justify-center gap-[6px] [margin:10px_0_0] min-h-[48px] py-[7px] px-[8px] bg-[#FCFAF6] [border:1.5px_solid_#DCD3C1] text-[#221F1A] text-[clamp(11.5px,3.1vw,13px)] [font-weight:600] no-underline rounded-[8px] leading-[1.25] text-center hover:bg-[#F2EDE3] hover:border-[#6E6553]"><img src="/assets-lp2/whatsapp.svg" alt="" className="flex-none w-[15px] h-[15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]" />Tanya Gorden Blackout via WA</a>
                    </div>
                    <div className="flex flex-col">
                      <figure className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[image:url(/assets-lp2/katalog-vertical-blinds-m.webp)] bg-[size:cover] bg-[position:center]">
                        <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                        <figcaption className="absolute left-[0] right-[0] bottom-[0] [padding:14px_12px_12px] text-[#FCFAF6]">
                          <span className="block text-[clamp(14.5px,3.8vw,17px)] [font-weight:500] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Vertikal Blinds</span>
                          <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="text-[#FFB800]">★</span> 4,7 · 152 pembeli</span>
                        </figcaption>
                      </figure>
                      <p className="flex-[1_1_auto] [margin:8px_2px_0] text-[clamp(12px,3.2vw,13.5px)] leading-[1.4] text-[#585045] text-pretty">Cocok untuk kantor, kesan formal dan bersih.</p>
                      <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20tertarik%20Vertikal%20Blinds.%20Boleh%20minta%20info%20harga%20dan%20spesifikasinya%3F" target="_blank" rel="noopener" className="flex items-center justify-center gap-[6px] [margin:10px_0_0] min-h-[48px] py-[7px] px-[8px] bg-[#FCFAF6] [border:1.5px_solid_#DCD3C1] text-[#221F1A] text-[clamp(11.5px,3.1vw,13px)] [font-weight:600] no-underline rounded-[8px] leading-[1.25] text-center hover:bg-[#F2EDE3] hover:border-[#6E6553]"><img src="/assets-lp2/whatsapp.svg" alt="" className="flex-none w-[15px] h-[15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]" />Tanya Vertikal Blinds via WA</a>
                    </div>
                    <div className="flex flex-col">
                      <figure className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[image:url(/assets-lp2/img-gorden-custom-m.webp)] bg-[size:cover] bg-[position:center]">
                        <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                        <figcaption className="absolute left-[0] right-[0] bottom-[0] [padding:14px_12px_12px] text-[#FCFAF6]">
                          <span className="block text-[clamp(14.5px,3.8vw,17px)] [font-weight:500] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Gorden Custom</span>
                          <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="text-[#FFB800]">★</span> 5,0 · 186 pembeli</span>
                        </figcaption>
                      </figure>
                      <p className="flex-[1_1_auto] [margin:8px_2px_0] text-[clamp(12px,3.2vw,13.5px)] leading-[1.4] text-[#585045] text-pretty">Cocok untuk jendela tidak standar, model bebas.</p>
                      <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20tertarik%20Gorden%20Custom.%20Boleh%20minta%20info%20harga%20dan%20spesifikasinya%3F" target="_blank" rel="noopener" className="flex items-center justify-center gap-[6px] [margin:10px_0_0] min-h-[48px] py-[7px] px-[8px] bg-[#FCFAF6] [border:1.5px_solid_#DCD3C1] text-[#221F1A] text-[clamp(11.5px,3.1vw,13px)] [font-weight:600] no-underline rounded-[8px] leading-[1.25] text-center hover:bg-[#F2EDE3] hover:border-[#6E6553]"><img src="/assets-lp2/whatsapp.svg" alt="" className="flex-none w-[15px] h-[15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]" />Tanya Gorden Custom via WA</a>
                    </div>
                    <div className="flex flex-col">
                      <figure className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[image:url(/assets-lp2/kat-vitrase-m.webp)] bg-[size:cover] bg-[position:center]">
                        <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                        <figcaption className="absolute left-[0] right-[0] bottom-[0] [padding:14px_12px_12px] text-[#FCFAF6]">
                          <span className="block text-[clamp(14.5px,3.8vw,17px)] [font-weight:500] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Gorden Siang &amp; Vitrase</span>
                          <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="text-[#FFB800]">★</span> 4,8 · 197 pembeli</span>
                        </figcaption>
                      </figure>
                      <p className="flex-[1_1_auto] [margin:8px_2px_0] text-[clamp(12px,3.2vw,13.5px)] leading-[1.4] text-[#585045] text-pretty">Cocok untuk kamar dan ruang tamu, terang tapi tetap privat.</p>
                      <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20tertarik%20Gorden%20Siang%20%26%20Vitrase.%20Boleh%20minta%20info%20harga%20dan%20spesifikasinya%3F" target="_blank" rel="noopener" className="flex items-center justify-center gap-[6px] [margin:10px_0_0] min-h-[48px] py-[7px] px-[8px] bg-[#FCFAF6] [border:1.5px_solid_#DCD3C1] text-[#221F1A] text-[clamp(11.5px,3.1vw,13px)] [font-weight:600] no-underline rounded-[8px] leading-[1.25] text-center hover:bg-[#F2EDE3] hover:border-[#6E6553]"><img src="/assets-lp2/whatsapp.svg" alt="" className="flex-none w-[15px] h-[15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]" />Tanya Gorden Siang &amp; Vitrase via WA</a>
                    </div>
              </div>
              {katMore ? (<>
              <div className="[margin:18px_0_0]">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(min(48%,240px),1fr))] gap-y-[18px] gap-x-[8px] items-stretch">
                    <div className="flex flex-col">
                      <figure className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[image:url(/assets-lp2/kat-outdoor-m.webp)] bg-[size:cover] bg-[position:center]">
                        <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                        <figcaption className="absolute left-[0] right-[0] bottom-[0] [padding:14px_12px_12px] text-[#FCFAF6]">
                          <span className="block text-[clamp(14.5px,3.8vw,17px)] [font-weight:500] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Outdoor Blinds</span>
                          <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="text-[#FFB800]">★</span> 4,8 · 72 pembeli</span>
                        </figcaption>
                      </figure>
                      <p className="flex-[1_1_auto] [margin:8px_2px_0] text-[clamp(12px,3.2vw,13.5px)] leading-[1.4] text-[#585045] text-pretty">Cocok untuk teras dan balkon, kurangi panas dan silau.</p>
                      <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20tertarik%20Outdoor%20Blinds.%20Boleh%20minta%20info%20harga%20dan%20spesifikasinya%3F" target="_blank" rel="noopener" className="flex items-center justify-center gap-[6px] [margin:10px_0_0] min-h-[48px] py-[7px] px-[8px] bg-[#FCFAF6] [border:1.5px_solid_#DCD3C1] text-[#221F1A] text-[clamp(11.5px,3.1vw,13px)] [font-weight:600] no-underline rounded-[8px] leading-[1.25] text-center hover:bg-[#F2EDE3] hover:border-[#6E6553]"><img src="/assets-lp2/whatsapp.svg" alt="" className="flex-none w-[15px] h-[15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]" />Tanya Outdoor Blinds via WA</a>
                    </div>
                    <div className="flex flex-col">
                      <figure className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[image:url(/assets-lp2/img-gorden-hotel-apartemen-m.webp)] bg-[size:cover] bg-[position:center]">
                        <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                        <figcaption className="absolute left-[0] right-[0] bottom-[0] [padding:14px_12px_12px] text-[#FCFAF6]">
                          <span className="block text-[clamp(14.5px,3.8vw,17px)] [font-weight:500] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Gorden Hotel &amp; Apartemen</span>
                          <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="text-[#FFB800]">★</span> 4,9 · 63 pembeli</span>
                        </figcaption>
                      </figure>
                      <p className="flex-[1_1_auto] [margin:8px_2px_0] text-[clamp(12px,3.2vw,13.5px)] leading-[1.4] text-[#585045] text-pretty">Cocok untuk hotel, villa, dan unit sewa.</p>
                      <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20tertarik%20Gorden%20Hotel%20%26%20Apartemen.%20Boleh%20minta%20info%20harga%20dan%20spesifikasinya%3F" target="_blank" rel="noopener" className="flex items-center justify-center gap-[6px] [margin:10px_0_0] min-h-[48px] py-[7px] px-[8px] bg-[#FCFAF6] [border:1.5px_solid_#DCD3C1] text-[#221F1A] text-[clamp(11.5px,3.1vw,13px)] [font-weight:600] no-underline rounded-[8px] leading-[1.25] text-center hover:bg-[#F2EDE3] hover:border-[#6E6553]"><img src="/assets-lp2/whatsapp.svg" alt="" className="flex-none w-[15px] h-[15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]" />Tanya Gorden Hotel &amp; Apartemen via WA</a>
                    </div>
                    <div className="flex flex-col">
                      <figure className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[image:url(/assets-lp2/img-zebra-blinds-m.webp)] bg-[size:cover] bg-[position:center]">
                        <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                        <span className="absolute top-[10px] left-[10px] py-[5px] px-[10px] bg-[rgba(252,250,246,0.94)] text-[#221F1A] text-[11px] [font-weight:600] rounded-[999px] whitespace-nowrap leading-[1.2]">⭐ Terlaris</span>
                        <figcaption className="absolute left-[0] right-[0] bottom-[0] [padding:14px_12px_12px] text-[#FCFAF6]">
                          <span className="block text-[clamp(14.5px,3.8vw,17px)] [font-weight:500] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Zebra Blinds</span>
                          <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="text-[#FFB800]">★</span> 4,8 · 268 pembeli</span>
                        </figcaption>
                      </figure>
                      <p className="flex-[1_1_auto] [margin:8px_2px_0] text-[clamp(12px,3.2vw,13.5px)] leading-[1.4] text-[#585045] text-pretty">Cocok untuk ruang keluarga, cahaya bisa diatur.</p>
                      <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20tertarik%20Zebra%20Blinds.%20Boleh%20minta%20info%20harga%20dan%20spesifikasinya%3F" target="_blank" rel="noopener" className="flex items-center justify-center gap-[6px] [margin:10px_0_0] min-h-[48px] py-[7px] px-[8px] bg-[#FCFAF6] [border:1.5px_solid_#DCD3C1] text-[#221F1A] text-[clamp(11.5px,3.1vw,13px)] [font-weight:600] no-underline rounded-[8px] leading-[1.25] text-center hover:bg-[#F2EDE3] hover:border-[#6E6553]"><img src="/assets-lp2/whatsapp.svg" alt="" className="flex-none w-[15px] h-[15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]" />Tanya Zebra Blinds via WA</a>
                    </div>
                    <div className="flex flex-col">
                      <figure className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[image:url(/assets-lp2/img-slimline-blinds-gorden-kantor-scaled-e16-m.webp)] bg-[size:cover] bg-[position:center]">
                        <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                        <figcaption className="absolute left-[0] right-[0] bottom-[0] [padding:14px_12px_12px] text-[#FCFAF6]">
                          <span className="block text-[clamp(14.5px,3.8vw,17px)] [font-weight:500] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Slimline Blinds</span>
                          <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="text-[#FFB800]">★</span> 4,7 · 81 pembeli</span>
                        </figcaption>
                      </figure>
                      <p className="flex-[1_1_auto] [margin:8px_2px_0] text-[clamp(12px,3.2vw,13.5px)] leading-[1.4] text-[#585045] text-pretty">Cocok untuk dapur dan kantor, cahaya mudah diatur.</p>
                      <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20tertarik%20Slimline%20Blinds.%20Boleh%20minta%20info%20harga%20dan%20spesifikasinya%3F" target="_blank" rel="noopener" className="flex items-center justify-center gap-[6px] [margin:10px_0_0] min-h-[48px] py-[7px] px-[8px] bg-[#FCFAF6] [border:1.5px_solid_#DCD3C1] text-[#221F1A] text-[clamp(11.5px,3.1vw,13px)] [font-weight:600] no-underline rounded-[8px] leading-[1.25] text-center hover:bg-[#F2EDE3] hover:border-[#6E6553]"><img src="/assets-lp2/whatsapp.svg" alt="" className="flex-none w-[15px] h-[15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]" />Tanya Slimline Blinds via WA</a>
                    </div>
                    <div className="flex flex-col">
                      <figure className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[image:url(/assets-lp2/katalog-wooden-blinds-m.webp)] bg-[size:cover] bg-[position:center]">
                        <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                        <figcaption className="absolute left-[0] right-[0] bottom-[0] [padding:14px_12px_12px] text-[#FCFAF6]">
                          <span className="block text-[clamp(14.5px,3.8vw,17px)] [font-weight:500] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Wooden Blinds Fabrikasi</span>
                          <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="text-[#FFB800]">★</span> 4,8 · 96 pembeli</span>
                        </figcaption>
                      </figure>
                      <p className="flex-[1_1_auto] [margin:8px_2px_0] text-[clamp(12px,3.2vw,13.5px)] leading-[1.4] text-[#585045] text-pretty">Cocok untuk ruang kerja, hangat dan modern.</p>
                      <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20tertarik%20Wooden%20Blinds%20Fabrikasi.%20Boleh%20minta%20info%20harga%20dan%20spesifikasinya%3F" target="_blank" rel="noopener" className="flex items-center justify-center gap-[6px] [margin:10px_0_0] min-h-[48px] py-[7px] px-[8px] bg-[#FCFAF6] [border:1.5px_solid_#DCD3C1] text-[#221F1A] text-[clamp(11.5px,3.1vw,13px)] [font-weight:600] no-underline rounded-[8px] leading-[1.25] text-center hover:bg-[#F2EDE3] hover:border-[#6E6553]"><img src="/assets-lp2/whatsapp.svg" alt="" className="flex-none w-[15px] h-[15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]" />Tanya Wooden Blinds Fabrikasi via WA</a>
                    </div>
                    <div className="flex flex-col">
                      <figure className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[image:url(/assets-lp2/img-gorden-rumah-sakit-rso-orthopedi-surakar-m.webp)] bg-[size:cover] bg-[position:center]">
                        <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                        <figcaption className="absolute left-[0] right-[0] bottom-[0] [padding:14px_12px_12px] text-[#FCFAF6]">
                          <span className="block text-[clamp(14.5px,3.8vw,17px)] [font-weight:500] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Tirai Area Publik</span>
                          <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="text-[#FFB800]">★</span> 4,9 · 54 pembeli</span>
                        </figcaption>
                      </figure>
                      <p className="flex-[1_1_auto] [margin:8px_2px_0] text-[clamp(12px,3.2vw,13.5px)] leading-[1.4] text-[#585045] text-pretty">Cocok untuk rumah sakit, sekolah, dan kantor.</p>
                      <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20tertarik%20Tirai%20Area%20Publik.%20Boleh%20minta%20info%20harga%20dan%20spesifikasinya%3F" target="_blank" rel="noopener" className="flex items-center justify-center gap-[6px] [margin:10px_0_0] min-h-[48px] py-[7px] px-[8px] bg-[#FCFAF6] [border:1.5px_solid_#DCD3C1] text-[#221F1A] text-[clamp(11.5px,3.1vw,13px)] [font-weight:600] no-underline rounded-[8px] leading-[1.25] text-center hover:bg-[#F2EDE3] hover:border-[#6E6553]"><img src="/assets-lp2/whatsapp.svg" alt="" className="flex-none w-[15px] h-[15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]" />Tanya Tirai Area Publik via WA</a>
                    </div>
                    <div className="flex flex-col">
                      <figure className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[image:url(/assets-lp2/img-gorden-kupu-1-m.webp)] bg-[size:cover] bg-[position:center]">
                        <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                        <figcaption className="absolute left-[0] right-[0] bottom-[0] [padding:14px_12px_12px] text-[#FCFAF6]">
                          <span className="block text-[clamp(14.5px,3.8vw,17px)] [font-weight:500] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Gorden Kupu-Kupu</span>
                          <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="text-[#FFB800]">★</span> 4,6 · 94 pembeli</span>
                        </figcaption>
                      </figure>
                      <p className="flex-[1_1_auto] [margin:8px_2px_0] text-[clamp(12px,3.2vw,13.5px)] leading-[1.4] text-[#585045] text-pretty">Cocok untuk jendela kecil, manis dan simpel.</p>
                      <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20tertarik%20Gorden%20Kupu-Kupu.%20Boleh%20minta%20info%20harga%20dan%20spesifikasinya%3F" target="_blank" rel="noopener" className="flex items-center justify-center gap-[6px] [margin:10px_0_0] min-h-[48px] py-[7px] px-[8px] bg-[#FCFAF6] [border:1.5px_solid_#DCD3C1] text-[#221F1A] text-[clamp(11.5px,3.1vw,13px)] [font-weight:600] no-underline rounded-[8px] leading-[1.25] text-center hover:bg-[#F2EDE3] hover:border-[#6E6553]"><img src="/assets-lp2/whatsapp.svg" alt="" className="flex-none w-[15px] h-[15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]" />Tanya Gorden Kupu-Kupu via WA</a>
                    </div>
                    <div className="flex flex-col">
                      <figure className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[image:url(/assets-lp2/img-wallpaper-custom-motif-peta-dunia-m.webp)] bg-[size:cover] bg-[position:center]">
                        <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                        <figcaption className="absolute left-[0] right-[0] bottom-[0] [padding:14px_12px_12px] text-[#FCFAF6]">
                          <span className="block text-[clamp(14.5px,3.8vw,17px)] [font-weight:500] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Wallpaper Custom</span>
                          <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="text-[#FFB800]">★</span> 4,8 · 143 pembeli</span>
                        </figcaption>
                      </figure>
                      <p className="flex-[1_1_auto] [margin:8px_2px_0] text-[clamp(12px,3.2vw,13.5px)] leading-[1.4] text-[#585045] text-pretty">Cocok untuk dinding kamar dan ruang tamu, ruangan langsung beda.</p>
                      <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20tertarik%20Wallpaper%20Custom.%20Boleh%20minta%20info%20harga%20dan%20spesifikasinya%3F" target="_blank" rel="noopener" className="flex items-center justify-center gap-[6px] [margin:10px_0_0] min-h-[48px] py-[7px] px-[8px] bg-[#FCFAF6] [border:1.5px_solid_#DCD3C1] text-[#221F1A] text-[clamp(11.5px,3.1vw,13px)] [font-weight:600] no-underline rounded-[8px] leading-[1.25] text-center hover:bg-[#F2EDE3] hover:border-[#6E6553]"><img src="/assets-lp2/whatsapp.svg" alt="" className="flex-none w-[15px] h-[15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]" />Tanya Wallpaper Custom via WA</a>
                    </div>
                    <div className="flex flex-col">
                      <figure className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#EDE7DA] bg-[image:url(/assets-lp2/img-kasa-nyamuk-magnetik-1536x1012-m.webp)] bg-[size:cover] bg-[position:center]">
                        <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                        <figcaption className="absolute left-[0] right-[0] bottom-[0] [padding:14px_12px_12px] text-[#FCFAF6]">
                          <span className="block text-[clamp(14.5px,3.8vw,17px)] [font-weight:500] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Perlengkapan Lainnya</span>
                          <span className="block mt-[2px] text-[11.5px] text-[rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="text-[#FFB800]">★</span> 4,7 · 112 pembeli</span>
                        </figcaption>
                      </figure>
                      <p className="flex-[1_1_auto] [margin:8px_2px_0] text-[clamp(12px,3.2vw,13.5px)] leading-[1.4] text-[#585045] text-pretty">Kasa nyamuk, rel, dan pelengkap gorden lainnya.</p>
                      <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20tertarik%20Perlengkapan%20Lainnya.%20Boleh%20minta%20info%20harga%20dan%20spesifikasinya%3F" target="_blank" rel="noopener" className="flex items-center justify-center gap-[6px] [margin:10px_0_0] min-h-[48px] py-[7px] px-[8px] bg-[#FCFAF6] [border:1.5px_solid_#DCD3C1] text-[#221F1A] text-[clamp(11.5px,3.1vw,13px)] [font-weight:600] no-underline rounded-[8px] leading-[1.25] text-center hover:bg-[#F2EDE3] hover:border-[#6E6553]"><img src="/assets-lp2/whatsapp.svg" alt="" className="flex-none w-[15px] h-[15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]" />Tanya Perlengkapan Lainnya via WA</a>
                    </div>
                </div>
              </div>
              </>) : null}
              <div className="flex justify-center [margin:20px_0_0]">
                <button type="button" onClick={toggleKatMore} className="inline-flex items-center justify-center gap-[8px] min-h-[46px] py-[11px] px-[22px] bg-[#FCFAF6] [border:2px_solid_#221F1A] rounded-[12px] [font-family:Poppins,Helvetica,sans-serif] text-[15px] [font-weight:700] text-[#221F1A] cursor-pointer hover:bg-[#F2EDE3]">{katMore ? 'Sembunyikan model lain ↑' : 'Lihat model lain (9) ↓'}</button>
              </div>
              <p className="[margin:26px_0_0] text-[16px] text-[#6A6252] text-center [font-weight:700]">Belum yakin? Kirim foto jendela, kami pilihkan modelnya.</p>
              <div className="[margin:12px_0_0]">
                <div className="flex flex-col items-stretch gap-[10px]">
                  <a href="https://wa.me/6285860525758?text=Halo%20saya%20mau%20pesan%20Gorden%20Custom%2C%2Cbisa%20survey%20ke%20lokasi%3F" target="_blank" rel="noopener" className="flex-[1_1_100%] flex items-center justify-center gap-[9px] min-h-[56px] py-[14px] px-[20px] bg-[#25D366] text-[#fff] text-[clamp(15px,3.9vw,17px)] [font-weight:700] tracking-[-0.01em] no-underline rounded-[12px] shadow-[0px_8px_20px_rgba(37,211,102,0.3)] hover:bg-[#1FBA57]"><img src="/assets-lp2/whatsapp.svg" alt="" className="flex-none w-[20px] h-[20px] block [filter:brightness(0)_invert(1)]" />Konsultasi Gratis →</a>
                </div>
                <div className="flex flex-wrap justify-center items-center gap-y-[5px] gap-x-[10px] [margin:12px_0_0] text-[clamp(11.5px,3vw,12.5px)] [font-weight:500] text-center text-[#3C3529]">
                  <span className="text-[#FFB800] tracking-[1px]">★★★★★</span><strong className="text-[#221F1A]">5,0</strong><span>Google Review</span><span className="opacity-[0.5]">•</span><span>1.000+ pembeli</span><span className="opacity-[0.5]">•</span><span>Garansi pemasangan 14 hari</span>
                </div>
              </div>
            </section>

            <section className="w-[100vw] ml-[calc(50%_-_50vw)] py-[clamp(40px,7vw,72px)] px-[0] bg-[#FAF7F1]">
              <div className="max-w-[1000px] my-[0] mx-[auto] py-[0] px-[clamp(16px,4vw,20px)]">
                <div className="text-left [margin:0_0_clamp(18px,3.4vw,26px)]">
                  <p className="[margin:0_0_10px] text-[11px] [font-weight:600] tracking-[0.22em] uppercase text-[#96876C]">Hasil pemasangan nyata</p>
                  <h2 className="[margin:0_0_8px] max-w-[24ch] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(23px,5.6vw,34px)] leading-[1.16] [font-weight:700] tracking-[-0.03em] text-[#221F1A] text-pretty">Bukan cuma bagus di katalog</h2>
                  <p className="m-[0] max-w-[48ch] text-[clamp(14px,3.8vw,16.5px)] leading-[1.55] text-[#585045] text-pretty">Lihat hasilnya setelah dipasang di rumah pelanggan.</p>

                </div>
                <p className="inline-flex items-center gap-[8px] [margin:0_0_clamp(14px,3vw,20px)] py-[8px] px-[14px] bg-[#F2EDE3] [border:1px_solid_#E5DDCF] rounded-[999px] text-[clamp(13px,3.4vw,14.5px)] [font-weight:600] text-[#221F1A]"><span aria-hidden="true">📍</span>1.000+ project di Solo Raya.</p>

                <div className="grid grid-cols-[repeat(auto-fit,minmax(min(46%,200px),1fr))] gap-[8px]">
                  <figure data-zoom="/assets-lp2/p05-box-full-plafon-wonosari-m.webp" className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[6px] bg-[#EDE7DA] bg-[image:url(/assets-lp2/p05-box-full-plafon-wonosari-m.webp)] bg-[size:cover] bg-[position:center] cursor-zoom-in">
                    <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_46%,rgba(28,25,21,0.78)_100%)]"></div>
                    <figcaption className="absolute left-[0] right-[0] bottom-[0] [padding:12px_11px_11px] text-[#FCFAF6]">
                      <span className="block text-[clamp(12.5px,3.3vw,14.5px)] [font-weight:600] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Ruangan Terlihat Lebih Tinggi</span>
                      <span className="flex items-center gap-[4px] mt-[3px] text-[11.5px] leading-[1.3] text-[rgba(252,250,246,0.88)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span aria-hidden="true">📍</span>Wonosari, Klaten</span>
                    </figcaption>
                  </figure>
                  <figure data-zoom="/assets-lp2/p17-kaca-besar-tawangsari-m.webp" className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[6px] bg-[#EDE7DA] bg-[image:url(/assets-lp2/p17-kaca-besar-tawangsari-m.webp)] bg-[size:cover] bg-[position:center] cursor-zoom-in">
                    <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_46%,rgba(28,25,21,0.78)_100%)]"></div>
                    <figcaption className="absolute left-[0] right-[0] bottom-[0] [padding:12px_11px_11px] text-[#FCFAF6]">
                      <span className="block text-[clamp(12.5px,3.3vw,14.5px)] [font-weight:600] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Lebih Rapi Tanpa Rel Terlihat</span>
                      <span className="flex items-center gap-[4px] mt-[3px] text-[11.5px] leading-[1.3] text-[rgba(252,250,246,0.88)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span aria-hidden="true">📍</span>Tawangsari, Sukoharjo</span>
                    </figcaption>
                  </figure>
                  <figure data-zoom="/assets-lp2/p01-hidden-rail-klodran-m.webp" className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[6px] bg-[#EDE7DA] bg-[image:url(/assets-lp2/p01-hidden-rail-klodran-m.webp)] bg-[size:cover] bg-[position:center] cursor-zoom-in">
                    <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_46%,rgba(28,25,21,0.78)_100%)]"></div>
                    <figcaption className="absolute left-[0] right-[0] bottom-[0] [padding:12px_11px_11px] text-[#FCFAF6]">
                      <span className="block text-[clamp(12.5px,3.3vw,14.5px)] [font-weight:600] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Tidur Lebih Nyaman dan Gelap</span>
                      <span className="flex items-center gap-[4px] mt-[3px] text-[11.5px] leading-[1.3] text-[rgba(252,250,246,0.88)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span aria-hidden="true">📍</span>Klodran, Colomadu</span>
                    </figcaption>
                  </figure>
                  <figure data-zoom="/assets-lp2/p06-box-glossy-solokota-m.webp" className="m-[0] relative aspect-[3/4] overflow-hidden rounded-[6px] bg-[#EDE7DA] bg-[image:url(/assets-lp2/p06-box-glossy-solokota-m.webp)] bg-[size:cover] bg-[position:center] cursor-zoom-in">
                    <div className="absolute inset-0 bg-[image:linear-gradient(180deg,rgba(28,25,21,0)_46%,rgba(28,25,21,0.78)_100%)]"></div>
                    <figcaption className="absolute left-[0] right-[0] bottom-[0] [padding:12px_11px_11px] text-[#FCFAF6]">
                      <span className="block text-[clamp(12.5px,3.3vw,14.5px)] [font-weight:600] tracking-[-0.01em] leading-[1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Tampak Mewah dan Berkelas</span>
                      <span className="flex items-center gap-[4px] mt-[3px] text-[11.5px] leading-[1.3] text-[rgba(252,250,246,0.88)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span aria-hidden="true">📍</span>Solo Kota</span>
                    </figcaption>
                  </figure>
                </div>

                <div className="[margin:clamp(36px,6vw,56px)_0_0] [padding:clamp(28px,5vw,40px)_0_0] [border-top:1px_solid_#EDE6DA]">
              <div className="text-left [margin:0_0_clamp(16px,3vw,22px)]">
                <p className="[margin:0_0_10px] text-[11px] [font-weight:600] tracking-[0.22em] uppercase text-[#96876C]">Lihat perubahannya</p>
                <h3 className="m-[0] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(20px,4.8vw,27px)] leading-[1.16] [font-weight:600] tracking-[-0.03em] text-[#221F1A] text-pretty">Dari ruangan biasa menjadi lebih rapi dan nyaman</h3>
              </div>
              <div className="m-[0] py-[18px] px-[16px] bg-[#F2EDE3] [border:1px_solid_#E5DDCF] rounded-[20px]">
                <div className="grid grid-cols-[1fr_1fr] gap-y-[clamp(10px,] gap-x-[2.4vw,]">
                  <figure data-zoom="/assets-lp2/before-sawit-2-m.webp" className="m-[0]">
                    <div className="relative aspect-[3/4] rounded-[16px] [border:1px_solid_#DCD3C1] bg-[image:url(/assets-lp2/before-sawit-2-m.webp)] bg-[size:cover] bg-[position:center] overflow-hidden cursor-zoom-in">
                      <span className="absolute top-[12px] left-[12px] py-[6px] px-[14px] bg-[#FCFAF6] text-[#5d5546] text-[12px] [font-weight:700] tracking-[0.1em] uppercase rounded-[999px] shadow-[0_4px_12px_-4px_rgba(0,0,0,0.35)]">Sebelum</span>
                    </div>
                  </figure>
                  <figure data-zoom="/assets-lp2/after-sawit-m.webp" className="m-[0]">
                    <div className="relative aspect-[3/4] rounded-[16px] [border:1px_solid_#DCD3C1] bg-[image:url(/assets-lp2/after-sawit-m.webp)] bg-[size:cover] bg-[position:62%_center] overflow-hidden cursor-zoom-in">
                      <span className="absolute top-[12px] left-[12px] py-[6px] px-[14px] bg-[#6E6553] text-[#fff] text-[12px] [font-weight:700] tracking-[0.1em] uppercase rounded-[999px] shadow-[0_4px_12px_-4px_rgba(0,0,0,0.35)]">Sesudah</span>
                    </div>
                  </figure>
                </div>
                <p className="[margin:14px_0_0] text-center text-[clamp(13px,3.5vw,14.5px)] leading-[1.5] text-[#585045] text-pretty">Lebih rapi, lebih tinggi, dan sesuai konsep ruangan. Direkomendasikan langsung oleh owner berdasarkan kondisi ruangannya.</p>
              </div>

                </div>
                <div className="[margin:clamp(36px,6vw,56px)_0_0] [padding:clamp(28px,5vw,40px)_0_0] [border-top:1px_solid_#EDE6DA]">
              <p className="[margin:0_0_10px] text-[11px] [font-weight:600] tracking-[0.22em] uppercase text-[#96876C]">Kata pelanggan</p>
              <h3 className="[margin:0_0_8px] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(20px,4.8vw,27px)] leading-[1.16] [font-weight:600] tracking-[-0.03em] text-pretty">Kenapa pelanggan puas setelah gorden terpasang?</h3>
              <div className="inline-flex items-center gap-[14px] [margin:0_0_22px] py-[12px] px-[18px] bg-[#FCFAF6] [border:1px_solid_#E5DDCF] rounded-[20px]">
                <img src="/assets-lp2/google-g.svg" alt="Google" className="flex-none w-[26px] h-[26px] block" />
                <span className="flex flex-col gap-[2px]">
                  <span className="flex items-center gap-[7px]"><span className="text-[#FFB800] text-[14px] tracking-[1px]">★★★★★</span><strong className="text-[15px] text-[#221F1A]">5,0</strong></span>
                  <span className="text-[13px] text-[oklch(0.5_0.03_70)]">100+ ulasan di Google Review</span>
                </span>
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-[16px] items-stretch">
                <article className="flex flex-col bg-[#FCFAF6] [border:1px_solid_#E8E1D4] rounded-[20px] overflow-hidden">
                  <div className="aspect-[3/4] bg-[image:url(/assets-lp2/testi-1.webp)] bg-[size:cover] bg-[position:center]"></div>
                  <div className="flex-[1] flex flex-col [padding:18px_20px_20px]">
                    <span className="inline-flex self-start items-center gap-[6px] [margin:0_0_12px] py-[5px] px-[11px] bg-[#F2EDE3] [border:1px_solid_#E5DDCF] rounded-[999px] text-[11.5px] [font-weight:700] tracking-[0.04em] uppercase text-[#6E6553]">Harga sebanding kualitasnya</span>
                    <div className="flex items-center gap-[12px] [margin:0_0_12px]">
                      <img src="/assets-lp2/ava-1.webp" alt="Notikawati Puput" className="flex-none w-[40px] h-[40px] rounded-[999px] object-cover block" />
                      <span className="flex flex-col gap-[2px] min-w-[0]">
                        <span className="text-[15px] [font-weight:700] text-[#221F1A]">Notikawati Puput</span>
                        <span className="flex items-center gap-[6px]">
                          <span className="text-[#FFB800] text-[12px] tracking-[1px]">★★★★★</span>
                          <span className="text-[12px] text-[#7B7263]">7 bulan lalu</span>
                        </span>
                      </span>
                      <img src="/assets-lp2/google-g.svg" alt="Google" className="flex-none ml-[auto] w-[18px] h-[18px] block" />
                    </div>
                    <p className="m-[0] text-[14.5px] leading-[1.6] text-[#4A4339]">Desainnya elegan, dan <b className="[font-weight:700] text-[#221F1A]">kualitas bahan serta jahitannya rapi dan premium</b>. Ruangan jadi terlihat lebih cantik dan berkelas.</p>
                  </div>
                </article>
                <article className="flex flex-col bg-[#FCFAF6] [border:1px_solid_#E8E1D4] rounded-[20px] overflow-hidden">
                  <div className="aspect-[3/4] bg-[image:url(/assets-lp2/testi-2.webp)] bg-[size:cover] bg-[position:center]"></div>
                  <div className="flex-[1] flex flex-col [padding:18px_20px_20px]">
                    <span className="inline-flex self-start items-center gap-[6px] [margin:0_0_12px] py-[5px] px-[11px] bg-[#F2EDE3] [border:1px_solid_#E5DDCF] rounded-[999px] text-[11.5px] [font-weight:700] tracking-[0.04em] uppercase text-[#6E6553]">Selesai lebih cepat dari janji</span>
                    <div className="flex items-center gap-[12px] [margin:0_0_12px]">
                      <img src="/assets-lp2/ava-2.webp" alt="Ing Sun" className="flex-none w-[40px] h-[40px] rounded-[999px] object-cover block" />
                      <span className="flex flex-col gap-[2px] min-w-[0]">
                        <span className="text-[15px] [font-weight:700] text-[#221F1A]">Ing Sun</span>
                        <span className="flex items-center gap-[6px]">
                          <span className="text-[#FFB800] text-[12px] tracking-[1px]">★★★★★</span>
                          <span className="text-[12px] text-[#7B7263]">3 bulan lalu</span>
                        </span>
                      </span>
                      <img src="/assets-lp2/google-g.svg" alt="Google" className="flex-none ml-[auto] w-[18px] h-[18px] block" />
                    </div>
                    <p className="m-[0] text-[14.5px] leading-[1.6] text-[#4A4339]">Produk bagus, bisa custom, dan <b className="[font-weight:700] text-[#221F1A]">orderan selesai serta dipasang lebih cepat dari yang dijanjikan</b>. Sangat recommended.</p>
                  </div>
                </article>
                <article className="flex flex-col bg-[#FCFAF6] [border:1px_solid_#E8E1D4] rounded-[20px] overflow-hidden">
                  <div className="aspect-[3/4] bg-[image:url(/assets-lp2/testi-3.webp)] bg-[size:cover] bg-[position:center]"></div>
                  <div className="flex-[1] flex flex-col [padding:18px_20px_20px]">
                    <span className="inline-flex self-start items-center gap-[6px] [margin:0_0_12px] py-[5px] px-[11px] bg-[#F2EDE3] [border:1px_solid_#E5DDCF] rounded-[999px] text-[11.5px] [font-weight:700] tracking-[0.04em] uppercase text-[#6E6553]">Warnanya cocok di ruangan</span>
                    <div className="flex items-center gap-[12px] [margin:0_0_12px]">
                      <img src="/assets-lp2/ava-3.webp" alt="Chusnul Khotimah" className="flex-none w-[40px] h-[40px] rounded-[999px] object-cover block" />
                      <span className="flex flex-col gap-[2px] min-w-[0]">
                        <span className="text-[15px] [font-weight:700] text-[#221F1A]">Chusnul Khotimah</span>
                        <span className="flex items-center gap-[6px]">
                          <span className="text-[#FFB800] text-[12px] tracking-[1px]">★★★★★</span>
                          <span className="text-[12px] text-[#7B7263]">1 minggu lalu</span>
                        </span>
                      </span>
                      <img src="/assets-lp2/google-g.svg" alt="Google" className="flex-none ml-[auto] w-[18px] h-[18px] block" />
                    </div>
                    <p className="m-[0] text-[14.5px] leading-[1.6] text-[#4A4339]">Pesan jauh-jauh dari Semarang, dan <b className="[font-weight:700] text-[#221F1A]">hasilnya rapi banget, warnanya cocok dengan ruangan</b>. Rumah jadi terasa baru.</p>
                  </div>
                </article>
              </div>


              <div className="[margin:26px_0_0] [padding:18px_0_0] [border-top:1px_solid_#ECE5D9]">
                <p className="[margin:0_0_12px] text-center text-[12.5px] text-[#7B7263]">Cuplikan ulasan lain langsung dari Google</p>
                <div className="flex items-center justify-center gap-y-[clamp(6px,] gap-x-[2vw,]">
                  <button onClick={reviewPrevClick} aria-label="Ulasan sebelumnya" className="flex-none flex items-center justify-center h-[30px] w-[30px] rounded-[999px] [border:1px_solid_#E5DDCF] bg-[#fff] shadow-[0_6px_16px_rgba(58,53,44,0.16)] text-[#3a352c] text-[15px] cursor-pointer hover:bg-[#F2EDE3]">‹</button>
                  <div className="flex-[1_1_auto] min-w-[0] overflow-hidden [padding:8px_0_22px]">
                    <div className="flex items-center" style={{ transition: reviewNoAnim ? 'none' : 'transform 0.7s cubic-bezier(0.22, 0.61, 0.36, 1)', transform: `translateX(calc(${isNarrow ? 12 : 27}% - ${reviewPos} * ${isNarrow ? 76 : 46}%))` }}>
                      {reviewSlides.map((src, i) => (
        <div key={i} onClick={() => onSlideClick(i)} className="flex-[0_0_76%] min-[761px]:flex-[0_0_46%] flex justify-center py-[0] px-[6px] cursor-pointer" style={{ transition: reviewNoAnim ? 'none' : 'opacity 0.7s ease, transform 0.7s ease', opacity: i === reviewPos ? 1 : 0.45, transform: `scale(${i === reviewPos ? 1 : 0.9})` }}>
                          <img src={src} alt="Ulasan pelanggan di Google" className="block h-[min(46vh,300px)] min-[761px]:h-[240px] w-[auto] max-w-[100%] object-contain rounded-[16px] [border:1px_solid_#ECE5D9] bg-[#fff] shadow-[0_20px_38px_-22px_rgba(58,53,44,0.95)]" />
                        </div>
        ))}
                    </div>
                  </div>
                  <button onClick={reviewNextClick} aria-label="Ulasan selanjutnya" className="flex-none flex items-center justify-center h-[30px] w-[30px] rounded-[999px] [border:1px_solid_#E5DDCF] bg-[#fff] shadow-[0_6px_16px_rgba(58,53,44,0.16)] text-[#3a352c] text-[15px] cursor-pointer hover:bg-[#F2EDE3]">›</button>
                </div>
                <div className="flex justify-center gap-[6px] [margin:10px_0_0]">
                  {reviewShots.map((_, i) => (<span key={i} className={`w-[5px] h-[5px] rounded-[999px] ${i === reviewIdx ? 'bg-[#6E6553]' : 'bg-[#CFC5B0]'}`} />))}
                </div>
                </div>

                </div>
                <div className="flex justify-center [margin:clamp(18px,3.2vw,26px)_0_0]">
                  <a href="https://wa.me/6285860525758?text=Halo%20saya%20mau%20pesan%20Gorden%20Custom%2C%2Cbisa%20survey%20ke%20lokasi%3F" target="_blank" rel="noopener" className="flex-[0_1_380px] flex items-center justify-center gap-[9px] min-h-[56px] py-[14px] px-[20px] bg-[#25D366] text-[#fff] text-[clamp(15px,3.9vw,17px)] [font-weight:700] tracking-[-0.01em] no-underline rounded-[12px] shadow-[0px_8px_20px_rgba(37,211,102,0.3)] hover:bg-[#1FBA57]"><img src="/assets-lp2/whatsapp.svg" alt="" className="flex-none w-[20px] h-[20px] block [filter:brightness(0)_invert(1)]" />Konsultasi Gratis →</a>
                </div>
              </div>
            </section>

            <section className="py-[clamp(46px,8vw,78px)] px-[0] [border-top:1px_solid_#EDE6DA]">
              <div id="proses" className="scroll-mt-[76px]">
                <p className="[margin:0_0_10px] text-[11px] [font-weight:600] tracking-[0.22em] uppercase text-[#96876C]">Cara kerja</p>
                <h3 className="[margin:0_0_16px] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(20px,4.8vw,27px)] leading-[1.16] [font-weight:600] tracking-[-0.03em] text-[#221F1A] text-pretty">Dari ukur sampai terpasang, kami yang urus semuanya.</h3>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(min(46%,200px),1fr))] gap-[10px]">
                  <div className="relative flex flex-col gap-[10px] py-[16px] px-[14px] bg-[#FCFAF6] [border:1px_solid_#E5DDCF] rounded-[12px]">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center justify-center w-[40px] h-[40px] rounded-[10px] bg-[#F2EDE3] text-[#6E6553]"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h16v11H8l-4 4z"/></svg></span>
                      <span className="[font-family:IBM_Plex_Mono,ui-monospace,monospace] text-[12px] text-[#A79B85]">01</span>
                    </div>
                    <p className="m-[0] text-[clamp(14px,3.7vw,15.5px)] [font-weight:600] leading-[1.3] text-[#221F1A]">Chat WA</p>
                    <p className="m-[0] text-[clamp(12.5px,3.3vw,13.5px)] leading-[1.45] text-[#6F6757]">Kirim foto jendela & ceritakan kebutuhan.</p>
                  </div>
                  <div className="relative flex flex-col gap-[10px] py-[16px] px-[14px] bg-[#FCFAF6] [border:1px_solid_#E5DDCF] rounded-[12px]">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center justify-center w-[40px] h-[40px] rounded-[10px] bg-[#F2EDE3] text-[#6E6553]"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 15 15 3l6 6L9 21z"/><path d="m7 11 2 2M10 8l2 2M13 5l2 2"/></svg></span>
                      <span className="[font-family:IBM_Plex_Mono,ui-monospace,monospace] text-[12px] text-[#A79B85]">02</span>
                    </div>
                    <p className="m-[0] text-[clamp(14px,3.7vw,15.5px)] [font-weight:600] leading-[1.3] text-[#221F1A]">Survey &amp; ukur gratis</p>
                    <p className="m-[0] text-[clamp(12.5px,3.3vw,13.5px)] leading-[1.45] text-[#6F6757]">Tim datang ke rumah, ukur presisi.</p>
                  </div>
                  <div className="relative flex flex-col gap-[10px] py-[16px] px-[14px] bg-[#FCFAF6] [border:1px_solid_#E5DDCF] rounded-[12px]">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center justify-center w-[40px] h-[40px] rounded-[10px] bg-[#F2EDE3] text-[#6E6553]"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20 18 6"/><circle cx="19" cy="5" r="2"/><path d="M4 20c3-1 5-3 6-6"/></svg></span>
                      <span className="[font-family:IBM_Plex_Mono,ui-monospace,monospace] text-[12px] text-[#A79B85]">03</span>
                    </div>
                    <p className="m-[0] text-[clamp(14px,3.7vw,15.5px)] [font-weight:600] leading-[1.3] text-[#221F1A]">Dijahit sesuai ukuran</p>
                    <p className="m-[0] text-[clamp(12.5px,3.3vw,13.5px)] leading-[1.45] text-[#6F6757]">Dibuat pas dengan jendela Anda.</p>
                  </div>
                  <div className="relative flex flex-col gap-[10px] py-[16px] px-[14px] bg-[#FCFAF6] [border:1px_solid_#E5DDCF] rounded-[12px]">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center justify-center w-[40px] h-[40px] rounded-[10px] bg-[#F2EDE3] text-[#6E6553]"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V4h14v17"/><path d="m9 12 2 2 4-4"/></svg></span>
                      <span className="[font-family:IBM_Plex_Mono,ui-monospace,monospace] text-[12px] text-[#A79B85]">04</span>
                    </div>
                    <p className="m-[0] text-[clamp(14px,3.7vw,15.5px)] [font-weight:600] leading-[1.3] text-[#221F1A]">Dipasang &amp; dicek bersama</p>
                    <p className="m-[0] text-[clamp(12.5px,3.3vw,13.5px)] leading-[1.45] text-[#6F6757]">Rapi, dicek bareng sebelum selesai.</p>
                  </div>
                </div>
                <p className="flex items-start gap-[10px] [margin:16px_0_0] py-[13px] px-[15px] bg-[#F2EDE3] [border:1px_solid_#E5DDCF] rounded-[12px] text-[clamp(14px,3.7vw,15.5px)] leading-[1.45] text-[#3C3529]"><span aria-hidden="true" className="flex-none flex items-center justify-center w-[22px] h-[22px] rounded-[999px] bg-[#6E6553] text-[#FCFAF6] text-[12px] [font-weight:700]">✓</span><span><strong className="text-[#221F1A] [font-weight:600]">Kurang pas dalam 14 hari?</strong> Kami perbaiki tanpa biaya.</span></p>
              </div>
              <div className="[margin:26px_0_0]">
                <div className="flex flex-col items-stretch gap-[10px]">
                  <a href="https://wa.me/6285860525758?text=Halo%20saya%20mau%20pesan%20Gorden%20Custom%2C%2Cbisa%20survey%20ke%20lokasi%3F" target="_blank" rel="noopener" className="flex-[1_1_100%] flex items-center justify-center gap-[9px] min-h-[56px] py-[14px] px-[20px] bg-[#25D366] text-[#fff] text-[clamp(15px,3.9vw,17px)] [font-weight:700] tracking-[-0.01em] no-underline rounded-[12px] shadow-[0px_8px_20px_rgba(37,211,102,0.3)] hover:bg-[#1FBA57]"><img src="/assets-lp2/whatsapp.svg" alt="" className="flex-none w-[20px] h-[20px] block [filter:brightness(0)_invert(1)]" />Konsultasi Gratis →</a>
                  <p className="m-[0] text-center text-[clamp(12.5px,3.3vw,13.5px)] leading-[1.45] text-[#6F6757]">Chat langsung dibalas owner, gratis dan tanpa wajib memesan.</p>
                </div>
                <div className="flex flex-wrap justify-center items-center gap-y-[5px] gap-x-[10px] [margin:12px_0_0] text-[clamp(11.5px,3vw,12.5px)] [font-weight:500] text-center text-[#3C3529]">
                  <span className="text-[#FFB800] tracking-[1px]">★★★★★</span><strong className="text-[#221F1A]">5,0</strong><span>Google Review</span><span className="opacity-[0.5]">•</span><span>1.000+ pembeli</span><span className="opacity-[0.5]">•</span><span>Garansi pemasangan 14 hari</span>
                </div>
              </div>

            </section>

            <section className="py-[clamp(46px,8vw,78px)] px-[0] [border-top:1px_solid_#EDE6DA]">
              <p className="[margin:0_0_10px] text-[11px] [font-weight:600] tracking-[0.22em] uppercase text-[#96876C]">Tanya jawab &amp; area layanan</p>
              <h2 className="[margin:0_0_8px] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(22px,5.6vw,34px)] leading-[1.16] [font-weight:700] tracking-[-0.03em]">Pertanyaan yang paling sering masuk</h2>
              <p className="[margin:0_0_22px] text-[#585045] max-w-[62ch] text-[clamp(14.5px,3.9vw,16.5px)] leading-[1.55]">Klik pertanyaannya untuk melihat jawaban.</p>
              <div className="grid gap-[10px]">
                <details open className="bg-[#FCFAF6] [border:1px_solid_#E5DDCF] rounded-[20px] overflow-hidden">
                  <summary className="flex items-center gap-[11px] py-[13px] px-[14px] cursor-pointer list-none text-[clamp(14px,3.7vw,16px)] leading-[1.35] [font-weight:600] text-[#221F1A]">
                    <span className="flex-none w-[24px] h-[24px] flex items-center justify-center rounded-[999px] bg-[#6E6553] text-[#FCFAF6] text-[12px] [font-weight:700]">1</span>
                    <span className="flex-[1]">Apakah survey dan konsultasi bayar?</span>
                    <span className="flex-none text-[19px] leading-[1] text-[#6E6553]">+</span>
                  </summary>
                  <div className="[padding:0_16px_16px_49px] text-[clamp(13.5px,3.6vw,15.5px)] leading-[1.55] text-[#4F4840]">Tidak. Konsultasi dan survey ke lokasi <strong>gratis</strong> untuk seluruh Solo Raya.</div>
                </details>
                <details className="bg-[#FCFAF6] [border:1px_solid_#E5DDCF] rounded-[20px] overflow-hidden">
                  <summary className="flex items-center gap-[11px] py-[13px] px-[14px] cursor-pointer list-none text-[clamp(14px,3.7vw,16px)] leading-[1.35] [font-weight:600] text-[#221F1A]">
                    <span className="flex-none w-[24px] h-[24px] flex items-center justify-center rounded-[999px] bg-[#6E6553] text-[#FCFAF6] text-[12px] [font-weight:700]">2</span>
                    <span className="flex-[1]">Bagaimana cara tahu perkiraan biayanya?</span>
                    <span className="flex-none text-[19px] leading-[1] text-[#6E6553]">+</span>
                  </summary>
                  <div className="[padding:0_16px_16px_49px] text-[clamp(13.5px,3.6vw,15.5px)] leading-[1.55] text-[#4F4840]">Kirim foto dan ukuran kasar jendela lewat WA, owner bantu perkirakan biayanya. <strong>Biaya pasti</strong> diberikan setelah survey gratis.</div>
                </details>
                <details className="bg-[#FCFAF6] [border:1px_solid_#E5DDCF] rounded-[20px] overflow-hidden">
                  <summary className="flex items-center gap-[11px] py-[13px] px-[14px] cursor-pointer list-none text-[clamp(14px,3.7vw,16px)] leading-[1.35] [font-weight:600] text-[#221F1A]">
                    <span className="flex-none w-[24px] h-[24px] flex items-center justify-center rounded-[999px] bg-[#6E6553] text-[#FCFAF6] text-[12px] [font-weight:700]">3</span>
                    <span className="flex-[1]">Berapa lama pembuatan dan pemasangan?</span>
                    <span className="flex-none text-[19px] leading-[1] text-[#6E6553]">+</span>
                  </summary>
                  <div className="[padding:0_16px_16px_49px] text-[clamp(13.5px,3.6vw,15.5px)] leading-[1.55] text-[#4F4840]">Umumnya <strong>7-10 hari kerja setelah survey</strong>, lalu pemasangan dijadwalkan sesuai waktu Anda.</div>
                </details>
                <details className="bg-[#FCFAF6] [border:1px_solid_#E5DDCF] rounded-[20px] overflow-hidden">
                  <summary className="flex items-center gap-[11px] py-[13px] px-[14px] cursor-pointer list-none text-[clamp(14px,3.7vw,16px)] leading-[1.35] [font-weight:600] text-[#221F1A]">
                    <span className="flex-none w-[24px] h-[24px] flex items-center justify-center rounded-[999px] bg-[#6E6553] text-[#FCFAF6] text-[12px] [font-weight:700]">4</span>
                    <span className="flex-[1]">Kalau setelah dipasang kurang pas?</span>
                    <span className="flex-none text-[19px] leading-[1] text-[#6E6553]">+</span>
                  </summary>
                  <div className="[padding:0_16px_16px_49px] text-[clamp(13.5px,3.6vw,15.5px)] leading-[1.55] text-[#4F4840]">Masuk <strong>garansi pemasangan 14 hari</strong>. Kabari saja, kami datang memperbaiki tanpa biaya tambahan.</div>
                </details>
              </div>

              <div className="[margin:clamp(28px,5vw,40px)_0_0] py-[clamp(24px,5.5vw,32px)] px-[clamp(16px,4.5vw,24px)] bg-[#6E6553] text-[#FCFAF6] rounded-[12px]">
              <p className="[margin:0_0_10px] text-[12px] [font-weight:700] tracking-[0.14em] uppercase text-[rgba(253,252,250,0.75)]">Area layanan</p>
              <h3 className="[margin:0_0_8px] [font-family:Poppins,Helvetica,sans-serif] text-[clamp(20px,4.8vw,27px)] leading-[1.16] [font-weight:600] tracking-[-0.03em]">Survey &amp; pasang di seluruh Solo Raya</h3>
              <p className="[margin:0_0_20px] text-[rgba(253,252,250,0.85)] max-w-[62ch]">Workshop kami di Jl. Raya Songgo Langit No.22, Gentan, Baki, Sukoharjo, dan tim datang ke lokasi Anda tanpa biaya survey.</p>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(46%,130px),1fr))] gap-[10px]">
                <span className="py-[14px] px-[16px] bg-[rgba(253,252,250,0.12)] [border:1px_solid_rgba(253,252,250,0.28)] rounded-[12px] text-[17px] [font-weight:600] text-center">Solo</span>
                <span className="py-[14px] px-[16px] bg-[rgba(253,252,250,0.12)] [border:1px_solid_rgba(253,252,250,0.28)] rounded-[12px] text-[17px] [font-weight:600] text-center">Sukoharjo</span>
                <span className="py-[14px] px-[16px] bg-[rgba(253,252,250,0.12)] [border:1px_solid_rgba(253,252,250,0.28)] rounded-[12px] text-[17px] [font-weight:600] text-center">Karanganyar</span>
                <span className="py-[14px] px-[16px] bg-[rgba(253,252,250,0.12)] [border:1px_solid_rgba(253,252,250,0.28)] rounded-[12px] text-[17px] [font-weight:600] text-center">Boyolali</span>
                <span className="py-[14px] px-[16px] bg-[rgba(253,252,250,0.12)] [border:1px_solid_rgba(253,252,250,0.28)] rounded-[12px] text-[17px] [font-weight:600] text-center">Klaten</span>
                <span className="py-[14px] px-[16px] bg-[rgba(253,252,250,0.12)] [border:1px_solid_rgba(253,252,250,0.28)] rounded-[12px] text-[17px] [font-weight:600] text-center">Sragen</span>
              </div>
              <p className="[margin:18px_0_0] text-[16px] text-[rgba(253,252,250,0.85)]">Di luar area tersebut? Tanyakan dulu lewat WhatsApp, biasanya masih bisa kami bantu.</p>

              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-[12px] [margin:22px_0_0]">
                <div className="py-[16px] px-[18px] bg-[rgba(252,250,246,0.08)] [border:1px_solid_rgba(252,250,246,0.2)] rounded-[12px]">
                  <p className="[margin:0_0_6px] text-[11px] [font-weight:600] tracking-[0.18em] uppercase text-[rgba(252,250,246,0.7)]">Workshop</p>
                  <p className="[margin:0_0_4px] text-[16px] [font-weight:600] leading-[1.4] text-[#FCFAF6]">Jl. Raya Songgo Langit No.22, Ngebrak, Gentan, Kec. Baki, Kabupaten Sukoharjo, Jawa Tengah 57556</p>
                  <p className="[margin:0_0_10px] text-[13.5px] leading-[1.5] text-[rgba(252,250,246,0.8)]">Senin-Sabtu 09.00-17.00, Minggu dan hari libur by appointment</p>
                  <a href="https://maps.app.goo.gl/FDrjvrU4xpjdRQBk8" target="_blank" rel="noopener" className="inline-flex items-center gap-[6px] min-h-[36px] text-[14px] [font-weight:600] text-[#FCFAF6] underline [text-underline-offset:3px]">Buka di Google Maps →</a>
                </div>
                <div className="py-[16px] px-[18px] bg-[rgba(252,250,246,0.08)] [border:1px_solid_rgba(252,250,246,0.2)] rounded-[12px]">
                  <p className="[margin:0_0_6px] text-[11px] [font-weight:600] tracking-[0.18em] uppercase text-[rgba(252,250,246,0.7)]">Kontak WhatsApp</p>
                  <p className="[margin:0_0_4px] text-[16px] [font-weight:600] leading-[1.4] text-[#FCFAF6]">085860525758</p>
                  <p className="[margin:0_0_10px] text-[13.5px] leading-[1.5] text-[rgba(252,250,246,0.8)]">Online 24 jam, setiap hari</p>
                  <a href="https://wa.me/6285860525758?text=Halo%20saya%20mau%20pesan%20Gorden%20Custom%2C%2Cbisa%20survey%20ke%20lokasi%3F" target="_blank" rel="noopener" className="inline-flex items-center gap-[6px] min-h-[36px] text-[14px] [font-weight:600] text-[#FCFAF6] underline [text-underline-offset:3px]">Chat sekarang →</a>
                </div>
              </div>
              </div>
              <div className="[margin:26px_0_0]">
                <div className="flex flex-col items-stretch gap-[10px]">
                  <a href="https://wa.me/6285860525758?text=Halo%20saya%20mau%20pesan%20Gorden%20Custom%2C%2Cbisa%20survey%20ke%20lokasi%3F" target="_blank" rel="noopener" className="flex-[1_1_100%] flex items-center justify-center gap-[9px] min-h-[56px] py-[14px] px-[20px] bg-[#25D366] text-[#fff] text-[clamp(15px,3.9vw,17px)] [font-weight:700] tracking-[-0.01em] no-underline rounded-[12px] shadow-[0px_8px_20px_rgba(37,211,102,0.3)] hover:bg-[#1FBA57]"><img src="/assets-lp2/whatsapp.svg" alt="" className="flex-none w-[20px] h-[20px] block [filter:brightness(0)_invert(1)]" />Jadwalkan Survey Gratis →</a>
                  <p className="m-[0] text-center text-[clamp(12.5px,3.3vw,13.5px)] leading-[1.45] text-[#6F6757]">Chat langsung dibalas owner, gratis dan tanpa wajib memesan.</p>
                </div>
                <div className="flex flex-wrap justify-center items-center gap-y-[5px] gap-x-[10px] [margin:12px_0_0] text-[clamp(11.5px,3vw,12.5px)] [font-weight:500] text-center text-[#3C3529]">
                  <span className="text-[#FFB800] tracking-[1px]">★★★★★</span><strong className="text-[#221F1A]">5,0</strong><span>Google Review</span><span className="opacity-[0.5]">•</span><span>1.000+ pembeli</span><span className="opacity-[0.5]">•</span><span>Garansi pemasangan 14 hari</span>
                </div>
              </div>

            </section>


            <footer className="[padding:34px_0_0] mt-[30px] [border-top:1px_solid_#E5DDCF] text-[15px] text-[#585045] grid gap-[6px]">
              <p className="[margin:0_0_6px] [font-family:Poppins,Helvetica,sans-serif] text-[19px] [font-weight:600] text-[oklch(0.24_0.02_60)]">Gorden Wallpaper Solo</p>
              <p className="m-[0]">Jl. Raya Songgo Langit No.22, Ngebrak, Gentan, Kec. Baki, Kabupaten Sukoharjo, Jawa Tengah 57556</p>
              <p className="m-[0]">WhatsApp: <a href="https://wa.me/6285860525758" target="_blank" rel="noopener" className="[font-weight:600]">085860525758</a></p>
              <p className="m-[0]">Jam operasional online: 24 jam, setiap hari</p>
              <p className="m-[0]">Workshop: Senin-Sabtu 09.00-17.00, Minggu dan hari libur by appointment</p>
              <p className="m-[0]"><a href="https://instagram.com/gorden.wallpapersolo" target="_blank" rel="noopener">Instagram @gorden.wallpapersolo</a> · <a href="https://facebook.com/search/top?q=gorden%20wallpaper%20solo" target="_blank" rel="noopener">Facebook Gorden Wallpaper Solo</a></p>
              <p className="[margin:8px_0_0] text-[13px] text-[oklch(0.58_0.03_70)]">Melayani gorden custom rumah &amp; kantor di Solo, Sukoharjo, Karanganyar, Boyolali, Klaten, dan Sragen sejak 2012.</p>
            </footer>
            <div className="hidden max-[760px]:contents"><div className="h-[76px]"></div></div>

          </div>

          {lightbox ? (<>
            <div onClick={closeLightbox} className="fixed inset-0 z-[90] flex items-center justify-center p-[20px] bg-[rgba(28,25,20,0.88)] [cursor:zoom-out]">
              <div onClick={stopClick} className="flex flex-col items-center gap-[14px] max-w-[100%] max-h-[100%] [cursor:default]">
                <img alt="Pratinjau gambar" src={lightbox ?? undefined} className="max-w-[100%] max-h-[74vh] w-[auto] h-[auto] rounded-[12px] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)]" />
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

          {nudge && !nudgeClosed ? (<>
            <a href="https://wa.me/6285860525758?text=Halo%20saya%20mau%20pesan%20Gorden%20Custom%2C%2Cbisa%20survey%20ke%20lokasi%3F" target="_blank" rel="noopener" onClick={closeNudge} className="fixed right-[18px] bottom-[86px] min-[761px]:bottom-[88px] z-[59] max-w-[min(260px,calc(100vw-36px))] min-[761px]:max-w-[min(320px,calc(100vw-36px))] flex items-start gap-[10px] py-[9px] px-[10px] min-[761px]:py-[15px] min-[761px]:px-[16px] bg-[#FCFAF6] [border:1px_solid_#E5DDCF] rounded-[16px] shadow-[0_18px_44px_-18px_rgba(32,29,24,0.42)] no-underline cursor-pointer hover:bg-[#F7F3EA]">
              <img src="/assets-lp2/owner-elang.webp" alt="" className="flex-none w-[26px] h-[26px] min-[761px]:w-[42px] min-[761px]:h-[42px] rounded-[999px] object-cover bg-[#F2EDE3] [border:1px_solid_#E5DDCF]" />
              <div className="min-w-[0]">
                <p className="[margin:0_0_3px] [font-family:Poppins,Helvetica,sans-serif] text-[11.5px] min-[761px]:text-[14px] [font-weight:700] leading-[1.3] text-[#221F1A]">Pak Elang - Owner Gorden Wallpaper Solo</p>
                <p className="[margin:0_0_7px] text-[11.5px] min-[761px]:text-[13.5px] leading-[1.4] text-[#585045] text-pretty"><span className="min-[761px]:hidden">Bingung pilih model? Tanya saya.</span><span className="hidden min-[761px]:inline">Masih bingung pilih model atau ukuran? Tanya langsung ke saya di WA.</span></p>
                <span className="inline-flex items-center gap-[6px] text-[11.5px] min-[761px]:text-[13.5px] [font-weight:700] text-[#1EA855]">Balas sekarang <span aria-hidden="true">→</span></span>
              </div>
              <button type="button" onClick={closeNudgeBtn} aria-label="Tutup" className="absolute top-[-10px] right-[-8px] w-[28px] h-[28px] flex items-center justify-center rounded-[999px] border-0 bg-[#221F1A] text-[#FCFAF6] text-[13px] leading-[1] cursor-pointer">✕</button>
            </a>
          </>) : null}


          <a href="https://wa.me/6285860525758?text=Halo%20saya%20mau%20pesan%20Gorden%20Custom%2C%2Cbisa%20survey%20ke%20lokasi%3F" target="_blank" rel="noopener" aria-label="Konsultasi gratis via WhatsApp" className="fixed right-[18px] bottom-[18px] z-[60] flex items-center justify-center w-[58px] h-[58px] rounded-[999px] no-underline shadow-[0_14px_28px_-10px_rgba(37,211,102,0.6)] bg-[#25D366] hover:bg-[#1EBE5A] active:bg-[#19A84F]">
            <img src="/assets-lp2/whatsapp.svg" alt="" className="w-[32px] h-[32px] block [filter:brightness(0)_invert(1)]" />
          </a>

        </div>
      </div>
    </>
  );
}
