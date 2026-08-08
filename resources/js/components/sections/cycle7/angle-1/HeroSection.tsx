import { ShieldCheck, Star, Award, Users, ArrowDown } from 'lucide-react';
import { memo } from 'react';
import LpButton from '@/components/ui/lp-button';
import { useAnalytics } from '@/hooks/use-analytics';
import SocialProofMicro from '@/components/ui/social-proof-micro';
// Note: We removed <SocialProofMicro /> because we are now using the exact hardcoded rating line from the HTML model

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
            <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#D70808] opacity-[0.07] blur-[120px]" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#151515] opacity-[0.05] blur-[100px]" />

            <div className="mx-auto max-w-6xl px-6 pb-4 pt-10 max-[499px]:pb-6 max-[499px]:pt-6">
                <div className="grid items-center gap-10 min-[900px]:grid-cols-[1fr_auto]">
                    {/* Left column */}
                    <div className="flex flex-col gap-4">
                        {/* a. Badges */}
                        <div className="flex flex-wrap gap-2 max-[499px]:flex-col max-[499px]:items-start">
                            <div className="inline-flex w-fit items-center gap-2 rounded-full border-[1.5px] border-[#151515] bg-transparent px-4 py-1.5 text-xs font-bold uppercase tracking-[0.05em] text-[#374151]">
                                <div className="flex items-center gap-[2px]">
                                    <Star size={12} fill="#F59E0B" color="#F59E0B" />
                                    <Star size={12} fill="#F59E0B" color="#F59E0B" />
                                    <Star size={12} fill="#F59E0B" color="#F59E0B" />
                                    <Star size={12} fill="#F59E0B" color="#F59E0B" />
                                    <Star size={12} fill="#F59E0B" color="#F59E0B" />
                                </div>
                                <span className="tracking-[0.08em]">
                                    45.000+ ALUMNI
                                </span>
                                <div className="ml-2 flex items-center -space-x-2">
                                    <img
                                        src="/people/People 1.webp"
                                        alt="alumni"
                                        className="h-5 w-5 rounded-full border-2 border-white object-cover"
                                    />
                                    <img
                                        src="/people/People 2.webp"
                                        alt="alumni"
                                        className="h-5 w-5 rounded-full border-2 border-white object-cover"
                                    />
                                    <img
                                        src="/people/People 3.webp"
                                        alt="alumni"
                                        className="h-5 w-5 rounded-full border-2 border-white object-cover"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* b. Headline */}
                        <h1 className="font-['var(--font-heading)'] text-[clamp(32px,4vw,44px)] font-black leading-[1.15] text-[#151515] max-[499px]:text-[32px]">
                            Serius Soal Beasiswa?
                            <br />
                            Capai{' '}
                            {/* This is where we translated the exact HTML highlight logic to Tailwind */}
                            <span className="box-decoration-clone bg-[linear-gradient(#F5B700,#F5B700)] bg-[length:100%_12px] bg-[position:0_100%] bg-no-repeat px-[2px] [-webkit-box-decoration-break:clone]">
                                TOEFL 500+ dalam <br className="hidden sm:block" /> 15 Hari Buat Submission
                            </span>
                        </h1>

                        {/* c. Sub-copy */}
                        <p className="text-base leading-[1.6] text-[#3d3d3d]">
                            <b>Persiapkan dari</b>{' '}
                            <strong className="text-[#151515]">sekarang</strong>{' '}
                            dengan strategi{' '}
                            <strong className="text-[#151515]">
                                belajar 1 jam sehari
                            </strong>{' '}
                            yang telah membantu{' '}
                            <strong className="text-[#151515]">
                                45.000+ alumni
                            </strong>{' '}
                            meraih <b>beasiswa impian</b> mereka.
                        </p>

                        {/* d. Trust badges */}
                        <div className="flex flex-wrap gap-2 max-[499px]:hidden">
                            {['Lembaga Resmi ITP & IIEF', '13+ Tahun Pengalaman'].map(
                                (b) => (
                                    <span
                                        key={b}
                                        className="inline-flex items-center gap-1 rounded-full border border-[#e5e7eb] bg-[#F3F4F6] px-3 py-1.5 text-xs font-semibold text-[#374151]"
                                    >
                                        ✓ {b}
                                    </span>
                                ),
                            )}
                        </div>

                        {/* e. CTA buttons */}
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-wrap gap-3">
                                <LpButton
                                    href="#pricing"
                                    size="md"
                                    className="rounded-[16px] bg-[#D70808] px-7 py-3.5 text-[16px] font-bold text-white shadow-[0_4px_20px_rgba(215,8,8,0.35)]"
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
                                    className="rounded-[16px] border-2 border-[#151515] bg-transparent px-7 py-3.5 text-[16px] font-bold text-[#151515]"
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
                    </div>

                    {/* Right column — score card */}
                    {/* 👇 Hidden on <900px screens based on model breakpoints 👇 */}
                    <div className="hidden justify-center min-[900px]:flex">
                        <div className="relative w-full max-w-[360px]">
                            <div className="rounded-[24px] bg-[linear-gradient(145deg,#3d6ab0_0%,#1e3a6e_100%)] p-8 text-white shadow-[0_24px_80px_rgba(30,58,110,0.45),inset_0_1px_0_rgba(255,255,255,0.15)]">
                                <p className="mb-2 text-sm font-semibold opacity-75">
                                    Rata-rata skor TOEFL alumni kami menuju
                                    target beasiswa
                                </p>
                                <div className="mb-2 flex items-end gap-3">
                                    <p className="font-['var(--font-heading)'] text-[60px] font-black leading-none text-[#F59E0B]">
                                        600
                                    </p>
                                    <div className="pb-1">
                                        <p className="text-sm font-black text-[#4ade80]">
                                            +100 poin
                                        </p>
                                        <p className="text-xs opacity-60">
                                            rata-rata kenaikan
                                        </p>
                                    </div>
                                </div>
                                <div className="mb-6 h-px bg-[rgba(255,255,255,0.15)]" />
                                <div className="grid grid-cols-2 gap-3">
                                    {stats.map((s) => (
                                        <div
                                            key={s.label}
                                            className="rounded-[16px] bg-[rgba(255,255,255,0.1)] p-3 text-center"
                                        >
                                            <p className="font-['var(--font-heading)'] mb-[2px] text-[20px] font-black">
                                                {s.value}
                                            </p>
                                            <p className="text-xs opacity-70">
                                                {s.label}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="absolute -bottom-5 -left-4 flex max-w-[220px] items-center gap-3 rounded-[16px] bg-white px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.14)]">
                                <span className="text-[24px]">🎓</span>
                                <p className="font-['var(--font-heading)'] text-xs font-black leading-[1.3] text-[#151515]">
                                    Alumni kami tersebar di seluruh dunia
                                </p>
                            </div>

                            <div className="absolute -right-4 -top-4 flex items-center gap-1.5 rounded-[16px] bg-white px-3 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
                                <span className="text-[#F59E0B]">★★★★★</span>
                                <span className="ml-1 text-xs font-black text-[#151515]">
                                    4.9
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative flex justify-center pb-1">
                <div
                    className="flex h-[52px] w-[52px] animate-bounce cursor-pointer items-center justify-center rounded-full border border-[#e5e7eb] bg-[#F3F4F6] text-[#374151]"
                    onClick={(e) => {
                        e.preventDefault();
                        document
                            .querySelector('#pricing')
                            ?.scrollIntoView({ behavior: 'smooth' });
                    }}
                >
                    <ArrowDown strokeWidth={3} size={22} />
                </div>
            </div>

            <div className="-mb-[1px] leading-[0]">
                <svg
                    viewBox="0 0 1440 56"
                    preserveAspectRatio="none"
                    className="block h-[56px] w-full"
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