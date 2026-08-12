'use client'; // Important if using Next.js

import { Monitor } from 'lucide-react';
import SectionWrapper from '@/components/ui/section-wrapper';
import LpButton from '@/components/ui/lp-button';
import SocialProofMicro from '@/components/ui/social-proof-micro';
import { useAnalytics } from '@/hooks/use-analytics';

const lmsFeatures = [
    {
        id: '01',
        label: 'BERANDA',
        title: 'Pantau Progress Belajarmu Secara Real-Time',
        desc: 'Dashboard menampilkan soal yang sudah dikerjakan, akurasi, waktu belajar, streak harian, tren skor, hingga performa per section (Listening, Structure, Reading).',
        image: '/lms/lms-1.webp',
    },
    {
        id: '02',
        label: 'DIAGNOSTIC TEST',
        title: 'Tahu Dulu Titik Awalmu Sebelum Belajar',
        desc: 'Sebelum mulai, kerjakan Diagnostic Test untuk mengetahui baseline skor TOEFL ITP kamu. Hasilnya jadi acuan materi mana yang perlu diprioritaskan.',
        image: '/lms/lms-2.webp',
    },
    {
        id: '03',
        label: 'MATERI & ROADMAP',
        title: '60 Video Materi, Roadmap 15 Hari',
        desc: 'Materi tersusun rapi dari Hari 1 sampai Hari 15, mencakup skill Structure, Listening, dan Reading — jadi kamu tidak perlu bingung urutan belajar.',
        image: '/lms/lms-3.webp',
    },
    {
        id: '04',
        label: 'RANGKUMAN & TANYA AI',
        title: 'Setiap Video Dilengkapi Rangkuman dan AI Assistant',
        desc: 'Setelah menonton video, akses rangkuman materi dan langsung lanjut ke materi berikutnya. Bingung dengan suatu topik? Tanya AI siap bantu menjelaskan.',
        image: '/lms/lms-4.webp',
    },
    {
        id: '05',
        label: 'LATIHAN SOAL',
        title: 'Latihan Interaktif Per Topik',
        desc: 'Setiap topik dilengkapi latihan soal dengan navigasi antar nomor dan progress tracker, jadi kamu tahu persis sudah sejauh mana pemahamanmu.',
        image: '/lms/lms-5.webp',
    },
    {
        id: '06',
        label: 'DRILL',
        title: '84 Paket Drill Soal, 3 Skill Sekaligus',
        desc: 'Asah kemampuan spesifik lewat drill per skill — Listening, Structure, dan Reading — dengan paket soal yang bisa dikerjakan berulang kali sampai paham.',
        image: '/lms/lms-6.webp',
    },
    {
        id: '07',
        label: 'SIMULASI & UJIAN',
        extraLabel: 'Khusus Paket Dibimbing Tutor',
        title: 'Latihan Full Skills Seperti Ujian Sesungguhnya',
        desc: 'Mode Simulasi tanpa timer dengan feedback instan untuk latihan santai, dan Mode Final dengan timer serta kondisi real untuk mengukur kesiapanmu.',
        image: '/lms/lms-7.webp',
    },
];

export default function LmsSection() {
    const { trackCTA } = useAnalytics();

    return (
        <SectionWrapper id="lms-preview" bg="white" className="px-6 py-[80px] md:py-28">
            <div className="mx-auto max-w-6xl">
                
                {/* Header Section */}
                <div className="mb-14 text-center">
                    <div
                        className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#ffb3b3] bg-[#FFF0F0] px-4 py-1.5 text-[12px] font-[700] uppercase tracking-[0.08em] text-[#D70808]"
                        style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
                    >
                        <Monitor size={14} strokeWidth={2.5} /> TAMPILAN LMS
                    </div>
                    <h2
                        className="mb-4 text-[clamp(24px,3vw,36px)] font-[900] leading-[1.3] text-[#151515] sm:text-3xl sm:font-black md:text-[2.5rem]"
                        style={{ fontFamily: "'Nunito', sans-serif" }}
                    >
                        Intip Langsung <span className="text-[#D70808]">Platform Belajarnya</span>
                    </h2>
                    <p className="mx-auto max-w-[600px] text-[15px] leading-[1.6] text-[#666666] sm:text-[16px]">
                        Bukan cuma video dan PDF membosankan. Kamu belajar di platform lengkap dengan tracking progress, latihan interaktif, dan simulasi ujian.
                    </p>
                </div>

                {/* Cards Section */}
                <div className="mx-auto flex max-w-5xl flex-col gap-6">
                    {lmsFeatures.map((feature, index) => {
                        const isEven = index % 2 === 0;
                        return (
                            <div 
                                key={feature.id}
                                className="flex flex-col items-center gap-6 rounded-[24px] border border-gray-100 bg-[#FAFAFA] p-6 md:flex-row md:gap-10 md:p-8"
                            >
                                {/* Image Section */}
                                <div className={`w-full md:w-1/2 ${!isEven ? 'md:order-2' : ''}`}>
                                    <img 
                                        src={feature.image} 
                                        alt={feature.title} 
                                        className="h-auto w-full rounded-[12px] border border-gray-100 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                                        loading="lazy"
                                    />
                                </div>
                                
                                {/* Text Section */}
                                <div className={`flex w-full flex-col items-start md:w-1/2 ${!isEven ? 'md:order-1' : ''}`}>
                                    <div className="mb-3 flex flex-wrap items-center gap-2">
                                        <span className="flex h-6 w-6 items-center justify-center rounded bg-[#D70808] text-[11px] font-[900] text-white">
                                            {feature.id}
                                        </span>
                                        <span className="text-[12px] font-[800] uppercase tracking-wider text-gray-500">
                                            {feature.label}
                                        </span>
                                        {feature.extraLabel && (
                                            <span className="rounded-full border border-[#ffb3b3] bg-[#FFF0F0] px-2 py-0.5 text-[10px] font-bold uppercase text-[#D70808]">
                                                {feature.extraLabel}
                                            </span>
                                        )}
                                    </div>
                                    
                                    <h3 
                                        className="mb-3 text-[18px] font-[900] leading-[1.3] text-[#151515] md:text-[22px]"
                                        style={{ fontFamily: "'Nunito', sans-serif" }}
                                    >
                                        {feature.title}
                                    </h3>
                                    
                                    <p className="text-[14px] leading-[1.6] text-[#666666] md:text-[15px]">
                                        {feature.desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom CTA Section */}
                <div className="mt-16 text-center">
                    <p className="mb-6 text-[16px] font-[800] text-[#151515] sm:text-[18px]" style={{ fontFamily: "'Nunito', sans-serif" }}>
                        Semua fitur ini bisa kamu akses <span className="text-[#D70808]">begitu kamu bergabung.</span>
                    </p>
                    <div className="mb-6 flex flex-wrap justify-center gap-3">
                        <LpButton
                            href="#pricing"
                            size="md"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#D70808] px-7 py-3.5 text-[16px] font-[700] text-white shadow-[0_4px_20px_rgba(215,8,8,0.35)] transition-all hover:bg-[#b30606] sm:text-[17px] sm:font-bold"
                            onClick={() => trackCTA('lms_primary', 'Gabung Sekarang →', '#pricing')}
                        >
                            Gabung Sekarang →
                        </LpButton>
                        <LpButton
                            href="#testimonials"
                            size="md"
                            variant="outline"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-[#D70808] bg-transparent px-7 py-3.5 text-[16px] font-[700] !text-[#151515] transition-all hover:bg-red-50 sm:text-[17px] sm:font-bold"
                            onClick={() => trackCTA('lms_testimonials', 'Lihat Bukti Alumni →', '#testimonials')}
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