import { useEffect, useState } from 'react';
import { CheckCircle2, Shield, Star } from 'lucide-react';

declare function fbq(event: string, name: string, params?: Record<string, unknown>): void;

function trackAddToCart(level: 'Starter' | 'Intermediate') {
  try {
    fbq('track', 'AddToCart', {
      content_name: `TOEFL Level ${level}`,
      content_category: 'TOEFL Course',
      value: level === 'Starter' ? 250000 : 350000,
      currency: 'IDR',
    });
  } catch {
    // fbq not loaded yet — ignore silently
  }
}
import SectionWrapper from '../ui/SectionWrapper';
import Button from '../ui/Button';
import SocialProofMicro from '../ui/SocialProofMicro';

// ─── Data (semua dari data asli client) ───────────────────────────────────────

const starterFeatures = [
  { text: '10 Hari Live ZOOM + Rekaman (2 Minggu)',         value: null },
  { text: '30+ Video E-Course Materi',                      value: 'Rp199.000' },
  { text: 'E-Book Structure & Written Expression (150+ Soal)',value: 'Rp99.000' },
  { text: 'E-Book Listening + Audio & Reading (190+ Soal)', value: 'Rp99.000' },
  { text: 'Grup WA Diskusi & Tanya Jawab (Senin–Jumat)',    value: 'Rp99.000' },
  { text: 'Placement Test (Pre-Test)',                       value: 'Rp50.000' },
  { text: 'Progress & Post Test — 2 Kali (mengulang 3× gratis)', value: 'Rp199.000' },
  { text: '100+ Latihan Soal via Google Form',              value: 'Rp149.000' },
  { text: '100+ Latihan Soal di Kelas ZOOM',                value: 'Rp149.000' },
  { text: 'Sertifikat TOEFL Prediction (GRATIS)',           value: 'Rp150.000' },
  { text: 'Webinar Beasiswa S2/S3 via ZOOM Setiap Bulan',   value: 'Priceless' },
  { text: 'Konsultasi Kampus Luar Negeri, LoA & Visa via IDP', value: 'Priceless' },
];

const intermediateFeatures = [
  { text: '15 Hari Live ZOOM + Rekaman',                    value: null },
  { text: '60+ Video Materi Pembelajaran',                  value: null },
  { text: 'E-Book Structure (500+ Latihan Soal)',           value: null },
  { text: 'E-Book Listening & Reading (100+ Latihan Soal)', value: null },
  { text: 'Placement Test / Pre-Test',                      value: null },
  { text: 'Post Test (Full Test) — bisa mengulang 3× gratis', value: null },
  { text: '20 Link Latihan Soal Google Form',               value: null },
  { text: '20+ Link Soal Tambahan di LIVE ZOOM',            value: null },
  { text: 'Grup WA Diskusi',                                value: null },
  { text: 'Webinar Beasiswa Luar Negeri',                   value: null },
  { text: 'Konsultasi Kampus Luar Negeri, LoA & Visa via IDP', value: null },
  { text: 'Bonus: Sertifikat TOEFL Prediction',             value: null },
];

const guarantees = [
  {
    Icon: Shield,
    title: 'Garansi Kualitas 100% Uang Kembali',
    desc: 'Jika ada bonus atau fasilitas yang kami janjikan belum kamu dapatkan, kami kembalikan uangmu 100% penuh — tanpa pertanyaan, tanpa potongan.',
  },
  {
    Icon: Shield,
    title: 'Garansi Mengulang 1 Bulan',
    desc: 'Jika skor kamu belum mencapai target setelah mengikuti program secara penuh dan konsisten, kamu boleh mengulang kelas di batch berikutnya secara GRATIS.',
  },
  {
    Icon: Shield,
    title: 'Post Test Bisa Diulang 3× Gratis',
    desc: 'Belum puas dengan hasil Post Test? Kamu bisa mengulang ujian akhir hingga 3 kali secara gratis untuk memaksimalkan skor.',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StarRow() {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={11} fill="#F59E0B" color="#F59E0B" />
      ))}
    </span>
  );
}

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.553 4.103 1.522 5.833L0 24l6.302-1.499A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.887 0-3.656-.494-5.192-1.358l-.373-.213-3.741.89.934-3.629-.243-.384A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
  );
}

/* Sticky mobile CTA */
function StickyCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => setShow(entry.isIntersecting),
      { threshold: 0.05 }
    );
    const el = document.getElementById('pricing');
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
      style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(8px)', boxShadow: '0 -4px 24px rgba(0,0,0,0.12)', borderTop: '1px solid #e5e7eb' }}>
      <div className="px-4 py-3">
        <Button href="#pricing" size="md" fullWidth>
          Daftar Sekarang — Rp 250.000
        </Button>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function PricingSection() {
  return (
    <>
      <StickyCTA />
      <SectionWrapper id="pricing" bg="white" className="py-20 md:py-28">

        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
            style={{ backgroundColor: '#FFF0F0', color: '#D70808', border: '1px solid #ffb3b3' }}>
            💰 Pilih Paketmu — Flash Sale
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-5"
            style={{ fontFamily: 'var(--font-heading)', color: '#151515' }}>
            Investasi Terjangkau,{' '}
            <span style={{ color: '#D70808' }}>Fasilitas Paling Lengkap</span>
          </h2>
          <p className="text-base max-w-lg mx-auto leading-relaxed" style={{ color: '#3d3d3d' }}>
            Keduanya dilengkapi garansi penuh.
            <br />
            Risiko nol — hasil maksimal.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 gap-7 max-w-4xl mx-auto mb-14">

          {/* ── Starter ── */}
          <div className="rounded-3xl p-9 border-2 border-gray-200 flex flex-col hover:border-gray-300 hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)] transition-all duration-300"
            style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>

            <div className="flex items-start justify-between mb-1">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#9ca3af' }}>Paket</p>
                <h3 className="text-2xl font-black" style={{ fontFamily: 'var(--font-heading)', color: '#151515' }}>Starter</h3>
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ backgroundColor: '#F0FDF4', color: '#16a34a' }}>
                <StarRow /> <span className="ml-1">4.9</span>
              </span>
            </div>

            <p className="text-xs font-semibold mb-4" style={{ color: '#9ca3af' }}>
              Target Skor: <span className="font-black" style={{ color: '#16a34a' }}>450+</span>
              {' · '}
              <span className="font-black" style={{ color: '#151515' }}>10 Hari (2 Minggu)</span>
            </p>

            {/* Price block */}
            <div className="rounded-2xl p-5 mb-6" style={{ backgroundColor: '#FFF0F0', border: '1.5px solid #ffb3b3' }}>
              {/* Normal price coret */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm line-through font-semibold" style={{ color: '#9ca3af' }}>Rp 1.000.000</span>
                <span className="text-xs font-black px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: '#D70808' }}>
                  HEMAT Rp 750.000
                </span>
              </div>
              {/* Flash sale price */}
              <p className="text-3xl font-black mb-1" style={{ fontFamily: 'var(--font-heading)', color: '#D70808' }}>
                Rp 250.000
              </p>
              <p className="text-xs font-semibold" style={{ color: '#D70808' }}>
                Kamu hanya bayar Rp 250.000 · Flash Sale!
              </p>
              {/* Total bonus value */}
              <div className="mt-3 pt-3 border-t border-red-200">
                <p className="text-xs" style={{ color: '#3d3d3d' }}>
                  + Fasilitas bonus senilai{' '}
                  <span className="font-black" style={{ color: '#151515' }}>Rp 1.243.000</span> (GRATIS)
                </p>
              </div>
            </div>

            <p className="text-sm mb-5 leading-relaxed" style={{ color: '#3d3d3d' }}>
              Untuk pemula atau yang skor placement test-nya masih di bawah 400. Fokus soal langsung dari hari pertama.
            </p>

            {/* Feature list with individual values */}
            <ul className="flex flex-col gap-2.5 mb-8 flex-1">
              {starterFeatures.map(f => (
                <li key={f.text} className="flex items-start justify-between gap-3 text-sm">
                  <div className="flex items-start gap-2.5 flex-1">
                    <CheckCircle2 size={15} className="shrink-0 mt-0.5" color="#16a34a" />
                    <span style={{ color: '#3d3d3d' }}>{f.text}</span>
                  </div>
                  {f.value && (
                    <span className="text-xs font-bold shrink-0 line-through" style={{ color: '#d1d5db' }}>
                      {f.value}
                    </span>
                  )}
                </li>
              ))}
            </ul>

            <Button
              href="https://wa.me/6281234567890?text=Halo%20Kak%2C%20saya%20ingin%20daftar%20Level%20Starter"
              variant="whatsapp" size="lg" fullWidth
              onClick={() => trackAddToCart('Starter')}>
              <WhatsAppIcon /> Daftar Level Starter
            </Button>
            <SocialProofMicro />
          </div>

          {/* ── Intermediate ── */}
          <div className="rounded-3xl p-9 flex flex-col relative overflow-hidden"
            style={{
              border: '2px solid #D70808',
              boxShadow: '0 16px 56px rgba(215,8,8,0.22), 0 0 0 1px rgba(215,8,8,0.08)',
              background: 'linear-gradient(165deg, #ffffff 0%, #fff9f9 100%)',
            }}>
            <div className="absolute top-0 right-0 text-xs font-black px-5 py-2.5 rounded-bl-2xl text-white"
              style={{ backgroundColor: '#D70808', fontFamily: 'var(--font-heading)' }}>
              ⭐ PALING POPULER
            </div>

            <div className="flex items-start justify-between mb-1 mt-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#D70808' }}>Paket</p>
                <h3 className="text-2xl font-black" style={{ fontFamily: 'var(--font-heading)', color: '#151515' }}>Intermediate</h3>
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ backgroundColor: '#FFF0F0', color: '#D70808' }}>
                <StarRow /> <span className="ml-1">5.0</span>
              </span>
            </div>

            <p className="text-xs font-semibold mb-4" style={{ color: '#9ca3af' }}>
              Target Skor: <span className="font-black" style={{ color: '#D70808' }}>500+</span>
              {' · '}
              <span className="font-black" style={{ color: '#151515' }}>15 Hari</span>
              {' · Min. Placement Test 430'}
            </p>

            {/* Price block */}
            <div className="rounded-2xl p-5 mb-6" style={{ backgroundColor: '#FFF0F0', border: '1.5px solid #ffb3b3' }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm line-through font-semibold" style={{ color: '#9ca3af' }}>Rp 1.400.000</span>
                <span className="text-xs font-black px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: '#D70808' }}>
                  DISKON 75%
                </span>
              </div>
              <p className="text-3xl font-black mb-1" style={{ fontFamily: 'var(--font-heading)', color: '#D70808' }}>
                Rp 350.000
              </p>
              <p className="text-xs font-semibold" style={{ color: '#D70808' }}>
                Kamu hanya bayar Rp 350.000 · Flash Sale!
              </p>
            </div>

            <p className="text-sm mb-5 leading-relaxed" style={{ color: '#3d3d3d' }}>
              Kelas lanjutan untuk yang serius mengejar LPDP, Fulbright, AAS, CPNS, BUMN (PLN, Telkom), atau PPDS.
            </p>

            <ul className="flex flex-col gap-2.5 mb-8 flex-1">
              {intermediateFeatures.map(f => (
                <li key={f.text} className="flex items-start gap-2.5 text-sm" style={{ color: '#3d3d3d' }}>
                  <CheckCircle2 size={15} className="shrink-0 mt-0.5" color="#D70808" />
                  {f.text}
                </li>
              ))}
            </ul>

            <Button
              href="https://wa.me/6281234567890?text=Halo%20Kak%2C%20saya%20ingin%20daftar%20Level%20Intermediate"
              variant="whatsapp" size="lg" fullWidth
              onClick={() => trackAddToCart('Intermediate')}>
              <WhatsAppIcon /> Daftar Level Intermediate
            </Button>
            <SocialProofMicro />
          </div>
        </div>

        {/* Legalitas badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex flex-wrap items-center justify-center gap-3 rounded-2xl px-6 py-3"
            style={{ backgroundColor: '#F3F3F3', border: '1px solid #e5e7eb' }}>
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#9ca3af' }}>Legalitas Resmi:</span>
            <span className="text-xs font-semibold" style={{ color: '#151515' }}>✓ ITP & IIEF Jakarta</span>
            <span className="text-xs" style={{ color: '#d1d5db' }}>·</span>
            <span className="text-xs font-semibold" style={{ color: '#151515' }}>✓ SK Kemenkumham AHU-0055720-AH.01.14 Tahun 2020</span>
          </div>
        </div>

        {/* Guarantee badges */}
        <div className="grid sm:grid-cols-3 gap-5 max-w-3xl mx-auto mb-12">
          {guarantees.map(({ Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4 rounded-2xl p-6"
              style={{ backgroundColor: '#F3F3F3' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: '#FFF0F0' }}>
                <Icon size={22} color="#D70808" />
              </div>
              <div>
                <p className="font-black text-sm mb-2" style={{ fontFamily: 'var(--font-heading)', color: '#151515' }}>{title}</p>
                <p className="text-xs leading-relaxed" style={{ color: '#3d3d3d' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Sertifikat use cases */}
        <div className="max-w-3xl mx-auto mb-12 rounded-2xl p-6" style={{ backgroundColor: '#F9F9F9', border: '1px solid #e5e7eb' }}>
          <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#151515' }}>
            Sertifikat Full Bright digunakan untuk:
          </p>
          <div className="flex flex-wrap gap-2">
            {['Daftar Kuliah S1/S2/S3', 'Lamar Kerja', 'Seleksi CPNS', 'Rekrutmen BUMN', 'Ujian Skripsi', 'Kenaikan Pangkat', 'Beasiswa Luar Negeri', 'PPDS'].map(u => (
              <span key={u} className="text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ backgroundColor: '#FFF0F0', color: '#D70808', border: '1px solid #ffb3b3' }}>
                ✓ {u}
              </span>
            ))}
          </div>
        </div>

        {/* CS Team block */}
        <div className="max-w-3xl mx-auto mb-12 rounded-2xl p-7 text-center"
          style={{ backgroundColor: '#F9F9F9', border: '1px solid #e5e7eb' }}>
          <p className="text-xs font-black uppercase tracking-widest mb-5" style={{ color: '#9ca3af' }}>
            Tim Konsultan Kami Siap Membantu
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-5">
            {[
              { name: 'Ms. Fini',   role: 'Konsultan Pendaftaran' },
              { name: 'Ms. Aini',   role: 'Konsultan Beasiswa' },
              { name: 'Ms. Iyud',   role: 'Konsultan TOEFL' },
              { name: 'Mr. Choiri', role: 'Konsultan Akademik' },
              { name: 'Ms. Adry',   role: 'Konsultan Karir' },
            ].map((cs, i) => (
              <div key={cs.name} className="flex flex-col items-center gap-1.5">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center font-black text-white text-sm"
                  style={{ backgroundColor: i % 2 === 0 ? '#D70808' : '#151515', fontFamily: 'var(--font-heading)' }}>
                  {cs.name.split(' ').pop()![0]}
                </div>
                <p className="text-xs font-black" style={{ color: '#151515' }}>{cs.name}</p>
                <p className="text-[10px]" style={{ color: '#9ca3af' }}>{cs.role}</p>
              </div>
            ))}
          </div>
          <p className="text-xs mb-4" style={{ color: '#3d3d3d' }}>
            Respons dalam hitungan menit · Senin–Sabtu 08.00–21.00
          </p>
          <Button href="https://wa.me/6281234567890" variant="whatsapp" size="lg">
            <WhatsAppIcon /> Konsultasi Gratis via WhatsApp
          </Button>
          <SocialProofMicro />
        </div>

        {/* Final CTA */}
        <div className="text-center max-w-md mx-auto">
          <p className="text-sm font-semibold mb-3" style={{ color: '#3d3d3d' }}>
            Atau langsung pilih paket dan daftar sekarang.
          </p>
          <Button href="#pricing" size="lg">
            Lihat Paket Lagi →
          </Button>
        </div>
      </SectionWrapper>
    </>
  );
}
