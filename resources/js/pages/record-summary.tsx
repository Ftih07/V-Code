import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/new-app-layout';

export default function RecordSummary({ sessionData }: any) {
    const totalEntries = sessionData.logs ? sessionData.logs.length : 0;

    return (
        <div className="relative flex min-h-screen items-start justify-center bg-slate-100 px-0 py-0 md:bg-slate-200/60 md:py-8 dark:bg-zinc-950">
            <Head title="Perekaman Selesai - V-CODE" />

            <div className="absolute top-1/4 left-1/2 -z-10 hidden h-72 w-72 -translate-x-1/2 rounded-full bg-blue-400/20 blur-3xl md:block" />

            {/* Container Utama*/}
            <div className="flex min-h-screen w-full max-w-md flex-col overflow-hidden bg-slate-50 md:max-h-[92vh] md:min-h-[800px] md:rounded-3xl md:border md:border-slate-200/80 md:shadow-2xl dark:bg-zinc-950 dark:md:border-zinc-800">
                <div className="sticky top-0 z-10 flex items-center justify-between bg-gradient-to-r from-blue-900 to-indigo-900 p-4 text-white shadow-md md:rounded-t-2xl">
                    <Link
                        href="/dashboard"
                        className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/10 active:scale-95"
                        aria-label="Kembali ke Dashboard"
                    >
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </Link>
                    <h1 className="text-base font-bold tracking-wider">
                        V-CODE
                    </h1>
                    <div className="w-9"></div>
                </div>

                <div className="flex flex-1 flex-col overflow-y-auto px-5 py-6">
                    <div className="flex flex-col items-center pb-6 text-center">
                        <div className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/30">
                            <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400/10" />
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-md shadow-emerald-200 dark:shadow-none">
                                <svg
                                    className="h-7 w-7 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={3}
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
                        <h2 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                            Perekaman Selesai
                        </h2>
                        <p className="mt-1 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600 dark:border-emerald-900/30 dark:bg-emerald-950/40 dark:text-emerald-400">
                            Draft berhasil disimpan ke sistem
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* Ringkasan Durasi & Tindakan */}
                        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                            <h3 className="mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500">
                                Ringkasan Dokumentasi
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center justify-between py-0.5">
                                    <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                        <span>⏱️</span> Waktu Mulai
                                    </span>
                                    <span className="font-mono font-semibold text-gray-900 dark:text-zinc-100">
                                        {new Date(
                                            sessionData.start_time,
                                        ).toLocaleTimeString('id-ID', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit',
                                        })}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-t border-gray-50 py-0.5 dark:border-zinc-800/50">
                                    <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                        <span>⏳</span> Durasi Rekam
                                    </span>
                                    <span className="font-mono font-semibold text-gray-900 dark:text-zinc-100">
                                        {Math.floor(
                                            sessionData.duration_seconds / 60,
                                        )
                                            .toString()
                                            .padStart(2, '0')}
                                        :
                                        {(sessionData.duration_seconds % 60)
                                            .toString()
                                            .padStart(2, '0')}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-t border-gray-50 py-0.5 dark:border-zinc-800/50">
                                    <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                        <span>📝</span> Hasil Entri
                                    </span>
                                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 font-mono text-xs font-bold text-blue-700 dark:bg-blue-950/50 dark:text-blue-400">
                                        {totalEntries} tindakan
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Detail Tim Pelaksana */}
                        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                            <h3 className="mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500">
                                Tim Respon Code Blue
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-start justify-between py-0.5">
                                    <span className="w-28 shrink-0 font-medium text-gray-500 dark:text-gray-400">
                                        Leader Tim
                                    </span>
                                    <span className="text-right font-semibold text-gray-900 dark:text-zinc-100">
                                        {sessionData.leader_name || '-'}
                                    </span>
                                </div>
                                <div className="flex items-start justify-between border-t border-gray-50 py-0.5 dark:border-zinc-800/50">
                                    <span className="w-28 shrink-0 font-medium text-gray-500 dark:text-gray-400">
                                        Dokumentator
                                    </span>
                                    <span className="text-right font-semibold text-gray-900 dark:text-zinc-100">
                                        {sessionData.user?.name || '-'}
                                    </span>
                                </div>
                                <div className="flex justify-between border-t border-gray-800 pt-3">
                                    <span className="text-sm font-medium text-gray-500">
                                        Anggota Respon
                                    </span>
                                    <div className="ml-4 flex-1 text-right text-sm">
                                        {/* INI KODE PARSING JSON-NYA MASUK DI SINI */}
                                        {(() => {
                                            try {
                                                return JSON.parse(
                                                    sessionData.team_members,
                                                ).map((m: any, i: number) => (
                                                    <div
                                                        key={i}
                                                        className="mb-2 flex flex-col last:mb-0"
                                                    >
                                                        <span className="font-bold text-gray-200">
                                                            {m.name}
                                                        </span>
                                                        <span className="text-xs text-gray-400 italic">
                                                            {m.role}
                                                        </span>
                                                    </div>
                                                ));
                                            } catch (e) {
                                                // Jaga-jaga kalau datanya bukan JSON biar nggak error
                                                return (
                                                    <span className="text-gray-200">
                                                        {
                                                            sessionData.team_members
                                                        }
                                                    </span>
                                                );
                                            }
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigasi / Action Buttons */}
                    <div className="mt-auto space-y-2.5 pt-6">
                        <Link
                            href={`/draft/${sessionData.id}`}
                            className="flex w-full items-center justify-center rounded-xl bg-blue-900 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-900/10 transition hover:bg-blue-800 active:scale-[0.98]"
                        >
                            Edit Draft / Kirim ke EMR
                        </Link>
                        <Link
                            href="/dashboard"
                            className="flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white py-3.5 text-sm font-bold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900 active:scale-[0.98] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
                        >
                            Lihat Draft
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

RecordSummary.layout = (page: React.ReactNode) => <AppLayout children={page} />;
