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
        <div className="overflow-hidden rounded-[16px] border border-[#ffe5e5] bg-white shadow-sm transition-all hover:shadow-md">
            {/* Top part */}
            <div className="flex items-start gap-4 bg-white px-5 py-4 sm:px-6">
                <span 
                    className="mt-0.5 w-3 shrink-0 text-center text-[15px] font-black text-[#D70808] sm:text-[17px]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                >
                    {index}
                </span>
                <p 
                    className="text-[15px] font-bold leading-snug text-[#151515] sm:text-[16px]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                >
                    {item.do}
                </p>
            </div>
            {/* Bottom part */}
            <div className="flex items-start gap-4 bg-[#fff5f5] px-5 py-3.5 sm:px-6">
                {/* Spacer to align AKIBATNYA perfectly with the text above it */}
                <div className="w-3 shrink-0" />
                <p 
                    className="text-[14px] leading-relaxed text-[#4b5563] sm:text-[14px]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                >
                    <span className="mr-2 text-[11px] font-black uppercase tracking-widest text-[#D70808]">
                        AKIBATNYA
                    </span>
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
                {/* Tag */}
                <div className="mb-8 text-center md:mb-10">
                    <div
                        className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-[12px] font-[800] uppercase tracking-widest sm:py-1.5 sm:text-[13px]"
                        style={{
                            fontFamily: 'var(--font-heading)',
                            color: '#D70808',
                            border: '1px solid #ffb3b3',
                        }}
                    >
                        BELAJAR SENDIRI ATAU KURSUS, SKOR TETAP STUCK
                    </div>

                    {/* Headline */}
                    <h2
                        className="mb-4 text-[clamp(28px,3.6vw,42px)] font-black leading-[1.2] sm:text-3xl md:mb-5 md:text-[2.5rem] md:leading-[1.25]"
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
                        className="mx-auto max-w-3xl text-[15px] leading-[1.6] sm:text-[16px] sm:leading-relaxed md:text-[17px]"
                        style={{ fontFamily: 'var(--font-heading)', color: '#666666' }}
                    >
                        Belajar dari buku, YouTube, atau kursus umum susah buat naikin skor. Masalahnya, materinya tidak terstruktur dan tidak fokus ke pola soal TOEFL, jadi progres belajarmu jalan di tempat.
                    </p>
                </div>

                <div className="mx-auto max-w-3xl">
                    {/* Self Study Section */}
                    <div className="mb-10">
                        <h3 
                            className="mb-6 text-center text-[12px] font-[800] uppercase tracking-widest text-[#666666] sm:text-[13px]"
                            style={{ fontFamily: 'var(--font-heading)' }}
                        >
                            PERNAH NGALAMIN INI WAKTU BELAJAR SENDIRI?
                        </h3>
                        <div className="flex flex-col gap-3 sm:gap-4">
                            {selfStudyData.map((item, i) => (
                                <AgitationCard key={i} item={item} index={i + 1} />
                            ))}
                        </div>
                    </div>

                    {/* Course Section */}
                    <div className="mb-12">
                        <h3 
                            className="mb-6 text-center text-[12px] font-[800] uppercase tracking-widest text-[#666666] sm:text-[13px]"
                            style={{ fontFamily: 'var(--font-heading)' }}
                        >
                            ATAU PERNAH NGALAMIN INI DI KURSUS LAIN?
                        </h3>
                        <div className="flex flex-col gap-3 sm:gap-4">
                            {courseData.map((item, i) => (
                                <AgitationCard key={i} item={item} index={i + 1} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Closing Bridge */}
                <div className="space-y-4 text-center px-2">
                    <p
                        className="mx-auto max-w-2xl text-[14px] leading-[1.5] sm:text-[15px] sm:leading-relaxed"
                        style={{ fontFamily: 'var(--font-heading)', color: '#666666' }}
                    >
                        Materi yang sama bisa terasa jauh lebih mudah kalau urutannya benar dan ada penjelasan lengkapnya.
                    </p>
                    <p
                        className="text-[18px] font-black leading-[1.4] sm:text-[20px] sm:leading-snug md:text-[22px]"
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