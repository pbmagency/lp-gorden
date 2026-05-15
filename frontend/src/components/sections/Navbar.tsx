import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Button from '../ui/Button';

const links = [
  { label: 'Keunggulan', href: '#value' },
  { label: 'Testimoni', href: '#testimonials' },
  { label: 'Harga', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

function FullBrightLogo() {
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="38" height="38" rx="9" fill="#D70808" />
      {/* F */}
      <rect x="7" y="10" width="11" height="2.5" rx="1.25" fill="white" />
      <rect x="7" y="10" width="2.5" height="18" rx="1.25" fill="white" />
      <rect x="7" y="17.75" width="8.5" height="2.5" rx="1.25" fill="white" />
      {/* B */}
      <rect x="21" y="10" width="2.5" height="18" rx="1.25" fill="white" />
      <rect x="21" y="10" width="8" height="2.5" rx="1.25" fill="white" />
      <rect x="21" y="18.25" width="8" height="2.5" rx="1.25" fill="white" />
      <rect x="21" y="25.5" width="8" height="2.5" rx="1.25" fill="white" />
      <path d="M29 12.5 Q33.5 12.5 33.5 16.75 Q33.5 20.75 29 20.75" stroke="white" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M29 20.75 Q34.5 20.75 34.5 25 Q34.5 28 29 28" stroke="white" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100'
        : 'bg-white border-b border-gray-100 shadow-sm'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 select-none">
          <FullBrightLogo />
          <div className="flex flex-col leading-none">
            <span className="font-black text-[15px] tracking-tight" style={{ fontFamily: 'var(--font-heading)', color: '#D70808' }}>
              Full Bright
            </span>
            <span className="font-bold text-[9px] tracking-[0.14em] uppercase mt-0.5" style={{ color: '#151515' }}>
              Indonesia
            </span>
          </div>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-semibold transition-colors hover:text-[#D70808]"
              style={{ color: '#151515', fontFamily: 'var(--font-body)' }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button href="#pricing" size="sm">Daftar Sekarang</Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 pt-2 space-y-2">
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm font-semibold hover:text-[#D70808] transition-colors"
              style={{ color: '#151515' }}
            >
              {l.label}
            </a>
          ))}
          <Button href="#pricing" size="sm" fullWidth onClick={() => setOpen(false)}>
            Daftar Sekarang
          </Button>
        </div>
      )}
    </header>
  );
}
