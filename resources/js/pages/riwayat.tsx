import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import NewAppLayout from '@/layouts/new-app-layout';

interface RiwayatProps {
    sessions: any[];
    incidentTypes: string[];
    filters: any;
}

export default function Riwayat({
    sessions,
    incidentTypes,
    filters,
}: RiwayatProps) {
    const [search, setSearch] = useState(filters?.search || '');
    const [incidentType, setIncidentType] = useState(
        filters?.incident_type || '',
    );
    const [status, setStatus] = useState(filters?.status || '');
    const [dateFilter, setDateFilter] = useState(filters?.date_filter || '');
    const [hasAudio, setHasAudio] = useState(filters?.has_audio === 'true');
    const [showFilter, setShowFilter] = useState(false);

    // Hitung jumlah filter aktif (selain search)
    const activeFilterCount = [
        incidentType,
        status,
        dateFilter,
        hasAudio ? 'true' : '',
    ].filter(Boolean).length;

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(
                '/riwayat',
                {
                    search,
                    incident_type: incidentType,
                    status,
                    date_filter: dateFilter,
                    has_audio: hasAudio ? 'true' : '',
                },
                { preserveState: true, preserveScroll: true, replace: true },
            );
        }, 300);

        return () => clearTimeout(timeout);
    }, [search, incidentType, status, dateFilter, hasAudio]);

    const resetFilters = () => {
        setSearch('');
        setIncidentType('');
        setStatus('');
        setDateFilter('');
        setHasAudio(false);
    };

    const selectClass =
        'w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:focus:border-blue-500 dark:focus:bg-white/10';

    return (
        <>
            <Head title="Riwayat Dokumentasi — V-Code" />

            <div className="flex flex-col gap-5">
                {/* ── PAGE HEADER ── */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
                            Riwayat
                        </h1>
                        <p className="text-xs text-gray-400 dark:text-zinc-500">
                            {sessions.length} dokumentasi ditemukan
                        </p>
                    </div>

                    {/* Filter toggle button */}
                    <button
                        type="button"
                        onClick={() => setShowFilter((v) => !v)}
                        className={`relative flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-bold transition ${
                            showFilter || activeFilterCount > 0
                                ? 'border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-800/40 dark:bg-blue-500/10 dark:text-blue-400'
                                : 'border-gray-200 bg-white text-gray-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-zinc-400'
                        }`}
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
                                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0014 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 018 21v-7.586a1 1 0 00-.293-.707L1.293 6.707A1 1 0 011 6V4z"
                            />
                        </svg>
                        Filter
                        {activeFilterCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-black text-white">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* ── SEARCH BAR ── */}
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
                        <svg
                            className="h-4 w-4 text-gray-400 dark:text-zinc-500"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
                            />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Cari nama pasien..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-2xl border border-gray-200 bg-white py-3 pr-4 pl-10 text-sm text-gray-800 shadow-sm transition outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-white/10 dark:bg-[#1C1F2A] dark:text-zinc-200 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch('')}
                            className="absolute inset-y-0 right-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:text-zinc-500"
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
                    )}
                </div>

                {/* ── FILTER PANEL (collapsible) ── */}
                {showFilter && (
                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-white/5 dark:bg-[#1C1F2A]">
                        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-white/5">
                            <span className="text-xs font-bold tracking-widest text-gray-400 uppercase dark:text-zinc-500">
                                Filter
                            </span>
                            {activeFilterCount > 0 && (
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="text-xs font-bold text-red-500 hover:text-red-600 dark:text-red-400"
                                >
                                    Reset semua
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
                            {/* Waktu */}
                            <div>
                                <label className="mb-1.5 block text-xs font-bold text-gray-500 dark:text-zinc-400">
                                    Waktu
                                </label>
                                <select
                                    value={dateFilter}
                                    onChange={(e) =>
                                        setDateFilter(e.target.value)
                                    }
                                    className={selectClass}
                                >
                                    <option value="">Semua Waktu</option>
                                    <option value="today">Hari Ini</option>
                                    <option value="this_week">
                                        Minggu Ini
                                    </option>
                                </select>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="mb-1.5 block text-xs font-bold text-gray-500 dark:text-zinc-400">
                                    Status
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className={selectClass}
                                >
                                    <option value="">Semua Status</option>
                                    <option value="draft">
                                        Menunggu Validasi
                                    </option>
                                    <option value="finalized">
                                        Terfinalisasi
                                    </option>
                                </select>
                            </div>

                            {/* Jenis Kejadian */}
                            <div>
                                <label className="mb-1.5 block text-xs font-bold text-gray-500 dark:text-zinc-400">
                                    Jenis Kejadian
                                </label>
                                <select
                                    value={incidentType}
                                    onChange={(e) =>
                                        setIncidentType(e.target.value)
                                    }
                                    className={selectClass}
                                >
                                    <option value="">Semua Jenis</option>
                                    {incidentTypes?.map((type, i) => (
                                        <option key={i} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Toggle Audio */}
                            <div>
                                <label className="mb-1.5 block text-xs font-bold text-gray-500 dark:text-zinc-400">
                                    Rekaman
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setHasAudio((v) => !v)}
                                    className={`flex w-full items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition ${
                                        hasAudio
                                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-500/10 dark:text-emerald-400'
                                            : 'border-gray-200 bg-gray-50 text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400'
                                    }`}
                                >
                                    <div
                                        className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition ${hasAudio ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300 dark:border-zinc-600'}`}
                                    >
                                        {hasAudio && (
                                            <svg
                                                className="h-3 w-3 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="3"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        )}
                                    </div>
                                    Ada Rekaman Audio
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── SESSION LIST ── */}
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-white/5 dark:bg-[#1C1F2A]">
                    {sessions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 dark:bg-white/5">
                                <svg
                                    className="h-7 w-7 text-gray-300 dark:text-zinc-600"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                    />
                                </svg>
                            </div>
                            <p className="text-sm font-semibold text-gray-400 dark:text-zinc-500">
                                Tidak ada riwayat yang cocok
                            </p>
                            <p className="mt-1 text-xs text-gray-300 dark:text-zinc-600">
                                Coba ubah filter pencarian
                            </p>
                            {(search || activeFilterCount > 0) && (
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="mt-4 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-600 transition hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
                                >
                                    Reset Filter
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50 dark:divide-white/[0.04]">
                            {sessions.map((s) => (
                                <div
                                    key={s.id}
                                    onClick={() => router.get(`/draft/${s.id}`)}
                                    className="group flex cursor-pointer items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]"
                                >
                                    {/* Left */}
                                    <div className="flex min-w-0 items-center gap-3.5">
                                        {/* Avatar icon */}
                                        <div
                                            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${s.status === 'draft' ? 'bg-amber-50 dark:bg-amber-500/10' : 'bg-emerald-50 dark:bg-emerald-500/10'}`}
                                        >
                                            {s.status === 'draft' ? (
                                                <svg
                                                    className="h-5 w-5 text-amber-500"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg
                                                    className="h-5 w-5 text-emerald-500"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-bold text-gray-800 transition-colors group-hover:text-blue-600 dark:text-zinc-200 dark:group-hover:text-blue-400">
                                                {s.patient?.name ||
                                                    'Tanpa Nama'}
                                            </p>
                                            <div className="mt-0.5 flex flex-wrap items-center gap-2">
                                                <span className="truncate text-xs font-medium text-blue-600 dark:text-blue-400">
                                                    {s.incident_type}
                                                </span>
                                                {s.audio_path && (
                                                    <span className="flex flex-shrink-0 items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                                                        <svg
                                                            className="h-2.5 w-2.5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                                                            />
                                                        </svg>
                                                        Audio
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right */}
                                    <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
                                        <span className="text-[11px] font-medium text-gray-400 dark:text-zinc-500">
                                            {new Date(
                                                s.created_at,
                                            ).toLocaleDateString('id-ID', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </span>
                                        <span
                                            className={`rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                                                s.status === 'draft'
                                                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                                                    : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                                            }`}
                                        >
                                            {s.status === 'draft'
                                                ? 'Draft'
                                                : 'Final'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Bottom spacer for mobile */}
                <div className="h-4 md:h-0" />
            </div>
        </>
    );
}

// Tambahkan ini di baris paling bawah, di luar function Riwayat
Riwayat.layout = (page: React.ReactNode) => <NewAppLayout children={page} />;