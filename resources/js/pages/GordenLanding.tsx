import React, { useState, useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';

export default function GordenLanding() {
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [narrow, setNarrow] = useState(false);
  
  const [reviewIdx, setReviewIdx] = useState(0);
  const reviewShots = [1, 2, 3, 4, 5, 6, 7, 8].map(n => `/assets/review-${n}.webp`);

  const [lightbox, setLightbox] = useState<string | null>(null);
  const [lbList, setLbList] = useState<{src: string, caption: string}[]>([]);
  const [lbIdx, setLbIdx] = useState(0);

  const [katCat, setKatCat] = useState('semua');
  const [expKain, setExpKain] = useState(false);
  const [expBlinds, setExpBlinds] = useState(false);
  
  const lightboxImgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 760px)');
    const onChange = (e: MediaQueryListEvent) => setNarrow(e.matches);
    setNarrow(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setReviewIdx(i => (i + 1) % reviewShots.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [reviewShots.length]);
  
  useEffect(() => {
    const csrfToken = document.querySelector("meta[name='csrf-token']")?.getAttribute("content") || '';
    
    const track = (data: any) => {
      fetch('/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken
        },
        body: JSON.stringify(data)
      }).catch(() => {});
    };
    
    track({ event_type: 'visit', url: window.location.href });
    
    const timers = [
      setTimeout(() => track({ event_type: 'engagement', duration: 15 }), 15000),
      setTimeout(() => track({ event_type: 'engagement', duration: 45 }), 45000),
      setTimeout(() => track({ event_type: 'engagement', duration: 75 }), 75000),
    ];
    
    const scrollMarks = [0.25, 0.5, 0.75, 0.9];
    const scrolled = new Set();
    const onScroll = () => {
      const h = document.documentElement;
      const pct = h.scrollTop / (h.scrollHeight - h.clientHeight);
      scrollMarks.forEach(m => {
        if (pct >= m && !scrolled.has(m)) {
          scrolled.add(m);
          track({ event_type: 'scroll', depth: m * 100 });
        }
      });
    };
    window.addEventListener('scroll', onScroll);
    
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
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('click', onClick);
    };
  }, []);

  const openLightbox = (e: React.MouseEvent<HTMLElement>) => {
    const target = (e.target as HTMLElement).closest('[data-zoom]');
    if (!target) return;
    const scope = target.closest('section') || document;
    const nodes = Array.from(scope.querySelectorAll('[data-zoom]'));
    const list = nodes.map(n => {
      const box = n.parentElement;
      const ps = box ? Array.from(box.querySelectorAll('p')).map(p => p.textContent?.trim()).filter(Boolean) : [];
      return { src: n.getAttribute('data-zoom') || '', caption: ps.slice(0, 2).join(', ') };
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
    const list = reviewShots.map(src => ({ src, caption: '' }));
    setLbList(list);
    setLbIdx(reviewIdx);
    setLightbox(reviewShots[reviewIdx]);
  };

  const stepReview = (d: number) => {
    const n = reviewShots.length;
    setReviewIdx(prev => (prev + d + n) % n);
  };

  const pickCat = (cat: string) => {
    setKatCat(cat);
    const el = document.getElementById("katalog-filter");
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 132;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const reviewPrev = reviewShots[(reviewIdx + reviewShots.length - 1) % reviewShots.length];
  const reviewNext = reviewShots[(reviewIdx + 1) % reviewShots.length];

  const showKain = katCat === "semua" || katCat === "kain";
  const showBlinds = katCat === "semua" || katCat === "blinds";
  const showPelengkap = katCat === "semua" || katCat === "lain";

  const showKainRest = katCat === "kain" || expKain;
  const showBlindsRest = katCat === "blinds" || expBlinds;
  
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

  const tab = (k: string) => (katCat === k ? { background: "#817661", color: "#fdfcfa" } : { background: "#fdfcfa", color: "#6f6656" });

  return (
    <>
      <Head>
        <title>Gorden Wallpaper Solo | Custom Gorden & Wallpaper Terbaik</title>
        <meta name="description" content="Pusat pembuatan dan pemasangan Gorden & Wallpaper Custom berkualitas di Solo Raya. Gratis survey, ukur, dan pasang langsung di lokasi Anda." />
        <meta property="og:title" content="Gorden Wallpaper Solo | Custom Gorden & Wallpaper" />
        <meta property="og:description" content="Pusat pembuatan dan pemasangan Gorden & Wallpaper Custom berkualitas di Solo Raya. Gratis survey, ukur, dan pasang langsung di lokasi Anda." />
        <meta property="og:image" content="/assets/hero-gorden.webp" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400&display=swap" rel="stylesheet" />
        <style>{`
          /* Reset admin/Tailwind globals for landing page */
          html, html.dark { background-color: oklch(0.97 0.015 85) !important; color-scheme: light !important; }
          body { margin: 0 !important; padding: 0 !important; background: oklch(0.97 0.015 85) !important; font-family: Poppins, Helvetica, sans-serif !important; -webkit-font-smoothing: antialiased; color: oklch(0.24 0.02 60) !important; }
          * { box-sizing: border-box; }
          a { color: #6a6151; }
          a:hover { color: #4f4a3d; }
          @keyframes omBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(6px); } }
          @keyframes reviewMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          
          .btn-wa:hover { background: #E85A26 !important; }
          .btn-wa:active { background: #D24E1C !important; }
          .btn-secondary:hover { background: rgba(253,252,250,0.26) !important; }
          .btn-secondary-light:hover { background: #FFF1EB !important; }
          .card-product:hover { transform: translateY(-3px) !important; box-shadow: 0 20px 36px -24px rgba(58,53,44,0.85) !important; border-color: #cfc4ae !important; }
          .btn-outline:hover { background: #817661 !important; color: #fdfcfa !important; border-color: #817661 !important; }
          .btn-outline-2:hover { background: #f4f1ea !important; }
          .review-btn:hover { background: #f6f3ec !important; }
          .review-side { opacity: 0.7; }
          .review-side:hover { opacity: 1 !important; }
          .wa-float:hover { background: #1EBE5A !important; }
          .wa-float:active { background: #19A84F !important; }
        `}</style>
      </Head>

      <div style={{ background: "oklch(0.97 0.015 85)", color: "oklch(0.24 0.02 60)", fontFamily: "Poppins, Helvetica, sans-serif", fontSize: "17px", lineHeight: 1.62, overflowX: "clip" }}>
        
        {/* Navbar */}
        <div style={{ position: "sticky", top: 0, zIndex: 60, background: "rgba(250,248,244,0.95)", backdropFilter: "blur(10px)", borderBottom: "1px solid oklch(0.89 0.02 80)" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <img src="/assets/logo.webp" alt="Gorden Wallpaper Solo" style={{ height: 52, width: "auto", display: "block" }} />
            <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20konsultasi%20gorden.%20Boleh%20dibantu%3F" target="_blank" rel="noopener noreferrer" className="btn-wa" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 46, padding: "11px 18px", background: "#FF6B35", color: "#fff", fontSize: 15, fontWeight: 600, textDecoration: "none", borderRadius: 10, whiteSpace: "nowrap", transition: "background 0.2s" }}>
              <img src="/assets/whatsapp.svg" alt="" style={{ flex: "none", width: 18, height: 18, marginRight: 8, display: "block" }} />
              Konsultasi Gratis &rarr;
            </a>
          </div>
        </div>

        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "12px 20px 60px" }}>
          
          {/* Hero */}
          <section style={{ padding: 0, height: "calc(100svh - 79px)", minHeight: 460, display: "flex", flexDirection: "column" }}>
            <div style={{ position: "relative", flex: "1 1 auto", minHeight: 0, width: "100vw", marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 14, padding: "24px clamp(20px, calc((100vw - 960px) / 2 + 20px), 200px) clamp(22px, 7vw, 104px)", overflow: "hidden", backgroundImage: "linear-gradient(to top, rgba(30,25,19,0.94) 0%, rgba(30,25,19,0.74) 48%, rgba(30,25,19,0.3) 100%), url('/assets/hero-gorden.webp')", backgroundSize: "cover", backgroundPosition: "center 40%", borderRadius: 0 }}>
              <div style={{ position: "relative", width: "100%", maxWidth: 640, display: "flex", flexDirection: "column" }}>
                <div style={{ alignSelf: "flex-start", display: "inline-flex", flexWrap: "nowrap", whiteSpace: "nowrap", alignItems: "center", gap: 10, padding: "7px 13px 7px 15px", margin: "0 0 12px", background: "rgba(253,252,250,0.14)", border: "1px solid rgba(253,252,250,0.35)", backdropFilter: "blur(6px)", borderRadius: 999 }}>
                  <span style={{ color: "#E0A93B", fontSize: 14, letterSpacing: 1 }}>&#9733;&#9733;&#9733;&#9733;&#9733;</span>
                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#fdfcfa", whiteSpace: "nowrap" }}>1.000+ Pembeli</span>
                  <span style={{ display: "flex" }}>
                    <img src="/assets/ava-1.webp" alt="" style={{ width: 22, height: 22, borderRadius: 999, border: "2px solid rgba(253,252,250,0.8)", objectFit: "cover", display: "block" }} />
                    <img src="/assets/ava-2.webp" alt="" style={{ width: 22, height: 22, marginLeft: -8, borderRadius: 999, border: "2px solid rgba(253,252,250,0.8)", objectFit: "cover", display: "block" }} />
                    <img src="/assets/ava-3.webp" alt="" style={{ width: 22, height: 22, marginLeft: -8, borderRadius: 999, border: "2px solid rgba(253,252,250,0.8)", objectFit: "cover", display: "block" }} />
                  </span>
                </div>
                <h1 style={{ margin: "0 0 12px", fontFamily: "Poppins, Helvetica, sans-serif", fontSize: "clamp(26px, 3.6vw, 40px)", lineHeight: 1.1, fontWeight: 700, letterSpacing: "-0.025em", color: "#fdfcfa", textWrap: "pretty" }}>Gorden Custom Solo Raya, <span style={{ background: "linear-gradient(to top, rgba(224, 169, 59, 0.85) 0.28em, transparent 0.28em)" }}>Terima Beres Ukur &amp; Pasang</span></h1>
                <p style={{ margin: "0 0 16px", fontSize: "clamp(14px, 1.5vw, 17px)", color: "rgba(253,252,250,0.9)", textWrap: "pretty" }}><b style={{ color: "#fdfcfa" }}>Takut salah ukur atau salah model?</b> Konsultasi langsung dengan owner, kami ukur dan pasang di tempat.</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20konsultasi%20gorden.%20Boleh%20dibantu%3F" target="_blank" rel="noopener noreferrer" className="btn-wa" style={{ flex: "1 1 260px", whiteSpace: "nowrap", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 56, padding: "14px 20px", background: "#FF6B35", color: "#fff", fontSize: "clamp(15px, 3.9vw, 17px)", fontWeight: 700, textDecoration: "none", borderRadius: 12, boxShadow: "0 10px 24px -10px rgba(0,0,0,0.55)", transition: "background 0.2s" }}>
                    <img src="/assets/whatsapp.svg" alt="" style={{ flex: "none", width: 20, height: 20, marginRight: 9, display: "block" }} />Konsultasi Gratis &rarr;
                  </a>
                  <a href="#portofolio" className="btn-secondary" style={{ flex: "1 1 200px", whiteSpace: "nowrap", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 56, padding: "14px 18px", background: "rgba(253,252,250,0.12)", border: "2px solid #FF6B35", color: "#fdfcfa", fontSize: "clamp(15px, 3.9vw, 17px)", fontWeight: 700, textDecoration: "none", borderRadius: 12, backdropFilter: "blur(4px)", transition: "background 0.2s" }}>Lihat Portofolio &rarr;</a>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px 10px", margin: "14px 0 0", fontSize: 13, color: "rgba(253,252,250,0.88)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}><span style={{ color: "#E0A93B", fontSize: 14, letterSpacing: 1 }}>&#9733;&#9733;&#9733;&#9733;&#9733;</span> <strong style={{ color: "#fdfcfa" }}>5,0</strong> Google Review</span>
                  <span style={{ color: "rgba(253,252,250,0.45)" }}>&bull;</span>
                  <span style={{ whiteSpace: "nowrap" }}>Sejak 2012</span>
                  <span style={{ color: "rgba(253,252,250,0.45)" }}>&bull;</span>
                  <span style={{ whiteSpace: "nowrap" }}>Garansi pasang 14 hari</span>
                </div>
              </div>
              <span aria-hidden="true" style={{ alignSelf: "center", display: "flex", alignItems: "center", justifyContent: "center", width: 54, height: 54, background: "rgba(253,252,250,0.2)", border: "2px solid rgba(253,252,250,0.8)", backdropFilter: "blur(6px)", borderRadius: 999, color: "#fdfcfa", animation: "omBob 1.6s ease-in-out infinite" }}>
                <span style={{ display: "block", fontSize: 30, lineHeight: 1, fontWeight: 700, marginTop: -4 }}>&darr;</span>
              </span>
            </div>
          </section>

          {/* Pain Points */}
          <section style={{ padding: "44px 0", borderTop: "1px solid oklch(0.9 0.02 80)" }}>
            <div style={{ maxWidth: "56ch", margin: "0 0 8px" }}>
              <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#817661" }}>Sebelum memutuskan</p>
              <h2 style={{ margin: "0 0 8px", fontFamily: "Poppins, Helvetica, sans-serif", fontSize: "clamp(23px, 5.2vw, 30px)", lineHeight: 1.2, fontWeight: 700, letterSpacing: "-0.02em", textWrap: "pretty" }}>Sering kepikiran hal ini sebelum pasang gorden?</h2>
              <p style={{ margin: 0, color: "oklch(0.42 0.02 60)" }}>Wajar, hampir semua pelanggan menanyakan hal yang sama di chat pertama.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: "0 40px", margin: "18px 0 0" }}>
              {[
                "Takut ukur sendiri, eh ternyata kependekan atau kegedean?",
                "Nggak sempat, atau nggak sanggup pasang sendiri?",
                "Mau tanya-tanya detail tapi takut cuma dibalas template sama admin?",
                "Sudah pilih model, tapi pas terpasang kok kurang pas sama ruangan?",
                "Takut bayar lebih mahal, tapi barangnya ternyata biasa saja?"
              ].map((text, i) => (
                <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "18px 0", borderTop: "1px solid oklch(0.88 0.02 82)" }}>
                  <span style={{ flex: "none", fontFamily: "Poppins, Helvetica, sans-serif", fontSize: "clamp(26px, 6vw, 34px)", lineHeight: 1, fontWeight: 700, color: "#cfc4ae", letterSpacing: "-0.03em" }}>0{i+1}</span>
                  <p style={{ margin: "2px 0 0", fontFamily: "Poppins, Helvetica, sans-serif", fontSize: "clamp(16px, 4.3vw, 19px)", lineHeight: 1.4, fontWeight: 500, color: "oklch(0.3 0.02 60)", textWrap: "pretty" }}>{text}</p>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 14, alignItems: "center", margin: "24px 0 0", padding: "20px 22px", background: "#817661", color: "#fdfcfa", borderRadius: 16 }}>
              <span style={{ flex: "none", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 999, background: "rgba(253,252,250,0.16)", fontSize: 18 }}>&darr;</span>
              <p style={{ margin: 0, fontFamily: "Poppins, Helvetica, sans-serif", fontSize: "clamp(16px, 4.2vw, 19px)", fontWeight: 600, lineHeight: 1.4 }}>Semua kekhawatiran itu justru jadi alasan kenapa Gorden Wallpaper Solo ada.</p>
            </div>
            
            <div style={{ margin: "26px 0 0" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20konsultasi%20gorden.%20Boleh%20dibantu%3F" target="_blank" rel="noopener noreferrer" className="btn-wa" style={{ flex: "1 1 260px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 56, padding: "14px 18px", background: "#FF6B35", color: "#fff", fontSize: "clamp(15px, 3.9vw, 17px)", fontWeight: 700, textDecoration: "none", borderRadius: 12, transition: "background 0.2s" }}>
                  <img src="/assets/whatsapp.svg" alt="" style={{ flex: "none", width: 20, height: 20, marginRight: 9, display: "block" }} />Konsultasi Gratis &rarr;
                </a>
                <a href="#portofolio" className="btn-secondary" style={{ flex: "1 1 220px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 56, padding: "14px 18px", background: "rgba(253,252,250,0.12)", border: "2px solid #FF6B35", color: "#241D17", fontSize: "clamp(15px, 3.9vw, 17px)", fontWeight: 700, textDecoration: "none", borderRadius: 12, backdropFilter: "blur(4px)", transition: "background 0.2s" }}>Lihat Portofolio &rarr;</a>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "5px 10px", margin: "12px 0 0", fontSize: 12.5, color: "oklch(0.4 0.02 60)" }}>
                <span style={{ color: "#E0A93B", fontSize: 12.5, letterSpacing: 1 }}>&#9733;&#9733;&#9733;&#9733;&#9733;</span>
                <strong style={{ color: "oklch(0.28 0.02 60)" }}>5,0</strong>
                <span>Google Review</span>
                <span style={{ color: "oklch(0.78 0.02 80)" }}>&bull;</span>
                <span>1.000+ pembeli</span>
                <span style={{ color: "oklch(0.78 0.02 80)" }}>&bull;</span>
                <span>Ada garansi kalau kurang pas</span>
              </div>
            </div>
          </section>

          {/* Comparison */}
          <section style={{ margin: "40px 0", padding: "clamp(24px, 5vw, 34px) clamp(16px, 4.5vw, 28px)", background: "#f6f3ec", border: "1px solid oklch(0.9 0.02 80)", borderRadius: 20 }}>
            <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#817661" }}>KENAPA PILIH GORDEN WALLPAPER SOLO?</p>
            <h2 style={{ margin: "0 0 8px", fontFamily: "Poppins, Helvetica, sans-serif", fontSize: "clamp(23px, 5.2vw, 30px)", lineHeight: 1.2, fontWeight: 700, letterSpacing: "-0.02em", textWrap: "pretty" }}>Kenapa hasil gorden kami beda dengan marketplace dan toko gorden lain</h2>
            <p style={{ margin: "0 0 22px", color: "oklch(0.42 0.02 60)", maxWidth: "68ch" }}>Silakan dibandingkan. Bedanya paling terasa setelah gordennya terpasang.</p>
            
            <div style={{ background: "#fdfcfa", border: "1px solid oklch(0.91 0.015 82)", borderRadius: 18, overflow: "clip" }}>
              <div style={{ position: "sticky", top: 60, zIndex: 15, display: "grid", gridTemplateColumns: "minmax(0, 1fr) clamp(46px, 12vw, 84px) clamp(46px, 12vw, 84px) clamp(52px, 13vw, 96px)", alignItems: "stretch", gap: 6, background: "#f4f1ea", boxShadow: "0 6px 12px -10px rgba(58,53,44,0.7)" }}>
                <span style={{ display: "flex", alignItems: "center", padding: "12px 14px", fontSize: "clamp(11px, 3vw, 12px)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8f8674" }}>Kriteria</span>
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 4px", textAlign: "center", fontSize: "clamp(11px, 3vw, 13px)", fontWeight: 700, lineHeight: 1.15, color: "#8f8674" }}>Market&shy;place</span>
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 4px", textAlign: "center", fontSize: "clamp(11px, 3vw, 13px)", fontWeight: 700, lineHeight: 1.15, color: "#8f8674" }}>Toko lain</span>
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 4px", textAlign: "center", fontSize: "clamp(11px, 3vw, 13px)", fontWeight: 700, lineHeight: 1.15, color: "#fdfcfa", background: "#817661" }}>Kami</span>
              </div>
              
              {[
                { label: "Harga sepadan hasilnya", m: "✓", t: "–", k: "✓" },
                { label: "Jelas sejak awal, tanpa biaya tambahan", m: "✓", t: "–", k: "✓" },
                { label: "Ruangan benar-benar gelap", m: "–", t: "✓", k: "✓" },
                { label: "Pas di jendela Anda", m: "✕", t: "✓", k: "✓" },
                { label: "Jatuhnya rapi berkat finishing steam", m: "✕", t: "–", k: "✓" },
                { label: "Aman dari salah ukur", m: "✕", t: "–", k: "✓" },
                { label: "Bisa tanya sampai cocok", m: "✕", t: "✓", k: "✓" },
                { label: "Terpasang, tinggal terima beres", m: "✕", t: "–", k: "✓" },
                { label: "Ada garansi kalau kurang pas", m: "✕", t: "–", k: "✓" }
              ].map((row, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) clamp(46px, 12vw, 84px) clamp(46px, 12vw, 84px) clamp(52px, 13vw, 96px)", alignItems: "center", gap: 6, borderTop: i > 0 ? "1px solid oklch(0.94 0.012 82)" : "none" }}>
                  <span style={{ padding: "13px 14px", fontSize: "clamp(13.5px, 3.6vw, 15.5px)", lineHeight: 1.35, fontWeight: 500, color: "oklch(0.3 0.02 60)" }}>{row.label}</span>
                  <span style={{ display: "flex", justifyContent: "center", padding: "12px 0" }}>
                    <span style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 999, background: row.m === "✓" ? "#817661" : row.m === "–" ? "#e6e0d3" : "#eee9df", color: row.m === "✓" ? "#fdfcfa" : row.m === "–" ? "#7d7362" : "#b3a892", fontSize: 12, fontWeight: 700 }}>{row.m}</span>
                  </span>
                  <span style={{ display: "flex", justifyContent: "center", padding: "12px 0" }}>
                    <span style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 999, background: row.t === "✓" ? "#817661" : row.t === "–" ? "#e6e0d3" : "#eee9df", color: row.t === "✓" ? "#fdfcfa" : row.t === "–" ? "#7d7362" : "#b3a892", fontSize: 12, fontWeight: 700 }}>{row.t}</span>
                  </span>
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 0", background: "#f7f4ed", height: "100%" }}>
                    <span style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 999, background: "#817661", color: "#fdfcfa", fontSize: 12, fontWeight: 700 }}>{row.k}</span>
                  </span>
                </div>
              ))}
            </div>
            <p style={{ margin: "22px 0 0", padding: "18px 20px", background: "#fdfcfa", borderLeft: "5px solid #817661", borderRadius: 12, fontSize: "clamp(15px, 4vw, 18px)", lineHeight: 1.5, color: "oklch(0.3 0.02 60)", textWrap: "pretty" }}>Yang kami janjikan hasil akhir yang pas di jendela Anda, rapi dan siap pakai.</p>
            <div style={{ margin: "26px 0 0" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20konsultasi%20gorden.%20Boleh%20dibantu%3F" target="_blank" rel="noopener noreferrer" className="btn-wa" style={{ flex: "1 1 260px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 56, padding: "14px 18px", background: "#FF6B35", color: "#fff", fontSize: "clamp(15px, 3.9vw, 17px)", fontWeight: 700, textDecoration: "none", borderRadius: 12, transition: "background 0.2s" }}>
                  <img src="/assets/whatsapp.svg" alt="" style={{ flex: "none", width: 20, height: 20, marginRight: 9, display: "block" }} />Konsultasi Gratis &rarr;
                </a>
                <a href="#katalog" className="btn-secondary-light" style={{ flex: "1 1 220px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 56, padding: "14px 18px", background: "#fdfcfa", border: "2px solid #FF6B35", color: "#C24E1E", fontSize: "clamp(15px, 3.9vw, 17px)", fontWeight: 700, textDecoration: "none", borderRadius: 12, transition: "background 0.2s" }}>Lihat Model Gorden &rarr;</a>
              </div>
            </div>
          </section>

          {/* Before/After */}
          <section style={{ padding: "44px 0", borderTop: "1px solid oklch(0.9 0.02 80)" }}>
            <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#817661" }}>Hasil akhirnya</p>
            <h2 style={{ margin: "0 0 8px", fontFamily: "Poppins, Helvetica, sans-serif", fontSize: "clamp(23px, 5.2vw, 30px)", lineHeight: 1.2, fontWeight: 700, letterSpacing: "-0.02em", textWrap: "pretty" }}>Beginilah hasil pemasangan kami</h2>
            <p style={{ margin: "0 0 20px", color: "oklch(0.42 0.02 60)", maxWidth: "68ch" }}>Ruangan yang sama, hanya beda gordennya. Sepengaruh itu kain dan ukuran yang tepat.</p>
            <div style={{ margin: 0, padding: "18px 16px", background: "#f6f3ec", border: "1px solid oklch(0.9 0.02 80)", borderRadius: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 14 }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ position: "relative", borderBottom: "none", borderTopLeftRadius: 14, borderTopRightRadius: 14, aspectRatio: "3 / 4", backgroundImage: "url('/assets/before-gorden.webp')", backgroundSize: "cover", backgroundPosition: "center", overflow: "hidden" }}>
                    <span style={{ position: "absolute", top: 12, left: 12, padding: "6px 14px", background: "#fdfcfa", color: "#5d5546", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: 999, boxShadow: "0 4px 12px -4px rgba(0,0,0,0.35)" }}>Before</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ position: "relative", borderBottom: "none", borderTopLeftRadius: 14, borderTopRightRadius: 14, aspectRatio: "3 / 4", backgroundImage: "url('/assets/after-gorden.webp')", backgroundSize: "cover", backgroundPosition: "center", overflow: "hidden" }}>
                    <span style={{ position: "absolute", top: 12, left: 12, padding: "6px 14px", color: "#fff", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: 999, boxShadow: "0 4px 12px -4px rgba(0,0,0,0.35)", backgroundColor: "#817661" }}>After</span>
                  </div>
                </div>
              </div>
              <p style={{ margin: "12px 0 0", fontSize: 13, color: "oklch(0.5 0.03 70)" }}>Project nyata: rumah di Perumahan Colomadu, Karanganyar, gorden smokering custom ukuran.</p>
            </div>
            
            <div style={{ margin: "26px 0 0" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20konsultasi%20gorden.%20Boleh%20dibantu%3F" target="_blank" rel="noopener noreferrer" className="btn-wa" style={{ flex: "1 1 260px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 56, padding: "14px 18px", background: "#FF6B35", color: "#fff", fontSize: "clamp(15px, 3.9vw, 17px)", fontWeight: 700, textDecoration: "none", borderRadius: 12, transition: "background 0.2s" }}>
                  <img src="/assets/whatsapp.svg" alt="" style={{ flex: "none", width: 20, height: 20, marginRight: 9, display: "block" }} />Konsultasi Gratis &rarr;
                </a>
                <a href="#portofolio" className="btn-secondary" style={{ flex: "1 1 220px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 56, padding: "14px 18px", background: "rgba(253,252,250,0.12)", border: "2px solid #FF6B35", color: "#241D17", fontSize: "clamp(15px, 3.9vw, 17px)", fontWeight: 700, textDecoration: "none", borderRadius: 12, backdropFilter: "blur(4px)", transition: "background 0.2s" }}>Lihat Portofolio &rarr;</a>
              </div>
            </div>
          </section>

          {/* Target Audience */}
          <section style={{ padding: "44px 0", borderTop: "1px solid oklch(0.9 0.02 80)" }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "10px 24px", margin: "0 0 22px" }}>
              <div>
                <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#817661" }}>Untuk siapa</p>
                <h2 style={{ margin: 0, fontFamily: "Poppins, Helvetica, sans-serif", fontSize: "clamp(23px, 5.2vw, 30px)", lineHeight: 1.2, fontWeight: 700, letterSpacing: "-0.02em" }}>Untuk siapa layanan ini</h2>
              </div>
              <p style={{ margin: 0, maxWidth: "40ch", fontSize: 15, color: "oklch(0.45 0.02 60)" }}>Kebutuhan tiap ruangan beda, kami bantu cari yang paling cocok.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: 14 }}>
              {[
                { num: "01", title: "Pemilik rumah baru", desc: "Rumah baru langsung terasa rapi dan adem, ukur dan pasang urusan kami.", img: "persona-rumah.webp" },
                { num: "02", title: "Pemilik & karyawan kantor", desc: "Layar tidak silau, ruang kerja lebih nyaman sesuai fungsinya.", img: "persona-kantor.webp" },
                { num: "03", title: "Pemilik villa & apartemen", desc: "Unit terasa seperti suite hotel, nilai sewanya ikut naik.", img: "persona-villa.webp" },
                { num: "04", title: "Pelaku usaha online", desc: "Background live dan foto katalog jadi bersih dan konsisten.", img: "persona-usaha.webp" }
              ].map((p, i) => (
                <article key={i} style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "flex-end", minHeight: 300, padding: 20, borderRadius: 18, overflow: "hidden", backgroundImage: `linear-gradient(to top, rgba(30,25,19,0.9) 0%, rgba(30,25,19,0.62) 28%, rgba(30,25,19,0.22) 58%, rgba(30,25,19,0) 100%), url('/assets/${p.img}')`, backgroundSize: "cover", backgroundPosition: "center" }}>
                  <span style={{ position: "absolute", top: 16, left: 18, fontFamily: "Poppins, Helvetica, sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", color: "rgba(253,252,250,0.75)" }}>{p.num}</span>
                  <h3 style={{ margin: "0 0 6px", fontFamily: "Poppins, Helvetica, sans-serif", fontSize: "clamp(18px, 4.4vw, 21px)", fontWeight: 700, letterSpacing: "-0.015em", color: "#fdfcfa" }}>{p.title}</h3>
                  <p style={{ margin: 0, fontSize: 15, lineHeight: 1.45, color: "rgba(253,252,250,0.85)" }}>{p.desc}</p>
                </article>
              ))}
            </div>
            <div style={{ margin: "26px 0 0" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20konsultasi%20gorden.%20Boleh%20dibantu%3F" target="_blank" rel="noopener noreferrer" className="btn-wa" style={{ flex: "1 1 260px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 56, padding: "14px 18px", background: "#FF6B35", color: "#fff", fontSize: "clamp(15px, 3.9vw, 17px)", fontWeight: 700, textDecoration: "none", borderRadius: 12, transition: "background 0.2s" }}>
                  <img src="/assets/whatsapp.svg" alt="" style={{ flex: "none", width: 20, height: 20, marginRight: 9, display: "block" }} />Konsultasi Gratis &rarr;
                </a>
                <a href="#portofolio" className="btn-secondary" style={{ flex: "1 1 220px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 56, padding: "14px 18px", background: "rgba(253,252,250,0.12)", border: "2px solid #FF6B35", color: "#241D17", fontSize: "clamp(15px, 3.9vw, 17px)", fontWeight: 700, textDecoration: "none", borderRadius: 12, backdropFilter: "blur(4px)", transition: "background 0.2s" }}>Lihat Portofolio &rarr;</a>
              </div>
            </div>
          </section>

          <section id="portofolio" style={{ padding: "44px 0", borderTop: "1px solid oklch(0.9 0.02 80)", scrollMarginTop: 76 }}>
             <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#817661" }}>Portofolio</p>
             <h2 style={{ margin: "0 0 8px", fontFamily: "Poppins, Helvetica, sans-serif", fontSize: "clamp(23px, 5.2vw, 30px)", lineHeight: 1.2, fontWeight: 700, letterSpacing: "-0.02em" }}>Sudah dipercaya rumah, kantor, kampus, dan rumah sakit</h2>
             <div onClick={openLightbox} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(46%, 200px), 1fr))", gap: "16px 14px" }}>
                {[
                  { img: "/assets/img-gorden-premium-rumah-pribadi-permata-bot.webp", title: "Gorden Premium", subtitle: "Permata Botanical, Solo" },
                  { img: "/assets/img-gorden-rumah-sakit-rso-orthopedi-surakar.webp", title: "Gorden Rumah Sakit", subtitle: "RSO Orthopedi Surakarta" },
                  { img: "/assets/img-tirai-solar-screen-blinds-dna-cafe-solo-.webp", title: "Tirai Solar Screen Blinds", subtitle: "DNA Cafe, Solo" },
                  { img: "/assets/img-roller-blinds-aula-kantor-bpvp-surakarta.webp", title: "Roller Blinds", subtitle: "Aula Kantor BPVP Surakarta" }
                ].map((p, i) => (
                  <div key={i}>
                    <div data-zoom={p.img} style={{ borderRadius: 12, border: "1px solid oklch(0.88 0.02 80)", aspectRatio: "1 / 1", backgroundImage: `url('${p.img}')`, backgroundSize: "cover", backgroundPosition: "center", cursor: "zoom-in" }}></div>
                    <p style={{ margin: "8px 0 0", fontSize: 15, fontWeight: 700, color: "oklch(0.28 0.02 60)" }}>{p.title}</p>
                    <p style={{ margin: "1px 0 0", fontSize: 14, color: "oklch(0.48 0.02 60)" }}>{p.subtitle}</p>
                  </div>
                ))}
                
                {showAllProjects && [
                  { img: "/assets/img-gorden-dan-wallpaper-aula-tk-kanita-tiar.webp", title: "Gorden Blackout & Wallpaper", subtitle: "Aula TK Kanita Tiara, Sukoharjo" },
                  { img: "/assets/img-gorden-premium-permata-regency-1.webp", title: "Gorden Premium", subtitle: "Permata Regency, Solo" },
                  { img: "/assets/img-wallpaper-fk-uns.webp", title: "Wallpaper Custom", subtitle: "FK UNS, Solo" },
                  { img: "/assets/img-gorden-blackout-rumah-pribadi-dr.bayuspo.webp", title: "Gorden Blackout", subtitle: "Rumah pribadi dr. Bayu, Sp.OT" },
                  { img: "/assets/img-roller-eksterior-blind-rumah-pribadi-per.webp", title: "Roller Eksterior Blinds", subtitle: "Rumah pribadi, Perum Gentan Citra" },
                  { img: "/assets/img-gorden-apartemen-solo-.webp", title: "Gorden Apartemen", subtitle: "Apartemen di Solo" }
                ].map((p, i) => (
                  <div key={'m'+i}>
                    <div data-zoom={p.img} style={{ borderRadius: 12, border: "1px solid oklch(0.88 0.02 80)", aspectRatio: "1 / 1", backgroundImage: `url('${p.img}')`, backgroundSize: "cover", backgroundPosition: "center", cursor: "zoom-in" }}></div>
                    <p style={{ margin: "8px 0 0", fontSize: 15, fontWeight: 700, color: "oklch(0.28 0.02 60)" }}>{p.title}</p>
                    <p style={{ margin: "1px 0 0", fontSize: 14, color: "oklch(0.48 0.02 60)" }}>{p.subtitle}</p>
                  </div>
                ))}
             </div>
             
             <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "26px 0 0" }}>
               <span style={{ flex: "1 1 12px", minWidth: 12, height: 1, background: "oklch(0.89 0.02 80)" }}></span>
               <button type="button" onClick={() => setShowAllProjects(s => !s)} className="btn-outline" style={{ flex: "0 1 auto", maxWidth: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 46, padding: "12px 18px", background: "#fdfcfa", border: "1.5px solid #817661", color: "#5d5546", fontFamily: "Poppins, Helvetica, sans-serif", fontSize: "clamp(13px, 3.4vw, 15px)", fontWeight: 600, borderRadius: 999, cursor: "pointer", lineHeight: 1.2, transition: "background 0.2s, color 0.2s" }}>
                 <span>{showAllProjects ? "Tampilkan lebih sedikit" : "Lihat 18 project lainnya"}</span>
                 <span style={{ fontSize: 13, lineHeight: 1 }}>&darr;</span>
               </button>
               <span style={{ flex: "1 1 12px", minWidth: 12, height: 1, background: "oklch(0.89 0.02 80)" }}></span>
             </div>
          </section>

          {/* Testimonials */}
          <section style={{ padding: "44px 0", borderTop: "1px solid oklch(0.9 0.02 80)" }}>
            <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#817661" }}>Kata pelanggan</p>
            <h2 style={{ margin: "0 0 8px", fontFamily: "Poppins, Helvetica, sans-serif", fontSize: "clamp(23px, 5.2vw, 30px)", lineHeight: 1.2, fontWeight: 700, letterSpacing: "-0.02em", textWrap: "pretty" }}>Yang mereka rasakan setelah gordennya terpasang</h2>
            
            <div style={{ margin: "20px 0 0", padding: "18px 0 0", borderTop: "1px solid oklch(0.92 0.015 82)" }}>
              <p style={{ margin: "0 0 14px", fontSize: 14, color: "oklch(0.45 0.02 60)" }}>Cuplikan ulasan lain langsung dari Google:</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "clamp(6px, 2vw, 14px)" }}>
                <button onClick={() => stepReview(-1)} aria-label="Ulasan sebelumnya" className="review-btn" style={{ flex: "none", display: "flex", alignItems: "center", justifyContent: "center", height: 38, width: 38, borderRadius: 999, border: "1px solid oklch(0.9 0.02 80)", background: "#fff", boxShadow: "0 6px 16px rgba(58,53,44,0.16)", color: "#3a352c", fontSize: 18, cursor: "pointer", transition: "background 0.2s" }}>&lsaquo;</button>
                <div onClick={() => stepReview(-1)} className="review-side" style={{ flex: "none", width: narrow ? 40 : 110, height: narrow ? 170 : 230, borderRadius: 12, border: "1px solid oklch(0.91 0.015 82)", overflow: "hidden", cursor: "pointer", backgroundColor: "#fdfcfa", backgroundSize: "cover", backgroundPosition: "left top", backgroundImage: `url('${reviewPrev}')`, transition: "opacity 0.2s" }}></div>
                <div style={{ flex: "1 1 auto", minWidth: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img alt="Ulasan pelanggan di Google" src={reviewShots[reviewIdx]} onClick={zoomCurrentReview} style={{ cursor: "zoom-in", display: "block", height: "auto", width: "auto", maxHeight: narrow ? 260 : 330, maxWidth: "100%", borderRadius: 14, border: "1px solid oklch(0.92 0.015 82)", background: "#fff", boxShadow: "0 20px 38px -22px rgba(58,53,44,0.95)" }} />
                </div>
                <div onClick={() => stepReview(1)} className="review-side" style={{ flex: "none", width: narrow ? 40 : 110, height: narrow ? 170 : 230, borderRadius: 12, border: "1px solid oklch(0.91 0.015 82)", overflow: "hidden", cursor: "pointer", backgroundColor: "#fdfcfa", backgroundSize: "cover", backgroundPosition: "left top", backgroundImage: `url('${reviewNext}')`, transition: "opacity 0.2s" }}></div>
                <button onClick={() => stepReview(1)} aria-label="Ulasan selanjutnya" className="review-btn" style={{ flex: "none", display: "flex", alignItems: "center", justifyContent: "center", height: 38, width: 38, borderRadius: 999, border: "1px solid oklch(0.9 0.02 80)", background: "#fff", boxShadow: "0 6px 16px rgba(58,53,44,0.16)", color: "#3a352c", fontSize: 18, cursor: "pointer", transition: "background 0.2s" }}>&rsaquo;</button>
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 6, margin: "10px 0 0" }}>
                {reviewShots.map((_, i) => (
                  <span key={i} style={{ width: 7, height: 7, borderRadius: 999, background: i === reviewIdx ? "#817661" : "#d8cfbd" }}></span>
                ))}
              </div>
            </div>
          </section>

          {/* Catalog */}
          <section id="katalog" style={{ padding: "44px 0", borderTop: "1px solid oklch(0.9 0.02 80)", scrollMarginTop: 76 }}>
            <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#817661" }}>Katalog model</p>
            <h2 style={{ margin: "0 0 8px", fontFamily: "Poppins, Helvetica, sans-serif", fontSize: "clamp(23px, 5.2vw, 30px)", lineHeight: 1.2, fontWeight: 700, letterSpacing: "-0.02em" }}>Model gorden yang kami kerjakan</h2>
            
            <div id="katalog-filter" style={{ position: "sticky", top: 68, zIndex: 20, margin: "0 0 18px", padding: "10px 0", background: "#fdfcfa", borderBottom: "1px solid oklch(0.92 0.015 82)" }}>
              {narrow ? (
                <select onChange={e => pickCat(e.target.value)} value={katCat} aria-label="Pilih kategori model" style={{ width: "100%", minHeight: 48, padding: "12px 14px", borderRadius: 12, border: "1.5px solid #d8cfbd", background: "#fdfcfa", fontFamily: "Poppins, Helvetica, sans-serif", fontSize: 15, fontWeight: 600, color: "#3a352c" }}>
                  <option value="semua">Semua model (13)</option>
                  <option value="kain">Gorden kain (6)</option>
                  <option value="blinds">Blinds (5)</option>
                  <option value="lain">Wallpaper &amp; pelengkap (2)</option>
                </select>
              ) : (
                <div style={{ display: "flex", flexWrap: "nowrap", gap: 8, overflowX: "auto", padding: 2, scrollbarWidth: "none" }}>
                  <button type="button" onClick={() => pickCat('semua')} style={{ minHeight: 40, padding: "9px 16px", borderRadius: 999, border: "1.5px solid #d8cfbd", ...tab("semua"), fontFamily: "Poppins, Helvetica, sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", flex: "none" }}>Semua model <span style={{ opacity: 0.6, fontWeight: 500 }}>13</span></button>
                  <button type="button" onClick={() => pickCat('kain')} style={{ minHeight: 40, padding: "9px 16px", borderRadius: 999, border: "1.5px solid #d8cfbd", ...tab("kain"), fontFamily: "Poppins, Helvetica, sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", flex: "none" }}>Gorden kain <span style={{ opacity: 0.6, fontWeight: 500 }}>6</span></button>
                  <button type="button" onClick={() => pickCat('blinds')} style={{ minHeight: 40, padding: "9px 16px", borderRadius: 999, border: "1.5px solid #d8cfbd", ...tab("blinds"), fontFamily: "Poppins, Helvetica, sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", flex: "none" }}>Blinds <span style={{ opacity: 0.6, fontWeight: 500 }}>5</span></button>
                  <button type="button" onClick={() => pickCat('lain')} style={{ minHeight: 40, padding: "9px 16px", borderRadius: 999, border: "1.5px solid #d8cfbd", ...tab("lain"), fontFamily: "Poppins, Helvetica, sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", flex: "none" }}>Wallpaper &amp; pelengkap <span style={{ opacity: 0.6, fontWeight: 500 }}>2</span></button>
                </div>
              )}
            </div>

            {showKain && (
              <div style={{ margin: "0 0 0" }}>
                <h3 style={{ margin: "0 0 14px", fontFamily: "Poppins, Helvetica, sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8f8674" }}>Gorden kain</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 255px), 1fr))", gap: 16 }}>
                  {[
                    { img: "/assets/img-gorden-sala3-1152x1536.webp", title: "Gorden Minimalis", rating: "4,9", p: "312", desc: "Bersih dan tidak ramai, pas untuk rumah minimalis.", badge: "Best Seller" },
                    { img: "/assets/img-gorden-custom.webp", title: "Gorden Custom", rating: "4,9", p: "158", desc: "Model, bahan, dan ukuran menyesuaikan ruangan Anda." },
                    { img: "/assets/img-gorden-siang-dan-vitrase.webp", title: "Gorden Siang & Vitrase", rating: "4,8", p: "132", desc: "Tirai tembus pandang, hampir wajib untuk kamar tidur." }
                  ].map((c, i) => (
                    <article key={i} className="card-product" style={{ display: "flex", flexDirection: "column", background: "#fdfcfa", border: "1px solid oklch(0.91 0.015 82)", borderRadius: 16, overflow: "hidden", boxShadow: "0 10px 24px -22px rgba(58,53,44,0.9)", transition: "transform 0.18s ease, box-shadow 0.18s ease" }}>
                      <div style={{ position: "relative", aspectRatio: "4 / 3", backgroundImage: `url('${c.img}')`, backgroundSize: "cover", backgroundPosition: "center" }}>
                        {c.badge && <span style={{ position: "absolute", top: 12, left: 12, padding: "5px 11px", background: "#817661", color: "#fdfcfa", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: 6 }}>{c.badge}</span>}
                      </div>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "15px 16px 16px" }}>
                        <h3 style={{ margin: "0 0 6px", fontFamily: "Poppins, Helvetica, sans-serif", fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1.25 }}>{c.title}</h3>
                        <p style={{ margin: "0 0 14px", fontSize: 14, lineHeight: 1.45, color: "oklch(0.45 0.02 60)" }}>{c.desc}</p>
                      </div>
                    </article>
                  ))}
                </div>
                
                {showKainRest && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 255px), 1fr))", gap: 16, marginTop: 16 }}>
                    {[
                      { img: "/assets/img-gorden-kupu-1.webp", title: "Gorden Kupu-Kupu", desc: "Gorden pita nempel jendela, simpel untuk rumah minimalis." },
                      { img: "/assets/img-gorden-hotel-apartemen.webp", title: "Gorden Hotel & Apartemen", desc: "Bahan dan model kelas hotel untuk unit sewa." },
                      { img: "/assets/img-gorden-rumah-sakit-rso-orthopedi-surakar.webp", title: "Tirai Area Publik", desc: "Untuk rumah sakit, sekolah, dan ruang publik." }
                    ].map((c, i) => (
                      <article key={i} className="card-product" style={{ display: "flex", flexDirection: "column", background: "#fdfcfa", border: "1px solid oklch(0.91 0.015 82)", borderRadius: 16, overflow: "hidden", boxShadow: "0 10px 24px -22px rgba(58,53,44,0.9)", transition: "transform 0.18s ease, box-shadow 0.18s ease" }}>
                        <div style={{ position: "relative", aspectRatio: "4 / 3", backgroundImage: `url('${c.img}')`, backgroundSize: "cover", backgroundPosition: "center" }}></div>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "15px 16px 16px" }}>
                          <h3 style={{ margin: "0 0 6px", fontFamily: "Poppins, Helvetica, sans-serif", fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1.25 }}>{c.title}</h3>
                          <p style={{ margin: "0 0 14px", fontSize: 14, lineHeight: 1.45, color: "oklch(0.45 0.02 60)" }}>{c.desc}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
                
                {!expKain && katCat === "semua" && (
                  <button type="button" onClick={() => setExpKain(true)} className="btn-outline-2" style={{ width: "100%", margin: "12px 0 0", minHeight: 46, padding: "12px 16px", background: "#fdfcfa", border: "1.5px solid #d8cfbd", borderRadius: 12, fontFamily: "Poppins, Helvetica, sans-serif", fontSize: 14, fontWeight: 600, color: "#6f6656", cursor: "pointer", transition: "background 0.2s" }}>Lihat semua Gorden kain (6) &rarr;</button>
                )}
              </div>
            )}
            
            {showBlinds && (
              <div style={{ margin: "30px 0 0" }}>
                <h3 style={{ margin: "0 0 14px", fontFamily: "Poppins, Helvetica, sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8f8674" }}>Blinds</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 255px), 1fr))", gap: 16 }}>
                  {[
                    { img: "/assets/img-roller-blinds-untuk-kantor-1152x1536.webp", title: "Roller Blinds", desc: "Ditarik naik-turun, hemat tempat, rapi untuk kantor.", badge: "Favorit Kantor" },
                    { img: "/assets/img-zebra-blinds.webp", title: "Zebra Blinds", desc: "Gorden dan vitrase jadi satu, terang-gelap tinggal digeser.", badge: "Sedang Naik" },
                    { img: "/assets/img-vertikal-blinds.webp", title: "Vertikal Blinds", desc: "Kesan formal, arah cahaya bisa diatur supaya layar tidak silau." }
                  ].map((c, i) => (
                    <article key={i} className="card-product" style={{ display: "flex", flexDirection: "column", background: "#fdfcfa", border: "1px solid oklch(0.91 0.015 82)", borderRadius: 16, overflow: "hidden", boxShadow: "0 10px 24px -22px rgba(58,53,44,0.9)", transition: "transform 0.18s ease, box-shadow 0.18s ease" }}>
                      <div style={{ position: "relative", aspectRatio: "4 / 3", backgroundImage: `url('${c.img}')`, backgroundSize: "cover", backgroundPosition: "center" }}>
                        {c.badge && <span style={{ position: "absolute", top: 12, left: 12, padding: "5px 11px", background: "#817661", color: "#fdfcfa", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: 6 }}>{c.badge}</span>}
                      </div>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "15px 16px 16px" }}>
                        <h3 style={{ margin: "0 0 6px", fontFamily: "Poppins, Helvetica, sans-serif", fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1.25 }}>{c.title}</h3>
                        <p style={{ margin: "0 0 14px", fontSize: 14, lineHeight: 1.45, color: "oklch(0.45 0.02 60)" }}>{c.desc}</p>
                      </div>
                    </article>
                  ))}
                </div>
                
                {showBlindsRest && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 255px), 1fr))", gap: 16, marginTop: 16 }}>
                    {[
                      { img: "/assets/img-slimline-blinds-gorden-kantor-scaled-e16.webp", title: "Slimline Blinds", desc: "Slat aluminium, ringan dan mudah dibersihkan." },
                      { img: "/assets/img-outdoor-blinds.webp", title: "Outdoor Blinds", desc: "Menahan panas dan silau dari luar, tahan angin." }
                    ].map((c, i) => (
                      <article key={i} className="card-product" style={{ display: "flex", flexDirection: "column", background: "#fdfcfa", border: "1px solid oklch(0.91 0.015 82)", borderRadius: 16, overflow: "hidden", boxShadow: "0 10px 24px -22px rgba(58,53,44,0.9)", transition: "transform 0.18s ease, box-shadow 0.18s ease" }}>
                        <div style={{ position: "relative", aspectRatio: "4 / 3", backgroundImage: `url('${c.img}')`, backgroundSize: "cover", backgroundPosition: "center" }}></div>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "15px 16px 16px" }}>
                          <h3 style={{ margin: "0 0 6px", fontFamily: "Poppins, Helvetica, sans-serif", fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1.25 }}>{c.title}</h3>
                          <p style={{ margin: "0 0 14px", fontSize: 14, lineHeight: 1.45, color: "oklch(0.45 0.02 60)" }}>{c.desc}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
                
                {!expBlinds && katCat === "semua" && (
                  <button type="button" onClick={() => setExpBlinds(true)} className="btn-outline-2" style={{ width: "100%", margin: "12px 0 0", minHeight: 46, padding: "12px 16px", background: "#fdfcfa", border: "1.5px solid #d8cfbd", borderRadius: 12, fontFamily: "Poppins, Helvetica, sans-serif", fontSize: 14, fontWeight: 600, color: "#6f6656", cursor: "pointer", transition: "background 0.2s" }}>Lihat semua Blinds (5) &rarr;</button>
                )}
              </div>
            )}
            
            {showPelengkap && (
              <div style={{ margin: "30px 0 0" }}>
                <h3 style={{ margin: "0 0 14px", fontFamily: "Poppins, Helvetica, sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8f8674" }}>Wallpaper &amp; pelengkap</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 255px), 1fr))", gap: 16 }}>
                  {[
                    { img: "/assets/img-wallpaper-custom-motif-peta-dunia.webp", title: "Wallpaper Custom", desc: "Satu dinding saja bisa mengubah karakter ruangan." },
                    { img: "/assets/img-kasa-nyamuk-magnetik-1536x1012.webp", title: "Perlengkapan Lainnya", desc: "Kasa nyamuk, rail rolet, dan perlengkapan gorden lain." }
                  ].map((c, i) => (
                    <article key={i} className="card-product" style={{ display: "flex", flexDirection: "column", background: "#fdfcfa", border: "1px solid oklch(0.91 0.015 82)", borderRadius: 16, overflow: "hidden", boxShadow: "0 10px 24px -22px rgba(58,53,44,0.9)", transition: "transform 0.18s ease, box-shadow 0.18s ease" }}>
                      <div style={{ position: "relative", aspectRatio: "4 / 3", backgroundImage: `url('${c.img}')`, backgroundSize: "cover", backgroundPosition: "center" }}></div>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "15px 16px 16px" }}>
                        <h3 style={{ margin: "0 0 6px", fontFamily: "Poppins, Helvetica, sans-serif", fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1.25 }}>{c.title}</h3>
                        <p style={{ margin: "0 0 14px", fontSize: 14, lineHeight: 1.45, color: "oklch(0.45 0.02 60)" }}>{c.desc}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Proses Kerja */}
          <section id="proses" style={{ padding: "44px 0", borderTop: "1px solid oklch(0.9 0.02 80)", scrollMarginTop: 76 }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "10px 24px", margin: "0 0 24px" }}>
              <div>
                <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#817661" }}>Proses kerja</p>
                <h2 style={{ margin: 0, fontFamily: "Poppins, Helvetica, sans-serif", fontSize: "clamp(23px, 5.2vw, 30px)", lineHeight: 1.2, fontWeight: 700, letterSpacing: "-0.02em" }}>Empat langkah, Anda tinggal duduk</h2>
              </div>
              <p style={{ margin: 0, maxWidth: "38ch", fontSize: 15, color: "oklch(0.45 0.02 60)" }}>Dikerjakan tim kami sendiri, dari chat pertama sampai gorden terpasang rapi.</p>
            </div>
            
            {narrow ? (
              <div style={{ padding: "22px 18px", background: "#fdfcfa", border: "1px solid oklch(0.91 0.015 82)", borderRadius: 18 }}>
                {[
                  { num: "01", title: "Bisa tanya sampai cocok", desc: "Ceritakan ruangan dan kebutuhan Anda lewat WhatsApp, lalu tentukan jadwal survey yang paling cocok." },
                  { num: "02", title: "Aman dari salah ukur", desc: "Tim datang bawa katalog kain, ukur presisi, dan bantu cocokkan warnanya.", img: "proses-ukur.webp", imgText: "Survey & ukur di rumah pelanggan" },
                  { num: "03", title: "Produksi sesuai ukuran", desc: "Dijahit khusus untuk jendela Anda dengan kain blackout impor, lalu difinishing sistem steam uap." },
                  { num: "04", title: "Pasang & cek akhir", desc: "Dipasang sampai rapi, lalu dicek bersama Anda. Kalau ada yang kurang pas, kami rapikan saat itu juga.", img: "proses-pasang.webp", imgText: "Dicek bersama sebelum dinyatakan selesai" }
                ].map((s, i) => (
                  <div key={i} style={{ display: "grid", gap: 14, padding: i === 0 ? 0 : "20px 0 0", borderTop: i === 0 ? "none" : "1px solid oklch(0.92 0.015 82)", marginTop: i === 0 ? 0 : 20 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "42px 1fr", gap: 14, alignItems: "start" }}>
                      <span style={{ fontFamily: "Poppins, Helvetica, sans-serif", fontSize: 21, fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.02em", color: "#b3a892" }}>{s.num}</span>
                      <div>
                        <h3 style={{ margin: "0 0 5px", fontFamily: "Poppins, Helvetica, sans-serif", fontSize: "clamp(17px, 4.2vw, 19px)", fontWeight: 600, letterSpacing: "-0.01em" }}>{s.title}</h3>
                        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: "oklch(0.45 0.02 60)" }}>{s.desc}</p>
                      </div>
                    </div>
                    {s.img && (
                      <div style={{ aspectRatio: "16 / 10", position: "relative", display: "flex", alignItems: "flex-end", padding: "14px 16px", borderRadius: 14, overflow: "hidden", backgroundImage: `linear-gradient(to top, rgba(30,25,19,0.8) 0%, rgba(30,25,19,0.26) 42%, rgba(30,25,19,0) 78%), url('/assets/${s.img}')`, backgroundSize: "cover", backgroundPosition: "center" }}>
                        <p style={{ margin: 0, fontFamily: "Poppins, Helvetica, sans-serif", fontSize: 13, fontWeight: 600, lineHeight: 1.35, color: "#fdfcfa" }}>{s.imgText}</p>
                      </div>
                    )}
                  </div>
                ))}
                <p style={{ margin: "22px 0 0", padding: "14px 16px", background: "#f6f3ec", borderRadius: 10, fontSize: 14, lineHeight: 1.45, color: "oklch(0.38 0.02 60)" }}><strong style={{ color: "oklch(0.26 0.02 60)" }}>Jadwal fleksibel.</strong> Survey dan pemasangan menyesuaikan waktu Anda, termasuk di luar jam kerja.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: 16, alignItems: "stretch" }}>
                <div style={{ padding: "24px 22px", background: "#fdfcfa", border: "1px solid oklch(0.91 0.015 82)", borderRadius: 18 }}>
                  {[
                    { num: "01", title: "Bisa tanya sampai cocok", desc: "Ceritakan ruangan dan kebutuhan Anda lewat WhatsApp, lalu tentukan jadwal survey yang paling cocok." },
                    { num: "02", title: "Aman dari salah ukur", desc: "Tim datang bawa katalog kain, ukur presisi, dan bantu cocokkan warnanya." },
                    { num: "03", title: "Produksi sesuai ukuran", desc: "Dijahit khusus untuk jendela Anda dengan kain blackout impor, lalu difinishing sistem steam uap." },
                    { num: "04", title: "Pasang & cek akhir", desc: "Dipasang sampai rapi, lalu dicek bersama Anda. Kalau ada yang kurang pas, kami rapikan saat itu juga." }
                  ].map((s, i) => (
                    <div key={i} style={{ padding: i === 0 ? 0 : "20px 0 0", borderTop: i === 0 ? "none" : "1px solid oklch(0.92 0.015 82)", marginTop: i === 0 ? 0 : 20 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "42px 1fr", gap: 14, alignItems: "start" }}>
                        <span style={{ fontFamily: "Poppins, Helvetica, sans-serif", fontSize: 21, fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.02em", color: "#b3a892" }}>{s.num}</span>
                        <div>
                          <h3 style={{ margin: "0 0 5px", fontFamily: "Poppins, Helvetica, sans-serif", fontSize: "clamp(17px, 4.2vw, 19px)", fontWeight: 600, letterSpacing: "-0.01em" }}>{s.title}</h3>
                          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: "oklch(0.45 0.02 60)" }}>{s.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <p style={{ margin: "22px 0 0", padding: "14px 16px", background: "#f6f3ec", borderRadius: 10, fontSize: 14, lineHeight: 1.45, color: "oklch(0.38 0.02 60)" }}><strong style={{ color: "oklch(0.26 0.02 60)" }}>Jadwal fleksibel.</strong> Survey dan pemasangan menyesuaikan waktu Anda, termasuk di luar jam kerja.</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16, minHeight: 420 }}>
                  <div style={{ flex: 1, minHeight: 200, position: "relative", display: "flex", alignItems: "flex-end", padding: "14px 16px", borderRadius: 14, overflow: "hidden", backgroundImage: "linear-gradient(to top, rgba(30,25,19,0.8) 0%, rgba(30,25,19,0.26) 42%, rgba(30,25,19,0) 78%), url('/assets/proses-ukur.webp')", backgroundSize: "cover", backgroundPosition: "center" }}>
                    <p style={{ margin: 0, fontFamily: "Poppins, Helvetica, sans-serif", fontSize: 13, fontWeight: 600, lineHeight: 1.35, color: "#fdfcfa" }}>Survey &amp; ukur di rumah pelanggan</p>
                  </div>
                  <div style={{ flex: 1, minHeight: 200, position: "relative", display: "flex", alignItems: "flex-end", padding: "14px 16px", borderRadius: 14, overflow: "hidden", backgroundImage: "linear-gradient(to top, rgba(30,25,19,0.8) 0%, rgba(30,25,19,0.26) 42%, rgba(30,25,19,0) 78%), url('/assets/proses-pasang.webp')", backgroundSize: "cover", backgroundPosition: "center" }}>
                    <p style={{ margin: 0, fontFamily: "Poppins, Helvetica, sans-serif", fontSize: 13, fontWeight: 600, lineHeight: 1.35, color: "#fdfcfa" }}>Dicek bersama sebelum dinyatakan selesai</p>
                  </div>
                </div>
              </div>
            )}
            <div style={{ margin: "26px 0 0" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20konsultasi%20gorden.%20Boleh%20dibantu%3F" target="_blank" rel="noopener noreferrer" className="btn-wa" style={{ flex: "1 1 260px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 56, padding: "14px 18px", background: "#FF6B35", color: "#fff", fontSize: "clamp(15px, 3.9vw, 17px)", fontWeight: 700, textDecoration: "none", borderRadius: 12, transition: "background 0.2s" }}>
                  <img src="/assets/whatsapp.svg" alt="" style={{ flex: "none", width: 20, height: 20, marginRight: 9, display: "block" }} />Konsultasi Gratis &rarr;
                </a>
                <a href="#portofolio" className="btn-secondary-light" style={{ flex: "1 1 220px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 56, padding: "14px 18px", background: "#fdfcfa", border: "2px solid #FF6B35", color: "#C24E1E", fontSize: "clamp(15px, 3.9vw, 17px)", fontWeight: 700, textDecoration: "none", borderRadius: 12, transition: "background 0.2s" }}>Lihat Portofolio &rarr;</a>
              </div>
            </div>
          </section>

          {/* Guarantee */}
          <section style={{ margin: "44px 0", padding: "clamp(22px, 5vw, 30px) clamp(16px, 4.5vw, 24px)", background: "#fdfcfa", border: "1px solid oklch(0.88 0.02 80)", borderLeft: "6px solid #817661", borderRadius: 18 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 24, alignItems: "center" }}>
              <div>
                <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#817661" }}>Jaminan</p>
                <h2 style={{ margin: "0 0 8px", fontFamily: "Poppins, Helvetica, sans-serif", fontSize: "clamp(23px, 5.2vw, 30px)", lineHeight: 1.2, fontWeight: 700, letterSpacing: "-0.02em", textWrap: "pretty" }}>Ada garansi kalau kurang pas</h2>
                <p style={{ margin: 0, fontSize: 17, color: "#4d4636" }}>Ada yang kurang pas dalam 14 hari? Kami perbaiki tanpa biaya tambahan.</p>
              </div>
              <div style={{ display: "grid", gap: 10 }}>
                {[
                  "Perbaikan tanpa biaya tambahan",
                  "Konsultasi & survey gratis",
                  "Harga jujur, tanpa biaya tersembunyi",
                  "Dikerjakan tim sendiri, bukan dilempar vendor"
                ].map((text, i) => (
                  <span key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 16, fontWeight: 600 }}>
                    <span style={{ flex: "none", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 999, background: "#817661", color: "#fdfcfa", fontSize: 12 }}>✓</span> {text}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section style={{ padding: "44px 0", borderTop: "1px solid oklch(0.9 0.02 80)" }}>
            <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#817661" }}>Tanya jawab</p>
            <h2 style={{ margin: "0 0 8px", fontFamily: "Poppins, Helvetica, sans-serif", fontSize: "clamp(23px, 5.2vw, 30px)", lineHeight: 1.2, fontWeight: 700, letterSpacing: "-0.02em" }}>Pertanyaan yang paling sering masuk</h2>
            <p style={{ margin: "0 0 22px", color: "oklch(0.42 0.02 60)", maxWidth: "68ch" }}>Klik pertanyaannya untuk melihat jawaban.</p>
            <div style={{ display: "grid", gap: 10 }}>
              {[
                { q: "Berapa lama proses produksinya?", a: "Umumnya 7-10 hari kerja setelah survey, tergantung jumlah jendela dan ketersediaan kain yang Anda pilih." },
                { q: "Apakah ada diskon?", a: "Ada promo tertentu tergantung periode dan jumlah jendela yang dikerjakan. Paling enak tanya langsung ke owner via WhatsApp." },
                { q: "Kapan waktu pemasangannya?", a: "Dijadwalkan sesuai kesepakatan setelah produksi selesai, biasanya 7-10 hari kerja setelahnya." },
                { q: "Kalau setelah dipasang ada yang kurang pas?", a: "Masuk garansi pemasangan 14 hari. Kabari saja, kami datang memperbaiki tanpa biaya tambahan." },
                { q: "Apakah survey dan konsultasi dikenakan biaya?", a: "Tidak. Konsultasi dan survey ke lokasi gratis untuk area Solo Raya." },
                { q: "Bisa bantu pilih model kalau saya belum ada bayangan?", a: "Justru itu tugas kami. Ceritakan fungsi ruangannya dan arah jendelanya, nanti owner yang bantu susun pilihannya." }
              ].map((faq, i) => (
                <details key={i} style={{ background: "#fdfcfa", border: "1px solid oklch(0.9 0.02 80)", borderRadius: 14, overflow: "hidden" }}>
                  <summary style={{ display: "flex", alignItems: "center", gap: 14, padding: 16, cursor: "pointer", listStyle: "none", fontSize: 17, fontWeight: 600, color: "oklch(0.26 0.02 60)" }}>
                    <span style={{ flex: "none", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 999, background: "#817661", color: "#fdfcfa", fontSize: 14, fontWeight: 700 }}>{i + 1}</span>
                    <span style={{ flex: 1 }}>{faq.q}</span>
                    <span style={{ flex: "none", fontSize: 22, lineHeight: 1, color: "#817661" }}>+</span>
                  </summary>
                  <div style={{ padding: "0 18px 18px 18px", fontSize: 16, color: "oklch(0.4 0.02 60)" }}>{faq.a}</div>
                </details>
              ))}
            </div>
          </section>

          {/* Footer & Area Layanan */}
          <section style={{ margin: "44px 0 0", padding: "clamp(24px, 5.5vw, 32px) clamp(16px, 4.5vw, 24px)", background: "#817661", color: "#fdfcfa", borderRadius: 18 }}>
            <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(253,252,250,0.75)" }}>Area layanan</p>
            <h2 style={{ margin: "0 0 8px", fontFamily: "Poppins, Helvetica, sans-serif", fontSize: "clamp(23px, 5.2vw, 30px)", lineHeight: 1.2, fontWeight: 700, letterSpacing: "-0.02em" }}>Survey &amp; pasang di seluruh Solo Raya</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(46%, 130px), 1fr))", gap: 10 }}>
              {["Solo", "Sukoharjo", "Karanganyar", "Boyolali", "Klaten", "Sragen"].map(c => (
                <span key={c} style={{ padding: "14px 16px", background: "rgba(253,252,250,0.12)", border: "1px solid rgba(253,252,250,0.28)", borderRadius: 12, fontSize: 17, fontWeight: 600, textAlign: "center" }}>{c}</span>
              ))}
            </div>
          </section>

          <footer style={{ padding: "34px 0 0", marginTop: 30, borderTop: "1px solid oklch(0.9 0.02 80)", fontSize: 15, color: "oklch(0.42 0.02 60)", display: "grid", gap: 6 }}>
            <p style={{ margin: "0 0 6px", fontFamily: "Poppins, Helvetica, sans-serif", fontSize: 19, fontWeight: 600, color: "oklch(0.24 0.02 60)" }}>Gorden Wallpaper Solo</p>
            <p style={{ margin: 0 }}>Jl. Songgolangit 22, Gentan, Solo</p>
            <p style={{ margin: 0 }}>WhatsApp: <a href="https://wa.me/6285860525758" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600 }}>085.860.52.57.58</a></p>
          </footer>
        </div>

        {/* Lightbox */}
        {lightbox && (
          <div onClick={closeLightbox} style={{ position: "fixed", inset: 0, zIndex: 90, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "rgba(28,25,20,0.88)", cursor: "zoom-out" }}>
            <div onClick={e => e.stopPropagation()} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, maxWidth: "100%", maxHeight: "100%", cursor: "default" }}>
              <img src={lightbox} alt="Pratinjau gambar" style={{ maxWidth: "100%", maxHeight: "74vh", width: "auto", height: "auto", borderRadius: 12, boxShadow: "0 30px 60px -20px rgba(0,0,0,0.7)" }} />
              {lbList[lbIdx]?.caption && (
                <p style={{ margin: 0, maxWidth: "42ch", textAlign: "center", fontFamily: "Poppins, Helvetica, sans-serif", fontSize: 15, lineHeight: 1.45, fontWeight: 600, color: "#fdfcfa" }}>{lbList[lbIdx].caption}</p>
              )}
              {lbList.length > 1 && (
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <button type="button" onClick={lightboxPrev} aria-label="Foto sebelumnya" style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 999, border: "none", background: "rgba(253,252,250,0.92)", color: "#3a352c", fontSize: 20, cursor: "pointer" }}>&lsaquo;</button>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(253,252,250,0.8)" }}>{lbIdx + 1} / {lbList.length}</span>
                  <button type="button" onClick={lightboxNext} aria-label="Foto selanjutnya" style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 999, border: "none", background: "rgba(253,252,250,0.92)", color: "#3a352c", fontSize: 20, cursor: "pointer" }}>&rsaquo;</button>
                </div>
              )}
            </div>
            <button type="button" onClick={closeLightbox} aria-label="Tutup" style={{ position: "absolute", top: 16, right: 16, width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 999, border: "none", background: "rgba(253,252,250,0.92)", color: "#3a352c", fontSize: 20, cursor: "pointer" }}>&times;</button>
          </div>
        )}

        {/* Float WA */}
        <a href="https://wa.me/6285860525758?text=Halo%2C%20saya%20mau%20konsultasi%20gorden.%20Boleh%20dibantu%3F" target="_blank" rel="noopener noreferrer" className="wa-float" aria-label="Konsultasi gratis via WhatsApp" style={{ position: "fixed", right: 18, bottom: 18, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", width: 58, height: 58, background: "#25D366", borderRadius: 999, textDecoration: "none", boxShadow: "0 14px 28px -10px rgba(37,211,102,0.6)", transition: "background 0.2s" }}>
          <img src="/assets/whatsapp.svg" alt="" style={{ width: 32, height: 32, display: "block", filter: "brightness(0) invert(1)" }} />
        </a>
      </div>
    </>
  );
}

GordenLanding.layout = (page: React.ReactNode) => page;
