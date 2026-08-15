'use client';

import SectionWrapper from '@/components/ui/section-wrapper';
import LpButton from '@/components/ui/lp-button';
import SocialProofMicro from '@/components/ui/social-proof-micro';
import { useAnalytics } from '@/hooks/use-analytics';

const deliverables = [
    {
        title: 'Video Materi Full Skills',
        badge: '60+ VIDEO',
        desc: 'Materi Listening, Structure & Written Expression, dan Reading Comprehension dijelaskan dengan teknik dan trik langsung dari instruktur berpengalaman 10+ tahun.',
        icon: '🎬',
    },
    {
        title: 'Bank Latihan Soal',
        badge: 'RATUSAN SOAL',
        desc: 'Ratusan soal latihan per section yang bisa kamu kerjakan berulang kali. Setiap soal dilengkapi pembahasan agar kamu paham pola dan strateginya.',
        icon: '📝',
    },
    {
        title: 'Simulasi Tes TOEFL ITP Full',
        badge: 'FORMAT TES ASLI',
        desc: 'Simulasi dengan format, durasi, dan tingkat kesulitan mirip tes asli. Tahu posisi skormu sebelum hari H dan tahu persis section mana yang perlu diperkuat.',
        icon: '📊',
    },
    {
        title: 'Akses LMS 24/7',
        badge: 'AKSES 24/7',
        desc: 'Semua materi tersedia di platform Learning Management System. Belajar kapan saja, di mana saja, dari HP atau laptop, dengan progress tracking otomatis.',
        icon: '💻',
    },
    {
        title: 'Kurikulum 15 Hari Terstruktur',
        badge: '15 HARI',
        desc: 'Tidak perlu bingung jadwal belajar. Ikuti saja roadmap harian selama 15 hari, dari nol sampai siap tes.',
        icon: '🗓️',
    },
];

export default function DeliverablesSection() {
    const { trackCTA } = useAnalytics();

    return (
        <SectionWrapper bg="cultured" className="py-20 md:py-24" id="apa-yang-kamu-dapat">
            <div className="mx-auto max-w-4xl px-4 md:px-6">
                {/* Header */}
                <div className="mb-10 text-center">
                    <div
                        className="mb-5 inline-flex items-center gap-2 rounded-full px-5 py-2 text-[12px] font-[800] uppercase tracking-widest sm:py-1.5 sm:text-[13px]"
                        style={{
                            fontFamily: 'var(--font-heading)',
                            backgroundColor: '#FFF0F0',
                            color: '#D70808',
                            border: '1px solid #ffb3b3',
                        }}
                    >
                        <span>🎁</span> APA YANG KAMU DAPAT
                    </div>

                    <h2
                        className="mb-3 text-[clamp(28px,3.6vw,42px)] font-black leading-[1.2] sm:text-3xl md:text-[2.5rem] md:leading-[1.25]"
                        style={{
                            fontFamily: 'var(--font-heading)',
                            color: '#151515',
                        }}
                    >
                        Semua yang Kamu Butuhkan untuk <span style={{ color: '#D70808' }}>Tembus Skor 500+</span>
                    </h2>
                </div>

                {/* Card Container */}
                <div className="mx-auto max-w-[720px] overflow-hidden rounded-[24px] bg-white shadow-[0_4px_28px_rgba(0,0,0,0.06)]">
                    <div className="flex flex-col">
                        {deliverables.map((item, index) => (
                            <div
                                key={index}
                                className={`flex items-start gap-4 p-5 md:px-[24px] md:py-[22px] ${
                                    index < deliverables.length - 1 ? 'border-b border-[#f2f2f2]' : ''
                                }`}
                            >
                                {/* Left Icon (Emoji) */}
                                <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-[#FFF0F0] text-[20px]">
                                    {item.icon}
                                </div>
                                
                                {/* Content */}
                                <div className="min-w-0 flex-1">
                                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                                        <h3
                                            className="m-0 text-[17px] font-black leading-[1.3]"
                                            style={{ fontFamily: 'var(--font-heading)', color: '#151515' }}
                                        >
                                            {item.title}
                                        </h3>
                                        <span className="rounded-full bg-[#F3F4F6] px-[9px] py-[3px] text-[11px] font-[800] uppercase tracking-[0.04em] text-[#6b7280]">
                                            {item.badge}
                                        </span>
                                    </div>
                                    <p
                                        className="m-0 text-[15px] leading-[1.7]"
                                        style={{ color: '#4b4b4b' }}
                                    >
                                        {item.desc}
                                    </p>
                                </div>

                                {/* Right Checkmark (Text Symbol) */}
                                <div className="flex h-[26px] w-[26px] shrink-0 self-center items-center justify-center rounded-full bg-[#D70808] text-[13px] font-[900] text-white">
                                    ✓
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Buttons & Social Proof */}
                <div className="mt-10 text-center">
                    <div className="flex flex-col justify-center gap-3 sm:flex-row">
                        <LpButton
                            href="#pricing"
                            size="md"
                            className="bg-[#E60000] text-white hover:bg-[#CC0000]"
                            onClick={() => trackCTA('deliverables_primary', 'Gabung Sekarang →', '#pricing')}
                        >
                            Gabung Sekarang →
                        </LpButton>
                        <LpButton
                            href="#testimonials"
                            variant="outline"
                            size="md"
                            className="border-[#E60000] !text-[#151515] bg-white hover:bg-gray-50"
                            onClick={() => trackCTA('deliverables_secondary', 'Lihat Bukti Alumni →', '#testimonials')}
                        >
                            Lihat Bukti Alumni →
                        </LpButton>
                    </div>
                    <div className="mt-5 flex justify-center">
                        <SocialProofMicro />
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
}