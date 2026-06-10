import { AlertTriangle } from 'lucide-react';
import SectionWrapper from '@/components/ui/section-wrapper';

const painPoints = [
    'Deadline LPDP / CPNS tinggal hitungan minggu',
    'Udah belajar sendiri tapi skor ga naik juga',
    'Takut kesempatan ini lewat cuma karena masalah skor',
];

export default function AgitationSection() {
    return (
        <SectionWrapper bg="cultured" className="py-20 md:py-24">
            <div className="max-w-lg md:max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5" style={{ backgroundColor: '#FFF0F0', color: '#D70808', border: '1px solid #ffb3b3' }}>
                        <AlertTriangle size={13} /> Sebelum kamu lanjut baca -
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4" style={{ fontFamily: 'var(--font-heading)', color: '#151515' }}>
                        IPK Kamu Bagus, <span style={{ color: '#D70808' }}>Niat Ada</span>. Tapi <span style={{ color: '#D70808' }}>Skor TOEFL Belum Sampai</span>.
                    </h2>
                </div>

                <div className="flex flex-col gap-4 mb-12">
                    {painPoints.map((point) => (
                        <div key={point} className="flex items-start gap-4">
                            <span className="shrink-0 mt-0.5 font-black text-lg leading-none" style={{ color: '#D70808' }}>📍</span>
                            <p className="font-semibold text-base leading-snug" style={{ color: '#151515' }}>{point}</p>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <p className="text-base leading-relaxed mb-4" style={{ color: '#3d3d3d' }}>
                        Kami paham rasanya. Bukan karena kamu tidak mampu. Tapi karena <strong style={{ color: '#151515' }}>cara belajar TOEFL yang kebanyakan orang pakai memang tidak dirancang untuk kejar waktu</strong>.
                    </p>
                    <p className="text-base leading-relaxed mb-2" style={{ color: '#151515', fontWeight: 600 }}>
                        Di bawah ini, kenapa kami bisa bantu kamu dan apa yang berbeda
                    </p>
                    <p className="text-2xl" style={{ color: '#151515' }}>
                        ↓
                    </p>
                </div>
            </div>
        </SectionWrapper>
    );
}
