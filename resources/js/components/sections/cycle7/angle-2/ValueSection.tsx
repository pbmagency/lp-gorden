import { BookOpen, Target, Trophy, RefreshCcw, TrendingUp, Zap } from 'lucide-react';
import LpButton from '@/components/ui/lp-button';
import SectionWrapper from '@/components/ui/section-wrapper';
import { useAnalytics } from '@/hooks/use-analytics';
import SocialProofMicro from '@/components/ui/social-proof-micro';

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

const prepCards = [
    {
        Icon: Trophy,
        title: 'Mengurangi Risiko Gugur di Tahap Seleksi',
        pillLeft: '5-6 Bulan',
        pillLeftColor: '#D70808',
        pillRight: 'lebih awal, bisa dapat LoA duluan',
        desc: 'Sertifikat yang siap lebih dulu bisa dipakai daftar kampus tujuan. Kamu bisa dapat LoA Unconditional dan skip ujian seleksi bakat LPDP.',
    },
    {
        Icon: RefreshCcw,
        title: 'Tidak Perlu Panik Kalau Harus Tes Ulang',
        pillLeft: '2-3x',
        pillLeftColor: '#6B7280',
        pillRight: 'kesempatan retake',
        desc: 'Lolos target dari dalam sekali tes itu cukup susah. Hasil resmi baru keluar 7-14 hari kerja, dan tes ulang harus tunggu beberapa minggu.',
    }
];

export default function ValueSection() {
    const { trackCTA } = useAnalytics();
    
    return (
        <SectionWrapper id="value" bg="white" className="py-20 md:py-28">
            <div className="mx-auto max-w-6xl px-4">
                
                {/* 1. Headline & Subheadline */}
                <div className="mb-14 text-center">
                    <div className="mb-6 inline-flex items-center justify-center rounded-full border border-[#ffb3b3] bg-white px-5 py-2 text-[10px] font-bold uppercase tracking-[0.08em] text-[#D70808] shadow-[0_2px_8px_rgba(0,0,0,0.04)] sm:text-xs">
                        ⚠️ MINDSETMU BIKIN GAGAL DAPAT BEASISWA
                    </div>
                    {/* 👇 Reduced text-3xl to text-2xl and adjusted line height for mobile 👇 */}
                    <h2 className="mb-4 font-['var(--font-heading)'] text-2xl font-black leading-[1.3] text-[#151515] sm:text-3xl md:text-[2.5rem] md:leading-tight">
                        Mindsetmu Sekarang Menentukan <span className="text-[#D70808]">Peluang Kamu Diterima<br className="hidden sm:block" /> Beasiswa</span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-sm leading-relaxed text-[#666666] sm:text-base md:text-[17px]">
                        TOEFL itu bagian tersulit dari submission. Kamu harus segera amankan<br className="hidden sm:block" />
                        skor agar kamu bisa lolos beasiswa seperti <strong>45.000+ alumni</strong> kami
                    </p>
                </div>

                {/* 2. Mindset Comparison Cards */}
                <div className="mx-auto mb-20 grid max-w-5xl gap-6 sm:grid-cols-2">
                    {/* Orang Gagal */}
                    <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-[#F9FAFB] p-6 shadow-sm sm:p-8">
                        <div className="mb-2 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-200 text-gray-600">
                                <BookOpen size={20} />
                            </div>
                            <p className="font-['var(--font-heading)'] text-base font-bold text-[#151515]">
                                Mindset Orang yang Gagal Beasiswa ✗
                            </p>
                        </div>
                        <div className="flex flex-col gap-3">
                            {[
                                'Menganggap TOEFL tinggal dikebut beberapa hari',
                                'Fokus urus syarat lain dulu, TOEFL belakangan',
                                'Baru serius belajar sendiri pakai metode asal-asalan',
                            ].map((t) => (
                                <div key={t} className="flex items-start gap-3 text-sm text-gray-500 sm:text-[15px]">
                                    <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                                    {t}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Orang Lolos */}
                    <div className="flex flex-col gap-4 rounded-2xl border border-[#D70808] bg-[#FFF0F0] p-6 shadow-sm sm:p-8">
                        <div className="mb-2 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D70808] text-white">
                                <Target size={20} />
                            </div>
                            <p className="font-['var(--font-heading)'] text-base font-bold text-[#D70808]">
                                Mindset Orang yang Lolos Beasiswa ✓
                            </p>
                        </div>
                        <div className="flex flex-col gap-3">
                            {[
                                'TOEFL diselesaikan dari jauh hari, bukan dikebut',
                                'Begitu TOEFL beres, syarat tersulit submission sudah selesai',
                                'Belajar dengan metode yang sudah terbukti naikkan skor',
                            ].map((t) => (
                                <div key={t} className="flex items-start gap-3 text-sm font-medium text-[#151515] sm:text-[15px]">
                                    <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D70808]" />
                                    {t}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. Three Pillars Header */}
                <div className="mb-10 text-center">
                    <p className="font-['var(--font-heading)'] text-xl font-bold text-[#151515] sm:text-2xl">
                        Full Bright menggunakan 3 metode yang terbukti <br className="hidden sm:block" />
                        <span className="text-[#D70808]">menaikkan skor TOEFL hanya dalam 10-25 hari:</span>
                    </p>
                </div>

                {/* 4. Three Pillars Cards */}
                <div className="mx-auto mb-20 grid max-w-6xl gap-6 md:grid-cols-3">
                    {pillars.map(
                        ({ Icon, iconColor, iconBg, borderColor, title, desc }) => (
                            <div
                                key={title}
                                className="flex flex-col gap-4 rounded-[20px] border border-gray-100 bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-8"
                                style={{ borderLeft: `4px solid ${borderColor}` }}
                            >
                                <div
                                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
                                    style={{ backgroundColor: iconBg }}
                                >
                                    <Icon size={28} color={iconColor} strokeWidth={2.5} />
                                </div>
                                <h3 className="font-['var(--font-heading)'] text-[17px] font-black leading-snug text-[#151515]">
                                    {title}
                                </h3>
                                <p className="text-[15px] leading-relaxed text-[#666666]">
                                    {desc}
                                </p>
                            </div>
                        ),
                    )}
                </div>


                {/* 5. Preparation Header */}
                <div className="mb-10 text-center">
                    <p className="mx-auto mb-4 max-w-2xl text-[15px] italic text-[#666666]">
                        "Yaudah, nanti aja belajarnya. Kan skornya bisa naik cepat, submission masih 5-6 bulan lagi."
                    </p>
                    <p className="font-['var(--font-heading)'] text-lg font-bold text-[#151515] sm:text-xl">
                        Justru persiapan TOEFL memang <span className="text-[#D70808]">seharusnya dimulai 5-6 bulan<br className="hidden sm:block"/> sebelum submission</span> agar:
                    </p>
                </div>

                {/* 6. Preparation Cards */}
                <div className="mx-auto mb-16 grid max-w-5xl gap-6 sm:grid-cols-2">
                    {prepCards.map((card) => (
                        <div key={card.title} className="flex flex-col gap-5 rounded-[24px] border border-gray-100 bg-[#F9FAFB] p-6 shadow-sm sm:p-8">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gray-100 bg-white text-[#EA580C] shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                                    <card.Icon size={28} strokeWidth={2.5} />
                                </div>
                                <h3 className="font-['var(--font-heading)'] text-[17px] font-black text-[#151515] sm:text-[19px]">
                                    {card.title}
                                </h3>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-bold ${card.pillLeftColor === '#D70808' ? 'border border-[#D70808] bg-white text-[#D70808]' : 'border border-gray-300 bg-white text-gray-600'}`}>
                                    {card.pillLeft}
                                </span>
                                <span className="text-[13px] font-semibold text-gray-500">
                                    {card.pillRight}
                                </span>
                            </div>
                            <p className="text-[15px] leading-relaxed text-[#666666]">
                                {card.desc}
                            </p>
                        </div>
                    ))}
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
                                            className="border-[#E60000] text-[#151515] bg-white hover:bg-gray-50"
                                            onClick={() => trackCTA('value_testimonials', 'Lihat Bukti Alumni →', '#testimonials')}
                                        >
                                            Lihat Bukti Alumni →
                                        </LpButton>
                                    </div>
                                    <div className="mt-4">
                                        <SocialProofMicro />
                                    </div>
                                </div>

            </div>
        </SectionWrapper>
    );
}