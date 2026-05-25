import { useState, useEffect } from 'react';

type Platform = 'android' | 'ios' | 'other';

function detectPlatform(): Platform {
    const ua = navigator.userAgent;
    if (/iphone|ipad|ipod/i.test(ua)) return 'ios';
    if (/android/i.test(ua)) return 'android';
    return 'other';
}

function isInStandaloneMode(): boolean {
    return (
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true
    );
}

const DISMISSED_KEY = 'vcode_install_dismissed';
const DISMISSED_EXPIRY_DAYS = 7; // Tanya lagi setelah 7 hari

function wasDismissedRecently(): boolean {
    try {
        const stored = localStorage.getItem(DISMISSED_KEY);
        if (!stored) return false;
        const { timestamp } = JSON.parse(stored);
        const days = (Date.now() - timestamp) / (1000 * 60 * 60 * 24);
        return days < DISMISSED_EXPIRY_DAYS;
    } catch {
        return false;
    }
}

function markDismissed() {
    try {
        localStorage.setItem(
            DISMISSED_KEY,
            JSON.stringify({ timestamp: Date.now() }),
        );
    } catch {
        /* ignore */
    }
}

export default function InstallBanner() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [show, setShow] = useState(false);
    const [platform, setPlatform] = useState<Platform>('other');
    const [showIOSSteps, setShowIOSSteps] = useState(false);
    const [installed, setInstalled] = useState(false);

    useEffect(() => {
        // Jangan tampilkan jika sudah diinstall atau baru saja ditutup
        if (isInStandaloneMode() || wasDismissedRecently()) return;

        const plat = detectPlatform();
        setPlatform(plat);

        if (plat === 'ios') {
            // iOS tidak punya beforeinstallprompt — tampilkan panduan manual
            // Tunda sedikit agar tidak langsung muncul saat halaman baru terbuka
            const t = setTimeout(() => setShow(true), 2500);
            return () => clearTimeout(t);
        }

        // Android / Desktop: tunggu event beforeinstallprompt
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setPlatform('android');
            setShow(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Deteksi jika sudah berhasil diinstall
        window.addEventListener('appinstalled', () => {
            setInstalled(true);
            setShow(false);
        });

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setShow(false);
        }
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        markDismissed();
        setShow(false);
        setShowIOSSteps(false);
    };

    if (!show) return null;

    // ── iOS: bottom sheet dengan panduan Add to Home Screen ──
    if (platform === 'ios') {
        return (
            <>
                {/* Backdrop */}
                <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                    onClick={handleDismiss}
                />

                {/* Bottom sheet */}
                <div className="fixed right-0 bottom-0 left-0 z-50 rounded-t-3xl border-t border-white/10 bg-white p-5 shadow-2xl dark:bg-[#1C1F2A]">
                    {/* Handle bar */}
                    <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-300 dark:bg-zinc-600" />

                    {/* Header */}
                    <div className="mb-4 flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-600 shadow-md shadow-blue-200/50">
                                <svg
                                    className="h-6 w-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-base font-black text-gray-900 dark:text-white">
                                    Install V-CODE
                                </p>
                                <p className="text-xs text-gray-400 dark:text-zinc-500">
                                    Akses cepat dari Home Screen
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleDismiss}
                            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-zinc-400"
                        >
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Langkah-langkah iOS */}
                    <div className="space-y-3">
                        <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
                            Ikuti langkah berikut di Safari:
                        </p>

                        {[
                            {
                                step: '1',
                                text: 'Ketuk tombol',
                                highlight: 'Bagikan (Share)',
                                icon: (
                                    <svg
                                        className="h-4 w-4 text-blue-600"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                        />
                                    </svg>
                                ),
                            },
                            {
                                step: '2',
                                text: 'Gulir dan pilih',
                                highlight: '"Add to Home Screen"',
                                icon: (
                                    <svg
                                        className="h-4 w-4 text-blue-600"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 4v16m8-8H4"
                                        />
                                    </svg>
                                ),
                            },
                            {
                                step: '3',
                                text: 'Ketuk',
                                highlight: '"Add"',
                                icon: (
                                    <svg
                                        className="h-4 w-4 text-blue-600"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                ),
                            },
                        ].map(({ step, text, highlight, icon }) => (
                            <div
                                key={step}
                                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3.5 py-3 dark:border-white/5 dark:bg-white/5"
                            >
                                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10">
                                    {icon}
                                </div>
                                <p className="text-sm text-gray-700 dark:text-zinc-300">
                                    {text}{' '}
                                    <span className="font-bold text-gray-900 dark:text-white">
                                        {highlight}
                                    </span>
                                </p>
                            </div>
                        ))}
                    </div>

                    <p className="mt-4 text-center text-xs text-gray-400 dark:text-zinc-500">
                        Hanya tersedia di Safari · iOS 16.4+
                    </p>
                </div>
            </>
        );
    }

    // ── Android / Desktop: banner bawah ──
    return (
        <div className="fixed right-3 bottom-20 left-3 z-50 md:right-6 md:bottom-6 md:left-auto md:w-80">
            <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-2xl shadow-blue-100/60 dark:border-blue-900/30 dark:bg-[#1C1F2A] dark:shadow-black/40">
                {/* Top accent bar */}
                <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600" />

                <div className="p-4">
                    <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
                                <svg
                                    className="h-5 w-5 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-black text-gray-900 dark:text-white">
                                    Install V-CODE
                                </p>
                                <p className="text-xs text-gray-400 dark:text-zinc-500">
                                    Akses cepat dari layar utama
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleDismiss}
                            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:text-zinc-500 dark:hover:bg-white/10 dark:hover:text-zinc-300"
                        >
                            <svg
                                className="h-3.5 w-3.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Benefit bullets */}
                    <div className="mb-3 space-y-1.5">
                        {[
                            'Buka tanpa browser, lebih cepat',
                            'Akses offline & notifikasi',
                            'Tampilan penuh layar HP',
                        ].map((item) => (
                            <div
                                key={item}
                                className="flex items-center gap-2 text-xs text-gray-500 dark:text-zinc-400"
                            >
                                <svg
                                    className="h-3.5 w-3.5 flex-shrink-0 text-blue-500"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                                {item}
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleDismiss}
                            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs font-bold text-gray-500 transition hover:bg-gray-50 dark:border-white/10 dark:text-zinc-400 dark:hover:bg-white/5"
                        >
                            Nanti saja
                        </button>
                        <button
                            onClick={handleInstall}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
                        >
                            <svg
                                className="h-3.5 w-3.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                            </svg>
                            Install Sekarang
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
