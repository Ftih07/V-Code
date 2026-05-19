import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import AppLayout from '@/layouts/new-app-layout';


export default function RecordSetup() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        rm_number: '',
        ward_location: '',
        leader_name: '',
        team_members: '', 
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/record/setup');
    };

    return (
        <div className="relative flex min-h-screen items-start justify-center bg-slate-100 px-0 py-0 dark:bg-zinc-950 md:bg-slate-200/60 md:py-8">
            <Head title="Setup Code Blue - V-CODE" />

            <div className="absolute top-1/4 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-400/10 blur-3xl hidden md:block" />

            {/* Container Utama*/}
            <div className="flex w-full max-w-md min-h-screen md:min-h-[800px] md:max-h-[92vh] flex-col bg-slate-50 dark:bg-zinc-950 md:rounded-3xl md:border md:border-slate-200/80 dark:md:border-zinc-800 md:shadow-2xl overflow-hidden">
                
                <div className="sticky top-0 z-10 flex items-center justify-between bg-gradient-to-r from-blue-900 to-indigo-900 p-4 text-white shadow-md md:rounded-t-2xl">
                    <button 
                        onClick={() => window.history.back()}
                        className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/10 active:scale-95"
                        type="button"
                        aria-label="Kembali"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-base font-bold tracking-wide">Setup Code Blue</h1>
                    <div className="w-9"></div>
                </div>

                <form
                    onSubmit={submit}
                    className="flex flex-1 flex-col overflow-y-auto px-5 py-6 space-y-5"
                >
                    {/* SEKSI 1: IDENTITAS PASIEN */}
                    <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="border-b border-gray-50 pb-2 dark:border-zinc-800/50">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-400">
                                Data Pasien
                            </h3>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-bold text-gray-700 dark:text-zinc-300">
                                Nama Pasien / An.
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Masukkan nama pasien"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full rounded-xl border border-gray-200 bg-slate-50/50 p-3 text-sm text-gray-900 transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-indigo-500"
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs font-medium text-red-500">{errors.name}</p>
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
                                onChange={(e) => setData('rm_number', e.target.value)}
                                className="w-full rounded-xl border border-gray-200 bg-slate-50/50 p-3 text-sm text-gray-900 transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-indigo-500"
                            />
                            {errors.rm_number && (
                                <p className="mt-1 text-xs font-medium text-red-500">{errors.rm_number}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-bold text-gray-700 dark:text-zinc-300">
                                Ruangan / Lokasi Kejadian
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Contoh: ICAL / Bangsal Flamboyan"
                                value={data.ward_location}
                                onChange={(e) => setData('ward_location', e.target.value)}
                                className="w-full rounded-xl border border-gray-200 bg-slate-50/50 p-3 text-sm text-gray-900 transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-indigo-500"
                            />
                            {errors.ward_location && (
                                <p className="mt-1 text-xs font-medium text-red-500">{errors.ward_location}</p>
                            )}
                        </div>
                    </div>

                    {/* SEKSI 2: INFORMASI TIM PELAKSANA */}
                    <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="border-b border-gray-50 pb-2 dark:border-zinc-800/50">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-400">
                                Tim Respon Code Blue
                            </h3>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-bold text-gray-700 dark:text-zinc-300">
                                Leader (Dokter Jaga)
                            </label>
                            <input
                                type="text"
                                required
                                value={data.leader_name}
                                onChange={(e) => setData('leader_name', e.target.value)}
                                placeholder="Contoh: dr. Andi Pratama"
                                className="w-full rounded-xl border border-gray-200 bg-slate-50/50 p-3 text-sm text-gray-900 transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-indigo-500"
                            />
                            {errors.leader_name && (
                                <p className="mt-1 text-xs font-medium text-red-500">{errors.leader_name}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-bold text-gray-700 dark:text-zinc-300">
                                Anggota Respon <span className="text-gray-400 font-normal">(Pisahkan dengan koma)</span>
                            </label>
                            <textarea
                                required
                                value={data.team_members}
                                onChange={(e) => setData('team_members', e.target.value)}
                                placeholder="Contoh: Ns. Budi Santoso, Ns. Dwi Lestari"
                                className="h-24 w-full resize-none rounded-xl border border-gray-200 bg-slate-50/50 p-3 text-sm text-gray-900 transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-indigo-500"
                            />
                            {errors.team_members && (
                                <p className="mt-1 text-xs font-medium text-red-500">{errors.team_members}</p>
                            )}
                        </div>
                    </div>

                    {/* Tombol Submit */}
                    <div className="mt-auto pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-900 to-indigo-900 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-900/10 transition hover:from-blue-800 hover:to-indigo-800 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
                        >
                            {processing ? (
                                <span className="flex items-center gap-2">
                                    <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0114-4.9l1.4-1.4A9.9 9.9 0 003.1 11.5H4z" />
                                    </svg>
                                    Memproses...
                                </span>
                            ) : (
                                'Mulai Perekaman Tindakan'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

RecordSetup.layout = (page: React.ReactNode) => <AppLayout children={page} />;