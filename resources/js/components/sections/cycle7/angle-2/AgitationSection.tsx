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
        <SectionWrapper bg="cultured" className="py-[80px] px-6 md:py-20" id="agitation">
            <div className="mx-auto max-w-4xl">
                {/* Tag */}
                <div className="mb-8 text-center md:mb-10">
                    <div
                        className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#ffb3b3] bg-[#FFF0F0] px-4 py-1.5 text-[12px] font-[700] uppercase tracking-[0.08em] text-[#D70808]"
                        style={{ fontFamily: 'var(--font-heading)' }}
                    >
                        KENAPA BANYAK PEJUANG BEASISWA GAGAL DI TOEFL?
                    </div>

                    {/* Headline */}
                    <h2
                        className="mb-5 text-[clamp(24px,3vw,36px)] font-[900] leading-[1.3] text-[#151515] sm:text-3xl sm:font-black md:text-[2.5rem] md:leading-tight"
                        style={{ fontFamily: 'var(--font-heading)' }}
                    >
                        Bukan Karena Kurang Mampu, <br className="hidden sm:block" />
                        <span className="text-[#D70808]">
                            Tapi Salah Langkah dari Awal.
                        </span>
                    </h2>

                    {/* Subheadline */}
                    <div className="mx-auto max-w-[576px] text-[16px] leading-[1.6] text-[#3d3d3d] sm:text-base sm:text-[#666666] md:text-[17px]">
                        <p className="mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                            Target beasiswa sudah ada, tapi kebanyakan orang menunda TOEFL, setelah itu baru belajar dengan metode yang salah.
                        </p>
                        <p style={{ fontFamily: 'var(--font-heading)' }}>
                            Coba jujur, kamu pernah kepikiran seperti ini?
                        </p>
                    </div>
                </div>

                {/* List Block */}
                <div className="mx-auto mb-8 max-w-3xl overflow-hidden rounded-[16px] border border-gray-100 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                    <div className="flex flex-col">
                        {thoughts.map((item, i) => (
                            <div 
                                key={i} 
                                className="flex items-center gap-4 border-b border-gray-100 p-5 sm:p-5 last:border-b-0"
                            >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFF0F0] text-[#D70808]">
                                    <Check size={18} strokeWidth={3} />
                                </div>
                                <p
                                    className="text-[14px] font-[700] text-gray-700 sm:text-[15px]"
                                    style={{ fontFamily: 'var(--font-heading)' }}
                                >
                                    {item}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Warning */}
                <div className="mb-10 text-center">
                    <p
                        className="text-[18px] font-[800] text-[#151515] sm:text-[19px]"
                        style={{ fontFamily: 'var(--font-heading)' }}
                    >
                        ⚠️ Kalau iya, hati-hati.
                    </p>
                </div>

                {/* Fact Box */}
                <div className="mx-auto mb-10 max-w-3xl rounded-[24px] border border-gray-100 bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] sm:p-10 md:mb-12">
                    <p className="mb-4 text-center text-[12px] font-[800] uppercase tracking-[0.1em] text-gray-400">
                        Fakta yang harus kamu tahu
                    </p>
                    <h3
                        className="mb-3 text-center text-[clamp(22px,3vw,36px)] font-[900] text-[#151515] sm:text-3xl sm:font-black"
                        style={{ fontFamily: 'var(--font-heading)' }}
                    >
                        <span className="text-[38px] text-[#D70808] sm:text-[44px]">82%</span>{' '}
                        Pejuang Beasiswa Gagal
                    </h3>
                    <p
                        className="mx-auto max-w-xl text-center text-[16px] leading-[1.6] text-[#3d3d3d] sm:text-[15px]"
                        style={{ fontFamily: 'var(--font-heading)' }}
                    >
                        karena menunda TOEFL, lalu buru-buru belajar sendiri dengan metode yang salah.
                    </p>
                </div>

                {/* Closing Bridge */}
                <div className="space-y-4 text-center">
                    <p
                        className="text-[18px] font-[800] leading-[1.6] text-[#151515] sm:text-[18px] md:text-[19px]"
                        style={{ fontFamily: 'var(--font-heading)' }}
                    >
                        Mindsetmu harus segera diubah, sebelum submissionmu gagal.
                    </p>

                    <div className="flex justify-center pt-2">
                        <a 
                            href="#pricing"
                            className="flex h-12 w-12 items-center justify-center rounded-full text-[#D70808] transition-colors hover:bg-[#FFF0F0]"
                            onClick={(e) => {
                                e.preventDefault();
                                document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            <ArrowDown size={24} className="animate-bounce" />
                        </a>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
}