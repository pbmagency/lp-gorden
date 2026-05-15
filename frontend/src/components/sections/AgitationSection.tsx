import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Clock, TrendingDown, HelpCircle, BookOpen, Timer } from 'lucide-react';
import SectionWrapper from '../ui/SectionWrapper';
import Button from '../ui/Button';
import SocialProofMicro from '../ui/SocialProofMicro';

const painPoints = [
  {
    Icon: AlertTriangle,
    iconColor: '#D70808',
    iconBg: '#FFF0F0',
    title: 'Takut Gagal Seleksi Beasiswa',
    desc: 'Skor TOEFL di bawah syarat minimum langsung menggugurkan lamaranmu — bahkan sebelum penyeleksi membaca berkasmu.',
  },
  {
    Icon: Clock,
    iconColor: '#151515',
    iconBg: '#F3F3F3',
    title: 'Deadline Fulbright & LPDP Makin Dekat',
    desc: 'Setiap hari tanpa persiapan yang tepat adalah hari yang hilang. Beasiswa tidak menunggu siapa pun.',
  },
  {
    Icon: TrendingDown,
    iconColor: '#D70808',
    iconBg: '#FFF0F0',
    title: 'Skor Stuck — Sudah Belajar Tapi Tidak Naik',
    desc: 'Belajar berbulan-bulan tapi skor stagnan? Kemungkinan besar kamu belajar materi yang salah — bukan pola yang paling sering keluar.',
  },
  {
    Icon: HelpCircle,
    iconColor: '#151515',
    iconBg: '#F3F3F3',
    title: 'Bingung Mulai dari Mana',
    desc: 'Terlalu banyak buku, YouTube, dan aplikasi yang saling bertentangan. Kamu butuh satu sistem yang proven — bukan trial & error.',
  },
  {
    Icon: BookOpen,
    iconColor: '#D70808',
    iconBg: '#FFF0F0',
    title: 'Grammar Lemah & Listening Selalu Ngeblank',
    desc: 'Dua section ini menyumbang mayoritas skor. Tanpa strategi pola yang tepat, kamu buang waktu untuk materi yang jarang keluar.',
  },
  {
    Icon: Timer,
    iconColor: '#151515',
    iconBg: '#F3F3F3',
    title: 'Tidak Punya Waktu Belajar Berbulan-bulan',
    desc: 'Kamu karyawan, dokter, atau mahasiswa yang sibuk. Belajar 3–6 bulan dari nol bukan pilihan yang realistis.',
  },
];

function useStaggerReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setRevealed(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, revealed };
}

export default function AgitationSection() {
  const { ref, revealed } = useStaggerReveal();

  return (
    <SectionWrapper bg="cultured" className="py-20 md:py-24">
      {/* Section header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
          style={{ backgroundColor: '#FFF0F0', color: '#D70808', border: '1px solid #ffb3b3' }}>
          <AlertTriangle size={13} /> Apakah Kamu Mengalami Ini?
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4"
          style={{ fontFamily: 'var(--font-heading)', color: '#151515' }}>
          "Sudah Belajar Keras, Tapi Skor{' '}
          <span style={{ color: '#D70808' }}>Masih Belum Cukup Juga…"</span>
        </h2>

        <p className="text-base max-w-lg mx-auto leading-relaxed" style={{ color: '#3d3d3d' }}>
          Apakah kamu mengalami salah satu dari ini?
        </p>
      </div>

      {/* Pain point cards — staggered reveal on scroll */}
      <div
        ref={ref}
        className={`stagger-wrap grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14${revealed ? ' revealed' : ''}`}
      >
        {painPoints.map(({ Icon, iconColor, iconBg, title, desc }) => (
          <div key={title}
            className="bg-white rounded-2xl p-7 flex flex-col gap-4 border border-gray-100 hover:border-red-100 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.09)] transition-all duration-300 cursor-default"
            style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: iconBg }}>
              <Icon size={20} color={iconColor} strokeWidth={2} />
            </div>
            <h3 className="font-black text-base leading-snug"
              style={{ fontFamily: 'var(--font-heading)', color: '#151515' }}>
              {title}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: '#3d3d3d' }}>{desc}</p>
          </div>
        ))}
      </div>

      {/* Bridge copy + CTA */}
      <div className="max-w-xl mx-auto text-center">
        <p className="text-base font-semibold mb-6 leading-relaxed" style={{ color: '#151515' }}>
          Jika kamu mengangguk pada 3 atau lebih poin di atas —
          kamu butuh <strong style={{ color: '#D70808' }}>solusi yang tepat</strong>,
          bukan belajar lebih keras lagi.
        </p>
        <Button href="#value" size="lg">
          Lihat Solusi Full Bright →
        </Button>
        <SocialProofMicro />
      </div>
    </SectionWrapper>
  );
}
