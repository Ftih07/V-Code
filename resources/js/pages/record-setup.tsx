import { Head, useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';
import AppLayout from '@/layouts/new-app-layout';

export default function RecordSetup() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        rm_number: '',
        ward_location: '',
        incident_type: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/record/setup');
    };

    const inputClass =
        'w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-blue-500 dark:focus:bg-white/10 dark:focus:ring-blue-500/20';

    return (
        <>
            <Head title="Setup Code Blue — V-Code" />

            <div className="flex justify-center">
                <div className="w-full max-w-lg">
                    {/* ── PAGE HEADER ── */}
                    <div className="mb-6 flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:border-gray-300 hover:text-gray-700 active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400 dark:hover:text-zinc-200"
                            aria-label="Kembali"
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
                        </button>
                        <div>
                            <h1 className="text-lg font-black tracking-tight text-gray-900 dark:text-white">
                                Setup Code Blue
                            </h1>
                            <p className="text-xs text-gray-400 dark:text-zinc-500">
                                Isi data sebelum memulai perekaman
                            </p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="flex flex-col gap-4">
                        {/* ── SEKSI 1: DATA PASIEN ── */}
                        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-white/5 dark:bg-[#1C1F2A]">
                            <div className="flex items-center gap-2.5 border-b border-gray-100 px-5 py-3.5 dark:border-white/5">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10">
                                    <svg
                                        className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                </div>
                                <span className="text-xs font-bold tracking-widest text-blue-600 uppercase dark:text-blue-400">
                                    Data Pasien
                                </span>
                            </div>

                            <div className="space-y-4 p-5">
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold text-gray-700 dark:text-zinc-300">
                                        Nama Pasien / An.
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Masukkan nama pasien"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        className={inputClass}
                                    />
                                    {errors.name && (
                                        <p className="mt-1.5 text-xs text-red-500">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-bold text-gray-700 dark:text-zinc-300">
                                        No. Rekam Medis
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Contoh: RM-102938"
                                        value={data.rm_number}
                                        onChange={(e) =>
                                            setData('rm_number', e.target.value)
                                        }
                                        className={inputClass}
                                    />
                                    {errors.rm_number && (
                                        <p className="mt-1.5 text-xs text-red-500">
                                            {errors.rm_number}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-bold text-gray-700 dark:text-zinc-300">
                                        Ruangan / Lokasi Kejadian
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Contoh: Bangsal Flamboyan"
                                        value={data.ward_location}
                                        onChange={(e) =>
                                            setData(
                                                'ward_location',
                                                e.target.value,
                                            )
                                        }
                                        className={inputClass}
                                    />
                                    {errors.ward_location && (
                                        <p className="mt-1.5 text-xs text-red-500">
                                            {errors.ward_location}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-bold text-gray-700 dark:text-zinc-300">
                                        Jenis Kejadian
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Contoh: Henti Jantung, Syok Anafilaktik, dll."
                                        value={data.incident_type}
                                        onChange={(e) =>
                                            setData(
                                                'incident_type',
                                                e.target.value,
                                            )
                                        }
                                        className={inputClass}
                                    />
                                    {errors.incident_type && (
                                        <p className="mt-1.5 text-xs text-red-500">
                                            {errors.incident_type}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ── SUBMIT ── */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-blue-600 py-4 text-sm font-bold text-white shadow-lg shadow-blue-200/60 transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60 dark:shadow-blue-900/30"
                        >
                            {processing
                                ? 'Memproses...'
                                : 'Mulai Perekaman Tindakan'}
                        </button>
                        <div className="h-4 md:hidden" />
                    </form>
                </div>
            </div>
        </>
    );
}

RecordSetup.layout = (page: React.ReactNode) => <AppLayout children={page} />;
