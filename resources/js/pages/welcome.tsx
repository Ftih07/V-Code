import { Head, Link, router } from '@inertiajs/react';
import { useRef, useState, useEffect } from 'react';

// ─── Steps ────────────────────────────────────────────────────────────────────
const steps = [
    {
        num: '01',
        title: 'Setup Sesi',
        desc: 'Isi data pasien, lokasi, jenis kejadian, dan susunan tim Code Blue dalam hitungan detik.',
        color: 'blue',
    },
    {
        num: '02',
        title: 'Mulai Rekam',
        desc: 'Tekan satu tombol. V-Code langsung mendengarkan dan mentranskripsi setiap ucapan tim secara real-time.',
        color: 'emerald',
    },
    {
        num: '03',
        title: 'Koreksi Otomatis',
        desc: 'Google STT mengoreksi istilah medis di latar belakang. Anda tetap fokus pada pasien.',
        color: 'purple',
    },
    {
        num: '04',
        title: 'Review & Finalisasi',
        desc: 'Setelah sesi, dokter mereview draft, melengkapi TTV, evaluasi, dan mengirim ke EMR.',
        color: 'amber',
    },
];

const colorMap: Record<string, { icon: string; badge: string; dot: string }> = {
    blue: {
        icon: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
        badge: 'bg-blue-600',
        dot: 'bg-blue-500',
    },
    emerald: {
        icon: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
        badge: 'bg-emerald-600',
        dot: 'bg-emerald-500',
    },
    purple: {
        icon: 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400',
        badge: 'bg-purple-600',
        dot: 'bg-purple-500',
    },
    amber: {
        icon: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
        badge: 'bg-amber-500',
        dot: 'bg-amber-500',
    },
};

// ─── Hook: IntersectionObserver-based reveal ──────────────────────────────────
function useReveal(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(() => {
        // Cek animasi saat pertama kali load
        if (typeof window !== 'undefined') {
            const prefersReduced = window.matchMedia(
                '(prefers-reduced-motion: reduce)',
            ).matches;

            return prefersReduced; // Jika tidak suka animasi, langsung set visible (melewati pre-loader)
        }

        return false;
    });

    useEffect(() => {
        const el = ref.current;

        if (!el) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold },
        );
        observer.observe(el);

        return () => observer.disconnect();
    }, [threshold]);

    return { ref, visible };
}

// ─── Animated section wrapper ─────────────────────────────────────────────────
// direction: 'up' | 'left' | 'right' | 'scale'
function Reveal({
    children,
    className = '',
    direction = 'up',
    delay = 0,
}: {
    children: React.ReactNode;
    className?: string;
    direction?: 'up' | 'left' | 'right' | 'scale';
    delay?: number;
}) {
    const { ref, visible } = useReveal();

    const base = 'transition-all duration-700 ease-out';

    const hidden: Record<string, string> = {
        up: 'opacity-0 translate-y-10',
        left: 'opacity-0 -translate-x-10',
        right: 'opacity-0 translate-x-10',
        scale: 'opacity-0 scale-95',
    };

    return (
        <div
            ref={ref}
            className={`${base} ${visible ? 'translate-x-0 translate-y-0 scale-100 opacity-100' : hidden[direction]} ${className}`}
            style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
        >
            {children}
        </div>
    );
}

// ─── Parallax blob (moves slightly on scroll via CSS custom property) ─────────
function ParallaxBlob({
    className,
    speed = 0.15,
}: {
    className: string;
    speed?: number;
}) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let ticking = false;
        const onScroll = () => {
            if (ticking) {
                return;
            }

            ticking = true;
            requestAnimationFrame(() => {
                if (ref.current) {
                    const y = window.scrollY * speed;
                    ref.current.style.transform = `translateY(${y}px)`;
                }

                ticking = false;
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });

        return () => window.removeEventListener('scroll', onScroll);
    }, [speed]);

    return <div ref={ref} className={className} aria-hidden="true" />;
}

// ─── Staggered children reveal ────────────────────────────────────────────────
function StaggerReveal({
    children,
    className = '',
    stagger = 80,
}: {
    children: React.ReactNode[];
    className?: string;
    stagger?: number;
}) {
    const { ref, visible } = useReveal(0.1);

    return (
        <div ref={ref} className={className}>
            {children.map((child, i) => (
                <div
                    key={i}
                    className="transition-all duration-600 ease-out"
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible
                            ? 'translateY(0) scale(1)'
                            : 'translateY(24px) scale(0.97)',
                        transitionDelay: visible ? `${i * stagger}ms` : '0ms',
                        transitionDuration: '600ms',
                    }}
                >
                    {child}
                </div>
            ))}
        </div>
    );
}

// ─── FAQ Item ─────────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);

    return (
        <div
            className={`overflow-hidden rounded-2xl border transition-all duration-300 ${open ? 'border-blue-200 bg-blue-50/50 dark:border-blue-900/40 dark:bg-blue-950/20' : 'border-gray-100 bg-white dark:border-white/5 dark:bg-[#1C1F2A]'}`}
        >
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
                <span
                    className={`text-sm leading-snug font-bold ${open ? 'text-blue-700 dark:text-blue-400' : 'text-gray-800 dark:text-zinc-200'}`}
                >
                    {q}
                </span>
                <div
                    className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300 ${open ? 'rotate-45 bg-blue-600 text-white' : 'bg-gray-100 text-gray-400 dark:bg-white/10 dark:text-zinc-500'}`}
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
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                </div>
            </button>
            <div
                className={`grid transition-all duration-300 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
                <div className="overflow-hidden">
                    <div className="border-t border-blue-100 px-5 pt-3 pb-4 dark:border-blue-900/30">
                        <p className="text-sm leading-relaxed text-gray-600 dark:text-zinc-400">
                            {a}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Stat chip ────────────────────────────────────────────────────────────────
function Stat({
    value,
    label,
    delay = 0,
}: {
    value: string;
    label: string;
    delay?: number;
}) {
    const { ref, visible } = useReveal(0.3);

    return (
        <div
            ref={ref}
            className="flex flex-col items-center gap-1 text-center transition-all duration-700 ease-out"
            style={{
                opacity: visible ? 1 : 0,
                transform: visible
                    ? 'translateY(0) scale(1)'
                    : 'translateY(16px) scale(0.9)',
                transitionDelay: visible ? `${delay}ms` : '0ms',
            }}
        >
            <span className="text-3xl font-black text-blue-600 tabular-nums dark:text-blue-400">
                {value}
            </span>
            <span className="text-xs font-semibold text-gray-400 dark:text-zinc-500">
                {label}
            </span>
        </div>
    );
}

// ─── TypeScript interfaces ────────────────────────────────────────────────────
interface FeatureProps {
    title: string;
    desc: string;
    color: string;
    icon: string;
}
interface FaqProps {
    q: string;
    a: string;
}
interface WelcomeProps {
    auth?: { user?: { name: string } };
    faqs?: FaqProps[];
    features?: FeatureProps[];
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Welcome({
    auth,
    faqs = [],
    features = [],
}: WelcomeProps) {
    const isLoggedIn = !!auth?.user;

    const clickCount = useRef(0);
    const clickTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleLogoClick = () => {
        clickCount.current += 1;

        if (clickCount.current === 3) {
            if (clickTimeout.current) {
                clearTimeout(clickTimeout.current);
            }

            clickCount.current = 0;
            window.location.href = '/v-code-core';
        } else if (clickCount.current === 1) {
            clickTimeout.current = setTimeout(() => {
                if (clickCount.current === 1) {
                    router.visit('/');
                }

                clickCount.current = 0;
            }, 350);
        }
    };

    return (
        <>
            <Head title="V-CODE — Dokumentasi Code Blue Berbasis Suara" />

            {/* Global scroll animation styles */}
            <style>{`
                @media (prefers-reduced-motion: reduce) {
                    *, *::before, *::after {
                        animation-duration: 0.01ms !important;
                        transition-duration: 0.01ms !important;
                    }
                }
                .hero-float {
                    animation: heroFloat 6s ease-in-out infinite;
                }
                .hero-float-slow {
                    animation: heroFloat 9s ease-in-out infinite reverse;
                }
                @keyframes heroFloat {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-12px); }
                }
                .pulse-ring {
                    animation: pulseRing 2.5s ease-out infinite;
                }
                @keyframes pulseRing {
                    0% { transform: scale(0.95); opacity: 0.6; }
                    70% { transform: scale(1.4); opacity: 0; }
                    100% { transform: scale(0.95); opacity: 0; }
                }
                .ecg-draw {
                    stroke-dasharray: 1200;
                    stroke-dashoffset: 1200;
                    animation: ecgDraw 2.4s ease forwards;
                }
                @keyframes ecgDraw {
                    to { stroke-dashoffset: 0; }
                }
                .waveform-bar {
                    animation: waveformPulse 1.8s ease-in-out infinite;
                }
                @keyframes waveformPulse {
                    0%, 100% { transform: scaleY(1); }
                    50% { transform: scaleY(0.4); }
                }
            `}</style>

            <div className="min-h-screen overflow-x-hidden bg-[#F5F7FA] dark:bg-[#0F1117]">
                {/* ══════════════════════════════════════════════════
                 * NAVBAR
                 * ══════════════════════════════════════════════════ */}
                <header className="sticky top-0 z-50 border-b border-gray-100/80 bg-white/90 backdrop-blur-xl dark:border-white/5 dark:bg-[#0F1117]/90">
                    <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
                        <div
                            className="flex cursor-pointer items-center gap-2.5 transition-all duration-200 select-none hover:opacity-80 active:scale-95"
                            onClick={handleLogoClick}
                            title="Kembali ke Beranda"
                        >
                            {/* Kotak Putih & Logo V */}
                            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-gray-900/5 dark:bg-[#1e2330] dark:ring-white/10">
                                <img
                                    src="/apple-touch-icon.png?v=2"
                                    alt="V-Code Icon"
                                    className="h-full w-full object-contain"
                                />
                            </div>

                            {/* Teks Bawaan */}
                            <div>
                                <p className="text-sm font-black tracking-widest text-gray-900 dark:text-white">
                                    V-CODE
                                </p>
                                <p className="hidden text-[9px] font-bold tracking-[0.15em] text-blue-500 uppercase sm:block">
                                    EMR Rumah Sakit
                                </p>
                            </div>
                        </div>

                        <nav className="hidden items-center gap-6 md:flex">
                            {['Fitur', 'Cara Kerja', 'FAQ'].map((item) => (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                                    className="text-sm font-semibold text-gray-500 transition-colors duration-200 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white"
                                >
                                    {item}
                                </a>
                            ))}
                        </nav>

                        <div className="flex items-center gap-2">
                            {isLoggedIn ? (
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 active:scale-95"
                                >
                                    Dashboard
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
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="rounded-xl px-4 py-2 text-sm font-bold text-gray-600 transition-all duration-200 hover:bg-gray-100 dark:text-zinc-300 dark:hover:bg-white/10"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 active:scale-95"
                                    >
                                        Mulai Gratis
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <main>
                    {/* ══════════════════════════════════════════════════
                     * HERO — with parallax blobs + floating card
                     * ══════════════════════════════════════════════════ */}
                    <section className="relative overflow-hidden px-4 pt-14 pb-16 md:px-6 md:pt-20 md:pb-24">
                        {/* Parallax background blobs — move at different speeds */}
                        <ParallaxBlob
                            speed={0.12}
                            className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-600/10"
                        />
                        <ParallaxBlob
                            speed={0.06}
                            className="pointer-events-none absolute top-20 right-0 -z-10 h-64 w-64 rounded-full bg-purple-300/10 blur-3xl dark:bg-purple-600/10"
                        />
                        <ParallaxBlob
                            speed={0.18}
                            className="pointer-events-none absolute bottom-0 left-0 -z-10 h-48 w-48 rounded-full bg-emerald-300/10 blur-3xl dark:bg-emerald-700/10"
                        />

                        {/* ECG line background decoration */}
                        <div className="pointer-events-none absolute inset-x-0 top-10 overflow-hidden opacity-[0.06] dark:opacity-[0.04]">
                            <svg
                                viewBox="0 0 1200 80"
                                className="w-full"
                                preserveAspectRatio="none"
                            >
                                <path
                                    className="ecg-draw"
                                    d="M0 40 L180 40 L210 40 L220 8 L232 72 L240 8 L248 72 L256 40 L280 40 L480 40 L510 40 L520 8 L532 72 L540 8 L548 72 L556 40 L580 40 L780 40 L810 40 L820 8 L832 72 L840 8 L848 72 L856 40 L880 40 L1200 40"
                                    fill="none"
                                    stroke="#2563EB"
                                    strokeWidth="2.5"
                                />
                            </svg>
                        </div>

                        <div className="mx-auto max-w-4xl text-center">
                            {/* Eyebrow — fade up */}
                            <Reveal direction="up" delay={0}>
                                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 dark:border-blue-900/40 dark:bg-blue-950/30">
                                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
                                    <span className="text-xs font-bold text-blue-700 dark:text-blue-400">
                                        Dokumentasi Code Blue · Hybrid STT
                                    </span>
                                </div>
                            </Reveal>

                            {/* Headline — fade up, slight delay */}
                            <Reveal direction="up" delay={80}>
                                <h1 className="mb-4 text-4xl leading-tight font-black tracking-tight text-gray-900 md:text-6xl dark:text-white">
                                    Fokus pada{' '}
                                    <span className="relative inline-block">
                                        <span className="relative z-10 text-blue-600 dark:text-blue-400">
                                            Pasien
                                        </span>
                                        <span className="absolute right-0 bottom-1 left-0 -z-10 h-3 rounded bg-blue-100 dark:bg-blue-900/40" />
                                    </span>
                                    ,<br className="hidden sm:block" />
                                    Bukan pada{' '}
                                    <span className="text-gray-400 dark:text-zinc-500">
                                        Formulir
                                    </span>
                                </h1>
                            </Reveal>

                            {/* Subheading */}
                            <Reveal direction="up" delay={160}>
                                <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-gray-500 md:text-lg dark:text-zinc-400">
                                    V-Code merekam, mengklasifikasikan, dan
                                    mendokumentasikan setiap tindakan Code Blue
                                    secara real-time hanya dengan suara Anda.
                                    Tidak ada ketik, tidak ada distraksi.
                                </p>
                            </Reveal>

                            {/* CTA buttons */}
                            <Reveal direction="up" delay={240}>
                                <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                                    <Link
                                        href={
                                            isLoggedIn
                                                ? '/record/setup'
                                                : '/register'
                                        }
                                        className="group flex w-full items-center justify-center gap-2.5 rounded-2xl bg-blue-600 px-7 py-4 text-base font-bold text-white shadow-lg shadow-blue-200/60 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200/70 active:scale-[0.98] sm:w-auto dark:shadow-blue-900/30"
                                    >
                                        {/* Mic icon with pulse ring */}
                                        <span className="relative flex h-5 w-5 items-center justify-center">
                                            <span className="pulse-ring absolute inset-0 rounded-full bg-white/30" />
                                            <svg
                                                className="relative h-5 w-5"
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
                                        </span>
                                        Mulai Perekaman
                                    </Link>
                                    <a
                                        href="#cara-kerja"
                                        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-7 py-4 text-base font-bold text-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-md sm:w-auto dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
                                    >
                                        Lihat Cara Kerja
                                        <svg
                                            className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </a>
                                </div>
                            </Reveal>

                            <Reveal direction="up" delay={300}>
                                <p className="mt-5 text-xs text-gray-400 dark:text-zinc-600">
                                    Tidak perlu kartu kredit · Berjalan di
                                    infrastruktur RS Anda
                                </p>
                            </Reveal>
                        </div>

                        {/* ── HERO PREVIEW CARD — floating animation ── */}
                        <Reveal direction="scale" delay={400}>
                            <div className="mx-auto mt-12 max-w-3xl md:mt-16">
                                <div
                                    className="hero-float overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl shadow-gray-200/80 dark:border-white/10 dark:bg-[#1C1F2A] dark:shadow-black/40"
                                    style={{ transformStyle: 'preserve-3d' }}
                                >
                                    {/* Fake browser bar */}
                                    <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/80 px-4 py-3 dark:border-white/5 dark:bg-white/[0.03]">
                                        <div className="flex gap-1.5">
                                            <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                                            <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                                            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                                        </div>
                                        <div className="mx-auto flex items-center gap-2 rounded-lg bg-white px-3 py-1 text-xs text-gray-400 shadow-sm dark:bg-white/10 dark:text-zinc-500">
                                            <svg
                                                className="h-3 w-3"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                                />
                                            </svg>
                                            v-code.digitify.my.id
                                        </div>
                                        <div className="w-12" />
                                    </div>

                                    <div className="overflow-hidden rounded-b-3xl">
                                        <iframe
                                            className="aspect-video w-full"
                                            src="https://www.youtube.com/embed/w_qYC7kG5F4?si=H71NesirjEiPNryR"
                                            title="Demo V-Code"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </section>

                    {/* ══════════════════════════════════════════════════
                     * STATS BAR — staggered scale-in
                     * ══════════════════════════════════════════════════ */}
                    <section className="border-y border-gray-100 bg-white px-4 py-10 dark:border-white/5 dark:bg-[#141720]">
                        <div className="mx-auto grid max-w-3xl grid-cols-2 gap-8 md:grid-cols-4">
                            <Stat
                                value="< 3s"
                                label="Transkripsi muncul"
                                delay={0}
                            />
                            <Stat
                                value="97%"
                                label="Akurasi medis"
                                delay={80}
                            />
                            <Stat
                                value="1 ketuk"
                                label="Mulai rekaman"
                                delay={160}
                            />
                            <Stat
                                value="0 ketik"
                                label="Saat resusitasi"
                                delay={240}
                            />
                        </div>
                    </section>

                    {/* ══════════════════════════════════════════════════
                     * ABOUT — left/right opposing reveals
                     * ══════════════════════════════════════════════════ */}
                    <section
                        id="tentang"
                        className="px-4 py-16 md:px-6 md:py-24"
                    >
                        <div className="mx-auto max-w-4xl">
                            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
                                <Reveal direction="left">
                                    <div>
                                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 dark:border-blue-900/40 dark:bg-blue-950/30">
                                            <span className="text-[11px] font-bold tracking-widest text-blue-600 uppercase dark:text-blue-400">
                                                Tentang V-Code
                                            </span>
                                        </div>
                                        <h2 className="mb-4 text-2xl leading-tight font-black tracking-tight text-gray-900 md:text-3xl dark:text-white">
                                            Dirancang untuk Momen
                                            <br />
                                            yang Tidak Boleh Salah
                                        </h2>
                                        <p className="mb-4 text-sm leading-relaxed text-gray-500 dark:text-zinc-400">
                                            Resusitasi Code Blue berlangsung
                                            dalam hitungan menit. Setiap detik
                                            berarti. Tim medis tidak bisa
                                            mengalihkan perhatian untuk mengetik
                                            catatan — namun dokumentasi yang
                                            akurat adalah kewajiban hukum dan
                                            medis.
                                        </p>
                                        <p className="text-sm leading-relaxed text-gray-500 dark:text-zinc-400">
                                            V-Code hadir sebagai asisten
                                            dokumentasi suara yang bekerja di
                                            latar belakang. Cukup bicara seperti
                                            biasa — sistem akan mendengar,
                                            memahami konteks medis, dan menyusun
                                            catatan terstruktur secara otomatis.
                                        </p>
                                    </div>
                                </Reveal>

                                <Reveal direction="right" delay={100}>
                                    <div className="space-y-3">
                                        {/* Before */}
                                        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 dark:border-red-900/20 dark:bg-red-950/20">
                                            <p className="mb-2 text-[11px] font-bold tracking-widest text-red-500 uppercase">
                                                Sebelum V-Code
                                            </p>
                                            <div className="space-y-1.5 text-sm text-red-700 dark:text-red-400">
                                                {[
                                                    'Perawat mencatat manual di kertas',
                                                    'Data sering tidak lengkap atau salah waktu',
                                                    'Alih perhatian dari pasien ke formulir',
                                                    'Rekap membutuhkan waktu lama setelah sesi',
                                                ].map((item) => (
                                                    <div
                                                        key={item}
                                                        className="flex items-start gap-2"
                                                    >
                                                        <svg
                                                            className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-red-400"
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
                                                        {item}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        {/* After */}
                                        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 dark:border-emerald-900/20 dark:bg-emerald-950/20">
                                            <p className="mb-2 text-[11px] font-bold tracking-widest text-emerald-600 uppercase dark:text-emerald-400">
                                                Dengan V-Code
                                            </p>
                                            <div className="space-y-1.5 text-sm text-emerald-800 dark:text-emerald-300">
                                                {[
                                                    'Dokumentasi otomatis via suara',
                                                    'Timestamping akurat setiap tindakan',
                                                    'Tim tetap fokus 100% pada pasien',
                                                    'Draft siap review dalam hitungan detik',
                                                ].map((item) => (
                                                    <div
                                                        key={item}
                                                        className="flex items-start gap-2"
                                                    >
                                                        <svg
                                                            className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-500"
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
                                        </div>
                                    </div>
                                </Reveal>
                            </div>
                        </div>
                    </section>

                    {/* ══════════════════════════════════════════════════
                     * FEATURES — staggered grid reveal
                     * ══════════════════════════════════════════════════ */}
                    <section
                        id="fitur"
                        className="bg-white px-4 py-16 md:px-6 md:py-24 dark:bg-[#141720]"
                    >
                        <div className="mx-auto max-w-5xl">
                            <Reveal direction="up">
                                <div className="mb-10 text-center md:mb-14">
                                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 dark:border-blue-900/40 dark:bg-blue-950/30">
                                        <span className="text-[11px] font-bold tracking-widest text-blue-600 uppercase dark:text-blue-400">
                                            Fitur Unggulan
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-black tracking-tight text-gray-900 md:text-3xl dark:text-white">
                                        Semua yang Dibutuhkan Tim Medis
                                    </h2>
                                    <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500 dark:text-zinc-400">
                                        Setiap fitur dirancang bersama tenaga
                                        medis untuk memastikan V-Code
                                        benar-benar membantu — bukan menambah
                                        beban kerja.
                                    </p>
                                </div>
                            </Reveal>

                            <StaggerReveal
                                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                                stagger={70}
                            >
                                {features.map((f) => {
                                    const c =
                                        colorMap[f.color] || colorMap['blue'];

                                    return (
                                        <div
                                            key={f.title}
                                            className="group rounded-2xl border border-gray-100 bg-[#F5F7FA] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-100/50 dark:border-white/5 dark:bg-[#1C1F2A] dark:hover:shadow-blue-900/20"
                                        >
                                            <div
                                                className={`mb-3.5 inline-flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${c.icon}`}
                                                dangerouslySetInnerHTML={{
                                                    __html: f.icon,
                                                }}
                                            />
                                            <h3 className="mb-1.5 text-sm font-bold text-gray-900 dark:text-white">
                                                {f.title}
                                            </h3>
                                            <p className="text-xs leading-relaxed text-gray-500 dark:text-zinc-400">
                                                {f.desc}
                                            </p>
                                        </div>
                                    );
                                })}
                            </StaggerReveal>
                        </div>
                    </section>

                    {/* ══════════════════════════════════════════════════
                     * HOW IT WORKS — staggered steps
                     * ══════════════════════════════════════════════════ */}
                    <section
                        id="cara-kerja"
                        className="px-4 py-16 md:px-6 md:py-24"
                    >
                        <div className="mx-auto max-w-5xl">
                            <Reveal direction="up">
                                <div className="mb-10 text-center md:mb-14">
                                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 dark:border-blue-900/40 dark:bg-blue-950/30">
                                        <span className="text-[11px] font-bold tracking-widest text-blue-600 uppercase dark:text-blue-400">
                                            Cara Kerja
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-black tracking-tight text-gray-900 md:text-3xl dark:text-white">
                                        4 Langkah, Satu Tujuan
                                    </h2>
                                    <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500 dark:text-zinc-400">
                                        Dari persiapan hingga dokumen EMR —
                                        semua dalam satu alur kerja yang
                                        intuitif.
                                    </p>
                                </div>
                            </Reveal>

                            <StaggerReveal
                                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
                                stagger={100}
                            >
                                {steps.map((s, i) => {
                                    const c = colorMap[s.color];

                                    return (
                                        <div
                                            key={s.num}
                                            className="group relative flex flex-col rounded-2xl border border-gray-100 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-white/5 dark:bg-[#1C1F2A]"
                                        >
                                            <div
                                                className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${c.badge} shadow-sm transition-transform duration-300 group-hover:scale-105`}
                                            >
                                                <span className="font-mono text-xs font-black text-white">
                                                    {s.num}
                                                </span>
                                            </div>
                                            <h3 className="mb-1.5 text-sm font-bold text-gray-900 dark:text-white">
                                                {s.title}
                                            </h3>
                                            <p className="text-xs leading-relaxed text-gray-500 dark:text-zinc-400">
                                                {s.desc}
                                            </p>
                                            {i < steps.length - 1 && (
                                                <div className="absolute top-1/2 -right-2 z-10 hidden -translate-y-1/2 lg:block">
                                                    <svg
                                                        className="h-4 w-4 text-gray-300 dark:text-zinc-700"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2.5"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M9 5l7 7-7 7"
                                                        />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </StaggerReveal>

                            {/* Demo video area */}
                            <Reveal direction="up" delay={200}>
                                <div className="mt-12 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-white/5 dark:bg-[#1C1F2A]">
                                    <div className="flex items-center gap-2.5 border-b border-gray-100 px-5 py-3.5 dark:border-white/5">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10">
                                            <svg
                                                className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2.5"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                        <span className="text-xs font-bold tracking-widest text-blue-600 uppercase dark:text-blue-400">
                                            Preview Cara Kerja
                                        </span>
                                    </div>
                                    <div className="relative flex justify-center overflow-hidden rounded-b-3xl bg-blue-50/60 py-12 sm:py-16 md:py-20 dark:bg-black/40">
                                        {/* Efek cahaya glowing di belakang HP agar lebih estetik */}
                                        <div className="pointer-events-none absolute top-1/2 left-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/30 blur-[80px] md:h-[500px] md:w-[500px]" />

                                        {/* Frame HP (Makin besar di layar yang lebih lebar) */}
                                        <div className="relative z-10 aspect-[9/19] w-full max-w-[260px] overflow-hidden rounded-[2.5rem] border-[10px] border-gray-800 bg-gray-800 shadow-2xl ring-1 shadow-blue-900/20 ring-black/5 sm:max-w-[320px] md:max-w-[380px] md:rounded-[3.2rem] md:border-[12px] lg:max-w-[420px] dark:ring-white/10">
                                            {/* Poni (Notch) iPhone di bagian atas (menyesuaikan ukuran layar) */}
                                            <div className="absolute top-0 left-1/2 z-20 h-5 w-28 -translate-x-1/2 rounded-b-2xl bg-gray-800 md:h-6 md:w-36 md:rounded-b-3xl" />

                                            {/* Layar HP (tempat Iframe YouTube) */}
                                            <div className="relative h-full w-full overflow-hidden rounded-[1.75rem] bg-black md:rounded-[2.5rem]">
                                                <iframe
                                                    className="absolute inset-0 h-full w-full"
                                                    src="https://www.youtube.com/embed/v0BA0IwAZwQ?si=6TztN3ppwQ7zfRCX&rel=0"
                                                    title="Demo V-Code"
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                    referrerPolicy="strict-origin-when-cross-origin"
                                                    allowFullScreen
                                                ></iframe>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        </div>
                    </section>

                    {/* ══════════════════════════════════════════════════
                     * FAQ — staggered accordion
                     * ══════════════════════════════════════════════════ */}
                    <section
                        id="faq"
                        className="bg-white px-4 py-16 md:px-6 md:py-24 dark:bg-[#141720]"
                    >
                        <div className="mx-auto max-w-3xl">
                            <Reveal direction="up">
                                <div className="mb-10 text-center">
                                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 dark:border-blue-900/40 dark:bg-blue-950/30">
                                        <span className="text-[11px] font-bold tracking-widest text-blue-600 uppercase dark:text-blue-400">
                                            FAQ
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-black tracking-tight text-gray-900 md:text-3xl dark:text-white">
                                        Pertanyaan yang Sering Ditanyakan
                                    </h2>
                                    <p className="mt-3 text-sm text-gray-500 dark:text-zinc-400">
                                        Masih ada pertanyaan lain? Hubungi tim
                                        kami.
                                    </p>
                                </div>
                            </Reveal>

                            <StaggerReveal className="space-y-3" stagger={60}>
                                {faqs.map((faq) => (
                                    <FaqItem key={faq.q} q={faq.q} a={faq.a} />
                                ))}
                            </StaggerReveal>
                        </div>
                    </section>

                    {/* ══════════════════════════════════════════════════
                     * FINAL CTA — scale reveal
                     * ══════════════════════════════════════════════════ */}
                    <section className="px-4 py-16 md:px-6 md:py-24">
                        <div className="mx-auto max-w-3xl">
                            <Reveal direction="scale">
                                <div className="relative overflow-hidden rounded-3xl bg-blue-600 px-6 py-12 text-center md:px-12 md:py-16">
                                    <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10" />
                                    <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10" />
                                    {/* Slow-floating secondary blob inside CTA */}
                                    <div className="hero-float-slow pointer-events-none absolute top-0 right-1/4 h-24 w-24 rounded-full bg-blue-500/40 blur-xl" />

                                    <div className="relative">
                                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                                            <svg
                                                className="h-7 w-7 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.75"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                                                />
                                            </svg>
                                        </div>
                                        <h2 className="mb-3 text-2xl font-black tracking-tight text-white md:text-3xl">
                                            Siap Meningkatkan Kualitas
                                            <br className="hidden sm:block" />
                                            Dokumentasi Code Blue?
                                        </h2>
                                        <p className="mx-auto mb-8 max-w-lg text-sm leading-relaxed text-blue-100">
                                            Bergabung dengan tim medis yang
                                            sudah menggunakan V-Code untuk
                                            dokumentasi yang lebih cepat,
                                            akurat, dan fokus pada pasien.
                                        </p>
                                        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                                            <Link
                                                href={
                                                    isLoggedIn
                                                        ? '/record/setup'
                                                        : '/register'
                                                }
                                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-7 py-3.5 text-sm font-bold text-blue-700 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-xl active:scale-[0.98] sm:w-auto"
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
                                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                                    />
                                                </svg>
                                                {isLoggedIn
                                                    ? 'Mulai Rekam Sekarang'
                                                    : 'Daftar Sekarang — Gratis'}
                                            </Link>
                                            {!isLoggedIn && (
                                                <Link
                                                    href="/login"
                                                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/30 px-7 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-white/10 sm:w-auto"
                                                >
                                                    Sudah punya akun? Masuk
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        </div>
                    </section>
                </main>

                {/* ══════════════════════════════════════════════════
                 * FOOTER
                 * ══════════════════════════════════════════════════ */}
                <footer className="border-t border-gray-100 bg-white px-4 py-10 md:px-6 dark:border-white/5 dark:bg-[#0F1117]">
                    <div className="mx-auto max-w-6xl">
                        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
                            <div>
                                <div className="mb-2 flex items-center gap-2.5">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                                        <svg
                                            className="h-4 w-4 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                                            />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-black tracking-widest text-gray-900 dark:text-white">
                                        V-CODE
                                    </span>
                                </div>
                                <p className="max-w-xs text-xs text-gray-400 dark:text-zinc-500">
                                    Sistem dokumentasi Code Blue berbasis suara
                                    untuk tim medis Indonesia.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-6 text-xs font-semibold text-gray-400 dark:text-zinc-500">
                                {[
                                    { label: 'Fitur', href: '#fitur' },
                                    {
                                        label: 'Cara Kerja',
                                        href: '#cara-kerja',
                                    },
                                    { label: 'FAQ', href: '#faq' },
                                    { label: 'Masuk', href: '/login' },
                                    { label: 'Daftar', href: '/register' },
                                ].map(({ label, href }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        className="transition-colors duration-200 hover:text-gray-900 dark:hover:text-white"
                                    >
                                        {label}
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col items-start justify-between gap-2 border-t border-gray-100 pt-6 md:flex-row md:items-center dark:border-white/5">
                            <p className="text-xs text-gray-400 dark:text-zinc-600">
                                © {new Date().getFullYear()} V-CODE · EMR Rumah
                                Sakit. Hak cipta dilindungi.
                            </p>
                            <p className="text-xs text-gray-300 dark:text-zinc-700">
                                Dibuat dengan ♥ untuk tenaga medis Indonesia
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
