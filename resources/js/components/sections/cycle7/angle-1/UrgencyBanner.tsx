'use client'; // Remove this line if you are NOT using Next.js App Router

import { useEffect, useState } from 'react';

export default function UrgencyBanner() {
    const [timeLeft, setTimeLeft] = useState({ hours: 11, minutes: 59, seconds: 59 });
    const [mounted, setMounted] = useState(false);
    
    // NEW: State to track if the timer has completely run out
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        setMounted(true);
        const DURATION = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
        const STORAGE_KEY = 'urgency_banner_expiry';

        function updateTimer() {
            let expiry = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
            const now = Date.now();

            // 1. If this is their first visit ever, set the unique expiry time
            if (!expiry) {
                expiry = now + DURATION;
                localStorage.setItem(STORAGE_KEY, expiry.toString());
            }

            const diff = expiry - now;

            // 2. NEW LOGIC: If the timer reaches 00:00:00, hide the banner completely
            if (diff <= 0) {
                setIsExpired(true);
                return; // Stop updating the timer
            }

            // 3. Otherwise, just keep counting down from their unique expiry time
            const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const m = Math.floor((diff / 1000 / 60) % 60);
            const s = Math.floor((diff / 1000) % 60);

            setTimeLeft({ hours: h, minutes: m, seconds: s });
        }

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, []);

    // Helper to format numbers (e.g. turns '9' into '09')
    const formatTime = (num: number) => num.toString().padStart(2, '0');

    // If the countdown is finished, return null so the banner completely disappears!
    if (isExpired) return null;

    return (
        <a
            href="#pricing"
            onClick={(e) => {
                e.preventDefault();
                document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex w-full cursor-pointer items-center justify-center bg-[#D70808] px-4 py-2 transition-colors hover:bg-[#b30606]"
            style={{ fontFamily: 'var(--font-heading)' }}
        >
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-center text-[12px] font-[800] tracking-wide text-white sm:gap-x-4 sm:text-[13px]">
                <span className="flex items-center gap-1.5 uppercase">
                    <span>🔥</span> SPESIAL KEMERDEKAAN · DISKON 81%
                </span>

                <span
                    className={`inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-[2px] text-[#D70808] shadow-sm transition-opacity ${
                        mounted ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <span className="text-gray-400">⏱</span>
                    <span className="font-[900]">
                        BERAKHIR {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
                    </span>
                </span>
            </div>
        </a>
    );
}