'use client';

import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { waUrl } from '@/lib/wa-number';
import { useAnalytics } from '@/hooks/use-analytics'; // Added analytics import

const options = [
    'Harganya masih terlalu mahal buatku',
    'Belum yakin bisa mencapai target TOEFL-ku',
    'Belum yakin program ini cocok untuk kebutuhanku',
    'Masih membandingkan dengan program lain',
];

const waSubtexts = [
    'Ada yang ingin ditanyakan soal harga atau paket?',
    'Mau tahu apakah program ini cocok untuk target skor kamu?',
    'Konsultasikan dulu apakah program ini cocok untukmu.',
    'Masih membandingkan? Tanya tim kami tentang programnya.',
];

const waMsgs = [
    'Halo Admin Full Bright Indonesia. Saya mau konsultasi soal paket dan harga sebelum daftar.',
    'Halo Admin Full Bright Indonesia. Saya mau konsultasi soal metode belajar dan hasil yang bisa dicapai sebelum daftar.',
    'Halo Admin Full Bright Indonesia. Saya mau konsultasi apakah program ini cocok dengan kebutuhan saya sebelum daftar.',
    'Halo Admin Full Bright Indonesia. Saya masih membandingkan dengan program lain, mau tanya-tanya dulu.',
];

export default function ReturnModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
    
    // Initialize analytics
    const { trackCTA, trackConversion } = useAnalytics();

    useEffect(() => {
        // Automatically track clicks on checkout links
        const handleClick = (e: MouseEvent) => {
            const target = (e.target as Element).closest('a');
            if (target && target.href && target.href.includes('member.fullbrightindonesia.com')) {
                localStorage.setItem('fb_checkout_clicked_at', Date.now().toString());
            }
        };
        document.addEventListener('click', handleClick);

        // Show modal when user returns to this tab after clicking checkout
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                const clickedAt = Number(localStorage.getItem('fb_checkout_clicked_at') || 0);
                const alreadyShown = localStorage.getItem('fb_return_popup_shown');
                
                // If clicked within the last 24 hours and modal not already shown
                if (clickedAt && !alreadyShown && Date.now() - clickedAt < 1000 * 60 * 60 * 24) {
                    setIsOpen(true);
                    localStorage.setItem('fb_return_popup_shown', '1');
                }
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('click', handleClick);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-[#151515]/45 sm:items-center sm:p-4">
            <div 
                className="relative w-full max-w-[480px] max-h-[85vh] overflow-y-auto rounded-t-[24px] bg-white p-6 pb-8 shadow-[0_-12px_40px_rgba(0,0,0,0.18)] sm:rounded-3xl sm:shadow-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200"
            >
                <button 
                    onClick={() => setIsOpen(false)}
                    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200"
                >
                    <X size={16} strokeWidth={2.5} />
                </button>

                <p
                    className="mb-1.5 text-[11px] font-[700] tracking-[0.06em] uppercase text-[#6b6b6b]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                >
                    Sebelum Kamu Pergi
                </p>
                <h3
                    className="mb-5 pr-8 text-[clamp(22px,5vw,26px)] font-[800] leading-[1.25] text-[#151515]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                >
                    Apa yang <span className="text-[#D70808]">Masih Bikin Kamu Ragu Daftar?</span>
                </h3>

                {selectedIdx !== null ? (
                    <div className="animate-in fade-in zoom-in-95 duration-200">
                        <a
                            href={waUrl(waMsgs[selectedIdx])}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => {
                                // Added analytics tracking here!
                                trackCTA('return_popup', 'Konsultasi WhatsApp', waUrl(waMsgs[selectedIdx]));
                                trackConversion('whatsapp_leads', {
                                    location: 'return_popup',
                                    reason_selected: options[selectedIdx]
                                });
                            }}
                            className="mb-3.5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#16a34a] px-4 py-3.5 text-[14px] font-[700] text-white transition-all hover:brightness-110 active:scale-[0.98]"
                            style={{ fontFamily: 'var(--font-heading)' }}
                        >
                            💬 Konsultasi via WhatsApp →
                        </a>
                        <p
                            className="mb-0.5 text-[13px] font-[700] text-[#151515]"
                            style={{ fontFamily: 'var(--font-heading)' }}
                        >
                            {waSubtexts[selectedIdx]}
                        </p>
                        <p
                            className="mb-4 text-[12px] font-[500] text-[#6b7280]"
                            style={{ fontFamily: "'Nunito', sans-serif" }}
                        >
                            Tim kami siap bantu jawab langsung lewat WhatsApp.
                        </p>
                        
                        <div className="flex min-h-[54px] w-full items-center gap-2.5 rounded-xl border border-[#D70808] bg-[#D70808]/5 px-3.5 py-3">
                            <div className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#D70808]">
                                <Check size={11} color="white" strokeWidth={3.5} />
                            </div>
                            <span
                                className="text-[14px] font-[500] text-[#151515]"
                                style={{ fontFamily: "'Nunito', sans-serif" }}
                            >
                                {options[selectedIdx]}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {options.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedIdx(idx)}
                                className="flex min-h-[54px] w-full items-center gap-2 rounded-xl border border-[#e5e5e5] bg-white px-3.5 py-3 text-left transition-all hover:border-gray-300 hover:bg-gray-50"
                            >
                                <span
                                    className="text-[14px] font-[500] text-[#151515]"
                                    style={{ fontFamily: "'Nunito', sans-serif" }}
                                >
                                    {opt}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}