import { BookOpen, Users, Clock, TrendingUp } from 'lucide-react';
import LpButton from '@/components/ui/lp-button';
import SectionWrapper from '@/components/ui/section-wrapper';
import { useAnalytics } from '@/hooks/use-analytics';

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

export default function WhySection() {
    const { trackCTA } = useAnalytics();
    
    return (
        <SectionWrapper bg="cultured" className="py-20 md:py-24">
            <div className="mb-12 text-center">
                <div
                    className="mb-5 inline-flex items-center gap-2 rounded-full px-6 py-2 text-[12px] font-[800] uppercase tracking-widest sm:px-4 sm:py-1.5 sm:font-bold"
                    style={{
                        fontFamily: 'var(--font-heading)',
                        backgroundColor: '#FFF0F0',
                        color: '#D70808',
                        border: '1px solid #ffb3b3',
                    }}
                >
                    <span>🏅</span> Mengapa Full Bright?
                </div>
                {/* 👇 Updated font and sizes to match model on mobile 👇 */}
                <h2
                    className="text-[clamp(28px,3.6vw,42px)] font-black leading-[1.2] sm:text-3xl md:text-4xl md:leading-tight"
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
                        className="flex items-start gap-4 rounded-3xl bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:gap-5 sm:p-8"
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
                                className="text-[18px] font-[800] leading-snug sm:text-base sm:font-bold"
                                style={{ fontFamily: 'var(--font-heading)', color: '#151515' }}
                            >
                                {title}
                            </p>
                            <p
                                className="text-[15px] leading-[1.6] sm:text-sm sm:leading-relaxed"
                                style={{ fontFamily: 'var(--font-heading)', color: '#8a8a8a' }}
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
    );
}