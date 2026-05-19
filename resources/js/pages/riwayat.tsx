import { Head, router } from '@inertiajs/react';
import NewAppLayout from '@/layouts/new-app-layout';

export default function Riwayat({ sessions }: { sessions: any[] }) {
    return (
        <NewAppLayout>
            <Head title="Riwayat Dokumentasi" />
            <div className="mx-auto max-w-4xl p-4 md:p-6">
                <h1 className="mb-6 text-2xl font-black text-gray-800 dark:text-white">
                    Riwayat Dokumentasi
                </h1>

                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    {sessions.map((s) => (
                        <div
                            key={s.id}
                            onClick={() => router.get(`/draft/${s.id}`)} // 👈 KLIK UNTUK BUKA REVIEW
                            className="flex cursor-pointer items-center justify-between border-b border-gray-100 p-4 transition-colors hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-800"
                        >
                            <div>
                                <p className="font-bold text-gray-900 dark:text-white">
                                    {s.patient?.name || 'Tanpa Nama'}
                                </p>
                                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                    {s.incident_type}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-gray-400 dark:text-zinc-500">
                                    {new Date(
                                        s.created_at,
                                    ).toLocaleDateString()}
                                </p>
                                <span className="mt-1 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-black text-gray-600 uppercase dark:bg-zinc-700 dark:text-zinc-300">
                                    {s.status}
                                </span>
                            </div>
                        </div>
                    ))}
                    {sessions.length === 0 && (
                        <div className="p-10 text-center text-gray-500">
                            Belum ada riwayat dokumentasi.
                        </div>
                    )}
                </div>
            </div>
        </NewAppLayout>
    );
}
