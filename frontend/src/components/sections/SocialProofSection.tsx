import { Star, MessageCircle, Quote } from 'lucide-react';
import SectionWrapper from '../ui/SectionWrapper';
import Button from '../ui/Button';
import SocialProofMicro from '../ui/SocialProofMicro';

// ─── Data (hanya yang sudah terkonfirmasi valid) ───────────────────────────────

const statsBar = [
  { value: '45.000+', label: 'Alumni Sukses' },
  { value: '4.9/5',   label: 'Rating Rata-rata' },
  { value: '13+',     label: 'Tahun Pengalaman' },
  { value: '95%',     label: 'Skor Naik Signifikan', micro: 'Berdasarkan data alumni batch 2023–2024' },
];

// Skor sebelum tidak memiliki data terkonfirmasi — ditampilkan skor setelah saja
const scoreResults = [
  { label: 'TOEFL ITP Online', name: 'Widya Ningrum',         score: 563, source: 'Score Report resmi ETS — 2/4/2024' },
  { label: 'TOEFL ITP Online', name: 'Yohanes K. Susanta',    score: 560, source: 'Score Report resmi ETS — 3/8/2024' },
  { label: 'Capai Target',     name: 'Kak Rani',               score: 547, source: 'Screenshot WA ke instruktur' },
  { label: 'TOEFL ITP Online', name: 'Yuhana Dharma',          score: 537, source: 'Screenshot WA ke instruktur' },
  { label: 'LPDP',             name: 'Nadia Ayu Tiarasari',    score: 513, source: 'TOEFL ITP Online — 6/28/2024' },
  { label: 'TOEFL ITP Online', name: 'Siti Martha Uly Sinaga', score: 507, source: 'Score Report resmi ETS — 7/11/2024' },
];

// WA screenshots — hanya 6 yang terkonfirmasi (nama & skor dari WA asli)
const waScreenshots = [
  { src: '/image/toefl10.jpeg', alt: 'Widya Ningrum — Skor TOEFL ITP 563', score: '563', name: 'Widya Ningrum' },
  { src: '/image/toefl12.jpeg', alt: 'Pak Yohanes — Skor TOEFL ITP 560',   score: '560', name: 'Pak Yohanes' },
  { src: '/image/toefl7.jpeg',  alt: 'Kak Rani — Skor TOEFL ITP 547',      score: '547', name: 'Kak Rani' },
  { src: '/image/toefl25.jpeg', alt: 'Yuhana Dharma — Skor TOEFL ITP 537', score: '537', name: 'Yuhana Dharma' },
  { src: '/image/toefl20.jpeg', alt: 'Nadia Ayu — Skor TOEFL ITP 513',     score: '513', name: 'Nadia Ayu' },
  { src: '/image/toefl13.jpeg', alt: 'Siti Martha Uly — Skor TOEFL ITP 507',score:'507', name: 'Siti Martha Uly' },
];

type QuoteCard = {
  type: 'quote';
  flag: string;
  university: string;
  title: string;
  text: string;
  name: string;
  role: string;
};

type ScoreCard = {
  type: 'score';
  title: string;
  source: string;
  name: string;
  role: string;
  score: number;
};

type FeaturedCard = QuoteCard | ScoreCard;

// 3 kartu terbaik untuk grid utama (pilih yang paling impact)
const featuredTestimonials: FeaturedCard[] = [
  {
    type: 'quote',
    flag: '🇬🇧',
    university: 'University of Nottingham, UK',
    title: 'Sangat Terjangkau Untuk Mahasiswa',
    text: 'Full Bright ini tempat yang paling "pas" buat teman-teman Mahasiswa menaklukkan Tes TOEFL & IELTS',
    name: 'Andi Manggala Putra',
    role: 'Accounting and Finance',
  },
  {
    type: 'quote',
    flag: '🇩🇪',
    university: 'Stuttgart University, Germany',
    title: 'A Good Place to Learn TOEFL & IELTS',
    text: 'Fullbright growing together with their students. This place is good place to learn TOEFL & IELTS. Thank you for the teacher and friendly staff. Now I can see the world',
    name: 'Hajrah',
    role: 'Student Water Resources Engineering and Management',
  },
  {
    type: 'score',
    title: 'Skor Tertinggi — Terkonfirmasi ETS',
    source: 'Score Report resmi ETS — 2/4/2024',
    name: 'Widya Ningrum',
    role: 'TOEFL ITP Online',
    score: 563,
  },
];

// Sisa data untuk infinite carousel
const carouselItems = [
  { name: 'Yohanes K. Susanta', score: 560, source: 'Score Report resmi ETS — 3/8/2024',    label: 'TOEFL ITP Online' },
  { name: 'Kak Rani',           score: 547, source: 'Screenshot WA ke instruktur',            label: 'Capai Target'     },
  { name: 'Yuhana Dharma',      score: 537, source: 'Screenshot WA ke instruktur',            label: 'TOEFL ITP Online' },
  { name: 'Nadia Ayu Tiarasari',score: 513, source: 'TOEFL ITP Online — 6/28/2024',          label: 'LPDP'             },
  { name: 'Siti Martha Uly',    score: 507, source: 'Score Report resmi ETS — 7/11/2024',    label: 'TOEFL ITP Online' },
];

// Testimoni internasional — terkonfirmasi dari website resmi client
const internationalTestimonials = [
  {
    title: 'Sangat Terjangkau Untuk Mahasiswa',
    name: 'Andi Manggala Putra',
    role: 'Accounting and Finance',
    university: 'University of Nottingham, UK',
    flag: '🇬🇧',
    text: 'Full Bright ini tempat yang paling "pas" buat teman-teman Mahasiswa menaklukkan Tes TOEFL & IELTS',
  },
  {
    title: 'A Good Place to Learn TOEFL & IELTS',
    name: 'Hajrah',
    role: 'Student Water Resources Engineering and Management',
    university: 'Stuttgart University, Germany',
    flag: '🇩🇪',
    text: 'Fullbright growing together with their students. This place is good place to learn TOEFL & IELTS. Thank you for the teacher and friendly staff. Now I can see the world',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={13} fill="#F59E0B" color="#F59E0B" />
      ))}
    </div>
  );
}

function avatarBg(index: number) { return index % 2 === 0 ? '#151515' : '#D70808'; }

// ScoreCard — hanya tampilkan skor yang terkonfirmasi
function ScoreCard({ label, name, score, source }: typeof scoreResults[0]) {
  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col gap-4 border border-gray-100 hover:-translate-y-2 hover:border-gray-200 hover:shadow-[0_20px_56px_rgba(0,0,0,0.1)] transition-all duration-300"
      style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
          style={{ backgroundColor: '#FFF0F0', color: '#D70808', border: '1px solid #ffb3b3' }}>
          {label}
        </span>
        <Stars />
      </div>

      {/* Skor tunggal yang terkonfirmasi */}
      <div className="text-center py-2">
        <p className="text-xs mb-1 font-semibold uppercase tracking-widest" style={{ color: '#9ca3af' }}>Skor Diraih</p>
        <p className="text-5xl font-black" style={{ fontFamily: 'var(--font-heading)', color: '#16a34a' }}>{score}</p>
      </div>

      <div className="border-t border-gray-100 pt-3">
        <p className="text-xs font-bold" style={{ color: '#151515' }}>{name}</p>
        <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>{source}</p>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function SocialProofSection() {
  return (
    <div id="testimonials">

      {/* ── 1. Stats bar ── */}
      <div style={{ backgroundColor: '#151515' }} className="py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white mb-8">
            {statsBar.map(s => (
              <div key={s.label}>
                <p className="text-4xl md:text-5xl font-black tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>{s.value}</p>
                <p className="text-xs mt-1.5 opacity-75 font-medium tracking-wide">{s.label}</p>
                {s.micro && <p className="text-[10px] mt-1 opacity-50 italic">{s.micro}</p>}
              </div>
            ))}
          </div>
          <div className="text-center">
            <a href="#pricing"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white transition hover:brightness-110 hover:-translate-y-0.5"
              style={{ backgroundColor: '#D70808', fontFamily: 'var(--font-heading)', boxShadow: '0 4px 20px rgba(215,8,8,0.4)' }}>
              🚀 Daftar Sekarang — Mulai Rp 250.000
            </a>
          </div>
        </div>
      </div>

      {/* ── 2. Score results — data terkonfirmasi ── */}
      <SectionWrapper bg="cultured" className="py-20 md:py-24">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
            style={{ backgroundColor: '#FFF0F0', color: '#D70808', border: '1px solid #ffb3b3' }}>
            🏆 Skor Resmi — Terkonfirmasi dari Score Report ETS
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-5"
            style={{ fontFamily: 'var(--font-heading)', color: '#151515' }}>
            Lihat Sendiri Skor yang{' '}
            <span style={{ color: '#D70808' }}>Berhasil Diraih Alumni</span>
          </h2>
          <p className="text-base max-w-lg mx-auto leading-relaxed" style={{ color: '#3d3d3d' }}>
            Semua skor di bawah ini berasal dari Score Report resmi ETS
            atau screenshot WhatsApp yang dikirimkan langsung oleh alumni ke instruktur kami.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {scoreResults.map(r => <ScoreCard key={r.name} {...r} />)}
        </div>

        <div className="text-center">
          <Button href="#pricing" size="lg">Raih Skorku Sekarang →</Button>
          <SocialProofMicro />
        </div>
      </SectionWrapper>

      {/* ── 3. WA screenshot gallery — 6 konfirmasi ── */}
      <SectionWrapper bg="white" className="py-20 md:py-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
            style={{ backgroundColor: '#FFF0F0', color: '#D70808', border: '1px solid #ffb3b3' }}>
            <MessageCircle size={13} /> Screenshot WA Asli dari Alumni
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4"
            style={{ fontFamily: 'var(--font-heading)', color: '#151515' }}>
            Foto Skor yang Dikirim{' '}
            <span style={{ color: '#D70808' }}>Langsung ke Instruktur</span>
          </h2>
          <p className="text-base max-w-lg mx-auto leading-relaxed" style={{ color: '#3d3d3d' }}>
            Ini screenshot nyata dari WhatsApp alumni — bukan desain, bukan klaim.
            <br />
            Dikirim langsung ke instruktur sebagai bukti skor resmi ETS.
          </p>
        </div>

        {/* 3 terbaik — grid prominent */}
        <div className="grid grid-cols-3 gap-3 mb-6 max-w-3xl mx-auto">
          {waScreenshots.slice(0, 3).map(img => (
            <div key={img.src} className="relative group overflow-hidden"
              style={{ borderRadius: '14px', boxShadow: '0 6px 24px rgba(0,0,0,0.18)', aspectRatio: '9/16' }}>
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="eager" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <div>
                  <p className="text-white font-black text-sm" style={{ fontFamily: 'var(--font-heading)' }}>Skor {img.score}</p>
                  <p className="text-white/80 text-xs">{img.name}</p>
                </div>
              </div>
              <div className="absolute top-2 right-2 w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-black"
                style={{ backgroundColor: '#D70808', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                {img.score}
              </div>
            </div>
          ))}
        </div>

        {/* Infinite scroll — semua 6 screenshot × 4 duplikasi agar tidak ada gap */}
        <div className="overflow-hidden mb-14"
          style={{ maskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)' }}>
          <div className="infinite-track">
            {Array.from({ length: 4 }, () => waScreenshots).flat().map((img, i) => (
              <div key={i} className="shrink-0 mx-2 relative group overflow-hidden"
                style={{ width: '150px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', aspectRatio: '9/16' }}>
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                  <p className="text-white text-xs font-bold">{img.name}</p>
                </div>
                <div className="absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black"
                  style={{ backgroundColor: '#D70808', fontSize: '11px' }}>
                  {img.score}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimoni internasional — side-by-side */}
        <div className="max-w-4xl mx-auto mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-center mb-6" style={{ color: '#9ca3af' }}>
            Testimoni Resmi dari Alumni Internasional
          </p>
          <div className="grid sm:grid-cols-2 gap-5">
            {internationalTestimonials.map((t, i) => (
              <div key={t.name}
                className="rounded-2xl p-7 border border-gray-100 flex flex-col gap-4 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.09)] transition-all duration-300"
                style={{ backgroundColor: '#F9F9F9', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{t.flag}</span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: '#FFF0F0', color: '#D70808' }}>
                    {t.university}
                  </span>
                </div>
                <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#D70808' }}>{t.title}</p>
                <p className="text-sm leading-relaxed flex-1" style={{ color: '#3d3d3d' }}>"{t.text}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-sm shrink-0"
                    style={{ backgroundColor: avatarBg(i), fontFamily: 'var(--font-heading)' }}>
                    {t.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black truncate" style={{ fontFamily: 'var(--font-heading)', color: '#151515' }}>{t.name}</p>
                    <p className="text-xs truncate" style={{ color: '#6b7280' }}>{t.role}</p>
                  </div>
                  <Stars />
                </div>
              </div>
            ))}
          </div>
        </div>

          {/* Skor alumni lainnya — infinite scroll di bawah testimoni */}
          <div className="overflow-hidden mt-10"
            style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}>
            <div className="infinite-track">
              {Array.from({ length: 4 }, () => carouselItems).flat().map((item, i) => (
                <div key={i}
                  className="shrink-0 mx-3 bg-white rounded-2xl px-5 py-4 flex items-center gap-3 border border-gray-100"
                  style={{ width: '240px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-white text-sm shrink-0"
                    style={{ backgroundColor: avatarBg(i), fontFamily: 'var(--font-heading)' }}>
                    {item.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black truncate" style={{ color: '#151515' }}>{item.name}</p>
                    <p className="text-[10px] truncate" style={{ color: '#9ca3af' }}>{item.source}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xl font-black" style={{ fontFamily: 'var(--font-heading)', color: '#16a34a' }}>{item.score}</p>
                    <p className="text-[9px] font-bold uppercase" style={{ color: '#D70808' }}>{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-10">
            <Button href="#pricing" size="lg">Jadilah Alumni Sukses Berikutnya →</Button>
            <SocialProofMicro />
          </div>
        </SectionWrapper>
    </div>
  );
}
