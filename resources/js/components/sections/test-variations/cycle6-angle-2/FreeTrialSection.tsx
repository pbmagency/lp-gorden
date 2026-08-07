import LpButton from '@/components/ui/lp-button';
import { useAnalytics } from '@/hooks/use-analytics';

const FREE_TRIAL_URL = 'https://class.fullbrightindonesia.com/register';

export default function FreeTrialSection() {
    const { trackCTA } = useAnalytics();

    return (
        <section
            id="free-trial"
            className="bg-[#F3F3F3] px-4 py-14 sm:px-6 lg:px-8"
        >
            <div
                className="mx-auto max-w-3xl rounded-3xl border border-gray-200 bg-white px-6 py-10 text-center sm:px-10"
                style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
            >
                <div
                    className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase"
                    style={{
                        backgroundColor: '#FFF0F0',
                        color: '#D70808',
                        border: '1px solid #ffb3b3',
                    }}
                >
                    🎁 Coba Dulu, Gratis
                </div>

                <h2
                    className="mb-3 text-2xl font-black sm:text-3xl"
                    style={{
                        fontFamily: 'var(--font-heading)',
                        color: '#151515',
                    }}
                >
                    Belum Yakin? Intip Dulu Materi LMS Kami
                </h2>

                <p
                    className="mx-auto mb-7 max-w-xl text-base leading-relaxed"
                    style={{ color: '#3d3d3d' }}
                >
                    Daftar gratis dan lihat sendiri isi kelas, video materi, dan
                    sistem evaluasi progress mingguan sebelum kamu memutuskan
                    untuk lanjut ke paket berbayar.
                </p>

                <LpButton
                    href={FREE_TRIAL_URL}
                    variant="secondary"
                    size="md"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                        trackCTA(
                            'free_trial',
                            'Coba Gratis Sekarang',
                            FREE_TRIAL_URL,
                        )
                    }
                >
                    Coba Gratis Sekarang →
                </LpButton>
            </div>
        </section>
    );
}
