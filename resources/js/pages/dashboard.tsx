import { Head, Link } from '@inertiajs/react';
import { dashboard } from '@/routes';

type Session = {
    id: number;
    start_time: string;
    duration_seconds: number;
    status: string;
    created_at: string;
};

export default function Dashboard({ sessions = [] }: { sessions: Session[] }) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* --- BAGIAN ATAS: 3 Grid Box --- */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {/* Box 1: Tombol Utama Rekam (Warna Merah) */}
                    <Link
                        href="/record/setup"
                        className="group relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border border-red-500/50 bg-red-50 p-6 transition-all hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40"
                    >
                        <div className="rounded-full bg-red-200 p-3 transition-transform group-hover:scale-110 dark:bg-red-800/50">
                            <svg
                                className="h-8 w-8 text-red-700 dark:text-red-400"
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
                        <span className="text-lg font-bold text-red-700 dark:text-red-400">
                            Mulai Rekaman
                        </span>
                    </Link>

                    {/* Box 2: Info Total Sesi */}
                    <div className="relative flex flex-col justify-center overflow-hidden rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-zinc-900/50">
                        <p className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                            Total Dokumentasi
                        </p>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {sessions.length}
                        </h3>
                        <p className="mt-2 text-xs text-gray-400">
                            Sesi Code Blue tercatat
                        </p>
                    </div>

                    {/* Box 3: Info Draf Menunggu */}
                    <div className="relative flex flex-col justify-center overflow-hidden rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-zinc-900/50">
                        <p className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                            Draf Belum Selesai
                        </p>
                        <h3 className="text-3xl font-bold text-yellow-600 dark:text-yellow-500">
                            {
                                sessions.filter((s) => s.status === 'draft')
                                    .length
                            }
                        </h3>
                        <p className="mt-2 text-xs text-gray-400">
                            Perlu direview & difinalisasi
                        </p>
                    </div>
                </div>

                {/* --- BAGIAN BAWAH: Daftar Riwayat --- */}
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-white p-6 md:min-h-min dark:border-sidebar-border dark:bg-zinc-900/50">
                    <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                        <svg
                            className="h-5 w-5 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        Riwayat Tindakan Terbaru
                    </h3>

                    {sessions.length === 0 ? (
                        <div className="flex h-40 flex-col items-center justify-center text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Belum ada riwayat Code Blue yang dicatat.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {sessions.map((session) => (
                                <div
                                    key={session.id}
                                    className="flex flex-col items-start justify-between rounded-lg border border-sidebar-border/50 p-4 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center dark:hover:bg-zinc-800/50"
                                >
                                    <div>
                                        <div className="mb-1 flex items-center gap-2">
                                            <Link
                                                href={`/draft/${session.id}`}
                                                className="font-semibold text-gray-900 transition-colors hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400"
                                            >
                                                Sesi #{session.id} -{' '}
                                                {session.patient?.name ||
                                                    'Tanpa Nama'}
                                            </Link>
                                            <span
                                                className={`rounded px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${session.status === 'draft' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500'}`}
                                            >
                                                {session.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {new Date(
                                                session.created_at,
                                            ).toLocaleString('id-ID', {
                                                dateStyle: 'long',
                                                timeStyle: 'short',
                                            })}
                                        </p>
                                    </div>
                                    <div className="mt-2 rounded-md border border-sidebar-border/50 bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 sm:mt-0 dark:bg-zinc-800 dark:text-gray-300">
                                        ⏱️ Durasi:{' '}
                                        {session.duration_seconds
                                            ? `${Math.floor(session.duration_seconds / 60)}m ${session.duration_seconds % 60}s`
                                            : '-'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
