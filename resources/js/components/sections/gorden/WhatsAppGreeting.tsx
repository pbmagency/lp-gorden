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

    useEffect(() => {
        const timer = window.setTimeout(() => setVisible(false), 15_000);
        return () => window.clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return (
        <aside
            aria-label="Sapaan WhatsApp dari Pak Elang"
            aria-live="polite"
            style={{
                position: 'fixed',
                right: 'max(18px, env(safe-area-inset-right))',
                bottom: 'max(88px, calc(env(safe-area-inset-bottom) + 88px))',
                zIndex: '61',
                width: 'min(330px, calc(100vw - 36px))',
                padding: '18px 18px 16px',
                background: '#fdfcf9',
                border: '1px solid rgba(92, 82, 65, 0.12)',
                borderRadius: '18px',
                boxShadow: '0 18px 42px -16px rgba(35, 30, 23, 0.42)',
                animation: 'waGreetingIn 320ms ease-out both',
            }}
        >
            <button
                type="button"
                onClick={() => setVisible(false)}
                aria-label="Tutup sapaan"
                style={{
                    position: 'absolute',
                    top: '-13px',
                    right: '-10px',
                    width: '34px',
                    height: '34px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0',
                    border: '2px solid #fdfcf9',
                    borderRadius: '999px',
                    background: '#292722',
                    color: '#fff',
                    fontSize: '20px',
                    fontWeight: '400',
                    lineHeight: '1',
                    cursor: 'pointer',
                }}
            >
                ×
            </button>

            <div
                style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '13px',
                }}
            >
                <img
                    src="/assets/logo-64.webp"
                    alt=""
                    width="48"
                    height="48"
                    decoding="async"
                    style={{
                        flex: '0 0 auto',
                        width: '48px',
                        height: '48px',
                        objectFit: 'contain',
                        borderRadius: '999px',
                        background: '#f3efe7',
                    }}
                />
                <div style={{ minWidth: '0' }}>
                    <p
                        style={{
                            margin: '0 0 2px',
                            color: '#292722',
                            fontSize: '15px',
                            fontWeight: '700',
                            lineHeight: '1.35',
                        }}
                    >
                        Pak Elang – Owner Gorden Wallpaper Solo
                    </p>
                    <p
                        style={{
                            margin: '0 0 10px',
                            color: '#746d62',
                            fontSize: '14px',
                            lineHeight: '1.45',
                        }}
                    >
                        Bingung pilih model? Tanya saya di WA.
                    </p>
                    <a
                        href={href}
                        target="_blank"
                        rel="noopener"
                        onClick={onReply}
                        style={{
                            color: '#48a566',
                            fontSize: '14px',
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
