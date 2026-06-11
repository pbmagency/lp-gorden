import { AlertTriangle } from 'lucide-react';
import SectionWrapper from '@/components/ui/section-wrapper';

const painPoints = [
    'Skor TOEFL masih jauh dari syarat LPDP, perusahaan, atau kampus impian',
    'Mulai panik karena deadline pendaftaran makin dekat',
    'Terlalu banyak materi sampai bingung harus mulai darimana',
    'Sudah berkali-kali belajar sendiri tapi tetap tidak konsisten',
    'Takut kalah saing dengan peserta lain yang lebih siap',
    'Insecure saat lihat teman-temanmu satu per satu mulai lolos',
];

export default function AgitationSection() {
    return (
        <SectionWrapper bg="cultured" className="py-20 md:py-24">
            <div className="max-w-lg md:max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5" style={{ backgroundColor: '#FFF0F0', color: '#D70808', border: '1px solid #ffb3b3' }}>
                        <AlertTriangle size={13} /> Apakah Kamu Mengalami Ini?
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4" style={{ fontFamily: 'var(--font-heading)', color: '#151515' }}>
                        Takut Semua Mimpimu Gagal Hanya Karena{' '}
                        <span style={{ color: '#D70808' }}>Skor TOEFL?</span>
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
                        Banyak orang gagal bukan karena kurang pintar, tapi karena salah metode belajar.<br />
                        <span style={{ color: '#151515', fontWeight: 600 }}>Dan kalau kamu terus pakai cara lama, maka hasilnya akan tetap sama.</span>
                    </p>
                </div>
            </div>
        </SectionWrapper>
    );
}
