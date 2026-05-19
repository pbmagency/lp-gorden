import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

import UrgencyBanner       from '@/components/sections/UrgencyBanner';
import Navbar              from '@/components/sections/Navbar';
import HeroSection         from '@/components/sections/HeroSection';
import SocialProofLogoBar  from '@/components/sections/SocialProofLogoBar';
import AgitationSection    from '@/components/sections/AgitationSection';
import ValueSection        from '@/components/sections/ValueSection';
import SocialProofSection  from '@/components/sections/SocialProofSection';
import PricingSection      from '@/components/sections/PricingSection';
import FAQSection          from '@/components/sections/FAQSection';
import Footer              from '@/components/sections/Footer';

import { useAnalytics }      from '@/hooks/use-analytics';
import { useScrollTracking } from '@/hooks/use-scroll-tracking';
import { useDwellTime }      from '@/hooks/use-dwell-time';

export default function Landing() {
    const { trackVisit } = useAnalytics();

    useEffect(() => {
        const html    = document.documentElement;
        const wasDark = html.classList.contains('dark');
        html.classList.remove('dark');
        return () => { if (wasDark) html.classList.add('dark'); };
    }, []);

    useScrollTracking();
    useDwellTime();

    useEffect(() => { trackVisit(); }, [trackVisit]);

    return (
        <>
            <Head>
                <title>Full Bright Indonesia – Spesialis TOEFL & IELTS Sejak 2013 | 45.000+ Alumni</title>
                <meta name="description" content="Full Bright Indonesia – Spesialis TOEFL & IELTS Sejak 2013. Metode 30 Jam, 1 Jam 1 Hari. 45.000+ alumni sukses raih skor TOEFL ITP dalam 10–15 hari. Lembaga resmi ITP & IIEF Jakarta." />
                <meta name="keywords" content="belajar TOEFL online, kursus TOEFL ITP, TOEFL LPDP, TOEFL CPNS, TOEFL BUMN, Full Bright Indonesia" />
            </Head>

            <div className="min-h-screen bg-white">
                <UrgencyBanner />
                <Navbar />
                <HeroSection />
                <SocialProofLogoBar />
                <AgitationSection />
                <ValueSection />
                <SocialProofSection />
                <PricingSection />
                <FAQSection />
                <Footer />
            </div>
        </>
    );
}
