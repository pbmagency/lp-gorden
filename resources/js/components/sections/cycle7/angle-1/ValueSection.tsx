import { BookOpen, Target, TrendingUp, Zap } from 'lucide-react';
import LpButton from '@/components/ui/lp-button';
import SectionWrapper from '@/components/ui/section-wrapper';
import SocialProofMicro from '@/components/ui/social-proof-micro';
import { useAnalytics } from '@/hooks/use-analytics';

const pillars = [
    {
        Icon: Target,
        iconColor: '#D70808', // Red
        iconBg: '#FFF0F0',
        borderColor: '#D70808', // Red left border
        title: 'TOEFL Pattern Recognition Method™',
        desc: 'Belajar pola soal yang paling sering muncul agar target skor untuk submission lebih cepat tercapai, tanpa menghabiskan waktu mempelajari semua materi.',
    },
    {
        Icon: Zap,
        iconColor: '#F59E0B', // Yellow
        iconBg: '#FEF3C7',
        borderColor: '#151515', // Black left border
        title: 'Shortcut Structure Framework™',
        desc: 'Roadmap belajar disesuaikan dengan target beasiswa dan waktu submission, sehingga kamu fokus pada materi yang paling berdampak untuk mencapai skor.',
    },
    {
        Icon: TrendingUp,
        iconColor: '#D70808', // Red
        iconBg: '#FFF0F0',
        borderColor: '#D70808', // Red left border
        title: 'Score-Focused Learning System™',
        desc: 'Setiap sesi belajar difokuskan pada target skor yang dibutuhkan untuk submission, sehingga progresmu selalu mengarah ke tujuan yang jelas.',
    },
];

export default function ValueSection() {
    const { trackCTA } = useAnalytics();
    return (
        <>
            <div
                style={{
                    lineHeight: 0,
                    marginTop: '-1px',
                    backgroundColor: '#F3F3F3',
                }}
            >
                <svg
                    viewBox="0 0 1440 56"
                    preserveAspectRatio="none"
                    style={{ display: 'block', width: '100%', height: '56px' }}
                >
                    <path
                        d="M0,28 C240,0 480,56 720,28 C960,0 1200,56 1440,28 L1440,0 L0,0 Z"
                        fill="#ffffff"
                    />
                </svg>
            </div>

            <SectionWrapper id="value" bg="white" className="py-20 md:py-28">
                <div className="mb-14 text-center">
                    <div
                        className="mb-5 inline-flex items-center gap-2 rounded-full px-6 py-2 text-[12px] font-[800] uppercase tracking-widest sm:px-4 sm:py-1.5 sm:text-xs sm:font-bold"
                        style={{
                            fontFamily: 'var(--font-heading)',
                            backgroundColor: '#FFF0F0',
                            color: '#D70808',
                            border: '1px solid #ffb3b3',
                        }}
                    >
                        <span>💡</span> METODE EKSKLUSIF FULL BRIGHT
                    </div>
                    {/* 👇 Updated font and sizes to match model on mobile 👇 */}
                    <h2
                        className="mb-4 text-[clamp(28px,3.6vw,42px)] font-black leading-[1.2] sm:text-3xl md:text-4xl md:leading-tight"
                        style={{
                            fontFamily: 'var(--font-heading)',
                            color: '#151515',
                        }}
                    >
                        Ini <span style={{ color: '#D70808' }}>Strategi Belajar TOEFL</span> Yang Tepat Untuk Kamu
                    </h2>
                    <p
                        className="mx-auto max-w-2xl text-[16px] leading-[1.6] sm:text-base sm:leading-relaxed md:text-lg"
                        style={{ fontFamily: 'var(--font-heading)', color: '#666666' }}
                    >
                        <strong>Ini cara Full Bright membantu 45.000+ orang mengubah submission yang tadinya ditolak jadi diterima di kampus & perusahaan impian mereka.</strong>
                    </p>
                </div>

                <div className="mx-auto mb-14 grid max-w-5xl gap-6 sm:grid-cols-2">
                    {/* Cara Lama — kiri */}
                    <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                        <div className="mb-2 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
                                <BookOpen size={20} />
                            </div>
                            <p
                                className="text-[18px] font-[800] text-gray-500 sm:text-base sm:font-bold"
                                style={{ fontFamily: 'var(--font-heading)' }}
                            >
                                Cara Lama ✗
                            </p>
                        </div>
                        <div className="flex flex-col gap-3">
                            {[
                                'Hafal ratusan rumus grammar dari buku tebal', 
                                'Belajar berbulan-bulan tanpa arah yang jelas', 
                                'Skor stuck di tempat meski sudah kerja keras', 
                                'Tidak tahu bagian mana yang paling penting di tes'  
                            ].map((t) => (
                                <div
                                    key={t}
                                    className="flex items-start gap-3 text-[15px] leading-[1.5] text-gray-500 sm:text-base sm:leading-normal"
                                    style={{ fontFamily: 'var(--font-heading)' }}
                                >
                                    <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300" />
                                    {t}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Metode Full Bright — kanan */}
                    <div
                        className="flex flex-col gap-4 rounded-2xl border p-6 shadow-sm sm:p-8"
                        style={{
                            borderColor: '#D70808',
                            backgroundColor: '#FFFAFA',
                        }}
                    >
                        <div className="mb-2 flex items-center gap-3">
                            <div
                                className="flex h-10 w-10 items-center justify-center rounded-xl"
                                style={{ backgroundColor: '#D70808' }}
                            >
                                <Target size={20} color="white" />
                            </div>
                            <p
                                className="text-[18px] font-[800] sm:text-base sm:font-bold"
                                style={{
                                    color: '#D70808',
                                    fontFamily: 'var(--font-heading)',
                                }}
                            >
                                Metode Full Bright ✓
                            </p>
                        </div>
                        <div className="flex flex-col gap-3">
                            {[
                                'Belajar pola soal yang paling sering keluar', 
                                '1 jam per hari sudah cukup, tidak ganggu aktivitas', 
                                'Skor naik signifikan dalam 15 hari', 
                                'Dianalisa dan diuji pada 45.000+ alumni',
                            ].map((t) => (
                                <div
                                    key={t}
                                    className="flex items-start gap-3 text-[15px] leading-[1.5] sm:text-base sm:leading-normal"
                                    style={{ fontFamily: 'var(--font-heading)', color: '#151515' }}
                                >
                                    <div
                                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                                        style={{ backgroundColor: '#D70808' }}
                                    />
                                    {t}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mx-auto mb-10 grid max-w-5xl gap-6 md:grid-cols-3">
                    {pillars.map(
                        ({ Icon, iconColor, iconBg, borderColor, title, desc }) => (
                            <div
                                key={title}
                                className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                                style={{ borderLeft: `4px solid ${borderColor}` }}
                            >
                                <div
                                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                                    style={{ backgroundColor: iconBg }}
                                >
                                    <Icon size={24} color={iconColor} strokeWidth={2.5} />
                                </div>
                                <h3
                                    className="text-[18px] font-[800] leading-snug sm:text-lg sm:font-bold"
                                    style={{ fontFamily: 'var(--font-heading)', color: '#151515' }}
                                >
                                    {title}
                                </h3>
                                <p className="text-[15px] leading-[1.6] text-gray-500 sm:text-sm sm:leading-relaxed" style={{ fontFamily: 'var(--font-heading)'  }}>
                                    {desc}
                                </p>
                            </div>
                        ),
                    )}
                </div>

                <div className="text-center">
                    <div className="flex flex-col justify-center gap-3 sm:flex-row">
                        <LpButton
                            href="#pricing"
                            size="md"
                            className="bg-[#E60000] text-white hover:bg-[#CC0000]"
                            onClick={() => trackCTA('value_primary', 'Gabung Sekarang →', '#pricing')}
                        >
                            Gabung Sekarang →
                        </LpButton>
                        <LpButton
                            href="#testimonials"
                            variant="outline"
                            size="md"
                            className="border-[#E60000] !text-[#151515] bg-white hover:bg-gray-50"
                            onClick={() => trackCTA('value_testimonials', 'Lihat Bukti Alumni →', '#testimonials')}
                        >
                            Lihat Bukti Alumni →
                        </LpButton>
                    </div>
                    <div className="mt-4">
                        <SocialProofMicro />
                    </div>
                </div>
            </SectionWrapper>
        </>
    );
}