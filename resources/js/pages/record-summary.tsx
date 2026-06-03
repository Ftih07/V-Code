import { Head, Link } from '@inertiajs/react';
import ProductTour from '@/components/ProductTour'; // Pastikan path ini benar
import AppLayout from '@/layouts/new-app-layout';

// ─── Ikon Tour ───────────────────────────────────────────────────────────────
const IconCheck = () => (
    <svg
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

// ─── Konfigurasi Langkah Tour ────────────────────────────────────────────────
const SUMMARY_TOUR_STEPS = [
    {
        target: '.tour-summary-card',
        title: 'Ringkasan Tersimpan',
        content:
            'Data durasi, waktu mulai, dan total tindakan selama Code Blue telah diamankan ke dalam sistem sebagai draf sementara.',
        icon: <IconCheck />,
        placement: 'auto' as const,
    },
    {
        target: '.tour-action-edit',
        title: 'Langkah Selanjutnya',
        content:
            'Ketuk tombol ini untuk meninjau transkripsi, melengkapi formulir medis (EMR), dan melakukan finalisasi data.',
        icon: <IconCheck />,
        placement: 'top' as const, // Dipaksa ke atas agar tidak terpotong di layar HP
    },
];

export default function RecordSummary({ sessionData }: any) {
    const totalEntries = sessionData.logs ? sessionData.logs.length : 0;

    const fmt = (s: number) =>
        `${Math.floor(s / 60)
            .toString()
            .padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

    return (
        <>
            <Head title="Perekaman Selesai — V-Code" />

            {/* ── PRODUCT TOUR INJECTION ── */}
            <ProductTour
                steps={SUMMARY_TOUR_STEPS}
                storageKey="vcode_tour_summary_page"
                startDelay={500}
            />

            <div className="flex justify-center">
                <div className="w-full max-w-lg">
                    {/* ── SUCCESS HERO ── */}
                    <div className="mb-4 flex flex-col items-center py-6 text-center">
                        {/* Animated check */}
                        <div className="relative mb-4 flex h-20 w-20 items-center justify-center">
                            <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400/20" />
                            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-200/60 dark:shadow-emerald-900/30">
                                <svg
                                    className="h-8 w-8 text-white"
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
                            </div>
                        </div>

                        <h1 className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
                            Perekaman Selesai
                        </h1>
                        <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-950/30 dark:text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Draft berhasil disimpan ke sistem
                        </span>
                    </div>

                    {/* ── RINGKASAN DOKUMENTASI (Target: .tour-summary-card) ── */}
                    <div className="tour-summary-card mb-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-white/5 dark:bg-[#1C1F2A]">
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
                                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                            </div>
                            <span className="text-xs font-bold tracking-widest text-blue-600 uppercase dark:text-blue-400">
                                Ringkasan Dokumentasi
                            </span>
                        </div>

                        <div className="divide-y divide-gray-50 dark:divide-white/[0.04]">
                            {/* Waktu mulai */}
                            <div className="flex items-center justify-between px-5 py-3.5">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50 dark:bg-white/5">
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
                                    </div>
                                    <span className="text-sm text-gray-500 dark:text-zinc-400">
                                        Waktu Mulai
                                    </span>
                                </div>
                                <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">
                                    {new Date(
                                        sessionData.start_time,
                                    ).toLocaleTimeString('id-ID', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                    })}
                                </span>
                            </div>

                            {/* Durasi */}
                            <div className="flex items-center justify-between px-5 py-3.5">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50 dark:bg-white/5">
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
                                                d="M13 10V3L4 14h7v7l9-11h-7z"
                                            />
                                        </svg>
                                    </div>
                                    <span className="text-sm text-gray-500 dark:text-zinc-400">
                                        Durasi Rekam
                                    </span>
                                </div>
                                <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">
                                    {fmt(sessionData.duration_seconds)}
                                </span>
                            </div>

                            {/* Total entri */}
                            <div className="flex items-center justify-between px-5 py-3.5">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50 dark:bg-white/5">
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
                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                            />
                                        </svg>
                                    </div>
                                    <span className="text-sm text-gray-500 dark:text-zinc-400">
                                        Hasil Entri
                                    </span>
                                </div>
                                <span className="rounded-lg bg-blue-50 px-2.5 py-0.5 font-mono text-xs font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                                    {totalEntries} tindakan
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ── ACTION BUTTONS ── */}
                    <div className="flex flex-col gap-3 pb-24 md:pb-6">
                        {/* Target: .tour-action-edit */}
                        <Link
                            href={`/draft/${sessionData.id}`}
                            className="tour-action-edit flex w-full items-center justify-center gap-2.5 rounded-2xl bg-blue-600 py-4 text-sm font-bold text-white shadow-lg shadow-blue-200/50 transition hover:bg-blue-700 active:scale-[0.98] dark:shadow-blue-900/20"
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
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                            </svg>
                            Edit Draft &amp; Kirim ke EMR
                        </Link>

                        <Link
                            href="/dashboard"
                            className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-gray-200 bg-white py-4 text-sm font-bold text-gray-700 shadow-sm transition hover:bg-gray-50 active:scale-[0.98] dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
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
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>
                            Kembali ke Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

RecordSummary.layout = (page: React.ReactNode) => <AppLayout children={page} />;
