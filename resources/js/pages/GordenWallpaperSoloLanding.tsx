import { Head } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, MouseEvent as ReactMouseEvent } from 'react';

type LightboxItem = { src: string; caption: string };

const reviewShots: string[] = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => `/assets-lp2/review-${n}.webp`);
const reviewSlides: string[] = [...reviewShots, ...reviewShots, ...reviewShots];
const N = reviewShots.length;

export default function GordenWallpaperSoloLanding() {
  const [katMore, setKatMore] = useState<boolean>(false);
  const [showNudge, setShowNudge] = useState<boolean>(false);
  const [nudgeClosed, setNudgeClosed] = useState<boolean>(false);
  const [reviewPos, setReviewPos] = useState<number>(N);
  const [reviewNoAnim, setReviewNoAnim] = useState<boolean>(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [lbList, setLbList] = useState<LightboxItem[]>([]);
  const [lbIdx, setLbIdx] = useState<number>(0);

  const reviewIdx: number = ((reviewPos % N) + N) % N;
  const lightboxCaption: string = lbList[lbIdx]?.caption ?? '';
  const lightboxPos: string = lbList.length > 1 ? `${lbIdx + 1} / ${lbList.length}` : '';
  const katMoreLabel: string = katMore ? 'Sembunyikan model lain ↑' : 'Lihat model lain (9) ↓';

  const lightboxImgRef = useRef<HTMLImageElement | null>(null);
  const reviewTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const normTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const posRef = useRef<number>(N);

  /* carousel ulasan: geser halus + looping tanpa lompat balik */
  const advanceReview = useCallback((d: number) => {
    const pos = posRef.current + d;
    posRef.current = pos;
    setReviewNoAnim(false);
    setReviewPos(pos);

    if (normTimer.current) {
clearTimeout(normTimer.current);
}

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
    if (reviewTimer.current) {
clearInterval(reviewTimer.current);
}

    reviewTimer.current = setInterval(() => advanceReview(1), 3500);
  }, [advanceReview]);

  useEffect(() => {
    startTimer();

    return () => {
      if (reviewTimer.current) {
clearInterval(reviewTimer.current);
}

      if (normTimer.current) {
clearTimeout(normTimer.current);
}
    };
  }, [startTimer]);

  const stepReview = useCallback(
    (d: number) => {
      advanceReview(d);
      startTimer();
    },
    [advanceReview, startTimer],
  );
  const reviewPrevClick = useCallback(() => stepReview(-1), [stepReview]);
  const reviewNextClick = useCallback(() => stepReview(1), [stepReview]);

  const onSlideClick = (i: number): void => {
    if (i === reviewPos) {
      setLbList(reviewShots.map((src) => ({ src, caption: '' })));
      setLbIdx(reviewIdx);
      setLightbox(reviewShots[reviewIdx]);
    } else {
      stepReview(i - reviewPos);
    }
  };

  /* popup WA muncul saat pertengahan section katalog */
  useEffect(() => {
    const onScroll = (): void => {
      const k = document.getElementById('katalog');

      if (!k) {
return;
}

      const r = k.getBoundingClientRect();

      if (r.top + r.height / 2 <= window.innerHeight * 0.6) {
        setShowNudge(true);
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeNudge = useCallback(() => setNudgeClosed(true), []);
  const closeNudgeBtn = useCallback((e: ReactMouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setNudgeClosed(true);
  }, []);

  const toggleKatMore = useCallback(() => setKatMore((v) => !v), []);

  /* lightbox */
  useEffect(() => {
    const el = lightboxImgRef.current;

    if (el && lightbox && el.getAttribute('src') !== lightbox) {
el.src = lightbox;
}
  }, [lightbox]);

  const closeLightbox = useCallback(() => {
    setLightbox(null);
    setLbList([]);
    setLbIdx(0);
  }, []);
  const moveLightbox = useCallback(
    (d: number) => {
      const n = lbList.length;

      if (!n) {
return;
}

      const i = (lbIdx + d + n) % n;
      setLbIdx(i);
      setLightbox(lbList[i].src);
    },
    [lbIdx, lbList],
  );
  const lightboxPrev = useCallback(() => moveLightbox(-1), [moveLightbox]);
  const lightboxNext = useCallback(() => moveLightbox(1), [moveLightbox]);
  const stopClick = useCallback((e: ReactMouseEvent) => e.stopPropagation(), []);

  useEffect(() => {
    const onZoomClick = (e: MouseEvent): void => {
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-zoom]');

      if (!t) {
return;
}

      const scope: ParentNode = t.closest('section') ?? document;
      const nodes = Array.from(scope.querySelectorAll<HTMLElement>('[data-zoom]'));
      const list: LightboxItem[] = nodes.map((n) => {
        const cap = n.querySelector('figcaption');
        let parts: string[] = [];

        if (cap) {
parts = Array.from(cap.querySelectorAll('span')).map((x) => (x.textContent ?? '').trim()).filter(Boolean);
}

        if (!parts.length) {
          const box = n.parentElement;
          parts = box ? Array.from(box.querySelectorAll('p')).map((p) => (p.textContent ?? '').trim()).filter(Boolean) : [];
        }

        return { src: n.getAttribute('data-zoom') ?? '', caption: parts.slice(0, 2).join(', ') };
      });
      const idx = Math.max(0, nodes.indexOf(t));
      setLbList(list);
      setLbIdx(idx);
      setLightbox(list[idx]?.src ?? null);
    };
    document.addEventListener('click', onZoomClick);

    return () => document.removeEventListener('click', onZoomClick);
  }, []);

  useEffect(() => {
    if (!lightbox) {
return;
}

    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
closeLightbox();
}

      if (e.key === 'ArrowLeft') {
lightboxPrev();
}

      if (e.key === 'ArrowRight') {
lightboxNext();
}
    };
    window.addEventListener('keydown', onKey);

    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, closeLightbox, lightboxPrev, lightboxNext]);

  return (
    <>
      <Head title="Gorden Custom Solo – Survey Gratis & Garansi 14 Hari" />
      <style>{`@keyframes omBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(6px); } }
@keyframes reviewMarquee { from { transform: translateX(0); } to { transform: translateX(calc(-50% - 7px)); } }`}</style>
      <div className="c3-page [background-color:#FAF7F1] [color:#201D18] [font-family:Poppins,Helvetica,sans-serif] [font-size:17px] [line-height:1.62] [overflow-x:clip]">
      
        <div className="sticky [top:0] [z-index:60] [background-color:rgba(250,248,244,0.95)] [backdrop-filter:blur(10px)] [border-bottom:1px_solid_#E1D9C9]">
          <div className="[background-color:#23201B] [color:#FCFAF6]">
            <p className="[max-width:1000px] [margin:0_auto] [padding:7px_10px] flex flex-nowrap whitespace-nowrap [justify-content:center] [align-items:center] [gap:6px] [font-size:clamp(10.5px,2.9vw,13px)] [font-weight:500] [line-height:1.3] [text-align:center]"><span><strong className="[font-weight:700] [color:#E8BE6A]">Survey GRATIS</strong> ke lokasi</span><span aria-hidden="true" className="[opacity:0.45]">•</span><span><strong className="[font-weight:700] [color:#E8BE6A]">Garansi 14 hari</strong> pemasangan</span></p>
          </div>
          <div className="[max-width:1000px] [margin:0_auto] [padding:10px_20px] flex [align-items:center] [justify-content:space-between] [gap:12px]">
            <img src="/assets-lp2/logo.webp" alt="Gorden Wallpaper Solo" className="[height:52px] [width:auto] block" />
            <a href="https://wa.me/6285860525758?text=Halo%20saya%20mau%20pesan%20Gorden%20Custom%2C%2Cbisa%20survey%20ke%20lokasi%3F" target="_blank" rel="noopener" className="flex [align-items:center] [justify-content:center] [min-height:46px] [padding:11px_18px] [background-color:#25D366] [color:#fff] [font-size:15px] [font-weight:600] no-underline [border-radius:10px] whitespace-nowrap [gap:9px] [box-shadow:0px_8px_20px_rgba(37,211,102,0.3)] hover:[background-color:#1FBA57]"><img src="/assets-lp2/whatsapp.svg" alt="" className="[flex:none] [width:20px] [height:20px] block [filter:brightness(0)_invert(1)]" />Konsultasi Gratis →</a>
          </div>
        </div>
      
        <div className="[max-width:1000px] [margin:0_auto] [padding:12px_clamp(14px,4vw,20px)_60px]">
      
          <section className="[padding:0] [height:calc(100svh_-_108px)] [min-height:460px] flex flex-col">
            <div className="relative [flex:1_1_auto] [min-height:0] [width:100vw] [margin-left:calc(50%_-_50vw)] [margin-right:calc(50%_-_50vw)] flex flex-col [justify-content:center] [gap:14px] [padding:clamp(52px,12vw,88px)_clamp(20px,calc((100vw_-_960px)_/_2_+_20px),200px)_clamp(76px,15vw,96px)] [overflow:hidden] [background-image:linear-gradient(to_top,rgba(20,17,13,0.92)_0%,rgba(20,17,13,0.78)_34%,rgba(20,17,13,0.34)_62%,rgba(20,17,13,0.1)_100%),url(/assets-lp2/hero-tirai-vertikal.webp)] [background-size:auto_150%] [background-position:60%_88%] min-[761px]:[background-image:linear-gradient(to_right,rgba(20,17,13,0.9)_0%,rgba(20,17,13,0.72)_32%,rgba(20,17,13,0.22)_58%,rgba(20,17,13,0.04)_100%),linear-gradient(to_top,rgba(20,17,13,0.5)_0%,rgba(20,17,13,0.05)_40%),url(/assets-lp2/hero-tirai-top-v2.webp)] min-[761px]:[background-size:cover] min-[761px]:[background-position:center_center] [border-radius:0px]">
              <div className="relative [width:100%] [max-width:560px] [margin-right:auto] flex flex-col">
                <div className="[align-self:flex-start] inline-flex flex-nowrap whitespace-nowrap [align-items:center] [gap:8px] [padding:5px_11px_5px_12px] [margin:0_0_clamp(14px,2vw,20px)] [background-color:rgba(253,252,250,0.14)] [border:1px_solid_rgba(253,252,250,0.35)] [backdrop-filter:blur(6px)] [border-radius:999px]">
                  <span className="[color:#FFB800] [font-size:12px] [letter-spacing:1px]">★★★★★</span>
                  <span className="[font-size:10.5px] [font-weight:700] [letter-spacing:0.08em] uppercase [color:#FCFAF6] whitespace-nowrap">1.000+ Pembeli</span>
                  <span className="flex">
                    <img src="/assets-lp2/ava-1.webp" alt="" className="[width:19px] [height:19px] [border-radius:999px] [border:1.5px_solid_rgba(253,252,250,0.8)] [object-fit:cover] block" />
                    <img src="/assets-lp2/ava-2.webp" alt="" className="[width:19px] [height:19px] [margin-left:-7px] [border-radius:999px] [border:1.5px_solid_rgba(253,252,250,0.8)] [object-fit:cover] block" />
                    <img src="/assets-lp2/ava-3.webp" alt="" className="[width:19px] [height:19px] [margin-left:-7px] [border-radius:999px] [border:1.5px_solid_rgba(253,252,250,0.8)] [object-fit:cover] block" />
                  </span>
                </div>
                <h1 className="[margin:0_0_clamp(12px,1.8vw,18px)] [font-family:Poppins,Helvetica,sans-serif] [font-size:clamp(24px,3vw,36px)] [line-height:1.16] [font-weight:700] [letter-spacing:-0.025em] [color:#FCFAF6] [text-shadow:0_2px_24px_rgba(0,0,0,0.55)] text-pretty">Takut Salah Ukur atau <span className="[background-image:linear-gradient(to_top,rgba(224,169,59,0.85)_0.28em,transparent_0.28em)]">Salah Pilih Model Gorden &amp; Tirai?</span></h1>
                <p className="[margin:0_0_clamp(20px,2.6vw,30px)] [max-width:46ch] [font-size:clamp(13.5px,1.3vw,16px)] [line-height:1.6] [color:rgba(253,252,250,0.92)] [text-shadow:0_1px_16px_rgba(0,0,0,0.6)] text-pretty"><b className="[color:rgb(252,250,246)]">Konsultasi langsung dengan owner.</b> Kami ukur ke rumah Anda, jahit sesuai ukuran, dan pasang sampai rapi.</p>
                <div className="flex flex-wrap [gap:10px]">
                  <a href="https://wa.me/6285860525758?text=Halo%20saya%20mau%20pesan%20Gorden%20Custom%2C%2Cbisa%20survey%20ke%20lokasi%3F" target="_blank" rel="noopener" className="[flex:0_1_auto] whitespace-nowrap [text-align:center] [line-height:1.25] flex [align-items:center] [justify-content:center] [gap:9px] [min-height:clamp(42px,10.5vw,50px)] [padding:9px_16px] [background-color:#25D366] [color:#fff] [font-size:clamp(13px,3.4vw,15.5px)] [font-weight:700] [letter-spacing:-0.01em] no-underline [border-radius:12px] [box-shadow:0px_8px_20px_rgba(37,211,102,0.3)] hover:[background-color:#1FBA57]"><img src="/assets-lp2/whatsapp.svg" alt="" className="[flex:none] [width:18px] [height:18px] block [filter:brightness(0)_invert(1)]" />Kirim Foto Jendela, Dapat Saran Model</a>
                  <a href="#katalog" className="[flex:0_1_auto] whitespace-nowrap flex [align-items:center] [justify-content:center] [min-height:clamp(40px,10vw,50px)] [padding:8px_18px] [background-color:rgba(252,250,246,0.1)] [border:1.5px_solid_#FCFAF6] [color:#FCFAF6] [font-size:clamp(13.5px,3.5vw,16px)] [font-weight:700] no-underline [border-radius:12px] [backdrop-filter:blur(4px)] hover:[background-color:rgba(252,250,246,0.22)]">Lihat Model ↓</a>
                </div>
                
                <div className="flex flex-wrap [justify-content:flex-start] [align-items:center] [gap:4px_7px] [margin:clamp(14px,2vw,20px)_0_0] [font-size:clamp(11px,2.9vw,12.5px)] [font-weight:500] [text-align:left] [color:rgba(253,252,250,0.95)] [text-shadow:0_1px_14px_rgba(0,0,0,0.6)]">
                  <span className="flex [align-items:center] [gap:6px] whitespace-nowrap">Rating <span className="[color:#FFB800] [letter-spacing:1px]">★</span><strong className="[color:#FCFAF6]">5,0</strong> di Google</span>
                  <span className="[color:rgba(253,252,250,0.45)]">•</span>
                  <span className="whitespace-nowrap">Sejak 2012</span>
                </div>
                
              </div>
              <span aria-hidden="true" className="absolute [left:50%] [transform:translateX(-50%)] [bottom:clamp(16px,2.8vw,22px)] flex [align-items:center] [justify-content:center] [width:clamp(40px,9vw,54px)] [height:clamp(40px,9vw,54px)] [background-color:rgba(253,252,250,0.16)] [border:1.5px_solid_rgba(253,252,250,0.7)] [backdrop-filter:blur(6px)] [border-radius:999px] [color:#FCFAF6] [animation:omBob_1.6s_ease-in-out_infinite]">
                <span className="block [font-size:clamp(21px,5vw,30px)] [line-height:1] [font-weight:700] [margin-top:-3px]">↓</span>
              </span>
            </div>
          </section>
      
          <section className="[padding:clamp(40px,7vw,64px)_0_0]">
            <p className="[margin:0_0_10px] [font-size:11px] [font-weight:600] [letter-spacing:0.22em] uppercase [color:#96876C]">Masalah yang sering terjadi</p>
            <h2 className="[margin:0_0_clamp(18px,3.4vw,24px)] [max-width:24ch] [font-family:Poppins,Helvetica,sans-serif] [font-size:clamp(22px,5.6vw,34px)] [line-height:1.16] [font-weight:700] [letter-spacing:-0.03em] [color:#221F1A] text-pretty">Bagus di foto katalog, zonk saat dipasang di rumah.</h2>
            <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))] [gap:10px] [align-items:stretch]">
                <div className="flex flex-col [padding:clamp(18px,4vw,24px)] [background-color:#FCFAF6] [border:1px_solid_#E5DDCF] [border-radius:12px]">
                  <p className="[margin:0_0_14px] [font-size:clamp(15.5px,4vw,18px)] [font-weight:600] [letter-spacing:-0.02em] [color:#877E6D]">Langsung beli</p>
                  <ul className="[margin:0_0_14px] [padding:0] list-none"><li className="flex [gap:10px] [align-items:baseline] [margin:0_0_9px]"><span className="[flex:none] [font-family:IBM_Plex_Mono,ui-monospace,monospace] [font-size:11.5px] [color:#A79B85]">01</span><span className="[font-size:clamp(14px,3.7vw,15.5px)] [line-height:1.45] [color:#585045]">Pilih model dari foto.</span></li><li className="flex [gap:10px] [align-items:baseline] [margin:0_0_9px]"><span className="[flex:none] [font-family:IBM_Plex_Mono,ui-monospace,monospace] [font-size:11.5px] [color:#A79B85]">02</span><span className="[font-size:clamp(14px,3.7vw,15.5px)] [line-height:1.45] [color:#585045]">Tebak sendiri ukurannya.</span></li><li className="flex [gap:10px] [align-items:baseline] [margin:0_0_0]"><span className="[flex:none] [font-family:IBM_Plex_Mono,ui-monospace,monospace] [font-size:11.5px] [color:#A79B85]">03</span><span className="[font-size:clamp(14px,3.7vw,15.5px)] [line-height:1.45] [color:#585045]">Terpasang, tapi kurang pas.</span></li></ul>
                  <p className="[margin:auto_0_0] [padding:12px_0_0] [border-top:1px_solid_#EDE6DA] [font-size:clamp(14px,3.7vw,15.5px)] [font-weight:600] [color:#6F6757]">Murah sekali, nyesal tiap hari.</p>
                </div>
                <div className="flex flex-col [padding:clamp(18px,4vw,24px)] [background-color:#23201B] [border:1px_solid_#23201B] [border-radius:12px]">
                  <p className="[margin:0_0_14px] [font-size:clamp(15.5px,4vw,18px)] [font-weight:600] [letter-spacing:-0.02em] [color:#FCFAF6]">Konsultasi dulu dengan owner</p>
                  <ul className="[margin:0_0_14px] [padding:0] list-none"><li className="flex [gap:10px] [align-items:baseline] [margin:0_0_9px]"><span className="[flex:none] [font-family:IBM_Plex_Mono,ui-monospace,monospace] [font-size:11.5px] [color:rgba(252,250,246,0.55)]">01</span><span className="[font-size:clamp(14px,3.7vw,15.5px)] [line-height:1.45] [color:rgba(252,250,246,0.92)]">Cerita kebutuhan ke owner.</span></li><li className="flex [gap:10px] [align-items:baseline] [margin:0_0_9px]"><span className="[flex:none] [font-family:IBM_Plex_Mono,ui-monospace,monospace] [font-size:11.5px] [color:rgba(252,250,246,0.55)]">02</span><span className="[font-size:clamp(14px,3.7vw,15.5px)] [line-height:1.45] [color:rgba(252,250,246,0.92)]">Kami survey &amp; ukur gratis.</span></li><li className="flex [gap:10px] [align-items:baseline] [margin:0_0_0]"><span className="[flex:none] [font-family:IBM_Plex_Mono,ui-monospace,monospace] [font-size:11.5px] [color:rgba(252,250,246,0.55)]">03</span><span className="[font-size:clamp(14px,3.7vw,15.5px)] [line-height:1.45] [color:rgba(252,250,246,0.92)]">Terpasang, dan memang pas.</span></li></ul>
                  <p className="[margin:auto_0_0] [padding:12px_0_0] [border-top:1px_solid_rgba(252,250,246,0.18)] [font-size:clamp(14px,3.7vw,15.5px)] [font-weight:600] [color:#FCFAF6]">Dipilih untuk rumah Anda.</p>
                </div>
            </div>
          </section>
      
          <section id="katalog" className="[padding:clamp(46px,8vw,78px)_0] [border-top:1px_solid_#EDE6DA] [scroll-margin-top:76px]">
            <p className="[margin:0_0_10px] [font-size:11px] [font-weight:600] [letter-spacing:0.22em] uppercase [color:#96876C]">Katalog model</p>
            <h2 className="[margin:0_0_8px] [font-family:Poppins,Helvetica,sans-serif] [font-size:clamp(22px,5.6vw,34px)] [line-height:1.16] [font-weight:700] [letter-spacing:-0.03em]">Model yang bisa Anda pilih untuk ruangan itu</h2>
            <p className="[margin:0_0_clamp(18px,3.4vw,24px)] [font-size:clamp(14px,3.8vw,17px)] [line-height:1.5] [color:#585045] [max-width:52ch] text-pretty">Semua dibuat sesuai ukuran jendela Anda. Belum tahu yang cocok? Kami bantu pilihkan saat survey.</p>
            <div className="grid [grid-template-columns:repeat(auto-fill,minmax(min(48%,240px),1fr))] [gap:18px_8px] [align-items:stretch]">
                  <div className="flex flex-col">
                    <figure className="[margin:0] relative [aspect-ratio:3_/_4] [overflow:hidden] [border-radius:4px] [background-color:#EDE7DA] [background-image:url(/assets-lp2/img-gorden-sala3-1152x1536-m.webp)] [background-size:cover] [background-position:center]">
                      <div className="absolute [inset:0] [background-image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                      <span className="absolute [top:10px] [left:10px] [padding:5px_10px] [background-color:rgba(252,250,246,0.94)] [color:#221F1A] [font-size:11px] [font-weight:600] [border-radius:999px] whitespace-nowrap [line-height:1.2]">🔥 Best Seller</span>
                      <figcaption className="absolute [left:0] [right:0] [bottom:0] [padding:14px_12px_12px] [color:#FCFAF6]">
                        <span className="block [font-size:clamp(14.5px,3.8vw,17px)] [font-weight:500] [letter-spacing:-0.01em] [line-height:1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Gorden Minimalis</span>
                        <span className="block [margin-top:2px] [font-size:11.5px] [color:rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="[color:#FFB800]">★</span> 4,9 · 312 pembeli</span>
                      </figcaption>
                    </figure>
                    <p className="[flex:1_1_auto] [margin:8px_2px_0] [font-size:clamp(12px,3.2vw,13.5px)] [line-height:1.4] [color:#585045] text-pretty">Cocok untuk ruang tamu dan keluarga, simpel dan rapi.</p>
                    <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20tertarik%20Gorden%20Minimalis.%20Boleh%20minta%20info%20harga%20dan%20spesifikasinya%3F" target="_blank" rel="noopener" className="flex [align-items:center] [justify-content:center] [gap:6px] [margin:10px_0_0] [min-height:48px] [padding:7px_8px] [background-color:#FCFAF6] [border:1.5px_solid_#DCD3C1] [color:#221F1A] [font-size:clamp(11.5px,3.1vw,13px)] [font-weight:600] no-underline [border-radius:8px] [line-height:1.25] [text-align:center] hover:[background-color:#F2EDE3] hover:[border-color:#6E6553]"><img src="/assets-lp2/whatsapp.svg" alt="" className="[flex:none] [width:15px] [height:15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]" />Tanya Gorden Minimalis via WA</a>
                  </div>
                  <div className="flex flex-col">
                    <figure className="[margin:0] relative [aspect-ratio:3_/_4] [overflow:hidden] [border-radius:4px] [background-color:#EDE7DA] [background-image:url(/assets-lp2/p03-blackout-alexandria-m.webp)] [background-size:cover] [background-position:center]">
                      <div className="absolute [inset:0] [background-image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                      <span className="absolute [top:10px] [left:10px] [padding:5px_10px] [background-color:rgba(252,250,246,0.94)] [color:#221F1A] [font-size:11px] [font-weight:600] [border-radius:999px] whitespace-nowrap [line-height:1.2]">🌙 Paling Dicari</span>
                      <figcaption className="absolute [left:0] [right:0] [bottom:0] [padding:14px_12px_12px] [color:#FCFAF6]">
                        <span className="block [font-size:clamp(14.5px,3.8vw,17px)] [font-weight:500] [letter-spacing:-0.01em] [line-height:1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Gorden Blackout</span>
                        <span className="block [margin-top:2px] [font-size:11.5px] [color:rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="[color:#FFB800]">★</span> 4,9 · 205 pembeli</span>
                      </figcaption>
                    </figure>
                    <p className="[flex:1_1_auto] [margin:8px_2px_0] [font-size:clamp(12px,3.2vw,13.5px)] [line-height:1.4] [color:#585045] text-pretty">Cocok untuk kamar tidur, gelap total dan adem.</p>
                    <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20tertarik%20Gorden%20Blackout.%20Boleh%20minta%20info%20harga%20dan%20spesifikasinya%3F" target="_blank" rel="noopener" className="flex [align-items:center] [justify-content:center] [gap:6px] [margin:10px_0_0] [min-height:48px] [padding:7px_8px] [background-color:#FCFAF6] [border:1.5px_solid_#DCD3C1] [color:#221F1A] [font-size:clamp(11.5px,3.1vw,13px)] [font-weight:600] no-underline [border-radius:8px] [line-height:1.25] [text-align:center] hover:[background-color:#F2EDE3] hover:[border-color:#6E6553]"><img src="/assets-lp2/whatsapp.svg" alt="" className="[flex:none] [width:15px] [height:15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]" />Tanya Gorden Blackout via WA</a>
                  </div>
                  <div className="flex flex-col">
                    <figure className="[margin:0] relative [aspect-ratio:3_/_4] [overflow:hidden] [border-radius:4px] [background-color:#EDE7DA] [background-image:url(/assets-lp2/kat-vitrase-m.webp)] [background-size:cover] [background-position:center]">
                      <div className="absolute [inset:0] [background-image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                      <figcaption className="absolute [left:0] [right:0] [bottom:0] [padding:14px_12px_12px] [color:#FCFAF6]">
                        <span className="block [font-size:clamp(14.5px,3.8vw,17px)] [font-weight:500] [letter-spacing:-0.01em] [line-height:1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Gorden Siang &amp; Vitrase</span>
                        <span className="block [margin-top:2px] [font-size:11.5px] [color:rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="[color:#FFB800]">★</span> 4,8 · 197 pembeli</span>
                      </figcaption>
                    </figure>
                    <p className="[flex:1_1_auto] [margin:8px_2px_0] [font-size:clamp(12px,3.2vw,13.5px)] [line-height:1.4] [color:#585045] text-pretty">Cocok untuk kamar dan ruang tamu, terang tapi tetap privat.</p>
                    <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20tertarik%20Gorden%20Siang%20%26%20Vitrase.%20Boleh%20minta%20info%20harga%20dan%20spesifikasinya%3F" target="_blank" rel="noopener" className="flex [align-items:center] [justify-content:center] [gap:6px] [margin:10px_0_0] [min-height:48px] [padding:7px_8px] [background-color:#FCFAF6] [border:1.5px_solid_#DCD3C1] [color:#221F1A] [font-size:clamp(11.5px,3.1vw,13px)] [font-weight:600] no-underline [border-radius:8px] [line-height:1.25] [text-align:center] hover:[background-color:#F2EDE3] hover:[border-color:#6E6553]"><img src="/assets-lp2/whatsapp.svg" alt="" className="[flex:none] [width:15px] [height:15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]" />Tanya Gorden Siang &amp; Vitrase via WA</a>
                  </div>
                  <div className="flex flex-col">
                    <figure className="[margin:0] relative [aspect-ratio:3_/_4] [overflow:hidden] [border-radius:4px] [background-color:#EDE7DA] [background-image:url(/assets-lp2/katalog-roller-blinds-m.webp)] [background-size:cover] [background-position:center]">
                      <div className="absolute [inset:0] [background-image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                      <span className="absolute [top:10px] [left:10px] [padding:5px_10px] [background-color:rgba(252,250,246,0.94)] [color:#221F1A] [font-size:11px] [font-weight:600] [border-radius:999px] whitespace-nowrap [line-height:1.2]">🏢 Favorit Kantor</span>
                      <figcaption className="absolute [left:0] [right:0] [bottom:0] [padding:14px_12px_12px] [color:#FCFAF6]">
                        <span className="block [font-size:clamp(14.5px,3.8vw,17px)] [font-weight:500] [letter-spacing:-0.01em] [line-height:1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Roller Blinds</span>
                        <span className="block [margin-top:2px] [font-size:11.5px] [color:rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="[color:#FFB800]">★</span> 4,8 · 241 pembeli</span>
                      </figcaption>
                    </figure>
                    <p className="[flex:1_1_auto] [margin:8px_2px_0] [font-size:clamp(12px,3.2vw,13.5px)] [line-height:1.4] [color:#585045] text-pretty">Cocok untuk kantor dan ruang kerja, praktis dan rapi.</p>
                    <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20tertarik%20Roller%20Blinds.%20Boleh%20minta%20info%20harga%20dan%20spesifikasinya%3F" target="_blank" rel="noopener" className="flex [align-items:center] [justify-content:center] [gap:6px] [margin:10px_0_0] [min-height:48px] [padding:7px_8px] [background-color:#FCFAF6] [border:1.5px_solid_#DCD3C1] [color:#221F1A] [font-size:clamp(11.5px,3.1vw,13px)] [font-weight:600] no-underline [border-radius:8px] [line-height:1.25] [text-align:center] hover:[background-color:#F2EDE3] hover:[border-color:#6E6553]"><img src="/assets-lp2/whatsapp.svg" alt="" className="[flex:none] [width:15px] [height:15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]" />Tanya Roller Blinds via WA</a>
                  </div>
                  <div className="flex flex-col">
                    <figure className="[margin:0] relative [aspect-ratio:3_/_4] [overflow:hidden] [border-radius:4px] [background-color:#EDE7DA] [background-image:url(/assets-lp2/img-zebra-blinds-m.webp)] [background-size:cover] [background-position:center]">
                      <div className="absolute [inset:0] [background-image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                      <span className="absolute [top:10px] [left:10px] [padding:5px_10px] [background-color:rgba(252,250,246,0.94)] [color:#221F1A] [font-size:11px] [font-weight:600] [border-radius:999px] whitespace-nowrap [line-height:1.2]">⭐ Terlaris</span>
                      <figcaption className="absolute [left:0] [right:0] [bottom:0] [padding:14px_12px_12px] [color:#FCFAF6]">
                        <span className="block [font-size:clamp(14.5px,3.8vw,17px)] [font-weight:500] [letter-spacing:-0.01em] [line-height:1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Zebra Blinds</span>
                        <span className="block [margin-top:2px] [font-size:11.5px] [color:rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="[color:#FFB800]">★</span> 4,8 · 268 pembeli</span>
                      </figcaption>
                    </figure>
                    <p className="[flex:1_1_auto] [margin:8px_2px_0] [font-size:clamp(12px,3.2vw,13.5px)] [line-height:1.4] [color:#585045] text-pretty">Cocok untuk ruang keluarga, cahaya bisa diatur.</p>
                    <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20tertarik%20Zebra%20Blinds.%20Boleh%20minta%20info%20harga%20dan%20spesifikasinya%3F" target="_blank" rel="noopener" className="flex [align-items:center] [justify-content:center] [gap:6px] [margin:10px_0_0] [min-height:48px] [padding:7px_8px] [background-color:#FCFAF6] [border:1.5px_solid_#DCD3C1] [color:#221F1A] [font-size:clamp(11.5px,3.1vw,13px)] [font-weight:600] no-underline [border-radius:8px] [line-height:1.25] [text-align:center] hover:[background-color:#F2EDE3] hover:[border-color:#6E6553]"><img src="/assets-lp2/whatsapp.svg" alt="" className="[flex:none] [width:15px] [height:15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]" />Tanya Zebra Blinds via WA</a>
                  </div>
                  <div className="flex flex-col">
                    <figure className="[margin:0] relative [aspect-ratio:3_/_4] [overflow:hidden] [border-radius:4px] [background-color:#EDE7DA] [background-image:url(/assets-lp2/img-wallpaper-custom-motif-peta-dunia-m.webp)] [background-size:cover] [background-position:center]">
                      <div className="absolute [inset:0] [background-image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                      <figcaption className="absolute [left:0] [right:0] [bottom:0] [padding:14px_12px_12px] [color:#FCFAF6]">
                        <span className="block [font-size:clamp(14.5px,3.8vw,17px)] [font-weight:500] [letter-spacing:-0.01em] [line-height:1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Wallpaper Custom</span>
                        <span className="block [margin-top:2px] [font-size:11.5px] [color:rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="[color:#FFB800]">★</span> 4,8 · 143 pembeli</span>
                      </figcaption>
                    </figure>
                    <p className="[flex:1_1_auto] [margin:8px_2px_0] [font-size:clamp(12px,3.2vw,13.5px)] [line-height:1.4] [color:#585045] text-pretty">Cocok untuk dinding kamar dan ruang tamu, ruangan langsung beda.</p>
                    <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20tertarik%20Wallpaper%20Custom.%20Boleh%20minta%20info%20harga%20dan%20spesifikasinya%3F" target="_blank" rel="noopener" className="flex [align-items:center] [justify-content:center] [gap:6px] [margin:10px_0_0] [min-height:48px] [padding:7px_8px] [background-color:#FCFAF6] [border:1.5px_solid_#DCD3C1] [color:#221F1A] [font-size:clamp(11.5px,3.1vw,13px)] [font-weight:600] no-underline [border-radius:8px] [line-height:1.25] [text-align:center] hover:[background-color:#F2EDE3] hover:[border-color:#6E6553]"><img src="/assets-lp2/whatsapp.svg" alt="" className="[flex:none] [width:15px] [height:15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]" />Tanya Wallpaper Custom via WA</a>
                  </div>
            </div>
            {katMore ? (<>
            <div className="[margin:18px_0_0]">
              <div className="grid [grid-template-columns:repeat(auto-fill,minmax(min(48%,240px),1fr))] [gap:18px_8px] [align-items:stretch]">
                  <div className="flex flex-col">
                    <figure className="[margin:0] relative [aspect-ratio:3_/_4] [overflow:hidden] [border-radius:4px] [background-color:#EDE7DA] [background-image:url(/assets-lp2/img-gorden-custom-m.webp)] [background-size:cover] [background-position:center]">
                      <div className="absolute [inset:0] [background-image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                      <figcaption className="absolute [left:0] [right:0] [bottom:0] [padding:14px_12px_12px] [color:#FCFAF6]">
                        <span className="block [font-size:clamp(14.5px,3.8vw,17px)] [font-weight:500] [letter-spacing:-0.01em] [line-height:1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Gorden Custom</span>
                        <span className="block [margin-top:2px] [font-size:11.5px] [color:rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="[color:#FFB800]">★</span> 5,0 · 186 pembeli</span>
                      </figcaption>
                    </figure>
                    <p className="[flex:1_1_auto] [margin:8px_2px_0] [font-size:clamp(12px,3.2vw,13.5px)] [line-height:1.4] [color:#585045] text-pretty">Cocok untuk jendela tidak standar, model bebas.</p>
                    <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20tertarik%20Gorden%20Custom.%20Boleh%20minta%20info%20harga%20dan%20spesifikasinya%3F" target="_blank" rel="noopener" className="flex [align-items:center] [justify-content:center] [gap:6px] [margin:10px_0_0] [min-height:48px] [padding:7px_8px] [background-color:#FCFAF6] [border:1.5px_solid_#DCD3C1] [color:#221F1A] [font-size:clamp(11.5px,3.1vw,13px)] [font-weight:600] no-underline [border-radius:8px] [line-height:1.25] [text-align:center] hover:[background-color:#F2EDE3] hover:[border-color:#6E6553]"><img src="/assets-lp2/whatsapp.svg" alt="" className="[flex:none] [width:15px] [height:15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]" />Tanya Gorden Custom via WA</a>
                  </div>
                  <div className="flex flex-col">
                    <figure className="[margin:0] relative [aspect-ratio:3_/_4] [overflow:hidden] [border-radius:4px] [background-color:#EDE7DA] [background-image:url(/assets-lp2/img-gorden-kupu-1-m.webp)] [background-size:cover] [background-position:center]">
                      <div className="absolute [inset:0] [background-image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                      <figcaption className="absolute [left:0] [right:0] [bottom:0] [padding:14px_12px_12px] [color:#FCFAF6]">
                        <span className="block [font-size:clamp(14.5px,3.8vw,17px)] [font-weight:500] [letter-spacing:-0.01em] [line-height:1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Gorden Kupu-Kupu</span>
                        <span className="block [margin-top:2px] [font-size:11.5px] [color:rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="[color:#FFB800]">★</span> 4,6 · 94 pembeli</span>
                      </figcaption>
                    </figure>
                    <p className="[flex:1_1_auto] [margin:8px_2px_0] [font-size:clamp(12px,3.2vw,13.5px)] [line-height:1.4] [color:#585045] text-pretty">Cocok untuk jendela kecil, manis dan simpel.</p>
                    <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20tertarik%20Gorden%20Kupu-Kupu.%20Boleh%20minta%20info%20harga%20dan%20spesifikasinya%3F" target="_blank" rel="noopener" className="flex [align-items:center] [justify-content:center] [gap:6px] [margin:10px_0_0] [min-height:48px] [padding:7px_8px] [background-color:#FCFAF6] [border:1.5px_solid_#DCD3C1] [color:#221F1A] [font-size:clamp(11.5px,3.1vw,13px)] [font-weight:600] no-underline [border-radius:8px] [line-height:1.25] [text-align:center] hover:[background-color:#F2EDE3] hover:[border-color:#6E6553]"><img src="/assets-lp2/whatsapp.svg" alt="" className="[flex:none] [width:15px] [height:15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]" />Tanya Gorden Kupu-Kupu via WA</a>
                  </div>
                  <div className="flex flex-col">
                    <figure className="[margin:0] relative [aspect-ratio:3_/_4] [overflow:hidden] [border-radius:4px] [background-color:#EDE7DA] [background-image:url(/assets-lp2/img-gorden-hotel-apartemen-m.webp)] [background-size:cover] [background-position:center]">
                      <div className="absolute [inset:0] [background-image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                      <figcaption className="absolute [left:0] [right:0] [bottom:0] [padding:14px_12px_12px] [color:#FCFAF6]">
                        <span className="block [font-size:clamp(14.5px,3.8vw,17px)] [font-weight:500] [letter-spacing:-0.01em] [line-height:1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Gorden Hotel &amp; Apartemen</span>
                        <span className="block [margin-top:2px] [font-size:11.5px] [color:rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="[color:#FFB800]">★</span> 4,9 · 63 pembeli</span>
                      </figcaption>
                    </figure>
                    <p className="[flex:1_1_auto] [margin:8px_2px_0] [font-size:clamp(12px,3.2vw,13.5px)] [line-height:1.4] [color:#585045] text-pretty">Cocok untuk hotel, villa, dan unit sewa.</p>
                    <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20tertarik%20Gorden%20Hotel%20%26%20Apartemen.%20Boleh%20minta%20info%20harga%20dan%20spesifikasinya%3F" target="_blank" rel="noopener" className="flex [align-items:center] [justify-content:center] [gap:6px] [margin:10px_0_0] [min-height:48px] [padding:7px_8px] [background-color:#FCFAF6] [border:1.5px_solid_#DCD3C1] [color:#221F1A] [font-size:clamp(11.5px,3.1vw,13px)] [font-weight:600] no-underline [border-radius:8px] [line-height:1.25] [text-align:center] hover:[background-color:#F2EDE3] hover:[border-color:#6E6553]"><img src="/assets-lp2/whatsapp.svg" alt="" className="[flex:none] [width:15px] [height:15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]" />Tanya Gorden Hotel &amp; Apartemen via WA</a>
                  </div>
                  <div className="flex flex-col">
                    <figure className="[margin:0] relative [aspect-ratio:3_/_4] [overflow:hidden] [border-radius:4px] [background-color:#EDE7DA] [background-image:url(/assets-lp2/img-gorden-rumah-sakit-rso-orthopedi-surakar-m.webp)] [background-size:cover] [background-position:center]">
                      <div className="absolute [inset:0] [background-image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                      <figcaption className="absolute [left:0] [right:0] [bottom:0] [padding:14px_12px_12px] [color:#FCFAF6]">
                        <span className="block [font-size:clamp(14.5px,3.8vw,17px)] [font-weight:500] [letter-spacing:-0.01em] [line-height:1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Tirai Area Publik</span>
                        <span className="block [margin-top:2px] [font-size:11.5px] [color:rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="[color:#FFB800]">★</span> 4,9 · 54 pembeli</span>
                      </figcaption>
                    </figure>
                    <p className="[flex:1_1_auto] [margin:8px_2px_0] [font-size:clamp(12px,3.2vw,13.5px)] [line-height:1.4] [color:#585045] text-pretty">Cocok untuk rumah sakit, sekolah, dan kantor.</p>
                    <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20tertarik%20Tirai%20Area%20Publik.%20Boleh%20minta%20info%20harga%20dan%20spesifikasinya%3F" target="_blank" rel="noopener" className="flex [align-items:center] [justify-content:center] [gap:6px] [margin:10px_0_0] [min-height:48px] [padding:7px_8px] [background-color:#FCFAF6] [border:1.5px_solid_#DCD3C1] [color:#221F1A] [font-size:clamp(11.5px,3.1vw,13px)] [font-weight:600] no-underline [border-radius:8px] [line-height:1.25] [text-align:center] hover:[background-color:#F2EDE3] hover:[border-color:#6E6553]"><img src="/assets-lp2/whatsapp.svg" alt="" className="[flex:none] [width:15px] [height:15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]" />Tanya Tirai Area Publik via WA</a>
                  </div>
                  <div className="flex flex-col">
                    <figure className="[margin:0] relative [aspect-ratio:3_/_4] [overflow:hidden] [border-radius:4px] [background-color:#EDE7DA] [background-image:url(/assets-lp2/katalog-vertical-blinds-m.webp)] [background-size:cover] [background-position:center]">
                      <div className="absolute [inset:0] [background-image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                      <figcaption className="absolute [left:0] [right:0] [bottom:0] [padding:14px_12px_12px] [color:#FCFAF6]">
                        <span className="block [font-size:clamp(14.5px,3.8vw,17px)] [font-weight:500] [letter-spacing:-0.01em] [line-height:1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Vertikal Blinds</span>
                        <span className="block [margin-top:2px] [font-size:11.5px] [color:rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="[color:#FFB800]">★</span> 4,7 · 152 pembeli</span>
                      </figcaption>
                    </figure>
                    <p className="[flex:1_1_auto] [margin:8px_2px_0] [font-size:clamp(12px,3.2vw,13.5px)] [line-height:1.4] [color:#585045] text-pretty">Cocok untuk kantor, kesan formal dan bersih.</p>
                    <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20tertarik%20Vertikal%20Blinds.%20Boleh%20minta%20info%20harga%20dan%20spesifikasinya%3F" target="_blank" rel="noopener" className="flex [align-items:center] [justify-content:center] [gap:6px] [margin:10px_0_0] [min-height:48px] [padding:7px_8px] [background-color:#FCFAF6] [border:1.5px_solid_#DCD3C1] [color:#221F1A] [font-size:clamp(11.5px,3.1vw,13px)] [font-weight:600] no-underline [border-radius:8px] [line-height:1.25] [text-align:center] hover:[background-color:#F2EDE3] hover:[border-color:#6E6553]"><img src="/assets-lp2/whatsapp.svg" alt="" className="[flex:none] [width:15px] [height:15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]" />Tanya Vertikal Blinds via WA</a>
                  </div>
                  <div className="flex flex-col">
                    <figure className="[margin:0] relative [aspect-ratio:3_/_4] [overflow:hidden] [border-radius:4px] [background-color:#EDE7DA] [background-image:url(/assets-lp2/katalog-wooden-blinds-m.webp)] [background-size:cover] [background-position:center]">
                      <div className="absolute [inset:0] [background-image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                      <figcaption className="absolute [left:0] [right:0] [bottom:0] [padding:14px_12px_12px] [color:#FCFAF6]">
                        <span className="block [font-size:clamp(14.5px,3.8vw,17px)] [font-weight:500] [letter-spacing:-0.01em] [line-height:1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Wooden Blinds Fabrikasi</span>
                        <span className="block [margin-top:2px] [font-size:11.5px] [color:rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="[color:#FFB800]">★</span> 4,8 · 96 pembeli</span>
                      </figcaption>
                    </figure>
                    <p className="[flex:1_1_auto] [margin:8px_2px_0] [font-size:clamp(12px,3.2vw,13.5px)] [line-height:1.4] [color:#585045] text-pretty">Cocok untuk ruang kerja, hangat dan modern.</p>
                    <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20tertarik%20Wooden%20Blinds%20Fabrikasi.%20Boleh%20minta%20info%20harga%20dan%20spesifikasinya%3F" target="_blank" rel="noopener" className="flex [align-items:center] [justify-content:center] [gap:6px] [margin:10px_0_0] [min-height:48px] [padding:7px_8px] [background-color:#FCFAF6] [border:1.5px_solid_#DCD3C1] [color:#221F1A] [font-size:clamp(11.5px,3.1vw,13px)] [font-weight:600] no-underline [border-radius:8px] [line-height:1.25] [text-align:center] hover:[background-color:#F2EDE3] hover:[border-color:#6E6553]"><img src="/assets-lp2/whatsapp.svg" alt="" className="[flex:none] [width:15px] [height:15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]" />Tanya Wooden Blinds Fabrikasi via WA</a>
                  </div>
                  <div className="flex flex-col">
                    <figure className="[margin:0] relative [aspect-ratio:3_/_4] [overflow:hidden] [border-radius:4px] [background-color:#EDE7DA] [background-image:url(/assets-lp2/img-slimline-blinds-gorden-kantor-scaled-e16-m.webp)] [background-size:cover] [background-position:center]">
                      <div className="absolute [inset:0] [background-image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                      <figcaption className="absolute [left:0] [right:0] [bottom:0] [padding:14px_12px_12px] [color:#FCFAF6]">
                        <span className="block [font-size:clamp(14.5px,3.8vw,17px)] [font-weight:500] [letter-spacing:-0.01em] [line-height:1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Slimline Blinds</span>
                        <span className="block [margin-top:2px] [font-size:11.5px] [color:rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="[color:#FFB800]">★</span> 4,7 · 81 pembeli</span>
                      </figcaption>
                    </figure>
                    <p className="[flex:1_1_auto] [margin:8px_2px_0] [font-size:clamp(12px,3.2vw,13.5px)] [line-height:1.4] [color:#585045] text-pretty">Cocok untuk dapur dan kantor, cahaya mudah diatur.</p>
                    <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20tertarik%20Slimline%20Blinds.%20Boleh%20minta%20info%20harga%20dan%20spesifikasinya%3F" target="_blank" rel="noopener" className="flex [align-items:center] [justify-content:center] [gap:6px] [margin:10px_0_0] [min-height:48px] [padding:7px_8px] [background-color:#FCFAF6] [border:1.5px_solid_#DCD3C1] [color:#221F1A] [font-size:clamp(11.5px,3.1vw,13px)] [font-weight:600] no-underline [border-radius:8px] [line-height:1.25] [text-align:center] hover:[background-color:#F2EDE3] hover:[border-color:#6E6553]"><img src="/assets-lp2/whatsapp.svg" alt="" className="[flex:none] [width:15px] [height:15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]" />Tanya Slimline Blinds via WA</a>
                  </div>
                  <div className="flex flex-col">
                    <figure className="[margin:0] relative [aspect-ratio:3_/_4] [overflow:hidden] [border-radius:4px] [background-color:#EDE7DA] [background-image:url(/assets-lp2/kat-outdoor-m.webp)] [background-size:cover] [background-position:center]">
                      <div className="absolute [inset:0] [background-image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                      <figcaption className="absolute [left:0] [right:0] [bottom:0] [padding:14px_12px_12px] [color:#FCFAF6]">
                        <span className="block [font-size:clamp(14.5px,3.8vw,17px)] [font-weight:500] [letter-spacing:-0.01em] [line-height:1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Outdoor Blinds</span>
                        <span className="block [margin-top:2px] [font-size:11.5px] [color:rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="[color:#FFB800]">★</span> 4,8 · 72 pembeli</span>
                      </figcaption>
                    </figure>
                    <p className="[flex:1_1_auto] [margin:8px_2px_0] [font-size:clamp(12px,3.2vw,13.5px)] [line-height:1.4] [color:#585045] text-pretty">Cocok untuk teras dan balkon, kurangi panas dan silau.</p>
                    <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20tertarik%20Outdoor%20Blinds.%20Boleh%20minta%20info%20harga%20dan%20spesifikasinya%3F" target="_blank" rel="noopener" className="flex [align-items:center] [justify-content:center] [gap:6px] [margin:10px_0_0] [min-height:48px] [padding:7px_8px] [background-color:#FCFAF6] [border:1.5px_solid_#DCD3C1] [color:#221F1A] [font-size:clamp(11.5px,3.1vw,13px)] [font-weight:600] no-underline [border-radius:8px] [line-height:1.25] [text-align:center] hover:[background-color:#F2EDE3] hover:[border-color:#6E6553]"><img src="/assets-lp2/whatsapp.svg" alt="" className="[flex:none] [width:15px] [height:15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]" />Tanya Outdoor Blinds via WA</a>
                  </div>
                  <div className="flex flex-col">
                    <figure className="[margin:0] relative [aspect-ratio:3_/_4] [overflow:hidden] [border-radius:4px] [background-color:#EDE7DA] [background-image:url(/assets-lp2/img-kasa-nyamuk-magnetik-1536x1012-m.webp)] [background-size:cover] [background-position:center]">
                      <div className="absolute [inset:0] [background-image:linear-gradient(180deg,rgba(28,25,21,0)_52%,rgba(28,25,21,0.66)_100%)]"></div>
                      <figcaption className="absolute [left:0] [right:0] [bottom:0] [padding:14px_12px_12px] [color:#FCFAF6]">
                        <span className="block [font-size:clamp(14.5px,3.8vw,17px)] [font-weight:500] [letter-spacing:-0.01em] [line-height:1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Perlengkapan Lainnya</span>
                        <span className="block [margin-top:2px] [font-size:11.5px] [color:rgba(252,250,246,0.85)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span className="[color:#FFB800]">★</span> 4,7 · 112 pembeli</span>
                      </figcaption>
                    </figure>
                    <p className="[flex:1_1_auto] [margin:8px_2px_0] [font-size:clamp(12px,3.2vw,13.5px)] [line-height:1.4] [color:#585045] text-pretty">Kasa nyamuk, rel, dan pelengkap gorden lainnya.</p>
                    <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20tertarik%20Perlengkapan%20Lainnya.%20Boleh%20minta%20info%20harga%20dan%20spesifikasinya%3F" target="_blank" rel="noopener" className="flex [align-items:center] [justify-content:center] [gap:6px] [margin:10px_0_0] [min-height:48px] [padding:7px_8px] [background-color:#FCFAF6] [border:1.5px_solid_#DCD3C1] [color:#221F1A] [font-size:clamp(11.5px,3.1vw,13px)] [font-weight:600] no-underline [border-radius:8px] [line-height:1.25] [text-align:center] hover:[background-color:#F2EDE3] hover:[border-color:#6E6553]"><img src="/assets-lp2/whatsapp.svg" alt="" className="[flex:none] [width:15px] [height:15px] block [filter:brightness(0)_saturate(100%)_invert(62%)_sepia(72%)_saturate(1000%)_hue-rotate(85deg)_brightness(95%)_contrast(92%)]" />Tanya Perlengkapan Lainnya via WA</a>
                  </div>
              </div>
            </div>
            </>) : null}
            <div className="flex [justify-content:center] [margin:20px_0_0]">
              <button type="button" onClick={toggleKatMore} className="inline-flex [align-items:center] [justify-content:center] [gap:8px] [min-height:46px] [padding:11px_22px] [background-color:#FCFAF6] [border:2px_solid_#221F1A] [border-radius:12px] [font-family:Poppins,Helvetica,sans-serif] [font-size:15px] [font-weight:700] [color:#221F1A] cursor-pointer hover:[background-color:#F2EDE3]">{katMoreLabel}</button>
            </div>
            <p className="[margin:26px_0_0] [font-size:16px] [color:#6A6252] [text-align:center] [font-weight:700]">Belum yakin? Kirim foto jendela, kami pilihkan modelnya.</p>
            <div className="[margin:12px_0_0]">
              <div className="flex flex-col [align-items:stretch] [gap:10px]">
                <a href="https://wa.me/6285860525758?text=Halo%20saya%20mau%20pesan%20Gorden%20Custom%2C%2Cbisa%20survey%20ke%20lokasi%3F" target="_blank" rel="noopener" className="[flex:1_1_100%] flex [align-items:center] [justify-content:center] [gap:9px] [min-height:56px] [padding:14px_20px] [background-color:#25D366] [color:#fff] [font-size:clamp(15px,3.9vw,17px)] [font-weight:700] [letter-spacing:-0.01em] no-underline [border-radius:12px] [box-shadow:0px_8px_20px_rgba(37,211,102,0.3)] hover:[background-color:#1FBA57]"><img src="/assets-lp2/whatsapp.svg" alt="" className="[flex:none] [width:20px] [height:20px] block [filter:brightness(0)_invert(1)]" />Konsultasi Gratis →</a>
              </div>
              <div className="flex flex-wrap [justify-content:center] [align-items:center] [gap:5px_10px] [margin:12px_0_0] [font-size:clamp(11.5px,3vw,12.5px)] [font-weight:500] [text-align:center] [color:#3C3529]">
                <span className="[color:#FFB800] [letter-spacing:1px]">★★★★★</span><strong className="[color:#221F1A]">5,0</strong><span>Google Review</span><span className="[opacity:0.5]">•</span><span>1.000+ pembeli</span><span className="[opacity:0.5]">•</span><span>Garansi pemasangan 14 hari</span>
              </div>
            </div>
          </section>
      
          <section className="[width:100vw] [margin-left:calc(50%_-_50vw)] [padding:clamp(40px,7vw,72px)_0] [background-color:#FAF7F1]">
            <div className="[max-width:1000px] [margin:0_auto] [padding:0_clamp(16px,4vw,20px)]">
              <div className="[text-align:left] [margin:0_0_clamp(18px,3.4vw,26px)]">
                <p className="[margin:0_0_10px] [font-size:11px] [font-weight:600] [letter-spacing:0.22em] uppercase [color:#96876C]">Hasil pemasangan nyata</p>
                <h2 className="[margin:0_0_8px] [max-width:24ch] [font-family:Poppins,Helvetica,sans-serif] [font-size:clamp(23px,5.6vw,34px)] [line-height:1.16] [font-weight:700] [letter-spacing:-0.03em] [color:#221F1A] text-pretty">Bukan cuma bagus di katalog</h2>
                <p className="[margin:0] [max-width:48ch] [font-size:clamp(14px,3.8vw,16.5px)] [line-height:1.55] [color:#585045] text-pretty">Lihat hasilnya setelah dipasang di rumah pelanggan.</p>
                
              </div>
              <p className="inline-flex [align-items:center] [gap:8px] [margin:0_0_clamp(14px,3vw,20px)] [padding:8px_14px] [background-color:#F2EDE3] [border:1px_solid_#E5DDCF] [border-radius:999px] [font-size:clamp(13px,3.4vw,14.5px)] [font-weight:600] [color:#221F1A]"><span aria-hidden="true">📍</span>1.000+ project di Solo Raya.</p>
      
              <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(46%,200px),1fr))] [gap:8px]">
                <figure data-zoom="/assets-lp2/p05-box-full-plafon-wonosari-m.webp" className="[margin:0] relative [aspect-ratio:3_/_4] [overflow:hidden] [border-radius:6px] [background-color:#EDE7DA] [background-image:url(/assets-lp2/p05-box-full-plafon-wonosari-m.webp)] [background-size:cover] [background-position:center] cursor-zoom-in">
                  <div className="absolute [inset:0] [background-image:linear-gradient(180deg,rgba(28,25,21,0)_46%,rgba(28,25,21,0.78)_100%)]"></div>
                  <figcaption className="absolute [left:0] [right:0] [bottom:0] [padding:12px_11px_11px] [color:#FCFAF6]">
                    <span className="block [font-size:clamp(12.5px,3.3vw,14.5px)] [font-weight:600] [letter-spacing:-0.01em] [line-height:1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Ruangan Terlihat Lebih Tinggi</span>
                    <span className="flex [align-items:center] [gap:4px] [margin-top:3px] [font-size:11.5px] [line-height:1.3] [color:rgba(252,250,246,0.88)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span aria-hidden="true">📍</span>Wonosari, Klaten</span>
                  </figcaption>
                </figure>
                <figure data-zoom="/assets-lp2/p17-kaca-besar-tawangsari-m.webp" className="[margin:0] relative [aspect-ratio:3_/_4] [overflow:hidden] [border-radius:6px] [background-color:#EDE7DA] [background-image:url(/assets-lp2/p17-kaca-besar-tawangsari-m.webp)] [background-size:cover] [background-position:center] cursor-zoom-in">
                  <div className="absolute [inset:0] [background-image:linear-gradient(180deg,rgba(28,25,21,0)_46%,rgba(28,25,21,0.78)_100%)]"></div>
                  <figcaption className="absolute [left:0] [right:0] [bottom:0] [padding:12px_11px_11px] [color:#FCFAF6]">
                    <span className="block [font-size:clamp(12.5px,3.3vw,14.5px)] [font-weight:600] [letter-spacing:-0.01em] [line-height:1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Lebih Rapi Tanpa Rel Terlihat</span>
                    <span className="flex [align-items:center] [gap:4px] [margin-top:3px] [font-size:11.5px] [line-height:1.3] [color:rgba(252,250,246,0.88)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span aria-hidden="true">📍</span>Tawangsari, Sukoharjo</span>
                  </figcaption>
                </figure>
                <figure data-zoom="/assets-lp2/p01-hidden-rail-klodran-m.webp" className="[margin:0] relative [aspect-ratio:3_/_4] [overflow:hidden] [border-radius:6px] [background-color:#EDE7DA] [background-image:url(/assets-lp2/p01-hidden-rail-klodran-m.webp)] [background-size:cover] [background-position:center] cursor-zoom-in">
                  <div className="absolute [inset:0] [background-image:linear-gradient(180deg,rgba(28,25,21,0)_46%,rgba(28,25,21,0.78)_100%)]"></div>
                  <figcaption className="absolute [left:0] [right:0] [bottom:0] [padding:12px_11px_11px] [color:#FCFAF6]">
                    <span className="block [font-size:clamp(12.5px,3.3vw,14.5px)] [font-weight:600] [letter-spacing:-0.01em] [line-height:1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Tidur Lebih Nyaman dan Gelap</span>
                    <span className="flex [align-items:center] [gap:4px] [margin-top:3px] [font-size:11.5px] [line-height:1.3] [color:rgba(252,250,246,0.88)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span aria-hidden="true">📍</span>Klodran, Colomadu</span>
                  </figcaption>
                </figure>
                <figure data-zoom="/assets-lp2/p06-box-glossy-solokota-m.webp" className="[margin:0] relative [aspect-ratio:3_/_4] [overflow:hidden] [border-radius:6px] [background-color:#EDE7DA] [background-image:url(/assets-lp2/p06-box-glossy-solokota-m.webp)] [background-size:cover] [background-position:center] cursor-zoom-in">
                  <div className="absolute [inset:0] [background-image:linear-gradient(180deg,rgba(28,25,21,0)_46%,rgba(28,25,21,0.78)_100%)]"></div>
                  <figcaption className="absolute [left:0] [right:0] [bottom:0] [padding:12px_11px_11px] [color:#FCFAF6]">
                    <span className="block [font-size:clamp(12.5px,3.3vw,14.5px)] [font-weight:600] [letter-spacing:-0.01em] [line-height:1.25] [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">Tampak Mewah dan Berkelas</span>
                    <span className="flex [align-items:center] [gap:4px] [margin-top:3px] [font-size:11.5px] [line-height:1.3] [color:rgba(252,250,246,0.88)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"><span aria-hidden="true">📍</span>Solo Kota</span>
                  </figcaption>
                </figure>
              </div>
      
              <div className="[margin:clamp(36px,6vw,56px)_0_0] [padding:clamp(28px,5vw,40px)_0_0] [border-top:1px_solid_#EDE6DA]">
            <div className="[text-align:left] [margin:0_0_clamp(16px,3vw,22px)]">
              <p className="[margin:0_0_10px] [font-size:11px] [font-weight:600] [letter-spacing:0.22em] uppercase [color:#96876C]">Lihat perubahannya</p>
              <h3 className="[margin:0] [font-family:Poppins,Helvetica,sans-serif] [font-size:clamp(20px,4.8vw,27px)] [line-height:1.16] [font-weight:600] [letter-spacing:-0.03em] [color:#221F1A] text-pretty">Dari ruangan biasa menjadi lebih rapi dan nyaman</h3>
            </div>
            <div className="[margin:0] [padding:18px_16px] [background-color:#F2EDE3] [border:1px_solid_#E5DDCF] [border-radius:20px]">
              <div className="grid [grid-template-columns:1fr_1fr] [gap:clamp(10px,2.4vw,14px)]">
                <figure data-zoom="/assets-lp2/before-sawit-2-m.webp" className="[margin:0]">
                  <div className="relative [aspect-ratio:3_/_4] [border-radius:16px] [border:1px_solid_#DCD3C1] [background-image:url(/assets-lp2/before-sawit-2-m.webp)] [background-size:cover] [background-position:center] [overflow:hidden] cursor-zoom-in">
                    <span className="absolute [top:12px] [left:12px] [padding:6px_14px] [background-color:#FCFAF6] [color:#5d5546] [font-size:12px] [font-weight:700] [letter-spacing:0.1em] uppercase [border-radius:999px] [box-shadow:0_4px_12px_-4px_rgba(0,0,0,0.35)]">Sebelum</span>
                  </div>
                </figure>
                <figure data-zoom="/assets-lp2/after-sawit-m.webp" className="[margin:0]">
                  <div className="relative [aspect-ratio:3_/_4] [border-radius:16px] [border:1px_solid_#DCD3C1] [background-image:url(/assets-lp2/after-sawit-m.webp)] [background-size:cover] [background-position:62%_center] [overflow:hidden] cursor-zoom-in">
                    <span className="absolute [top:12px] [left:12px] [padding:6px_14px] [background-color:#6E6553] [color:#fff] [font-size:12px] [font-weight:700] [letter-spacing:0.1em] uppercase [border-radius:999px] [box-shadow:0_4px_12px_-4px_rgba(0,0,0,0.35)]">Sesudah</span>
                  </div>
                </figure>
              </div>
              <p className="[margin:14px_0_0] [text-align:center] [font-size:clamp(13px,3.5vw,14.5px)] [line-height:1.5] [color:#585045] text-pretty">Lebih rapi, lebih tinggi, dan sesuai konsep ruangan. Direkomendasikan langsung oleh owner berdasarkan kondisi ruangannya.</p>
            </div>
      
              </div>
              <div className="[margin:clamp(36px,6vw,56px)_0_0] [padding:clamp(28px,5vw,40px)_0_0] [border-top:1px_solid_#EDE6DA]">
            <p className="[margin:0_0_10px] [font-size:11px] [font-weight:600] [letter-spacing:0.22em] uppercase [color:#96876C]">Kata pelanggan</p>
            <h3 className="[margin:0_0_8px] [font-family:Poppins,Helvetica,sans-serif] [font-size:clamp(20px,4.8vw,27px)] [line-height:1.16] [font-weight:600] [letter-spacing:-0.03em] text-pretty">Kenapa pelanggan puas setelah gorden terpasang?</h3>
            <div className="inline-flex [align-items:center] [gap:14px] [margin:0_0_22px] [padding:12px_18px] [background-color:#FCFAF6] [border:1px_solid_#E5DDCF] [border-radius:20px]">
              <img src="/assets-lp2/google-g.svg" alt="Google" className="[flex:none] [width:26px] [height:26px] block" />
              <span className="flex flex-col [gap:2px]">
                <span className="flex [align-items:center] [gap:7px]"><span className="[color:#FFB800] [font-size:14px] [letter-spacing:1px]">★★★★★</span><strong className="[font-size:15px] [color:#221F1A]">5,0</strong></span>
                <span className="[font-size:13px] [color:oklch(0.5_0.03_70)]">100+ ulasan di Google Review</span>
              </span>
            </div>
            <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr))] [gap:16px] [align-items:stretch]">
              <article className="flex flex-col [background-color:#FCFAF6] [border:1px_solid_#E8E1D4] [border-radius:20px] [overflow:hidden]">
                <div className="[aspect-ratio:3_/_4] [background-image:url(/assets-lp2/testi-1.webp)] [background-size:cover] [background-position:center]"></div>
                <div className="[flex:1] flex flex-col [padding:18px_20px_20px]">
                  <span className="inline-flex [align-self:flex-start] [align-items:center] [gap:6px] [margin:0_0_12px] [padding:5px_11px] [background-color:#F2EDE3] [border:1px_solid_#E5DDCF] [border-radius:999px] [font-size:11.5px] [font-weight:700] [letter-spacing:0.04em] uppercase [color:#6E6553]">Harga sebanding kualitasnya</span>
                  <div className="flex [align-items:center] [gap:12px] [margin:0_0_12px]">
                    <img src="/assets-lp2/ava-1.webp" alt="Notikawati Puput" className="[flex:none] [width:40px] [height:40px] [border-radius:999px] [object-fit:cover] block" />
                    <span className="flex flex-col [gap:2px] [min-width:0]">
                      <span className="[font-size:15px] [font-weight:700] [color:#221F1A]">Notikawati Puput</span>
                      <span className="flex [align-items:center] [gap:6px]">
                        <span className="[color:#FFB800] [font-size:12px] [letter-spacing:1px]">★★★★★</span>
                        <span className="[font-size:12px] [color:#7B7263]">7 bulan lalu</span>
                      </span>
                    </span>
                    <img src="/assets-lp2/google-g.svg" alt="Google" className="[flex:none] [margin-left:auto] [width:18px] [height:18px] block" />
                  </div>
                  <p className="[margin:0] [font-size:14.5px] [line-height:1.6] [color:#4A4339]">Desainnya elegan, dan <b className="[font-weight:700] [color:#221F1A]">kualitas bahan serta jahitannya rapi dan premium</b>. Ruangan jadi terlihat lebih cantik dan berkelas.</p>
                </div>
              </article>
              <article className="flex flex-col [background-color:#FCFAF6] [border:1px_solid_#E8E1D4] [border-radius:20px] [overflow:hidden]">
                <div className="[aspect-ratio:3_/_4] [background-image:url(/assets-lp2/testi-2.webp)] [background-size:cover] [background-position:center]"></div>
                <div className="[flex:1] flex flex-col [padding:18px_20px_20px]">
                  <span className="inline-flex [align-self:flex-start] [align-items:center] [gap:6px] [margin:0_0_12px] [padding:5px_11px] [background-color:#F2EDE3] [border:1px_solid_#E5DDCF] [border-radius:999px] [font-size:11.5px] [font-weight:700] [letter-spacing:0.04em] uppercase [color:#6E6553]">Selesai lebih cepat dari janji</span>
                  <div className="flex [align-items:center] [gap:12px] [margin:0_0_12px]">
                    <img src="/assets-lp2/ava-2.webp" alt="Ing Sun" className="[flex:none] [width:40px] [height:40px] [border-radius:999px] [object-fit:cover] block" />
                    <span className="flex flex-col [gap:2px] [min-width:0]">
                      <span className="[font-size:15px] [font-weight:700] [color:#221F1A]">Ing Sun</span>
                      <span className="flex [align-items:center] [gap:6px]">
                        <span className="[color:#FFB800] [font-size:12px] [letter-spacing:1px]">★★★★★</span>
                        <span className="[font-size:12px] [color:#7B7263]">3 bulan lalu</span>
                      </span>
                    </span>
                    <img src="/assets-lp2/google-g.svg" alt="Google" className="[flex:none] [margin-left:auto] [width:18px] [height:18px] block" />
                  </div>
                  <p className="[margin:0] [font-size:14.5px] [line-height:1.6] [color:#4A4339]">Produk bagus, bisa custom, dan <b className="[font-weight:700] [color:#221F1A]">orderan selesai serta dipasang lebih cepat dari yang dijanjikan</b>. Sangat recommended.</p>
                </div>
              </article>
              <article className="flex flex-col [background-color:#FCFAF6] [border:1px_solid_#E8E1D4] [border-radius:20px] [overflow:hidden]">
                <div className="[aspect-ratio:3_/_4] [background-image:url(/assets-lp2/testi-3.webp)] [background-size:cover] [background-position:center]"></div>
                <div className="[flex:1] flex flex-col [padding:18px_20px_20px]">
                  <span className="inline-flex [align-self:flex-start] [align-items:center] [gap:6px] [margin:0_0_12px] [padding:5px_11px] [background-color:#F2EDE3] [border:1px_solid_#E5DDCF] [border-radius:999px] [font-size:11.5px] [font-weight:700] [letter-spacing:0.04em] uppercase [color:#6E6553]">Warnanya cocok di ruangan</span>
                  <div className="flex [align-items:center] [gap:12px] [margin:0_0_12px]">
                    <img src="/assets-lp2/ava-3.webp" alt="Chusnul Khotimah" className="[flex:none] [width:40px] [height:40px] [border-radius:999px] [object-fit:cover] block" />
                    <span className="flex flex-col [gap:2px] [min-width:0]">
                      <span className="[font-size:15px] [font-weight:700] [color:#221F1A]">Chusnul Khotimah</span>
                      <span className="flex [align-items:center] [gap:6px]">
                        <span className="[color:#FFB800] [font-size:12px] [letter-spacing:1px]">★★★★★</span>
                        <span className="[font-size:12px] [color:#7B7263]">1 minggu lalu</span>
                      </span>
                    </span>
                    <img src="/assets-lp2/google-g.svg" alt="Google" className="[flex:none] [margin-left:auto] [width:18px] [height:18px] block" />
                  </div>
                  <p className="[margin:0] [font-size:14.5px] [line-height:1.6] [color:#4A4339]">Pesan jauh-jauh dari Semarang, dan <b className="[font-weight:700] [color:#221F1A]">hasilnya rapi banget, warnanya cocok dengan ruangan</b>. Rumah jadi terasa baru.</p>
                </div>
              </article>
            </div>
            
      
            <div className="[margin:26px_0_0] [padding:18px_0_0] [border-top:1px_solid_#ECE5D9]">
              <p className="[margin:0_0_12px] [text-align:center] [font-size:12.5px] [color:#7B7263]">Cuplikan ulasan lain langsung dari Google</p>
              <div className="flex [align-items:center] [justify-content:center] [gap:clamp(6px,2vw,14px)]">
                <button onClick={reviewPrevClick} aria-label="Ulasan sebelumnya" className="[flex:none] flex [align-items:center] [justify-content:center] [height:30px] [width:30px] [border-radius:999px] [border:1px_solid_#E5DDCF] [background-color:#fff] [box-shadow:0_6px_16px_rgba(58,53,44,0.16)] [color:#3a352c] [font-size:15px] cursor-pointer hover:[background-color:#F2EDE3]">‹</button>
                <div className="[flex:1_1_auto] [min-width:0] [overflow:hidden] [padding:8px_0_22px]">
                  <div className="flex items-center [transform:translateX(calc(12%_-_var(--pos)_*_76%))] min-[761px]:[transform:translateX(calc(27%_-_var(--pos)_*_46%))]" style={{ '--pos': reviewPos, transition: reviewNoAnim ? 'none' : 'transform 0.7s cubic-bezier(0.22, 0.61, 0.36, 1)' } as CSSProperties}>
                      {reviewSlides.map((src, i) => (
                        <div key={i} onClick={() => onSlideClick(i)} className="[flex:0_0_76%] min-[761px]:[flex:0_0_46%] flex justify-center [padding:0_6px] cursor-pointer" style={{ transition: reviewNoAnim ? 'none' : 'opacity 0.7s ease, transform 0.7s ease', opacity: i === reviewPos ? 1 : 0.45, transform: `scale(${i === reviewPos ? 1 : 0.9})` }}>
                          <img src={src} alt="Ulasan pelanggan di Google" className="block [height:min(46vh,300px)] min-[761px]:[height:240px] [width:auto] [max-width:100%] [object-fit:contain] [border-radius:16px] [border:1px_solid_#ECE5D9] [background-color:#fff] [box-shadow:0_20px_38px_-22px_rgba(58,53,44,0.95)]" />
                        </div>
                      ))}
                    </div>
                </div>
                <button onClick={reviewNextClick} aria-label="Ulasan selanjutnya" className="[flex:none] flex [align-items:center] [justify-content:center] [height:30px] [width:30px] [border-radius:999px] [border:1px_solid_#E5DDCF] [background-color:#fff] [box-shadow:0_6px_16px_rgba(58,53,44,0.16)] [color:#3a352c] [font-size:15px] cursor-pointer hover:[background-color:#F2EDE3]">›</button>
              </div>
              <div className="flex [justify-content:center] [gap:6px] [margin:10px_0_0]">
                {reviewShots.map((_, i) => (
                  <span key={i} className={`[width:5px] [height:5px] [border-radius:999px] ${i === reviewIdx ? '[background-color:#6E6553]' : '[background-color:#CFC5B0]'}`} />
                ))}
              </div>
              </div>
      
              </div>
              <div className="flex [justify-content:center] [margin:clamp(18px,3.2vw,26px)_0_0]">
                <a href="https://wa.me/6285860525758?text=Halo%20saya%20mau%20pesan%20Gorden%20Custom%2C%2Cbisa%20survey%20ke%20lokasi%3F" target="_blank" rel="noopener" className="[flex:0_1_380px] flex [align-items:center] [justify-content:center] [gap:9px] [min-height:56px] [padding:14px_20px] [background-color:#25D366] [color:#fff] [font-size:clamp(15px,3.9vw,17px)] [font-weight:700] [letter-spacing:-0.01em] no-underline [border-radius:12px] [box-shadow:0px_8px_20px_rgba(37,211,102,0.3)] hover:[background-color:#1FBA57]"><img src="/assets-lp2/whatsapp.svg" alt="" className="[flex:none] [width:20px] [height:20px] block [filter:brightness(0)_invert(1)]" />Konsultasi Gratis →</a>
              </div>
            </div>
          </section>
      
          <section className="[padding:clamp(46px,8vw,78px)_0] [border-top:1px_solid_#EDE6DA]">
            <div id="proses" className="[scroll-margin-top:76px]">
              <p className="[margin:0_0_10px] [font-size:11px] [font-weight:600] [letter-spacing:0.22em] uppercase [color:#96876C]">Cara kerja</p>
              <h3 className="[margin:0_0_16px] [font-family:Poppins,Helvetica,sans-serif] [font-size:clamp(20px,4.8vw,27px)] [line-height:1.16] [font-weight:600] [letter-spacing:-0.03em] [color:#221F1A] text-pretty">Dari ukur sampai terpasang, kami yang urus semuanya.</h3>
              <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(46%,200px),1fr))] [gap:10px]">
                <div className="relative flex flex-col [gap:10px] [padding:16px_14px] [background-color:#FCFAF6] [border:1px_solid_#E5DDCF] [border-radius:12px]">
                  <div className="flex [align-items:center] [justify-content:space-between]">
                    <span className="flex [align-items:center] [justify-content:center] [width:40px] [height:40px] [border-radius:10px] [background-color:#F2EDE3] [color:#6E6553]"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h16v11H8l-4 4z" /></svg></span>
                    <span className="[font-family:IBM_Plex_Mono,ui-monospace,monospace] [font-size:12px] [color:#A79B85]">01</span>
                  </div>
                  <p className="[margin:0] [font-size:clamp(14px,3.7vw,15.5px)] [font-weight:600] [line-height:1.3] [color:#221F1A]">Chat WA</p>
                  <p className="[margin:0] [font-size:clamp(12.5px,3.3vw,13.5px)] [line-height:1.45] [color:#6F6757]">Kirim foto jendela & ceritakan kebutuhan.</p>
                </div>
                <div className="relative flex flex-col [gap:10px] [padding:16px_14px] [background-color:#FCFAF6] [border:1px_solid_#E5DDCF] [border-radius:12px]">
                  <div className="flex [align-items:center] [justify-content:space-between]">
                    <span className="flex [align-items:center] [justify-content:center] [width:40px] [height:40px] [border-radius:10px] [background-color:#F2EDE3] [color:#6E6553]"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 15 15 3l6 6L9 21z" /><path d="m7 11 2 2M10 8l2 2M13 5l2 2" /></svg></span>
                    <span className="[font-family:IBM_Plex_Mono,ui-monospace,monospace] [font-size:12px] [color:#A79B85]">02</span>
                  </div>
                  <p className="[margin:0] [font-size:clamp(14px,3.7vw,15.5px)] [font-weight:600] [line-height:1.3] [color:#221F1A]">Survey &amp; ukur gratis</p>
                  <p className="[margin:0] [font-size:clamp(12.5px,3.3vw,13.5px)] [line-height:1.45] [color:#6F6757]">Tim datang ke rumah, ukur presisi.</p>
                </div>
                <div className="relative flex flex-col [gap:10px] [padding:16px_14px] [background-color:#FCFAF6] [border:1px_solid_#E5DDCF] [border-radius:12px]">
                  <div className="flex [align-items:center] [justify-content:space-between]">
                    <span className="flex [align-items:center] [justify-content:center] [width:40px] [height:40px] [border-radius:10px] [background-color:#F2EDE3] [color:#6E6553]"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20 18 6" /><circle cx="19" cy="5" r="2" /><path d="M4 20c3-1 5-3 6-6" /></svg></span>
                    <span className="[font-family:IBM_Plex_Mono,ui-monospace,monospace] [font-size:12px] [color:#A79B85]">03</span>
                  </div>
                  <p className="[margin:0] [font-size:clamp(14px,3.7vw,15.5px)] [font-weight:600] [line-height:1.3] [color:#221F1A]">Dijahit sesuai ukuran</p>
                  <p className="[margin:0] [font-size:clamp(12.5px,3.3vw,13.5px)] [line-height:1.45] [color:#6F6757]">Dibuat pas dengan jendela Anda.</p>
                </div>
                <div className="relative flex flex-col [gap:10px] [padding:16px_14px] [background-color:#FCFAF6] [border:1px_solid_#E5DDCF] [border-radius:12px]">
                  <div className="flex [align-items:center] [justify-content:space-between]">
                    <span className="flex [align-items:center] [justify-content:center] [width:40px] [height:40px] [border-radius:10px] [background-color:#F2EDE3] [color:#6E6553]"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18" /><path d="M5 21V4h14v17" /><path d="m9 12 2 2 4-4" /></svg></span>
                    <span className="[font-family:IBM_Plex_Mono,ui-monospace,monospace] [font-size:12px] [color:#A79B85]">04</span>
                  </div>
                  <p className="[margin:0] [font-size:clamp(14px,3.7vw,15.5px)] [font-weight:600] [line-height:1.3] [color:#221F1A]">Dipasang &amp; dicek bersama</p>
                  <p className="[margin:0] [font-size:clamp(12.5px,3.3vw,13.5px)] [line-height:1.45] [color:#6F6757]">Rapi, dicek bareng sebelum selesai.</p>
                </div>
              </div>
              <p className="flex [align-items:flex-start] [gap:10px] [margin:16px_0_0] [padding:13px_15px] [background-color:#F2EDE3] [border:1px_solid_#E5DDCF] [border-radius:12px] [font-size:clamp(14px,3.7vw,15.5px)] [line-height:1.45] [color:#3C3529]"><span aria-hidden="true" className="[flex:none] flex [align-items:center] [justify-content:center] [width:22px] [height:22px] [border-radius:999px] [background-color:#6E6553] [color:#FCFAF6] [font-size:12px] [font-weight:700]">✓</span><span><strong className="[color:#221F1A] [font-weight:600]">Kurang pas dalam 14 hari?</strong> Kami perbaiki tanpa biaya.</span></p>
            </div>
            <div className="[margin:26px_0_0]">
              <div className="flex flex-col [align-items:stretch] [gap:10px]">
                <a href="https://wa.me/6285860525758?text=Halo%20saya%20mau%20pesan%20Gorden%20Custom%2C%2Cbisa%20survey%20ke%20lokasi%3F" target="_blank" rel="noopener" className="[flex:1_1_100%] flex [align-items:center] [justify-content:center] [gap:9px] [min-height:56px] [padding:14px_20px] [background-color:#25D366] [color:#fff] [font-size:clamp(15px,3.9vw,17px)] [font-weight:700] [letter-spacing:-0.01em] no-underline [border-radius:12px] [box-shadow:0px_8px_20px_rgba(37,211,102,0.3)] hover:[background-color:#1FBA57]"><img src="/assets-lp2/whatsapp.svg" alt="" className="[flex:none] [width:20px] [height:20px] block [filter:brightness(0)_invert(1)]" />Konsultasi Gratis →</a>
                <p className="[margin:0] [text-align:center] [font-size:clamp(12.5px,3.3vw,13.5px)] [line-height:1.45] [color:#6F6757]">Chat langsung dibalas owner, gratis dan tanpa wajib memesan.</p>
              </div>
              <div className="flex flex-wrap [justify-content:center] [align-items:center] [gap:5px_10px] [margin:12px_0_0] [font-size:clamp(11.5px,3vw,12.5px)] [font-weight:500] [text-align:center] [color:#3C3529]">
                <span className="[color:#FFB800] [letter-spacing:1px]">★★★★★</span><strong className="[color:#221F1A]">5,0</strong><span>Google Review</span><span className="[opacity:0.5]">•</span><span>1.000+ pembeli</span><span className="[opacity:0.5]">•</span><span>Garansi pemasangan 14 hari</span>
              </div>
            </div>
          
          </section>
      
          <section className="[padding:clamp(46px,8vw,78px)_0] [border-top:1px_solid_#EDE6DA]">
            <p className="[margin:0_0_10px] [font-size:11px] [font-weight:600] [letter-spacing:0.22em] uppercase [color:#96876C]">Tanya jawab &amp; area layanan</p>
            <h2 className="[margin:0_0_8px] [font-family:Poppins,Helvetica,sans-serif] [font-size:clamp(22px,5.6vw,34px)] [line-height:1.16] [font-weight:700] [letter-spacing:-0.03em]">Pertanyaan yang paling sering masuk</h2>
            <p className="[margin:0_0_22px] [color:#585045] [max-width:62ch] [font-size:clamp(14.5px,3.9vw,16.5px)] [line-height:1.55]">Klik pertanyaannya untuk melihat jawaban.</p>
            <div className="grid [gap:10px]">
              <details open className="[background-color:#FCFAF6] [border:1px_solid_#E5DDCF] [border-radius:20px] [overflow:hidden]">
                <summary className="flex [align-items:center] [gap:11px] [padding:13px_14px] cursor-pointer list-none [font-size:clamp(14px,3.7vw,16px)] [line-height:1.35] [font-weight:600] [color:#221F1A]">
                  <span className="[flex:none] [width:24px] [height:24px] flex [align-items:center] [justify-content:center] [border-radius:999px] [background-color:#6E6553] [color:#FCFAF6] [font-size:12px] [font-weight:700]">1</span>
                  <span className="[flex:1]">Apakah survey dan konsultasi bayar?</span>
                  <span className="[flex:none] [font-size:19px] [line-height:1] [color:#6E6553]">+</span>
                </summary>
                <div className="[padding:0_16px_16px_49px] [font-size:clamp(13.5px,3.6vw,15.5px)] [line-height:1.55] [color:#4F4840]">Tidak. Konsultasi dan survey ke lokasi <strong>gratis</strong> untuk seluruh Solo Raya.</div>
              </details>
              <details className="[background-color:#FCFAF6] [border:1px_solid_#E5DDCF] [border-radius:20px] [overflow:hidden]">
                <summary className="flex [align-items:center] [gap:11px] [padding:13px_14px] cursor-pointer list-none [font-size:clamp(14px,3.7vw,16px)] [line-height:1.35] [font-weight:600] [color:#221F1A]">
                  <span className="[flex:none] [width:24px] [height:24px] flex [align-items:center] [justify-content:center] [border-radius:999px] [background-color:#6E6553] [color:#FCFAF6] [font-size:12px] [font-weight:700]">2</span>
                  <span className="[flex:1]">Bagaimana cara tahu perkiraan biayanya?</span>
                  <span className="[flex:none] [font-size:19px] [line-height:1] [color:#6E6553]">+</span>
                </summary>
                <div className="[padding:0_16px_16px_49px] [font-size:clamp(13.5px,3.6vw,15.5px)] [line-height:1.55] [color:#4F4840]">Kirim foto dan ukuran kasar jendela lewat WA, owner bantu perkirakan biayanya. <strong>Biaya pasti</strong> diberikan setelah survey gratis.</div>
              </details>
              <details className="[background-color:#FCFAF6] [border:1px_solid_#E5DDCF] [border-radius:20px] [overflow:hidden]">
                <summary className="flex [align-items:center] [gap:11px] [padding:13px_14px] cursor-pointer list-none [font-size:clamp(14px,3.7vw,16px)] [line-height:1.35] [font-weight:600] [color:#221F1A]">
                  <span className="[flex:none] [width:24px] [height:24px] flex [align-items:center] [justify-content:center] [border-radius:999px] [background-color:#6E6553] [color:#FCFAF6] [font-size:12px] [font-weight:700]">3</span>
                  <span className="[flex:1]">Berapa lama pembuatan dan pemasangan?</span>
                  <span className="[flex:none] [font-size:19px] [line-height:1] [color:#6E6553]">+</span>
                </summary>
                <div className="[padding:0_16px_16px_49px] [font-size:clamp(13.5px,3.6vw,15.5px)] [line-height:1.55] [color:#4F4840]">Umumnya <strong>7-10 hari kerja setelah survey</strong>, lalu pemasangan dijadwalkan sesuai waktu Anda.</div>
              </details>
              <details className="[background-color:#FCFAF6] [border:1px_solid_#E5DDCF] [border-radius:20px] [overflow:hidden]">
                <summary className="flex [align-items:center] [gap:11px] [padding:13px_14px] cursor-pointer list-none [font-size:clamp(14px,3.7vw,16px)] [line-height:1.35] [font-weight:600] [color:#221F1A]">
                  <span className="[flex:none] [width:24px] [height:24px] flex [align-items:center] [justify-content:center] [border-radius:999px] [background-color:#6E6553] [color:#FCFAF6] [font-size:12px] [font-weight:700]">4</span>
                  <span className="[flex:1]">Kalau setelah dipasang kurang pas?</span>
                  <span className="[flex:none] [font-size:19px] [line-height:1] [color:#6E6553]">+</span>
                </summary>
                <div className="[padding:0_16px_16px_49px] [font-size:clamp(13.5px,3.6vw,15.5px)] [line-height:1.55] [color:#4F4840]">Masuk <strong>garansi pemasangan 14 hari</strong>. Kabari saja, kami datang memperbaiki tanpa biaya tambahan.</div>
              </details>
            </div>
            
            <div className="[margin:clamp(28px,5vw,40px)_0_0] [padding:clamp(24px,5.5vw,32px)_clamp(16px,4.5vw,24px)] [background-color:#6E6553] [color:#FCFAF6] [border-radius:12px]">
            <p className="[margin:0_0_10px] [font-size:12px] [font-weight:700] [letter-spacing:0.14em] uppercase [color:rgba(253,252,250,0.75)]">Area layanan</p>
            <h3 className="[margin:0_0_8px] [font-family:Poppins,Helvetica,sans-serif] [font-size:clamp(20px,4.8vw,27px)] [line-height:1.16] [font-weight:600] [letter-spacing:-0.03em]">Survey &amp; pasang di seluruh Solo Raya</h3>
            <p className="[margin:0_0_20px] [color:rgba(253,252,250,0.85)] [max-width:62ch]">Workshop kami di Jl. Raya Songgo Langit No.22, Gentan, Baki, Sukoharjo, dan tim datang ke lokasi Anda tanpa biaya survey.</p>
            <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(46%,130px),1fr))] [gap:10px]">
              <span className="[padding:14px_16px] [background-color:rgba(253,252,250,0.12)] [border:1px_solid_rgba(253,252,250,0.28)] [border-radius:12px] [font-size:17px] [font-weight:600] [text-align:center]">Solo</span>
              <span className="[padding:14px_16px] [background-color:rgba(253,252,250,0.12)] [border:1px_solid_rgba(253,252,250,0.28)] [border-radius:12px] [font-size:17px] [font-weight:600] [text-align:center]">Sukoharjo</span>
              <span className="[padding:14px_16px] [background-color:rgba(253,252,250,0.12)] [border:1px_solid_rgba(253,252,250,0.28)] [border-radius:12px] [font-size:17px] [font-weight:600] [text-align:center]">Karanganyar</span>
              <span className="[padding:14px_16px] [background-color:rgba(253,252,250,0.12)] [border:1px_solid_rgba(253,252,250,0.28)] [border-radius:12px] [font-size:17px] [font-weight:600] [text-align:center]">Boyolali</span>
              <span className="[padding:14px_16px] [background-color:rgba(253,252,250,0.12)] [border:1px_solid_rgba(253,252,250,0.28)] [border-radius:12px] [font-size:17px] [font-weight:600] [text-align:center]">Klaten</span>
              <span className="[padding:14px_16px] [background-color:rgba(253,252,250,0.12)] [border:1px_solid_rgba(253,252,250,0.28)] [border-radius:12px] [font-size:17px] [font-weight:600] [text-align:center]">Sragen</span>
            </div>
            <p className="[margin:18px_0_0] [font-size:16px] [color:rgba(253,252,250,0.85)]">Di luar area tersebut? Tanyakan dulu lewat WhatsApp, biasanya masih bisa kami bantu.</p>
      
            <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr))] [gap:12px] [margin:22px_0_0]">
              <div className="[padding:16px_18px] [background-color:rgba(252,250,246,0.08)] [border:1px_solid_rgba(252,250,246,0.2)] [border-radius:12px]">
                <p className="[margin:0_0_6px] [font-size:11px] [font-weight:600] [letter-spacing:0.18em] uppercase [color:rgba(252,250,246,0.7)]">Workshop</p>
                <p className="[margin:0_0_4px] [font-size:16px] [font-weight:600] [line-height:1.4] [color:#FCFAF6]">Jl. Raya Songgo Langit No.22, Ngebrak, Gentan, Kec. Baki, Kabupaten Sukoharjo, Jawa Tengah 57556</p>
                <p className="[margin:0_0_10px] [font-size:13.5px] [line-height:1.5] [color:rgba(252,250,246,0.8)]">Senin-Sabtu 09.00-17.00, Minggu dan hari libur by appointment</p>
                <a href="https://maps.app.goo.gl/FDrjvrU4xpjdRQBk8" target="_blank" rel="noopener" className="inline-flex [align-items:center] [gap:6px] [min-height:36px] [font-size:14px] [font-weight:600] [color:#FCFAF6] [text-decoration:underline] [text-underline-offset:3px]">Buka di Google Maps →</a>
              </div>
              <div className="[padding:16px_18px] [background-color:rgba(252,250,246,0.08)] [border:1px_solid_rgba(252,250,246,0.2)] [border-radius:12px]">
                <p className="[margin:0_0_6px] [font-size:11px] [font-weight:600] [letter-spacing:0.18em] uppercase [color:rgba(252,250,246,0.7)]">Kontak WhatsApp</p>
                <p className="[margin:0_0_4px] [font-size:16px] [font-weight:600] [line-height:1.4] [color:#FCFAF6]">085860525758</p>
                <p className="[margin:0_0_10px] [font-size:13.5px] [line-height:1.5] [color:rgba(252,250,246,0.8)]">Online 24 jam, setiap hari</p>
                <a href="https://wa.me/6285860525758?text=Halo%20saya%20mau%20pesan%20Gorden%20Custom%2C%2Cbisa%20survey%20ke%20lokasi%3F" target="_blank" rel="noopener" className="inline-flex [align-items:center] [gap:6px] [min-height:36px] [font-size:14px] [font-weight:600] [color:#FCFAF6] [text-decoration:underline] [text-underline-offset:3px]">Chat sekarang →</a>
              </div>
            </div>
            </div>
            <div className="[margin:26px_0_0]">
              <div className="flex flex-col [align-items:stretch] [gap:10px]">
                <a href="https://wa.me/6285860525758?text=Halo%20saya%20mau%20pesan%20Gorden%20Custom%2C%2Cbisa%20survey%20ke%20lokasi%3F" target="_blank" rel="noopener" className="[flex:1_1_100%] flex [align-items:center] [justify-content:center] [gap:9px] [min-height:56px] [padding:14px_20px] [background-color:#25D366] [color:#fff] [font-size:clamp(15px,3.9vw,17px)] [font-weight:700] [letter-spacing:-0.01em] no-underline [border-radius:12px] [box-shadow:0px_8px_20px_rgba(37,211,102,0.3)] hover:[background-color:#1FBA57]"><img src="/assets-lp2/whatsapp.svg" alt="" className="[flex:none] [width:20px] [height:20px] block [filter:brightness(0)_invert(1)]" />Jadwalkan Survey Gratis →</a>
                <p className="[margin:0] [text-align:center] [font-size:clamp(12.5px,3.3vw,13.5px)] [line-height:1.45] [color:#6F6757]">Chat langsung dibalas owner, gratis dan tanpa wajib memesan.</p>
              </div>
              <div className="flex flex-wrap [justify-content:center] [align-items:center] [gap:5px_10px] [margin:12px_0_0] [font-size:clamp(11.5px,3vw,12.5px)] [font-weight:500] [text-align:center] [color:#3C3529]">
                <span className="[color:#FFB800] [letter-spacing:1px]">★★★★★</span><strong className="[color:#221F1A]">5,0</strong><span>Google Review</span><span className="[opacity:0.5]">•</span><span>1.000+ pembeli</span><span className="[opacity:0.5]">•</span><span>Garansi pemasangan 14 hari</span>
              </div>
            </div>
          
          </section>
      
      
          <footer className="[padding:34px_0_0] [margin-top:30px] [border-top:1px_solid_#E5DDCF] [font-size:15px] [color:#585045] grid [gap:6px]">
            <p className="[margin:0_0_6px] [font-family:Poppins,Helvetica,sans-serif] [font-size:19px] [font-weight:600] [color:oklch(0.24_0.02_60)]">Gorden Wallpaper Solo</p>
            <p className="[margin:0]">Jl. Raya Songgo Langit No.22, Ngebrak, Gentan, Kec. Baki, Kabupaten Sukoharjo, Jawa Tengah 57556</p>
            <p className="[margin:0]">WhatsApp: <a href="https://wa.me/6285860525758" target="_blank" rel="noopener" className="[font-weight:600]">085860525758</a></p>
            <p className="[margin:0]">Jam operasional online: 24 jam, setiap hari</p>
            <p className="[margin:0]">Workshop: Senin-Sabtu 09.00-17.00, Minggu dan hari libur by appointment</p>
            <p className="[margin:0]"><a href="https://instagram.com/gorden.wallpapersolo" target="_blank" rel="noopener">Instagram @gorden.wallpapersolo</a> · <a href="https://facebook.com/search/top?q=gorden%20wallpaper%20solo" target="_blank" rel="noopener">Facebook Gorden Wallpaper Solo</a></p>
            <p className="[margin:8px_0_0] [font-size:13px] [color:oklch(0.58_0.03_70)]">Melayani gorden custom rumah &amp; kantor di Solo, Sukoharjo, Karanganyar, Boyolali, Klaten, dan Sragen sejak 2012.</p>
          </footer>
          <div className="[height:76px] min-[761px]:hidden"></div>
      
        </div>
      
        {lightbox ? (<>
          <div onClick={closeLightbox} className="fixed [inset:0] [z-index:90] flex [align-items:center] [justify-content:center] [padding:20px] [background-color:rgba(28,25,20,0.88)] [cursor:zoom-out]">
            <div onClick={stopClick} className="flex flex-col [align-items:center] [gap:14px] [max-width:100%] [max-height:100%] cursor-default">
              <img alt="Pratinjau gambar" ref={lightboxImgRef} className="[max-width:100%] [max-height:74vh] [width:auto] [height:auto] [border-radius:12px] [box-shadow:0_30px_60px_-20px_rgba(0,0,0,0.7)]" />
              {lightboxCaption ? (<>
                <p className="[margin:0] [max-width:42ch] [text-align:center] [font-family:Poppins,Helvetica,sans-serif] [font-size:15px] [line-height:1.45] [font-weight:600] [color:#FCFAF6]">{lightboxCaption}</p>
              </>) : null}
              {lbList.length > 1 ? (<>
                <div className="flex [align-items:center] [gap:14px]">
                  <button type="button" onClick={lightboxPrev} aria-label="Foto sebelumnya" className="[width:44px] [height:44px] flex [align-items:center] [justify-content:center] [border-radius:999px] [border:none] [background-color:rgba(253,252,250,0.92)] [color:#3a352c] [font-size:20px] cursor-pointer">‹</button>
                  <span className="[font-size:13px] [font-weight:600] [color:rgba(253,252,250,0.8)]">{lightboxPos}</span>
                  <button type="button" onClick={lightboxNext} aria-label="Foto selanjutnya" className="[width:44px] [height:44px] flex [align-items:center] [justify-content:center] [border-radius:999px] [border:none] [background-color:rgba(253,252,250,0.92)] [color:#3a352c] [font-size:20px] cursor-pointer">›</button>
                </div>
              </>) : null}
            </div>
            <button type="button" onClick={closeLightbox} aria-label="Tutup" className="absolute [top:16px] [right:16px] [width:42px] [height:42px] flex [align-items:center] [justify-content:center] [border-radius:999px] [border:none] [background-color:rgba(253,252,250,0.92)] [color:#3a352c] [font-size:20px] cursor-pointer">✕</button>
          </div>
        </>) : null}
      
        {showNudge && !nudgeClosed ? (<>
          <a href="https://wa.me/6285860525758?text=Halo%20saya%20mau%20pesan%20Gorden%20Custom%2C%2Cbisa%20survey%20ke%20lokasi%3F" target="_blank" rel="noopener" onClick={closeNudge} className="fixed [right:18px] bottom-[86px] min-[761px]:bottom-[88px] [z-index:59] max-w-[min(260px,calc(100vw_-_36px))] [padding:9px_10px] min-[761px]:max-w-[min(320px,calc(100vw_-_36px))] min-[761px]:[padding:15px_16px] flex [align-items:flex-start] [gap:10px] [background-color:#FCFAF6] [border:1px_solid_#E5DDCF] [border-radius:16px] [box-shadow:0_18px_44px_-18px_rgba(32,29,24,0.42)] no-underline cursor-pointer hover:[background-color:#F7F3EA]">
            <img src="/assets-lp2/owner-elang.webp" alt="" className="[flex:none] w-[26px] h-[26px] min-[761px]:w-[42px] min-[761px]:h-[42px] [border-radius:999px] [object-fit:cover] [background-color:#F2EDE3] [border:1px_solid_#E5DDCF]" />
            <div className="[min-width:0]">
              <p className="[margin:0_0_3px] [font-family:Poppins,Helvetica,sans-serif] [font-size:11.5px] min-[761px]:[font-size:14px] [font-weight:700] [line-height:1.3] [color:#221F1A]">Pak Elang - Owner Gorden Wallpaper Solo</p>
              <p className="[margin:0_0_7px] [font-size:11.5px] min-[761px]:[font-size:13.5px] [line-height:1.4] [color:#585045] text-pretty"><span className="min-[761px]:hidden">Bingung pilih model? Tanya saya.</span><span className="hidden min-[761px]:inline">Masih bingung pilih model atau ukuran? Tanya langsung ke saya di WA.</span></p>
              <span className="inline-flex [align-items:center] [gap:6px] [font-size:11.5px] min-[761px]:[font-size:13.5px] [font-weight:700] [color:#1EA855]">Balas sekarang <span aria-hidden="true">→</span></span>
            </div>
            <button type="button" onClick={closeNudgeBtn} aria-label="Tutup" className="absolute [top:-10px] [right:-8px] [width:28px] [height:28px] flex [align-items:center] [justify-content:center] [border-radius:999px] [border:none] [background-color:#221F1A] [color:#FCFAF6] [font-size:13px] [line-height:1] cursor-pointer">✕</button>
          </a>
        </>) : null}
      
      
        <a href="https://wa.me/6285860525758?text=Halo%20saya%20mau%20pesan%20Gorden%20Custom%2C%2Cbisa%20survey%20ke%20lokasi%3F" target="_blank" rel="noopener" aria-label="Konsultasi gratis via WhatsApp" className="fixed [right:18px] [bottom:18px] [z-index:60] flex [align-items:center] [justify-content:center] [width:58px] [height:58px] [border-radius:999px] no-underline [box-shadow:0_14px_28px_-10px_rgba(37,211,102,0.6)] [background-color:#25D366] hover:[background-color:#1EBE5A] active:[background-color:#19A84F]">
          <img src="/assets-lp2/whatsapp.svg" alt="" className="[width:32px] [height:32px] block [filter:brightness(0)_invert(1)]" />
        </a>
        
      </div>
    </>
  );
}
