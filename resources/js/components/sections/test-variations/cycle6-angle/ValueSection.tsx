import { BookOpen, Clock, Target, TrendingUp, Users, Zap } from 'lucide-react';
import LpButton from '@/components/ui/lp-button';
import SectionWrapper from '@/components/ui/section-wrapper';
import SocialProofMicro from '@/components/ui/social-proof-micro';
import { useAnalytics } from '@/hooks/use-analytics';

const pillars = [
    {
        Icon: Target,
        accentColor: '#D70808',
        borderColor: '#D70808',
        title: 'TOEFL Pattern Recognition Method™',
        desc: 'Belajar pola soal yang paling sering muncul agar target skor untuk submission lebih cepat tercapai, tanpa menghabiskan waktu mempelajari semua materi.',
    },
    {
        Icon: Zap,
        accentColor: '#151515',
        borderColor: '#151515',
        title: 'Shortcut Structure Framework™',
        desc: 'Roadmap belajar disesuaikan dengan target beasiswa dan waktu submission, sehingga kamu fokus pada materi yang paling berdampak untuk mencapai skor.',
    },
    {
        Icon: TrendingUp,
        accentColor: '#D70808',
        borderColor: '#D70808',
        title: 'Score-Focused Learning System™',
        desc: 'Setiap sesi belajar difokuskan pada target skor yang dibutuhkan untuk submission, sehingga progresmu selalu mengarah ke tujuan yang jelas.',
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
        why: 'UK, Jerman, Australia: bukti nyata strategi submission ini bekerja, bukan sekadar janji.',
    },
    {
        Icon: Users,
        title: 'Pengajar Praktisi Skor 600+',
        why: 'Belajar dari yang sudah membuktikan sendiri skornya, bukan yang cuma tahu teori.',
    },
    {
        Icon: Clock,
        title: 'Evaluasi Progress Mingguan, Fleksibel',
        why: 'Progress belajarmu dipantau tiap minggu, cocok untuk mahasiswa dan karyawan sibuk yang mengejar deadline submission.',
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
                        💡 Metode Eksklusif Full Bright
                    </div>
                    <h2
                        className="mb-5 text-2xl font-black sm:text-3xl md:text-4xl"
                        style={{
                            fontFamily: 'var(--font-heading)',
                            color: '#151515',
                        }}
                    >
                        Bukan Cuma Belajar Grammar,{' '}
                        <span style={{ color: '#D70808' }}>
                            Tapi Ada Strategi Submission
                        </span>{' '}
                        yang Jelas.
                    </h2>
                    <p
                        className="mx-auto max-w-xl text-base leading-relaxed"
                        style={{ color: '#3d3d3d' }}
                    >
                        Ini cara Full Bright membantu{' '}
                        <strong style={{ color: '#151515' }}>
                            45.000+ orang
                        </strong>{' '}
                        mengubah submission yang tadinya ditolak jadi diterima
                        di kampus impian mereka.
                    </p>
                </div>

                <div className="mb-14 grid gap-4 sm:grid-cols-2">
                    {/* Cara Lama — kiri */}
                    <div className="flex flex-col gap-3 rounded-2xl border-2 border-gray-200 bg-gray-50 p-6">
                        <div className="mb-1 flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-300">
                                <BookOpen size={16} color="white" />
                            </div>
                            <p
                                className="text-sm font-black text-gray-400"
                                style={{ fontFamily: 'var(--font-heading)' }}
                            >
                                Cara Lama ✗
                            </p>
                        </div>
                        {[
                            'Belajar grammar random tanpa strategi submission',
                            'Submit apply apa adanya, berharap TOEFL kepake',
                            'Tidak ada yang mengevaluasi progress tiap minggu',
                            'Skor stuck, deadline submission makin dekat',
                        ].map((t) => (
                            <div
                                key={t}
                                className="flex items-center gap-2 text-sm text-gray-400"
                            >
                                <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300" />
                                {t}
                            </div>
                        ))}
                    </div>
                    {/* Metode Full Bright — kanan */}
                    <div
                        className="flex flex-col gap-3 rounded-2xl border-2 p-6"
                        style={{
                            borderColor: '#D70808',
                            backgroundColor: '#FFF0F0',
                        }}
                    >
                        <div className="mb-1 flex items-center gap-2">
                            <div
                                className="flex h-8 w-8 items-center justify-center rounded-lg"
                                style={{ backgroundColor: '#D70808' }}
                            >
                                <Target size={16} color="white" />
                            </div>
                            <p
                                className="text-sm font-black"
                                style={{
                                    color: '#D70808',
                                    fontFamily: 'var(--font-heading)',
                                }}
                            >
                                Metode Full Bright ✓
                            </p>
                        </div>
                        {[
                            'Strategi submit disesuaikan jurusan & rencana kontribusi',
                            'Evaluasi progress mingguan, bukan asal jalan sendiri',
                            'Dibimbing sampai skor target tercapai',
                            'Sudah membantu 45.000+ alumni lolos beasiswa',
                        ].map((t) => (
                            <div
                                key={t}
                                className="flex items-center gap-2 text-sm"
                                style={{ color: '#151515' }}
                            >
                                <div
                                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                                    style={{ backgroundColor: '#D70808' }}
                                />
                                {t}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-10 grid gap-6 md:grid-cols-3">
                    {pillars.map(
                        ({ Icon, accentColor, borderColor, title, desc }) => (
                            <div
                                key={title}
                                className="flex cursor-default flex-col gap-5 rounded-2xl border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-gray-200 hover:shadow-[0_20px_56px_rgba(0,0,0,0.1)]"
                                style={{
                                    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                                    borderLeft: `4px solid ${borderColor}`,
                                }}
                            >
                                <div
                                    className="flex h-12 w-12 items-center justify-center rounded-2xl"
                                    style={{
                                        backgroundColor:
                                            accentColor === '#D70808'
                                                ? '#FFF0F0'
                                                : '#F3F3F3',
                                    }}
                                >
                                    <Icon
                                        size={22}
                                        color={accentColor}
                                        strokeWidth={2.5}
                                    />
                                </div>
                                <h3
                                    className="text-base leading-snug font-black"
                                    style={{
                                        fontFamily: 'var(--font-heading)',
                                        color: '#151515',
                                    }}
                                >
                                    {title}
                                </h3>
                                <p
                                    className="text-sm leading-relaxed"
                                    style={{ color: '#3d3d3d' }}
                                >
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
                        🏅 Mengapa Full Bright?
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
                <div className="mx-auto mb-10 grid max-w-3xl gap-4 sm:grid-cols-2">
                    {whyPoints.map(({ Icon, title, why }) => (
                        <div
                            key={title}
                            className="flex items-start gap-4 rounded-2xl bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                            style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}
                        >
                            <div
                                className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                                style={{ backgroundColor: '#D70808' }}
                            >
                                <Icon size={16} color="white" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p
                                    className="text-sm leading-snug font-bold"
                                    style={{ color: '#151515' }}
                                >
                                    {title}
                                </p>
                                <p
                                    className="text-xs leading-relaxed"
                                    style={{ color: '#6b7280' }}
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
