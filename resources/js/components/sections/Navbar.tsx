import { useEffect, useState } from 'react';
import LpButton from '@/components/ui/lp-button';

const links = [
    { label: 'Keunggulan', href: '#value' },
    { label: 'Testimoni',  href: '#testimonials' },
    { label: 'Harga',      href: '#pricing' },
    { label: 'FAQ',        href: '#faq' },
];

function FullBrightLogo() {
    return <img src="/logo/Primary Logo.webp" alt="Full Bright Indonesia" className="w-40 h-auto object-contain" />;
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

                <nav className="hidden md:flex items-center gap-7">
                    {links.map((l) => (
                        <a key={l.href} href={l.href} className="text-sm font-semibold transition-colors hover:text-[#D70808]" style={{ color: '#151515' }}>
                            {l.label}
                        </a>
                    ))}
                </nav>

                <div className="hidden md:block">
                    <LpButton href="#pricing" size="sm">Daftar Sekarang</LpButton>
                </div>
            </div>
        </header>
    );
}
