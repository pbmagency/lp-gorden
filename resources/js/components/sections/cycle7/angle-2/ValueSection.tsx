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
        iconColor: '#EA580C',
        iconBg: '#FFEDD5',
        title: 'Mengurangi Risiko Gugur di Tahap Seleksi',
        pillLeft: '5-6 Bulan',
        pillLeftColor: '#D70808', // Red
        pillRight: 'lebih awal, bisa dapat LoA duluan',
        desc: 'Sertifikat yang siap lebih dulu bisa dipakai daftar kampus tujuan. Kamu bisa dapat LoA Unconditional dan skip ujian seleksi bakat LPDP.',
    },
    {
        Icon: RefreshCcw,
        iconColor: '#EA580C', // Orange to match image 2
        iconBg: '#FFEDD5', // Orange bg to match image 2
        title: 'Tidak Perlu Panik Kalau Harus Tes Ulang',
        pillLeft: '2-3x',
        pillLeftColor: '#151515', // Black
        pillRight: 'kesempatan retake',
        desc: 'Lolos target dari dalam sekali tes itu cukup susah. Hasil resmi baru keluar 7-14 hari kerja, dan tes ulang harus tunggu beberapa minggu.',
    }
];

export default function ValueSection() {
    const { trackCTA } = useAnalytics();
    
    return (
        <SectionWrapper id="value" bg="white" className="py-[80px] px-6 md:py-28">
            <div className="mx-auto max-w-6xl">
                
                {/* 1. Headline & Subheadline */}
                <div className="mb-14 text-center">
                    <div
                        className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#ffb3b3] bg-[#FFF0F0] px-4 py-1.5 text-[12px] font-[700] uppercase tracking-[0.08em] text-[#D70808]"
                        style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
                    >
                        <span>🎯</span> MINDSETMU BIKIN GAGAL DAPAT BEASISWA
                    </div>
                    <h2
                        className="mb-5 text-[clamp(24px,3vw,36px)] font-[900] text-[#151515] sm:text-3xl sm:font-black md:text-[2.5rem]"
                        style={{ fontFamily: "'Nunito', sans-serif" }}
                    >
                        Mindsetmu Sekarang Menentukan{' '}
                        <span className="text-[#D70808]">
                            Peluang Kamu Diterima Beasiswa
                        </span>
                    </h2>
                    <p className="mx-auto max-w-[576px] text-[16px] leading-[1.6] text-[#3d3d3d] sm:text-base sm:text-[#666666]">
                        TOEFL itu <strong className="font-bold text-[#151515]">bagian tersulit</strong> dari submission. Kamu{' '}
                        <strong className="font-bold text-[#151515]">harus segera amankan skor</strong> agar kamu bisa{' '}
                        <strong className="font-bold text-[#151515]">lolos beasiswa seperti 45.000+ alumni</strong> kami.
                    </p>
                </div>

                {/* 2. Mindset Comparison Cards */}
                <div className="mb-14 grid gap-4 sm:grid-cols-2">
                    {/* Orang Gagal */}
                    <div className="flex flex-col gap-3 rounded-[16px] border-2 border-gray-200 bg-gray-50 p-6">
                        <div className="mb-1 flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-500 text-white">
                                <BookOpen size={16} />
                            </div>
                            <p
                                className="text-[14px] font-[900] text-gray-600 sm:text-[15px] sm:font-black"
                                style={{ fontFamily: "'Nunito', sans-serif" }}
                            >
                                Mindset Orang yang Gagal Beasiswa ✗
                            </p>
                        </div>
                        <div className="flex flex-col gap-3">
                            {[
                                'Menganggap TOEFL tinggal dikebut beberapa hari',
                                'Fokus urus syarat lain dulu, TOEFL belakangan',
                                'Baru serius belajar sendiri pakai metode asal-asalan',
                            ].map((t) => (
                                <div key={t} className="flex items-center gap-2 text-[14px] text-gray-700 sm:text-[15px]">
                                    <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                                    {t}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Orang Lolos */}
                    <div className="flex flex-col gap-3 rounded-[16px] border-2 border-[#D70808] bg-[#FFF0F0] p-6">
                        <div className="mb-1 flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D70808] text-white">
                                <Target size={16} />
                            </div>
                            <p
                                className="text-[14px] font-[900] text-[#D70808] sm:text-[15px] sm:font-black"
                                style={{ fontFamily: "'Nunito', sans-serif" }}
                            >
                                Mindset Orang yang Lolos Beasiswa ✓
                            </p>
                        </div>
                        <div className="flex flex-col gap-3">
                            {[
                                'TOEFL diselesaikan dari jauh hari, bukan dikebut',
                                'Begitu TOEFL beres, syarat tersulit submission sudah selesai',
                                'Belajar dengan metode yang sudah terbukti naikkan skor',
                            ].map((t) => (
                                <div key={t} className="flex items-center gap-2 text-[14px] text-[#151515] sm:text-[15px]">
                                    <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#D70808]" />
                                    {t}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. Three Pillars Header */}
                <div className="mx-auto mb-8 max-w-[640px] text-center">
                    <p
                        className="text-[22px] font-[800] leading-[1.5] text-[#151515] sm:text-[24px] sm:font-extrabold"
                        style={{ fontFamily: "'Nunito', sans-serif" }}
                    >
                        Full Bright menggunakan 3 metode yang terbukti <br className="hidden sm:block" />
                        <span className="text-[#D70808]">menaikkan skor TOEFL hanya dalam 10-25 hari</span>:
                    </p>
                </div>

                {/* 4. Three Pillars Cards */}
                <div className="mb-12 grid gap-4 md:grid-cols-3">
                    {pillars.map(
                        ({ Icon, iconColor, iconBg, borderColor, title, desc }) => (
                            <div
                                key={title}
                                className="flex flex-col gap-4 rounded-[16px] border border-gray-100 bg-white p-[28px] shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
                                style={{ borderLeft: `4px solid ${borderColor}` }}
                            >
                                <div
                                    className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[16px]"
                                    style={{ backgroundColor: iconBg }}
                                >
                                    <Icon size={22} color={iconColor} strokeWidth={2.5} />
                                </div>
                                <h3
                                    className="text-[16px] font-[900] leading-[1.3] text-[#151515] sm:text-[17px] sm:font-black"
                                    style={{ fontFamily: "'Nunito', sans-serif" }}
                                >
                                    {title}
                                </h3>
                                <p className="text-[14px] leading-[1.7] text-[#3d3d3d] sm:text-[15px]">
                                    {desc}
                                </p>
                            </div>
                        ),
                    )}
                </div>


                {/* 5. Preparation Header */}
                <div className="mx-auto mb-10 max-w-[640px] text-center">
                    <p className="mb-2 text-[18px] font-[700] text-gray-400 sm:text-[19px] sm:font-bold">
                        "Yaudah, nanti aja belajarnya. Kan skornya bisa naik cepat, submission masih 5-6 bulan lagi."
                    </p>
                    <p
                        className="text-[20px] font-[800] leading-[1.5] text-[#151515] sm:text-[22px] sm:font-extrabold"
                        style={{ fontFamily: "'Nunito', sans-serif" }}
                    >
                        Justru persiapan TOEFL memang <span className="text-[#D70808]">seharusnya dimulai 5-6 bulan sebelum submission</span> agar:
                    </p>
                </div>

                {/* 6. Preparation Cards */}
                <div className="mx-auto mb-10 grid max-w-5xl gap-4 sm:grid-cols-2">
                    {prepCards.map((card) => (
                        <div
                            key={card.title}
                            className="flex flex-col gap-5 rounded-[24px] border border-gray-100 bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] sm:p-8"
                        >
                            <div className="flex items-start gap-4 sm:items-center">
                                <div
                                    className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[14px]"
                                    style={{ backgroundColor: card.iconBg }}
                                >
                                    <card.Icon size={24} color={card.iconColor} strokeWidth={2.5} />
                                </div>
                                <h3
                                    className="text-[16px] font-[900] leading-[1.3] text-[#151515] sm:text-[18px] sm:font-black"
                                    style={{ fontFamily: "'Nunito', sans-serif" }}
                                >
                                    {card.title}
                                </h3>
                            </div>

                            <div className="inline-flex w-max items-center gap-2.5 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 shadow-sm">
                                <span
                                    className="text-[14px] font-[900] sm:text-[15px]"
                                    style={{ fontFamily: "'Nunito', sans-serif", color: card.pillLeftColor }}
                                >
                                    {card.pillLeft}
                                </span>
                                <div className="h-3.5 w-px bg-gray-300" />
                                <span
                                    className="text-[13px] font-[600] text-gray-500 sm:text-[14px]"
                                    style={{ fontFamily: "'Nunito', sans-serif" }}
                                >
                                    {card.pillRight}
                                </span>
                            </div>

                            <p className="text-[14px] leading-[1.7] text-[#3d3d3d] sm:text-[15px]">
                                {card.desc}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <div className="flex flex-wrap justify-center gap-3">
                        <LpButton
                            href="#pricing"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#D70808] px-7 py-3.5 text-[16px] font-[700] text-white shadow-[0_4px_20px_rgba(215,8,8,0.35)] transition-all hover:bg-[#b30606] sm:text-[17px] sm:font-bold"
                            onClick={() => trackCTA('value_primary', 'Gabung Sekarang →', '#pricing')}
                        >
                            Gabung Sekarang →
                        </LpButton>
                        <LpButton
                            href="#testimonials"
                            variant="outline"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-[#D70808] bg-transparent px-7 py-3.5 text-[16px] font-[700] !text-[#151515] transition-all hover:bg-red-50 sm:text-[17px] sm:font-bold"
                            onClick={() => trackCTA('value_testimonials', 'Lihat Bukti Alumni →', '#testimonials')}
                        >
                            Lihat Bukti Alumni →
                        </LpButton>
                    </div>
                    <SocialProofMicro />
                </div>

            </div>
        </SectionWrapper>
    );
}