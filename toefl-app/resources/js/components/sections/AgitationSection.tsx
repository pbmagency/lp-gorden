import { AlertTriangle } from 'lucide-react';
import SectionWrapper from '@/components/ui/section-wrapper';

const painPoints = [
    'Deadline LPDP, Fulbright & CPNS sudah di depan mata',
    'Sudah belajar berbulan-bulan tapi skor tidak naik',
    'Bingung mulai dari mana, terlalu banyak teori',
    'Grammar & Listening selalu jadi batu sandungan',
    'Sibuk kerja atau kuliah, tidak punya waktu belajar lama',
    'Takut gagal seleksi hanya karena skor TOEFL kurang',
];

export default function AgitationSection() {
    return (
        <SectionWrapper bg="cultured" className="py-20 md:py-24">
            <div className="max-w-lg mx-auto">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5" style={{ backgroundColor: '#FFF0F0', color: '#D70808', border: '1px solid #ffb3b3' }}>
                        <AlertTriangle size={13} /> Apakah Kamu Mengalami Ini?
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4" style={{ fontFamily: 'var(--font-heading)', color: '#151515' }}>
                        "Sudah Belajar Keras, Tapi Skor{' '}
                        <span style={{ color: '#D70808' }}>Masih Belum Cukup Juga…"</span>
                    </h2>
                </div>

                <div className="flex flex-col gap-4 mb-12">
                    {painPoints.map((point) => (
                        <div key={point} className="flex items-start gap-4">
                            <span className="shrink-0 mt-0.5 font-black text-lg leading-none" style={{ color: '#D70808' }}>✗</span>
                            <p className="font-medium text-base leading-snug" style={{ color: '#151515' }}>{point}</p>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <p className="text-base leading-relaxed" style={{ color: '#3d3d3d' }}>
                        Kalau kamu mengangguk di 3 poin di atas,<br />
                        kamu tidak butuh belajar lebih keras.<br />
                        <strong style={{ color: '#151515' }}>Kamu butuh metode yang lebih pintar.</strong>
                    </p>
                </div>
            </div>
        </SectionWrapper>
    );
}
