import { useEffect, useState, memo } from 'react';
import LpButton from '@/components/ui/lp-button';


const FullBrightLogo = memo(() => {
    return <img src="/logo/Primary Logo.webp" alt="Full Bright Indonesia" className="w-40 h-auto object-contain" fetchPriority="high" loading="eager" decoding="sync" />;
});

const Navbar = memo(() => {
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

                <a href="#pricing" className="flex items-center gap-2 md:gap-3 bg-gradient-to-r from-red-700 to-red-800 text-white pl-3 md:pl-4 pr-4 md:pr-5 py-2 md:py-2.5 rounded-full hover:from-red-800 hover:to-red-900 transition-all duration-200 shadow-lg hover:shadow-xl group">
                    <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm">
                        <span className="line-through opacity-75">Rp1.000rb</span>
                        <span className="text-yellow-300 font-bold">•</span>
                        <span className="font-medium opacity-90">Rp250rb</span>
                    </div>
                    <div className="w-px h-5 md:h-6 bg-white/30 mx-0.5 md:mx-1" />
                    <span className="text-xs md:text-sm font-bold group-hover:translate-x-0.5 transition-transform whitespace-nowrap">Amankan Seat →</span>
                </a>
            </div>
        </header>
    );
});

export default Navbar;
