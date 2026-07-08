import { AlertTriangle, ArrowDown } from 'lucide-react';
import SectionWrapper from '@/components/ui/section-wrapper';

// Active variant: cycle2-test-problem/AgitationSection3 (Cycle 2 Winner)

const contrastItems = [
    {
        wrong: 'Hafal ratusan grammar',
        why: 'Tidak keluar di tes',
    },
    {
        wrong: 'Belajar tiap hari tanpa struktur',
        why: 'Tidak tahu bagian mana yang keluar di test',
    },
    {
        wrong: 'Coba soal acak dari internet',
        why: 'Tidak mencerminkan pola soal asli',
    },
];

export default function AgitationSection() {
    return (
        <SectionWrapper bg="cultured" className="py-20 md:py-24" id="agitation">
            <div className="mx-auto max-w-3xl">
                {/* Section Label */}
                <div className="mb-8 text-center">
                    <div
                        className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase"
                        style={{
                            backgroundColor: '#FFF0F0',
                            color: '#D70808',
                            border: '1px solid #ffb3b3',
                        }}
                    >
                        <AlertTriangle size={13} /> Kenapa Skor TOEFL Kamu Belum
                        Naik-naik?
                    </div>

                    {/* Headline */}
                    <h2
                        className="mb-5 text-2xl font-black sm:text-3xl md:text-4xl"
                        style={{
                            fontFamily: 'var(--font-heading)',
                            color: '#151515',
                        }}
                    >
                        Bukan Karena Kamu{' '}
                        <span style={{ color: '#D70808' }}>
                            Kurang Keras Belajar.
                        </span>
                    </h2>

                    {/* Body Copy */}
                    <p
                        className="mx-auto mb-12 max-w-2xl text-base leading-relaxed"
                        style={{ color: '#3d3d3d' }}
                    >
                        Kebanyakan orang belajar TOEFL dengan cara yang
                        dirancang untuk{' '}
                        <span
                            className="font-bold"
                            style={{ color: '#151515' }}
                        >
                            belajar inggris jangka panjang
                        </span>
                        , bukan untuk{' '}
                        <span
                            className="font-bold"
                            style={{ color: '#151515' }}
                        >
                            naik skor dalam waktu singkat
                        </span>
                        . Wajar kalau hasilnya{' '}
                        <span
                            className="font-bold"
                            style={{ color: '#151515' }}
                        >
                            stagnan
                        </span>{' '}
                        meski sudah usaha keras.
                    </p>
                </div>

                {/* 2 Column Contrast */}
                <div
                    className="mb-12 rounded-2xl p-6 md:p-8"
                    style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e0e0e0',
                    }}
                >
                    {/* Header Row */}
                    <div
                        className="mb-4 grid grid-cols-2 gap-4 pb-4"
                        style={{ borderBottom: '1px solid #e0e0e0' }}
                    >
                        <div className="font-bold" style={{ color: '#151515' }}>
                            Yang Selama Ini Kamu Lakukan
                        </div>
                        <div className="font-bold" style={{ color: '#151515' }}>
                            Kenapa Tidak Efektif
                        </div>
                    </div>

                    {/* Contrast Items */}
                    <div className="space-y-4">
                        {contrastItems.map((item, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-2 gap-4 pb-4"
                                style={{
                                    borderBottom:
                                        index < contrastItems.length - 1
                                            ? '1px solid #e0e0e0'
                                            : 'none',
                                }}
                            >
                                <div style={{ color: '#3d3d3d' }}>
                                    {item.wrong}
                                </div>
                                <div style={{ color: '#3d3d3d' }}>
                                    {item.why}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Closing Bridge */}
                <div className="space-y-4 text-center">
                    <p
                        className="text-base leading-relaxed"
                        style={{ color: '#3d3d3d' }}
                    >
                        TOEFL itu bukan tes kecerdasan. Tapi Ini tes pola. Dan
                        pola bisa dipelajari dalam waktu jauh lebih singkat dari
                        yang kamu kira.
                    </p>

                    <p
                        className="text-base leading-relaxed font-bold"
                        style={{ color: '#151515' }}
                    >
                        Ini yang kami lakukan berbeda
                    </p>

                    <div className="mt-4 flex justify-center">
                        <ArrowDown size={24} style={{ color: '#151515' }} />
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
}
