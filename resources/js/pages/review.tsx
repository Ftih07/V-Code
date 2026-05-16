import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { FormEventHandler } from 'react';

export default function Review({ sessionData }: any) {
    const { data, setData, put, processing } = useForm({
        additional_notes: sessionData.additional_notes || '',
        logs: sessionData.logs || [],
    });

    const handleLogChange = (index: number, newText: string) => {
        const newLogs = [...data.logs];
        newLogs[index].action_text = newText;
        setData('logs', newLogs);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/draft/${sessionData.id}`);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                {
                    title: 'Integrasi EMR - Rekam Medis',
                    href: `/draft/${sessionData.id}`,
                },
            ]}
        >
            <Head title={`Integrasi EMR Sesi #${sessionData.id}`} />

            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 md:p-8">
                <div className="overflow-hidden rounded-xl border border-sidebar-border bg-white shadow-sm dark:bg-zinc-900">
                    <div className="flex items-center justify-between bg-blue-900 p-5 text-white">
                        <h2 className="text-xl font-bold tracking-wide">
                            EMR Rumah Sakit - Integrasi V-CODE
                        </h2>
                        <span className="rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-yellow-900 uppercase">
                            {sessionData.status === 'draft'
                                ? 'Menunggu Validasi DPJP'
                                : 'Selesai'}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-8 p-6 md:grid-cols-3">
                        <div className="space-y-6 md:col-span-1">
                            <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-zinc-700 dark:bg-zinc-800/50">
                                <h3 className="mb-4 border-b pb-2 font-bold text-gray-900 dark:text-white">
                                    Identitas Pasien
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="grid grid-cols-3 gap-2">
                                        <span className="text-gray-500">
                                            Nama
                                        </span>
                                        <span className="col-span-2 font-medium">
                                            : {sessionData.patient?.name}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <span className="text-gray-500">
                                            No. RM
                                        </span>
                                        <span className="col-span-2 font-medium">
                                            : {sessionData.patient?.rm_number}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <span className="text-gray-500">
                                            Ruang
                                        </span>
                                        <span className="col-span-2 font-medium">
                                            :{' '}
                                            {sessionData.patient?.ward_location}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <span className="text-gray-500">
                                            Tgl Sesi
                                        </span>
                                        <span className="col-span-2 font-medium">
                                            :{' '}
                                            {new Date(
                                                sessionData.created_at,
                                            ).toLocaleDateString('id-ID')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-zinc-700 dark:bg-zinc-800/50">
                                <h3 className="mb-4 border-b pb-2 font-bold text-gray-900 dark:text-white">
                                    Tim Code Blue
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="grid grid-cols-3 gap-2">
                                        <span className="text-gray-500">
                                            Leader
                                        </span>
                                        <span className="col-span-2 font-medium">
                                            : {sessionData.leader_name}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <span className="text-gray-500">
                                            Pencatat
                                        </span>
                                        <span className="col-span-2 font-medium">
                                            : {sessionData.user?.name}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <span className="text-gray-500">
                                            Anggota
                                        </span>
                                        <span className="col-span-2 leading-relaxed font-medium">
                                            : {sessionData.team_members}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 md:col-span-2">
                            <div>
                                <h3 className="mb-3 font-bold text-gray-900 dark:text-white">
                                    Dokumentasi Tindakan Keperawatan Code Blue
                                </h3>
                                <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-zinc-700">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:text-blue-300">
                                            <tr>
                                                <th className="w-32 border-b border-gray-200 px-4 py-3 font-semibold dark:border-zinc-700">
                                                    Waktu
                                                </th>
                                                <th className="border-b border-gray-200 px-4 py-3 font-semibold dark:border-zinc-700">
                                                    Tindakan / Intervensi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white dark:divide-zinc-700 dark:bg-zinc-900">
                                            {data.logs?.length > 0 ? (
                                                data.logs.map(
                                                    (log: any, idx: number) => (
                                                        <tr
                                                            key={idx}
                                                            className="transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                                                        >
                                                            <td className="w-32 px-4 py-3 font-mono text-gray-600 dark:text-gray-400">
                                                                {log.time_mark}
                                                            </td>
                                                            <td className="px-4 py-2">
                                                                <input
                                                                    type="text"
                                                                    value={
                                                                        log.action_text
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        handleLogChange(
                                                                            idx,
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    className="w-full border-b border-transparent bg-transparent px-2 py-1 text-blue-900 transition-colors hover:border-gray-300 focus:border-blue-500 focus:ring-0 dark:text-blue-100 dark:hover:border-zinc-600"
                                                                    disabled={
                                                                        sessionData.status !==
                                                                        'draft'
                                                                    } 
                                                                />
                                                            </td>
                                                        </tr>
                                                    ),
                                                )
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan={2}
                                                        className="px-4 py-8 text-center text-gray-500"
                                                    >
                                                        Belum ada rincian
                                                        tindakan.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <form
                                onSubmit={submit}
                                className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-zinc-700 dark:bg-zinc-800/30"
                            >
                                <div>
                                    <label
                                        htmlFor="notes"
                                        className="mb-2 block text-sm font-bold text-gray-900 dark:text-white"
                                    >
                                        Catatan Tambahan (Dokumentator)
                                    </label>
                                    <textarea
                                        id="notes"
                                        value={data.additional_notes}
                                        onChange={(e) =>
                                            setData(
                                                'additional_notes',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-md border border-gray-300 bg-white p-3 text-sm focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-950"
                                        rows={3}
                                        placeholder="Contoh: Pasien ROSC tercapai pada 10:22..."
                                        disabled={
                                            sessionData.status === 'final'
                                        }
                                    />
                                </div>

                                <div className="mt-2 flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-zinc-700">
                                    <Link
                                        href="/dashboard"
                                        className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800"
                                    >
                                        Batal
                                    </Link>
                                    {sessionData.status === 'draft' && (
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-green-700 disabled:opacity-50"
                                        >
                                            {processing
                                                ? 'Menyimpan...'
                                                : 'Validasi & Finalisasi'}
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
