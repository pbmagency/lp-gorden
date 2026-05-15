import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

// Target deadline: LPDP Reguler Batch 2 — 1 Juli 2026
// Ganti tanggal ini sesuai deadline aktual client
const DEADLINE = new Date('2026-07-01T23:59:59+07:00');

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft());

  function getTimeLeft() {
    const diff = DEADLINE.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return timeLeft;
}

export default function UrgencyBanner() {
  const { days, hours, minutes, seconds } = useCountdown();
  const pad = (n: number) => String(n).padStart(2, '0');
  const expired = days === 0 && hours === 0 && minutes === 0 && seconds === 0;

  return (
    <div
      className="w-full py-2 px-4 text-center text-sm font-bold tracking-wide"
      style={{ backgroundColor: '#D70808', color: '#fff', fontFamily: 'var(--font-heading)' }}
    >
      <span className="inline-flex items-center gap-2 flex-wrap justify-center">
        <Clock size={14} className="shrink-0" />
        {expired ? (
          <span>Deadline LPDP Batch 2 telah lewat — Persiapkan CPNS 2026 sekarang!</span>
        ) : (
          <span>
            ⏳ LPDP Batch 2 & CPNS 2026 — Persiapkan Skor TOEFL-mu! Sisa waktu:{' '}
            <span className="font-black">
              {days}h {pad(hours)}:{pad(minutes)}:{pad(seconds)}
            </span>{' '}
            — <a href="#pricing" className="underline underline-offset-2">Daftar Sekarang</a>
          </span>
        )}
      </span>
    </div>
  );
}
