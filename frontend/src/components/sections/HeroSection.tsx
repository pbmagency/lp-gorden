import { ShieldCheck, Star, Award, Users } from 'lucide-react';
import Button from '../ui/Button';
import SocialProofMicro from '../ui/SocialProofMicro';

const stats = [
  { icon: <Users size={18} />, value: '45.000+', label: 'Alumni Sukses' },
  { icon: <Star size={18} />, value: '4.9/5', label: 'Rating Alumni' },
  { icon: <Award size={18} />, value: '13+', label: 'Tahun Pengalaman' },
  { icon: <ShieldCheck size={18} />, value: 'Resmi', label: 'Lembaga ITP & IIEF' },
];

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #fff 55%, #FFF5F5 100%)' }}
    >
      {/* Background blobs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none"
        style={{ backgroundColor: '#D70808', filter: 'blur(120px)', opacity: 0.07 }} />
      <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full pointer-events-none"
        style={{ backgroundColor: '#151515', filter: 'blur(100px)', opacity: 0.05 }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16 md:pt-20 md:pb-24">
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* ── Left: Copy ── */}
          <div className="order-2 lg:order-1 flex flex-col gap-6">

            {/* Badges row */}
            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase"
                style={{ backgroundColor: '#FFF0F0', color: '#D70808', border: '1px solid #ffb3b3' }}>
                🔥 Kursi Terbatas — Batch Juli 2026
              </div>
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase"
                style={{ backgroundColor: '#F3F3F3', color: '#151515', border: '1px solid #e5e7eb' }}>
                17+ Tahun · Mahasiswa & Karyawan
              </div>
            </div>

            {/* Headline */}
            <h1
              className="text-4xl sm:text-5xl lg:text-[3.25rem] font-black leading-tight"
              style={{ fontFamily: 'var(--font-heading)', color: '#151515' }}
            >
              Deadline Beasiswa LPDP, Fulbright & CPNS Sudah{' '}
              <span style={{ color: '#D70808' }}>Semakin Dekat</span>.{' '}
              <br className="hidden md:block" />
              Jangan Gagal Hanya Karena{' '}
              <span style={{ color: '#D70808' }}>
                Skor TOEFL Belum Cukup.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base md:text-lg leading-relaxed" style={{ color: '#3d3d3d' }}>
              Bukan kelas bahasa Inggris biasa.{' '}
              <strong style={{ color: '#151515' }}>Metode 30 Jam Full Bright mengajarkan pola,</strong>{' '}
              bukan menghafal ribuan soal —{' '}
              <strong>cukup 1 jam 1 hari</strong> dari rumah, skor naik signifikan
              dalam <strong>10–15 hari</strong>.
            </p>

            {/* Trust badges — red only, no blue */}
            <div className="flex flex-wrap gap-2">
              {['Lembaga Resmi ITP & IIEF', 'Pengajar Skor 600+', '13+ Tahun Pengalaman'].map(b => (
                <span key={b} className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: '#FFF0F0', color: '#D70808', border: '1px solid #ffb3b3' }}>
                  ✓ {b}
                </span>
              ))}
            </div>

            {/* CTAs — fullWidth on mobile, auto on sm+ */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button href="#pricing" size="lg" fullWidth className="sm:w-auto">
                🚀 Daftar Sekarang — Mulai Rp 250.000
              </Button>
              <Button href="#testimonials" variant="ghost" size="lg" fullWidth className="sm:w-auto">
                Lihat Bukti Nyata →
              </Button>
            </div>

            {/* Social proof under CTA */}
            <SocialProofMicro />
          </div>

          {/* ── Right: Score card visual ── */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="w-full max-w-[360px]">

              {/* Card + floating chips in own positioning context */}
              <div className="relative">
                <div className="rounded-3xl p-8 text-white"
                  style={{
                    background: 'linear-gradient(145deg, #3d6ab0 0%, #1e3a6e 100%)',
                    boxShadow: '0 24px 80px rgba(30,58,110,0.45), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.2)',
                  }}>

                  <p className="text-sm font-semibold opacity-75 mb-2">
                    Rata-rata peningkatan alumni Full Bright
                  </p>

                  {/* Score display */}
                  <div className="flex items-end justify-between gap-2 mb-6">
                    <div>
                      <p className="text-xs opacity-60 mb-1">Sebelum</p>
                      <p className="text-4xl font-black opacity-60" style={{ fontFamily: 'var(--font-heading)' }}>387</p>
                    </div>
                    <p className="text-2xl opacity-40 mb-1">→</p>
                    <div>
                      <p className="text-xs opacity-60 mb-1">Setelah</p>
                      <p className="text-5xl font-black" style={{ fontFamily: 'var(--font-heading)', color: '#F59E0B', textShadow: '0 2px 20px rgba(245,158,11,0.4)' }}>527</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs opacity-60 mb-1">Naik</p>
                      <p className="text-3xl font-black" style={{ fontFamily: 'var(--font-heading)', color: '#4ade80', textShadow: '0 2px 16px rgba(74,222,128,0.35)' }}>+140</p>
                    </div>
                  </div>

                  <div className="h-px mb-6" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />

                  <div className="grid grid-cols-2 gap-3">
                    {stats.map(s => (
                      <div key={s.label} className="rounded-2xl p-3 text-center" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                        <p className="text-xl font-black mb-0.5" style={{ fontFamily: 'var(--font-heading)' }}>{s.value}</p>
                        <p className="text-xs opacity-70">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating testimonial chip */}
                <div className="absolute -bottom-5 -left-4 bg-white rounded-2xl px-4 py-3 flex items-center gap-3 max-w-[200px]"
                  style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.14)' }}>
                  <span className="text-2xl">🎓</span>
                  <div>
                    <p className="text-xs font-black leading-tight" style={{ color: '#151515', fontFamily: 'var(--font-heading)' }}>Lulus Fulbright!</p>
                    <p className="text-xs" style={{ color: '#6b7280' }}>Alumni Batch 2024</p>
                  </div>
                </div>

                {/* Floating star chip */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl px-3 py-2 flex items-center gap-1.5"
                  style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} fill="#F59E0B" color="#F59E0B" />)}
                  <span className="text-xs font-black ml-1" style={{ color: '#151515' }}>4.9</span>
                </div>
              </div>{/* end card relative context */}

              {/* WA screenshot strip — styled with shadow + label */}
              <div className="mt-10">
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {['/image/toefl10.jpeg', '/image/toefl12.jpeg', '/image/toefl25.jpeg'].map((src, i) => (
                    <div key={i} className="overflow-hidden aspect-[9/16] relative"
                      style={{ borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
                      <img
                        src={src}
                        alt={`Score Report ETS Alumni ${i + 1}`}
                        className="w-full h-full object-cover"
                        loading="eager"
                      />
                    </div>
                  ))}
                </div>
                {/* Label — more prominent */}
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1" style={{ backgroundColor: '#e5e7eb' }} />
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 text-center whitespace-nowrap"
                    style={{ color: '#D70808' }}>
                    Score Report Resmi ETS
                  </span>
                  <div className="h-px flex-1" style={{ backgroundColor: '#e5e7eb' }} />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Section transition */}
      <div style={{ lineHeight: 0, marginBottom: '-1px' }}>
        <svg viewBox="0 0 1440 56" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '56px' }}>
          <path d="M0,28 C240,56 480,0 720,28 C960,56 1200,0 1440,28 L1440,56 L0,56 Z" fill="#F3F3F3" />
        </svg>
      </div>
    </section>
  );
}
