import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/new-app-layout';

export default function RecordSummary({ sessionData }: any) {
    const totalEntries = sessionData.logs ? sessionData.logs.length : 0;

    const fmt = (s: number) =>
        `${Math.floor(s / 60)
            .toString()
            .padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

    const parseTeam = () => {
        try {
            const parsed =
                typeof sessionData.team_members === 'string'
                    ? JSON.parse(sessionData.team_members)
                    : sessionData.team_members;
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };

    const teamMembers = parseTeam();

    return (
        <>
            <Head title="Perekaman Selesai — V-Code" />

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

                    {/* ── RINGKASAN DOKUMENTASI ── */}
                    <div className="mb-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-white/5 dark:bg-[#1C1F2A]">
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

                    {/* ── TIM CODE BLUE ── */}
                    <div className="mb-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-white/5 dark:bg-[#1C1F2A]">
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
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                            </div>
                            <span className="text-xs font-bold tracking-widest text-blue-600 uppercase dark:text-blue-400">
                                Tim Respon Code Blue
                            </span>
                        </div>

                        <div className="divide-y divide-gray-50 dark:divide-white/[0.04]">
                            {/* Leader */}
                            <div className="flex items-center justify-between px-5 py-3.5">
                                <span className="text-sm text-gray-500 dark:text-zinc-400">
                                    Leader Tim
                                </span>
                                <span className="text-sm font-bold text-gray-900 dark:text-white">
                                    {sessionData.leader_name || '—'}
                                </span>
                            </div>

                            {/* Dokumentator */}
                            <div className="flex items-center justify-between px-5 py-3.5">
                                <span className="text-sm text-gray-500 dark:text-zinc-400">
                                    Dokumentator
                                </span>
                                <span className="text-sm font-bold text-gray-900 dark:text-white">
                                    {sessionData.user?.name || '—'}
                                </span>
                            </div>

                            {/* Anggota tim */}
                            {teamMembers.length > 0 && (
                                <div className="px-5 py-3.5">
                                    <p className="mb-2.5 text-sm text-gray-500 dark:text-zinc-400">
                                        Anggota Tim
                                    </p>
                                    <div className="space-y-2">
                                        {teamMembers.map(
                                            (m: any, i: number) => (
                                                <div
                                                    key={i}
                                                    className="flex items-center justify-between gap-3"
                                                >
                                                    <div className="flex min-w-0 items-center gap-2">
                                                        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-blue-50 font-mono text-[10px] font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                                            {String(
                                                                i + 1,
                                                            ).padStart(2, '0')}
                                                        </span>
                                                        <span className="truncate text-sm font-bold text-gray-800 dark:text-zinc-200">
                                                            {m.name || '—'}
                                                        </span>
                                                    </div>
                                                    <span className="flex-shrink-0 rounded-md bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-500 dark:bg-white/5 dark:text-zinc-400">
                                                        {m.role || '—'}
                                                    </span>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── ACTION BUTTONS ── */}
                    <div className="flex flex-col gap-3 pb-24 md:pb-6">
                        <Link
                            href={`/draft/${sessionData.id}`}
                            className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-blue-600 py-4 text-sm font-bold text-white shadow-lg shadow-blue-200/50 transition hover:bg-blue-700 active:scale-[0.98] dark:shadow-blue-900/20"
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
