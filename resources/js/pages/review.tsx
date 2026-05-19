import { Head, useForm, Link } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import AppLayout from '@/layouts/new-app-layout';

export default function Review({ sessionData }: any) {
    const { data, setData, put, processing } = useForm({
        additional_notes: sessionData.additional_notes || '',
        logs: sessionData.logs || [],
    });

    // Fungsi update teks
    const handleLogChange = (index: number, newText: string) => {
        const newLogs = [...data.logs];
        newLogs[index].action_text = newText;
        setData('logs', newLogs);
    };

    // Fungsi hapus baris
    const handleLogDelete = (index: number) => {
        const newLogs = [...data.logs];
        newLogs.splice(index, 1);
        setData('logs', newLogs);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/draft/${sessionData.id}`);
    };

    return (
        <>
            <Head title={`Integrasi EMR Sesi #${sessionData.id}`} />

            <div className="mx-auto w-full max-w-4xl p-2 sm:p-4 md:p-6 antialiased">
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                    
                    {/* Header Aplikasi */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gradient-to-r from-blue-900 to-blue-850 p-4 sm:p-5 text-white gap-3">
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse hidden sm:block" />
                            <h2 className="text-lg sm:text-xl font-bold tracking-wide">
                                EMR Rumah Sakit
                            </h2>
                        </div>
                        <span className="self-start sm:self-auto rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 uppercase tracking-wider border border-amber-200">
                            {sessionData.status === 'draft'
                                ? 'Menunggu Validasi DPJP'
                                : 'Selesai'}
                        </span>
                    </div>

                    <div className="space-y-6 p-4 sm:p-6">
                        
                        {/* Section 1: Identitas Pasien */}
                        <div className="rounded-xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/40">
                            <h3 className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-2.5 font-bold text-gray-800 dark:border-zinc-800 dark:text-zinc-100">
                                <span className="h-4 w-1 rounded bg-blue-600" />
                                Identitas Pasien
                            </h3>
                            <div className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                                <div className="flex border-b border-gray-550/30 pb-2 sm:border-none sm:pb-0">
                                    <span className="w-28 shrink-0 text-gray-400 dark:text-zinc-500">Nama</span>
                                    <span className="font-semibold text-gray-900 dark:text-zinc-200">: {sessionData.patient?.name}</span>
                                </div>
                                <div className="flex border-b border-gray-550/30 pb-2 sm:border-none sm:pb-0">
                                    <span className="w-28 shrink-0 text-gray-400 dark:text-zinc-500">No. RM</span>
                                    <span className="font-mono font-bold text-gray-900 dark:text-zinc-200">: {sessionData.patient?.rm_number}</span>
                                </div>
                                <div className="flex border-b border-gray-550/30 pb-2 sm:border-none sm:pb-0">
                                    <span className="w-28 shrink-0 text-gray-400 dark:text-zinc-500">Ruang</span>
                                    <span className="font-medium text-gray-900 dark:text-zinc-200">: {sessionData.patient?.ward_location}</span>
                                </div>
                                <div className="flex pb-2 sm:pb-0">
                                    <span className="w-28 shrink-0 text-gray-400 dark:text-zinc-500">Tanggal/Jam Kejadian</span>
                                    <span className="font-medium text-gray-900 dark:text-zinc-200">
                                        : {new Date(sessionData.created_at).toLocaleDateString('id-ID', {
                                            year: 'numeric', month: '2-digit', day: '2-digit'
                                        })} {new Date(sessionData.created_at).toLocaleTimeString('id-ID', {
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Log Tindakan */}
                        <div className="space-y-3">
                            <h3 className="flex items-center gap-2 px-1 font-bold text-gray-800 dark:text-zinc-100 text-sm sm:text-base">
                                <span className="h-4 w-1 rounded bg-blue-600" />
                                Dokumentasi Tindakan Keperawatan Code Blue
                            </h3>
                            
                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200 shadow-sm dark:border-zinc-800">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-gray-700 dark:bg-zinc-800/50 dark:text-zinc-300 border-b border-gray-200 dark:border-zinc-800">
                                        <tr>
                                            <th className="w-36 px-5 py-3.5 font-bold tracking-wider">Waktu</th>
                                            <th className="px-5 py-3.5 font-bold tracking-wider">Tindakan / Intervensi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 bg-white dark:divide-zinc-800 dark:bg-zinc-900">
                                        {data.logs?.length > 0 ? (
                                            data.logs.map((log: any, idx: number) => (
                                                <tr key={idx} className="group transition-colors hover:bg-slate-55/30 dark:hover:bg-zinc-800/30">
                                                    <td className="px-5 py-3 font-mono font-medium text-gray-500 dark:text-zinc-400">
                                                        {log.time_mark}
                                                    </td>
                                                    <td className="px-5 py-2">
                                                        <div className="flex items-center gap-3">
                                                            <input
                                                                type="text"
                                                                value={log.action_text}
                                                                onChange={(e) => handleLogChange(idx, e.target.value)}
                                                                className="w-full rounded-lg border border-transparent bg-transparent px-3 py-1.5 text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:text-zinc-100 dark:focus:bg-zinc-950 dark:focus:ring-blue-900/30"
                                                                disabled={sessionData.status !== 'draft'}
                                                            />
                                                            {sessionData.status === 'draft' && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleLogDelete(idx)}
                                                                    className="opacity-0 group-hover:opacity-100 rounded-lg p-2 text-red-500 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                                                                    title="Hapus baris"
                                                                >
                                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={2} className="px-5 py-10 text-center text-gray-400 dark:text-zinc-500">
                                                    Belum ada rincian tindakan.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="space-y-3 md:hidden">
                                {data.logs?.length > 0 ? (
                                    data.logs.map((log: any, idx: number) => (
                                        <div key={idx} className="flex flex-col gap-2 rounded-xl border border-gray-100 bg-gray-50/60 p-3.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/20">
                                            <div className="flex items-center justify-between border-b border-gray-100 pb-2 dark:border-zinc-800">
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                                                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {log.time_mark}
                                                </div>
                                                {sessionData.status === 'draft' && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleLogDelete(idx)}
                                                        className="rounded-lg p-1.5 text-red-500 active:bg-red-100"
                                                    >
                                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                            <input
                                                type="text"
                                                value={log.action_text}
                                                onChange={(e) => handleLogChange(idx, e.target.value)}
                                                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-inner focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                                                disabled={sessionData.status !== 'draft'}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-400 dark:border-zinc-800">
                                        Belum ada rincian tindakan.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Section 3: Catatan Tambahan */}
                        <div className="rounded-xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/40">
                            <h3 className="mb-3 flex items-center gap-2 font-bold text-gray-800 dark:text-zinc-100 text-sm sm:text-base">
                                <span className="h-4 w-1 rounded bg-blue-600" />
                                Catatan Tambahan (Dokumentator)
                            </h3>
                            <textarea
                                id="notes"
                                value={data.additional_notes}
                                onChange={(e) => setData('additional_notes', e.target.value)}
                                className="w-full rounded-lg border border-gray-250 bg-white p-3 text-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-100"
                                rows={3}
                                placeholder="Masukkan catatan klinis tambahan di sini..."
                                disabled={sessionData.status === 'final'}
                            />
                        </div>

                        {/* Section 4: Susunan Tim */}
                        <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 sm:p-5 dark:border-zinc-800/60 dark:bg-zinc-950/20">
                            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                                Tim Pelaksana Code Blue
                            </h4>
                            <div className="flex flex-col gap-3 text-sm md:flex-row md:items-center md:gap-6">
                                <div className="flex items-start gap-1">
                                    <span className="font-semibold text-gray-700 dark:text-zinc-400 shrink-0">Leader:</span>
                                    <span className="text-gray-900 dark:text-zinc-200 ml-1">{sessionData.leader_name}</span>
                                </div>
                                <div className="h-4 w-px bg-gray-200 hidden md:block dark:bg-zinc-800" />
                                <div className="flex items-start gap-1">
                                    <span className="font-semibold text-gray-700 dark:text-zinc-400 shrink-0">Pencatat:</span>
                                    <span className="text-gray-900 dark:text-zinc-200 ml-1">{sessionData.user?.name}</span>
                                </div>
                                <div className="h-4 w-px bg-gray-200 hidden md:block dark:bg-zinc-800" />
                                <div className="flex items-start gap-1">
                                    <span className="font-semibold text-gray-700 dark:text-zinc-400 shrink-0">Anggota:</span>
                                    <span className="text-gray-900 dark:text-zinc-200 ml-1 leading-relaxed">{sessionData.team_members}</span>
                                </div>
                            </div>
                        </div>

                        {/* Section 5: Action Buttons */}
                        <form onSubmit={submit} className="border-t border-gray-100 pt-4 dark:border-zinc-800">
                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <Link
                                    href="/dashboard"
                                    className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-center text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 active:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-850"
                                >
                                    Batal
                                </Link>
                                
                                {sessionData.status === 'draft' && (
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-2.5 text-center text-sm font-bold text-white shadow-md transition hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50"
                                    >
                                        {processing ? 'Memproses...' : 'Validasi & Finalisasi'}
                                    </button>
                                )}
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </>
    );
}

Review.layout = (page: React.ReactNode) => <AppLayout children={page} />;