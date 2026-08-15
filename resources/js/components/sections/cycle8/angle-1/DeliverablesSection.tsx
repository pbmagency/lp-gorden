'use client';

import { Check, Clapperboard, PenLine, BarChart3, Laptop, CalendarDays } from 'lucide-react';
import SectionWrapper from '@/components/ui/section-wrapper';
import LpButton from '@/components/ui/lp-button';
import SocialProofMicro from '@/components/ui/social-proof-micro';
import { useAnalytics } from '@/hooks/use-analytics';

const deliverables = [
    {
        title: 'Video Materi Full Skills',
        badge: '80+ VIDEO',
        desc: 'Materi Listening, Structure & Written Expression, dan Reading Comprehension dijelaskan dengan teknik dan trik langsung dari instruktur berpengalaman 10+ tahun.',
        Icon: Clapperboard,
    },
    {
        title: 'Bank Latihan Soal',
        badge: 'RATUSAN SOAL',
        desc: 'Ratusan soal latihan per section yang bisa kamu kerjakan berulang kali. Setiap soal dilengkapi pembahasan agar kamu paham pola dan strateginya.',
        Icon: PenLine,
    },
    {
        title: 'Simulasi Tes TOEFL ITP Full',
        badge: 'FORMAT TES ASLI',
        desc: 'Simulasi dengan format, durasi, dan tingkat kesulitan mirip tes asli. Tahu posisi skormu sebelum hari H dan tahu persis section mana yang perlu diperkuat.',
        Icon: BarChart3,
    },
    {
        title: 'Akses LMS 24/7',
        badge: 'AKSES 24/7',
        desc: 'Semua materi tersedia di platform Learning Management System. Belajar kapan saja, di mana saja, dari HP atau laptop, dengan progress tracking otomatis.',
        Icon: Laptop,
    },
    {
        title: 'Kurikulum 15 Hari Terstruktur',
        badge: '15 HARI',
        desc: 'Tidak perlu bingung jadwal belajar. Ikuti saja roadmap harian selama 15 hari, dari nol sampai siap tes.',
        Icon: CalendarDays,
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
                <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-100 p-5 md:p-8">
                    <div className="flex flex-col">
                        {deliverables.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-4 border-b border-gray-100 py-5 first:pt-2 last:border-b-0 last:pb-2 md:gap-6 md:py-6"
                            >
                                {/* Left Icon */}
                                <div className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full bg-[#FFF0F0] text-[#D70808] md:h-[56px] md:w-[56px]">
                                    <item.Icon className="h-6 w-6 md:h-7 md:w-7" />
                                </div>
                                
                                {/* Content */}
                                <div className="min-w-0 flex-1">
                                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                                        <h3
                                            className="text-[16px] font-black md:text-[18px]"
                                            style={{ fontFamily: 'var(--font-heading)', color: '#151515' }}
                                        >
                                            {item.title}
                                        </h3>
                                        <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                                            {item.badge}
                                        </span>
                                    </div>
                                    <p
                                        className="text-[13px] leading-[1.6] md:text-[14px]"
                                        style={{ color: '#6b7280' }}
                                    >
                                        {item.desc}
                                    </p>
                                </div>

                                {/* Right Checkmark */}
                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#D70808] text-white">
                                    <Check size={14} strokeWidth={3} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Buttons & Social Proof */}
                <div className="mt-12 text-center">
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
                            className="bg-white !text-[#151515] border-[#E60000] hover:bg-gray-50"
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