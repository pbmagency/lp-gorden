const logos = [
    { src: '/logo/Kompas-TV.webp',    alt: 'Kompas TV' },
    { src: '/logo/liputan6.webp',     alt: 'Liputan6' },
    { src: '/logo/detikcom.webp',     alt: 'Detik.com' },
    { src: '/logo/tribunnews.webp',   alt: 'Tribun News' },
    { src: '/logo/INews.webp',        alt: 'iNews' },
    { src: '/logo/logojpnncom.webp',  alt: 'JPNN' },
];

export default function SocialProofLogoBar() {
    return (
        <div className="w-full py-8 px-4" style={{ backgroundColor: '#F9F9F9', borderBottom: '1px solid #e5e7eb' }}>
            <p className="text-center text-xs font-bold uppercase tracking-widest mb-6" style={{ color: '#9ca3af' }}>
                Dipercaya & Diliput Media Nasional
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8">
                {logos.map((logo) => (
                    <img
                        key={logo.alt}
                        src={logo.src}
                        alt={logo.alt}
                        loading="lazy"
                        className="h-7 w-auto object-contain select-none"
                        style={{ filter: 'grayscale(100%)', opacity: 0.6 }}
                    />
                ))}
            </div>
        </div>
    );
}
