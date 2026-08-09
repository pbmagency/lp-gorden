import { ArrowDown, Check } from 'lucide-react';
import SectionWrapper from '@/components/ui/section-wrapper';

// Variant ID: c6-angle-2
// Cycle: 6 | Role: Challenger

const thoughts = [
    '"Yang penting sekarang cari informasi beasiswa dulu, TOEFL nanti."',
    '"TOEFL tuh gampang, nanti aja belajarnya deket-deket deadline."',
    '"Begitu waktunya mepet, belajar sendiri dari internet, asal rutin."',
    '"Yang penting sudah belajar, soal metode belajar belakangan."',
];

export default function AgitationSection() {
    return (
        <SectionWrapper bg="cultured" className="py-14 md:py-20" id="agitation">
            <div className="mx-auto max-w-4xl px-4">
                {/* Tag */}
                <div className="mb-8 text-center md:mb-10">
                    <div className="mb-6 inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-[10px] font-bold uppercase tracking-[0.08em] text-[#D70808] shadow-[0_2px_8px_rgba(0,0,0,0.04)] sm:text-xs">
                        KENAPA BANYAK PEJUANG BEASISWA GAGAL DI TOEFL?
                    </div>

                    {/* Headline */}
                    {/* 👇 Reduced text-3xl to text-2xl and adjusted line height for mobile 👇 */}
                    <h2 className="mb-5 font-['var(--font-heading)'] text-2xl font-black leading-[1.3] text-[#151515] sm:text-3xl md:text-[2.5rem] md:leading-tight">
                        Bukan Karena Kurang Mampu, <br className="hidden sm:block" />
                        <span className="text-[#D70808]">
                            Tapi Salah Langkah dari Awal.
                        </span>
                    </h2>

                    {/* Subheadline */}
                    <div className="mx-auto max-w-2xl text-sm leading-relaxed text-[#666666] sm:text-base md:text-[17px]">
                        <p className="mb-6">
                            Target beasiswa sudah ada, tapi kebanyakan orang menunda TOEFL, setelah itu baru belajar dengan metode yang salah.
                        </p>
                        <p>
                            Coba jujur, kamu pernah kepikiran seperti ini?
                        </p>
                    </div>
                </div>

                {/* List Block */}
                <div className="mx-auto mb-8 max-w-3xl overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm">
                    <div className="flex flex-col">
                        {thoughts.map((item, i) => (
                            <div 
                                key={i} 
                                className="flex items-center gap-4 border-b border-gray-100 p-4 sm:p-5 last:border-b-0"
                            >
                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FFF0F0] text-[#D70808]">
                                    <Check size={14} strokeWidth={3} />
                                </div>
                                <p className="text-sm font-medium text-gray-700 sm:text-[15px]">
                                    {item}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Warning */}
                <div className="mb-10 text-center">
                    <p className="text-[15px] font-bold text-[#151515]">⚠️ Kalau iya, hati-hati.</p>
                </div>

                {/* Fact Box */}
                <div className="mx-auto mb-10 max-w-3xl rounded-[24px] border border-gray-100 bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] sm:p-10 md:mb-12">
                    <p className="mb-4 text-center text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400">
                        Fakta yang harus kamu tahu
                    </p>
                    <h3 className="mb-3 text-center font-['var(--font-heading)'] text-2xl font-black text-[#151515] sm:text-3xl">
                        <span className="text-4xl text-[#D70808] sm:text-[44px]">82%</span>{' '}
                        Pejuang Beasiswa Gagal
                    </h3>
                    <p className="mx-auto max-w-xl text-center text-sm leading-relaxed text-gray-600 sm:text-[15px]">
                        karena menunda TOEFL, lalu buru-buru belajar sendiri dengan metode yang salah.
                    </p>
                </div>

                {/* Closing Bridge */}
                <div className="space-y-4 text-center">
                    <p className="text-sm font-bold leading-relaxed text-[#151515] sm:text-base md:text-[17px]">
                        Mindsetmu harus segera diubah, sebelum submissionmu gagal.
                    </p>

                    <div className="flex justify-center pt-2">
                        <a 
                            href="#pricing"
                            className="flex h-10 w-10 items-center justify-center rounded-full text-[#D70808] transition-colors hover:bg-[#FFF0F0]"
                            onClick={(e) => {
                                e.preventDefault();
                                document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            <ArrowDown size={22} className="animate-bounce" />
                        </a>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
}