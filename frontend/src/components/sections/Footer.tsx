import { Mail, MapPin, Star } from 'lucide-react';

// ─── Inline SVG brand icons (tidak bergantung lucide-react) ───────────────────

function InstagramIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.31 6.31 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.67a8.18 8.18 0 004.78 1.52V6.74a4.85 4.85 0 01-1.01-.05z"/>
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.553 4.103 1.522 5.833L0 24l6.302-1.499A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.887 0-3.656-.494-5.192-1.358l-.373-.213-3.741.89.934-3.629-.243-.384A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const socialLinks = [
  { Icon: InstagramIcon, label: 'Instagram', href: 'https://instagram.com/fullbrightindonesia' },
  { Icon: YoutubeIcon,   label: 'YouTube',   href: 'https://youtube.com/@fullbrightindonesia' },
  { Icon: TikTokIcon,    label: 'TikTok',    href: 'https://tiktok.com/@fullbrightindonesia' },
  { Icon: LinkedinIcon,  label: 'LinkedIn',  href: 'https://linkedin.com/company/fullbrightindonesia' },
];

const navLinks = [
  { label: 'Keunggulan', href: '#value' },
  { label: 'Testimoni',  href: '#testimonials' },
  { label: 'Harga',      href: '#pricing' },
  { label: 'FAQ',        href: '#faq' },
];

// ─── Logo mark (sama dengan Navbar) ───────────────────────────────────────────

function FooterLogoMark() {
  return (
    <svg width="34" height="34" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="38" height="38" rx="9" fill="#D70808" />
      <rect x="7" y="10" width="11" height="2.5" rx="1.25" fill="white" />
      <rect x="7" y="10" width="2.5" height="18" rx="1.25" fill="white" />
      <rect x="7" y="17.75" width="8.5" height="2.5" rx="1.25" fill="white" />
      <rect x="21" y="10" width="2.5" height="18" rx="1.25" fill="white" />
      <rect x="21" y="10" width="8" height="2.5" rx="1.25" fill="white" />
      <rect x="21" y="18.25" width="8" height="2.5" rx="1.25" fill="white" />
      <rect x="21" y="25.5" width="8" height="2.5" rx="1.25" fill="white" />
      <path d="M29 12.5 Q33.5 12.5 33.5 16.75 Q33.5 20.75 29 20.75" stroke="white" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M29 20.75 Q34.5 20.75 34.5 25 Q34.5 28 29 28" stroke="white" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#151515' }} className="pt-14 pb-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Main grid */}
        <div className="grid md:grid-cols-3 gap-10 mb-10">

          {/* Col 1 — Brand + legal + social */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <FooterLogoMark />
              <div>
                <p className="font-black text-white text-[15px]" style={{ fontFamily: 'var(--font-heading)' }}>
                  Full Bright Indonesia
                </p>
                <p className="text-[10px] tracking-widest uppercase mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Spesialis TOEFL & IELTS Sejak 2013
                </p>
              </div>
            </div>
            <p className="text-xs leading-relaxed mb-4" style={{ color: '#9ca3af' }}>
              Lembaga resmi terdaftar ITP & IIEF Jakarta.
              <br />
              SK Kemenkumham AHU-0055720-AH.01.14 Tahun 2020.
            </p>
            {/* Social media */}
            <div className="flex gap-3">
              {socialLinks.map(({ Icon, label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:brightness-125"
                  style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#9ca3af' }}
                  aria-label={label}>
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Nav links */}
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-5" style={{ color: '#6b7280' }}>
              Navigasi
            </p>
            <ul className="flex flex-col gap-3">
              {navLinks.map(l => (
                <li key={l.href}>
                  <a href={l.href}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: '#9ca3af' }}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Kontak */}
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-5" style={{ color: '#6b7280' }}>
              Hubungi Kami
            </p>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#9ca3af' }}>
                  <WhatsAppIcon />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white mb-0.5">WhatsApp</p>
                  <a href="https://wa.me/6281234567890?text=Halo%20Kak%2C%20saya%20ingin%20konsultasi%20tentang%20program%20TOEFL%20Full%20Bright"
                    className="text-xs hover:text-white transition-colors"
                    style={{ color: '#9ca3af' }}>
                    +62 812-3456-7890
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#9ca3af' }}>
                  <Mail size={15} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white mb-0.5">Email</p>
                  <a href="mailto:info@fullbrightindonesia.org"
                    className="text-xs hover:text-white transition-colors"
                    style={{ color: '#9ca3af' }}>
                    info@fullbrightindonesia.org
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#9ca3af' }}>
                  <MapPin size={15} color="#9ca3af" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white mb-0.5">Alamat</p>
                  <p className="text-xs" style={{ color: '#9ca3af' }}>Makassar, Indonesia</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="rounded-2xl p-6 mb-4 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-white font-semibold text-sm">Siap mulai perjalanan TOEFL-mu?</p>
          <a href="#pricing"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white transition hover:brightness-110 whitespace-nowrap"
            style={{ backgroundColor: '#D70808', fontFamily: 'var(--font-heading)' }}>
            Mulai Belajar Sekarang →
          </a>
        </div>
        {/* Social proof under footer CTA */}
        <div className="flex items-center justify-center flex-wrap gap-x-3 gap-y-1 mb-8">
          <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={11} fill="#F59E0B" color="#F59E0B" />
            ))}
            <span className="ml-1">4.9/5</span>
          </span>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
          <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>45.000+ Alumni Sukses</span>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
          <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>✅ Garansi 100% Uang Kembali</span>
        </div>

        {/* Bottom bar */}
        <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{ borderColor: 'rgba(255,255,255,0.08)', color: '#6b7280' }}>
          <p>© {new Date().getFullYear()} Full Bright Indonesia. Lembaga Resmi ITP & IIEF Jakarta.</p>
          <p>Metode terdaftar Full Bright Indonesia © 2026</p>
        </div>
      </div>
    </footer>
  );
}
