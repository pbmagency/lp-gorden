import { ArrowDown } from 'lucide-react';
import SectionWrapper from '@/components/ui/section-wrapper';

// Variant ID: c6-angle-2
// Cycle: 6 | Role: Challenger

const tableData = [
    {
        do: 'Hafal ratusan rumus grammar',
        whyFails: 'Tidak keluar di tes TOEFL, buang-buang waktu',
    },
    {
        do: 'Belajar tiap hari tanpa struktur',
        whyFails: 'Tidak tahu bagian mana yang keluar di tes TOEFL',
    },
    {
        do: 'Coba soal acak dari internet',
        whyFails: 'Tidak mencerminkan pola soal asli',
    },
    {
        do: 'Belajar tanpa target skor jelas',
        whyFails: 'Tidak tahu sudah cukup atau belum untuk submission',
    },
];

export default function AgitationSection() {
    return (
        <SectionWrapper bg="cultured" className="py-14 md:py-20" id="agitation">
            <div className="mx-auto max-w-4xl px-4 md:px-6">
                {/* Tag */}
                <div className="mb-8 text-center md:mb-10">
                    <div
                        className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-1.5 text-[10px] font-bold uppercase tracking-widest sm:text-xs"
                        style={{
                            color: '#D70808',
                            border: '1px solid #ffb3b3',
                        }}
                    >
                        UDAH BELAJAR MATI-MATIAN, SKOR MASIH SEGITU?
                    </div>

                    {/* Headline */}
                    <h2
                        className="mb-4 text-3xl font-black leading-[1.25] sm:text-4xl md:mb-5 md:text-[2.5rem]"
                        style={{
                            fontFamily: 'var(--font-heading)',
                            color: '#151515',
                        }}
                    >
                        Submission Gagal Bukan Karena <br />
                        <span style={{ color: '#D70808' }}>
                            Kurang Keras Belajar TOEFL
                        </span>
                    </h2>

                    {/* Subheadline */}
                    <p
                        className="mx-auto max-w-2xl text-[14px] leading-relaxed sm:text-base md:text-lg"
                        style={{ color: '#666666' }}
                    >
                        Kebanyakan pejuang beasiswa <strong style={{ color: '#151515' }}>belajar TOEFL</strong> dengan cara yang salah, bukan untuk kejar skor demi submission.
                    </p>
                </div>

                {/* Table Block */}
                <div className="mx-auto mb-10 max-w-3xl overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm md:mb-12">
                    {/* Header */}
                    {/* 👇 Changed to grid-cols-2 by default so it's side-by-side on mobile 👇 */}
                    <div className="grid grid-cols-2 gap-4 border-b border-gray-200 bg-white p-5 sm:gap-6 md:px-8 md:py-6">
                        <div className="text-[13px] font-bold leading-snug sm:text-sm md:text-base" style={{ color: '#151515' }}>
                            Yang Selama Ini Kamu Lakukan
                        </div>
                        <div className="text-[13px] font-bold leading-snug sm:text-sm md:text-base" style={{ color: '#151515' }}>
                            Kenapa Cara Ini Bikin Submission Gagal
                        </div>
                    </div>

                    {/* Rows */}
                    <div className="flex flex-col">
                        {tableData.map((item, i) => (
                            <div 
                                key={i} 
                                /* 👇 Changed to grid-cols-2 by default so it's side-by-side on mobile 👇 */
                                className="grid grid-cols-2 gap-4 border-b border-gray-100 p-5 last:border-b-0 sm:gap-6 md:px-8 md:py-5"
                            >
                                <div className="flex text-[13px] leading-relaxed text-gray-500 sm:items-center sm:text-sm">
                                    {item.do}
                                </div>
                                <div className="flex text-[13px] leading-relaxed text-gray-500 sm:items-center sm:text-sm">
                                    {item.whyFails}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Closing Bridge */}
                <div className="space-y-3 text-center">
                    <p
                        className="text-[14px] leading-relaxed md:text-base"
                        style={{ color: '#666666' }}
                    >
                        Padahal dengan strategi yang tepat, skor bisa naik signifikan tanpa perlu waktu lama.
                    </p>
                    <p
                        className="text-[15px] font-bold leading-relaxed md:text-lg"
                        style={{ color: '#151515' }}
                    >
                        Kalau kamu mau lolos beasiswa, cara belajar kamu harus segera diubah
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