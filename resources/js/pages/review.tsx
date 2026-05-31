import { Head, useForm, Link } from '@inertiajs/react';
import axios from 'axios';
import type { FormEventHandler } from 'react';
import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/new-app-layout';

// ─── Shared input class ───────────────────────────────────────────────────────
const inputClass =
    'w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-blue-500 dark:focus:bg-white/10 dark:focus:ring-blue-500/20';
const textareaClass =
    'w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-blue-500 dark:focus:bg-white/10 dark:focus:ring-blue-500/20';

// ─── Sub-helpers ──────────────────────────────────────────────────────────────
function TtvRow({
    label,
    value,
    unit,
    onChange,
}: {
    label: string;
    value: string;
    unit?: string;
    onChange: (v: string) => void;
}) {
    return (
        <div className="flex items-center gap-3">
            <span className="w-20 flex-shrink-0 text-xs font-semibold text-gray-500 dark:text-zinc-400">
                {label}
            </span>
            <div className="flex flex-1 items-center gap-1.5">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={inputClass}
                />
                {unit && (
                    <span className="flex-shrink-0 text-xs font-bold text-gray-400 dark:text-zinc-500">
                        {unit}
                    </span>
                )}
            </div>
        </div>
    );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Review({ sessionData }: any) {
    const [showLogModal, setShowLogModal] = useState(false);
    const [debugLogs, setDebugLogs] = useState<any[]>([]);
    const [isLoadingLogs, setIsLoadingLogs] = useState(false);
    const [activeTab, setActiveTab] = useState<
        'pengkajian' | 'tindakan' | 'evaluasi'
    >('pengkajian');

    const defaultTime = new Date(sessionData.created_at)
        .toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        .replace(/\./g, ':');

    // Setup State Repeater untuk Tim Code Blue
    const [team, setTeam] = useState(() => {
        if (sessionData.team_members) {
            try {
                const parsed = JSON.parse(sessionData.team_members);
                return Array.isArray(parsed) && parsed.length > 0
                    ? parsed
                    : [{ name: '', role: '' }];
            } catch {
                return [{ name: '', role: '' }];
            }
        }
        return [{ name: '', role: '' }];
    });

    const { data, setData, put, processing } = useForm({
        // FIELD BARU DARI SETUP:
        leader_name: sessionData.leader_name || '',
        recorder_name:
            sessionData.recorder_name || sessionData.user?.name || '',
        team_members: sessionData.team_members || '[]',

        additional_notes: sessionData.additional_notes || '',
        logs: sessionData.logs || [],
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

    useEffect(() => {
        setData('team_members', JSON.stringify(team));
    }, [team, setData]);

    const addTeamMember = () => setTeam([...team, { name: '', role: '' }]);
    const removeTeamMember = (index: number) => {
        if (team.length === 1) return;
        const newTeam = [...team];
        newTeam.splice(index, 1);
        setTeam(newTeam);
    };
    const handleTeamChange = (
        index: number,
        field: 'name' | 'role',
        value: string,
    ) => {
        const newTeam = [...team];
        newTeam[index][field] = value;
        setTeam(newTeam);
    };

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

        const isTeamValid = team.every(
            (member) => member.name.trim() !== '' && member.role.trim() !== '',
        );
        if (!isTeamValid) {
            alert(
                'Mohon lengkapi nama dan tugas semua anggota tim, atau hapus baris yang kosong.',
            );
            return;
        }

        put(`/draft/${sessionData.id}`);
    };

    const openDebugLog = async () => {
        setShowLogModal(true);
        setIsLoadingLogs(true);
        try {
            const res = await axios.get(
                `/api/code-blue/debug-log/${sessionData.id}`,
            );
            setDebugLogs(res.data);
        } catch {
            /* ignore */
        } finally {
            setIsLoadingLogs(false);
        }
    };

    const getLogColor = (type: string) => {
        if (type === 'result') return 'text-emerald-400';
        if (type === 'send') return 'text-blue-400';
        if (type === 'error') return 'text-red-400';
        if (type === 'ws') return 'text-amber-400';
        if (type === 'silence') return 'text-zinc-600';
        return 'text-zinc-400';
    };

    const tindakanLogs = data.logs.filter(
        (l: any) => l.category === 'tindakan',
    );

    const tabs = [
        {
            key: 'pengkajian',
            label: 'Pengkajian',
            color: 'text-blue-600 dark:text-blue-400',
            activeBg: 'bg-blue-600',
        },
        {
            key: 'tindakan',
            label: 'Tindakan',
            color: 'text-emerald-600 dark:text-emerald-400',
            activeBg: 'bg-emerald-600',
        },
        {
            key: 'evaluasi',
            label: 'Evaluasi',
            color: 'text-purple-600 dark:text-purple-400',
            activeBg: 'bg-purple-600',
        },
    ] as const;

    return (
        <>
            <Head title={`Draft Sesi #${sessionData.id} — V-Code`} />

            <form onSubmit={submit}>
                <div className="flex flex-col gap-4">
                    {/* ── PAGE HEADER ── */}
                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard"
                            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:border-gray-300 hover:text-gray-700 active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400 dark:hover:text-zinc-200"
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
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </Link>
                        <div className="min-w-0 flex-1">
                            <h1 className="text-lg font-black tracking-tight text-gray-900 dark:text-white">
                                EMR — Integrasi V-Code
                            </h1>
                            <p className="text-xs text-gray-400 dark:text-zinc-500">
                                Sesi #{sessionData.id}
                            </p>
                        </div>
                        <div className="flex flex-shrink-0 items-center gap-2">
                            <button
                                type="button"
                                onClick={openDebugLog}
                                title="Lihat Log Sistem STT"
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400 shadow-sm transition hover:border-gray-300 hover:text-gray-600 dark:border-white/10 dark:bg-white/5 dark:hover:text-zinc-300"
                            >
                                <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                                    />
                                </svg>
                            </button>
                            <span
                                className={`rounded-xl px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase ${sessionData.status === 'draft' ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'}`}
                            >
                                {sessionData.status === 'draft'
                                    ? 'Draft'
                                    : 'Selesai'}
                            </span>
                        </div>
                    </div>

                    {/* ── INFO CARDS ── */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Identitas Pasien */}
                        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-white/5 dark:bg-[#1C1F2A]">
                            <div className="border-b border-gray-100 px-4 py-3 dark:border-white/5">
                                <p className="text-[11px] font-bold tracking-widest text-gray-400 uppercase dark:text-zinc-500">
                                    Identitas Pasien
                                </p>
                            </div>
                            <div className="space-y-2 p-4 text-sm">
                                <div className="flex items-start justify-between gap-2">
                                    <span className="flex-shrink-0 text-gray-400 dark:text-zinc-500">
                                        Nama
                                    </span>
                                    <span className="text-right font-bold text-gray-900 dark:text-white">
                                        {sessionData.patient?.name || '—'}
                                    </span>
                                </div>
                                <div className="flex items-start justify-between gap-2">
                                    <span className="flex-shrink-0 text-gray-400 dark:text-zinc-500">
                                        No. RM
                                    </span>
                                    <span className="text-right font-mono font-bold text-gray-900 dark:text-white">
                                        {sessionData.patient?.rm_number || '—'}
                                    </span>
                                </div>
                                <div className="flex items-start justify-between gap-2">
                                    <span className="flex-shrink-0 text-gray-400 dark:text-zinc-500">
                                        Ruang
                                    </span>
                                    <span className="text-right font-bold text-gray-900 dark:text-white">
                                        {sessionData.patient?.ward_location ||
                                            '—'}
                                    </span>
                                </div>
                                <div className="flex items-start justify-between gap-2">
                                    <span className="flex-shrink-0 text-gray-400 dark:text-zinc-500">
                                        Tanggal
                                    </span>
                                    <span className="text-right font-bold text-gray-900 dark:text-white">
                                        {sessionData.created_at
                                            ? new Date(
                                                  sessionData.created_at,
                                              ).toLocaleString('id-ID', {
                                                  day: 'numeric',
                                                  month: 'short',
                                                  year: 'numeric',
                                                  hour: '2-digit',
                                                  minute: '2-digit',
                                              })
                                            : '—'}
                                    </span>
                                </div>
                                <div className="flex items-start justify-between gap-2">
                                    <span className="flex-shrink-0 text-gray-400 dark:text-zinc-500">
                                        Kejadian
                                    </span>
                                    <span className="text-right font-bold text-red-600 dark:text-red-400">
                                        {sessionData.incident_type || '—'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Tim Code Blue (Sekarang Bisa Diedit) */}
                        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-white/5 dark:bg-[#1C1F2A]">
                            <div className="border-b border-gray-100 px-4 py-3 dark:border-white/5">
                                <p className="text-[11px] font-bold tracking-widest text-gray-400 uppercase dark:text-zinc-500">
                                    Tim Code Blue
                                </p>
                            </div>
                            <div className="space-y-3 p-4">
                                {/* Leader */}
                                <div>
                                    <label className="mb-1 block text-xs font-bold text-gray-700 dark:text-zinc-300">
                                        Leader (Dokter Jaga)
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.leader_name}
                                        onChange={(e) =>
                                            setData(
                                                'leader_name',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Contoh: dr. Andi Pratama"
                                        className={inputClass}
                                    />
                                </div>

                                {/* Pencatat */}
                                <div>
                                    <label className="mb-1 block text-xs font-bold text-gray-700 dark:text-zinc-300">
                                        Pencatat
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.recorder_name}
                                        onChange={(e) =>
                                            setData(
                                                'recorder_name',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Nama Pencatat / Perawat"
                                        className={inputClass}
                                    />
                                </div>

                                <div className="border-t border-gray-100 pt-3 dark:border-white/5">
                                    <label className="mb-2 block text-xs font-bold text-gray-700 dark:text-zinc-300">
                                        Susunan Anggota Tim
                                    </label>
                                    <div className="space-y-2.5">
                                        {team.map((member, index) => (
                                            <div
                                                key={index}
                                                className="flex items-start gap-2.5"
                                            >
                                                <div className="flex h-8 w-6 flex-shrink-0 items-center justify-center pt-1">
                                                    <span className="text-xs font-bold text-gray-300 tabular-nums dark:text-zinc-600">
                                                        {String(
                                                            index + 1,
                                                        ).padStart(2, '0')}
                                                    </span>
                                                </div>
                                                <div className="flex flex-1 flex-col gap-1.5">
                                                    <input
                                                        type="text"
                                                        placeholder="Nama anggota..."
                                                        value={member.name}
                                                        onChange={(e) =>
                                                            handleTeamChange(
                                                                index,
                                                                'name',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className={inputClass}
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Tugas (cth: Ventilasi)"
                                                        value={member.role}
                                                        onChange={(e) =>
                                                            handleTeamChange(
                                                                index,
                                                                'role',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className={inputClass}
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeTeamMember(index)
                                                    }
                                                    disabled={team.length === 1}
                                                    className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-gray-300 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30 dark:text-zinc-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                                                >
                                                    <svg
                                                        className="h-4 w-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addTeamMember}
                                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-200 py-2.5 text-xs font-bold tracking-wider text-blue-500 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 dark:border-blue-500/20 dark:text-blue-400 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/10"
                                    >
                                        Tambah Anggota
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Sisa Kode di Bawahnya (Audio, Dokumentasi Card, Tab Switcher, Notes) Sama Persis Seperti Aslinya ── */}
                    {/* ... Biar cepat bisa dipertahankan sama persis dari kode aslinya, aku taruh potongannya di sini */}

                    {sessionData.audio_path && (
                        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-white/5 dark:bg-[#1C1F2A]">
                            <div className="flex items-center gap-2.5 border-b border-gray-100 px-5 py-3.5 dark:border-white/5">
                                <span className="text-xs font-bold tracking-widest text-blue-600 uppercase dark:text-blue-400">
                                    Rekaman Asli
                                </span>
                            </div>
                            <div className="p-4">
                                <audio
                                    controls
                                    className="h-10 w-full rounded-xl bg-gray-50 outline-none dark:bg-white/5"
                                >
                                    <source
                                        src={`/storage/${sessionData.audio_path}`}
                                        type="audio/webm"
                                    />
                                </audio>
                            </div>
                        </div>
                    )}

                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-white/5 dark:bg-[#1C1F2A]">
                        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3.5 dark:border-white/5">
                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                                Ringkasan Dokumentasi Code Blue
                            </p>
                        </div>
                        {/* Tab mobile */}
                        <div className="flex border-b border-gray-100 lg:hidden dark:border-white/5">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex-1 py-2.5 text-xs font-bold transition-colors ${activeTab === tab.key ? `${tab.color} border-b-2 ${tab.activeBg.replace('bg-', 'border-')}` : 'text-gray-400 dark:text-zinc-500'}`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="p-4 lg:p-5">
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
                                {/* 1. Pengkajian */}
                                <div
                                    className={`${activeTab !== 'pengkajian' ? 'hidden lg:block' : ''} overflow-hidden rounded-xl border border-blue-100 dark:border-blue-900/30`}
                                >
                                    <div className="border-b border-blue-100 bg-blue-600 px-4 py-2.5 dark:border-blue-900/30">
                                        <p className="text-center text-xs font-bold tracking-widest text-white uppercase">
                                            1. Pengkajian
                                        </p>
                                    </div>
                                    <div className="space-y-4 p-4">
                                        <div>
                                            <label className="mb-1.5 block text-xs font-bold text-blue-700 dark:text-blue-400">
                                                A. Kondisi Pasien
                                            </label>
                                            <textarea
                                                value={
                                                    data.assessment_condition
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        'assessment_condition',
                                                        e.target.value,
                                                    )
                                                }
                                                className={textareaClass}
                                                rows={3}
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2.5 block text-xs font-bold text-blue-700 dark:text-blue-400">
                                                B. TTV Awal
                                            </label>
                                            <div className="space-y-2">
                                                <TtvRow
                                                    label="Pukul"
                                                    value={data.ttv_time}
                                                    onChange={(v) =>
                                                        setData('ttv_time', v)
                                                    }
                                                />
                                                <TtvRow
                                                    label="TD"
                                                    value={data.ttv_td}
                                                    unit="mmHg"
                                                    onChange={(v) =>
                                                        setData('ttv_td', v)
                                                    }
                                                />
                                                <TtvRow
                                                    label="Nadi"
                                                    value={data.ttv_nadi}
                                                    unit="x/mnt"
                                                    onChange={(v) =>
                                                        setData('ttv_nadi', v)
                                                    }
                                                />
                                                <TtvRow
                                                    label="RR"
                                                    value={data.ttv_rr}
                                                    unit="x/mnt"
                                                    onChange={(v) =>
                                                        setData('ttv_rr', v)
                                                    }
                                                />
                                                <TtvRow
                                                    label="SpO₂"
                                                    value={data.ttv_spo2}
                                                    unit="%"
                                                    onChange={(v) =>
                                                        setData('ttv_spo2', v)
                                                    }
                                                />
                                                <TtvRow
                                                    label="Kesadaran"
                                                    value={data.ttv_gcs}
                                                    onChange={(v) =>
                                                        setData('ttv_gcs', v)
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Tindakan */}
                                <div
                                    className={`${activeTab !== 'tindakan' ? 'hidden lg:flex' : 'flex'} flex-col overflow-hidden rounded-xl border border-emerald-100 dark:border-emerald-900/30`}
                                >
                                    <div className="flex-shrink-0 border-b border-emerald-100 bg-emerald-600 px-4 py-2.5 dark:border-emerald-900/30">
                                        <p className="text-center text-xs font-bold tracking-widest text-white uppercase">
                                            2. Tindakan
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2 dark:border-white/5">
                                        <span className="text-xs text-gray-400 dark:text-zinc-500">
                                            Log tindakan
                                        </span>
                                        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                                            {tindakanLogs.length} entri
                                        </span>
                                    </div>
                                    <div className="max-h-[380px] overflow-y-auto lg:max-h-none lg:flex-1">
                                        {tindakanLogs.length === 0 ? (
                                            <div className="flex h-32 items-center justify-center text-xs text-gray-400 dark:text-zinc-500">
                                                Belum ada tindakan tercatat
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-gray-50 dark:divide-white/[0.04]">
                                                {data.logs.map(
                                                    (log: any, idx: number) =>
                                                        log.category ===
                                                        'tindakan' ? (
                                                            <div
                                                                key={idx}
                                                                className="group flex items-start gap-2 px-4 py-2.5 transition hover:bg-gray-50/80 dark:hover:bg-white/[0.02]"
                                                            >
                                                                <span className="mt-1.5 w-14 flex-shrink-0 font-mono text-[11px] font-bold text-gray-400 dark:text-zinc-500">
                                                                    {
                                                                        log.time_mark
                                                                    }
                                                                </span>
                                                                <textarea
                                                                    rows={2}
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
                                                                    className="min-w-0 flex-1 resize-none rounded-lg border border-transparent bg-transparent px-1.5 py-1 text-sm text-gray-800 transition outline-none focus:border-emerald-300 focus:bg-emerald-50/50 focus:ring-0 dark:text-zinc-200 dark:focus:border-emerald-700 dark:focus:bg-emerald-900/10"
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
                                                                        className="mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-gray-300 opacity-0 transition group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 dark:text-zinc-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                                                                    >
                                                                        <svg
                                                                            className="h-3.5 w-3.5"
                                                                            fill="none"
                                                                            stroke="currentColor"
                                                                            strokeWidth="2"
                                                                            viewBox="0 0 24 24"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                            />
                                                                        </svg>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ) : null,
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 3. Evaluasi */}
                                <div
                                    className={`${activeTab !== 'evaluasi' ? 'hidden lg:block' : ''} overflow-hidden rounded-xl border border-purple-100 dark:border-purple-900/30`}
                                >
                                    <div className="border-b border-purple-100 bg-purple-600 px-4 py-2.5 dark:border-purple-900/30">
                                        <p className="text-center text-xs font-bold tracking-widest text-white uppercase">
                                            3. Evaluasi
                                        </p>
                                    </div>
                                    <div className="space-y-4 p-4">
                                        <div>
                                            <label className="mb-1.5 block text-xs font-bold text-purple-700 dark:text-purple-400">
                                                A. Hasil
                                            </label>
                                            <textarea
                                                value={data.evaluation_result}
                                                onChange={(e) =>
                                                    setData(
                                                        'evaluation_result',
                                                        e.target.value,
                                                    )
                                                }
                                                className={textareaClass}
                                                rows={4}
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-xs font-bold text-purple-700 dark:text-purple-400">
                                                B. Rencana Tindak Lanjut
                                            </label>
                                            <textarea
                                                value={data.evaluation_plan}
                                                onChange={(e) =>
                                                    setData(
                                                        'evaluation_plan',
                                                        e.target.value,
                                                    )
                                                }
                                                className={textareaClass}
                                                rows={4}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── CATATAN TAMBAHAN + SUBMIT ── */}
                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-white/5 dark:bg-[#1C1F2A]">
                        <div className="border-b border-gray-100 px-5 py-3.5 dark:border-white/5">
                            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase dark:text-zinc-500">
                                Catatan Tambahan
                            </p>
                        </div>
                        <div className="p-5">
                            <textarea
                                value={data.additional_notes}
                                onChange={(e) =>
                                    setData('additional_notes', e.target.value)
                                }
                                className={textareaClass}
                                rows={3}
                                placeholder="Contoh: Pasien ROSC tercapai pada 09.24.10..."
                            />
                        </div>
                        <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-5 py-4 dark:border-white/5">
                            <Link
                                href="/dashboard"
                                className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-600 transition hover:bg-gray-50 active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
                            >
                                Batal
                            </Link>
                            {sessionData.status === 'draft' && (
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-200/50 transition hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-60 dark:shadow-emerald-900/20"
                                >
                                    {processing
                                        ? 'Menyimpan...'
                                        : 'Validasi & Finalisasi'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </form>

            {/* ── DEBUG LOG MODAL ── */}
            {showLogModal && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center">
                    <div className="w-full max-w-xl overflow-hidden rounded-t-2xl border border-zinc-800 bg-[#0F1117] shadow-2xl sm:rounded-2xl">
                        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
                            <div className="flex items-center gap-2.5">
                                <svg
                                    className="h-4 w-4 text-zinc-500"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                                    />
                                </svg>
                                <span className="font-mono text-xs font-bold tracking-widest text-zinc-300 uppercase">
                                    STT Debug Log — Sesi #{sessionData.id}
                                </span>
                            </div>
                            <button
                                onClick={() => setShowLogModal(false)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-300"
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
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="h-80 overflow-y-auto p-4">
                            {isLoadingLogs ? (
                                <div className="flex h-full items-center justify-center">
                                    <p className="animate-pulse font-mono text-xs text-zinc-600">
                                        Mengambil log dari database...
                                    </p>
                                </div>
                            ) : debugLogs.length === 0 ? (
                                <div className="flex h-full items-center justify-center">
                                    <p className="font-mono text-xs text-zinc-700">
                                        Belum ada data log untuk sesi ini.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-0.5">
                                    {debugLogs.map((log: any, i: number) => (
                                        <div
                                            key={i}
                                            className="flex gap-2 font-mono text-[11px]"
                                        >
                                            <span className="flex-shrink-0 text-zinc-700">
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
