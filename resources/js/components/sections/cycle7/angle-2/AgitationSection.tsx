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
            <div className="mx-auto max-w-4xl">
                {/* Tag */}
                <div className="mb-8 text-center md:mb-10">
                    <div
                        className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-1.5 text-[10px] sm:text-xs font-bold tracking-widest uppercase"
                        style={{
                            color: '#D70808',
                            border: '1px solid #ffb3b3',
                        }}
                    >
                        UDAH BELAJAR MATI-MATIAN, SKOR MASIH SEGITU?
                    </div>

                    {/* Headline */}
                    <h2
                        className="mb-3 text-3xl leading-tight font-black sm:text-4xl md:mb-4 md:text-[2.5rem]"
                        style={{
                            fontFamily: 'var(--font-heading)',
                            color: '#151515',
                        }}
                    >
                        Submission Gagal Bukan Karena <br className="hidden sm:block" />
                        <span style={{ color: '#D70808' }}>
                            Kurang Keras Belajar TOEFL
                        </span>
                    </h2>

                    {/* Subheadline */}
                    <p
                        className="mx-auto max-w-2xl text-sm leading-relaxed sm:text-base md:text-lg"
                        style={{ color: '#666666' }}
                    >
                        Kebanyakan pejuang beasiswa belajar TOEFL dengan cara yang salah, bukan untuk kejar skor demi submission.
                    </p>
                </div>

                {/* Table Block */}
                <div className="mx-auto mb-10 max-w-3xl overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 md:mb-12">
                    {/* Header */}
                    <div className="grid grid-cols-1 gap-2 border-b border-gray-200 bg-white p-5 sm:grid-cols-2 sm:gap-6 md:px-8 md:py-6">
                        <div className="text-sm font-bold md:text-base" style={{ color: '#151515' }}>
                            Yang Selama Ini Kamu Lakukan
                        </div>
                        <div className="text-sm font-bold md:text-base" style={{ color: '#151515' }}>
                            Kenapa Cara Ini Bikin Submission Gagal
                        </div>
                    </div>

                    {/* Rows */}
                    <div className="flex flex-col">
                        {tableData.map((item, i) => (
                            <div 
                                key={i} 
                                className="grid grid-cols-1 gap-2 border-b border-gray-100 p-5 last:border-b-0 sm:grid-cols-2 sm:gap-6 md:px-8 md:py-5"
                            >
                                <div className="flex text-sm text-gray-500 sm:items-center">
                                    {item.do}
                                </div>
                                <div className="flex text-sm text-gray-500 sm:items-center">
                                    {item.whyFails}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Closing Bridge */}
                <div className="space-y-3 text-center">
                    <p
                        className="text-sm leading-relaxed md:text-base"
                        style={{ color: '#666666' }}
                    >
                        Padahal dengan strategi yang tepat, skor bisa naik signifikan tanpa perlu waktu lama.
                    </p>
                    <p
                        className="text-base font-bold leading-relaxed md:text-lg"
                        style={{ color: '#151515' }}
                    >
                        Kalau kamu mau lolos beasiswa, cara belajar kamu harus segera diubah
                    </p>

                    <div className="flex justify-center pt-2">
                        {/* Clickable Down Arrow */}
                        <a 
                            href="#pricing"
                            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                            onClick={(e) => {
                                e.preventDefault();
                                document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            <ArrowDown size={20} className="text-gray-500 animate-bounce" />
                        </a>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
}