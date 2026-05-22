import { useEffect, useState } from 'react';
import LpButton from '@/components/ui/lp-button';


function FullBrightLogo() {
    return <img src="/logo/Primary Logo.webp" alt="Full Bright Indonesia" width="160" height="160" className="w-40 h-auto object-contain" fetchPriority="high" loading="eager" decoding="async" />;
}

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100' : 'bg-white border-b border-gray-100 shadow-sm'}`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                <a href="#" className="flex items-center select-none">
                    <FullBrightLogo />
                </a>

                <nav />

                <div className="hidden md:block">
                    <LpButton href="#pricing" size="sm">Daftar Sekarang</LpButton>
                </div>
            </div>
        </header>
    );
}
