'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import SectionWrapper from '@/components/ui/section-wrapper';
import { useAnalytics } from '@/hooks/use-analytics';

const options = [
    'Bingung mulai belajar dari mana',
    'Sudah belajar tapi skor masih stuck',
    'Masih ragu apakah perlu ikut kursus',
    'Lainnya',
];

export default function SurveySection() {
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
    // Added trackConversion here:
    const { trackCTA, trackConversion } = useAnalytics();

    const handleSelect = (idx: number, opt: string) => {
        // Prevent changing the answer if they already selected one
        if (selectedIdx !== null) return; 
        
        setSelectedIdx(idx);
        
        // 1. Tracks in Micro-Conversion (Button Location column)
        trackCTA(`Survey: ${opt}`, opt, '');
        
        // 2. Explicitly counts this as an "intent" event in your analytics!
        trackConversion('intent', { 
            location: `Survey: ${opt}`, 
            action: 'survey_answered',
            value: opt 
        });
    };

    return (
        <SectionWrapper id="survey" bg="white" className="py-12 md:py-16">
            <div className="mx-auto max-w-[460px] rounded-2xl border border-[#ececec] bg-[#FAFAFA] p-5 pb-4 sm:p-6 sm:pb-5">
                <div className="mb-4">
                    <p
                        className="mb-1.5 text-[11px] font-[700] tracking-[0.06em] uppercase text-[#6b6b6b]"
                        style={{ fontFamily: 'var(--font-heading)' }}
                    >
                        BOLEH TAHU KESULITANMU?
                    </p>
                    <h2
                        className="text-[clamp(20px,3.6vw,23px)] font-[800] leading-[1.25] text-[#151515]"
                        style={{ fontFamily: 'var(--font-heading)' }}
                    >
                        Apa Tantangan Terbesarmu{' '}
                        <span className="text-[#D70808]">Soal TOEFL Sekarang?</span>
                    </h2>
                </div>

                <div className="flex flex-col gap-2">
                    {options.map((opt, idx) => {
                        const isSelected = selectedIdx === idx;
                        
                        // IF a selection has been made, HIDE all other options
                        if (selectedIdx !== null && !isSelected) {
                            return null;
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleSelect(idx, opt)}
                                disabled={selectedIdx !== null}
                                className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition-all duration-200 ${
                                    isSelected
                                        ? 'border-[#ffb3b3] bg-[#FFF0F0] cursor-default'
                                        : 'border-[#e5e7eb] bg-white hover:border-gray-300 cursor-pointer'
                                }`}
                            >
                                <span
                                    className="text-[13px] font-[500] text-[#151515]"
                                    style={{ fontFamily: "'Nunito', sans-serif" }}
                                >
                                    {opt}
                                </span>
                                {isSelected && (
                                    <div className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#D70808]">
                                        <Check size={11} color="white" strokeWidth={3.5} />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                <div
                    className={`mt-3 flex min-h-[16px] items-center gap-1 overflow-hidden transition-all duration-300 ${
                        selectedIdx !== null ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <p
                        className="text-[12px] font-[600] text-[#6b7280]"
                        style={{ fontFamily: "'Nunito', sans-serif" }}
                    >
                        ✓ Makasih! Jawabanmu sudah tercatat.
                    </p>
                </div>
            </div>
        </SectionWrapper>
    );
}