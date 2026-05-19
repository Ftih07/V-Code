import { Head, useForm, Link } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import AppLayout from '@/layouts/new-app-layout';

export default function Review({ sessionData }: any) {
    // Ekstrak jam dari waktu kejadian (created_at) sebagai default
    const defaultTime = new Date(sessionData.created_at)
        .toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        })
        .replace(/\./g, ':');

    const { data, setData, put, processing } = useForm({
        additional_notes: sessionData.additional_notes || '',
        logs: sessionData.logs || [],

        // Data Form Baru
        assessment_condition: sessionData.assessment_condition || '',
        ttv_time: sessionData.ttv_time || defaultTime, // 👈 FIX-NYA DI SINI
        ttv_td: sessionData.ttv_td || '',
        ttv_nadi: sessionData.ttv_nadi || '',
        ttv_rr: sessionData.ttv_rr || '',
        ttv_spo2: sessionData.ttv_spo2 || '',
        ttv_gcs: sessionData.ttv_gcs || '',

        evaluation_result: sessionData.evaluation_result || '',
        evaluation_plan: sessionData.evaluation_plan || '',
    });

    const handleLogChange = (index: number, newText: string) => {
        const newLogs = [...data.logs];
        newLogs[index].action_text = newText;
        setData('logs', newLogs);
    };

    const handleDeleteLog = (index: number) => {
        const newLogs = [...data.logs];
        newLogs.splice(index, 1);
        setData('logs', newLogs);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/draft/${sessionData.id}`);
    };

    // Fungsi bantu untuk parse team members secara aman (String, Array, atau JSON String)
    const renderTeamMembers = () => {
        let members = sessionData.team_members;

        if (typeof members === 'string') {
            try {
                // Antisipasi jika data dikirim dalam bentuk JSON string
                members = JSON.parse(members);
            } catch (e) {
                // Jika gagal parse, berarti string biasa dengan koma
                return (
                    <p className="text-sm font-medium text-gray-800">
                        {members}
                    </p>
                );
            }
        }

        if (Array.isArray(members)) {
            return members.map((member: any, i: number) => (
                <div
                    key={i}
                    className="mb-1 flex justify-between text-sm text-gray-800"
                >
                    <span className="font-semibold">
                        {member.name || 'Nama Tidak Tersedia'}
                    </span>
                    <span className="text-gray-700">
                        : {member.role || 'Tanpa Peran'}
                    </span>
                </div>
            ));
        }

        return <p className="text-sm text-gray-500">-</p>;
    };

    return (
        <>
            <Head title={`Integrasi EMR Sesi #${sessionData.id}`} />

            <div className="mx-auto min-h-screen w-full max-w-[98%] bg-gray-50 p-4 antialiased">
                <div className="flex flex-col gap-4">
                    {/* Header Aplikasi */}
                    <div className="flex items-center justify-between rounded-t-xl bg-blue-900 p-4 text-white shadow-sm">
                        <div className="flex items-center gap-3">
                            <Link
                                href="/dashboard"
                                className="transition hover:text-gray-200"
                            >
                                <svg
                                    className="h-6 w-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                    ></path>
                                </svg>
                            </Link>
                            <h2 className="text-xl font-bold">
                                EMR Rumah Sakit – Integrasi V-CODE
                            </h2>
                        </div>
                        <span className="rounded-full bg-yellow-400 px-4 py-1 text-xs font-bold text-yellow-950 shadow-sm">
                            {sessionData.status === 'draft'
                                ? 'MENUNGGU VALIDASI DPJP'
                                : 'SELESAI'}
                        </span>
                    </div>

                    {/* Section 1: Info Cards */}
                    <div className="grid grid-cols-1 gap-4 rounded-b-xl border-x border-gray-200 bg-white p-4 shadow-sm md:grid-cols-4">
                        {/* Identitas */}
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                            <h4 className="mb-2 flex items-center gap-2 border-b border-gray-200 pb-1 font-bold text-gray-800">
                                <svg
                                    className="h-4 w-4 text-blue-800"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    ></path>
                                </svg>
                                Identitas Pasien
                            </h4>
                            <div className="grid grid-cols-3 gap-1 text-sm">
                                <span className="font-medium text-gray-600">
                                    Nama
                                </span>
                                <span className="col-span-2 font-semibold text-gray-900">
                                    : {sessionData.patient?.name || '-'}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-1 text-sm">
                                <span className="font-medium text-gray-600">
                                    No. RM
                                </span>
                                <span className="col-span-2 font-semibold text-gray-900">
                                    : {sessionData.patient?.rm_number || '-'}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-1 text-sm">
                                <span className="font-medium text-gray-600">
                                    Ruang
                                </span>
                                <span className="col-span-2 font-semibold text-gray-900">
                                    :{' '}
                                    {sessionData.patient?.ward_location || '-'}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-1 text-sm">
                                <span className="font-medium text-gray-600">
                                    Tgl Jam
                                </span>
                                <span className="col-span-2 font-semibold text-gray-900">
                                    :{' '}
                                    {sessionData.created_at
                                        ? new Date(
                                              sessionData.created_at,
                                          ).toLocaleString('id-ID')
                                        : '-'}
                                </span>
                            </div>
                        </div>

                        {/* Info Kejadian */}
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                            <h4 className="mb-2 flex items-center gap-2 border-b border-gray-200 pb-1 font-bold text-gray-800">
                                <svg
                                    className="h-4 w-4 text-blue-800"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    ></path>
                                </svg>
                                Informasi Kejadian
                            </h4>
                            <div className="grid grid-cols-3 gap-1 text-sm">
                                <span className="font-medium text-gray-600">
                                    Lokasi
                                </span>
                                <span className="col-span-2 font-semibold text-gray-900">
                                    :{' '}
                                    {sessionData.patient?.ward_location || '-'}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-1 text-sm">
                                <span className="font-medium text-gray-600">
                                    Kejadian
                                </span>
                                <span className="col-span-2 font-semibold text-red-700">
                                    : {sessionData.incident_type}
                                </span>
                            </div>
                        </div>

                        {/* Tim Inti */}
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                            <h4 className="mb-2 flex items-center gap-2 border-b border-gray-200 pb-1 font-bold text-gray-800">
                                <svg
                                    className="h-4 w-4 text-blue-800"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    ></path>
                                </svg>
                                Tim Code Blue
                            </h4>
                            <div className="grid grid-cols-3 gap-1 text-sm">
                                <span className="font-medium text-gray-600">
                                    Leader
                                </span>
                                <span className="col-span-2 font-semibold text-gray-900">
                                    : {sessionData.leader_name || '-'}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-1 text-sm">
                                <span className="font-medium text-gray-600">
                                    Pencatat
                                </span>
                                <span className="col-span-2 font-semibold text-gray-900">
                                    : {sessionData.user?.name || '-'}
                                </span>
                            </div>
                        </div>

                        {/* Anggota Tim Lainnya */}
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                            <h4 className="mb-2 flex items-center gap-2 border-b border-gray-200 pb-1 font-bold text-gray-800">
                                <svg
                                    className="h-4 w-4 text-blue-800"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                    ></path>
                                </svg>
                                Anggota Tim & Tugas
                            </h4>
                            <div className="custom-scrollbar max-h-24 overflow-y-auto pr-2">
                                {renderTeamMembers()}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                        <h3 className="mb-4 border-b pb-2 text-lg font-bold text-blue-900">
                            Ringkasan Dokumentasi Code Blue (EMR)
                        </h3>

                        {/* Grid 3 Kolom */}
                        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
                            {/* 1. PENGKAJIAN (FORM KIRI) */}
                            <div className="overflow-hidden rounded-lg border border-blue-200 bg-white shadow-sm">
                                <div className="border-b border-blue-200 bg-blue-800 p-2.5 text-center">
                                    <h3 className="font-bold tracking-wide text-white">
                                        1. PENGKAJIAN
                                    </h3>
                                </div>
                                <div className="space-y-4 p-4">
                                    <div>
                                        <h4 className="mb-1.5 text-sm font-bold text-blue-900">
                                            A. Kondisi Pasien
                                        </h4>
                                        <textarea
                                            value={data.assessment_condition}
                                            onChange={(e) =>
                                                setData(
                                                    'assessment_condition',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded border-gray-300 bg-white p-2 text-sm font-medium text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                            rows={3}
                                            placeholder="Ditemukan tidak sadarkan diri..."
                                        ></textarea>
                                    </div>
                                    <div>
                                        <h4 className="mb-1.5 text-sm font-bold text-blue-900">
                                            B. TTV Awal
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="grid grid-cols-3 items-center">
                                                <span className="font-medium text-gray-700">
                                                    Pukul
                                                </span>
                                                <input
                                                    type="text"
                                                    value={data.ttv_time}
                                                    onChange={(e) =>
                                                        setData(
                                                            'ttv_time',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="col-span-2 h-8 rounded border-gray-300 bg-white p-1 text-sm font-medium text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div className="grid grid-cols-3 items-center">
                                                <span className="font-medium text-gray-700">
                                                    TD
                                                </span>
                                                <div className="col-span-2 flex items-center gap-2 font-medium text-gray-900">
                                                    <input
                                                        type="text"
                                                        value={data.ttv_td}
                                                        onChange={(e) =>
                                                            setData(
                                                                'ttv_td',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="h-8 w-full rounded border-gray-300 bg-white p-1 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                    />{' '}
                                                    <span className="shrink-0 text-xs font-bold text-gray-500">
                                                        mmHg
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 items-center">
                                                <span className="font-medium text-gray-700">
                                                    Nadi
                                                </span>
                                                <div className="col-span-2 flex items-center gap-2 font-medium text-gray-900">
                                                    <input
                                                        type="text"
                                                        value={data.ttv_nadi}
                                                        onChange={(e) =>
                                                            setData(
                                                                'ttv_nadi',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="h-8 w-full rounded border-gray-300 bg-white p-1 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                    />{' '}
                                                    <span className="shrink-0 text-xs font-bold text-gray-500">
                                                        x/mnt
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 items-center">
                                                <span className="font-medium text-gray-700">
                                                    RR
                                                </span>
                                                <div className="col-span-2 flex items-center gap-2 font-medium text-gray-900">
                                                    <input
                                                        type="text"
                                                        value={data.ttv_rr}
                                                        onChange={(e) =>
                                                            setData(
                                                                'ttv_rr',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="h-8 w-full rounded border-gray-300 bg-white p-1 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                    />{' '}
                                                    <span className="shrink-0 text-xs font-bold text-gray-500">
                                                        x/mnt
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 items-center">
                                                <span className="font-medium text-gray-700">
                                                    SpO2
                                                </span>
                                                <div className="col-span-2 flex items-center gap-2 font-medium text-gray-900">
                                                    <input
                                                        type="text"
                                                        value={data.ttv_spo2}
                                                        onChange={(e) =>
                                                            setData(
                                                                'ttv_spo2',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="h-8 w-full rounded border-gray-300 bg-white p-1 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                    />{' '}
                                                    <span className="shrink-0 text-xs font-bold text-gray-500">
                                                        %
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 items-center">
                                                <span className="font-medium text-gray-700">
                                                    Kesadaran
                                                </span>
                                                <input
                                                    type="text"
                                                    value={data.ttv_gcs}
                                                    onChange={(e) =>
                                                        setData(
                                                            'ttv_gcs',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="GCS..."
                                                    className="col-span-2 h-8 rounded border-gray-300 bg-white p-1 text-sm font-medium text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 2. TINDAKAN (TABEL TENGAH) */}
                            <div className="flex h-[500px] flex-col overflow-hidden rounded-lg border border-green-300 bg-white shadow-sm">
                                <div className="shrink-0 border-b border-green-300 bg-green-800 p-2.5 text-center">
                                    <h3 className="font-bold tracking-wide text-white">
                                        2. TINDAKAN
                                    </h3>
                                </div>
                                <div className="flex-1 overflow-y-auto">
                                    <table className="w-full border-collapse text-left text-sm">
                                        <thead className="sticky top-0 z-10 border-b border-gray-300 bg-gray-100 font-bold text-gray-800">
                                            <tr>
                                                <th className="w-24 border-r border-gray-200 px-3 py-2 text-center">
                                                    Waktu
                                                </th>
                                                <th className="px-3 py-2">
                                                    Tindakan / Intervensi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {data.logs.map(
                                                (log: any, idx: number) =>
                                                    log.category ===
                                                        'tindakan' && (
                                                        <tr
                                                            key={idx}
                                                            className="group transition hover:bg-green-50/40"
                                                        >
                                                            <td className="border-r border-gray-200 bg-gray-50 px-3 py-2 text-center font-mono text-xs font-bold text-gray-900 group-hover:bg-green-50/60">
                                                                {log.time_mark}
                                                            </td>
                                                            <td className="flex items-center gap-2 px-3 py-1">
                                                                {/* Fix Utama: Mengubah warna tulisan input dari transparan ke text-gray-900 */}
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
                                                                    className="w-full rounded border-transparent bg-transparent p-1 text-sm font-medium text-gray-900 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                                                                />
                                                                {sessionData.status ===
                                                                    'draft' && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleDeleteLog(
                                                                                idx,
                                                                            )
                                                                        }
                                                                        className="px-1 text-red-500 opacity-0 transition duration-150 group-hover:opacity-100 hover:scale-110"
                                                                        title="Hapus log"
                                                                    >
                                                                        🗑️
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ),
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* 3. EVALUASI (FORM KANAN) */}
                            <div className="overflow-hidden rounded-lg border border-purple-200 bg-white shadow-sm">
                                <div className="border-b border-purple-200 bg-purple-800 p-2.5 text-center">
                                    <h3 className="font-bold tracking-wide text-white">
                                        3. EVALUASI
                                    </h3>
                                </div>
                                <div className="space-y-4 p-4">
                                    <div>
                                        <h4 className="mb-1.5 text-sm font-bold text-purple-900">
                                            A. Hasil
                                        </h4>
                                        <textarea
                                            value={data.evaluation_result}
                                            onChange={(e) =>
                                                setData(
                                                    'evaluation_result',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded border-gray-300 bg-white p-2 text-sm font-medium text-gray-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                            rows={4}
                                            placeholder="ROSC tercapai..."
                                        ></textarea>
                                    </div>
                                    <div>
                                        <h4 className="mb-1.5 text-sm font-bold text-purple-900">
                                            B. Rencana Tindak Lanjut
                                        </h4>
                                        <textarea
                                            value={data.evaluation_plan}
                                            onChange={(e) =>
                                                setData(
                                                    'evaluation_plan',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded border-gray-300 bg-white p-2 text-sm font-medium text-gray-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                            rows={4}
                                            placeholder="Pasien direncanakan dipindahkan..."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Submit */}
                    <form
                        onSubmit={submit}
                        className="mb-10 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                    >
                        <div className="mb-4">
                            <label className="mb-1.5 block text-sm font-bold text-blue-900">
                                Catatan Tambahan (Dokumentator)
                            </label>
                            <input
                                type="text"
                                value={data.additional_notes}
                                onChange={(e) =>
                                    setData('additional_notes', e.target.value)
                                }
                                className="w-full rounded border-gray-300 bg-white p-2 text-sm font-medium text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                placeholder="Contoh: Pasien ROSC tercapai pada 09.24.10..."
                            />
                        </div>
                        <div className="flex justify-end gap-4 border-t border-gray-100 pt-4">
                            <Link
                                href="/dashboard"
                                className="rounded-lg border border-blue-900 px-6 py-2 font-bold text-blue-900 transition hover:bg-gray-100"
                            >
                                Batal
                            </Link>
                            {sessionData.status === 'draft' && (
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-green-700 px-6 py-2 font-bold text-white shadow-md transition hover:bg-green-800 disabled:opacity-50"
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
        </>
    );
}

Review.layout = (page: React.ReactNode) => <AppLayout children={page} />;
