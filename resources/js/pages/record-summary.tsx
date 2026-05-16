import { Head, Link } from '@inertiajs/react';

export default function RecordSummary({ sessionData }: any) {
    const totalEntries = sessionData.logs ? sessionData.logs.length : 0;

    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-50 px-2 py-4 sm:p-6">
            <Head title="Perekaman Selesai - V-CODE" />

            <div className="flex w-full max-w-md flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
                <div className="flex items-center justify-between bg-blue-900 p-4 text-white">
                    <Link href="/dashboard">
                        <svg
                            className="h-6 w-6"
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
                    <h1 className="text-lg font-bold">V-CODE</h1>
                    <div className="w-6"></div>
                </div>

                <div className="flex flex-col items-center p-8 text-center">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                        <svg
                            className="h-10 w-10 text-green-600"
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
                    <h2 className="text-xl font-bold text-gray-900">
                        Perekaman Selesai
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Draft berhasil disimpan
                    </p>
                </div>

                <div className="space-y-6 px-6 pb-6">
                    <div className="rounded-xl border border-gray-200 p-4">
                        <h3 className="mb-3 border-b pb-2 font-bold text-gray-900">
                            Ringkasan Draft
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="flex items-center gap-2 text-gray-500">
                                    ⏱️ Waktu Mulai
                                </span>
                                <span className="font-medium text-gray-900">
                                    {new Date(
                                        sessionData.start_time,
                                    ).toLocaleTimeString('id-ID')}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="flex items-center gap-2 text-gray-500">
                                    ⏳ Durasi
                                </span>
                                <span className="font-medium text-gray-900">
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
                            <div className="flex justify-between">
                                <span className="flex items-center gap-2 text-gray-500">
                                    📝 Jumlah Entri
                                </span>
                                <span className="font-medium text-gray-900">
                                    {totalEntries} tindakan
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 p-4">
                        <h3 className="mb-3 border-b pb-2 font-bold text-gray-900">
                            Informasi Tim Code Blue
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-start justify-between">
                                <span className="w-32 shrink-0 text-gray-500">
                                    Leader
                                </span>
                                <span className="text-right font-medium text-gray-900">
                                    {sessionData.leader_name || '-'}
                                </span>
                            </div>
                            <div className="flex items-start justify-between">
                                <span className="w-32 shrink-0 text-gray-500">
                                    Dokumentator
                                </span>
                                <span className="text-right font-medium text-gray-900">
                                    {sessionData.user?.name || '-'}
                                </span>
                            </div>
                            <div className="flex items-start justify-between">
                                <span className="w-32 shrink-0 text-gray-500">
                                    Anggota
                                </span>
                                <span className="text-right font-medium text-gray-900">
                                    {sessionData.team_members || '-'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 pt-2">
                        <Link
                            href="/dashboard"
                            className="flex w-full items-center justify-center rounded-lg bg-blue-900 py-3 font-bold text-white hover:bg-blue-800"
                        >
                            Lihat Draft
                        </Link>
                        <Link
                            href={`/draft/${sessionData.id}`}
                            className="flex w-full items-center justify-center rounded-lg border-2 border-blue-900 bg-white py-3 font-bold text-blue-900 hover:bg-blue-50"
                        >
                            Edit Draft / Kirim ke EMR
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
