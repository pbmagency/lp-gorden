import { ShieldCheck, Star, Award, Users, ArrowDown } from 'lucide-react';
import { memo } from 'react';
import LpButton from '@/components/ui/lp-button';
import SocialProofMicro from '@/components/ui/social-proof-micro';
import { useAnalytics } from '@/hooks/use-analytics';

const stats = [
    { icon: <Users size={18} />, value: '45.000+', label: 'Alumni Sukses' },
    { icon: <Star size={18} />, value: '4.9/5', label: 'Rating Alumni' },
    { icon: <Award size={18} />, value: '13+', label: 'Tahun Pengalaman' },
    {
        icon: <ShieldCheck size={18} />,
        value: 'Resmi',
        label: 'Lembaga ITP & IIEF',
    },
];

export default memo(function HeroSection() {
    const { trackCTA } = useAnalytics();

    return (
        <section
            id="hero"
            className="relative overflow-hidden bg-[linear-gradient(160deg,#fff_55%,#FFF5F5_100%)]"
        >
            <div
                className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#D70808] blur-[120px] opacity-[0.07] md:-top-24 md:-right-24"
            />
            <div
                className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-[#151515] blur-[100px] opacity-[0.05] md:-bottom-16 md:-left-16"
            />

            <div className="mx-auto max-w-6xl px-4 pt-10 pb-14 sm:px-6 lg:px-8">
                <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
                    {/* Left column — text content, full-width on mobile */}
                    <div className="flex flex-col gap-3 lg:gap-4">
                        {/* a. Badges */}
                        <div className="flex flex-wrap gap-2">
                            <div
                                className="inline-flex items-center gap-2 rounded-full border border-[#D1D5DB] bg-white px-4 py-1.5 text-xs font-bold tracking-wide text-[#151515]"
                            >
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            size={12}
                                            fill="#F59E0B"
                                            color="#F59E0B"
                                        />
                                    ))}
                                </div>
                                <span className="tracking-widest uppercase">
                                    45.000+ ALUMNI
                                </span>
                                <div className="ml-2 flex items-center -space-x-2">
                                    <img
                                        src="/people/People 1.webp"
                                        alt="alumni"
                                        decoding="async"
                                        className="h-5 w-5 rounded-full border-2 border-white object-cover"
                                    />
                                    <img
                                        src="/people/People 2.webp"
                                        alt="alumni"
                                        decoding="async"
                                        className="h-5 w-5 rounded-full border-2 border-white object-cover"
                                    />
                                    <img
                                        src="/people/People 3.webp"
                                        alt="alumni"
                                        decoding="async"
                                        className="h-5 w-5 rounded-full border-2 border-white object-cover"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* b. Headline */}
                        <h1
                            className="font-['var(--font-heading)'] text-3xl leading-tight font-black text-[#151515] sm:text-4xl lg:text-[2.75rem]"
                        >
                            <span className="block mb-2">Serius Soal Beasiswa?</span>
                            Capai{' '}
                            <span className="relative inline-block whitespace-nowrap">
                                <span className="relative z-10">TOEFL 500+ dalam</span>
                                <span
                                    className="absolute bottom-1 left-0 z-0 h-3 w-full bg-[#FFD700] sm:h-4"
                                />
                            </span>{' '}
                            <br className="hidden sm:block" />
                            <span className="relative inline-block whitespace-nowrap sm:mt-2">
                                <span className="relative z-10">15 Hari Buat Submission</span>
                                <span
                                    className="absolute bottom-1 left-0 z-0 h-3 w-full bg-[#FFD700] sm:h-4"
                                />
                            </span>
                        </h1>

                        {/* c. Sub-copy */}
                        <p
                            className="text-base leading-relaxed text-[#3d3d3d]"
                        >
                            Persiapkan <strong className="text-[#151515]">dari sekarang</strong> dengan strategi <strong className="text-[#151515]">belajar 1 jam sehari</strong> yang telah membantu <strong className="text-[#151515]">45.000+ alumni</strong> meraih <strong className="text-[#151515]">beasiswa impian</strong> mereka.
                        </p>

                        {/* d. Trust badges */}
                        <div className="flex flex-wrap gap-2">
                            {[
                                'Lembaga Resmi ITP & IIEF',
                                '13+ Tahun Pengalaman',
                            ].map((b) => (
                                <span
                                    key={b}
                                    className="inline-flex items-center gap-1 rounded-full bg-[#F3F4F6] px-3 py-1.5 text-xs font-semibold text-[#374151]"
                                >
                                    ✓ {b}
                                </span>
                            ))}
                        </div>

                        {/* e. CTA buttons */}
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <LpButton
                                href="#pricing"
                                size="md"
                                fullWidth
                                className="sm:w-auto bg-[#E60000] text-white hover:bg-[#CC0000]"
                                onClick={() =>
                                    trackCTA(
                                        'hero_primary',
                                        'Mulai Persiapan Beasiswa',
                                        '#pricing',
                                    )
                                }
                            >
                                Mulai Persiapan Beasiswa →
                            </LpButton>
                            <LpButton
                                href="#testimonials"
                                variant="outline"
                                size="md"
                                fullWidth
                                className="sm:w-auto border-[#E60000] bg-white text-[#151515] hover:bg-gray-50"
                                onClick={() =>
                                    trackCTA(
                                        'hero_secondary',
                                        'Lihat Bukti Alumni',
                                        '#testimonials',
                                    )
                                }
                            >
                                Lihat Bukti Alumni →
                            </LpButton>
                        </div>

                        <SocialProofMicro />
                    </div>

                    {/* Right column — score card, desktop only */}
                    <div className="hidden justify-center lg:flex lg:justify-end">
                        <div className="w-full max-w-[360px]">
                            <div className="relative">
                                <div
                                    className="rounded-3xl bg-[linear-gradient(145deg,#3d6ab0_0%,#1e3a6e_100%)] p-8 text-white shadow-[0_24px_80px_rgba(30,58,110,0.45),inset_0_1px_0_rgba(255,255,255,0.15)]"
                                >
                                    <p className="mb-2 text-sm font-semibold opacity-75">
                                        Rata-rata skor TOEFL alumni kami menuju
                                        target beasiswa
                                    </p>
                                    <div className="mb-2 flex items-end gap-3">
                                        <p
                                            className="font-['var(--font-heading)'] text-6xl font-black text-[#F59E0B]"
                                        >
                                            600
                                        </p>
                                        <div className="pb-1">
                                            <p
                                                className="text-sm font-black text-[#4ade80]"
                                            >
                                                +100 poin
                                            </p>
                                            <p className="text-xs opacity-60">
                                                rata-rata kenaikan
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        className="mb-6 h-px bg-[rgba(255,255,255,0.15)]"
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        {stats.map((s) => (
                                            <div
                                                key={s.label}
                                                className="rounded-2xl bg-[rgba(255,255,255,0.1)] p-3 text-center"
                                            >
                                                <p
                                                    className="font-['var(--font-heading)'] mb-0.5 text-xl font-black"
                                                >
                                                    {s.value}
                                                </p>
                                                <p className="text-xs opacity-70">
                                                    {s.label}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div
                                    className="absolute -bottom-5 -left-4 flex max-w-[220px] items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.14)]"
                                >
                                    <span className="text-2xl">🎓</span>
                                    <p
                                        className="font-['var(--font-heading)'] text-xs leading-snug font-black text-[#151515]"
                                    >
                                        Alumni kami tersebar di seluruh dunia
                                    </p>
                                </div>

                                <div
                                    className="absolute -top-4 -right-4 flex items-center gap-1.5 rounded-2xl bg-white px-3 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
                                >
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            size={12}
                                            fill="#F59E0B"
                                            color="#F59E0B"
                                        />
                                    ))}
                                    <span
                                        className="ml-1 text-xs font-black text-[#151515]"
                                    >
                                        4.9
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-center pb-8 pt-4">
                <a 
                    href="#pricing"
                    className="flex h-12 w-12 animate-bounce cursor-pointer items-center justify-center rounded-full border border-[#E5E7EB] bg-slate-100 transition-colors hover:bg-slate-200"
                    onClick={(e) => {
                        e.preventDefault();
                        document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                >
                    <ArrowDown size={24} className="text-slate-600" />
                </a>
            </div>

            <div className="-mb-[1px] leading-[0]">
                <svg
                    viewBox="0 0 1440 56"
                    preserveAspectRatio="none"
                    className="block h-8 w-full md:h-14"
                >
                    <path
                        d="M0,28 C240,56 480,0 720,28 C960,56 1200,0 1440,28 L1440,56 L0,56 Z"
                        fill="#F3F3F3"
                    />
                </svg>
            </div>
        </section>
    );
});