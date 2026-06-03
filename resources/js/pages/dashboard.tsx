import { Head, Link } from '@inertiajs/react';
import ProductTour from '@/components/ProductTour';
import AppLayout from '@/layouts/new-app-layout';

// ─── Ikon kecil untuk tooltip tour ───────────────────────────────────────────
const IconMic = () => (
    <svg
        width="16"
        height="16"
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
);
const IconStats = () => (
    <svg
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
    </svg>
);
const IconHistory = () => (
    <svg
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
    </svg>
);

// ─── Ikon (Gabungan dari Navbar & Dashboard) ─────────────────────────────────
const IconNav = () => (
    <svg
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16m-7 6h7"
        />
    </svg>
);

// ─── Konfigurasi Langkah Tour (Digabung) ─────────────────────────────────────
const COMBINED_TOUR_STEPS = [
    // --- STEP NAVBAR ---
    {
        target: '.tour-nav-beranda',
        title: 'Menu Beranda',
        content:
            'Klik di sini untuk kembali ke halaman utama dan melihat ringkasan aktivitasmu.',
        icon: <IconNav />,
        placement: 'auto' as const,
    },
    {
        target: '.tour-nav-riwayat',
        title: 'Riwayat Sesi',
        content:
            'Semua rekaman Code Blue yang sudah selesai maupun draf tersimpan rapi di sini.',
        icon: <IconNav />,
        placement: 'auto' as const,
    },
    {
        target: '.tour-nav-profil',
        title: 'Pengaturan Profil',
        content:
            'Atur detail akun, kata sandi, dan preferensi aplikasimu di menu Profil.',
        icon: <IconNav />,
        placement: 'auto' as const,
    },
    {
        target: '.tour-nav-theme',
        title: 'Mode Tampilan',
        content:
            'Sesuaikan kenyamanan matamu dengan mengubah mode terang atau gelap lewat tombol ini.',
        icon: <IconNav />,
        placement: 'auto' as const,
    },
    {
        target: '.tour-nav-logout',
        title: 'Keluar Sistem',
        content:
            'Pastikan untuk keluar dari sistem jika kamu mengakses aplikasi ini dari perangkat umum.',
        icon: <IconNav />,
        placement: 'auto' as const,
    },

    // --- STEP KONTEN DASHBOARD ---
    {
        target: '.tour-start-record',
        title: 'Mulai Rekaman',
        content:
            'Klik di sini untuk langsung memulai sesi rekaman Code Blue baru. Ini adalah pintu masuk utama.',
        icon: <IconMic />,
        placement: 'auto' as const,
    },
    {
        target: '.tour-stats',
        title: 'Statistik Sesi',
        content:
            'Pantau total semua sesi yang pernah dilakukan dan berapa draf yang masih belum difinalisasi.',
        icon: <IconStats />,
        placement: 'auto' as const,
    },
    {
        target: '.tour-history',
        title: 'Riwayat Tindakan',
        content:
            'Di sini kamu bisa melihat detail rekaman atau melanjutkan draf yang belum selesai.',
        icon: <IconHistory />,
        placement: 'auto' as const,
    },
];

// ─── Types ────────────────────────────────────────────────────────────────────
type Session = {
    id: number;
    start_time: string;
    duration_seconds: number;
    status: string;
    created_at: string;
    patient?: { name?: string };
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function Dashboard({ sessions = [] }: { sessions: Session[] }) {
    const draftCount = sessions.filter((s) => s.status === 'draft').length;

    return (
        <>
            <Head title="Dashboard — V-Code" />

            {/* 
                ProductTour akan otomatis:
                - Muncul saat pertama kali user visit (localStorage belum ada)
                - Menyimpan ke localStorage setelah selesai/skip
                - Tidak muncul lagi di kunjungan berikutnya
                
                Untuk RESET tour (debug), hapus key di localStorage:
                localStorage.removeItem('vcode_tour_dashboard')
            */}
            <ProductTour
                steps={COMBINED_TOUR_STEPS}
                storageKey="vcode_tour_complete" // Ubah nama key-nya sekalian
                startDelay={800}
            />

            <div className="flex flex-col gap-5">
                {/* ── TOP STATS ROW ── */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    <Link
                        href="/record/setup"
                        className="tour-start-record group relative col-span-2 flex items-center gap-5 overflow-hidden rounded-2xl bg-blue-600 p-5 shadow-lg shadow-blue-200/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-200/60 md:col-span-1 md:flex-col md:items-start md:gap-3 md:p-6 dark:shadow-blue-900/30"
                    >
                        <div className="absolute -top-8 -right-8 h-36 w-36 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-125" />
                        <div className="absolute -right-4 -bottom-6 h-20 w-20 rounded-full bg-white/5" />

                        <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/20 transition-all duration-300 group-hover:bg-white/30">
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

                        <div className="relative">
                            <p className="text-base font-bold text-white">
                                Mulai Rekaman
                            </p>
                            <p className="mt-0.5 text-xs font-medium text-blue-100">
                                Code Blue baru
                            </p>
                        </div>

                        <div className="absolute top-1/2 right-5 -translate-y-1/2 text-white/50 transition-transform duration-200 group-hover:translate-x-1 md:hidden">
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </div>
                    </Link>

                    <div className="tour-stats col-span-2 grid grid-cols-2 gap-4 md:col-span-2">
                        <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-white/5 dark:bg-[#1C1F2A]">
                            <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10">
                                <svg
                                    className="h-4 w-4 text-blue-600 dark:text-blue-400"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                    />
                                </svg>
                            </div>
                            <p className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase dark:text-zinc-500">
                                Total Sesi
                            </p>
                            <p className="mt-2 text-3xl font-black text-gray-900 tabular-nums dark:text-white">
                                {sessions.length}
                            </p>
                            <p className="mt-1 text-xs text-gray-400 dark:text-zinc-500">
                                Semua dokumentasi
                            </p>
                        </div>

                        <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-white/5 dark:bg-[#1C1F2A]">
                            <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-500/10">
                                <svg
                                    className="h-4 w-4 text-amber-500"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                </svg>
                            </div>
                            <p className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase dark:text-zinc-500">
                                Draf
                            </p>
                            <p className="mt-2 text-3xl font-black text-amber-500 tabular-nums">
                                {draftCount}
                            </p>
                            <p className="mt-1 text-xs text-gray-400 dark:text-zinc-500">
                                Belum difinalisasi
                            </p>
                        </div>
                    </div>
                </div>

                <div className="tour-history rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-white/5 dark:bg-[#1C1F2A]">
                    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-white/5">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10">
                                <svg
                                    className="h-4 w-4 text-blue-600 dark:text-blue-400"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                                    Riwayat Tindakan
                                </h2>
                                <p className="text-[11px] text-gray-400 dark:text-zinc-500">
                                    {sessions.length} sesi tercatat
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/riwayat"
                            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10"
                        >
                            Lihat semua
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
                    </div>

                    <div className="divide-y divide-gray-50 dark:divide-white/[0.04]">
                        {sessions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 dark:bg-white/5">
                                    <svg
                                        className="h-7 w-7 text-gray-300 dark:text-zinc-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        />
                                    </svg>
                                </div>
                                <p className="text-sm font-semibold text-gray-400 dark:text-zinc-500">
                                    Belum ada riwayat Code Blue
                                </p>
                                <p className="mt-1 text-xs text-gray-300 dark:text-zinc-600">
                                    Mulai rekaman pertama Anda
                                </p>
                                <Link
                                    href="/record/setup"
                                    className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-blue-200 hover:bg-blue-700 dark:shadow-none"
                                >
                                    Mulai Sekarang
                                </Link>
                            </div>
                        ) : (
                            sessions.map((session) => {
                                const isDraft = session.status === 'draft';
                                const durationMin = session.duration_seconds
                                    ? Math.floor(session.duration_seconds / 60)
                                    : null;
                                const durationSec = session.duration_seconds
                                    ? session.duration_seconds % 60
                                    : null;

                                return (
                                    <Link
                                        key={session.id}
                                        href={`/draft/${session.id}`}
                                        className="group flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]"
                                    >
                                        <div className="flex min-w-0 items-center gap-3.5">
                                            <div
                                                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${isDraft ? 'bg-amber-50 dark:bg-amber-500/10' : 'bg-emerald-50 dark:bg-emerald-500/10'}`}
                                            >
                                                {isDraft ? (
                                                    <svg
                                                        className="h-5 w-5 text-amber-500"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                                        />
                                                    </svg>
                                                ) : (
                                                    <svg
                                                        className="h-5 w-5 text-emerald-500"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                        />
                                                    </svg>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="truncate text-sm font-bold text-gray-800 transition-colors group-hover:text-blue-600 dark:text-zinc-200 dark:group-hover:text-blue-400">
                                                        {session.patient
                                                            ?.name ||
                                                            'Pasien Tanpa Nama'}
                                                    </span>
                                                    <span className="flex-shrink-0 text-xs font-medium text-gray-400 dark:text-zinc-500">
                                                        #{session.id}
                                                    </span>
                                                </div>
                                                <div className="mt-0.5 flex items-center gap-2">
                                                    <span
                                                        className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${isDraft ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'}`}
                                                    >
                                                        {isDraft
                                                            ? 'Draf'
                                                            : 'Selesai'}
                                                    </span>
                                                    <span className="truncate text-[11px] text-gray-400 dark:text-zinc-500">
                                                        {new Date(
                                                            session.created_at,
                                                        ).toLocaleString(
                                                            'id-ID',
                                                            {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            },
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-shrink-0 items-center gap-3">
                                            {session.duration_seconds ? (
                                                <div className="hidden items-center gap-1.5 rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-1.5 sm:flex dark:border-white/5 dark:bg-white/5">
                                                    <svg
                                                        className="h-3.5 w-3.5 text-gray-400 dark:text-zinc-500"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                        />
                                                    </svg>
                                                    <span className="font-mono text-xs font-semibold text-gray-600 dark:text-zinc-400">
                                                        {durationMin}m{' '}
                                                        {String(
                                                            durationSec,
                                                        ).padStart(2, '0')}
                                                        s
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="hidden text-xs text-gray-300 sm:block dark:text-zinc-600">
                                                    —
                                                </span>
                                            )}
                                            <svg
                                                className="h-4 w-4 text-gray-300 transition-all group-hover:translate-x-0.5 group-hover:text-blue-500 dark:text-zinc-600"
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
                                    </Link>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => <AppLayout children={page} />;
