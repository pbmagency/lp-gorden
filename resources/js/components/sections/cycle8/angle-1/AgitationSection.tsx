'use client';

import { ArrowDown } from 'lucide-react';
import SectionWrapper from '@/components/ui/section-wrapper';

const selfStudyData = [
    {
        do: 'Udah download banyak PDF, tapi bingung mulai dari mana.',
        whyFails: 'Akhirnya materi cuma numpuk, tidak ada yang selesai.',
    },
    {
        do: 'Nonton video TOEFL sampai malam, besoknya lupa lagi.',
        whyFails: 'Tanpa latihan dan urutan yang jelas, materinya tidak nempel.',
    },
    {
        do: 'Ada satu materi yang gak paham, tapi gak ada yang bisa ditanya.',
        whyFails: 'Jadi di-skip, padahal itu yang sering keluar di tes.',
    },
    {
        do: 'Ngerjain soal, salah, tapi gak tahu salahnya di mana.',
        whyFails: 'Kesalahan yang sama terus terulang sampai hari tes.',
    },
];

const courseData = [
    {
        do: 'Ikut kursus, tapi yang dipelajari bahasa Inggris umum.',
        whyFails: 'Bukan dilatih khusus untuk pola soal yang keluar di TOEFL.',
    },
    {
        do: 'Jadwal kelasnya bentrok sama kuliah atau kerja.',
        whyFails: 'Sering absen, materinya tertinggal dan susah menyusul.',
    },
    {
        do: 'Sudah bayar mahal, tapi ternyata metodenya gak cocok.',
        whyFails: 'Uangnya sudah keluar, waktunya juga sudah jalan.',
    },
];

function AgitationCard({ item, index }: { item: { do: string; whyFails: string }; index: number }) {
    return (
        <div className="overflow-hidden rounded-[18px] bg-white shadow-[0_3px_18px_rgba(0,0,0,0.06)] border-l-4 border-l-[#D70808]">
            {/* Top part */}
            <div className="flex items-start gap-[12px] px-[22px] pt-[20px] pb-[16px]">
                <span 
                    className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-[#FFF0F0] text-[13px] font-[900] text-[#D70808]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                >
                    {index}
                </span>
                <p 
                    className="m-0 text-[17px] font-[800] leading-[1.5] text-[#151515]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                >
                    {item.do}
                </p>
            </div>
            {/* Bottom part */}
            <div className="flex items-start gap-[10px] border-t border-[#ffe0e0] bg-[#FFF7F7] px-[22px] py-[14px]">
                <span className="shrink-0 pt-[2px] text-[12px] font-[900] uppercase tracking-[0.06em] text-[#D70808]">
                    Akibatnya
                </span>
                <p 
                    className="m-0 text-[15px] leading-[1.6] text-[#4b4b4b]"
                >
                    {item.whyFails}
                </p>
            </div>
        </div>
    );
}

export default function AgitationSection() {
    return (
        <SectionWrapper bg="cultured" className="py-14 md:py-20" id="agitation">
            <div className="mx-auto max-w-4xl px-4 md:px-6">
                {/* Header Section */}
                <div className="mb-10 text-center">
                    {/* Tag */}
                    <div
                        className="mb-[20px] inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-[12px] font-[700] uppercase tracking-[0.08em] shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
                        style={{
                            color: '#D70808',
                            border: '1px solid #ffe5e5',
                        }}
                    >
                        BELAJAR SENDIRI ATAU KURSUS, SKOR TETAP STUCK
                    </div>

                    {/* Headline */}
                    <h2
                        className="mb-4 text-[clamp(28px,3vw,42px)] font-[900] leading-[1.25]"
                        style={{
                            fontFamily: 'var(--font-heading)',
                            color: '#151515',
                        }}
                    >
                        Skor Stuck Bukan Karena <br />
                        <span style={{ color: '#D70808' }}>
                            Kamu Kurang Usaha
                        </span>
                    </h2>

                    {/* Subheadline */}
                    <p
                        className="mx-auto mb-[28px] max-w-[800px] text-[16px] leading-[1.6] text-[#6b6b6b]"
                    >
                        Belajar dari buku, YouTube, atau kursus umum susah buat naikin skor. Masalahnya, <b>materinya tidak terstruktur dan tidak fokus ke pola soal TOEFL, </b>jadi progres belajarmu jalan di tempat.
                    </p>
                </div>

                <div className="mx-auto max-w-3xl">
                    {/* Self Study Section */}
                    <div className="mb-[40px]">
                        <h3 
                            className="mb-[18px] text-center text-[13px] font-[800] uppercase tracking-[0.12em] text-[#151515]"
                        >
                            PERNAH NGALAMIN INI WAKTU BELAJAR SENDIRI?
                        </h3>
                        <div className="flex flex-col gap-[14px]">
                            {selfStudyData.map((item, i) => (
                                <AgitationCard key={i} item={item} index={i + 1} />
                            ))}
                        </div>
                    </div>

                    {/* Course Section */}
                    <div className="mb-12">
                        <h3 
                            className="mb-[18px] text-center text-[13px] font-[800] uppercase tracking-[0.12em] text-[#151515]"
                        >
                            ATAU PERNAH NGALAMIN INI DI KURSUS LAIN?
                        </h3>
                        <div className="flex flex-col gap-[14px]">
                            {courseData.map((item, i) => (
                                <AgitationCard key={i} item={item} index={i + 1} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Closing Bridge */}
                <div className="px-2 space-y-4 text-center">
                    <p
                        className="mx-auto max-w-2xl text-[15px] leading-[1.6]"
                        style={{ color: '#6b6b6b' }}
                    >
                        Materi yang sama bisa terasa jauh lebih mudah kalau urutannya benar dan ada penjelasan lengkapnya.
                    </p>
                    <p
                        className="text-[20px] font-black leading-[1.4] md:text-[22px]"
                        style={{ fontFamily: 'var(--font-heading)', color: '#151515' }}
                    >
                        Yang kamu butuhkan bukan belajar lebih keras, tapi belajar yang terarah
                    </p>

                    <div className="flex justify-center pt-2">
                        {/* Clickable Down Arrow */}
                        <a 
                            href="#pricing"
                            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-gray-100"
                            onClick={(e) => {
                                e.preventDefault();
                                document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            <ArrowDown size={24} className="animate-bounce text-gray-400" />
                        </a>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
}