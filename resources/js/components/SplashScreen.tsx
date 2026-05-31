import { useState, useEffect } from 'react';

/**
 * SplashScreen
 *
 * Ditampilkan hanya sekali saat initial web/app boot.
 * Setelah MIN_DURATION ms, akan fade-out dan unmount.
 */

const MIN_DURATION = 1800;
const FADE_DURATION = 400;
const SESSION_KEY = 'vcode_splash_shown';

export default function SplashScreen() {
    // 1. Set default awal HANYA true jika ini di browser dan belum diset
    const [visible, setVisible] = useState(() => {
        if (typeof window !== 'undefined') {
            return !sessionStorage.getItem(SESSION_KEY);
        }

        return false;
    });

    const [fading, setFading] = useState(false);

    useEffect(() => {
        // 2. Kalau pas mounting ternyata sudah harus sembunyi (atau tidak visible), berhenti.
        if (!visible) {
return;
}

        // 3. Langsung set timer animasi
        const hideTimer = setTimeout(() => {
            setFading(true);

            // Unmount sepenuhnya setelah animasi css selesai
            setTimeout(() => {
                setVisible(false);
                // Tandai di session storage supaya tidak muncul lagi jika di-refresh
                sessionStorage.setItem(SESSION_KEY, '1');
            }, FADE_DURATION);
        }, MIN_DURATION);

        return () => clearTimeout(hideTimer);
    }, [visible]);

    if (!visible) {
        return null;
    }

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#ffffff',
                transition: `opacity ${FADE_DURATION}ms ease`,
                opacity: fading ? 0 : 1,
                pointerEvents: fading ? 'none' : 'all', // Pastikan saat fading tidak memblokir interaksi user
            }}
            className="dark:bg-[#0F1117]"
        >
            {/* Logo mark */}
            <div
                style={{
                    width: 72,
                    height: 72,
                    borderRadius: 22,
                    background: '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 16px 40px rgba(37,99,235,0.30)',
                    marginBottom: 20,
                    animation:
                        'vcode-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
                }}
            >
                <svg
                    width="36"
                    height="36"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                </svg>
            </div>

            {/* App name */}
            <div
                style={{
                    textAlign: 'center',
                    animation: 'vcode-fadein 0.5s 0.2s ease forwards',
                    opacity: 0,
                }}
            >
                <p
                    style={{
                        fontSize: 26,
                        fontWeight: 900,
                        letterSpacing: '0.12em',
                        color: '#111827',
                        fontFamily:
                            '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                    }}
                    className="dark:text-white"
                >
                    V-CODE
                </p>
                <p
                    style={{
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: '#3B82F6',
                        marginTop: 2,
                        fontFamily:
                            '-apple-system, BlinkMacSystemFont, sans-serif',
                    }}
                >
                    EMR Rumah Sakit
                </p>
            </div>

            {/* Loading dots */}
            <div
                style={{
                    marginTop: 48,
                    display: 'flex',
                    gap: 6,
                    animation: 'vcode-fadein 0.4s 0.5s ease forwards',
                    opacity: 0,
                }}
            >
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: '#BFDBFE',
                            animation: `vcode-bounce 1.0s ${i * 0.18}s ease-in-out infinite`,
                        }}
                        className="dark:bg-blue-700"
                    />
                ))}
            </div>

            {/* Keyframe styles injected inline once */}
            <style>{`
                @keyframes vcode-pop {
                    0%   { transform: scale(0.7); opacity: 0; }
                    100% { transform: scale(1);   opacity: 1; }
                }
                @keyframes vcode-fadein {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0);   }
                }
                @keyframes vcode-bounce {
                    0%, 100% { transform: translateY(0);    opacity: 0.4; }
                    50%       { transform: translateY(-8px); opacity: 1;   }
                }
            `}</style>
        </div>
    );
}
