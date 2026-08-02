import { memo } from 'react';

const alumniUniversitiesRaw = [
    { name: 'Logo 1', logo: '/logo/logo1.webp' },
    { name: 'Logo 2', logo: '/logo/logo2.webp' },
    { name: 'Logo 3', logo: '/logo/logo3.webp' },
    { name: 'Logo 4', logo: '/logo/logo4.webp' },
    { name: 'Logo 5', logo: '/logo/logo5.webp' },
    { name: 'Logo 6', logo: '/logo/logo6.webp' },
    { name: 'Logo 7', logo: '/logo/logo7.webp' },
    { name: 'Logo 8', logo: '/logo/logo8.webp' },
    { name: 'Logo 9', logo: '/logo/logo9.webp' },
    { name: 'Logo 10', logo: '/logo/logo10.webp' },
];

const alumniUniversitiesData = [...alumniUniversitiesRaw, ...alumniUniversitiesRaw];

export default memo(function LogoBar() {
    return (
        <div className="overflow-hidden bg-[#F3F3F3] py-8">
            <p className="mb-[18px] text-center text-xs font-bold tracking-[0.08em] uppercase text-gray-400">
                Alumni Kami Sekarang Kuliah Di
            </p>
            <div
                className="overflow-hidden"
                style={{
                    maskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)'
                }}
            >
                <div className="infinite-track">
                    {alumniUniversitiesData.map((u, i) => (
                        <div
                            key={`${u.name}-${i}`}
                            role="img"
                            aria-label={u.name}
                            className="mx-5 h-16 w-28 shrink-0 bg-contain bg-center bg-no-repeat"
                            style={{ backgroundImage: `url('${u.logo}')` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
});