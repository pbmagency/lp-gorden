import { AlertTriangle } from 'lucide-react';
import SectionWrapper from '@/components/ui/section-wrapper';

const timelineSteps = [
    { timing: 'Minggu ini', consequence: 'Skor masih belum cukup' },
    { timing: '2 minggu lagi', consequence: 'Deadline pendaftaran' },
    { timing: 'Setelah deadline', consequence: 'Kesempatan ini hilang minimum 12 bulan' },
];

export default function AgitationSection() {
    return (
        <SectionWrapper bg="cultured" className="py-20 md:py-24">
            <div className="max-w-lg md:max-w-2xl mx-auto">
                {/* Section Label */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5" style={{ backgroundColor: '#FFF0F0', color: '#D70808', border: '1px solid #ffb3b3' }}>
                        <AlertTriangle size={13} /> Ini Yang Terjadi Kalau Skor Tidak Tercapai Tepat Waktu
                    </div>
                    
                    {/* Headline */}
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4" style={{ fontFamily: 'var(--font-heading)', color: '#151515' }}>
                        Deadline Terlewat Bukan Berarti Coba Lagi Bulan Depan.
                    </h2>
                    
                    {/* Sub */}
                    <p className="text-base leading-relaxed" style={{ color: '#3d3d3d' }}>
                        Untuk LPDP, itu artinya tunggu 1 tahun lagi. Untuk CPNS, batch berikutnya belum tentu ada. Untuk kampus impian, pendaftaran tutup dan harus nunggu tahun depan.
                    </p>
                </div>

                {/* Consequence Block - Timeline */}
                <div className="mb-12 space-y-4">
                    {timelineSteps.map((step, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: '#FFF5F5', border: '1px solid #ffb3b3' }}>
                            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black" style={{ backgroundColor: '#D70808', color: '#fff' }}>
                                {index + 1}
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-sm mb-1" style={{ color: '#D70808' }}>{step.timing}</p>
                                <p className="font-semibold text-base" style={{ color: '#151515' }}>{step.consequence}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Reframe */}
                <div className="text-center mb-8">
                    <p className="text-base leading-relaxed italic" style={{ color: '#3d3d3d' }}>
                        Tapi ini bukan tentang menakut-nakuti. Ini tentang realita yang sudah kamu tahu sendiri, makanya kamu sampai di sini.
                    </p>
                </div>

                {/* Closing Bridge */}
                <div className="text-center">
                    <p className="text-lg leading-relaxed mb-2 font-bold" style={{ color: '#151515' }}>
                        Kabar baiknya: 15 hari masih cukup <span style={{ color: '#D70808' }}>"kalau caranya benar."</span>
                    </p>
                    <p className="text-base leading-relaxed mb-2" style={{ color: '#151515', fontWeight: 600 }}>
                        Lihat bagaimana caranya
                    </p>
                    <p className="text-2xl" style={{ color: '#151515' }}>
                        ↓
                    </p>
                </div>
            </div>
        </SectionWrapper>
    );
}
