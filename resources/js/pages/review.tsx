import { Head, useForm, Link } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import AppLayout from '@/layouts/new-app-layout';
import axios from 'axios';

export default function Review({ sessionData }: any) {
    // ─── STATE UNTUK MODAL DEBUG LOG ───
    const [showLogModal, setShowLogModal] = useState(false);
    const [debugLogs, setDebugLogs] = useState<any[]>([]);
    const [isLoadingLogs, setIsLoadingLogs] = useState(false);

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
        ttv_time: sessionData.ttv_time || defaultTime,
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

    // ─── FUNGSI FETCH DEBUG LOGS ───
    const openDebugLog = async () => {
        setShowLogModal(true);
        setIsLoadingLogs(true);
        try {
            const res = await axios.get(
                `/api/code-blue/debug-log/${sessionData.id}`,
            );
            setDebugLogs(res.data);
        } catch (error) {
            console.error('Gagal mengambil debug log', error);
        } finally {
            setIsLoadingLogs(false);
        }
    };

    // Pewarnaan teks log di modal
    const getLogColor = (type: string) => {
        if (type === 'result') return 'text-green-400';
        if (type === 'send') return 'text-blue-400';
        if (type === 'error') return 'text-red-400';
        if (type === 'ws') return 'text-yellow-400';
        if (type === 'silence') return 'text-gray-500';
        return 'text-gray-300';
    };

    const renderTeamMembers = () => {
        let members = sessionData.team_members;

        if (typeof members === 'string') {
            try {
                members = JSON.parse(members);
            } catch (e) {
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

            <div className="relative mx-auto min-h-screen w-full max-w-[98%] bg-gray-50 p-4 antialiased">
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

                        {/* ─── CONTAINER TOMBOL KANAN ─── */}
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={openDebugLog}
                                title="Lihat Log Sistem STT"
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-800 transition hover:bg-blue-700"
                            >
                                🐛
                            </button>
                            <span className="rounded-full bg-yellow-400 px-4 py-1 text-xs font-bold text-yellow-950 shadow-sm">
                                {sessionData.status === 'draft'
                                    ? 'MENUNGGU VALIDASI DPJP'
                                    : 'SELESAI'}
                            </span>
                        </div>
                    </div>

                    {/* Section 1: Info Cards */}
                    <div className="grid grid-cols-1 gap-4 rounded-b-xl border-x border-gray-200 bg-white p-4 shadow-sm md:grid-cols-4">
                        {/* Identitas */}
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                            <h4 className="mb-2 flex items-center gap-2 border-b border-gray-200 pb-1 font-bold text-gray-800">
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

                        {/* Informasi Kejadian */}
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                            <h4 className="mb-2 flex items-center gap-2 border-b border-gray-200 pb-1 font-bold text-gray-800">
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

                    {/* ─── PEMUTAR REKAMAN SUARA ─── */}
                    {sessionData.audio_path && (
                        <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                            <div>
                                <h3 className="flex items-center gap-2 text-sm font-bold text-blue-900">
                                    <span className="text-xl">🎙️</span> Rekaman
                                    Asli Code Blue
                                </h3>
                                <p className="mt-1 text-xs text-gray-500">
                                    Bukti suara dari awal hingga akhir sesi.
                                </p>
                            </div>
                            <div className="w-1/2">
                                <audio
                                    controls
                                    className="h-10 w-full rounded-lg bg-gray-50 outline-none"
                                >
                                    <source
                                        src={`/storage/${sessionData.audio_path}`}
                                        type="audio/webm"
                                    />
                                    Browser Anda tidak mendukung elemen audio.
                                </audio>
                            </div>
                        </div>
                    )}

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

            {/* ─── MODAL POPUP DEBUG LOG ─── */}
            {showLogModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-3">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">🐛</span>
                                <h3 className="font-mono text-sm font-bold tracking-widest text-zinc-100 uppercase">
                                    Sistem STT Debug Log - Sesi #
                                    {sessionData.id}
                                </h3>
                            </div>
                            <button
                                onClick={() => setShowLogModal(false)}
                                className="text-zinc-400 transition hover:text-white"
                            >
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    ></path>
                                </svg>
                            </button>
                        </div>

                        <div className="h-96 overflow-y-auto p-4 font-mono text-xs">
                            {isLoadingLogs ? (
                                <div className="flex h-full items-center justify-center text-zinc-500">
                                    <p className="animate-pulse">
                                        Mengambil log dari database...
                                    </p>
                                </div>
                            ) : debugLogs.length === 0 ? (
                                <div className="flex h-full items-center justify-center text-zinc-600">
                                    <p>Belum ada data log untuk sesi ini.</p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {debugLogs.map((log: any, i: number) => (
                                        <div key={i} className="flex gap-2">
                                            <span className="shrink-0 text-zinc-600">
                                                [{log.time_mark}]
                                            </span>
                                            <span
                                                className={getLogColor(
                                                    log.type,
                                                )}
                                            >
                                                {log.message}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

Review.layout = (page: React.ReactNode) => <AppLayout children={page} />;
