import { useEffect, useState } from 'react';

type WhatsAppGreetingProps = {
    href: string;
    onReply: (event: React.MouseEvent<HTMLAnchorElement>) => void;
};

export default function WhatsAppGreeting({
    href,
    onReply,
}: WhatsAppGreetingProps) {
    const [visible, setVisible] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const timer = window.setTimeout(() => setVisible(false), 15_000);
        return () => window.clearTimeout(timer);
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 767px)');
        const updateViewport = () => setIsMobile(mediaQuery.matches);

        updateViewport();
        mediaQuery.addEventListener('change', updateViewport);

        return () => mediaQuery.removeEventListener('change', updateViewport);
    }, []);

    if (!visible) return null;

    return (
        <aside
            className="whatsapp-greeting"
            aria-label="Sapaan WhatsApp dari Pak Elang"
            aria-live="polite"
            style={{
                position: 'fixed',
                right: isMobile
                    ? 'max(10px, env(safe-area-inset-right))'
                    : 'max(18px, env(safe-area-inset-right))',
                bottom: isMobile
                    ? 'max(72px, calc(env(safe-area-inset-bottom) + 72px))'
                    : 'max(88px, calc(env(safe-area-inset-bottom) + 88px))',
                zIndex: '61',
                width: isMobile
                    ? 'min(230px, calc(100vw - 20px))'
                    : 'min(330px, calc(100vw - 36px))',
                padding: isMobile ? '10px 11px 9px' : '18px 18px 16px',
                background: '#fdfcf9',
                border: '1px solid rgba(92, 82, 65, 0.12)',
                borderRadius: isMobile ? '12px' : '18px',
                boxShadow: '0 18px 42px -16px rgba(35, 30, 23, 0.42)',
                animation: 'waGreetingIn 320ms ease-out both',
            }}
        >
            <button
                className="whatsapp-greeting__close"
                type="button"
                onClick={() => setVisible(false)}
                aria-label="Tutup sapaan"
                style={{
                    position: 'absolute',
                    top: isMobile ? '-8px' : '-13px',
                    right: isMobile ? '-6px' : '-10px',
                    width: isMobile ? '24px' : '34px',
                    height: isMobile ? '24px' : '34px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0',
                    border: `${isMobile ? '1.5px' : '2px'} solid #fdfcf9`,
                    borderRadius: '999px',
                    background: '#292722',
                    color: '#fff',
                    fontSize: isMobile ? '15px' : '20px',
                    fontWeight: '400',
                    lineHeight: '1',
                    cursor: 'pointer',
                }}
            >
                ×
            </button>

            <div
                className="whatsapp-greeting__content"
                style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: isMobile ? '8px' : '13px',
                }}
            >
                <img
                    className="whatsapp-greeting__avatar"
                    src="/assets/logo-64.webp"
                    alt=""
                    width="48"
                    height="48"
                    decoding="async"
                    style={{
                        flex: '0 0 auto',
                        width: isMobile ? '30px' : '48px',
                        height: isMobile ? '30px' : '48px',
                        objectFit: 'contain',
                        borderRadius: '999px',
                        background: '#f3efe7',
                    }}
                />
                <div style={{ minWidth: '0' }}>
                    <p
                        className="whatsapp-greeting__name"
                        style={{
                            margin: '0 0 2px',
                            color: '#292722',
                            fontSize: isMobile ? '11px' : '15px',
                            fontWeight: '700',
                            lineHeight: '1.35',
                        }}
                    >
                        Pak Elang – Owner Gorden Wallpaper Solo
                    </p>
                    <p
                        className="whatsapp-greeting__message"
                        style={{
                            margin: isMobile ? '0 0 5px' : '0 0 10px',
                            color: '#746d62',
                            fontSize: isMobile ? '10.5px' : '14px',
                            lineHeight: '1.45',
                        }}
                    >
                        Bingung pilih model? Tanya saya di WA.
                    </p>
                    <a
                        className="whatsapp-greeting__reply"
                        href={href}
                        target="_blank"
                        rel="noopener"
                        onClick={onReply}
                        style={{
                            color: '#48a566',
                            fontSize: isMobile ? '10.5px' : '14px',
                            fontWeight: '700',
                            lineHeight: '1.4',
                            textDecoration: 'none',
                        }}
                    >
                        Balas sekarang →
                    </a>
                </div>
            </div>
        </aside>
    );
}
