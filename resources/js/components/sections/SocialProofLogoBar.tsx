const logos = [
    { src: '/logo/Kompas-Com.webp',         alt: 'Kompas TV' },
    { src: '/logo/liputan6.webp',          alt: 'Liputan6' },
    { src: '/logo/detikcom.webp',          alt: 'Detik.com' },
    { src: '/logo/TribunJakartaLogo.webp', alt: 'Tribun Jakarta', scale: 1.4 },
    { src: '/logo/Poskota.webp',           alt: 'Poskota',        scale: 1.5 },
    { src: '/logo/BeritaSatu2.webp',        alt: 'Berita Satu' },
];

import { memo } from 'react';

const LogoItem = memo(({ logo, index }) => (
    <div key={index} className="shrink-0 flex items-center justify-center" style={{ width: '110px', height: '36px' }}>
        <img
            src={logo.src}
            alt={logo.alt}
            loading="lazy"
            decoding="async"
            className="max-h-full max-w-full w-auto h-auto object-contain select-none"
            style={{ filter: 'grayscale(100%)', opacity: 0.6, transform: logo.scale ? `scale(${logo.scale})` : undefined }}
        />
    </div>
));

const SocialProofLogoBar = memo(() => {
    // Triple logos for seamless looping tanpa gap
    const duplicatedLogos = [...logos, ...logos, ...logos];

    return (
        <div className="w-full py-8 px-4" style={{ backgroundColor: '#F9F9F9', borderBottom: '1px solid #e5e7eb' }}>
            <p className="text-center text-xs font-bold uppercase tracking-widest mb-6" style={{ color: '#9ca3af' }}>
                Dipercaya & Diliput Media Nasional
            </p>
            <div className="overflow-hidden">
                <div className="infinite-track flex gap-8" style={{ animationDuration: '30s' }}>
                    {duplicatedLogos.map((logo, i) => (
                        <LogoItem key={i} logo={logo} index={i} />
                    ))}
                </div>
            </div>
        </div>
    );
});

export default SocialProofLogoBar;
