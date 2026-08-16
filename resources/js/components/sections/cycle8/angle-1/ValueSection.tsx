'use client';

import LpButton from '@/components/ui/lp-button';
import SectionWrapper from '@/components/ui/section-wrapper';
import SocialProofMicro from '@/components/ui/social-proof-micro';
import { useAnalytics } from '@/hooks/use-analytics';

const pillars = [
    {
        icon: '🎯',
        borderColor: '#D70808', // Red left border
        iconBg: '#FFF0F0',
        title: 'TOEFL Pattern Recognition Method™',
        desc: 'Belajar pola soal yang paling sering muncul agar target skor untuk submission lebih cepat tercapai, tanpa menghabiskan waktu mempelajari semua materi.',
    },
    {
        icon: '⚡',
        borderColor: '#151515', // Black left border
        iconBg: '#F3F3F3',
        title: 'Shortcut Structure Framework™',
        desc: 'Roadmap belajar disesuaikan dengan target beasiswa dan waktu submission, sehingga kamu fokus pada materi yang paling berdampak untuk mencapai skor.',
    },
    {
        icon: '📈',
        borderColor: '#D70808', // Red left border
        iconBg: '#FFF0F0',
        title: 'Score-Focused Learning System™',
        desc: 'Setiap sesi belajar difokuskan pada target skor yang dibutuhkan untuk submission, sehingga progresmu selalu mengarah ke tujuan yang jelas.',
    },
];

const tableRows = [
    {
        label: 'Biaya tetap terjangkau',
        self: 'yes',
        course: 'no',
        fb: 'yes',
    },
    {
        label: 'Jadwal bisa kamu atur sendiri',
        self: 'yes',
        course: 'no',
        fb: 'yes',
    },
    {
        label: 'Materi tersusun urut, tidak bingung',
        self: 'no',
        course: 'yes',
        fb: 'yes',
    },
    {
        label: 'Materi khusus pola soal TOEFL',
        self: 'no',
        course: 'no',
        fb: 'yes',
    },
    {
        label: 'Ada yang bisa ditanya kalau bingung',
        self: 'no',
        course: 'yes',
        fb: 'yes',
    },
    {
        label: 'Materi bisa diulang kapan pun',
        self: 'yes',
        course: 'no',
        fb: 'yes',
    },
    {
        label: 'Skor naik signifikan dalam 15 hari',
        self: 'no',
        course: 'no',
        fb: 'yes',
    },
];

const CmpIcon = ({ state, isFb = false }: { state: string, isFb?: boolean }) => {
    const isYes = state === 'yes';
    const text = isYes ? '✓' : '✕';
    
    let bgClass = 'bg-[#efefef] text-[#b4b4b4]';
    if (isYes) {
        bgClass = isFb ? 'bg-[#D70808] text-white' : 'bg-[#9ca3af] text-white';
    }

    return (
        <div className={`flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full text-[13px] font-[900] ${bgClass}`}>
            {text}
        </div>
    );
};

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
                        className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[12px] font-[700] uppercase tracking-[0.08em]"
                        style={{
                            fontFamily: 'var(--font-heading)',
                            backgroundColor: '#FFF0F0',
                            color: '#D70808',
                            border: '1px solid #ffb3b3',
                        }}
                    >
                        <span>💡</span> METODE EKSKLUSIF FULL BRIGHT
                    </div>
                    <h2
                        className="mb-5 text-[clamp(24px,3vw,36px)] font-[900] leading-[1.2]"
                        style={{
                            fontFamily: 'var(--font-heading)',
                            color: '#151515',
                        }}
                    >
                        Ini <span style={{ color: '#D70808' }}>Strategi Belajar TOEFL</span> Yang Tepat Untuk Kamu
                    </h2>
                    <p
                        className="mx-auto max-w-[576px] text-[16px] leading-[1.6]"
                        style={{ color: '#3d3d3d' }}
                    >
                        Ini cara Full Bright membantu <strong style={{ color: '#151515' }}>45.000+ orang</strong> mengubah submission yang tadinya ditolak jadi diterima di kampus & perusahaan impian mereka.
                    </p>
                </div>

                {/* Comparison Table - Removed overflow-hidden! */}
                <div className="mx-auto mb-10 max-w-[760px] rounded-[20px] border border-[#ececec] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
                    <div className="w-full">
                        {/* Header - Sticky Header */}
                        <div 
                            className="sticky top-[64px] z-20 rounded-t-[20px] bg-[#F9F9F9] border-b border-[#ececec] md:top-[80px]"
                            style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.85fr 0.85fr 0.9fr', alignItems: 'stretch' }}
                        >
                            <div className="p-[16px] text-[12px] font-[900] uppercase tracking-[0.08em] text-[#6b7280]">
                                Kriteria
                            </div>
                            <div className="p-[16px_8px] text-center text-[13px] font-[800] leading-[1.25] text-[#6b7280]" style={{ fontFamily: 'var(--font-heading)' }}>
                                Belajar Otodidak
                            </div>
                            <div className="p-[16px_8px] text-center text-[13px] font-[800] leading-[1.25] text-[#6b7280]" style={{ fontFamily: 'var(--font-heading)' }}>
                                Kursus Lain
                            </div>
                            <div className="bg-[#D70808] p-[16px_8px] text-center text-[13px] font-[900] leading-[1.25] text-white rounded-tr-[20px]" style={{ fontFamily: 'var(--font-heading)' }}>
                                Full Bright
                            </div>
                        </div>

                        {/* Rows */}
                        <div className="flex flex-col">
                            {tableRows.map((row, i) => (
                                <div
                                    key={i}
                                    className={`border-[#f4f4f4] ${i < tableRows.length - 1 ? 'border-b' : ''}`}
                                    style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.85fr 0.85fr 0.9fr', alignItems: 'center' }}
                                >
                                    <div className={`p-[16px] text-[14px] font-[700] leading-[1.4] text-[#151515] ${i === tableRows.length - 1 ? 'rounded-bl-[20px]' : ''}`}>
                                        {row.label}
                                    </div>
                                    <div className="flex items-center justify-center p-[16px_8px]">
                                        <CmpIcon state={row.self} />
                                    </div>
                                    <div className="flex items-center justify-center p-[16px_8px]">
                                        <CmpIcon state={row.course} />
                                    </div>
                                    {/* Added rounded-br-[20px] on the very last row's right column to prevent corners from bleeding */}
                                    <div className={`flex self-stretch items-center justify-center bg-[#FFF7F7] p-[16px_8px] ${i === tableRows.length - 1 ? 'rounded-br-[20px]' : ''}`}>
                                        <CmpIcon state={row.fb} isFb={true} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Title for Pillars */}
                <div className="mb-6 text-center px-4">
                    <h3
                        className="mx-auto max-w-2xl text-[16px] font-[800] leading-[1.5] sm:text-[18px] md:text-[20px]"
                        style={{ fontFamily: 'var(--font-heading)', color: '#151515' }}
                    >
                        3 Metode Belajar yang Membuat Alumni Full Bright Naik Skor dalam 15 Hari:
                    </h3>
                </div>

                <div className="mx-auto mb-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 max-w-5xl">
                    {pillars.map(
                        ({ icon, iconBg, borderColor, title, desc }) => (
                            <div
                                key={title}
                                className="flex flex-col gap-4 rounded-[16px] border border-[#f3f4f6] bg-white p-[28px] shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
                                style={{ borderLeft: `4px solid ${borderColor}` }}
                            >
                                <div
                                    className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[16px] text-[22px]"
                                    style={{ backgroundColor: iconBg }}
                                >
                                    {icon}
                                </div>
                                <h3
                                    className="m-0 text-[16px] font-[900] leading-[1.3]"
                                    style={{ fontFamily: 'var(--font-heading)', color: '#151515' }}
                                >
                                    {title}
                                </h3>
                                <p className="m-0 text-[14px] leading-[1.7]" style={{ color: '#3d3d3d' }}>
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
                    <div className="mt-5 flex justify-center">
                        <SocialProofMicro />
                    </div>
                </div>
            </SectionWrapper>
        </>
    );
}