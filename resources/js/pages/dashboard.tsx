import { Head, Link } from '@inertiajs/react';
import { dashboard } from '@/routes';
import AppLayout from '@/layouts/new-app-layout';

type Session = {
    id: number;
    start_time: string;
    duration_seconds: number;
    status: string;
    created_at: string;
    patient?: {
        name?: string;
    };
};

export default function Dashboard({ sessions = [] }: { sessions: Session[] }) {

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-4 p-4 md:h-[calc(100vh-110px)] md:overflow-hidden">
                
                <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
                    
                    {/* Box 1: Tombol Utama Rekam */}
                    <Link
                        href="/record/setup"
                        className="group relative flex flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-b from-blue-50/50 to-blue-50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-blue-100 hover:shadow-md hover:shadow-blue-100 col-span-2 md:col-span-1 dark:border-blue-900/30 dark:from-blue-950/10 dark:to-blue-950/20 dark:hover:bg-blue-950/30 dark:hover:shadow-none"
                    >
                        <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-blue-400/10 blur-xl transition-all group-hover:scale-150" />
                        
                        <div className="rounded-xl bg-blue-100 p-3.5 transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-200 dark:bg-blue-900/40 dark:group-hover:bg-blue-900/60">
                            <svg
                                className="h-7 w-7 text-blue-600 dark:text-blue-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                                />
                            </svg>
                        </div>
                        <span className="text-base font-bold tracking-wide text-blue-700 dark:text-blue-400">
                            Mulai Rekaman
                        </span>
                    </Link>

                    {/* Box 2: Info Total Sesi */}
                    <div className="group relative flex flex-col justify-center overflow-hidden rounded-2xl border border-gray-200/80 bg-gradient-to-b from-white to-gray-50/50 p-5 md:p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md col-span-1 dark:border-zinc-800 dark:from-zinc-900/60 dark:to-zinc-900/20">
                        
                        <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-blue-500/10 blur-lg transition-all group-hover:scale-150 dark:bg-blue-500/5" />
                        
                        <p className="mb-1 text-[10px] md:text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                            Total Dokumentasi
                        </p>
                        <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400">
                            {sessions.length}
                        </h3>
                        <p className="mt-2 text-[11px] md:text-xs text-gray-500 dark:text-zinc-400 truncate">
                            Sesi Code Blue tercatat
                        </p>
                    </div>

                    {/* Box 3: Info Draf Menunggu */}
                    <div className="group relative flex flex-col justify-center overflow-hidden rounded-2xl border border-gray-200/80 bg-gradient-to-b from-white to-gray-50/50 p-5 md:p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md col-span-1 dark:border-zinc-800 dark:from-zinc-900/60 dark:to-zinc-900/20">
                        
                        <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-amber-500/10 blur-lg transition-all group-hover:scale-150 dark:bg-amber-500/5" />
                        
                        <p className="mb-1 text-[10px] md:text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                            Draf Belum Selesai
                        </p>
                        <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-amber-500 dark:text-amber-400">
                            {
                                sessions.filter((s) => s.status === 'draft')
                                    .length
                            }
                        </h3>
                        <p className="mt-2 text-[11px] md:text-xs text-gray-500 dark:text-zinc-400 truncate">
                            Perlu direview & difinalisasi
                        </p>
                    </div>
                </div>

                {/* --- Daftar Riwayat --- */}
                <div className="relative flex flex-col flex-1 overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/40">
                    
                    {/* Header Area Riwayat */}
                    <div className="mb-4 flex items-center justify-between flex-shrink-0">
                        <h3 className="flex items-center gap-2.5 text-base font-bold text-gray-800 dark:text-zinc-200">
                            <div className="rounded-lg bg-blue-50 p-1.5 dark:bg-blue-950/40">
                                <svg
                                    className="h-4 w-4 text-blue-600 dark:text-blue-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2.5}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            Riwayat Tindakan Terbaru
                        </h3>
                    </div>

                    {/* Scroll List Item */}
                    <div className="flex-1 overflow-y-auto pr-1 space-y-3 max-h-[340px] md:max-h-none scrollbar-thin scrollbar-thumb-slate-200">
                        {sessions.length === 0 ? (
                            <div className="flex h-48 flex-col items-center justify-center text-center">
                                <div className="mb-3 rounded-full bg-gray-50 p-3 dark:bg-zinc-800/40">
                                    <svg className="h-6 w-6 text-gray-400 dark:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                </div>
                                <p className="text-sm font-medium text-gray-400 dark:text-zinc-500">
                                    Belum ada riwayat Code Blue yang dicatat.
                                </p>
                            </div>
                        ) : (
                            <>
                                {sessions.map((session) => (
                                    <div
                                        key={session.id}
                                        className="group/item flex flex-col items-start justify-between rounded-xl border border-gray-100 bg-white p-4 transition-all duration-200 hover:border-blue-100 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-transparent sm:flex-row sm:items-center dark:border-zinc-800/60 dark:bg-zinc-900/20 dark:hover:border-blue-900/30 dark:hover:from-blue-950/10"
                                    
                                    >
                                        <div className="space-y-1.5">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Link
                                                    href={`/draft/${session.id}`}
                                                    className="text-sm font-bold text-gray-800 transition-colors group-hover/item:text-blue-600 dark:text-zinc-200 dark:group-hover/item:text-blue-400"
                                                >
                                                    Sesi #{session.id} -{' '}
                                                    {session.patient?.name ||
                                                        'Tanpa Nama'}
                                                </Link>
                                                <span
                                                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase border ${session.status === 'draft' ? 'bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'}`}
                                                >
                                                    {session.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-zinc-500">
                                                <svg className="h-3.5 w-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>
                                                    {new Date(
                                                        session.created_at,
                                                    ).toLocaleString('id-ID', {
                                                        dateStyle: 'long',
                                                        timeStyle: 'short',
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex items-center gap-1.5 rounded-lg border border-gray-100 bg-gray-50/80 px-3 py-1.5 text-xs font-semibold text-gray-600 sm:mt-0 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-400">
                                            <span className="opacity-90">⏱️ Durasi:</span>{' '}
                                            <span className="font-mono text-gray-700 dark:text-zinc-300">
                                                {session.duration_seconds
                                                    ? `${Math.floor(session.duration_seconds / 60)}m ${session.duration_seconds % 60}s`
                                                    : '-'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

// Dashboard.layout = {
//     breadcrumbs: [
//         {
//             title: 'V-Code',
//             href: dashboard(),
//         },
//     ],
// };

Dashboard.layout = (page: React.ReactNode) => <AppLayout children={page} />;