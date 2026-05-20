import { useState } from 'react';
import { CheckCircle2, Lock, Shield, Star } from 'lucide-react';
import SectionWrapper from '@/components/ui/section-wrapper';
import LpButton from '@/components/ui/lp-button';
import SocialProofMicro from '@/components/ui/social-proof-micro';
import { useAnalytics, generateEventId } from '@/hooks/use-analytics';

const WA_STARTER   = 'https://wa.me/6281234567890?text=Halo%20Kak%2C%20saya%20ingin%20tanya%20Level%20Starter';
const WA_INTER     = 'https://wa.me/6281234567890?text=Halo%20Kak%2C%20saya%20ingin%20tanya%20Level%20Intermediate';
const WA_BUNDLING  = 'https://wa.me/6281234567890?text=Halo%20Kak%2C%20saya%20ingin%20tanya%20Paket%20Bundling';

const PG_STARTER   = 'https://member.fullbrightindonesia.com/paket-premium-toefl-level-starter-live-zoom-intensif-flash-sale';
const PG_INTER     = 'https://member.fullbrightindonesia.com/paket-premium-toefl-level-intermediate-live-zoom-intensif-flash-sale';
const PG_BUNDLING  = 'https://member.fullbrightindonesia.com/paket-premium-toefl-level-starter-live-zoom-intensif-flash-sale';

const starterFeatures = [
    '10 Hari Live ZOOM + Rekaman (2 Minggu)',
    '30+ Video E-Course Materi',
    'E-Book Structure & Written Expression (150+ Soal)',
    'E-Book Listening + Audio & Reading (190+ Soal)',
    'Grup WA Diskusi & Tanya Jawab (Senin–Jumat)',
    'Placement Test (Pre-Test)',
    'Progress & Post Test: 2 Kali (mengulang 3x gratis)',
    '200+ Latihan Soal via Google Form & ZOOM',
    'Sertifikat TOEFL Prediction (GRATIS)',
    'Webinar Beasiswa S2/S3 via ZOOM Setiap Bulan',
];

const intermediateFeatures = [
    '15 Hari Live ZOOM + Rekaman',
    '60+ Video Materi Pembelajaran',
    'E-Book Structure (500+ Latihan Soal)',
    'E-Book Listening & Reading (100+ Latihan Soal)',
    'Placement Test / Pre-Test',
    'Post Test (Full Test), bisa mengulang 3x gratis',
    '20 Link Latihan Soal Google Form',
    '20+ Link Soal Tambahan di LIVE ZOOM',
    'Grup WA Diskusi',
    'Webinar Beasiswa Luar Negeri',
    'Bonus: Sertifikat TOEFL Prediction',
];

const bundlingFeatures = [
    'Semua fasilitas Level Starter (10 Hari)',
    'Semua fasilitas Level Intermediate (15 Hari)',
    '25 Hari Total Live ZOOM + Rekaman',
    '90+ Video E-Course Materi Lengkap',
    'E-Book Structure, Listening & Reading Komplit',
    'Grup WA Diskusi & Tanya Jawab (Senin–Jumat)',
    'Placement Test + Post Test, mengulang 3x gratis',
    '200+ Latihan Soal via Google Form & ZOOM',
    'Webinar Beasiswa Luar Negeri',
    'Sertifikat TOEFL Prediction (GRATIS)',
];

const guarantees = [
    { Icon: Shield, title: 'Garansi Mengulang 1 Bulan',        desc: 'Jika skor kamu belum mencapai target setelah mengikuti program secara penuh dan konsisten, kamu boleh mengulang kelas di batch berikutnya secara GRATIS.' },
    { Icon: Shield, title: 'Post Test Bisa Diulang 3× Gratis', desc: 'Belum puas dengan hasil Post Test? Kamu bisa mengulang ujian akhir hingga 3 kali secara gratis untuk memaksimalkan skor.' },
];

function StarRow() {
    return <span className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={11} fill="#F59E0B" color="#F59E0B" />)}</span>;
}

function WhatsAppIcon({ size = 18, color = '#25D366' }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.553 4.103 1.522 5.833L0 24l6.302-1.499A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.887 0-3.656-.494-5.192-1.358l-.373-.213-3.741.89.934-3.629-.243-.384A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
        </svg>
    );
}

function PayButton({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
    return (
        <div className="flex flex-col gap-1.5">
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClick}
                className="cursor-pointer inline-flex w-full items-center justify-center gap-2 font-black rounded-2xl px-5 py-4 text-sm sm:text-base text-white transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(215,8,8,0.5)] active:translate-y-0 active:shadow-none"
                style={{ backgroundColor: '#D70808', boxShadow: '0 6px 24px rgba(215,8,8,0.4)' }}
            >
                {label}
            </a>
            <p className="flex items-center justify-center gap-1 text-xs text-center" style={{ color: '#9ca3af' }}>
                <Lock size={10} strokeWidth={2.5} /> Pembayaran aman & terenkripsi
            </p>
        </div>
    );
}

function OrDivider() {
    return (
        <div className="flex items-center gap-3 my-3">
            <div className="flex-1 h-px" style={{ backgroundColor: '#e5e7eb' }} />
            <span className="text-xs font-semibold" style={{ color: '#9ca3af' }}>atau</span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#e5e7eb' }} />
        </div>
    );
}

function WaButton({ onClick, label }: { onClick: () => void; label: string }) {
    return (
        <button
            onClick={onClick}
            className="cursor-pointer inline-flex w-full items-center justify-center gap-2 font-bold rounded-2xl px-5 py-3 text-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            style={{ backgroundColor: 'transparent', border: '1.5px solid #25D366', color: '#16a34a' }}
        >
            <WhatsAppIcon size={15} color="#25D366" /> {label}
        </button>
    );
}


export default function PricingSection() {
    const { trackCTA, trackConversion } = useAnalytics();

    const handlePayClick = (level: 'Starter' | 'Intermediate' | 'Bundling', pgUrl: string) => {
        const eventId = generateEventId();
        const price   = level === 'Starter' ? 250000 : level === 'Intermediate' ? 350000 : 375000;
        try {
            (window as { fbq?: (e: string, n: string, p?: object, o?: object) => void }).fbq?.(
                'track', 'AddToCart',
                { content_name: `TOEFL Full Bright ${level}`, value: price, currency: 'IDR' },
                { eventID: eventId },
            );
        } catch { /* fbq not loaded */ }
        trackCTA(`pay_${level.toLowerCase()}`, `Bayar ${level}`, pgUrl, 'AddToCart', eventId, { level });
        trackConversion('checkout_redirect', { package: level, price });
    };

    const handleWaClick = (level: 'Starter' | 'Intermediate' | 'Bundling', waUrl: string) => {
        const eventId = generateEventId();
        const price   = level === 'Starter' ? 250000 : level === 'Intermediate' ? 350000 : 375000;
        try {
            (window as { fbq?: (e: string, n: string, p?: object, o?: object) => void }).fbq?.(
                'track', 'AddToCart',
                { content_name: `TOEFL Full Bright ${level}`, value: price, currency: 'IDR' },
                { eventID: eventId },
            );
        } catch { /* fbq not loaded */ }
        trackCTA(`pricing_${level.toLowerCase()}`, `Daftar ${level}`, waUrl, 'AddToCart', eventId, { level });
        trackConversion('wa_inquiry', { package: level, price });
        window.open(waUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <>
            <SectionWrapper id="pricing" bg="white" className="pt-20 md:pt-28 pb-12 md:pb-16">

                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5" style={{ backgroundColor: '#FFF0F0', color: '#D70808', border: '1px solid #ffb3b3' }}>
                        💰 Pilih Paketmu · Flash Sale
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-5" style={{ fontFamily: 'var(--font-heading)', color: '#151515' }}>
                        Investasi Terbaik untuk <span style={{ color: '#D70808' }}>Masa Depanmu</span>
                    </h2>
                    <p className="text-base max-w-lg mx-auto leading-relaxed" style={{ color: '#3d3d3d' }}>
                        Mulai belajar sekarang.<br />Pilih paket sesuai kebutuhan.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-14">

                    {/* ── Starter ── */}
                    <div className="rounded-3xl p-7 border-2 border-gray-200 flex flex-col hover:border-gray-300 hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)] transition-all duration-300" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
                        <div className="flex items-start justify-between mb-1">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#9ca3af' }}>Paket</p>
                                <h3 className="text-2xl font-black" style={{ fontFamily: 'var(--font-heading)', color: '#151515' }}>Starter</h3>
                            </div>
                            <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: '#F0FDF4', color: '#16a34a' }}>
                                <StarRow /> <span className="ml-1">5.0</span>
                            </span>
                        </div>
                        <p className="text-xs font-semibold mb-4" style={{ color: '#9ca3af' }}>
                            Target Skor: <span className="font-black" style={{ color: '#16a34a' }}>450+</span>{' · '}
                            <span className="font-black" style={{ color: '#151515' }}>10 Hari (2 Minggu)</span>
                        </p>
                        <div className="rounded-2xl p-4 mb-5" style={{ backgroundColor: '#FFF0F0', border: '1.5px solid #ffb3b3' }}>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm line-through font-semibold" style={{ color: '#9ca3af' }}>Rp 1.000.000</span>
                                <span className="text-xs font-black px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: '#D70808' }}>HEMAT 75%</span>
                            </div>
                            <p className="text-3xl font-black" style={{ fontFamily: 'var(--font-heading)', color: '#D70808' }}>Rp 250.000</p>
                        </div>
                        <ul className="flex flex-col gap-2 mb-5 flex-1">
                            {starterFeatures.map((f) => (
                                <li key={f} className="flex items-start gap-2 text-sm" style={{ color: '#3d3d3d' }}>
                                    <CheckCircle2 size={14} className="shrink-0 mt-0.5" color="#16a34a" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                        <PayButton href={PG_STARTER} label="Bayar Sekarang →" onClick={() => handlePayClick('Starter', PG_STARTER)} />
                        <OrDivider />
                        <WaButton onClick={() => handleWaClick('Starter', WA_STARTER)} label="Tanya via WhatsApp" />
                        <SocialProofMicro variant="badges" />
                    </div>

                    {/* ── Bundling ── HIGHLIGHTED */}
                    <div className="rounded-3xl p-7 flex flex-col relative overflow-hidden" style={{ border: '2px solid #D70808', boxShadow: '0 16px 56px rgba(215,8,8,0.22), 0 0 0 1px rgba(215,8,8,0.08)', background: 'linear-gradient(165deg, #ffffff 0%, #fff9f9 100%)' }}>
                        <div className="absolute top-0 right-0 text-xs font-black px-4 py-2 rounded-bl-2xl text-white" style={{ backgroundColor: '#D70808', fontFamily: 'var(--font-heading)' }}>
                            ⭐ PALING HEMAT
                        </div>
                        <div className="flex items-start justify-between mb-1 mt-5">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#D70808' }}>Paket</p>
                                <h3 className="text-2xl font-black" style={{ fontFamily: 'var(--font-heading)', color: '#151515' }}>Bundling</h3>
                                <p className="text-xs font-semibold mt-0.5" style={{ color: '#D70808' }}>Starter + Intermediate</p>
                            </div>
                            <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: '#FFF0F0', color: '#D70808' }}>
                                <StarRow /> <span className="ml-1">5.0</span>
                            </span>
                        </div>
                        <p className="text-xs font-semibold mb-4" style={{ color: '#9ca3af' }}>
                            Target Skor: <span className="font-black" style={{ color: '#D70808' }}>500+</span>{' · '}
                            <span className="font-black" style={{ color: '#151515' }}>25 Hari Total</span>
                        </p>
                        <div className="rounded-2xl p-4 mb-5" style={{ backgroundColor: '#FFF0F0', border: '1.5px solid #ffb3b3' }}>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm line-through font-semibold" style={{ color: '#9ca3af' }}>Rp 1.875.000</span>
                                <span className="text-xs font-black px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: '#D70808' }}>DISKON 80%</span>
                            </div>
                            <p className="text-3xl font-black mb-1" style={{ fontFamily: 'var(--font-heading)', color: '#D70808' }}>Rp 375.000</p>
                            <p className="text-xs font-semibold" style={{ color: '#D70808' }}>Hemat Rp 1.500.000 dari harga normal!</p>
                        </div>
                        <ul className="flex flex-col gap-2 mb-5 flex-1">
                            {bundlingFeatures.map((f) => (
                                <li key={f} className="flex items-start gap-2 text-sm" style={{ color: '#3d3d3d' }}>
                                    <CheckCircle2 size={14} className="shrink-0 mt-0.5" color="#D70808" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                        <PayButton href={PG_BUNDLING} label="Bayar Sekarang →" onClick={() => handlePayClick('Bundling', PG_BUNDLING)} />
                        <p className="text-xs text-center -mt-1" style={{ color: '#D70808', fontWeight: 600 }}>* Centang opsi Bundle saat checkout</p>
                        <OrDivider />
                        <WaButton onClick={() => handleWaClick('Bundling', WA_BUNDLING)} label="Tanya via WhatsApp" />
                        <SocialProofMicro variant="badges" />
                    </div>

                    {/* ── Intermediate ── */}
                    <div className="rounded-3xl p-7 border-2 border-gray-200 flex flex-col hover:border-gray-300 hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)] transition-all duration-300" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
                        <div className="flex items-start justify-between mb-1">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#9ca3af' }}>Paket</p>
                                <h3 className="text-2xl font-black" style={{ fontFamily: 'var(--font-heading)', color: '#151515' }}>Intermediate</h3>
                            </div>
                            <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: '#F0FDF4', color: '#16a34a' }}>
                                <StarRow /> <span className="ml-1">5.0</span>
                            </span>
                        </div>
                        <p className="text-xs font-semibold mb-4" style={{ color: '#9ca3af' }}>
                            Target Skor: <span className="font-black" style={{ color: '#16a34a' }}>500+</span>{' · '}
                            <span className="font-black" style={{ color: '#151515' }}>15 Hari</span>{' · Min. 430'}
                        </p>
                        <div className="rounded-2xl p-4 mb-5" style={{ backgroundColor: '#FFF0F0', border: '1.5px solid #ffb3b3' }}>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm line-through font-semibold" style={{ color: '#9ca3af' }}>Rp 1.400.000</span>
                                <span className="text-xs font-black px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: '#D70808' }}>DISKON 75%</span>
                            </div>
                            <p className="text-3xl font-black" style={{ fontFamily: 'var(--font-heading)', color: '#D70808' }}>Rp 350.000</p>
                        </div>
                        <ul className="flex flex-col gap-2 mb-5 flex-1">
                            {intermediateFeatures.map((f) => (
                                <li key={f} className="flex items-start gap-2 text-sm" style={{ color: '#3d3d3d' }}>
                                    <CheckCircle2 size={14} className="shrink-0 mt-0.5" color="#16a34a" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                        <PayButton href={PG_INTER} label="Bayar Sekarang →" onClick={() => handlePayClick('Intermediate', PG_INTER)} />
                        <OrDivider />
                        <WaButton onClick={() => handleWaClick('Intermediate', WA_INTER)} label="Tanya via WhatsApp" />
                        <SocialProofMicro variant="badges" />
                    </div>

                </div>

                {/* Legalitas */}
                <div className="flex justify-center mb-8">
                    <div className="inline-flex flex-wrap items-center justify-start gap-3 rounded-2xl px-6 py-3" style={{ backgroundColor: '#F3F3F3', border: '1px solid #e5e7eb' }}>
                        <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#9ca3af' }}>Legalitas Resmi:</span>
                        <span className="text-xs font-semibold" style={{ color: '#151515' }}>✓ ITP & IIEF Jakarta</span>
                        <span className="text-xs" style={{ color: '#d1d5db' }}>·</span>
                        <span className="text-xs font-semibold" style={{ color: '#151515' }}>✓ SK Kemenkumham AHU-0055720-AH.01.14 Tahun 2020</span>
                    </div>
                </div>

                {/* Guarantee badges */}
                <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto mb-6">
                    {guarantees.map(({ Icon, title, desc }) => (
                        <div key={title} className="flex items-start gap-4 rounded-2xl p-6" style={{ backgroundColor: '#F3F3F3' }}>
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#FFF0F0' }}>
                                <Icon size={22} color="#D70808" />
                            </div>
                            <div>
                                <p className="font-black text-sm mb-2" style={{ fontFamily: 'var(--font-heading)', color: '#151515' }}>{title}</p>
                                <p className="text-xs leading-relaxed" style={{ color: '#3d3d3d' }}>{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </SectionWrapper>
        </>
    );
}
