'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionWrapper from '@/components/ui/section-wrapper';
import LpButton from '@/components/ui/lp-button';
import { useAnalytics } from '@/hooks/use-analytics';

interface WaScreenshot {
    src: string;
    score: string;
}

const topWaScreenshots: WaScreenshot[] = [
    { src: '/image/toefl1.webp', score: '547' },
    { src: '/image/toefl9.webp', score: '560' },
    { src: '/image/toefl3.webp', score: '563' },
];

function PhotoLightbox({
    photos,
    index,
    onClose,
    onPrev,
    onNext,
}: {
    photos: typeof topWaScreenshots;
    index: number;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
}) {
    const photo = photos[index];

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.92)' }}
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/70 transition hover:text-white"
                aria-label="Tutup"
            >
                <X size={28} />
            </button>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onPrev();
                }}
                className="absolute left-4 p-2 text-white/70 transition hover:text-white"
                aria-label="Sebelumnya"
            >
                <ChevronLeft size={36} />
            </button>
            <div
                className="flex flex-col items-center gap-4 px-16"
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    role="img"
                    aria-label="Score"
                    style={{
                        height: '80vh',
                        width: '340px',
                        maxWidth: '80vw',
                        borderRadius: '16px',
                        backgroundImage: `url('${photo.src}')`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        boxShadow: '0 24px 80px rgba(0,0,0,0.6)'
                    }}
                />
                <p className="m-0 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    Skor {photo.score}
                </p>
                <p className="m-0 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {index + 1} / {photos.length}
                </p>
            </div>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onNext();
                }}
                className="absolute right-4 p-2 text-white/70 transition hover:text-white"
                aria-label="Berikutnya"
            >
                <ChevronRight size={36} />
            </button>
        </div>
    );
}

export default function BuktiNyataSection() {
    const { trackCTA } = useAnalytics();
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const openLightbox = (i: number) => setLightboxIndex(i);
    const closeLightbox = () => setLightboxIndex(null);
    const prevPhoto = () =>
        setLightboxIndex((i) =>
            i !== null
                ? (i - 1 + topWaScreenshots.length) % topWaScreenshots.length
                : null,
        );
    const nextPhoto = () =>
        setLightboxIndex((i) =>
            i !== null ? (i + 1) % topWaScreenshots.length : null,
        );

    return (
        <SectionWrapper bg="white" className="py-20 md:py-24" id="bukti-nyata">
            <div className="mx-auto max-w-4xl px-4 md:px-6">
                {/* Header */}
                <div className="mb-10 text-center">
                    <div
                        className="mb-5 inline-flex items-center gap-2 rounded-full px-5 py-2 text-[12px] font-[800] uppercase tracking-widest sm:py-1.5 sm:text-[13px]"
                        style={{
                            fontFamily: 'var(--font-heading)',
                            backgroundColor: '#FFF0F0',
                            color: '#D70808',
                            border: '1px solid #ffb3b3',
                        }}
                    >
                        <span>❗</span> BUKTI NYATA DARI ALUMNI
                    </div>

                    <h2
                        className="mb-3 text-[clamp(28px,3.6vw,42px)] font-black leading-[1.2] sm:text-3xl md:text-[2.5rem] md:leading-[1.25]"
                        style={{
                            fontFamily: 'var(--font-heading)',
                            color: '#151515',
                        }}
                    >
                        Metode Kami Berhasil Membuat <br />
                        <span style={{ color: '#D70808' }}>
                            Ribuan Alumni Kami Capai TOEFL 500+
                        </span>
                    </h2>

                    <p
                        className="text-[14px]"
                        style={{ fontFamily: 'var(--font-heading)', color: '#9ca3af' }}
                    >
                        Klik foto untuk memperbesar
                    </p>
                </div>

                {/* 3 Photos */}
                <div className="mx-auto mb-10 flex max-w-[420px] flex-col">
                    {topWaScreenshots.map((img, i) => (
                        <div
                            key={i}
                            className="flex cursor-pointer flex-col items-center gap-2.5 border-b border-gray-200 py-6 last:border-b-0"
                            onClick={() => openLightbox(i)}
                        >
                            <p
                                className="m-0 text-[18px] font-[800]"
                                style={{ fontFamily: 'var(--font-heading)', color: '#151515' }}
                            >
                                Skor <span style={{ color: '#D70808' }}>{img.score}</span>
                            </p>
                            <div
                                className="w-full overflow-hidden rounded-[14px]"
                                style={{
                                    boxShadow: '0 6px 24px rgba(0,0,0,0.18)',
                                    aspectRatio: '1/1',
                                    backgroundImage: `url('${img.src}')`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* Buttons */}
                <div className="text-center">
                    <div className="flex flex-col justify-center gap-3 sm:flex-row">
                        <LpButton
                            href="#pricing"
                            size="md"
                            className="bg-[#E60000] text-white hover:bg-[#CC0000]"
                            onClick={() => trackCTA('bukti_nyata_primary', 'Gabung Sekarang →', '#pricing')}
                        >
                            Gabung Sekarang →
                        </LpButton>
                        <LpButton
                            href="#testimonials"
                            variant="outline"
                            size="md"
                            className="border-[#E60000] !text-[#151515] bg-white hover:bg-gray-50"
                            onClick={() => trackCTA('bukti_nyata_secondary', 'Lihat Lebih Banyak Bukti →', '#testimonials')}
                        >
                            Lihat Lebih Banyak Bukti →
                        </LpButton>
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            {lightboxIndex !== null && (
                <PhotoLightbox
                    photos={topWaScreenshots}
                    index={lightboxIndex}
                    onClose={closeLightbox}
                    onPrev={prevPhoto}
                    onNext={nextPhoto}
                />
            )}
        </SectionWrapper>
    );
}