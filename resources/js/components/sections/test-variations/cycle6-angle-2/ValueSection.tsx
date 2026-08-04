import { BookOpen, Target, Trophy, RefreshCcw, Brain, Users, Clock, TrendingUp } from 'lucide-react';
import LpButton from '@/components/ui/lp-button';
import SectionWrapper from '@/components/ui/section-wrapper';
import SocialProofMicro from '@/components/ui/social-proof-micro';
import { useAnalytics } from '@/hooks/use-analytics';

const pillars = [
    {
        Icon: Trophy,
        iconColor: '#EA580C', // Orange
        iconBg: '#FFEDD5',
        title: 'Mengurangi Risiko Gugur di Tahap Seleksi',
        pillLeft: '5-6 Bulan',
        pillLeftColor: '#D70808',
        pillRight: 'lebih awal, bisa dapat LoA duluan',
        desc: 'Sertifikat yang siap lebih dulu bisa dipakai daftar kampus tujuan. Kamu bisa dapat LoA Unconditional dan skip ujian seleksi bakat LPDP.',
    },
    {
        Icon: RefreshCcw,
        iconColor: '#EA580C', // Orange
        iconBg: '#FFEDD5',
        title: 'Tidak Perlu Panik Kalau Harus Tes Ulang',
        pillLeft: '2-3x',
        pillLeftColor: '#151515',
        pillRight: 'kesempatan retest',
        desc: 'Lolos target skor dalam sekali tes itu hampir mustahil. Hasil resmi baru keluar 3-14 hari kerja, dan tes ulang harus tunggu beberapa minggu.',
    },
    {
        Icon: Brain,
        iconColor: '#DB2777', // Pink
        iconBg: '#FCE7F3',
        title: 'Menaikkan Skor TOEFL Butuh Waktu',
        pillLeft: '5-6 Bulan',
        pillLeftColor: '#D70808',
        pillRight: 'waktu belajar & simulasi',
        desc: 'Bahasa adalah skill yang dilatih bertahap, bukan dihafal semalam. Waktu ini cukup untuk belajar, latihan, dan simulasi sebelum tes asli.',
    },
];

const whyPoints = [
    {
        Icon: BookOpen,
        title: 'Lembaga Resmi ITP & IIEF Jakarta',
        why: 'Sertifikat terjamin sah dan diakui langsung sebagai syarat submission beasiswa luar negeri.',
    },
    {
        Icon: TrendingUp,
        title: 'Alumni Lulus Beasiswa ke Luar Negeri',
        why: 'UK, Jerman, Australia: bukti nyata metode belajar bertahap ini bekerja, bukan sekadar janji.',
    },
    {
        Icon: Users,
        title: 'Pengajar Praktisi Skor 600+',
        why: 'Belajar dari yang sudah membuktikan sendiri skornya, bukan yang cuma tahu teori.',
    },
    {
        Icon: Clock,
        title: 'Cukup 1 Jam Sehari, Mulai dari Sekarang',
        why: 'Tidak perlu menunggu waktu luang besar. 1 jam sehari dari sekarang jauh lebih ringan daripada belajar maraton menjelang deadline.',
    },
];

export default function ValueSection() {
    const { trackCTA } = useAnalytics();
    return (
        <>
            <div
                style={{
                    lineHeight: 0,
                    marginTop: '-1px',
                    backgroundColor: '#F3F3F3',
                }}
            >
                <svg
                    viewBox="0 0 1440 56"
                    preserveAspectRatio="none"
                    style={{ display: 'block', width: '100%', height: '56px' }}
                >
                    <path
                        d="M0,28 C240,0 480,56 720,28 C960,0 1200,56 1440,28 L1440,0 L0,0 Z"
                        fill="#ffffff"
                    />
                </svg>
            </div>

            <SectionWrapper id="value" bg="white" className="py-20 md:py-28">
                <div className="mb-14 text-center">
                    <div
                        className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase"
                        style={{
                            backgroundColor: '#FFF0F0',
                            color: '#D70808',
                            border: '1px solid #ffb3b3',
                        }}
                    >
                        <span>🚫</span> MINDSETMU BIKIN GAGAL DAPAT BEASISWA
                    </div>
                    <h2
                        className="mb-5 text-2xl font-black sm:text-3xl md:text-4xl"
                        style={{
                            fontFamily: 'var(--font-heading)',
                            color: '#151515',
                        }}
                    >
                        Mindsetmu Sekarang Menentukan{' '}
                        <span style={{ color: '#D70808' }}>
                            Peluang Kamu Diterima Beasiswa
                        </span>
                    </h2>
                    <p
                        className="mx-auto max-w-xl text-base leading-relaxed"
                        style={{ color: '#3d3d3d' }}
                    >
                        TOEFL itu <strong style={{ color: '#151515' }}>bagian tersulit</strong> dari submission. Kamu <strong style={{ color: '#151515' }}>harus amankan skormu dari jauh hari</strong> agar kamu bisa <strong style={{ color: '#151515' }}>lolos beasiswa</strong> seperti 45.000+ alumni kami.
                    </p>
                </div>

                <div className="mb-14 grid gap-4 sm:grid-cols-2">
                    {/* Cara Lama — kiri */}
                    <div className="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-gray-50 p-6 sm:p-8">
                        <div className="mb-1 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-200 text-gray-500">
                                <BookOpen size={20} />
                            </div>
                            <p
                                className="text-base font-black text-gray-500"
                                style={{ fontFamily: 'var(--font-heading)' }}
                            >
                                Mindset Orang yang Gagal Beasiswa ✗
                            </p>
                        </div>
                        <div className="flex flex-col gap-3">
                            {[
                                'Menganggap TOEFL tinggal dikebut beberapa hari',
                                'Fokus urus syarat lain dulu, TOEFL belakangan',
                                'Baru serius belajar kalau deadline sudah di depan mata',
                                'Submit dengan skor pas-pasan, berharap masih diterima',
                            ].map((t) => (
                                <div
                                    key={t}
                                    className="flex items-start gap-3 text-sm text-gray-500 sm:text-base"
                                >
                                    <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                                    {t}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Metode Full Bright — kanan */}
                    <div
                        className="flex flex-col gap-4 rounded-3xl border p-6 sm:p-8"
                        style={{
                            borderColor: '#ffb3b3',
                            backgroundColor: '#FFFAFA',
                        }}
                    >
                        <div className="mb-1 flex items-center gap-3">
                            <div
                                className="flex h-10 w-10 items-center justify-center rounded-xl"
                                style={{ backgroundColor: '#D70808' }}
                            >
                                <Target size={20} color="white" />
                            </div>
                            <p
                                className="text-base font-black"
                                style={{
                                    color: '#D70808',
                                    fontFamily: 'var(--font-heading)',
                                }}
                            >
                                Mindset Orang yang Lolos Beasiswa ✓
                            </p>
                        </div>
                        <div className="flex flex-col gap-3">
                            {[
                                'TOEFL diselesaikan dari jauh hari, bukan dikebut',
                                'Begitu TOEFL beres, syarat tersulit submission sudah selesai',
                                'Skor 500+ tercapai dengan tenang, bukan panik di akhir',
                                'Peluang lolos beasiswa jauh lebih besar sejak awal',
                            ].map((t) => (
                                <div
                                    key={t}
                                    className="flex items-start gap-3 text-sm sm:text-base"
                                    style={{ color: '#151515' }}
                                >
                                    <div
                                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                                        style={{ backgroundColor: '#D70808' }}
                                    />
                                    {t}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mx-auto mb-10 max-w-2xl text-center">
                    {/* CHANGED: text-sm sm:text-base -> text-base sm:text-lg */}
                    <p className="mb-3 text-base font-medium italic text-gray-400 sm:text-lg">
                        "Kan masih ada waktu 5-6 bulan lagi, bulan depan aja
                        persiapannya..."
                    </p>
                    <p
                        className="text-lg font-bold sm:text-xl"
                        style={{ color: '#151515' }}
                    >
                        Justru{' '}
                        <span style={{ color: '#D70808' }}>
                            5-6 bulan itu waktu persiapan yang paling pas
                        </span>
                        , bukan alasan untuk menunda
                    </p>
                </div>

                <div className="mb-10 grid gap-6 md:grid-cols-3">
                    {pillars.map(
                        ({ Icon, iconColor, iconBg, title, pillLeft, pillLeftColor, pillRight, desc }) => (
                            <div
                                key={title}
                                className="flex flex-col gap-5 rounded-3xl border border-gray-100 bg-gray-50/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.05)]"
                            >
                                <div className="flex items-start gap-4 sm:items-center">
                                    <div
                                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                                        style={{ backgroundColor: iconBg }}
                                    >
                                        <Icon size={24} color={iconColor} strokeWidth={2.5} />
                                    </div>
                                    {/* CHANGED: text-sm sm:text-base -> text-base sm:text-lg */}
                                    <h3
                                        className="text-base leading-snug font-bold sm:text-lg"
                                        style={{ color: '#151515' }}
                                    >
                                        {title}
                                    </h3>
                                </div>

                                <div className="inline-flex w-max items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 shadow-sm">
                                    <span className="text-sm font-black" style={{ color: pillLeftColor }}>
                                        {pillLeft}
                                    </span>
                                    <div className="h-4 w-px bg-gray-200" />
                                    <span className="text-xs font-semibold text-gray-500">
                                        {pillRight}
                                    </span>
                                </div>

                                <p className="text-sm leading-relaxed text-gray-500">
                                    {desc}
                                </p>
                            </div>
                        ),
                    )}
                </div>

                <div className="text-center">
                    <div className="flex flex-col justify-center gap-3 sm:flex-row">
                        <LpButton
                            href="#pricing"
                            size="md"
                            onClick={() => trackCTA('value_primary', 'Gabung Sekarang →', '#pricing')}
                        >
                            Gabung Sekarang →
                        </LpButton>
                        <LpButton
                            href="#testimonials"
                            variant="ghost"
                            size="md"
                            onClick={() => trackCTA('value_testimonials', 'Lihat Bukti Alumni →', '#testimonials')}
                        >
                            Lihat Bukti Alumni →
                        </LpButton>
                    </div>
                    <SocialProofMicro />
                </div>
            </SectionWrapper>

                        <SectionWrapper bg="cultured" className="py-20 md:py-24">
                <div className="mb-12 text-center">
                    <div
                        className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase"
                        style={{
                            backgroundColor: '#FFF0F0',
                            color: '#D70808',
                            border: '1px solid #ffb3b3',
                        }}
                    >
                        <span>🏅</span> Mengapa Full Bright?
                    </div>
                    <h2
                        className="text-2xl font-black sm:text-3xl md:text-4xl"
                        style={{
                            fontFamily: 'var(--font-heading)',
                            color: '#151515',
                        }}
                    >
                        Mengapa{' '}
                        <span style={{ color: '#D70808' }}>45.000+</span> Orang
                        Memilih Full Bright?
                    </h2>
                </div>

                <div className="mx-auto mb-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:gap-6">
                    {whyPoints.map(({ Icon, title, why }) => (
                        <div
                            key={title}
                            className="flex items-start gap-4 sm:gap-5 rounded-3xl bg-white p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
                        >
                            <div
                                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                                style={{ backgroundColor: '#D70808' }}
                            >
                                <Icon size={22} color="white" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <p
                                    className="text-base leading-snug font-bold"
                                    style={{ color: '#151515' }}
                                >
                                    {title}
                                </p>
                                <p
                                    className="text-sm leading-relaxed"
                                    style={{ color: '#8a8a8a' }}
                                >
                                    {why}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <div className="flex flex-col justify-center gap-3 sm:flex-row">
                        <LpButton
                            href="#pricing"
                            size="md"
                            onClick={() => trackCTA('value_bottom', 'Gabung Sekarang →', '#pricing')}
                        >
                            Gabung Sekarang →
                        </LpButton>
                        <LpButton
                            href="#testimonials"
                            variant="ghost"
                            size="md"
                            onClick={() => trackCTA('value_bottom_testimonials', 'Lihat Bukti Alumni →', '#testimonials')}
                        >
                            Lihat Bukti Alumni →
                        </LpButton>
                    </div>
                </div>
            </SectionWrapper>
        </>
    );
}